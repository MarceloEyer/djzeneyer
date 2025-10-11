import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import { useMenu } from '../../hooks/useMenu';
import routeMapData from '../../data/routeMap.json';
import { normalizePath, tryDynamicMapping } from '../../utils/routeUtils';

type Lang = 'pt' | 'en';

// Componente seletor de idioma PT/EN
const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = i18n.language && i18n.language.startsWith('pt') ? 'pt' : 'en';
  const routeMap: Record<string, { pt: string; en: string }> = routeMapData as any;

  // Função para trocar idioma e navegar para rota equivalente
  const changeLanguage = (newLang: Lang) => {
    if (newLang === currentLang) return;

    const rawPath = normalizePath(location.pathname);
    const search = location.search || '';
    const hash = location.hash || '';

    console.debug('[LanguageSelector] changeLanguage:', { from: currentLang, to: newLang, rawPath });

    // Tenta mapeamento direto das rotas (ex: /pt -> /)
    const mapping = routeMap[rawPath];
    if (mapping) {
      const dest = mapping[newLang];
      console.debug('[LanguageSelector] direct mapping ->', dest);
      navigate(dest + search + hash);
      return;
    }

    // Tenta mapeamento dinâmico para rotas parametrizadas
    const dyn = tryDynamicMapping(rawPath, newLang);
    if (dyn) {
      console.debug('[LanguageSelector] dynamic mapping ->', dyn);
      navigate(dyn + search + hash);
      return;
    }

    // Fallback: adiciona ou remove /pt do caminho
    if (newLang === 'pt') {
      const newPath = rawPath === '/' ? '/pt' : `/pt${rawPath}`;
      console.debug('[LanguageSelector] fallback prefix ->', newPath);
      navigate(newPath + search + hash);
      return;
    } else {
      const withoutPt = rawPath.startsWith('/pt') ? rawPath.replace(/^\/pt/, '') || '/' : rawPath;
      console.debug('[LanguageSelector] fallback remove pt ->', withoutPt);
      navigate(withoutPt + search + hash);
      return;
    }
  };

  const isPtActive = currentLang === 'pt';

  return (
    <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
      <button
        onClick={() => changeLanguage('pt')}
        className={`text-sm font-bold transition-colors ${isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
        aria-pressed={isPtActive}
      >
        PT
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-bold transition-colors ${!isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
        aria-pressed={!isPtActive}
      >
        EN
      </button>
    </div>
  );
};

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const [isScrolled, setIsScrolled] =
