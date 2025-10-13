// src/components/GoogleOAuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const idToken = searchParams.get('id_token');

    console.log('🔍 Google OAuth callback:', { code, idToken });

    if (code) {
      // Código recebido - trocar por JWT
      exchangeCodeForToken(code);
    } else if (idToken) {
      // ID Token recebido diretamente
      exchangeIdTokenForJWT(idToken);
    } else {
      console.error('❌ No code or id_token received');
      navigate('/');
    }
  }, [searchParams, navigate]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      // O Simple JWT Login já faz isso automaticamente!
      // Quando o Google redireciona com code, o plugin processa
      const response = await fetch(
        `${window.location.origin}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google&code=${code}`,
        { method: 'POST' }
      );

      const data = await response.json();
      
      if (data.success && data.data?.id_token) {
        // Agora trocar id_token por JWT WordPress
        exchangeIdTokenForJWT(data.data.id_token);
      }
    } catch (error) {
      console.error('❌ Error exchanging code:', error);
      navigate('/');
    }
  };

  const exchangeIdTokenForJWT = async (idToken: string) => {
    try {
      const response = await fetch(
        `${window.location.origin}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google&id_token=${idToken}`,
        { method: 'POST' }
      );

      const data = await response.json();

      if (data.success && data.data?.jwt) {
        // Salva JWT
        localStorage.setItem('jwt_token', data.data.jwt);
        console.log('✅ Google login successful!');
        
        // Redireciona para dashboard
        navigate('/dashboard');
        window.location.reload();
      } else {
        throw new Error('Failed to get JWT');
      }
    } catch (error) {
      console.error('❌ Error exchanging id_token:', error);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-xl">Conectando com Google...</p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
