# Zen Eyer Project Agents — Master Instructions

Este é o ponto de entrada principal para todos os agentes de IA. A conformidade com estas diretrizes é **obrigatória**.

## 🏛️ Camadas de Contexto
1. Leia `.agents/GUIDELINES.md` para o manual técnico completo.
2. Leia `.context/IDENTITY.md` para branding e pronúncia (`/zɛn ˈaɪər/`).
3. Leia `AI_CONTEXT_INDEX.md` para entender a hierarquia de SSOT.

---

## 🚨 Regras Críticas (Bypass Proibido)

### 1. Sanitização de URLs (`safeUrl`)
A função `safeUrl(url)` retorna `'#'` (que é truthy).
- **ERRADO:** `safeUrl(url) || '/fallback.svg'`
- **CORRETO:** `safeUrl(url, '/fallback.svg')` (Sempre use o segundo argumento).

### 2. Guards de Rota & Autenticação
- Use sempre `loadingInitial` (não `loading`) do `UserContext` para proteger rotas privadas.
- `loadingInitial` garante que a sessão foi restaurada antes de decidir pelo redirect.

### 3. SEO & MusicEvent (Schema JSON-LD)
Para eventos de música (`MusicEvent`), os seguintes campos são **obrigatórios** para evitar erros no Search Console:
- `eventStatus`, `endDate`, `location.address`, `description`, `image`, `offers`, `performer`.

### 4. GamiPress & PHP
- `gamipress_get_rank_types()` e similares retornam arrays associativos.
- **LEI:** Use sempre `array_values($array)[0]` ou `reset($array)` para acessar o primeiro elemento. Nunca use `$array[0]` direto.

---

## 📂 Organização
- **`.agents/`**: Personas e Skills especializadas.
- **`.context/`**: Conhecimento técnico de domínio.
- **`.human/`**: Backlog para o Orquestrador Humano.
- **`LEARNINGS.md`**: Anti-erros e lições aprendidas.

*Assinado: Zen Eyer — Orquestrador Humano*
