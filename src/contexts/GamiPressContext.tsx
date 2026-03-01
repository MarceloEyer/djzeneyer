// src/contexts/GamiPressContext.tsx
// Singleton: garante um único fetch para /gamipress/user-data por sessão.
// Sem este context, DashboardPage e GamificationWidget instanciam useGamiPress()
// separadamente → dois fetches simultâneos → dois 401.

import React, { createContext, useContext, ReactNode } from 'react';
import { useGamiPress, GamiPressData } from '../hooks/useGamiPress';

interface GamiPressContextType {
    data: GamiPressData;
    loading: boolean;
    error: string | null;
    refresh: () => void;
    mainPoints: number;
    currentRank: string;
}

const GamiPressContext = createContext<GamiPressContextType | undefined>(undefined);

export const GamiPressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const gamipress = useGamiPress();
    return (
        <GamiPressContext.Provider value={gamipress}>
            {children}
        </GamiPressContext.Provider>
    );
};

export const useGamiPressContext = (): GamiPressContextType => {
    const ctx = useContext(GamiPressContext);
    if (!ctx) {
        throw new Error('useGamiPressContext must be used within a GamiPressProvider');
    }
    return ctx;
};
