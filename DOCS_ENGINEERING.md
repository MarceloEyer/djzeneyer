# Zen Eyer Project: Engineering Standards & AI Directives
Version: 1.0.0

Este documento estabelece as regras invioláveis de engenharia, identidade e fluxo de trabalho para o projeto **Zen Eyer**. Todas as IAs, bots (Claude, Gemini, CodeRabbit, etc.) e desenvolvedores humanos devem aderir estritamente a estas diretrizes.

---

## 1. Princípios Fundamentais (Frameworks)

### 1.1 DRY, KISS & YAGNI
- **DRY (Don't Repeat Yourself):** Não duplique lógica de tradução ou formatação. Use Hooks e Utils centralizados.
- **KISS (Keep It Simple, Stupid):** Prefira soluções diretas. Evite overengineering que possa causar falhas de carregamento (como erros 429).
- **YAGNI (You Aren't Gonna Need It):** Não implemente funcionalidades ou nós de schema "para o futuro". Foque no Must Have.

### 1.2 SOLID & SSOT
- **SSOT (Single Source of Truth):** A única fonte de verdade para dados do artista é `src/data/artistData.ts`. Para rotas, `src/config/routes.ts`. Nunca use strings hardcoded.
- **SRP (Single Responsibility):** Cada componente e PR deve ter uma única responsabilidade. Não misture otimização técnica com mudanças de conteúdo/identidade.

---

## 2. Identidade Autoritativa (Canonical)

### 2.1 Nomenclatura Estrita
- **Nome Canônico:** `Zen Eyer` (Sempre com espaço, sem variações).
- **Alias Oficial:** `DJ Zen Eyer`.
- **Proibido:** `Zen Ayer` (NÃO deve constar em `alternateName` ou metadados, exceto se houver uma estratégia de SEO explicitamente discutida para captura de typos em campos específicos).
- **Tautologia:** Evite descrições como "Zen Eyer, também conhecido como Zen Eyer". Se o alias for o mesmo que o nome, não o liste como alternateName.

### 2.2 Localização (i18n)
- Mantenha paridade absoluta entre `en` e `pt`.
- O nome do artista deve ser consistente: Se decidiu por `Zen Eyer` como primário, use-o em ambos os idiomas no `common.artist_name`.

---

## 3. Qualidade & Integridade de Código

### 3.1 Schema.org
- Siga estritamente a documentação oficial. 
- **Erro Proibido:** Não insira propriedades personalizadas (como `faq`) dentro de tipos que não as suportam (como `Occupation`).
- Use `@id` para vincular entidades ao Knowledge Graph oficial (`/#artist`, `/#musicgroup`).

### 3.2 Higiene de Texto
- **Zero Mojibake:** Certifique-se de que caracteres especiais (como ©) não sejam corrompidos em `Â©`. Use codificação UTF-8.
- **Lint:** O código deve passar em todos os testes de lint (`npm run lint`). Não ignore avisos de dependências em Hooks (`useMemo`, `useEffect`).

---

## 4. Fluxo de Trabalho (Workflow)

### 4.1 Pull Request First
- **Proibição de Push Direto:** Jamais realize `git push` diretamente para a branch `main`.
- **PRs Atômicos:** Um PR para cada funcionalidade. Isso facilita revisões de bots (CodeRabbit) e humanos.
- **Sincronismo de Lockfile:** Toda alteração no `package.json` DEVE vir acompanhada da atualização correspondente no `package-lock.json`.

### 4.2 CI/CD
- O build (`npm run build`) deve passar obrigatoriamente antes de qualquer tentativa de integração.
- Vulnerabilidades de segurança reportadas pelo `npm audit` devem ser tratadas antes do deploy.

---

## 5. Parceria AI-Humano
- **Sem Suposições:** Em caso de dúvida sobre identidade, copy ou arquitetura, a IA deve **perguntar** antes de agir.
- **Egoísmo Zero:** O objetivo é a saúde do projeto e a clareza para a equipe, não apenas "resolver o ticket" da forma mais rápida.
