// src/pages/ShopPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: { src: string; alt: string }[];
  // Adicione outras propriedades que você usa
}

const ShopPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate(); // Hook para navegação
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const normalizeProduct = useCallback((productData: any): Product => {
    let imageUrl = 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer'; // Imagem padrão
    if (productData.images && productData.images.length > 0) {
      imageUrl = productData.images[0].src;
    } else if (productData.featured_media_src_url) {
      imageUrl = productData.featured_media_src_url;
    }

    return {
      id: productData.id || 0,
      name: productData.name || 'Produto sem nome',
      slug: productData.slug || `product-${productData.id}`,
      price: String((parseFloat(productData.prices?.price || '0') / 100).toFixed(2)),
      images: [{ src: imageUrl, alt: productData.name || 'Imagem do produto' }],
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}wc/store/v1/products`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Falha ao buscar produtos.");
      const data = await response.json();
      setProducts(data.map(normalizeProduct));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}djzeneyer/v1/add-to-cart`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Não foi possível adicionar ao carrinho.');
      }
      // SUCESSO: Redireciona para o checkout
      navigate('/checkout');
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setAddingToCart(null);
    }
  };

  const formatPrice = (price: string) => `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" size={48} /></div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-red-500"><AlertCircle className="mr-2" /> {error}</div>;

  return (
    <motion.div className="container mx-auto px-4 py-16 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl md:text-4xl font-extrabold font-display text-center mb-12">Loja de Ingressos</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <motion.div key={product.id} className="bg-surface/50 border border-white/10 rounded-2xl flex flex-col">
            <Link to={`/product/${product.slug}`} className="block">
              <img src={product.images[0].src} alt={product.images[0].alt} className="w-full h-64 object-cover rounded-t-2xl" />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-3 flex-grow">{product.name}</h2>
              <p className="text-xl font-bold mb-4">{formatPrice(product.price)}</p>
              <button
                onClick={() => addToCart(product.id)}
                disabled={addingToCart === product.id}
                className="w-full btn bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingToCart === product.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ShoppingCart size={18} />
                )}
                <span>{addingToCart === product.id ? 'Adicionando...' : 'Comprar Ingresso'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShopPage;