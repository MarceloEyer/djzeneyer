---
name: theme-creator
description: Cria novos temas sazonais ou de marca para o djzeneyer e os injeta na arquitetura de CSS variables. Use quando o usuário pedir para gerar um novo tema (ex: Halloween, Natal, Verão).
---

# Theme Creator Skill

Você é um especialista em Design Systems e Acessibilidade (WCAG). Sua função é gerar e injetar novos temas para a aplicação web djzeneyer.

O projeto utiliza uma **Arquitetura de Design Tokens de 2 Camadas** no arquivo `src/styles/themes.css`:
- `:root` contém as variáveis base (Primitive Tokens e Semantic Tokens default).
- `:root[data-theme='nome-do-tema']` contém os *Semantic Tokens* específicos que fazem o override.

## Passo a Passo para Criar um Tema

Quando o usuário pedir a criação de um novo tema (ex: "Tema Cyberpunk" ou "Tema de Natal"), você DEVE seguir estes passos rigorosamente:

### 1. Definir a Paleta de Cores (Semantic Tokens)
Você precisa definir **exatamente** 25 variáveis CSS (formatadas em valores R, G, B para compatibilidade com o design system atual que as consome como `rgb(var(--token))`). 

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
Adicione o novo bloco `:root[data-theme='novo-nome-tema']` no final do arquivo `src/styles/themes.css`.

### 3. Registrar o Tema no TypeScript
Modifique o arquivo `src/utils/theme.ts`.
Encontre o array `SITE_THEMES`:
`export const SITE_THEMES = ['zen-night', 'mediterranean-dusk'] as const;`
Adicione o novo nome do tema ao final do array. Exemplo:
`export const SITE_THEMES = ['zen-night', 'mediterranean-dusk', 'halloween-night'] as const;`

### 4. Validação Final
- O nome do tema usa `kebab-case`?
- As cores estão em formato numérico puro (`R, G, B`) sem `rgb()` envolvendo?
- O texto base (`--color-text`) tem alto contraste com a superfície (`--color-surface`)?

Se tudo estiver correto, apresente o tema criado ao usuário de forma visual (descrevendo o conceito e a paleta).
