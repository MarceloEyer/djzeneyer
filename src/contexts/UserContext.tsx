import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Shield, User, Trophy, ShoppingBag, Phone, Save, Eye, EyeOff } from 'lucide-react';

export default function MyAccountPage() {
  const { user } = useUser();
  
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Preencher formulário com dados do usuário quando disponível
  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.name || '',
        phone: '' // Assumindo que phone virá do user no futuro
      });
    }
  }, [user]);

  // Função para formatar telefone brasileiro
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfileForm({ ...profileForm, phone: formatted });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada real para atualizar o perfil
      // await updateProfile(profileForm);
      
      // Toast de sucesso (simulado com alert por simplicidade)
      alert('🎉 Perfil atualizado com sucesso!');
    } catch (error) {
      alert('❌ Erro ao atualizar perfil');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('❌ As senhas não coincidem');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('❌ A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsPasswordLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada real para alterar a senha
      // await updatePassword(passwordForm);
      
      alert('🔒 Senha alterada com sucesso!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('❌ Erro ao alterar senha');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">🚫 Acesso Negado</h2>
          <p className="text-purple-200">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Dados mockados para gamificação
  const userLevel = Math.floor((user.id || 1) / 10) + 1;
  const userXP = ((user.id || 1) * 47) % 1000;
  const nextLevelXP = 1000;
  const progressPercentage = (userXP / nextLevelXP) * 100;
  const xpToNextLevel = nextLevelXP - userXP;

  // Conquistas mockadas
  const achievements = [
    { id: 1, name: '🏆 Primeiro Login', description: 'Fez seu primeiro login!', unlocked: true },
    { id: 2, name: '📱 Perfil Completo', description: 'Completou todas as informações do perfil', unlocked: profileForm.phone !== '' },
    { id: 3, name: '🔐 Segurança Master', description: 'Alterou a senha pelo menos uma vez', unlocked: false },
    { id: 4, name: '💎 VIP Level', description: 'Alcançou o nível VIP', unlocked: userLevel >= 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header com animação */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white">Minha Conta</h1>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold animate-pulse shadow-lg">
            🎯 Nível {userLevel}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-6 border border-white/20">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'profile' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <User size={20} />
                  Perfil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'security' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Shield size={20} />
                  Segurança
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'orders' 
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShoppingBag size={20} />
                  Compras
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Detalhes do Perfil</h2>
                      <p className="text-purple-200">Atualize suas informações pessoais</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Nome de Exibição
                      </label>
                      <input
                        type="text"
                        value={profileForm.displayName}
                        onChange={e => setProfileForm({...profileForm, displayName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Digite seu nome de exibição"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Número de Telefone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-white/50" />
                        </div>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={handlePhoneChange}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                          placeholder="(31) 99999-9999"
                          maxLength={15}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProfileLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isProfileLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Salvar Alterações</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Segurança</h2>
                      <p className="text-red-200">Altere sua senha de acesso</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                          placeholder="Digite sua senha atual"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                        >
                          {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                          placeholder="Digite sua nova senha"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                        >
                          {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                          placeholder="Confirme sua nova senha"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPasswordLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isPasswordLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Alterando...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          <span>Alterar Senha</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Histórico de Compras</h2>
                      <p className="text-green-200">Suas compras e pedidos</p>
                    </div>
                  </div>

                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhuma compra encontrada</h3>
                    <p className="text-white/70">Quando você fizer sua primeira compra, ela aparecerá aqui!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar com Stats */}
          <div className="space-y-6">
            {/* Card de Conquistas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Conquistas</h2>
              </div>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-lg'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{achievement.name}</span>
                      {achievement.unlocked && (
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className={`text-sm ${achievement.unlocked ? 'text-yellow-200' : 'text-white/50'}`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de Pontuação */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Pontuação</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">XP Total</span>
                  <span className="font-bold text-2xl text-white">{userXP}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-purple-200 text-center">
                  🎯 {xpToNextLevel} XP para o próximo nível
                </p>
              </div>
            </div>

            {/* Card de Informações do Usuário */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{user.name}</h3>
                <p className="text-white/70 mb-4">{user.email}</p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userLevel}</div>
                    <div className="text-sm text-white/60">Nível</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</div>
                    <div className="text-sm text-white/60">Conquistas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}