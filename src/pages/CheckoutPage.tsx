// src/pages/CheckoutPage.tsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Loader2 } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { cart, getCart, loading } = useCart();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Busca os dados do carrinho quando a página carrega
    getCart();
  }, [getCart]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // A lógica de integração com o pagamento virá aqui no futuro
    console.log('Finalizando pedido com os dados:', { email, name, cart });
    alert('Função de finalizar pedido ainda não implementada.');
  };

  const formatPrice = (price: string) => `R$ ${(parseFloat(price) / 100).toFixed(2).replace('.', ',')}`;

  if (loading && !cart) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" size={48} /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Finalizar Compra</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Lado do Formulário */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Nome Completo</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg" />
            </div>
            {/* Outros campos (endereço, etc.) podem ser adicionados aqui */}
            <div className="pt-6">
              <h3 className="text-xl font-bold mb-4">Pagamento</h3>
              <div className="p-4 bg-surface/50 rounded-lg">
                <p>A integração com o método de pagamento (ex: Stripe, Pix) será adicionada aqui.</p>
              </div>
            </div>
            <button type="submit" className="w-full btn btn-primary py-4 text-lg">
              Finalizar Pedido
            </button>
          </form>
        </div>

        {/* Lado do Resumo do Pedido */}
        <div className="bg-surface/50 p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Seu Pedido</h2>
          {cart && cart.items.length > 0 ? (
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.key} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name} <span className="text-sm font-normal">x {item.quantity}</span></p>
                  </div>
                  <p>{formatPrice(item.totals.line_total)}</p>
                </div>
              ))}
              <hr className="border-white/10 my-4" />
              <div className="flex justify-between font-bold text-xl">
                <p>Total</p>
                <p>{formatPrice(cart.totals.total_price)}</p>
              </div>
            </div>
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;