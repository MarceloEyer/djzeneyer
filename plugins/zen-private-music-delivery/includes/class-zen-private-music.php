<?php
/**
 * Private music delivery plugin.
 *
 * @package Zen_Private_Music
 */

if (!defined('ABSPATH')) {
	exit;
}

class Zen_Private_Music {
	private const POST_TYPE = 'zen_private_track';
	private const META_FILE_PATH = '_zen_private_music_file_path';
	private const META_FILE_NAME = '_zen_private_music_file_name';
	private const META_FILE_SIZE = '_zen_private_music_file_size';
	private const META_AVAILABLE = '_zen_private_music_available';
	private const META_RECIPIENTS = '_zen_private_music_recipients';
	private const META_DJ_GROUP = '_zen_private_music_dj_group';
	private const USER_META_DJ = 'zen_receives_dj_music';
	private const USER_META_PENDING = 'zen_private_music_invite_pending';

	public static function init(): void {
		add_action('init', [__CLASS__, 'register_post_type']);
		add_action('admin_menu', [__CLASS__, 'register_admin_menu']);
		add_action('admin_post_zen_private_music_upload', [__CLASS__, 'handle_upload']);
		add_action('admin_post_zen_private_music_save_track', [__CLASS__, 'handle_save_track']);
		add_action('admin_post_zen_private_music_delete_track', [__CLASS__, 'handle_delete_track']);
		add_action('admin_post_zen_private_music_create_recipient', [__CLASS__, 'handle_create_recipient']);
		add_action('admin_post_zen_private_music_generate_invite', [__CLASS__, 'handle_generate_invite']);
		add_action('admin_post_zen_private_music_toggle_dj', [__CLASS__, 'handle_toggle_dj']);
		add_action('rest_api_init', [__CLASS__, 'register_rest_routes']);
		add_action('password_reset', [__CLASS__, 'clear_pending_invite'], 10, 2);
		add_filter('authenticate', [__CLASS__, 'block_pending_invite_login'], 30, 3);
	}

	public static function activate(): void {
		self::register_post_type();
		self::ensure_private_storage();
		flush_rewrite_rules();
	}

	public static function deactivate(): void {
		flush_rewrite_rules();
	}

	public static function register_post_type(): void {
		register_post_type(self::POST_TYPE, [
			'labels' => [
				'name' => __('Private Music', 'zen-private-music'),
				'singular_name' => __('Private Track', 'zen-private-music'),
			],
			'public' => false,
			'show_ui' => false,
			'supports' => ['title'],
			'capability_type' => 'post',
		]);
	}

	public static function register_rest_routes(): void {
		register_rest_route('zen-private-music/v1', '/tracks', [
			'methods' => WP_REST_Server::READABLE,
			'callback' => [__CLASS__, 'rest_list_tracks'],
			'permission_callback' => [__CLASS__, 'rest_is_authenticated'],
		]);

		register_rest_route('zen-private-music/v1', '/tracks/(?P<id>\d+)/download', [
			'methods' => WP_REST_Server::READABLE,
			'callback' => [__CLASS__, 'rest_download_track'],
			'permission_callback' => [__CLASS__, 'rest_is_authenticated'],
			'args' => [
				'id' => [
					'type' => 'integer',
					'required' => true,
					'sanitize_callback' => 'absint',
				],
			],
		]);
	}

	public static function rest_is_authenticated(WP_REST_Request $request): bool {
		return self::get_user_id_from_bearer($request) > 0;
	}

	public static function rest_list_tracks(WP_REST_Request $request) {
		$user_id = self::get_user_id_from_bearer($request);
		if (!$user_id) {
			return new WP_Error('unauthorized', __('Unauthorized', 'zen-private-music'), ['status' => 401]);
		}

		nocache_headers();

		$query = new WP_Query([
			'post_type' => self::POST_TYPE,
			'post_status' => 'publish',
			'posts_per_page' => 100,
			'orderby' => 'title',
			'order' => 'ASC',
			'no_found_rows' => true,
		]);

		$tracks = [];
		foreach ($query->posts as $post) {
			if (!self::user_can_access_track($user_id, (int) $post->ID)) {
				continue;
			}

			$tracks[] = self::format_track((int) $post->ID);
		}

		return rest_ensure_response([
			'success' => true,
			'data' => $tracks,
		]);
	}

