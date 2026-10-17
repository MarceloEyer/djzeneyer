import fs from 'fs';
import path from 'path';

// Regression for a production incident: the admin settings UI stored
// `token_expiration` meaning days (label + sanitize default) while
// JWT_Manager::get_expiration_minutes() always treated the raw stored
// integer as minutes. A saved value of 7 (intended as "7 days") became
// a 7-minute access-token lifetime, 401ing every authenticated request
// older than ~7 minutes with no frontend refresh to recover.
// This check fails if the two files drift out of the same unit again.

const jwtManagerPath = path.resolve('plugins/zeneyer-auth/includes/Core/class-jwt-manager.php');
const settingsPagePath = path.resolve('plugins/zeneyer-auth/includes/Admin/class-settings-page.php');

const failures = [];

const jwtManager = fs.existsSync(jwtManagerPath) ? fs.readFileSync(jwtManagerPath, 'utf8') : '';
const settingsPage = fs.existsSync(settingsPagePath) ? fs.readFileSync(settingsPagePath, 'utf8') : '';

if (!jwtManager) failures.push(`${jwtManagerPath}: file not found`);
if (!settingsPage) failures.push(`${settingsPagePath}: file not found`);

if (jwtManager && settingsPage) {
  // get_expiration_minutes() must keep treating the stored option as minutes
  // (60 * $expiration_minutes). If this multiplier or comment ever changes to
  // days, the admin field must change units in lockstep — this check only
  // guards the current, intended minutes-based contract.
  if (!jwtManager.includes("60 * \$expiration_minutes")) {
    failures.push(
      'class-jwt-manager.php: expected `60 * $expiration_minutes` (minutes-based token lifetime) — ' +
        'if this changed intentionally, update the settings page label/default and this check together.'
    );
  }

  // The admin field and its sanitize fallback must read the single source of
  // truth (JWT_Manager::DEFAULT_EXPIRATION), not a hardcoded magic number that
  // can silently drift from what the token code actually consumes.
  if (!settingsPage.includes('JWT_Manager::DEFAULT_EXPIRATION')) {
    failures.push(
      'class-settings-page.php: token_expiration field/sanitize default must reference ' +
        'JWT_Manager::DEFAULT_EXPIRATION instead of a hardcoded number.'
    );
  }

  // The label must say minutes, not days — the exact unit mismatch that
  // caused the incident.
  if (/Token Expiration \(days\)/i.test(settingsPage)) {
    failures.push(
      'class-settings-page.php: token_expiration label says "(days)" but the value is consumed as minutes.'
    );
  }
  if (!/Token Expiration \(minutes\)/i.test(settingsPage)) {
    failures.push('class-settings-page.php: token_expiration label must say "(minutes)".');
  }
}

if (failures.length > 0) {
  console.error('Auth token-expiration unit check failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Auth token-expiration unit check passed.');
