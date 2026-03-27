# AGENTS.md - DJ Zen Eyer

> Instruções operacionais para agentes de IA neste repositório.
> Idioma padrão: Português Brasileiro.

## Precedência
- Em caso de conflito, seguir esta ordem:
  1. Código real do repositório
  2. `AI_CONTEXT_INDEX.md`
  3. Este arquivo (`AGENTS.md`)
  4. Documentação específica em `docs/*`
  5. Skills e guias auxiliares

## Resumo do Projeto
- Site/plataforma oficial do DJ Zen Eyer
- Arquitetura: WordPress Headless + React SPA
- Produção: https://djzeneyer.com

## Stack canônica
- Frontend: React 19, TypeScript strict, Vite 8, Tailwind 4, React Query v5, React Router 7, i18next
- Backend: WordPress 6.0+, PHP 8.1+, WooCommerce, GamiPress
- Plugins customizados ativos no repo: `zeneyer-auth`, `zen-seo-lite`, `zen-bit`, `zengame`
- Infra: Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions
- Node: 20+

## Regras operacionais
1. Todo texto visível deve usar i18n (`t('chave')`) em PT/EN
2. SEO por página deve usar `HeadlessSEO`
3. Páginas devem seguir lazy loading quando compatível com a arquitetura existente
4. Data fetching no frontend deve preferir hooks centralizados e React Query
5. Evitar `fetch()` direto em componentes de página, salvo exceção intencional e documentada
6. Filtragem pesada deve preferir backend
7. PHP deve usar sanitização, escaping e queries preparadas
8. Nunca commitar segredos
9. Não atualizar ESLint para v11+
10. Não reintroduzir **music player embutido** no site sem decisão explícita
11. Arquivos de tradução em `src/locales/**/*.json` devem ser editados em UTF-8. Se houver dúvida com emoji, travessão, reticências, `©` ou `×`, usar escape Unicode JSON em vez de gravar texto com encoding duvidoso.
12. Após editar locales, verificar se não entrou mojibake (`Ã`, `â`, `ðŸ`, `Â©`) e rodar pelo menos `npm run build`.

## Regras de design e UX
1. Direcao: Premium Contemporaneo + Imersao MMORPG.
2. Referencia: Paginas **Zen Tribe** e **Dashboard** sao os padroes de qualidade.
3. Foco: HUDs, indicadores de progresso, micro-animacoes e **Azul Eletrico**.
4. **PROIBIDO**: Gradiente chamativo em titulos principais e layouts estilo "template genérico".
5. Em caso de dúvida, imitar a sofisticacao da Zen Tribe.

## Governança de contexto
- Mudanças relevantes de arquitetura, API, fluxo, identidade pública, SEO estrutural, segurança ou deploy devem atualizar o contexto no mesmo trabalho
- Se a mudança não exigir atualização de contexto, registrar explicitamente que nenhuma atualização foi necessária

## Verificação local
```bash
npm run lint
npm run build
```
