# 🎯 Zen Zouk - Plugin Gamificado de Conexão Social

Plugin gamificado para ensinar progressão de habilidades sociais e de dança zouk através de micro-desafios diários baseados em psicologia e neurociência.

## ✨ Features Implementadas

### ✅ MVP Completo
- **Sistema de Dados**: LocalStorage com types TypeScript
- **21 Desafios do Nível 1**: "Olhar e Presença" com teoria científica
- **Home/Dashboard**: Desafio do dia, progresso, estatísticas
- **Página de Desafio**: Missão, teoria, reflexão pessoal
- **Sistema de XP e Streak**: Gamificação completa
- **14 Badges**: Conquistas desbloqueáveis
- **Modal de Boas-vindas**: First-time experience
- **Navegação Bottom Nav**: Mobile-first
- **Animações Framer Motion**: Micro-interações suaves
- **Design System**: Tailwind CSS customizado

### 🎨 Design
- Paleta: Roxo (#8B5CF6), Rosa (#EC4899), Fundo escuro (#1F2937)
- Tipografia: Inter (UI) + Poppins (Display)
- Componentes reutilizáveis
- Responsivo mobile-first

### 📊 Sistema de Dados
```typescript
{
  userProgress: {
    currentLevel: 1,
    currentDay: 1,
    totalXP: 0,
    streak: 0,
    lastActivityDate: null
  },
  completedChallenges: [],
  badges: []
}
```

## 🚀 Como Rodar

```bash
cd zen-zouk-plugin
npm install
npm run dev
```

Acesse: [https://3000--019ac34b-d1b8-76a0-a714-855311c89515.us-east-1-01.gitpod.dev](https://3000--019ac34b-d1b8-76a0-a714-855311c89515.us-east-1-01.gitpod.dev)

## 📱 Estrutura de Páginas

- `/` - Home/Dashboard
- `/desafio` - Desafio do dia
- `/niveis` - Lista de níveis (placeholder)
- `/journal` - Histórico de reflexões (placeholder)
- `/badges` - Coleção de badges (placeholder)
- `/config` - Configurações (placeholder)

## 🎯 Próximos Passos

### Páginas Faltantes
- [ ] Tela de Níveis completa
- [ ] Tela de Journal com calendário
- [ ] Tela de Badges com grid
- [ ] Tela de Configurações

### Features Adicionais
- [ ] PWA (manifest.json + service worker)
- [ ] Notificações Web API
- [ ] Export/Import de dados
- [ ] Desafios dos Níveis 2-5
- [ ] Animações de conquista de badge
- [ ] Gráficos de progresso

### Melhorias
- [ ] Testes unitários
- [ ] Acessibilidade (ARIA labels)
- [ ] Dark/Light mode toggle
- [ ] Internacionalização (i18n)

## 🧠 Níveis do Programa

1. **👁️ Olhar e Presença** (21 dias) - ✅ Completo
2. **💬 Conexão Verbal** (21 dias) - Pendente
3. **🤝 Toque Social** (21 dias) - Pendente
4. **💃 Conexão de Dança** (21 dias) - Pendente
5. **✨ Intimidade Artística** (21 dias) - Pendente

## 🏆 Sistema de Badges

- 🔥 Começou a Jornada
- ⚡ 3 Dias Seguidos
- 💪 7 Dias Seguidos
- 🌟 Completou Nível 1
- 🎯 30 Dias no Total
- 🚀 14 Dias Seguidos
- 💬 Completou Nível 2
- 💎 21 Dias Seguidos
- 🤝 Completou Nível 3
- 🎪 50 Dias no Total
- 💃 Completou Nível 4
- ✨ Completou Nível 5
- 🏆 Jornada Completa
- 📝 Pensador Profundo

## 📦 Tech Stack

- React 18 + TypeScript
- Vite
- React Router DOM
- Framer Motion
- Tailwind CSS
- Lucide React (ícones)
- date-fns

## 📄 Licença

Propriedade de DJ Zen Eyer - Todos os direitos reservados