	public static function rest_download_track(WP_REST_Request $request) {
		$user_id = self::get_user_id_from_bearer($request);
		$track_id = absint($request->get_param('id'));

		if (!$user_id) {
			return new WP_Error('unauthorized', __('Unauthorized', 'zen-private-music'), ['status' => 401]);
		}

		if (!self::user_can_access_track($user_id, $track_id)) {
			return new WP_Error('forbidden', __('You do not have access to this track.', 'zen-private-music'), ['status' => 403]);
		}

		$file_path = (string) get_post_meta($track_id, self::META_FILE_PATH, true);
		if (!self::is_safe_private_file($file_path)) {
			return new WP_Error('file_not_found', __('Private file not found.', 'zen-private-music'), ['status' => 404]);
		}

		nocache_headers();
		header('Content-Type: audio/mpeg');
		header('Content-Length: ' . (string) filesize($file_path));
		header('Content-Disposition: attachment; filename="' . esc_attr(basename($file_path)) . '"');
		header('X-Content-Type-Options: nosniff');
		readfile($file_path);
		exit;
	}

	public static function register_admin_menu(): void {
		add_menu_page(
			__('Private Music', 'zen-private-music'),
			__('Private Music', 'zen-private-music'),
			'manage_options',
			'zen-private-music',
			[__CLASS__, 'render_admin_page'],
			'dashicons-format-audio',
			58
		);
	}

