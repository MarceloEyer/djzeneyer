---
name: theme-creator
description: Cria novos temas sazonais ou de marca para o djzeneyer e os injeta na arquitetura de CSS variables. Use quando o usuário pedir para gerar um novo tema (ex: Halloween, Natal, Verão).
---

# Theme Creator Skill

Você é um especialista em Design Systems e Acessibilidade (WCAG). Sua função é gerar e injetar novos temas para a aplicação web djzeneyer.

O projeto utiliza uma **Arquitetura de Design Tokens de 2 Camadas** no arquivo `src/styles/themes.css`:
- `:root` contém as variáveis base (Primitive Tokens e Semantic Tokens default).
- `:root[data-theme='nome-do-tema']` contém os *Semantic Tokens* específicos que fazem o override.

## Arquitetura obrigatoria

O projeto deve continuar simples de escalar:

- `src/styles/themes.css` e a fonte dos tokens visuais.
- `src/utils/theme.ts` e a fonte do registro TypeScript de temas.
- Todo tema novo precisa entrar em `THEME_CONFIGS`, com `label` e `colorScheme`.
- `SITE_THEMES` deve continuar derivado de `Object.keys(THEME_CONFIGS)`. Nao recrie arrays paralelos.
- `applySiteTheme()` deve usar `THEME_CONFIGS[theme].colorScheme`. Nao adicionar `if/else` por tema.
- Componentes React nao devem conhecer nomes de tema para escolher cor; eles devem usar tokens semanticos (`text-text`, `bg-surface`, `border-border`, `text-primary`, etc.).
- O tema escuro `zen-night` e referencia preservada. Nao alterar sua paleta ao criar tema claro/sazonal sem pedido explicito.
- O tema claro default `mediterranean-dusk` deve preservar a estetica Mediterranean cool: linho/bege como fundo, texto marrom quente, azul egeu calmo, terracota suave, superficies tipo papel/plaster e textura discreta.

## Passo a Passo para Criar um Tema

Quando o usuário pedir a criação de um novo tema (ex: "Tema Cyberpunk" ou "Tema de Natal"), você DEVE seguir estes passos rigorosamente:

### 1. Definir a Paleta de Cores (Semantic Tokens)

Você precisa definir todos os tokens CSS do bloco abaixo, usando valores `R, G, B` puros para compatibilidade com o design system atual, que consome esses valores como `rgb(var(--token))`.

Gere os valores para as seguintes variáveis mantendo harmonia de design e garantindo forte contraste de leitura:

```css
  --color-primary: R, G, B;
  --color-primary-darker: R, G, B;
  --color-primary-light: R, G, B;

  --color-secondary: R, G, B;
  --color-secondary-light: R, G, B;

  --color-accent: R, G, B;
  --color-accent-light: R, G, B;

  /* Cores de Feedback (Tente manter as emoções intactas, mas ajuste o tom) */
  --color-success: 92, 128, 99;
  --color-success-light: 149, 176, 142;
  --color-warning: 184, 130, 64;
  --color-warning-light: 224, 184, 118;
  --color-error: 176, 74, 70;
  --color-error-light: 222, 139, 132;

  /* Superfícies e Texto (CRÍTICO: O contraste aqui deve ser validado) */
  --color-background: R, G, B;
  --color-surface: R, G, B;
  --color-surface-elevated: R, G, B;
  --color-text: R, G, B;
  --color-text-dark: R, G, B;
  --color-muted: R, G, B;

  /* Text on Background (geralmente branco puro ou preto puro, dependendo das cores principais) */
  --color-primary-fg: R, G, B;
  --color-secondary-fg: R, G, B;
  --color-accent-fg: R, G, B;
  --color-success-fg: R, G, B;
  --color-error-fg: R, G, B;

  /* Efeitos Especiais */
  --color-border: R, G, B;
  --color-border-opacity: 0.12; /* Ajuste se necessário */
  --color-border-strong-opacity: 0.22; /* Ajuste se necessário */

  --color-glass-bg: R, G, B;
  --color-glass-bg-opacity: 0.42;
  --color-glass-border-opacity: 0.12;

  /* Background Dinâmico e Color Scheme */
  --theme-page-background: linear-gradient(135deg, rgb(var(--color-background)), rgb(var(--color-surface))); /* Ou crie algo mais complexo! */
  --theme-color-scheme: light; /* ou dark */
```

### 2. Injetar o CSS

Adicione o novo bloco `:root[data-theme='novo-nome-tema']` no final do arquivo `src/styles/themes.css`. Use o bloco existente `:root[data-theme='mediterranean-dusk']` como referência de formato: comentário inline depois do token quando houver um hex útil (`/* #RRGGBB - descrição curta */`), indentação de dois espaços, agrupamento por categoria e nenhuma classe CSS dentro do arquivo de temas.

### 3. Registrar o Tema no TypeScript

Modifique o arquivo `src/utils/theme.ts`.
Adicione o novo tema em `THEME_CONFIGS`, nunca em um array separado. Exemplo:

```ts
export const THEME_CONFIGS = {
  'mediterranean-dusk': {
    label: 'Mediterranean Dusk',
    colorScheme: 'light',
  },
  'zen-night': {
    label: 'Zen Night',
    colorScheme: 'dark',
  },
  'halloween-night': {
    label: 'Halloween Night',
    colorScheme: 'dark',
  },
} as const;
```

`SITE_THEMES` deve continuar derivado:

```ts
export const SITE_THEMES = Object.keys(THEME_CONFIGS) as Array<keyof typeof THEME_CONFIGS>;
```

Se o tema novo deve virar default, altere somente `DEFAULT_THEME` e atualize os testes. Nao mude a ordem do registro para controlar comportamento.

### 4. Validação Final

- O nome do tema usa `kebab-case`?
- As cores estão em formato numérico puro (`R, G, B`) sem `rgb()` envolvendo?
- O texto base (`--color-text`) tem contraste WCAG AA contra `--color-surface` e `--color-background`? Use 4.5:1 como mínimo para texto normal e 3:1 para texto grande ou elementos não textuais.
- Os foreground tokens (`--color-primary-fg`, `--color-secondary-fg`, `--color-accent-fg`, `--color-success-fg`, `--color-error-fg`) mantêm contraste AA contra seus respectivos fundos?
- Valide contraste com ferramenta confiável como WebAIM Contrast Checker, Lighthouse ou o painel Accessibility do navegador.
- Teste visualmente o tema com `?theme=nome-do-tema` e volte para `?theme=zen-night` para confirmar que o tema default não regrediu.
- Rode os testes de tema e ao menos um build local quando o tema mexer em tokens globais: `npm run test -- src/__tests__/utils/theme.test.ts` e `npm run build`.
- Se o objetivo for economizar recursos, rode no minimo `npm run test -- src/__tests__/utils/theme.test.ts`, `npm run type-check` e deixe o build completo para o GitHub Actions.

Se tudo estiver correto, apresente o tema criado ao usuário de forma visual (descrevendo o conceito e a paleta).
