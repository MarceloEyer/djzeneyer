// src/pages/CheckoutPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cart, getCart, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  
  // Estado para o formulário
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Estado para o processo de finalização
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    setError(null);

    const orderData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    };

    try {
      const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}djzeneyer/v1/checkout`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include',
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Não foi possível finalizar o pedido.");
      }

      console.log("Pedido criado com sucesso!", responseData);
      alert("Pedido realizado com sucesso! Em breve, você será redirecionado para o pagamento.");
      
      // No futuro, aqui você redirecionaria para responseData.payment_url
      // Por enquanto, vamos para a página inicial
      navigate('/');

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
    <div className="container mx-auto px-4 py-24 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Finalizar Compra</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Lado do Formulário */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Seus Dados de Contato</h2>
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
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Telefone (com DDD)</label>
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg" />
            </div>
            
            {error && <p className="text-red-500">{error}</p>}
            
            <button type="submit" disabled={isPlacingOrder || !cart || cart.items.length === 0} className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {isPlacingOrder ? <Loader2 className="animate-spin" /> : <Lock />}
              {isPlacingOrder ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </form>
        </div>

        {/* Lado do Resumo do Pedido */}
        <div className="bg-surface/50 p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
          {cart && cart.items.length > 0 ? (
            <div className="space-y-4">
              {cart.items.map((item: any) => (
                <div key={item.key} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400">Quantidade: {item.quantity}</p>
                  </div>
                  <p>{formatPrice(item.totals.line_total)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold text-xl pt-4">
                <p>Total</p>
                <p>{formatPrice(cart.totals.total_price)}</p>
              </div>
            </div>
          ) : (
            <p>Seu carrinho está vazio. Adicione um ingresso na loja para continuar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;