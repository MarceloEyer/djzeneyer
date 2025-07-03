// src/pages/MyAccountPage.tsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Shield, User, Trophy, ShoppingBag, Phone, Save, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MyAccountPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({ displayName: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.name || '',
        phone: '' // O telefone será buscado separadamente no futuro, se necessário
      });
    } else if (!user && logout) {
      navigate('/');
    }
  }, [user, navigate]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, phone: formatPhoneNumber(e.target.value) });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    try {
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/user/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar o perfil.');
      alert('🎉 Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('❌ As novas senhas não coincidem!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('❌ A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setIsPasswordLoading(true);
    try {
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/user/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
        body: JSON.stringify(passwordForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao alterar a senha.');
      alert('🔒 Senha alterada com sucesso! Por segurança, faça o login novamente.');
      logout();
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>;
  }

  const userLevel = 1;
  const achievements = [
      { id: 1, name: '🏆 Primeiro Login', description: 'Fez seu primeiro login!', unlocked: true },
      { id: 2, name: '📱 Perfil Completo', description: 'Completou todas as informações do perfil', unlocked: profileForm.phone !== '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Minha Conta</h1>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            🎯 Nível {userLevel}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-6 border border-white/20">
              <div className="flex space-x-2">
                <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'hover:bg-white/10'}`}>
                  <User size={20} /> Perfil
                </button>
                <button onClick={() => setActiveTab('security')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'security' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'hover:bg-white/10'}`}>
                  <Shield size={20} /> Segurança
                </button>
                <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'hover:bg-white/10'}`}>
                  <ShoppingBag size={20} /> Compras
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold">Detalhes do Perfil</h2>
                  <div>
                    <label className="block text-sm mb-2">Nome de Exibição</label>
                    <input type="text" value={profileForm.displayName} onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })} className="w-full p-3 bg-white/10 border border-white/20 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Número de Telefone</label>
                    <input type="tel" value={profileForm.phone} onChange={handlePhoneChange} className="w-full p-3 bg-white/10 border border-white/20 rounded-xl" placeholder="(31) 99999-9999" maxLength={15} />
                  </div>
                  <button type="submit" disabled={isProfileLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                    {isProfileLoading ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                    <span>{isProfileLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>
                </form>
              )}
              {activeTab === 'security' && (
                 <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold">Alterar Senha</h2>
                    <div>
                        <label className="block text-sm mb-2">Senha Atual</label>
                        <div className="relative"><input type={showPasswords.current ? "text" : "password"} value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full p-3 pr-12 bg-white/10 border border-white/20 rounded-xl" required /><button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute inset-y-0 right-0 pr-4 flex items-center">{showPasswords.current ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Nova Senha</label>
                        <div className="relative"><input type={showPasswords.new ? "text" : "password"} value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full p-3 pr-12 bg-white/10 border border-white/20 rounded-xl" required /><button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute inset-y-0 right-0 pr-4 flex items-center">{showPasswords.new ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Confirmar Nova Senha</label>
                        <div className="relative"><input type={showPasswords.confirm ? "text" : "password"} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full p-3 pr-12 bg-white/10 border border-white/20 rounded-xl" required /><button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute inset-y-0 right-0 pr-4 flex items-center">{showPasswords.confirm ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>
                    </div>
                    <button type="submit" disabled={isPasswordLoading} className="w-full bg-gradient-to-r from-red-500 to-pink-600 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                        {isPasswordLoading ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div> : <Shield size={20} />}
                        <span>{isPasswordLoading ? 'Alterando...' : 'Alterar Senha'}</span>
                    </button>
                 </form>
              )}
              {activeTab === 'orders' && (
                <div><h2 className="text-2xl font-bold">Histórico de Compras</h2><div className="text-center py-12"><ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" /><h3 className="text-xl font-semibold">Nenhuma compra encontrada</h3></div></div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Trophy className="text-yellow-400" /> Conquistas</h2>
                 <div className="space-y-4">
                    {achievements.map(ach => (<div key={ach.id} className={`p-3 rounded-lg border ${ach.unlocked ? 'bg-yellow-500/20 border-yellow-500/20' : 'bg-white/5 border-white/10'}`}><p className="font-semibold">{ach.name}</p><p className={`text-sm ${ach.unlocked ? 'text-yellow-200' : 'text-white/50'}`}>{ach.description}</p></div>))}
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}