	public static function render_admin_page(): void {
		if (!current_user_can('manage_options')) {
			wp_die(esc_html__('Access denied.', 'zen-private-music'));
		}

		$users = get_users([
			'orderby' => 'display_name',
			'order' => 'ASC',
			'fields' => ['ID', 'user_login', 'display_name', 'user_email'],
		]);
		$tracks = get_posts([
			'post_type' => self::POST_TYPE,
			'post_status' => ['publish', 'draft'],
			'posts_per_page' => 100,
			'orderby' => 'title',
			'order' => 'ASC',
		]);
		$notice = isset($_GET['zen_notice']) ? sanitize_key(wp_unslash($_GET['zen_notice'])) : '';
		$invite = isset($_GET['invite_url']) ? esc_url_raw(wp_unslash($_GET['invite_url'])) : '';
		?>
		<div class="wrap">
			<h1><?php echo esc_html__('Private Music Delivery', 'zen-private-music'); ?></h1>
			<?php if ($notice) : ?>
				<div class="notice notice-success"><p><?php echo esc_html(self::notice_message($notice)); ?></p></div>
			<?php endif; ?>
			<?php if ($invite) : ?>
				<div class="notice notice-info">
					<p><strong><?php echo esc_html__('Activation link:', 'zen-private-music'); ?></strong></p>
					<input type="text" class="large-text" readonly value="<?php echo esc_attr($invite); ?>" onclick="this.select();" />
				</div>
			<?php endif; ?>

			<h2><?php echo esc_html__('Recipients', 'zen-private-music'); ?></h2>
			<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width: 760px;">
				<input type="hidden" name="action" value="zen_private_music_create_recipient" />
				<?php wp_nonce_field('zen_private_music_create_recipient'); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th><label for="zen_username"><?php echo esc_html__('Username', 'zen-private-music'); ?></label></th>
						<td><input required id="zen_username" name="username" type="text" class="regular-text" /></td>
					</tr>
					<tr>
						<th><label for="zen_display_name"><?php echo esc_html__('Display name', 'zen-private-music'); ?></label></th>
						<td><input required id="zen_display_name" name="display_name" type="text" class="regular-text" /></td>
					</tr>
					<tr>
						<th><label for="zen_initial_password"><?php echo esc_html__('Initial password', 'zen-private-music'); ?></label></th>
						<td><input id="zen_initial_password" name="initial_password" type="text" class="regular-text" /> <p class="description"><?php echo esc_html__('Leave blank to create an activation link instead of an immediately usable password.', 'zen-private-music'); ?></p></td>
					</tr>
					<tr>
						<th><?php echo esc_html__('DJ delivery group', 'zen-private-music'); ?></th>
						<td><label><input name="receives_dj_music" type="checkbox" value="1" /> <?php echo esc_html__('Receives music for DJs', 'zen-private-music'); ?></label></td>
					</tr>
				</table>
				<?php submit_button(__('Create recipient', 'zen-private-music')); ?>
			</form>

			<table class="widefat striped" style="max-width: 1000px;">
				<thead><tr><th><?php echo esc_html__('User', 'zen-private-music'); ?></th><th><?php echo esc_html__('Email', 'zen-private-music'); ?></th><th><?php echo esc_html__('DJ group', 'zen-private-music'); ?></th><th><?php echo esc_html__('Actions', 'zen-private-music'); ?></th></tr></thead>
				<tbody>
				<?php foreach ($users as $user) : ?>
					<tr>
						<td><?php echo esc_html($user->display_name ?: $user->user_login); ?> <code><?php echo esc_html($user->user_login); ?></code></td>
						<td><?php echo esc_html($user->user_email); ?></td>
						<td><?php echo get_user_meta($user->ID, self::USER_META_DJ, true) === '1' ? esc_html__('Yes', 'zen-private-music') : esc_html__('No', 'zen-private-music'); ?></td>
						<td>
							<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline;">
								<input type="hidden" name="action" value="zen_private_music_toggle_dj" />
								<input type="hidden" name="user_id" value="<?php echo esc_attr((string) $user->ID); ?>" />
								<?php wp_nonce_field('zen_private_music_toggle_dj_' . $user->ID); ?>
								<?php submit_button(get_user_meta($user->ID, self::USER_META_DJ, true) === '1' ? __('Remove DJ access', 'zen-private-music') : __('Mark as DJ recipient', 'zen-private-music'), 'secondary small', 'submit', false); ?>
							</form>
							<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline;">
								<input type="hidden" name="action" value="zen_private_music_generate_invite" />
								<input type="hidden" name="user_id" value="<?php echo esc_attr((string) $user->ID); ?>" />
								<?php wp_nonce_field('zen_private_music_generate_invite_' . $user->ID); ?>
								<?php submit_button(__('Generate activation link', 'zen-private-music'), 'secondary small', 'submit', false); ?>
							</form>
						</td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>

			<h2><?php echo esc_html__('Upload MP3s', 'zen-private-music'); ?></h2>
			<form method="post" enctype="multipart/form-data" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width: 900px;">
				<input type="hidden" name="action" value="zen_private_music_upload" />
				<?php wp_nonce_field('zen_private_music_upload'); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th><label for="zen_music_files"><?php echo esc_html__('MP3 files', 'zen-private-music'); ?></label></th>
						<td><input required id="zen_music_files" name="music_files[]" type="file" accept="audio/mpeg,.mp3" multiple /></td>
					</tr>
					<tr>
						<th><?php echo esc_html__('Recipients', 'zen-private-music'); ?></th>
						<td><?php self::render_user_checkboxes($users, []); ?></td>
					</tr>
					<tr>
						<th><?php echo esc_html__('DJ group', 'zen-private-music'); ?></th>
						<td><label><input name="dj_group" type="checkbox" value="1" /> <?php echo esc_html__('Available to all users marked "Receives music for DJs"', 'zen-private-music'); ?></label></td>
					</tr>
				</table>
				<?php submit_button(__('Upload tracks', 'zen-private-music')); ?>
			</form>

			<h2><?php echo esc_html__('Tracks', 'zen-private-music'); ?></h2>
			<?php foreach ($tracks as $track) : ?>
				<?php self::render_track_form($track, $users); ?>
			<?php endforeach; ?>
		</div>
		<?php
	}

	private static function render_track_form(WP_Post $track, array $users): void {
		$track_id = (int) $track->ID;
		$recipients = self::get_track_recipient_ids($track_id);
		$available = get_post_meta($track_id, self::META_AVAILABLE, true) === '1';
		$dj_group = get_post_meta($track_id, self::META_DJ_GROUP, true) === '1';
		?>
		<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="card" style="max-width: 1000px; padding: 16px; margin: 0 0 16px;">
			<input type="hidden" name="action" value="zen_private_music_save_track" />
			<input type="hidden" name="track_id" value="<?php echo esc_attr((string) $track_id); ?>" />
			<?php wp_nonce_field('zen_private_music_save_track_' . $track_id); ?>
			<p>
				<label><strong><?php echo esc_html__('Title', 'zen-private-music'); ?></strong><br />
				<input name="title" type="text" class="large-text" value="<?php echo esc_attr(get_the_title($track)); ?>" /></label>
			</p>
			<p><label><input name="available" type="checkbox" value="1" <?php checked($available); ?> /> <?php echo esc_html__('Available', 'zen-private-music'); ?></label></p>
			<p><label><input name="dj_group" type="checkbox" value="1" <?php checked($dj_group); ?> /> <?php echo esc_html__('Available to DJ delivery group', 'zen-private-music'); ?></label></p>
			<p><strong><?php echo esc_html__('Individual recipients', 'zen-private-music'); ?></strong></p>
			<?php self::render_user_checkboxes($users, $recipients); ?>
			<?php submit_button(__('Save track', 'zen-private-music'), 'primary', 'submit', false); ?>
		</form>
		<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="margin: -12px 0 24px 16px;">
			<input type="hidden" name="action" value="zen_private_music_delete_track" />
			<input type="hidden" name="track_id" value="<?php echo esc_attr((string) $track_id); ?>" />
			<?php wp_nonce_field('zen_private_music_delete_track_' . $track_id); ?>
			<?php submit_button(__('Delete track and private file', 'zen-private-music'), 'delete small', 'submit', false); ?>
		</form>
		<?php
	}

