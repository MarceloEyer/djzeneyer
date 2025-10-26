# Configurações do Site DJ Zen Eyer

## 🌍 Cloudflare
- **Redirecionamento HTTPS**: Ativo (Page Rule).
- **Redirecionamento WWW**: Ativo (Page Rule).
- **Proteção contra Bots**: Ativa.
- **Cache de Edge**: Desativado (usamos Quic.cloud para cache).

## ⚡ Quic.cloud
- **Cache de Páginas**: Ativo (TTL: 1 dia).
- **Otimização de Imagens**: Ativa (lossless).
- **Compressão Brotli**: Ativa.

## 📄 .htaccess
- **CORS**: Configurado para frontend React.
- **Bloqueio de PHP em Uploads**: Ativo.
- **Headers de Segurança**: Configurados.

## 🔧 LiteSpeed Cache
- **Cache de Objetos**: Ativo.
- **Otimização de CSS/JS**: Ativa.
