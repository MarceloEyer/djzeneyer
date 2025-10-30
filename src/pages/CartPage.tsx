/**
 * @file src/pages/CartPage.tsx
 * @description Página de carrinho de compras (WooCommerce REST API)
 * @route /cart
 * @author DJ Zen Eyer Team
 * @created 2025-10-29
 * @updated 2025-10-30
 *
 * FUNCIONALIDADES:
 * - Integração com WooCommerce Store API (v1/cart)
 * - Update de quantidade em tempo real
 * - Remoção de itens do carrinho
 * - Cálculo automático de totais
 * - Loading states otimizados
 * - Error handling robusto
 *
 * SEGURANÇA:
 * - X-WP-Nonce para autenticação
 * - Validação de quantidade (min: 1)
 * - Error boundaries para falhas de API
 *
 * SEO:
 * - Schema.org ShoppingCart (JSON-LD)
 * - H1 visível e semântico
 * - Meta description otimizada para conversão
 * - OG/Twitter Cards via SEO component
 *
 * DEPENDÊNCIAS:
 * - react + react-router-dom
 * - framer-motion (animações)
 * - react-helmet-async (meta tags)
 * - WooCommerce Store API (REST)
 *
 * TODO:
 * - Adicionar autenticação JWT para usuários logados
 * - Implementar cupons de desconto
 * - Adicionar estimativa de frete
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import SEO from '../components/SEO';

/**
 * Global Window Interface
 * @description Extensão do tipo Window para incluir wpData
 * (injetado pelo WordPress via wp_localize_script)
 */
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

/**
 * CartItem Interface
 * @description Estrutura de um item no carrinho (WooCommerce Store API)
 */
interface CartItem {
  key: string; // Chave única do item (ex: "abc123")
  id: number; // ID do produto no WooCommerce
  name: string; // Nome do produto
  quantity: number; // Quantidade no carrinho
  price: string; // Preço unitário (formato: "150.00")
  totals: {
    line_total: string; // Total da linha (price * quantity)
  };
  featured_image: string; // URL da imagem destacada
}

/**
 * CartTotals Interface
 * @description Totais do carrinho (WooCommerce Store API)
 */
interface CartTotals {
  total_items: string; // Subtotal dos itens
  total_items_tax: string; // Impostos dos itens
  total_shipping: string; // Frete
  total_shipping_tax: string; // Impostos do frete
  total_fees: string; // Taxas adicionais
  total_fees_tax: string; // Impostos das taxas
  total_discount: string; // Desconto total
  total_discount_tax: string; // Impostos do desconto
  total_price: string; // Total geral (BRL format: "250.00")
  total_tax: string; // Total de impostos
  currency_code: string; // Código da moeda (ex: "BRL")
}

/**
 * CartPage Component
 * @description Página principal do carrinho de compras
 * @returns {JSX.Element} Página do carrinho com itens, totais e checkout
 */
