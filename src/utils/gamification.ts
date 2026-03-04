// src/utils/gamification.ts

/**
 * Utilitários para a UI de Gamificação do ZenGame
 */

/**
 * Retorna label legível para tipo de log do GamiPress
 */
export function getLogTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        'event_trigger': '🎯 Ação realizada',
        'achievement_earn': '🏆 Conquista desbloqueada',
        'achievement_award': '⭐ Conquista atribuída',
        'points_earn': '💰 Pontos ganhos',
        'points_deduct': '📉 Pontos descontados',
        'points_expend': '🔥 Pontos gastos',
        'points_award': '🎁 Pontos atribuídos',
        'points_revoke': '❌ Pontos revogados',
        'rank_earn': '📈 Ranking atingido',
        'rank_award': '👑 Ranking atribuído',
        'rank_earned': '📈 Ranking atingido', // GamiPress inconsistent trigger name
    };
    return labels[type] || type;
}

/**
 * Retorna cor para progress bar baseada no percentual
 * Mapeado para classes de cores do tema DJ Zen Eyer
 */
export function getProgressColor(percent: number): string {
    if (percent < 25) return 'bg-red-500';
    if (percent < 50) return 'bg-orange-500';
    if (percent < 75) return 'bg-yellow-500';
    return 'bg-primary'; // Greenish/Indigo do tema
}

/**
 * Formata quantidade de pontos com separador de milhar brasileiro
 */
export function formatPoints(points: number): string {
    return new Intl.NumberFormat('pt-BR').format(points);
}

/**
 * Formata data para exibição nos logs
 */
export function formatLogDate(dateString: string): string {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    } catch (e) {
        console.error('[gamification] Error formatting log date:', e, dateString);
        return dateString;
    }
}
