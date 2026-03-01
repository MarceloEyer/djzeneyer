# Locales Context - /src/locales

> **Core Rule:** No Hardcoded Strings.

## Rules
1. **Centralization:** Todas as strings devem estar em `en/translation.json` e `pt/translation.json`.
2. **Parity:** Toda chave adicionada em `pt` deve ter sua contraparte em `en`.
3. **Namespacing:** Use chaves hierárquicas (ex: `auth.login.title`) para evitar colisões.

## Usage
- No React: `const { t } = useTranslation();`
- Em arquivos PHP: Use o padrão do WordPress `__()` ou `_e()` se estiver no backend customizado.

---
*Internacionalização é o primeiro passo para o alcance mundial.*
