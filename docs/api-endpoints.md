# WordPress REST API Endpoints

Esta é a lista completa de rotas disponíveis na API do site `https://djzeneyer.com/wp-json/`.

## Namespace: `core`

- **GET** `/`
- **POST** `/batch/v1`

## Namespace: `djzeneyer/v1`

- **GET** `/djzeneyer/v1`
- **GET** `/djzeneyer/v1/ai-context`
- **GET** `/djzeneyer/v1/menu`
- **GET** `/djzeneyer/v1/shop/page`
- **GET** `/djzeneyer/v1/products`
- **GET** `/djzeneyer/v1/products/collections`
- **POST** `/djzeneyer/v1/subscribe`
- **POST** `/djzeneyer/v1/user/update-profile`

## Namespace: `jetpack/v4`

- **GET** `/jetpack/v4`
- **POST** `/jetpack/v4/verify_xmlrpc_error`
- **GET** `/jetpack/v4/heartbeat/data`
- **POST, PUT, PATCH** `/jetpack/v4/remote_authorize`
- **POST, PUT, PATCH** `/jetpack/v4/remote_provision`
- **POST, PUT, PATCH** `/jetpack/v4/remote_register`
- **POST, PUT, PATCH** `/jetpack/v4/remote_connect`
- **GET** `/jetpack/v4/connection/check`
- **GET, POST, PUT, PATCH** `/jetpack/v4/connection`
- **POST, PUT, PATCH** `/jetpack/v4/connection/user`
- **GET** `/jetpack/v4/connection/data`
- **GET** `/jetpack/v4/connection/plugins`
- **POST, PUT, PATCH** `/jetpack/v4/connection/reconnect`
- **POST, PUT, PATCH** `/jetpack/v4/connection/register`
- **GET** `/jetpack/v4/connection/authorize_url`
- **POST, PUT, PATCH** `/jetpack/v4/user-token`
- **POST, PUT, PATCH** `/jetpack/v4/connection/owner`

## Namespace: `litespeed/v1`

- **GET** `/litespeed/v1`
- **POST** `/litespeed/v1/toggle_crawler_state`
- **GET** `/litespeed/v1/tool/check_ip`
- **GET** `/litespeed/v1/guest/sync`
- **POST** `/litespeed/v1/notify_img`
- **POST** `/litespeed/v1/notify_ccss`
- **POST** `/litespeed/v1/notify_ucss`
- **POST** `/litespeed/v1/notify_vpi`
- **POST** `/litespeed/v1/check_img`

## Namespace: `litespeed/v3`

- **GET** `/litespeed/v3`
- **POST** `/litespeed/v3/ip_validate`
- **POST** `/litespeed/v3/wp_rest_echo`
- **POST** `/litespeed/v3/ping`
- **POST** `/litespeed/v3/cdn_status`
- **POST** `/litespeed/v3/err_domains`

## Namespace: `mailpoet/v1`

- **GET** `/mailpoet/v1`
- **GET** `/mailpoet/v1/automations`
- **PUT, DELETE** `/mailpoet/v1/automations/(?P<id>\d+)`
- **POST** `/mailpoet/v1/automations/(?P<id>\d+)/duplicate`
- **POST** `/mailpoet/v1/automations/create-from-template`
- **GET** `/mailpoet/v1/automation-templates`
- **GET** `/mailpoet/v1/automation-templates/(?P<slug>.+)`
- **GET** `/mailpoet/v1/automation/analytics/automation_flow`
- **GET** `/mailpoet/v1/automation/analytics/overview`
- **PUT** `/mailpoet/v1/automation/analytics/runs/(?P<id>\d+)/status`

## Namespace: `oembed/1.0`

- **GET** `/oembed/1.0`
- **GET** `/oembed/1.0/embed`
- **GET** `/oembed/1.0/proxy`

## Namespace: `pagbank/installments`

- **GET** `/pagbank/installments`
- **GET** `/pagbank/installments/event`

## Namespace: `pll/v1`

- **GET** `/pll/v1`
- **GET, POST** `/pll/v1/languages`
- **GET, POST, PUT, PATCH, DELETE** `/pll/v1/languages/(?P<term_id>[\d]+)`
- **GET** `/pll/v1/languages/(?P<slug>[a-z][a-z0-9_-]*)`
- **GET, POST, PUT, PATCH** `/pll/v1/settings`

## Namespace: `wc-admin`

