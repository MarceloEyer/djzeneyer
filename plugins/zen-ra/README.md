# Zen-RA (Zen Recent Activity)

Plugin WordPress para API de histórico gamificado da Tribo Zen. Integra WooCommerce e GamiPress com narrativa épica.

## Features

✅ **REST API Endpoint** - `/wp-json/zen-ra/v1/activity/{user_id}`  
✅ **Gamificação** - Narrativa épica para compras e conquistas  
✅ **Segurança** - Usuário só vê própria atividade (ou admin)  
✅ **Performance** - Cache inteligente de 10 minutos  
✅ **Auto-clear** - Cache limpo automaticamente em novas atividades  
✅ **Configurável** - Limites e XP ajustáveis no admin  

## Installation

1. Upload `zen-ra` folder to `/wp-content/plugins/`
2. Activate plugin in WordPress admin
3. Go to **Zen Plugins** → **Zen-RA Activity**
4. Configure settings (optional)

## API Usage

### Get User Activity

```
GET /wp-json/zen-ra/v1/activity/{user_id}
```

**Authentication:** User must be logged in and viewing own activity (or be admin)

**Response:**
```json
{
  "success": true,
  "cached": false,
  "user_id": 1,
  "count": 3,
  "activities": [
    {
      "id": "order_123",
      "type": "loot",
      "title": "Adquiriu Artefato Musical",
      "description": "Ingresso VIP Festival",
      "xp": 50,
      "date": "2025-12-01 10:30:00",
      "timestamp": 1733053800,
      "meta": {
        "order_id": 123,
        "total": "150.00",
        "currency": "BRL",
        "status": "completed"
      }
    },
    {
      "id": "ach_456",
      "type": "achievement",
      "title": "Desbloqueou Conquista Épica",
      "description": "Membro da Tribo Zen",
      "xp": 100,
      "date": "2025-11-30 15:20:00",
      "timestamp": 1732984800,
      "meta": {
        "achievement_id": 789,
        "earning_id": 456,
        "post_type": "achievement"
      }
    }
  ]
}
```

### Clear Cache (Admin Only)

```
POST /wp-json/zen-ra/v1/clear-cache/{user_id}
```

## Activity Types

| Type | Title | Source | Icon |
|------|-------|--------|------|
| `loot` | Adquiriu Artefato Musical | WooCommerce Orders | 🎁 |
| `achievement` | Desbloqueou Conquista Épica | GamiPress | 🏆 |

## Configuration

### Cache Settings
- **Cache Duration:** 600 seconds (10 minutes) default
- Auto-cleared on new orders/achievements

### Activity Limits
- **Orders Limit:** 5 (recent WooCommerce orders)
- **Achievements Limit:** 5 (recent GamiPress achievements)
- **Total Limit:** 10 (maximum activities returned)

### XP/Points
- **Order XP:** 50 per completed order
- **Achievement XP:** 10 default (uses GamiPress points if available)

## Auto Cache Clearing

Cache is automatically cleared when:
- New WooCommerce order created
- Order status changes
- New GamiPress achievement awarded
- User points updated

## Security

- Users can only view their own activity
- Admins can view any user's activity
- Admins can clear cache via API
- All endpoints require authentication

## Requirements

- WordPress 5.0+
- PHP 7.4+
- WooCommerce (optional)
- GamiPress (optional)

## Frontend Integration

### React/TypeScript Example

```typescript
interface Activity {
  id: string;
  type: 'loot' | 'achievement';
  title: string;
  description: string;
  xp: number;
  date: string;
  timestamp: number;
  meta: any;
}

async function fetchUserActivity(userId: number): Promise<Activity[]> {
  const response = await fetch(
    `${wpData.restUrl}/zen-ra/v1/activity/${userId}`,
    {
      headers: {
        'X-WP-Nonce': wpData.nonce
      }
    }
  );
  
  const data = await response.json();
  return data.activities;
}
```

### Display Example

```tsx
function ActivityFeed({ userId }: { userId: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    fetchUserActivity(userId).then(setActivities);
  }, [userId]);
  
  return (
    <div className="activity-feed">
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <span className="icon">
            {activity.type === 'loot' ? '🎁' : '🏆'}
          </span>
          <div>
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <span className="xp">+{activity.xp} XP</span>
            <time>{new Date(activity.timestamp * 1000).toLocaleDateString()}</time>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Changelog

### 1.0.0 (2025-12-01)
- Initial release
- WooCommerce orders integration
- GamiPress achievements integration
- REST API endpoint
- Admin settings page
- Auto cache clearing
- Gamified narratives

## Author

**DJ Zen Eyer** - Two-time World Champion Brazilian Zouk DJ

## License

GPL v2 or later
