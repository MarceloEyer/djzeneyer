// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart } from 'lucide-react'; // Import Loader2 and ShoppingCart icons
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage for translations

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string; // Nonce for WP REST API requests
    };
  }
}

// Simplified product type definition for WooCommerce
interface Product {
  id: number;
  name: string;
  slug: string; // Used for product URL
  price: string;
  regular_price: string;
  sale_price: boolean; // Corrected to boolean
  on_sale: boolean;
  images: { src: string; alt: string }[];
  short_description: string; // Short description for listing
}

const ShopPage: React.FC = () => {
  const { t } = useLanguage(); // Get translation function
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null); // Track which product is being added

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Calling the custom endpoint to fetch products publicly
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/products-public?per_page=10`); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(t('shop_error_loading_products')); // Translated error message
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]); // Re-fetch products if translation function (or implicitly language) changes

  // Function to add product to cart using the custom endpoint
  const addToCart = async (productId: number, quantity: number = 1) => {
    setAddingToCart(productId); // Set loading state for this specific product
    try {
        // Calling your custom add-to-cart endpoint
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Nonce should not be strictly required here as it's a custom endpoint with __return_true
                // but adding it does no harm and might help if you secure it later.
                'X-WP-Nonce': window.wpData.nonce, 
            },
            body: JSON.stringify({
                product_id: productId, // Use product_id as defined in your custom endpoint
                quantity: quantity
            }),
            credentials: 'include' // Ensure cookies (for session) are sent
        });
        
        const data = await response.json(); // Parse response data immediately

        if (response.ok && data.success) { // Check for success flag from your custom endpoint
            console.log("Product added to cart via custom endpoint:", data);
            alert(t('shop_product_added_alert')); // Translated alert message
            // Use the checkout URL returned by your custom API, or fallback to default
            window.location.href = data.checkout_url || `${window.wpData.siteUrl}/checkout/`; 
        } else {
            // Throw an error with the message from your custom API response
            throw new Error(data.message || t('shop_add_to_cart_error_generic')); // Translated generic error
        }
    } catch (err: any) {
        console.error("Custom Add to Cart API Error:", err);
        alert(`${t('shop_add_to_cart_error_prefix')} ${err.message || t('shop_try_again_suffix')}`); // Translated error message
    } finally {
      setAddingToCart(null); // Clear loading state
    }
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="mt-4 text-lg">{t('shop_loading_text')}</p> {/* Translated text */}
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
        {t('shop_page_title')} {/* Translated title */}
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-white/70">{t('shop_no_products_found')}</p> {/* Translated text */}
        ) : (
          products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-surface border border-white/10 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
            >
              <Link to={`/product/${product.slug}`}>
                {product.images && product.images.length > 0 && (
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
                    product.price
                  )}
                </p>

                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50"
                  disabled={addingToCart === product.id} // Disable button when adding this product
                >
                  {addingToCart === product.id ? ( // Show spinner and "Adicionando..." text
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{t('shop_adding_text')}</span> {/* Translated text */}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>{t('shop_add_to_cart_button')}</span> {/* Translated text */}
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