- **GET** `/wc-admin`
- **POST** `/wc-admin/notice/dismiss`
- **GET** `/wc-admin/features`
- **GET** `/wc-admin/experiments/assignment`
- **GET** `/wc-admin/marketing/recommended`
- **GET** `/wc-admin/marketing/knowledge-base`
- **GET** `/wc-admin/marketing/misc-recommendations`
- **POST, PUT, PATCH** `/wc-admin/marketing/overview/activate-plugin`
- **GET** `/wc-admin/marketing/overview/installed-plugins`
- **GET** `/wc-admin/marketing/recommendations`
- **GET** `/wc-admin/marketing/channels`
- **GET** `/wc-admin/marketing/campaigns`
- **GET** `/wc-admin/marketing/campaign-types`
- **GET, POST, PUT, PATCH** `/wc-admin/options`
- **POST, PUT, PATCH** `/wc-admin/legacy-settings`
- **GET** `/wc-admin/payment-gateway-suggestions`
- **POST** `/wc-admin/payment-gateway-suggestions/dismiss`
- **POST, PUT, PATCH** `/wc-admin/themes`
- **POST, PUT, PATCH** `/wc-admin/plugins/install`
- **GET** `/wc-admin/plugins/install/status`
- **GET** `/wc-admin/plugins/install/status/(?P<job_id>[a-z0-9_\-]+)`
- **GET** `/wc-admin/plugins/active`
- **GET** `/wc-admin/plugins/installed`
- **POST, PUT, PATCH** `/wc-admin/plugins/activate`
- **GET** `/wc-admin/plugins/activate/status`
- **GET** `/wc-admin/plugins/activate/status/(?P<job_id>[a-z0-9_\-]+)`
- **GET** `/wc-admin/plugins/connect-jetpack`
- **POST** `/wc-admin/plugins/request-wccom-connect`
- **POST** `/wc-admin/plugins/finish-wccom-connect`
- **POST, PUT, PATCH** `/wc-admin/plugins/connect-wcpay`
- **POST, PUT, PATCH** `/wc-admin/plugins/connect-square`
- **GET** `/wc-admin/onboarding/free-extensions`
- **GET** `/wc-admin/onboarding/product-types`
- **GET, POST, PUT, PATCH** `/wc-admin/onboarding/profile`
- **GET** `/wc-admin/onboarding/profile/experimental_get_email_prefill`
- **GET** `/wc-admin/onboarding/profile/progress`
- **POST, PUT, PATCH** `/wc-admin/onboarding/profile/progress/core-profiler/complete`
- **POST** `/wc-admin/onboarding/profile/update-store-currency-and-measurement-units`
- **POST** `/wc-admin/onboarding/tasks/import_sample_products`
- **POST** `/wc-admin/onboarding/tasks/create_homepage`
- **POST** `/wc-admin/onboarding/tasks/create_product_from_template`
- **GET, POST** `/wc-admin/onboarding/tasks`
- **POST, PUT, PATCH** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_\-]+)/hide`
- **POST, PUT, PATCH** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_\-]+)/unhide`
- **POST, PUT, PATCH** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_\-]+)/dismiss`
- **POST, PUT, PATCH** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_\-]+)/undo_dismiss`
- **POST** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_-]+)/snooze`
- **POST, PUT, PATCH** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_\-]+)/action`
- **POST, PUT, PATCH** `/wc-admin/onboarding/tasks/(?P<id>[a-z0-9_\-]+)/undo_snooze`
- **POST, PUT, PATCH** `/wc-admin/onboarding/themes/install`
- **POST, PUT, PATCH** `/wc-admin/onboarding/themes/activate`
- **POST** `/wc-admin/onboarding/plugins/install-and-activate-async`
- **POST** `/wc-admin/onboarding/plugins/install-and-activate`
- **GET** `/wc-admin/onboarding/plugins/scheduled-installs/(?P<job_id>\w+)`
- **GET** `/wc-admin/onboarding/plugins/jetpack-authorization-url`
- **POST** `/wc-admin/onboarding/products`
- **GET** `/wc-admin/mobile-app/send-magic-link`
- **GET** `/wc-admin/mobile-app`
- **GET** `/wc-admin/shipping-partner-suggestions`
- **POST** `/wc-admin/launch-your-store/initialize-coming-soon`
- **POST** `/wc-admin/launch-your-store/update-survey-status`
- **GET** `/wc-admin/launch-your-store/survey-completed`
- **GET** `/wc-admin/launch-your-store/woopayments/test-orders/count`
- **DELETE** `/wc-admin/launch-your-store/woopayments/test-orders`
- **POST** `/wc-admin/blueprint/export`
- **POST** `/wc-admin/blueprint/import-step`
- **GET** `/wc-admin/blueprint/import-allowed`
- **POST, PUT, PATCH** `/wc-admin/settings/payments/country`
- **POST** `/wc-admin/settings/payments/providers`
- **POST, PUT, PATCH** `/wc-admin/settings/payments/providers/order`
- **POST, PUT, PATCH** `/wc-admin/settings/payments/suggestion/(?P<id>[\w\d\-]+)/attach`
- **POST, PUT, PATCH** `/wc-admin/settings/payments/suggestion/(?P<id>[\w\d\-]+)/hide`
- **POST, PUT, PATCH** `/wc-admin/settings/payments/suggestion/(?P<suggestion_id>[\w\d\-]+)/incentive/(?P<incentive_id>[\w\d\-]+)/dismiss`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/(?P<step>[a-zA-Z0-9_-]+)/start`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/(?P<step>[a-zA-Z0-9_-]+)/save`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/(?P<step>[a-zA-Z0-9_-]+)/check`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/(?P<step>[a-zA-Z0-9_-]+)/finish`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/(?P<step>[a-zA-Z0-9_-]+)/clean`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/test_account/init`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/test_account/reset`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/business_verification/kyc_session`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/business_verification/kyc_session/finish`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/step/business_verification/test_account/disable`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/preload`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/reset`
- **POST** `/wc-admin/settings/payments/woopayments/woopay-eligibility`
- **POST** `/wc-admin/settings/payments/woopayments/onboarding/test_account/disable`

## Namespace: `wc-admin-email`

- **GET** `/wc-admin-email`
- **POST** `/wc-admin-email/settings/email/send-preview`
- **GET** `/wc-admin-email/settings/email/preview-subject`
- **POST** `/wc-admin-email/settings/email/save-transient`
- **POST** `/wc-admin-email/settings/email/listing/recreate-email-post`

## Namespace: `wc-analytics`

