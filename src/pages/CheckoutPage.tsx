// src/pages/CheckoutPage.tsx

import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { Loader2, Lock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CheckoutPage: React.FC = () => {
  const { cart, getCart, loading: cartLoading } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Estados do formulário
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Estados do processo de checkout
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para a Gamificação
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState<{description: string, points: number}[]>([]);

  useEffect(() => {
    getCart();
    if (user) {
      const nameParts = user.name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email);
    }
  }, [user, getCart]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    setError(null);

    const orderData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    try {
      const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}djzeneyer/v1/checkout`;
      
      // CORREÇÃO ESSENCIAL: Preparamos os headers com o Nonce
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (window.wpData?.nonce) {
        headers['X-WP-Nonce'] = window.wpData.nonce;
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers, // Usamos os headers com o nonce
        body: JSON.stringify(orderData),
        credentials: 'include',
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Não foi possível finalizar o pedido.");
      }

      console.log("Pedido criado com sucesso!", responseData);
      
      // Simula recompensas ganhas para a animação
      setEarnedRewards([
        { description: 'Completou a Primeira Compra', points: 50 },
        { description: 'Comprou Ingresso reZENha', points: 25 },
      ]);
      setShowSuccessAnimation(true); // Ativa a animação de sucesso

    } catch (err: any) {
      console.error("Erro ao finalizar pedido:", err);
      setError(err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatPrice = (price: string) => `R$ ${(parseFloat(price) / 100).toFixed(2).replace('.', ',')}`;

  if (cartLoading && !cart) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-24 text-white">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Finalizar Compra</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulário */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">Nome</label>
                  <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">Sobrenome</label>
                  <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg" />
              </div>

              {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}
              
              <button type="submit" disabled={isPlacingOrder || !cart || cart.items.length === 0} className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {isPlacingOrder ? <Loader2 className="animate-spin" /> : <Lock />}
                {isPlacingOrder ? 'Processando...' : 'Finalizar Pedido'}
              </button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-surface/50 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Seu Pedido</h2>
            {cart && cart.items.length > 0 ? (
              <div className="space-y-4">
                {cart.items.map((item: any) => (
                  <div key={item.key} className="flex justify-between items-center border-b border-white/10 pb-4">
                    <p className="font-semibold">{item.name} <span className="text-sm text-gray-400">x {item.quantity}</span></p>
                    <p>{formatPrice(item.totals.line_total)}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-xl pt-4">
                  <p>Total</p>
                  <p>{formatPrice(cart.totals.total_price)}</p>
                </div>
              </div>
            ) : ( <p>Seu carrinho está vazio.</p> )}
            
            {/* Seção de Gamificação Preview */}
            {cart && cart.items.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-primary/10 rounded-lg border border-purple-500/30">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Award className="text-yellow-400" /> Recompensas desta compra</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><span className="text-green-400 font-semibold">+50</span><span>pontos por completar sua primeira compra!</span></div>
                  <div className="flex items-center gap-2"><span className="text-green-400 font-semibold">+25</span><span>pontos por comprar um Ingresso reZENha.</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animação de Sucesso */}
      {showSuccessAnimation && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface p-8 rounded-2xl max-w-md w-full mx-4 text-center border border-white/10"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4">Pedido Confirmado!</h2>
            {earnedRewards.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Você ganhou:</h3>
                {earnedRewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary/20 rounded-lg mb-2">
                    <span>{reward.description}</span>
                    <span className="text-yellow-400 font-bold">+{reward.points} XP</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Voltar para o Início
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default CheckoutPage;