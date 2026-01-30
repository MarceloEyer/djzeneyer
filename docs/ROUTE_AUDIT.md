# Auditoria de Rotas e Internacionalização (i18n)
**Data:** 20 de Maio de 2024
**Escopo:** `src/config/routes.ts`, `src/pages/`, e uso de componentes `<Link>`.

## 1. Tabela de Sincronia (WordPress/Polylang)

A tabela abaixo lista todas as rotas definidas no frontend. **O WordPress deve ter páginas correspondentes com estes exatos slugs** para garantir que o roteamento Headless funcione corretamente.

| Página (Componente) | Slug EN (Inglês) | Slug PT (Português) | Ação Requerida no WordPress |
| :--- | :--- | :--- | :--- |
| `HomePage` | `/` (home) | `/` (home) | Garantir Home traduzida |
| `AboutPage` | `about` | `sobre` | Traduzir Slug |
| `EventsPage` | `events` | `eventos` | Traduzir Slug |
| `MusicPage` | `music` | `musica` | Traduzir Slug |
| `NewsPage` | `news` | `noticias` | Traduzir Slug (Página Blog) |
| `ZenTribePage` | `zentribe` | `tribo-zen` | Traduzir Slug |
| `PressKitPage` | `work-with-me` | `trabalhe-comigo` | Traduzir Slug |
| `ShopPage` | `shop` | `loja` | Traduzir Slug (Página Loja) |
| `CartPage` | `cart` | `carrinho` | Traduzir Slug |
| `CheckoutPage` | `checkout` | `finalizar-compra` | Traduzir Slug |
| `TicketsPage` | `tickets` | `ingressos` | Criar página/Traduzir Slug |
| `TicketsCheckoutPage` | `tickets-checkout` | `finalizar-ingressos` | Criar página/Traduzir Slug |
| `DashboardPage` | `dashboard` | `painel` | Traduzir Slug |
| `MyAccountPage` | `my-account` | `minha-conta` | Traduzir Slug |
| `FAQPage` | `faq` | `perguntas-frequentes` | Traduzir Slug |
| `PhilosophyPage` | `my-philosophy` | `minha-filosofia` | Traduzir Slug |
| `MediaPage` | `media` | `na-midia` | Traduzir Slug |
| `SupportArtistPage` | `support-the-artist` | `apoie-o-artista` | Traduzir Slug |
| `PrivacyPolicyPage` | `privacy-policy` | `politica-de-privacidade` | Traduzir Slug |
| `ReturnPolicyPage` | `return-policy` | `reembolso` | Traduzir Slug |
| `TermsPage` | `terms` | `termos` | Traduzir Slug |
| `CodeOfConductPage` | `conduct` | `regras-de-conduta` | Traduzir Slug |

---

## 2. Alertas de Integridade (Código)

### A. Links "Hardcoded" (Risco de i18n)
Foram encontrados links no código que apontam diretamente para a versão em Inglês. Se um usuário estiver navegando em Português (`/pt/`), clicar nestes links o levará para a versão em Inglês, perdendo o contexto de idioma.

**Recomendação:** Refatorar para usar helpers dinâmicos ou `buildFullPath`.

*   **`src/components/common/Footer.tsx`**:
    *   `/events/`
    *   `/music/`
    *   `/zentribe/`
    *   `/shop/`
    *   `/about/`
    *   `/news/`
    *   ... (e outros links do rodapé)
*   **`src/components/common/UserMenu.tsx`**:
    *   `/dashboard/`
    *   `/my-account/`
*   **`src/pages/EventsPage.tsx`**:
    *   `/work-with-me`
    *   `/shop`

### B. Rotas Dinâmicas não Implementadas
As seguintes rotas existem em `src/config/routes.ts` e possuem links na interface, mas **os componentes de destino ignoram o parâmetro da URL**, exibindo apenas a lista geral. Isso significa que clicar em um item detalhado apenas "recarrega" a lista.

| Rota | Componente | Status |
| :--- | :--- | :--- |
| `news/:slug` | `NewsPage` | **Crítico.** O código exibe links para posts individuais, mas o componente sempre renderiza a lista completa. |
| `music/:slug` | `MusicPage` | **Aviso.** O componente não verifica o `slug` para filtrar ou tocar uma faixa específica. |
| `events/:id` | `EventsPage` | **Aviso.** O componente lista todos os eventos e ignora o ID na URL. |

*Nota: A rota `shop/product/:slug` (`ProductPage`) está funcionando corretamente.*

## 3. Conclusão da Auditoria do `src/config/routes.ts`

O arquivo de configuração `src/config/routes.ts` está **correto e completo**.
*   Todas as páginas físicas (`src/pages/*.tsx`) estão mapeadas.
*   Todas as rotas possuem slugs em Português ("Clean URLs") definidos.
*   Não há necessidade de alteração neste arquivo. As correções necessárias são no nível dos componentes (`NewsPage`, `Footer`) e no painel do WordPress (criação de páginas).
