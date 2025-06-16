// Em src/contexts/UserContext.tsx

  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[UserContext] Iniciando login com Google...');
      
      // Pega o Client ID das variáveis de ambiente, como deve ser
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!GOOGLE_CLIENT_ID) {
        throw new Error("Client ID do Google não encontrado nas variáveis de ambiente (.env).");
      }

      // Esta é a nossa URL de redirecionamento correta para o fluxo headless
      const REDIRECT_URI = `${window.wpData?.siteUrl}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
      
      // O parâmetro 'state' para garantir o redirecionamento de volta para o frontend
      const finalRedirectUrl = window.location.origin;
      const state = btoa(`redirect_uri=${finalRedirectUrl}`);
      
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent',
        state: state
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      
      console.log('[UserContext] Redirecionando para:', authUrl);
      window.location.href = authUrl;
      
    } catch (err: any) {
      console.error('[UserContext] Erro no login Google:', err);
      setError(err.message || 'Erro ao iniciar login com Google');
      setLoading(false);
    }
  };