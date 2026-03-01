# Auditoria técnica do repositório (2026-02)

## Escopo analisado
- Frontend React/TypeScript (`src/`)
- Tema/integrações WordPress (`inc/` e `plugins/`)
- Build e automações (`scripts/`, `package.json`, `eslint.config.js`)
- Subprojeto `zen-zouk-plugin/`

## Diagnóstico rápido

### Pontos fortes ✅
1. Arquitetura SPA com páginas lazy-loaded e chunk split efetivo.
2. Internacionalização já estruturada (`src/locales/en` e `src/locales/pt`).
3. Separação clara de contextos (`User`, `Cart`, `MusicPlayer`, `GamiPress`).
4. Build de produção funcional e com compressão gzip ativa.

### Riscos observados ⚠️
1. **Lint quebrado no setup atual** (`eslint . --fix` falha por conflito com AJV/eslintrc).
2. **Arquivos de backup no source** (`*.tsx.bk`) adicionam ruído e risco de drift.
3. Bundle inicial ainda alto para mobile low-end (`index + vendor + motion + i18n`).
4. Warning de asset não resolvido em build (`/images/pattern.svg`).

---

## Recomendações priorizadas

| Prioridade | Tema | Ação sugerida | Ganho estimado |
|---|---|---|---|
| P0 | Qualidade de código | Corrigir incompatibilidade do lint (AJV/ESLint config) e travar versão validada no lockfile + CI gate obrigatório | Redução de regressão em PR em ~30-50% |
| P0 | Higiene do repositório | Remover arquivos backup `src/pages/HomePage.tsx.bk` e `src/pages/MusicPage.tsx.bk` | Menos ruído em revisão (~5-10% produtividade de review) |
| P1 | Performance de JS | Auditar imports de `lucide-react`/`framer-motion` em rotas críticas e mover animações pesadas para lazy boundary | Redução estimada de 80-180KB gzip no first load |
| P1 | i18n | Carregar namespaces de tradução por rota (split de dicionários) ao invés de bundle único | Redução de ~10-25KB gzip inicial |
| P1 | Robustez de assets | Resolver path de `/images/pattern.svg` com referência estática válida em Vite | Evita fallback runtime + melhora cache hit |
| P2 | React Query | Definir `staleTime`/`gcTime` por domínio de dado no `useQueries.ts` | Menos refetch desnecessário (até -20% requests em navegação) |
| P2 | WordPress REST | Padronizar cache headers/ETags em endpoints customizados | Redução de latência percebida em ~100-300ms em repetição |
| P3 | Observabilidade | Integrar Web Vitals + error tracking no frontend | Melhor MTTR e visibilidade de regressão real |

---

## Sugestões detalhadas (alto impacto)

### 1) Confiabilidade de CI/CD
- Adicionar pipeline com etapas separadas: `typecheck`, `lint`, `build`, `prerender`.
- Falhar PR automaticamente se qualquer etapa crítica quebrar.
- Publicar artifact com relatório de bundle por commit para comparação histórica.

### 2) Orçamento de performance (performance budget)
- Definir budget para arquivos críticos de entrada:
  - `index-*.js` <= 250KB gzip
  - `vendor-*.js` <= 45KB gzip
  - `motion-*.js` <= 25KB gzip (ou carregamento sob demanda)
- Bloquear merge se estourar budget em mais de 10%.

### 3) Data layer enterprise (React Query)
- Centralizar query keys em constantes tipadas.
- Aplicar política de retry por tipo de endpoint (ex.: catálogo vs auth).
- Prefetch de rotas de alta probabilidade (home -> eventos, home -> música).

### 4) Segurança WordPress headless
- Validar todas as callbacks REST com permissões explícitas e nonce/JWT quando aplicável.
- Revisar sanitização/escaping em plugins customizados para consistência.
- Adicionar checklist de segurança em release.

### 5) Governança de código
- Criar guideline de descontinuação de arquivos temporários/backup.
- Ativar inspeção automática para identificar arquivos não referenciados no build.
- Padronizar ownership de diretórios críticos (CODEOWNERS).

---

## Itens candidatos a exclusão (não utilizados)

1. `src/pages/HomePage.tsx.bk`
2. `src/pages/MusicPage.tsx.bk`

> Ambos não são importados pelo app e funcionam como backup histórico fora do fluxo de build.

---

## Próximos passos sugeridos (plano 30 dias)

### Semana 1
- Corrigir lint no ambiente atual e reabilitar gate no CI.
- Consolidar budgets de bundle e registrar baseline.

### Semana 2
- Refatorar carregamento de traduções por namespace/rota.
- Otimizar imports/uso de animações nas páginas mais acessadas.

### Semana 3
- Revisão de endpoints customizados WP (cache + segurança).
- Testes sintéticos de performance (Lighthouse CI).

### Semana 4
- Implantar observabilidade (Web Vitals + erros).
- Revisão final com métricas antes/depois e plano contínuo.