	private static function render_user_checkboxes(array $users, array $selected): void {
		echo '<div style="columns: 2; max-width: 760px;">';
		foreach ($users as $user) {
			printf(
				'<label style="display:block; break-inside: avoid; margin: 0 0 6px;"><input type="checkbox" name="recipients[]" value="%d" %s /> %s <code>%s</code></label>',
				(int) $user->ID,
				checked(in_array((int) $user->ID, $selected, true), true, false),
				esc_html($user->display_name ?: $user->user_login),
				esc_html($user->user_login)
			);
		}
		echo '</div>';
	}

	public static function handle_upload(): void {
		self::require_admin_action('zen_private_music_upload');
		$recipients = self::sanitize_id_list($_POST['recipients'] ?? []);
		$dj_group = !empty($_POST['dj_group']) ? '1' : '0';
		$files = self::normalize_files_array($_FILES['music_files'] ?? []);

		foreach ($files as $file) {
			if (!isset($file['tmp_name'], $file['name']) || !is_uploaded_file($file['tmp_name'])) {
				continue;
			}
			$saved = self::save_uploaded_mp3($file);
			if (is_wp_error($saved)) {
				continue;
			}
			$title = self::title_from_filename($saved['name']);
			$track_id = wp_insert_post([
				'post_type' => self::POST_TYPE,
				'post_status' => 'publish',
				'post_title' => $title,
			], true);
			if (is_wp_error($track_id)) {
				@unlink($saved['path']);
				continue;
			}
			update_post_meta($track_id, self::META_FILE_PATH, $saved['path']);
			update_post_meta($track_id, self::META_FILE_NAME, $saved['name']);
			update_post_meta($track_id, self::META_FILE_SIZE, (string) $saved['size']);
			update_post_meta($track_id, self::META_AVAILABLE, '1');
			update_post_meta($track_id, self::META_RECIPIENTS, $recipients);
			update_post_meta($track_id, self::META_DJ_GROUP, $dj_group);
		}

		self::redirect_admin('tracks_uploaded');
	}

	public static function handle_save_track(): void {
		$track_id = absint($_POST['track_id'] ?? 0);
		self::require_admin_action('zen_private_music_save_track_' . $track_id);
		if (get_post_type($track_id) !== self::POST_TYPE) {
			wp_die(esc_html__('Invalid track.', 'zen-private-music'));
		}

		wp_update_post([
			'ID' => $track_id,
			'post_title' => sanitize_text_field(wp_unslash($_POST['title'] ?? '')),
			'post_status' => !empty($_POST['available']) ? 'publish' : 'draft',
		]);
		update_post_meta($track_id, self::META_AVAILABLE, !empty($_POST['available']) ? '1' : '0');
		update_post_meta($track_id, self::META_DJ_GROUP, !empty($_POST['dj_group']) ? '1' : '0');
		update_post_meta($track_id, self::META_RECIPIENTS, self::sanitize_id_list($_POST['recipients'] ?? []));

		self::redirect_admin('track_saved');
	}

	public static function handle_delete_track(): void {
		$track_id = absint($_POST['track_id'] ?? 0);
		self::require_admin_action('zen_private_music_delete_track_' . $track_id);
		if (get_post_type($track_id) === self::POST_TYPE) {
			$file_path = (string) get_post_meta($track_id, self::META_FILE_PATH, true);
			if (self::is_safe_private_file($file_path)) {
				@unlink($file_path);
			}
			wp_delete_post($track_id, true);
		}
		self::redirect_admin('track_deleted');
	}

