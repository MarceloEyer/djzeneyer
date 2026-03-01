# Auth Plugin Context - /plugins/zeneyer-auth

> **Responsibility:** Secure JWT-based Authentication for Headless WP.

## Logic Flow
1. **JWT Secret:** Gerenciado via variáveis de ambiente/PHP constants.
2. **Endpoints:** Estende a REST API para `/zeneyer-auth/v1/login` e `/zeneyer-auth/v1/token/validate`.
3. **Validation:** Intercepta requisições `wp_rest` para validar o Header `Authorization: Bearer <token>`.

## Rules
1. **Dependencies:** Usa `firebase/php-jwt` via Composer. Rode `composer install --no-dev` para ambiente local.
2. **Security:** Nunca exponha o Secret Key em logs ou erros.
3. **Compatibility:** Deve funcionar em harmonia com o `src/hooks/Auth` do frontend.

---
*Token quebrado = Usuário logado deslogado. Teste sempre o login após mudanças.*
