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
  
  const menuItems = useMenu(); 

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => {
      // Obtém o URL base do item (ex: /shop, /events)
      let baseUrl = item.url;
      
      // Garante que o link do menu aponte para a versão correta do idioma
      // Se o idioma atual é PT e o link base não tem /pt, adiciona
      if (lang === 'pt') {
          // O item do menu em PT deve apontar para a rota PT (ex: /loja)
          // Verifica se a URL base do item já está na forma PT (ex: /loja)
          // Se não estiver, tenta encontrar a rota PT correspondente
          // Por simplicidade, assumimos que o item.url do backend já é o correto para o idioma ativo
          // Se o backend retornar /shop para PT, precisamos traduzir para /loja
          // A lógica abaixo tenta manter o link consistente com o idioma
          // Ex: Se o item.url é /shop e estamos em PT, o link deve ser /loja
          // Isso depende de como o backend entrega os links via useMenu()
          // Se o backend entrega /shop e /loja separadamente, este mapeamento é necessário
          // Exemplo de mapeamento simples (você pode ter uma função mais robusta):
          const routeMapPt: Record<string, string> = {
              '/shop': '/loja',
              '/events': '/eventos',
              '/work-with-me': '/contrate',
              '/my-account': '/minha-conta',
              '/cart': '/carrinho',
              '/checkout': '/finalizar-compra',
              // Adicione outros mapeamentos conforme necessário
          };
          const mappedUrl = routeMapPt[baseUrl] || baseUrl;
          baseUrl = mappedUrl;
      } else { // lang === 'en' ou lang é undefined (raiz)
          // Se o idioma atual é EN, e o link base tem /pt, remove
          // ou, mais comumente, o link base já está em EN (ex: /shop)
          // Exemplo de mapeamento reverso para EN
          const routeMapEn: Record<string, string> = {
              '/loja': '/shop',
              '/eventos': '/events',
              '/contrate': '/work-with-me',
              '/minha-conta': '/my-account',
              '/carrinho': '/cart',
              '/finalizar-compra': '/checkout',
              // Adicione outros mapeamentos conforme necessário
          };
          // Se o baseUrl estiver no formato PT, mapeia de volta para EN
          // Isso é necessário se o backend entregar URLs no formato PT mesmo quando solicitado em EN
          // Geralmente, o backend deve entregar o URL correto para o idioma solicitado
          // A lógica mais comum é que o baseUrl já esteja correto para o idioma ativo
          // Vamos manter o baseUrl como está, presumindo que useMenu() entregue URLs corretos para o idioma ativo
          // baseUrl = routeMapEn[baseUrl] || baseUrl; // Desnecessário se useMenu() é confiável
      }

      // A URL final depende do idioma ativo
      // Se estamos em /pt/, os links devem ser relativos a /pt/
      // Se estamos em / (ou /en), os links devem ser relativos a / (ou /en)
      // Portanto, baseUrl deve já estar no formato correto para o idioma ativo
      // O NavLink receberá baseUrl, que é relativo à raiz ou /pt
      // Ex: baseUrl = '/shop' -> NavLink para '/shop' (se em /en) ou '/pt/shop' (se em /pt) -> ERRADO
      // CORREÇÃO: baseUrl deve ser a URL completa para o idioma ativo
      // Se estamos em /pt, baseUrl deve ser '/pt/loja'
      // Se estamos em /, baseUrl deve ser '/shop'
      // Isso depende de como useMenu() funciona. Se ele entrega URLs absolutas para o idioma ativo, ok.
      // Se ele entrega URLs relativas à raiz, precisamos ajustar aqui.

      // Assumindo que useMenu() entrega URLs RELATIVAS à RAIZ (ex: /shop, /events)
      // Precisamos prefixar com /pt se estivermos no idioma PT
      let finalToPath = baseUrl;
      if (lang === 'pt') {
          // Mapeia a URL base para a URL PT antes de prefixar
          const routeMapPt: Record<string, string> = {
              '/shop': '/loja',
              '/events': '/eventos',
              '/work-with-me': '/contrate',
              '/my-account': '/minha-conta',
              '/cart': '/carrinho',
              '/checkout': '/finalizar-compra',
              // Adicione outros mapeamentos conforme necessário
          };
          const mappedUrl = routeMapPt[baseUrl] || baseUrl;
          finalToPath = `/pt${mappedUrl}`;
      } else { // lang === 'en' ou lang é undefined
          // Para EN (padrão), a URL é a baseUrl original ou mapeada para EN
          const routeMapEn: Record<string, string> = {
              '/loja': '/shop',
              '/eventos': '/events',
              '/contrate': '/work-with-me',
              '/minha-conta': '/my-account',
              '/carrinho': '/cart',
              '/finalizar-compra': '/checkout',
              // Adicione outros mapeamentos conforme necessário
          };
          finalToPath = routeMapEn[baseUrl] || baseUrl; // Usa baseUrl se não houver mapeamento
      }

      return (
        <NavLink
          key={item.ID}
          to={finalToPath}
          target={item.target || '_self'}
          className={isMobile ? "nav-link text-lg block py-2 text-center" : "nav-link"}
        >
          {item.title}
        </NavLink>
      );
    })
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Ajusta o link da logo para ir para a raiz (/) ou /pt baseado no idioma */}
          <Link to={`/${lang || ''}`} className="flex items-center">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center">
            <LanguageSelector />
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={handleLoginButtonClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>{t('sign_in')}</span></button>}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {renderNavLinks(true)}
          </nav>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex-grow pr-4">
              {user?.isLoggedIn ? <UserMenu orientation="vertical" /> : <button onClick={handleLoginButtonClick} className="w-full btn btn-primary flex items-center justify-center space-x-2"><LogIn size={18} /><span>{t('join_the_tribe')}</span></button>}
            </div>
            <div className="flex-shrink-0">
                <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;