- **GET** `/wc-analytics`
- **GET** `/wc-analytics/customers`
- **GET** `/wc-analytics/customers/(?P<id>[\d-]+)`
- **GET** `/wc-analytics/leaderboards`
- **GET** `/wc-analytics/leaderboards/allowed`
- **GET** `/wc-analytics/leaderboards/(?P<leaderboard>\w+)`
- **GET** `/wc-analytics/reports`
- **POST, PUT, PATCH** `/wc-analytics/reports/import`
- **POST, PUT, PATCH** `/wc-analytics/reports/import/cancel`
- **POST, PUT, PATCH** `/wc-analytics/reports/import/delete`
- **GET** `/wc-analytics/reports/import/status`
- **GET** `/wc-analytics/reports/import/totals`
- **POST, PUT, PATCH** `/wc-analytics/reports/(?P<type>[a-z]+)/export`
- **GET** `/wc-analytics/reports/(?P<type>[a-z]+)/export/(?P<export_id>[a-z0-9]+)/status`
- **GET** `/wc-analytics/reports/products`
- **GET** `/wc-analytics/reports/variations`
- **GET** `/wc-analytics/reports/products/stats`
- **GET** `/wc-analytics/reports/variations/stats`
- **GET** `/wc-analytics/reports/revenue/stats`
- **GET** `/wc-analytics/reports/orders`
- **GET** `/wc-analytics/reports/orders/stats`
- **GET** `/wc-analytics/reports/categories`
- **GET** `/wc-analytics/reports/taxes`
- **GET** `/wc-analytics/reports/taxes/stats`
- **GET** `/wc-analytics/reports/coupons`
- **GET** `/wc-analytics/reports/coupons/stats`
- **GET** `/wc-analytics/reports/stock`
- **GET** `/wc-analytics/reports/stock/stats`
- **GET** `/wc-analytics/reports/downloads`
- **GET** `/wc-analytics/reports/downloads/stats`
- **GET** `/wc-analytics/reports/customers`
- **GET** `/wc-analytics/reports/customers/stats`
- **GET** `/wc-analytics/imports/status`
- **POST** `/wc-analytics/imports/trigger`
- **GET** `/wc-analytics/reports/performance-indicators`
- **GET** `/wc-analytics/reports/performance-indicators/allowed`
- **GET** `/wc-analytics/admin/notes`
- **GET, POST, PUT, PATCH** `/wc-analytics/admin/notes/(?P<id>[\d-]+)`
- **DELETE** `/wc-analytics/admin/notes/delete/(?P<id>[\d-]+)`
- **DELETE** `/wc-analytics/admin/notes/delete/all`
- **POST, PUT, PATCH** `/wc-analytics/admin/notes/update`
- **POST, PUT, PATCH** `/wc-analytics/admin/notes/experimental-activate-promo/(?P<promo_note_name>[\w-]+)`
- **POST, PUT, PATCH** `/wc-analytics/admin/notes/(?P<note_id>[\d-]+)/action/(?P<action_id>[\d-]+)`
- **GET, POST** `/wc-analytics/coupons`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/coupons/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/coupons/batch`
- **GET** `/wc-analytics/data`
- **GET** `/wc-analytics/data/countries/locales`
- **GET** `/wc-analytics/data/countries`
- **GET** `/wc-analytics/data/countries/(?P<location>[\w-]+)`
- **GET** `/wc-analytics/data/download-ips`
- **GET, POST** `/wc-analytics/orders`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/orders/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/orders/batch`
- **GET, POST** `/wc-analytics/products`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/products/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/products/batch`
- **GET** `/wc-analytics/products/(?P<id>[\d]+)/related`
- **GET** `/wc-analytics/products/suggested-products`
- **POST** `/wc-analytics/products/(?P<id>[\d]+)/duplicate`
- **GET, POST** `/wc-analytics/products/attributes`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/products/attributes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/products/attributes/batch`
- **GET** `/wc-analytics/products/attributes/(?P<slug>[a-z0-9_\-]+)`
- **GET, POST** `/wc-analytics/products/attributes/(?P<attribute_id>[\d]+)/terms`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/products/attributes/(?P<attribute_id>[\d]+)/terms/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/products/attributes/(?P<attribute_id>[\d]+)/terms/batch`
- **GET** `/wc-analytics/products/attributes/(?P<slug>[a-z0-9_\-]+)/terms`
- **GET, POST** `/wc-analytics/products/categories`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/products/categories/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/products/categories/batch`
- **GET, POST** `/wc-analytics/products/(?P<product_id>[\d]+)/variations`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/products/(?P<product_id>[\d]+)/variations/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/products/(?P<product_id>[\d]+)/variations/batch`
- **POST** `/wc-analytics/products/(?P<product_id>[\d]+)/variations/generate`
- **GET** `/wc-analytics/variations`
- **GET, POST** `/wc-analytics/products/reviews`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/products/reviews/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/products/reviews/batch`
- **GET** `/wc-analytics/products/low-in-stock`
- **GET** `/wc-analytics/products/count-low-in-stock`
- **GET** `/wc-analytics/settings/(?P<group_id>[\w-]+)`
- **POST, PUT, PATCH** `/wc-analytics/settings/(?P<group_id>[\w-]+)/batch`
- **GET, POST, PUT, PATCH** `/wc-analytics/settings/(?P<group_id>[\w-]+)/(?P<id>[\w-]+)`
- **GET, POST** `/wc-analytics/taxes`
- **GET, POST, PUT, PATCH, DELETE** `/wc-analytics/taxes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc-analytics/taxes/batch`

## Namespace: `wc-telemetry`

- **GET** `/wc-telemetry`
- **POST** `/wc-telemetry/tracker`

## Namespace: `wc/pos/v1/catalog`

- **GET** `/wc/pos/v1/catalog`
- **POST** `/wc/pos/v1/catalog/create`

## Namespace: `wc/private`

- **GET** `/wc/private`
- **GET, POST** `/wc/private/patterns`

## Namespace: `wc/store`

