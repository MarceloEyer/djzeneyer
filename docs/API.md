# 📡 Referência de API — DJ Zen Eyer

Endpoints REST disponíveis para o frontend React headless.

**URL Base:** `https://djzeneyer.com/wp-json/djzeneyer/v1`

**Autenticação:** Endpoints GET são públicos. Endpoints POST ou dados de usuário requerem JWT ou Nonce.

---

## 🎮 Gamificação e Atividade

Endpoints de estatísticas, atividade recente e gamificação. Alimentados pelo engine **Zen-RA** e expostos via API do tema.

### 1. Feed de Atividade do Usuário
Retorna feed unificado de atividades recentes (pedidos WooCommerce + conquistas GamiPress).

- **Endpoint:** `GET /activity/{user_id}`
- **Resposta:**
  ```json
  {
    "success": true,
    "activities": [
      {
        "id": "ord_123",
        "type": "loot",
        "description": "Pedido #123",
        "xp": 50,
        "timestamp": 1709856000
      }
    ]
  }
  ```

### 2. Estatísticas do Usuário (Pontos e Rank)
- **Endpoint:** `GET /gamipress/{user_id}`
- **Resposta:**
  ```json
  {
    "success": true,
    "data": {
      "points": 1250,
      "level": 2,
      "rank": "Zen Adept",
      "nextLevelPoints": 2000,
      "progressToNextLevel": 25,
      "achievements": [...]
    }
  }
  ```

### 3. Sequência de Login (Streak)
- **Endpoint:** `GET /streak/{user_id}`

### 4. Faixas Compradas
- **Endpoint:** `GET /tracks/{user_id}`

### 5. Eventos Comprados
- **Endpoint:** `GET /events/{user_id}`

---

## 🛍️ E-Commerce e Conteúdo

### 1. Menu
- **Endpoint:** `GET /menu`
- **Parâmetros:** `?lang=en` ou `?lang=pt`

### 2. Produtos
- **Endpoint:** `GET /products`
- **Parâmetros:** `?lang=en`, `?slug={slug}`

---

## 👤 Usuário e Perfil

### 1. Atualizar Perfil
- **Endpoint:** `POST /user/update-profile`
- **Auth:** Obrigatória (Cookie/Nonce ou JWT)
- **Body:**
  ```json
  { "displayName": "Novo Nome" }
  ```

### 2. Inscrição na Newsletter
- **Endpoint:** `POST /subscribe`
- **Body:**
  ```json
  { "email": "usuario@exemplo.com" }
  ```

---

## 🔐 Autenticação (ZenEyer Auth)

**Namespace:** `zeneyer-auth/v1`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Login com email/senha |
| POST | `/register` | Registro de novo usuário |
| POST | `/google-login` | Login com Google OAuth |
| POST | `/refresh` | Renovar JWT |
| POST | `/logout` | Logout |
| GET | `/validate` | Validar token JWT |

---

## ⚠️ Tratamento de Erros

Erros retornam JSON com `code`, `message` e `data`:
```json
{
  "code": "invalid_user",
  "message": "ID de usuário inválido",
  "data": { "status": 400 }
}
```

Endpoints de gamificação usam `try-catch` e retornam resultado vazio (ex: `activities: []`) em caso de falha para não quebrar o frontend.

---

## 🛠️ Solução de Problemas

- **Namespace errado:**
  ❌ NÃO use `/zen-ra/v1/*`
  ✅ SEMPRE use `/djzeneyer/v1/*`

- **Cache:** Dados ficam em cache por 10-15 min. Use "Limpar Cache" no WP Admin ou aguarde o TTL expirar.

---

**Atualizado:** Fevereiro 2026
