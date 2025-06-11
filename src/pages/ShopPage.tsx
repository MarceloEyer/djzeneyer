// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart } from 'lucide-react'; // Import Loader2 and ShoppingCart

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
  price: string;
  regular_price: string;
  sale_price: boolean;
  on_sale: boolean;
  images: { src: string; alt: string }[];
  short_description: string;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null); // Track which product is being added

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${window.wpData.restUrl}wc/v3/products?per_page=10`, { // Fetch a reasonable number of products
          headers: { 'X-WP-Nonce': window.wpData.nonce } // Nonce is sent here too, if it becomes protected
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError("Could not load products from the shop.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Simplified addToCart function using the most reliable method (direct URL redirection)
  const addToCart = (productId: number, quantity: number = 1) => {
    setAddingToCart(productId); // Set loading state for this specific product
    
    // Redirect directly using WooCommerce's traditional add-to-cart method
    // This bypasses complex AJAX/Nonce validation issues with wc/store/v1/cart/add-item API.
    window.location.href = `${window.wpData.siteUrl}/?add-to-cart=${productId}&quantity=${quantity}`;
    // The browser handles the redirection and WooCommerce processes the addition on its own.
    // The loading state will typically end when the new page loads.
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="mt-4 text-lg">Carregando Zen Shop...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold font-display text-center mb-12 tracking-tight">
        Zen Shop
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-white/70">Nenhum produto disponível no momento.</p>
        ) : (
          products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-surface border border-white/10 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
            >
              <Link to={`/product/${product.slug}`}>
                {product.images[0] && (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-56 object-cover"
                  />
                )}
              </Link>

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <div
                  className="text-sm text-white/70 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />

                <p className="text-lg font-bold mb-4">
                  R$ {product.on_sale ? (
                    <>
                      <span className="line-through text-white/50 mr-2">R$ {product.regular_price}</span>
                      <span className="text-primary">R$ {product.price}</span>
                    </>
                  ) : (
                    <>R$ {product.price}</>
                  )}
                </p>

                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50"
                  disabled={addingToCart === product.id} // Disable button when adding this product
                >
                  {addingToCart === product.id ? ( // Show spinner and "Adicionando..." text
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Adicionando...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ShopPage;