- **GET** `/wc/store`
- **POST** `/wc/store/batch`
- **GET** `/wc/store/cart`
- **POST** `/wc/store/cart/add-item`
- **POST** `/wc/store/cart/apply-coupon`
- **GET, POST, DELETE** `/wc/store/cart/coupons`
- **GET, DELETE** `/wc/store/cart/coupons/(?P<code>[\w-]+)`
- **POST** `/wc/store/cart/extensions`
- **GET, POST, DELETE** `/wc/store/cart/items`
- **GET, POST, PUT, PATCH, DELETE** `/wc/store/cart/items/(?P<key>[\w-]{32})`
- **POST** `/wc/store/cart/remove-coupon`
- **POST** `/wc/store/cart/remove-item`
- **POST** `/wc/store/cart/select-shipping-rate`
- **POST** `/wc/store/cart/update-item`
- **POST** `/wc/store/cart/update-customer`
- **GET, POST, POST, PUT, PATCH** `/wc/store/checkout`
- **POST** `/wc/store/checkout/(?P<id>[\d]+)`
- **GET** `/wc/store/order/(?P<id>[\d]+)`
- **GET** `/wc/store/products/attributes`
- **GET** `/wc/store/products/attributes/(?P<id>[\d]+)`
- **GET** `/wc/store/products/attributes/(?P<attribute_id>[\d]+)/terms`
- **GET** `/wc/store/products/categories`
- **GET** `/wc/store/products/categories/(?P<id>[\d]+)`
- **GET** `/wc/store/products/brands`
- **GET** `/wc/store/products/brands/(?P<identifier>[\w-]+)`
- **GET** `/wc/store/products/collection-data`
- **GET** `/wc/store/products/reviews`
- **GET** `/wc/store/products/tags`
- **GET** `/wc/store/products`
- **GET** `/wc/store/products/(?P<id>[\d]+)`
- **GET** `/wc/store/products/(?P<slug>[\S]+)`

## Namespace: `wc/store/v1`

- **GET** `/wc/store/v1`
- **POST** `/wc/store/v1/batch`
- **GET** `/wc/store/v1/cart`
- **POST** `/wc/store/v1/cart/add-item`
- **POST** `/wc/store/v1/cart/apply-coupon`
- **GET, POST, DELETE** `/wc/store/v1/cart/coupons`
- **GET, DELETE** `/wc/store/v1/cart/coupons/(?P<code>[\w-]+)`
- **POST** `/wc/store/v1/cart/extensions`
- **GET, POST, DELETE** `/wc/store/v1/cart/items`
- **GET, POST, PUT, PATCH, DELETE** `/wc/store/v1/cart/items/(?P<key>[\w-]{32})`
- **POST** `/wc/store/v1/cart/remove-coupon`
- **POST** `/wc/store/v1/cart/remove-item`
- **POST** `/wc/store/v1/cart/select-shipping-rate`
- **POST** `/wc/store/v1/cart/update-item`
- **POST** `/wc/store/v1/cart/update-customer`
- **GET, POST, POST, PUT, PATCH** `/wc/store/v1/checkout`
- **POST** `/wc/store/v1/checkout/(?P<id>[\d]+)`
- **GET** `/wc/store/v1/order/(?P<id>[\d]+)`
- **GET** `/wc/store/v1/products/attributes`
- **GET** `/wc/store/v1/products/attributes/(?P<id>[\d]+)`
- **GET** `/wc/store/v1/products/attributes/(?P<attribute_id>[\d]+)/terms`
- **GET** `/wc/store/v1/products/categories`
- **GET** `/wc/store/v1/products/categories/(?P<id>[\d]+)`
- **GET** `/wc/store/v1/products/brands`
- **GET** `/wc/store/v1/products/brands/(?P<identifier>[\w-]+)`
- **GET** `/wc/store/v1/products/collection-data`
- **GET** `/wc/store/v1/products/reviews`
- **GET** `/wc/store/v1/products/tags`
- **GET** `/wc/store/v1/products`
- **GET** `/wc/store/v1/products/(?P<id>[\d]+)`
- **GET** `/wc/store/v1/products/(?P<slug>[\S]+)`

## Namespace: `wc/v1`

