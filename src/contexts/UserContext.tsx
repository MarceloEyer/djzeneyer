// src/contexts/UserContext.tsx - ATUALIZAÇÃO na função register

const register = async (name: string, email: string, password: string) => {
  console.log('[UserContext] 📝 Tentando registro...', { name, email });
  
  if (!config.restUrl) {
    const error = 'Configuração REST ausente.';
    console.error('[UserContext] ❌', error);
    throw new Error(error);
  }
  
  setLoading(true); 
  setError(null);
  
  try {
    // TENTATIVA 1: Simple JWT Login
    let endpoint = `${config.restUrl}simple-jwt-login/v1/register`;
    console.log('[UserContext] 📡 Tentando Simple JWT Login:', endpoint);
    
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password, 
        display_name: name 
      })
    });
    
    console.log('[UserContext] 📥 Status Simple JWT:', response.status);
    
    // MUDANÇA: Se retornar 400 mas usuário foi criado, tentar login
    if (response.status === 400) {
      console.log('[UserContext] ⚠️ 400 retornado, mas pode ter criado usuário. Tentando login...');
      
      // Espera 2 segundos para garantir que usuário foi criado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        await login(email, password);
        console.log('[UserContext] ✅ Usuário já existia! Login bem-sucedido');
        return; // Sucesso!
      } catch (loginError) {
        console.log('[UserContext] ❌ Login falhou, usuário realmente não existe');
      }
    }
    
    // TENTATIVA 2: Se 404, usa WP REST API
    if (response.status === 404) {
      console.log('[UserContext] ⚠️ Simple JWT não disponível, usando WP Users API...');
      
      endpoint = `${config.restUrl}wp/v2/users`;
      console.log('[UserContext] 📡 POST para:', endpoint);
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: email.split('@')[0],
          email, 
          password,
          name,
          roles: ['subscriber']
        })
      });
      
      console.log('[UserContext] 📥 Status WP Users:', response.status);
    }
    
    const data = await response.json();
    console.log('[UserContext] 📊 Resposta:', data);
    
    if (!response.ok && response.status !== 400) {
      let errorMsg = data.message || data.error || data.code || 'Erro no registro.';
      
      if (errorMsg.includes('already exists') || errorMsg.includes('username_exists') || errorMsg.includes('email_exists')) {
        errorMsg = 'Este email já está cadastrado. Tente fazer login.';
      } else if (errorMsg.includes('invalid_email')) {
        errorMsg = 'Email inválido.';
      } else if (errorMsg.includes('weak_password')) {
        errorMsg = 'Senha muito fraca. Use pelo menos 8 caracteres.';
      } else if (response.status === 403) {
        errorMsg = 'Registro desabilitado. Contate o administrador.';
      }
      
      console.log('[UserContext] ❌ Registro falhou:', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('[UserContext] ✅ Registro bem-sucedido!');
    
    // Se retornar JWT direto
    if (data.jwt) {
      console.log('[UserContext] 🎫 JWT recebido diretamente');
      await fetchUserDetails(data.jwt);
    } else {
      // Auto-login após registro
      console.log('[UserContext] 🔐 Fazendo auto-login...');
      await login(email, password);
    }
  } catch (err: any) {
    const msg = err?.message || 'Erro no registro';
    console.error('[UserContext] ❌ Erro capturado:', msg);
    setError(msg);
    throw err;
  } finally {
    setLoading(false);
  }
};
