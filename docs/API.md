# 📡 DJ Zen Eyer - API Reference

This document details the REST API endpoints available for the Headless React frontend.

**Base URL:** `https://djzeneyer.com/wp-json/djzeneyer/v1`

**Authentication:**
Most GET endpoints are public. POST endpoints or user-specific data require authentication (JWT or Nonce).

---

## 🎮 Gamification & Activity

These endpoints provide user statistics, recent activity, and gamification data. They are powered by the **Zen-RA** engine but exposed via the theme's API Dashboard.

### 1. User Activity Feed
Returns a unified feed of recent activities (WooCommerce orders + GamiPress achievements).

- **Endpoint:** `GET /activity/{user_id}`
- **Response:**
  ```json
  {
    "success": true,
    "activities": [
      {
        "id": "ord_123",
        "type": "loot",
        "description": "Order #123",
        "xp": 50,
        "timestamp": 1709856000
      },
      {
        "id": "ach_45",
        "type": "achievement",
        "description": "First Login",
        "xp": 10,
        "timestamp": 1709855000
      }
    ]
  }
  ```

### 2. User Stats (Points & Rank)
Returns the user's current points, level, and rank progress.

- **Endpoint:** `GET /gamipress/{user_id}`
- **Response:**
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

### 3. Login Streak
Returns the current consecutive login streak count.

- **Endpoint:** `GET /streak/{user_id}`
- **Response:**
  ```json
  {
    "success": true,
    "streak": 5
  }
  ```

### 4. Purchased Tracks
Returns purchased products from "Music" category.

- **Endpoint:** `GET /tracks/{user_id}`

### 5. Purchased Events
Returns purchased products from "Events" category.

- **Endpoint:** `GET /events/{user_id}`

---

## 🛍️ E-Commerce & Content

### 1. Menu
Returns the WordPress menu structure.

- **Endpoint:** `GET /menu`
- **Params:** `?lang=en` (or `pt`)

### 2. Products
Returns WooCommerce products with optimized images.

- **Endpoint:** `GET /products`
- **Params:**
  - `?lang=en`
  - `?slug={slug}` (fetch single product)

---

## 👤 User & Profile

### 1. Update Profile
Updates user profile fields.

- **Endpoint:** `POST /user/update-profile`
- **Auth:** Required (Cookie/Nonce or JWT)
- **Body:**
  ```json
  {
    "displayName": "New Name"
  }
  ```

### 2. Newsletter Subscription
Subscribes an email to the MailPoet list.

- **Endpoint:** `POST /subscribe`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

---

## ⚠️ Error Handling

- **404 Not Found**: Endpoint does not exist or Resource not found.
- **500 Internal Server Error**: Server-side error.
- **Response Structure**:
  Errors often return a JSON object with `code`, `message`, and `data`.
  ```json
  {
    "code": "invalid_user",
    "message": "Invalid user ID",
    "data": { "status": 400 }
  }
  ```
- **Gamification Errors**:
  The Gamification endpoints (`/activity`, etc.) implement robust `try-catch` blocks. If the underlying engine fails, they return an empty result (e.g., `activities: []`) to prevent crashing the frontend.

---

## 🛠️ Troubleshooting

- **Namespace Error**:
  ❌ DO NOT use `/zen-ra/v1/*`. This does not exist.
  ✅ ALWAYS use `/djzeneyer/v1/*`.

- **Cache Issues**:
  Data is cached for performance (usually 10-15 mins). If changes aren't visible immediately, use the "Clear Cache" button in WP Admin or wait for the TTL to expire.
