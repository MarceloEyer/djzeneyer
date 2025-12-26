// src/hooks/useUserStreak.ts
// v3.0 - GOLD MASTER: Real API + Standardized Structure for Dashboard

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext'; // Padronizado para useUser

interface StreakData {
  streak: number;
  lastLogin: string | null;
  fire: boolean; // Adicionado para o efeito visual de "Fogo" no Dashboard
}

// O Dashboard espera { data, loading }, então o hook não retorna a interface direta
export const useUserStreak = () => {
  const { user } = useUser();
  
  // Estado separado para Dados e Loading (Padrão Ouro)
  const [data, setData] = useState<StreakData>({ 
    streak: 0, 
    lastLogin: null,
    fire: false 
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchStreak = async () => {
      setLoading(true);
      try {
        console.log('[useUserStreak] 🔥 Buscando streak para user_id:', user.id);
        
        // Sua API Real
        const endpoint = `/wp-json/djzeneyer/v1/streak/${user.id}`;
        
        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            // Adicione autenticação se necessário (ex: X-WP-Nonce ou Bearer)
          },
        });

        if (!response.ok) {
          // Se a API falhar (404/500), não quebra o app, apenas loga
          console.warn(`[useUserStreak] API retornou ${response.status}. Usando fallback.`);
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const streakValue = result.streak || 0;

        setData({
          streak: streakValue,
          lastLogin: result.last_login || null,
          // Lógica visual: Se streak > 3 dias, ativa o ícone de fogo 🔥
          fire: streakValue >= 3 
        });

      } catch (error) {
        console.error('[useUserStreak] Erro (usando dados seguros):', error);
        // Fallback seguro para não quebrar a UI
        setData({ streak: 0, lastLogin: null, fire: false });
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();

    // Atualiza a cada 5 minutos (polling)
    const interval = setInterval(fetchStreak, 300000);
    return () => clearInterval(interval);

  }, [user?.id]);

  // Retorno Padronizado: { data, loading }
  return { data, loading };
};