- **GET** `/wc/v1`
- **GET** `/wc/v1/marketplace/product-preview`
- **GET, POST** `/wc/v1/coupons`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/coupons/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/coupons/batch`
- **GET** `/wc/v1/customers/(?P<customer_id>[\d]+)/downloads`
- **GET, POST** `/wc/v1/customers`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/customers/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/customers/batch`
- **GET, POST** `/wc/v1/orders/(?P<order_id>[\d]+)/notes`
- **GET, DELETE** `/wc/v1/orders/(?P<order_id>[\d]+)/notes/(?P<id>[\d]+)`
- **GET, POST** `/wc/v1/orders/(?P<order_id>[\d]+)/refunds`
- **GET, DELETE** `/wc/v1/orders/(?P<order_id>[\d]+)/refunds/(?P<id>[\d]+)`
- **GET, POST** `/wc/v1/orders`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/orders/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/orders/batch`
- **GET, POST** `/wc/v1/products/attributes/(?P<attribute_id>[\d]+)/terms`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/attributes/(?P<attribute_id>[\d]+)/terms/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/products/attributes/(?P<attribute_id>[\d]+)/terms/batch`
- **GET, POST** `/wc/v1/products/attributes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/attributes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/products/attributes/batch`
- **GET, POST** `/wc/v1/products/categories`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/categories/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/products/categories/batch`
- **GET, POST** `/wc/v1/products/(?P<product_id>[\d]+)/reviews`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/(?P<product_id>[\d]+)/reviews/(?P<id>[\d]+)`
- **GET, POST** `/wc/v1/products/shipping_classes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/shipping_classes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/products/shipping_classes/batch`
- **GET, POST** `/wc/v1/products/tags`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/tags/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/products/tags/batch`
- **GET, POST** `/wc/v1/products`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/products/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/products/batch`
- **GET** `/wc/v1/reports/sales`
- **GET** `/wc/v1/reports/top_sellers`
- **GET** `/wc/v1/reports`
- **GET, POST** `/wc/v1/taxes/classes`
- **DELETE** `/wc/v1/taxes/classes/(?P<slug>\w[\w\s\-]*)`
- **GET, POST** `/wc/v1/taxes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/taxes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/taxes/batch`
- **GET, POST** `/wc/v1/webhooks`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v1/webhooks/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v1/webhooks/batch`
- **GET** `/wc/v1/webhooks/(?P<webhook_id>[\d]+)/deliveries`
- **GET** `/wc/v1/webhooks/(?P<webhook_id>[\d]+)/deliveries/(?P<id>[\d]+)`

## Namespace: `wc/v2`

- **GET** `/wc/v2`
- **GET, POST** `/wc/v2/products/brands`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/brands/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/brands/batch`
- **GET, POST** `/wc/v2/coupons`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/coupons/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/coupons/batch`
- **GET** `/wc/v2/customers/(?P<customer_id>[\d]+)/downloads`
- **GET, POST** `/wc/v2/customers`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/customers/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/customers/batch`
- **GET, POST** `/wc/v2/orders/(?P<order_id>[\d]+)/notes`
- **GET, DELETE** `/wc/v2/orders/(?P<order_id>[\d]+)/notes/(?P<id>[\d]+)`
- **GET, POST** `/wc/v2/orders/(?P<order_id>[\d]+)/refunds`
- **GET, DELETE** `/wc/v2/orders/(?P<order_id>[\d]+)/refunds/(?P<id>[\d]+)`
- **GET, POST** `/wc/v2/orders`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/orders/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/orders/batch`
- **GET, POST** `/wc/v2/products/attributes/(?P<attribute_id>[\d]+)/terms`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/attributes/(?P<attribute_id>[\d]+)/terms/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/attributes/(?P<attribute_id>[\d]+)/terms/batch`
- **GET, POST** `/wc/v2/products/attributes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/attributes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/attributes/batch`
- **GET, POST** `/wc/v2/products/categories`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/categories/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/categories/batch`
- **GET, POST** `/wc/v2/products/(?P<product_id>[\d]+)/reviews`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/(?P<product_id>[\d]+)/reviews/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/(?P<product_id>[\d]+)/reviews/batch`
- **GET, POST** `/wc/v2/products/shipping_classes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/shipping_classes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/shipping_classes/batch`
- **GET, POST** `/wc/v2/products/tags`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/tags/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/tags/batch`
- **GET, POST** `/wc/v2/products`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/batch`
- **GET** `/wc/v2/products/(?P<id>[\d]+)/related`
- **GET, POST** `/wc/v2/products/(?P<product_id>[\d]+)/variations`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/products/(?P<product_id>[\d]+)/variations/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/products/(?P<product_id>[\d]+)/variations/batch`
- **GET** `/wc/v2/reports/sales`
- **GET** `/wc/v2/reports/top_sellers`
- **GET** `/wc/v2/reports`
- **GET** `/wc/v2/settings`
- **GET** `/wc/v2/settings/(?P<group_id>[\w-]+)`
- **POST, PUT, PATCH** `/wc/v2/settings/(?P<group_id>[\w-]+)/batch`
- **GET, POST, PUT, PATCH** `/wc/v2/settings/(?P<group_id>[\w-]+)/(?P<id>[\w-]+)`
- **GET, POST** `/wc/v2/shipping/zones`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/shipping/zones/(?P<id>[\d]+)`
- **GET, POST, PUT, PATCH** `/wc/v2/shipping/zones/(?P<id>[\d]+)/locations`
- **GET, POST** `/wc/v2/shipping/zones/(?P<zone_id>[\d]+)/methods`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/shipping/zones/(?P<zone_id>[\d]+)/methods/(?P<instance_id>[\d]+)`
- **GET, POST** `/wc/v2/taxes/classes`
- **GET, DELETE** `/wc/v2/taxes/classes/(?P<slug>\w[\w\s\-]*)`
- **GET, POST** `/wc/v2/taxes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/taxes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/taxes/batch`
- **GET, POST** `/wc/v2/webhooks`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v2/webhooks/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v2/webhooks/batch`
- **GET** `/wc/v2/webhooks/(?P<webhook_id>[\d]+)/deliveries`
- **GET** `/wc/v2/webhooks/(?P<webhook_id>[\d]+)/deliveries/(?P<id>[\d]+)`
- **GET** `/wc/v2/system_status`
- **GET** `/wc/v2/system_status/tools`
- **GET, POST, PUT, PATCH** `/wc/v2/system_status/tools/(?P<id>[\w-]+)`
- **GET** `/wc/v2/shipping_methods`
- **GET** `/wc/v2/shipping_methods/(?P<id>[\w-]+)`
- **GET** `/wc/v2/payment_gateways`
- **GET, POST, PUT, PATCH** `/wc/v2/payment_gateways/(?P<id>[\w-]+)`

## Namespace: `wc/v3`