	public static function handle_create_recipient(): void {
		self::require_admin_action('zen_private_music_create_recipient');
		$username = sanitize_user(wp_unslash($_POST['username'] ?? ''), true);
		$display_name = sanitize_text_field(wp_unslash($_POST['display_name'] ?? ''));
		$initial_password = trim((string) wp_unslash($_POST['initial_password'] ?? ''));

		if (!$username || !$display_name || username_exists($username)) {
			wp_die(esc_html__('Invalid or duplicate username.', 'zen-private-music'));
		}

		$password = $initial_password !== '' ? $initial_password : wp_generate_password(32, true, true);
		$user_id = wp_insert_user([
			'user_login' => $username,
			'user_pass' => $password,
			'display_name' => $display_name,
			'nickname' => $display_name,
			'role' => get_option('default_role', 'subscriber'),
		]);

		if (is_wp_error($user_id)) {
			wp_die(esc_html($user_id->get_error_message()));
		}

		update_user_meta($user_id, self::USER_META_DJ, !empty($_POST['receives_dj_music']) ? '1' : '0');
		if ($initial_password === '') {
			update_user_meta($user_id, self::USER_META_PENDING, '1');
			$invite_url = self::generate_invite_url((int) $user_id);
			self::redirect_admin('recipient_created', $invite_url);
		}

		delete_user_meta($user_id, self::USER_META_PENDING);
		self::redirect_admin('recipient_created');
	}

	public static function handle_generate_invite(): void {
		$user_id = absint($_POST['user_id'] ?? 0);
		self::require_admin_action('zen_private_music_generate_invite_' . $user_id);
		$invite_url = self::generate_invite_url($user_id);
		self::redirect_admin('invite_generated', $invite_url);
	}

	public static function handle_toggle_dj(): void {
		$user_id = absint($_POST['user_id'] ?? 0);
		self::require_admin_action('zen_private_music_toggle_dj_' . $user_id);
		$current = get_user_meta($user_id, self::USER_META_DJ, true) === '1';
		update_user_meta($user_id, self::USER_META_DJ, $current ? '0' : '1');
		self::redirect_admin('recipient_saved');
	}

	public static function clear_pending_invite(WP_User $user, string $new_pass): void {
		unset($new_pass);
		delete_user_meta($user->ID, self::USER_META_PENDING);
	}

	public static function block_pending_invite_login($user, string $username, string $password) {
		unset($username, $password);
		if ($user instanceof WP_User && get_user_meta($user->ID, self::USER_META_PENDING, true) === '1') {
			return new WP_Error('invite_pending', __('Please activate your account before logging in.', 'zen-private-music'));
		}
		return $user;
	}

	private static function generate_invite_url(int $user_id): string {
		$user = get_userdata($user_id);
		if (!$user) {
			return '';
		}
		update_user_meta($user_id, self::USER_META_PENDING, '1');
		$key = get_password_reset_key($user);
		if (is_wp_error($key)) {
			return '';
		}
		return add_query_arg([
			'action' => 'reset_password',
			'key' => $key,
			'login' => rawurlencode($user->user_login),
		], home_url('/reset-password/'));
	}

	private static function user_can_access_track(int $user_id, int $track_id): bool {
		if (get_post_type($track_id) !== self::POST_TYPE || get_post_meta($track_id, self::META_AVAILABLE, true) !== '1') {
			return false;
		}
		$recipients = self::get_track_recipient_ids($track_id);
		if (in_array($user_id, $recipients, true)) {
			return true;
		}
		return get_post_meta($track_id, self::META_DJ_GROUP, true) === '1'
			&& get_user_meta($user_id, self::USER_META_DJ, true) === '1';
	}

	private static function format_track(int $track_id): array {
		return [
			'id' => $track_id,
			'title' => get_the_title($track_id),
			'file_name' => (string) get_post_meta($track_id, self::META_FILE_NAME, true),
			'file_size' => (int) get_post_meta($track_id, self::META_FILE_SIZE, true),
		];
	}

