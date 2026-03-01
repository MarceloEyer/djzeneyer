# Relatório de Atualização de Dependências

Este documento detalha as atualizações de segurança e manutenção realizadas em Q1 2026 para o projeto **DJ Zen Eyer**.

## Dependências npm (Vite & Frontend)

As atualizações focaram na resolução de vulnerabilidades High (XSS no React Router) e Moderate (esbuild no server de dev), além de manter a paridade de versões entre o subprojeto `zen-zouk-plugin` e o root.

| Pacote | Versão Anterior | Versão Atual | Motivo |
| :--- | :--- | :--- | :--- |
| `vite` | ^5.4.21 | ^7.0.0 | Segurança (esbuild) e performance |
| `react-router-dom` | ^7.0.0 | ^7.13.0 | Segurança (XSS) e estabilidade |
| `framer-motion` | 11.18.2 | ^12.34.2 | Novas features e correções |
| `lucide-react` | 0.562.0 | ^0.574.0 | Paridade de ícones |
| `i18next` | 25.8.0 | ^25.8.11 | Manutenção i18n |
| `@tanstack/react-query` | 5.90.14 | ^5.90.21 | Estabilidade de cache |

## Dependências PHP (Backend)

| Pacote | Versão Anterior | Versão Atual | Motivo |
| :--- | :--- | :--- | :--- |
| `firebase/php-jwt` | ^6.10 | ^7.0 | Segurança (Weak Encryption Fix) |
| `PHP` | >=7.4 | >=8.0 | Requisito do plugin e performance |

## Observações de Build
- O projeto mantém o **ESLint 9.39.2** por compatibilidade de plugins React.
- O build de produção deve rodar `npm run build:full` para gerar sitemaps e arquivos pré-renderizados.
