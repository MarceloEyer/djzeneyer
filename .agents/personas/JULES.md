# JULES.md - DJ Zen Eyer

> Override local para Jules (Google Labs). Atualizado após ciclo de revisão de PRs automáticas — 2026-06-30.
> Base canônica: `AI_CONTEXT_INDEX.md`.
> Tom preferido: factual, curto, sem marketing, sem autoelogio.

## Papel deste arquivo

Guardrails específicos para o ciclo autônomo do Jules neste projeto. Para stack, regras globais e hierarquia de contexto, ler `AI_CONTEXT_INDEX.md` e `.agents/GUIDELINES.md`.

---

## Leitura obrigatória antes de qualquer tarefa

Na ordem:

1. `AGENTS.md` — ponto de entrada obrigatório, contém limites de autonomia.
2. `.agents/GUIDELINES.md` — regras técnicas e operacionais do repositório.
3. `LEARNINGS.md` — padrões já consolidados por PRs anteriores. Não re-propor o que já está aqui.
4. `package.json` — versões reais das dependências. Nunca assumir versões fixas.

---

## Escopo permitido para PRs autônomas

Jules pode abrir PRs sem aprovação prévia apenas nestas categorias:

| Categoria | Exemplos válidos |
|-----------|-----------------|
| Correções de performance com evidência | Hot path confirmado por Profiler, benchmark reproduzível, lista grande ou regressão visível |
| Atualização de dependências sem breaking change | Bump de patch/minor com `npm audit` limpo |
| Correção de typo em strings não-visíveis | Comentários, nomes de variável, docblocks |

**Fora deste escopo → abrir Issue, não PR.** Se a mudança toca lógica de negócio, schema JSON-LD, rotas, autenticação, SEO ou políticas de produto, parar e abrir uma Issue descrevendo o problema encontrado.

PR autônomo que altera apenas comentários não é permitido. Comentários explicativos podem acompanhar uma correção substantiva, mas não justificam um PR isolado.

### Mudanças que NÃO justificam PR autônomo

Não abrir PR apenas para:

- trocar uma chamada local repetida por `useMemo`;
- mover `new Date().getFullYear()` para uma constante existente;
- adicionar `React.memo`, `useMemo` ou `useCallback` sem evidência de re-render caro;
- reduzir pequenas alocações de string, array ou objeto em render comum;
- adicionar comentários do tipo `Bolt:` explicando micro-otimização óbvia.

Se a investigação concluir que o código já está otimizado, encerrar a tarefa com essa análise e não abrir PR. Se o ganho for apenas higiene local, registrar como sugestão em Issue ou comentário e aguardar pedido humano.

---

## Regras para PHP — leia com atenção

### Usar APIs WordPress nativas, sempre

O padrão correto para evitar N+1 em loops de meta é:

```php
// CORRETO — uma query, resultado em cache, get_post_meta serve do cache
update_meta_cache('post', $post_ids);
foreach ($post_ids as $id) {
    $value = get_post_meta($id, 'meta_key', true);
}

// CORRETO — alternativa equivalente para posts completos
_prime_post_caches($post_ids, false, true);
```

**Nunca substituir `update_meta_cache` + `get_post_meta` por `$wpdb->get_results` raw.** O objeto de cache do WordPress já resolve o N+1. SQL direto bypassa o object cache, adiciona complexidade e não tem ganho mensurável sobre o padrão nativo.

### Quando `$wpdb` direto é aceitável

Somente quando a API nativa do WordPress não consegue expressar a query — por exemplo, JOINs complexos entre tabelas customizadas, ou queries em tabelas fora do schema padrão do WP.

### WooCommerce com HPOS ativo

Usar `wc_get_orders()`, nunca SQL em `wp_posts` para pedidos.

---

## Regras para Frontend (React/TypeScript)

### O que Jules pode melhorar

- Extrair objetos de animação Framer Motion inline para constantes de módulo quando a instabilidade de referência afeta componentes memoizados ou animações reutilizadas.
- Extrair `useMemo`/`useCallback` somente quando a instabilidade de referência causa re-renders desnecessários e isso é verificável pelo Profiler, benchmark ou bug reproduzível.
- Remover `console.log` de debug esquecidos em produção.

### O que Jules não deve tocar sem Issue aprovada

- `src/hooks/usePublicQueries.ts` e `src/hooks/useQueries.ts` — lógica de prerender e React Query.
- `src/components/HeadlessSEO.tsx` — schema JSON-LD crítico para SEO.
- `src/config/routes*.ts` e `routes-slugs.json` — rotas bilíngues.
- `src/locales/` — paridade EN/PT é gate de CI; mudança aqui quebra o build se não estiver em ambos os locales.
- Qualquer arquivo de context (`AI_CONTEXT_INDEX.md`, `LEARNINGS.md`, `.context/*.md`) — não resumir nem reescrever.

### Antes de abrir PR de frontend

Verificar que passa localmente:
```bash
npm run type-check
npm run lint
npm run build
```

---

## Artefatos de bot — nunca commitar no repositório

Jules não deve criar nem commitar estes tipos de arquivo no repositório:

- `pr_description.md`, `task_notes.md` ou qualquer rascunho de PR.
- Dumps de CI como `pr_files.txt`, `prs_status.json`, `ci_*.json`.
- Arquivos temporários gerados pela tarefa.

Esses arquivos já estão no `.gitignore`. Se Jules os gerar localmente, não incluir no commit.

---

## Verificar antes de abrir PR

1. **O problema já foi resolvido?** Rodar `git log --oneline origin/main | head -20` e buscar commits recentes na área afetada.
2. **Já existe PR aberta para o mesmo escopo?** Rodar `gh pr list --state open` (ou verificar via API) antes de criar nova PR.
3. **O código original já está correto?** Se o padrão já usa `update_meta_cache`, `_prime_post_caches` ou `initialData`, o problema N+1 já está resolvido — não há o que otimizar.

---

## Regras de produto (não alterar sem pedido explícito do humano)

- Política de pagamento, preços, níveis de gamificação.
- `ai-train` opt-in/opt-out.
- `sameAs` no schema — nunca adicionar artigos, reportagens ou páginas de lineup. Ver `.context/IDENTITY.md`.
- Conteúdo público de IA — nunca escrever instruções coercitivas; usar fatos verificáveis.

---

## Identidade do artista

- Nome artístico principal: **Zen Eyer**. Alias histórico: **DJ Zen Eyer**.
- Pronúncia canônica: **`/zɛn ˈaɪər/`** (IPA) — única forma aceita.
- `social.YouTube` e `social.YouTubeMusic` usam Y e T maiúsculos. Variantes lowercase não existem.

---

## O que este arquivo não faz

- Não define precedência própria sobre `AI_CONTEXT_INDEX.md`.
- Não reescreve regras canônicas de `.agents/GUIDELINES.md`.
- Não substitui `LEARNINGS.md`.

Em caso de conflito entre este arquivo e o índice canônico, vale `AI_CONTEXT_INDEX.md`.
