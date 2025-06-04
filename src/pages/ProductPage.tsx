// src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: boolean; // Corrigido para boolean
  on_sale: boolean;
  images: { src: string; alt: string; }[];
  // ... outras propriedades que você possa precisar
}

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Pega o slug da URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError("Slug do produto não fornecido.");
        setLoading(false);
        return;
      }
      try {
        // Busca o produto pelo slug
        const response = await fetch(`${window.wpData.restUrl}wc/v3/products?slug=${slug}`, {
          headers: {
            'X-WP-Nonce': window.wpData.nonce,
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length > 0) {
          setProduct(data[0]); // Pega o primeiro resultado (deve ser único para um slug)
        } else {
          setError("Produto não encontrado.");
        }
      } catch (err: any) {
        console.error("Erro ao buscar produto:", err);
        setError("Não foi possível carregar os detalhes do produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Função para adicionar ao carrinho (você já tem a base disso)
  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
        const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/add-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': window.wpData.nonce,
            },
            body: JSON.stringify({
                id: productId,
                quantity: quantity
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao adicionar ao carrinho: ${response.status}`);
        }

        const cartData = await response.json();
        alert("Produto adicionado ao carrinho! Redirecionando para o checkout...");
        window.location.href = `${window.wpData.siteUrl}/checkout/`; // Redireciona para o checkout
    } catch (err: any) {
        console.error("Erro ao adicionar ao carrinho:", err);
        alert(`Erro ao adicionar ao carrinho: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-white p-4"
      >
        <p>Carregando detalhes do produto...</p>
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

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-white/70 p-4"
      >
        <p>Produto não encontrado.</p>
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
      <div className="bg-surface rounded-lg shadow-lg overflow-hidden border border-white/10 p-6 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              className="w-full h-auto object-contain rounded-lg"
            />
          )}
          {/* Adicionar galeria de imagens aqui se houver mais */}
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold font-display mb-4">{product.name}</h1>
          <p className="text-2xl font-bold mb-4">
            R$ {product.on_sale ? (
              <>
                <span className="line-through text-white/50 mr-2">{product.regular_price}</span>
                <span className="text-primary">{product.price}</span>
              </>
            ) : (
              product.price
            )}
          </p>
          <div dangerouslySetInnerHTML={{ __html: product.description }} className="text-white/80 leading-relaxed mb-6" />
          
          <button
            onClick={() => addToCart(product.id)}
            className="w-full btn btn-primary py-3 text-lg font-semibold"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;
