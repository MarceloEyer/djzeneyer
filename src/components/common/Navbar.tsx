// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import { useMenu } from '../../hooks/useMenu';

// LanguageSelector com lógica de navegação corrigida para / e /pt/
const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useParams<{ lang?: string }>(); // Pega o idioma da URL (pode ser 'en', 'pt' ou undefined)

    // Determina o idioma atual baseado no parâmetro 'lang' ou pela raiz
    const currentLang = lang || 'en'; // Se 'lang' for undefined, assume 'en'

    const changeLanguage = (newLang: 'pt' | 'en') => {
        if (newLang === currentLang) return; // Não faz nada se já está no idioma certo

        // Obtém o pathname atual
        let currentPath = location.pathname;

        // Remove o prefixo de idioma atual (se houver)
        if (currentPath.startsWith('/pt/')) {
            currentPath = currentPath.replace(/^\/pt/, '');
        } else if (currentPath === '/pt') {
            currentPath = '/';
        }
        // Remover /en/ ou /en (opcional, mas para consistência)
        else if (currentPath.startsWith('/en/')) {
            currentPath = currentPath.replace(/^\/en/, '');
        } else if (currentPath === '/en') {
            currentPath = '/';
        }

        // Monta o novo caminho com o novo prefixo de idioma
        let newPath: string;
        if (newLang === 'pt') {
            // Se for para PT, adiciona o prefixo /pt
            newPath = currentPath === '/' ? '/pt' : `/pt${currentPath}`;
        } else { // newLang === 'en'
            // Se for para EN (padrão), remove o prefixo (vai para a raiz)
            newPath = currentPath;
        }

        // Navega para a nova URL
        navigate(newPath);
    };

    // Determina se o idioma ativo pela URL
    const isPtActive = currentLang === 'pt';
    const isEnActive = currentLang === 'en'; // ou !lang

    return (
        <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
            <button onClick={() => changeLanguage('pt')} className={`text-sm font-bold transition-colors ${isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}>PT</button>
            <span className="text-white/20">|</span>
            <button onClick={() => changeLanguage('en')} className={`text-sm font-bold transition-colors ${isEnActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}>EN</button>
        </div>
    );
};


interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>(); // Pega o idioma da URL (pode ser 'en', 'pt' ou undefined)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  
  const menuItems = useMenu(); // Hook já lida com o idioma e retorna URLs corretas

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  // renderNavLinks agora usa diretamente os URLs fornecidos pelo useMenu
  // O hook useMenu garante que os URLs estejam no formato correto para o idioma ativo
  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => {
      // O item.url já está correto para o idioma ativo (ex: '/shop' para EN, '/loja' para PT)
      // O NavLink recebe esse URL diretamente.
      // Se estamos em /pt, e o item.url é '/loja', o NavLink irá para '/pt/loja' (ERRADO!)
      // CORREÇÃO: O item.url retornado pelo hook já deve incluir o prefixo de idioma se for PT.
      // Vamos verificar: O hook faz fetch('/menu?lang=pt'), o PHP pode retornar URLs com /pt
      // Mas o código do hook faz `url: item.url.replace(config.siteUrl, '')`
      // Isso remove o domínio, mas mantém o caminho. Se o PHP retornar /pt/loja, o hook retorna /pt/loja.
      // Se o PHP retornar /loja, o hook retorna /loja.
      // Para o modelo /pt/loja, o PHP deve retornar o caminho correto com o prefixo.
      // Para o modelo atual onde EN é / e PT é /pt, o PHP deve retornar