	private static function get_user_id_from_bearer(WP_REST_Request $request): int {
		$auth_header = $request->get_header('authorization');
		if (!is_string($auth_header) || !preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
			return 0;
		}
		if (!class_exists('\ZenEyer\Auth\Core\JWT_Manager')) {
			return 0;
		}
		$decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($matches[1]);
		if (is_wp_error($decoded)) {
			return 0;
		}
		return isset($decoded->data->user_id) ? (int) $decoded->data->user_id : 0;
	}

	private static function get_track_recipient_ids(int $track_id): array {
		$value = get_post_meta($track_id, self::META_RECIPIENTS, true);
		return self::sanitize_id_list(is_array($value) ? $value : []);
	}

	private static function sanitize_id_list($ids): array {
		if (!is_array($ids)) {
			return [];
		}
		return array_values(array_unique(array_filter(array_map('absint', $ids))));
	}

	private static function save_uploaded_mp3(array $file) {
		if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
			return new WP_Error('upload_error', __('Upload failed.', 'zen-private-music'));
		}
		$check = wp_check_filetype_and_ext($file['tmp_name'], $file['name'], ['mp3' => 'audio/mpeg']);
		if (($check['ext'] ?? '') !== 'mp3') {
			return new WP_Error('invalid_type', __('Only MP3 files are allowed.', 'zen-private-music'));
		}
		$dir = self::ensure_private_storage();
		$name = wp_unique_filename($dir, sanitize_file_name($file['name']));
		$path = trailingslashit($dir) . $name;
		if (!move_uploaded_file($file['tmp_name'], $path)) {
			return new WP_Error('move_failed', __('Could not move uploaded file.', 'zen-private-music'));
		}
		@chmod($path, 0640);
		return [
			'path' => $path,
			'name' => $name,
			'size' => filesize($path) ?: 0,
		];
	}

	private static function ensure_private_storage(): string {
		$dir = trailingslashit(WP_CONTENT_DIR) . 'zen-private-music';
		if (!is_dir($dir)) {
			wp_mkdir_p($dir);
		}
		if (!file_exists(trailingslashit($dir) . '.htaccess')) {
			file_put_contents(trailingslashit($dir) . '.htaccess', "Require all denied\nDeny from all\n");
		}
		if (!file_exists(trailingslashit($dir) . 'index.html')) {
			file_put_contents(trailingslashit($dir) . 'index.html', '');
		}
		return $dir;
	}

	private static function is_safe_private_file(string $file_path): bool {
		$base = realpath(self::ensure_private_storage());
		$real = realpath($file_path);
		return $base && $real && str_starts_with($real, $base . DIRECTORY_SEPARATOR) && is_readable($real);
	}

	private static function normalize_files_array(array $files): array {
		$normalized = [];
		foreach (($files['name'] ?? []) as $index => $name) {
			$normalized[] = [
				'name' => $name,
				'type' => $files['type'][$index] ?? '',
				'tmp_name' => $files['tmp_name'][$index] ?? '',
				'error' => $files['error'][$index] ?? UPLOAD_ERR_NO_FILE,
				'size' => $files['size'][$index] ?? 0,
			];
		}
		return $normalized;
	}

	private static function title_from_filename(string $filename): string {
		$title = preg_replace('/\.mp3$/i', '', $filename);
		$title = str_replace(['-', '_'], ' ', (string) $title);
		return trim(ucwords($title));
	}

	private static function require_admin_action(string $nonce_action): void {
		if (!current_user_can('manage_options')) {
			wp_die(esc_html__('Access denied.', 'zen-private-music'));
		}
		check_admin_referer($nonce_action);
	}

	private static function redirect_admin(string $notice, string $invite_url = ''): void {
		$args = [
			'page' => 'zen-private-music',
			'zen_notice' => $notice,
		];
		if ($invite_url !== '') {
			$args['invite_url'] = rawurlencode($invite_url);
		}
		wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
		exit;
	}

	private static function notice_message(string $notice): string {
		$messages = [
			'tracks_uploaded' => __('Tracks uploaded.', 'zen-private-music'),
			'track_saved' => __('Track saved.', 'zen-private-music'),
			'track_deleted' => __('Track deleted.', 'zen-private-music'),
			'recipient_created' => __('Recipient created.', 'zen-private-music'),
			'recipient_saved' => __('Recipient updated.', 'zen-private-music'),
			'invite_generated' => __('Activation link generated.', 'zen-private-music'),
		];
		return $messages[$notice] ?? __('Saved.', 'zen-private-music');
	}
}
