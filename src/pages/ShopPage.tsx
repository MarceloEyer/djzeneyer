// src/pages/ShopPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

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
  on_sale: boolean;
  regular_price: string;
  sale_price?: string;
  images: { src: string; alt: string }[];
  stock_status: string;
  type: string;
  status: string;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartStatus, setCartStatus] = useState<Record<number, 'idle' | 'adding' | 'added' | 'error'>>({});
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { user } = useUser();

  // Função para fazer debug das configurações
  const logDebugInfo = useCallback(() => {
    const info = {
      wpData: window.wpData,
      consumerKey: import.meta.env.VITE_WC_CONSUMER_KEY ? 'Presente' : 'Ausente',
      consumerSecret: import.meta.env.VITE_WC_CONSUMER_SECRET ? 'Presente' : 'Ausente',
      user: user ? 'Logado' : 'Não logado'
    };
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('Debug Info:', info);
  }, [user]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    logDebugInfo();

    try {
      // Primeiro, tentar método alternativo que não requer autenticação
      await fetchProductsAlternative();
    } catch (err: any) {
      console.error('Fetch error:', err);
      
      // Se falhar, tentar método tradicional com autenticação
      try {
        const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
        const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;
        
        if (!consumerKey || !consumerSecret) {
          throw new Error('Chaves da API WooCommerce não configuradas. Verifique seu arquivo .env.local');
        }

        let apiUrl = '';
        if (!window.wpData?.restUrl) {
          const baseUrl = window.location.origin;
          apiUrl = `${baseUrl}/wp-json/wc/v3/products`;
        } else {
          apiUrl = `${window.wpData.restUrl}wc/v3/products`;
        }

        // Usar Basic Auth em vez de query params (mais seguro)
        const credentials = btoa(`${consumerKey}:${consumerSecret}`);
        const params = new URLSearchParams({
          per_page: '12',
          status: 'publish',
          orderby: 'date',
          order: 'desc'
        });

        const finalUrl = `${apiUrl}?${params.toString()}`;
        console.log('Trying authenticated request to:', finalUrl);

        const response = await fetch(finalUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Authenticated request failed:', errorText);
          throw new Error(`Falha na autenticação: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products received via authenticated request:', data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error('Resposta inválida da API');
        }

      } catch (authErr: any) {
        console.error('Authenticated fetch also failed:', authErr);
        setError(`Não foi possível carregar os produtos. Verifique as configurações da API WooCommerce. Erro: ${authErr.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [user, logDebugInfo]);

  // Método alternativo usando CoCart ou WP REST API básica
  const fetchProductsAlternative = useCallback(async () => {
    console.log('Tentando método alternativo...');
    
    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    
    // Tentar diferentes endpoints com melhor tratamento de erro
    const endpoints = [
      {
        url: `${baseUrl}wc/store/v1/products`,
        name: 'WooCommerce Store API'
      },
      {
        url: `${baseUrl}cocart/v2/products`, 
        name: 'CoCart API'
      },
      {
        url: `${baseUrl}wp/v2/product`,
        name: 'WordPress REST API'
      }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Tentando ${endpoint.name}: ${endpoint.url}`);
        
        const response = await fetch(`${endpoint.url}?per_page=12&status=publish`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(window.wpData?.nonce && { 'X-WP-Nonce': window.wpData.nonce })
          }
        });

        console.log(`${endpoint.name} response status:`, response.status);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          console.log(`${endpoint.name} content-type:`, contentType);
          
          // Verificar se a resposta é JSON
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log(`Sucesso com ${endpoint.name}:`, data);
            
            // Normalizar dados se necessário
            const normalizedProducts = Array.isArray(data) ? data.map(normalizeProduct) : [];
            if (normalizedProducts.length > 0) {
              setProducts(normalizedProducts);
              return;
            }
          } else {
            console.log(`${endpoint.name} não retornou JSON válido`);
            const text = await response.text();
            console.log('Response text preview:', text.substring(0, 200));
          }
        } else {
          const errorText = await response.text();
          console.log(`${endpoint.name} error:`, response.status, errorText.substring(0, 200));
        }
      } catch (err: any) {
        console.log(`${endpoint.name} exception:`, err.message);
        continue;
      }
    }
    
    throw new Error('Nenhum endpoint alternativo funcionou. Verifique se o WooCommerce está instalado e ativado.');
  }, []);

  // Função para normalizar dados de produto de diferentes APIs
  const normalizeProduct = (product: any): Product => {
    // Log para debug
    console.log('Normalizing product:', product);
    
    return {
      id: product.id || 0,
      name: product.name || product.title?.rendered || 'Produto sem nome',
      slug: product.slug || `product-${product.id}`,
      price: product.price || product.prices?.price || product.regular_price || '0',
      on_sale: product.on_sale || false,
      regular_price: product.regular_price || product.prices?.regular_price || product.price || '0',
      sale_price: product.sale_price || product.prices?.sale_price || '',
      images: product.images && product.images.length > 0 
        ? product.images 
        : product.featured_media_src_url 
        ? [{ src: product.featured_media_src_url, alt: product.name || 'Produto' }]
        : [{ src: '', alt: product.name || 'Produto' }],
      stock_status: product.stock_status || 'instock',
      type: product.type || 'simple',
      status: product.status || 'publish'
    };
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (productId: number) => {
    setCartStatus(prev => ({ ...prev, [productId]: 'adding' }));

    try {
      // Tentar diferentes APIs de carrinho
      const cartAPIs = [
        {
          url: `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}cocart/v2/cart/add-item`,
          body: { product_id: productId, quantity: 1 }
        },
        {
          url: `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}wc/store/v1/cart/add-item`,
          body: { id: productId, quantity: 1 }
        }
      ];

      let success = false;

      for (const api of cartAPIs) {
        try {
          const headers: HeadersInit = { 'Content-Type': 'application/json' };
          
          if (user?.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
          } else if (window.wpData?.nonce) {
            headers['X-WP-Nonce'] = window.wpData.nonce;
          }

          const response = await fetch(api.url, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(api.body),
          });

          if (response.ok) {
            success = true;
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (success) {
        setCartStatus(prev => ({ ...prev, [productId]: 'added' }));
        setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
      } else {
        throw new Error('Não foi possível adicionar ao carrinho');
      }
      
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setCartStatus(prev => ({ ...prev, [productId]: 'error' }));
      setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Preço sob consulta' : `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="mt-6 text-xl font-medium">Carregando a Zen Shop...</p>
        {debugInfo && (
          <details className="mt-4 text-xs">
            <summary>Info de Debug</summary>
            <pre className="mt-2 p-2 bg-black/50 rounded text-left">{debugInfo}</pre>
          </details>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
        <AlertTriangle size={56} className="text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Ocorreu um Problema</h2>
        <p className="text-center max-w-md mb-6 text-gray-300">{error}</p>
        <button onClick={fetchProducts} className="btn bg-primary hover:bg-primary/90 flex items-center gap-2 mb-4">
          <RefreshCw size={18} />
          Tentar Novamente
        </button>
        {debugInfo && (
          <details className="text-xs text-left">
            <summary>Informações de Debug</summary>
            <pre className="mt-2 p-2 bg-black/50 rounded max-w-md overflow-auto">{debugInfo}</pre>
          </details>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
        <ShoppingCart size={56} className="text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Nenhum Produto Encontrado</h2>
        <p className="text-gray-300 mb-6">A loja ainda não possui produtos ou eles não estão visíveis.</p>
        <button onClick={fetchProducts} className="btn bg-primary hover:bg-primary/90 flex items-center gap-2">
          <RefreshCw size={18} />
          Recarregar
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-16 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl md:text-6xl font-extrabold font-display text-center mb-12 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Zen Shop
      </h1>
      
      <p className="text-center text-gray-300 mb-8">
        {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
      </p>

      <motion.div
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-surface/50 border border-white/10 rounded-2xl shadow-xl flex flex-col hover:border-primary/30 transition-colors"
          >
            <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-t-2xl">
              <motion.img
                src={product.images[0]?.src || 'https://placehold.co/600x600/101418/6366F1?text=Zen+Shop'}
                alt={product.images[0]?.alt || product.name}
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/101418/6366F1?text=Zen+Shop';
                }}
              />
            </Link>
            
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-3 flex-grow line-clamp-2">{product.name}</h2>
              
              <div className="mb-4">
                {product.on_sale && product.sale_price ? (
                  <div>
                    <span className="text-lg text-gray-400 line-through mr-2">
                      {formatPrice(product.regular_price)}
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      {formatPrice(product.sale_price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>

              {product.stock_status === 'outofstock' ? (
                <button disabled className="w-full py-3 px-4 bg-gray-600 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  Fora de Estoque
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product.id)}
                  className={`w-full btn py-3 transition-all duration-300 flex items-center justify-center gap-2 ${
                    cartStatus[product.id] === 'added' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : cartStatus[product.id] === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                  disabled={cartStatus[product.id] === 'adding'}
                >
                  {cartStatus[product.id] === 'adding' && (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Adicionando...</span>
                    </>
                  )}
                  {cartStatus[product.id] === 'added' && (
                    <>
                      <CheckCircle size={18} />
                      <span>Adicionado!</span>
                    </>
                  )}
                  {cartStatus[product.id] === 'error' && (
                    <>
                      <AlertTriangle size={18} />
                      <span>Erro - Tentar Novamente</span>
                    </>
                  )}
                  {(!cartStatus[product.id] || cartStatus[product.id] === 'idle') && (
                    <>
                      <ShoppingCart size={18} />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ShopPage;