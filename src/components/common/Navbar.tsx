// src/components/common/Navbar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const changeLanguage = (lng: 'pt' | 'en') => {
        const currentPath = location.pathname.replace(/^\/(en|pt)/, '');
        const newPath = lng === 'en' ? (currentPath || '/') : `/pt${currentPath || '/'}`;
        navigate(newPath);
    };

    return (
        <div className="flex items-center gap-2 bg-surface/50 border border-white/10 rounded-full px-2 py-1">
            <button onClick={() => changeLanguage('pt')} className={`px-2 py-1 text-xs font-bold rounded-full transition-colors ${i18n.language.startsWith('pt') ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}>PT</button>
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-xs font-bold rounded-full transition-colors ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}>EN</button>
        </div>
    );
};

interface NavbarProps { onLoginClick: () => void; }
interface MenuItem { ID: number; title: string; url: string; }

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { i18n }