const CartPage: React.FC = () => {
  const [cart, setCart] = useState<{ items: CartItem[]; totals: CartTotals } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCart, setUpdatingCart] = useState(false);

  /**
   * fetchCart
   * @description Busca o carrinho atual do WooCommerce Store API
   * @async
   */
  const fetchCart = async () => {
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart`, {
        headers: {
          'X-WP-Nonce': window.wpData.nonce,
          // TODO: Adicionar JWT token para usuários logados
          // 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCart(data);
    } catch (err: any) {
      console.error('Erro ao buscar carrinho:', err);
      setError('Não foi possível carregar o carrinho. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * updateCartItemQuantity
   * @description Atualiza a quantidade de um item no carrinho
   * @param {string} itemKey - Chave única do item
   * @param {number} newQuantity - Nova quantidade (min: 1)
   * @async
   */
  const updateCartItemQuantity = async (itemKey: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Validação: quantidade mínima = 1

    setUpdatingCart(true);
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/update-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          key: itemKey,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchCart(); // Recarrega o carrinho após atualização
    } catch (err: any) {
      console.error('Erro ao atualizar quantidade do item:', err);
      alert(`Erro ao atualizar quantidade: ${err.message}`);
    } finally {
      setUpdatingCart(false);
    }
  };

  /**
   * removeCartItem
   * @description Remove um item do carrinho
   * @param {string} itemKey - Chave única do item
   * @async
   */
  const removeCartItem = async (itemKey: string) => {
    setUpdatingCart(true);
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/remove-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          key: itemKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchCart(); // Recarrega o carrinho após remoção
    } catch (err: any) {
      console.error('Erro ao remover item do carrinho:', err);
      alert(`Erro ao remover item: ${err.message}`);
    } finally {
      setUpdatingCart(false);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <>
        <SEO
          title="Carrinho - DJ Zen Eyer"
          description="Finalize sua compra de ingressos para eventos exclusivos de Brazilian Zouk com DJ Zen Eyer."
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4"
        >
          <ShoppingCart size={64} className="text-primary animate-pulse mb-4" />
          <p className="text-lg">Carregando seu carrinho...</p>
        </motion.div>
      </>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <>
        <SEO
          title="Erro - Carrinho - DJ Zen Eyer"
          description="Erro ao carregar o carrinho. Tente novamente."
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center bg-background text-red-500 p-4"
        >
          <p className="text-xl font-semibold">{error}</p>
          <button onClick={fetchCart} className="btn btn-primary mt-6">
            Tentar Novamente
          </button>
        </motion.div>
      </>
    );
  }

  // ============================================
  // EMPTY CART STATE
  // ============================================
  if (!cart || cart.items.length === 0) {
    return (
      <>
        <SEO
          title="Carrinho Vazio - DJ Zen Eyer"
          description="Seu carrinho está vazio. Explore nossa loja de ingressos para eventos de Brazilian Zouk."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="container mx-auto px-4 py-16 text-white min-h-[60vh] text-center"
        >
          <Package size={80} className="text-white/30 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Seu Carrinho Está Vazio
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Parece que você ainda não adicionou nenhum ingresso ao carrinho.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg inline-flex items-center gap-2">
            <ShoppingCart size={20} />
            Explorar Loja
          </Link>
        </motion.div>
      </>
    );
  }

  // ============================================
  // CART WITH ITEMS
  // ============================================
  return (
    <>
      {/* ✅ SEO COMPONENT (OG + Twitter + Hreflang) */}
      <SEO
        title={`Carrinho (${cart.items.length} ${cart.items.length === 1 ? 'item' : 'itens'}) - DJ Zen Eyer`}
        description={`Finalize sua compra: ${cart.items.length} ingresso(s) no valor total de R$ ${cart.totals.total_price}. Eventos exclusivos de Brazilian Zouk com DJ Zen Eyer.`}
        image="https://djzeneyer.com/images/og-image-cart.jpg"
        type="website"
      />

      {/* ✅ SCHEMA MARKUP: ShoppingCart (JSON-LD) */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ShoppingCart",
            "itemListElement": cart.items.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": item.name,
                "image": item.featured_image,
                "offers": {
                  "@type": "Offer",
                  "price": item.price,
                  "priceCurrency": cart.totals.currency_code || "BRL",
                  "availability": "https://schema.org/InStock"
                }
              },
              "quantity": item.quantity
            })),
            "totalPrice": {
              "@type": "PriceSpecification",
              "price": cart.totals.total_price,
              "priceCurrency": cart.totals.currency_code || "BRL"
            }
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8 text-white min-h-[60vh]"
      >
        {/* ✅ H1 VISÍVEL (SEO 100%) */}
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-2 text-center">
          Seu Carrinho Zen
        </h1>
        <p className="text-center text-white/70 mb-8">
          {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'} no carrinho
        </p>

        {/* Loading indicator durante updates */}
        {updatingCart && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-primary animate-pulse">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Atualizando carrinho...
            </span>
          </div>
        )}

        {/* ============================================
            CART ITEMS TABLE
            ============================================ */}
        <div className="bg-surface rounded-lg shadow-xl overflow-hidden border border-white/10 p-6 mb-8">
          <div className="space-y-6">
            {cart.items.map((item) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col md:flex-row items-center gap-4 border-b border-white/5 pb-6 last:border-b-0 last:pb-0"
              >
                {/* Product Image */}
                {item.featured_image && (
                  <img
                    src={item.featured_image}
                    alt={item.name}
                    loading="lazy"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                )}

                {/* Product Info */}
                <div className="flex-grow text-center md:text-left">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-lg font-semibold hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-white/70 text-sm mt-1">
                    Preço Unitário: <span className="font-bold text-primary">R$ {item.price}</span>
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    Subtotal: R$ {item.totals.line_total}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateCartItemQuantity(item.key, item.quantity - 1)}
                    disabled={updatingCart || item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value);
                      if (!isNaN(newQty) && newQty > 0) {
                        updateCartItemQuantity(item.key, newQty);
                      }
                    }}
                    className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white text-center focus:outline-none focus:border-primary"
                    disabled={updatingCart}
                    aria-label="Quantidade"
                  />

                  <button
                    onClick={() => updateCartItemQuantity(item.key, item.quantity + 1)}
                    disabled={updatingCart}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeCartItem(item.key)}
                  disabled={updatingCart}
                  className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  aria-label="Remover item"
                >
                  <Trash2 size={18} />
                  <span className="hidden md:inline">Remover</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* ============================================
              CART TOTALS
              ============================================ */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-2xl font-bold mb-6">
              <span>Total do Carrinho:</span>
              <span className="text-primary">R$ {cart.totals.total_price}</span>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="w-full btn btn-primary py-4 text-lg font-semibold text-center flex items-center justify-center gap-3 group"
              aria-label="Prosseguir para o checkout"
            >
              <span>Prosseguir para o Checkout</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Continue Shopping Link */}
            <Link
              to="/shop"
              className="block text-center text-white/70 hover:text-primary transition-colors mt-4"
            >
              ← Continuar Comprando
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CartPage;
