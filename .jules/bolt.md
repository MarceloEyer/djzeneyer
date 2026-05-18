## 2024-05-17 - [Performance: PHP function_exists check optimization]
**Learning:** Calling `function_exists()` repeatedly in loops or multiple times per request is measurably slower than checking a defined constant like `defined('GAMIPRESS_VER')`. When integrating with third-party plugins like GamiPress, standardizing on a constant check reduces overhead.
**Action:** Replace `function_exists('gamipress_...` checks with `defined('GAMIPRESS_VER')` to save execution time, especially in loops and hot API endpoints.
