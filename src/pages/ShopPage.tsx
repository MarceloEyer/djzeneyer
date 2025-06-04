// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Certifique-se de que window.wpData está acessível
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Definição de tipo simplificada para um produto do WooCommerce
interface Product {
  id: number;
  name: string;
  slug: string; // Para usar na URL do produto
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: { src: string; alt: string; }[];
  short_description: string; // Descrição curta para listagem
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${window.wpData.restUrl}wc/v3/products`, {
          headers: {
            'X-WP-Nonce': window.wpData.nonce,
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos da loja.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-white p-4"
      >
        <p>Carregando Loja Zen...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-red-500 p-4"
      >
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 text-white min-h-[60vh]"
    >
      <h1 className="text-4xl font-bold font-display mb-8 text-center">Nossa Loja Zen</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-white/70">Nenhum produto encontrado ainda.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-surface rounded-lg shadow-lg overflow-hidden border border-white/10">
              <Link to={`/product/${product.slug}`} className="block">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <div dangerouslySetInnerHTML={{ __html: product.short_description }} className="text-white/70 text-sm mb-3" />
                  <p className="text-lg font-bold">
                    R$ {product.on_sale ? (
                      <>
                        <span className="line-through text-white/50 mr-2">{product.regular_price}</span>
                        <span className="text-primary">{product.price}</span>
                      </>
                    ) : (
                      product.price
                    )}
                  </p>
                </div>
              </Link>
              {/* Botão Adicionar ao Carrinho viria aqui, você o adicionará depois */}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ShopPage;