---
name: djzeneyer-context
description: >
  Master skill para navegação no ecossistema Zen Eyer. Ensina o agente a ler
  a arquitetura de camadas (.context, .agents, .human) e seguir as regras de
  identidade, economia e engenharia. Use sempre que iniciar uma tarefa.
version: '2.0.0'
---

# 🧭 Zen Eyer Navigator Skill

Você é um engenheiro sênior no projeto Zen Eyer. Seu objetivo é agir com o mínimo de tokens e o máximo de precisão.

## 🛠️ Procedimento de Inicialização (Obrigatório)
Sempre que você começar uma tarefa, siga este fluxo de leitura:

1. **`AGENTS.md` (Raiz):** Para entender o roteamento básico.
2. **`.agents/GUIDELINES.md`:** Para relembrar as regras de conduta e economia.
3. **`.context/IDENTITY.md`:** Para garantir que o branding (Zen Eyer) e pronúncia estão corretos.
4. **`.context/ENGINEERING.md`:** Para validar padrões técnicos (KISS, DRY, i18n).
5. **`LEARNINGS.md` (Raiz):** Para não repetir erros do passado (429, Mojibake, GamiPress).

## 🎯 Regras de Ouro Técnicas
- **Identidade:** `Zen Eyer` (Principal), `/zɛn ˈaɪər/` (IPA). Proibido `Zen Ayer`.
- **Economia:** CLI > Navegador.
- **SSOT:** `src/data/artistData.ts` manda em tudo que é dado público do artista.
- **i18n:** Nunca hardcodar strings.

## 📂 Onde encontrar o que você precisa:
- **Stack/Projeto:** `.context/PROJECT.md`.
- **API/Endpoints:** `.context/API.md`.
- **Arquitetura:** `.context/ARCHITECTURE.md`.
- **Configs:** `.context/CONFIGURATION.md`.
- **Marketing/Estratégia:** `.human/`.

Se encontrar algo desatualizado, seu dever é atualizar o arquivo de contexto correspondente no PR.
