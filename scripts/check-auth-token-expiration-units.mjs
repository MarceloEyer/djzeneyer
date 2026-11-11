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

const activatorPath = path.resolve('plugins/zeneyer-auth/includes/class-activator.php');

const failures = [];

const jwtManager = fs.existsSync(jwtManagerPath) ? fs.readFileSync(jwtManagerPath, 'utf8') : '';
const settingsPage = fs.existsSync(settingsPagePath) ? fs.readFileSync(settingsPagePath, 'utf8') : '';
const activator = fs.existsSync(activatorPath) ? fs.readFileSync(activatorPath, 'utf8') : '';

function sliceFrom(source, marker, length) {
  const start = source.indexOf(marker);
  return start === -1 ? '' : source.slice(start, start + length);
}

// Returns the `{ ... }` body of a PHP method by brace matching, so a check can
// look at one method instead of the whole file. Braces inside strings/comments
// are not special-cased: the methods checked here don't contain unbalanced ones.
function extractMethodBody(source, methodName) {
  const signature = new RegExp(`function\\s+${methodName}\\s*\\([^)]*\\)[^{]*\\{`).exec(source);
  if (!signature) return '';
  let depth = 1;
  let i = signature.index + signature[0].length;
  const bodyStart = i;
  while (i < source.length && depth > 0) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
    i += 1;
  }
  return depth === 0 ? source.slice(bodyStart, i - 1) : '';
}

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

  // Each place that decides a token_expiration default must read the single
  // source of truth (JWT_Manager::DEFAULT_EXPIRATION) on its own. Checking the
  // whole file for one mention is not enough: the form field could reference
  // the constant while the save-time fallback (or the activator) keeps a
  // hardcoded number that silently drifts from what the token code consumes.
  const settingsFieldRegion = sliceFrom(settingsPage, "add_settings_field('token_expiration'", 900);
  if (!settingsFieldRegion.includes('JWT_Manager::DEFAULT_EXPIRATION')) {
    failures.push(
      "class-settings-page.php: the add_settings_field('token_expiration') default must reference " +
        'JWT_Manager::DEFAULT_EXPIRATION.'
    );
  }

  const sanitizeBody = extractMethodBody(settingsPage, 'sanitize_token_expiration');
  if (!sanitizeBody) {
    failures.push('class-settings-page.php: sanitize_token_expiration() not found.');
  } else {
    if (!sanitizeBody.includes('JWT_Manager::DEFAULT_EXPIRATION')) {
      failures.push(
        'class-settings-page.php: sanitize_token_expiration() fallback must reference ' +
          'JWT_Manager::DEFAULT_EXPIRATION instead of a hardcoded number.'
      );
    }
    if (!sanitizeBody.includes('JWT_Manager::sanitize_expiration_minutes')) {
      failures.push(
        'class-settings-page.php: sanitize_token_expiration() must validate the previous value with ' +
          'JWT_Manager::sanitize_expiration_minutes() so save-time and emission-time rules stay identical.'
      );
    }
  }

  if (activator) {
    const defaultsBody = extractMethodBody(activator, 'set_default_options');
    if (!defaultsBody) {
      failures.push('class-activator.php: set_default_options() not found.');
    } else {
      if (!defaultsBody.includes('JWT_Manager::DEFAULT_EXPIRATION')) {
        failures.push(
          'class-activator.php: set_default_options() must derive token_expiration from ' +
            'JWT_Manager::DEFAULT_EXPIRATION.'
        );
      }
      if (/['"]token_expiration['"]\s*=>\s*\d+/.test(defaultsBody)) {
        failures.push(
          'class-activator.php: set_default_options() hardcodes a numeric token_expiration; ' +
            'a fresh install would persist it as minutes (the original "7" incident).'
        );
      }
    }
  } else {
    failures.push(`${activatorPath}: file not found`);
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