- **GET** `/wc/v3`
- **GET** `/wc/v3/marketplace/featured`
- **POST** `/wc/v3/marketplace/refresh`
- **GET** `/wc/v3/marketplace/subscriptions`
- **POST** `/wc/v3/marketplace/subscriptions/connect`
- **POST** `/wc/v3/marketplace/subscriptions/activate-plugin`
- **POST** `/wc/v3/marketplace/subscriptions/disconnect`
- **POST** `/wc/v3/marketplace/subscriptions/activate`
- **GET** `/wc/v3/marketplace/subscriptions/install-url`
- **POST** `/wc/v3/marketplace/create-order`
- **GET, POST** `/wc/v3/products/brands`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/brands/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/brands/batch`
- **GET, POST** `/wc/v3/coupons`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/coupons/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/coupons/batch`
- **GET** `/wc/v3/customers/(?P<customer_id>[\d]+)/downloads`
- **GET, POST** `/wc/v3/customers`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/customers/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/customers/batch`
- **GET** `/wc/v3/layout-templates`
- **GET** `/wc/v3/layout-templates/(?P<id>\w[\w\s\-]*)`
- **GET, POST** `/wc/v3/orders/(?P<order_id>[\d]+)/notes`
- **GET, DELETE** `/wc/v3/orders/(?P<order_id>[\d]+)/notes/(?P<id>[\d]+)`
- **GET, POST** `/wc/v3/orders/(?P<order_id>[\d]+)/refunds`
- **GET, DELETE** `/wc/v3/orders/(?P<order_id>[\d]+)/refunds/(?P<id>[\d]+)`
- **GET, POST** `/wc/v3/orders`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/orders/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/orders/batch`
- **GET, POST** `/wc/v3/products/attributes/(?P<attribute_id>[\d]+)/terms`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/attributes/(?P<attribute_id>[\d]+)/terms/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/attributes/(?P<attribute_id>[\d]+)/terms/batch`
- **GET, POST** `/wc/v3/products/attributes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/attributes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/attributes/batch`
- **GET, POST** `/wc/v3/products/categories`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/categories/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/categories/batch`
- **GET** `/wc/v3/products/custom-fields/names`
- **GET, POST** `/wc/v3/products/reviews`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/reviews/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/reviews/batch`
- **GET, POST** `/wc/v3/products/shipping_classes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/shipping_classes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/shipping_classes/batch`
- **GET** `/wc/v3/products/shipping_classes/slug-suggestion`
- **GET, POST** `/wc/v3/products/tags`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/tags/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/tags/batch`
- **GET, POST** `/wc/v3/products`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/batch`
- **GET** `/wc/v3/products/(?P<id>[\d]+)/related`
- **GET** `/wc/v3/products/suggested-products`
- **POST** `/wc/v3/products/(?P<id>[\d]+)/duplicate`
- **GET, POST** `/wc/v3/products/(?P<product_id>[\d]+)/variations`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/products/(?P<product_id>[\d]+)/variations/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/products/(?P<product_id>[\d]+)/variations/batch`
- **POST** `/wc/v3/products/(?P<product_id>[\d]+)/variations/generate`
- **GET** `/wc/v3/refunds`
- **GET** `/wc/v3/reports/sales`
- **GET** `/wc/v3/reports/top_sellers`
- **GET** `/wc/v3/reports/orders/totals`
- **GET** `/wc/v3/reports/products/totals`
- **GET** `/wc/v3/reports/customers/totals`
- **GET** `/wc/v3/reports/coupons/totals`
- **GET** `/wc/v3/reports/reviews/totals`
- **GET** `/wc/v3/reports`
- **GET** `/wc/v3/settings`
- **POST, PUT, PATCH** `/wc/v3/settings/batch`
- **GET** `/wc/v3/settings/(?P<group_id>[\w-]+)`
- **POST, PUT, PATCH** `/wc/v3/settings/(?P<group_id>[\w-]+)/batch`
- **GET, POST, PUT, PATCH** `/wc/v3/settings/(?P<group_id>[\w-]+)/(?P<id>[\w-]+)`
- **GET, POST** `/wc/v3/shipping/zones`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/shipping/zones/(?P<id>[\d]+)`
- **GET, POST, PUT, PATCH** `/wc/v3/shipping/zones/(?P<id>[\d]+)/locations`
- **GET, POST** `/wc/v3/shipping/zones/(?P<zone_id>[\d]+)/methods`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/shipping/zones/(?P<zone_id>[\d]+)/methods/(?P<instance_id>[\d]+)`
- **GET, POST** `/wc/v3/taxes/classes`
- **GET, DELETE** `/wc/v3/taxes/classes/(?P<slug>\w[\w\s\-]*)`
- **GET, POST** `/wc/v3/taxes`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/taxes/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/taxes/batch`
- **GET** `/wc/v3/variations`
- **GET, POST** `/wc/v3/webhooks`
- **GET, POST, PUT, PATCH, DELETE** `/wc/v3/webhooks/(?P<id>[\d]+)`
- **POST, PUT, PATCH** `/wc/v3/webhooks/batch`
- **GET** `/wc/v3/system_status`
- **GET** `/wc/v3/system_status/tools`
- **GET, POST, PUT, PATCH** `/wc/v3/system_status/tools/(?P<id>[\w-]+)`
- **GET** `/wc/v3/shipping_methods`
- **GET** `/wc/v3/shipping_methods/(?P<id>[\w-]+)`
- **GET** `/wc/v3/payment_gateways`
- **GET, POST, PUT, PATCH** `/wc/v3/payment_gateways/(?P<id>[\w-]+)`
- **GET** `/wc/v3/data`
- **GET** `/wc/v3/data/continents`
- **GET** `/wc/v3/data/continents/(?P<location>[\w-]+)`
- **GET** `/wc/v3/data/countries`
- **GET** `/wc/v3/data/countries/(?P<location>[\w-]+)`
- **GET** `/wc/v3/data/currencies`
- **GET** `/wc/v3/data/currencies/current`
- **GET** `/wc/v3/data/currencies/(?P<currency>[\w-]{3})`
- **POST** `/wc/v3/paypal-standard/update-shipping`
- **POST** `/wc/v3/paypal-webhooks`
- **POST** `/wc/v3/paypal-buttons/create-order`
- **POST** `/wc/v3/paypal-buttons/cancel-payment`
- **POST, GET** `/wc/v3/orders/(?P<id>[\d]+)/receipt`
- **GET** `/wc/v3/orders/(?P<id>[\d]+)/actions/email_templates`
- **POST** `/wc/v3/orders/(?P<id>[\d]+)/actions/send_email`
- **POST** `/wc/v3/orders/(?P<id>[\d]+)/actions/send_order_details`
- **GET** `/wc/v3/orders/statuses`

## Namespace: `wccom-site/v3`

- **GET** `/wccom-site/v3`
- **GET** `/wccom-site/v3/installer/(?P<product_id>\d+)/state`
- **POST, PUT, PATCH** `/wccom-site/v3/installer`
- **POST, PUT, PATCH** `/wccom-site/v3/installer/reset`
- **GET** `/wccom-site/v3/ssr`
- **GET** `/wccom-site/v3/status`
- **POST, PUT, PATCH** `/wccom-site/v3/connection/disconnect`
- **GET** `/wccom-site/v3/connection/status`

## Namespace: `woocommerce-email-editor/v1`

- **GET** `/woocommerce-email-editor/v1`
- **POST** `/woocommerce-email-editor/v1/send_preview_email`
- **GET** `/woocommerce-email-editor/v1/get_personalization_tags`
- **GET** `/woocommerce-email-editor/v1/personalization_tags`

## Namespace: `wp-abilities/v1`

- **GET** `/wp-abilities/v1`
- **GET, GET** `/wp-abilities/v1/categories`
- **GET, GET** `/wp-abilities/v1/categories/(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)`
- **GET, POST, PUT, PATCH, DELETE, GET, POST, PUT, PATCH, DELETE** `/wp-abilities/v1/abilities/(?P<name>[a-zA-Z0-9\-\/]+?)/run`
- **GET, GET** `/wp-abilities/v1/abilities`
- **GET, GET** `/wp-abilities/v1/abilities/(?P<name>[a-zA-Z0-9\-\/]+)`

## Namespace: `wp-block-editor/v1`

- **GET** `/wp-block-editor/v1`
- **GET** `/wp-block-editor/v1/url-details`
- **GET** `/wp-block-editor/v1/export`
- **GET** `/wp-block-editor/v1/navigation-fallback`

## Namespace: `wp-site-health/v1`

- **GET** `/wp-site-health/v1`
- **GET** `/wp-site-health/v1/tests/background-updates`
- **GET** `/wp-site-health/v1/tests/loopback-requests`
- **GET** `/wp-site-health/v1/tests/https-status`
- **GET** `/wp-site-health/v1/tests/dotorg-communication`
- **GET** `/wp-site-health/v1/tests/authorization-header`
- **GET** `/wp-site-health/v1/directory-sizes`
- **GET** `/wp-site-health/v1/tests/page-cache`

## Namespace: `wp/v2`

- **GET** `/wp/v2`
- **GET, POST** `/wp/v2/gamipress-user-earnings`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/gamipress-user-earnings/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/gamipress-logs`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/gamipress-logs/(?P<id>[\d]+)`
- **GET** `/wp/v2/gamipress-posts`
- **GET, POST** `/wp/v2/posts`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/posts/(?P<id>[\d]+)`
- **GET** `/wp/v2/posts/(?P<parent>[\d]+)/revisions`
- **GET, DELETE** `/wp/v2/posts/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/posts/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/posts/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/pages`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/pages/(?P<id>[\d]+)`
- **GET** `/wp/v2/pages/(?P<parent>[\d]+)/revisions`
- **GET, DELETE** `/wp/v2/pages/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/pages/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/pages/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/media`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/media/(?P<id>[\d]+)`
- **POST** `/wp/v2/media/(?P<id>[\d]+)/post-process`
- **POST** `/wp/v2/media/(?P<id>[\d]+)/edit`
- **GET, POST** `/wp/v2/menu-items`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/menu-items/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/menu-items/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/menu-items/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/blocks`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/blocks/(?P<id>[\d]+)`
- **GET** `/wp/v2/blocks/(?P<parent>[\d]+)/revisions`
- **GET, DELETE** `/wp/v2/blocks/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/blocks/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/blocks/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET** `/wp/v2/templates/(?P<parent>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/revisions`
- **GET, DELETE** `/wp/v2/templates/(?P<parent>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/revisions/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/templates/(?P<id>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/autosaves`
- **GET** `/wp/v2/templates/(?P<parent>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/templates`
- **GET** `/wp/v2/templates/lookup`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/templates/(?P<id>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)`
- **GET** `/wp/v2/template-parts/(?P<parent>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/revisions`
- **GET, DELETE** `/wp/v2/template-parts/(?P<parent>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/revisions/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/template-parts/(?P<id>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/autosaves`
- **GET** `/wp/v2/template-parts/(?P<parent>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/template-parts`
- **GET** `/wp/v2/template-parts/lookup`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/template-parts/(?P<id>([^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)[\/\w%-]+)`
- **GET** `/wp/v2/global-styles/(?P<parent>[\d]+)/revisions`
- **GET** `/wp/v2/global-styles/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)`
- **GET** `/wp/v2/global-styles/themes/(?P<stylesheet>[\/\s%\w\.\(\)\[\]\@_\-]+)/variations`
- **GET** `/wp/v2/global-styles/themes/(?P<stylesheet>[^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)`
- **GET, POST, PUT, PATCH** `/wp/v2/global-styles/(?P<id>[\/\d+]+)`
- **GET, POST** `/wp/v2/navigation`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/navigation/(?P<id>[\d]+)`
- **GET** `/wp/v2/navigation/(?P<parent>[\d]+)/revisions`
- **GET, DELETE** `/wp/v2/navigation/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/navigation/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/navigation/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/font-families`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/font-families/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/font-families/(?P<font_family_id>[\d]+)/font-faces`
- **GET, DELETE** `/wp/v2/font-families/(?P<font_family_id>[\d]+)/font-faces/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/product`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/product/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/product/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/product/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/points-type`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/points-type/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/points-award`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/points-award/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/points-deduct`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/points-deduct/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/achievement-type`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/achievement-type/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/step`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/step/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/rank-type`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/rank-type/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/rank-requirement`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/rank-requirement/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/insigna`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/insigna/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/insigna/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/insigna/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/zen-level`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/zen-level/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/zen-level/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/zen-level/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/mailpoet_email`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/mailpoet_email/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/mailpoet_email/(?P<id>[\d]+)/autosaves`
- **GET** `/wp/v2/mailpoet_email/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/flyers`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/flyers/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/remixes`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/remixes/(?P<id>[\d]+)`
- **GET** `/wp/v2/types`
- **GET** `/wp/v2/types/(?P<type>[\w-]+)`
- **GET** `/wp/v2/statuses`
- **GET** `/wp/v2/statuses/(?P<status>[\w-]+)`
- **GET** `/wp/v2/taxonomies`
- **GET** `/wp/v2/taxonomies/(?P<taxonomy>[\w-]+)`
- **GET, POST** `/wp/v2/categories`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/categories/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/tags`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/tags/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/menus`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/menus/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/wp_pattern_category`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/wp_pattern_category/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/product_brand`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/product_brand/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/product_cat`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/product_cat/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/product_tag`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/product_tag/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/music_tags`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/music_tags/(?P<id>[\d]+)`
- **GET, POST** `/wp/v2/music_type`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/music_type/(?P<id>[\d]+)`
- **GET, DELETE** `/wp/v2/users/me`
- **GET, DELETE** `/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords`
- **GET** `/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords/introspect`
- **GET, DELETE** `/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords/(?P<uuid>[\w\-]+)`
- **GET, POST** `/wp/v2/comments`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/comments/(?P<id>[\d]+)`
- **GET** `/wp/v2/search`
- **GET, POST** `/wp/v2/block-renderer/(?P<name>[a-z0-9-]+/[a-z0-9-]+)`
- **GET** `/wp/v2/block-types`
- **GET** `/wp/v2/block-types/(?P<namespace>[a-zA-Z0-9_-]+)`
- **GET** `/wp/v2/block-types/(?P<namespace>[a-zA-Z0-9_-]+)/(?P<name>[a-zA-Z0-9_-]+)`
- **GET, POST, PUT, PATCH** `/wp/v2/settings`
- **GET** `/wp/v2/themes`
- **GET** `/wp/v2/themes/(?P<stylesheet>[^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?)`
- **GET, POST** `/wp/v2/plugins`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/plugins/(?P<plugin>[^.\/]+(?:\/[^.\/]+)?)`
- **GET** `/wp/v2/sidebars`
- **GET, POST, PUT, PATCH** `/wp/v2/sidebars/(?P<id>[\w-]+)`
- **GET** `/wp/v2/widget-types`
- **GET** `/wp/v2/widget-types/(?P<id>[a-zA-Z0-9_-]+)`
- **POST** `/wp/v2/widget-types/(?P<id>[a-zA-Z0-9_-]+)/encode`
- **POST** `/wp/v2/widget-types/(?P<id>[a-zA-Z0-9_-]+)/render`
- **GET, POST** `/wp/v2/widgets`
- **GET, POST, PUT, PATCH, DELETE** `/wp/v2/widgets/(?P<id>[\w\-]+)`
- **GET** `/wp/v2/block-directory/search`
- **GET** `/wp/v2/pattern-directory/patterns`
- **GET** `/wp/v2/block-patterns/patterns`
- **GET** `/wp/v2/block-patterns/categories`
- **GET** `/wp/v2/menu-locations`
- **GET** `/wp/v2/menu-locations/(?P<location>[\w-]+)`
- **GET** `/wp/v2/font-collections`
- **GET** `/wp/v2/font-collections/(?P<slug>[\/\w-]+)`

## Namespace: `zen-bit/v2`

- **GET** `/zen-bit/v2`
- **GET** `/zen-bit/v2/events`
- **GET** `/zen-bit/v2/events/schema`
- **GET** `/zen-bit/v2/events/(?P<event_id>\d+)`
- **GET** `/zen-bit/v2/events/(?P<event_id>\d+)/schema`
- **POST** `/zen-bit/v2/admin/fetch-now`
- **POST** `/zen-bit/v2/admin/clear-cache`
- **GET** `/zen-bit/v2/admin/health`

## Namespace: `zen-seo/v1`

- **GET** `/zen-seo/v1`
- **GET** `/zen-seo/v1/meta`
- **GET** `/zen-seo/v1/settings`
- **GET** `/zen-seo/v1/profile`
- **GET** `/zen-seo/v1/sitemap`
- **POST** `/zen-seo/v1/cache/clear`

## Namespace: `zeneyer-auth/v1`

- **GET** `/zeneyer-auth/v1`
- **POST** `/zeneyer-auth/v1/login`
- **POST** `/zeneyer-auth/v1/register`
- **POST** `/zeneyer-auth/v1/google`
- **POST** `/zeneyer-auth/v1/refresh`
- **POST** `/zeneyer-auth/v1/logout`
- **GET** `/zeneyer-auth/v1/session`
- **POST** `/zeneyer-auth/v1/auth/login`
- **GET** `/zeneyer-auth/v1/auth/session`
- **POST** `/zeneyer-auth/v1/auth/register`
- **POST** `/zeneyer-auth/v1/auth/google`
- **POST** `/zeneyer-auth/v1/auth/validate`
- **POST** `/zeneyer-auth/v1/auth/refresh`
- **GET** `/zeneyer-auth/v1/auth/me`
- **POST** `/zeneyer-auth/v1/auth/logout`
- **GET** `/zeneyer-auth/v1/settings`
- **GET, POST** `/zeneyer-auth/v1/profile`
- **GET, POST** `/zeneyer-auth/v1/newsletter`
- **GET** `/zeneyer-auth/v1/orders`
- **POST** `/zeneyer-auth/v1/auth/password/reset`
- **POST** `/zeneyer-auth/v1/auth/password/set`

## Namespace: `zengame/v1`

- **GET** `/zengame/v1`
- **GET** `/zengame/v1/me`
- **GET** `/zengame/v1/leaderboard`
- **POST** `/zengame/v1/track`
