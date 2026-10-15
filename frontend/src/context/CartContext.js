import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [loadedUserId, setLoadedUserId] = useState(undefined);
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const isCartReady = !cartLoading && loadedUserId === currentUserId;

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      setCartLoading(false);
      setLoadedUserId(null);
      return;
    }
    try {
      setCartLoading(true);
      const res = await cartAPI.getCart();
      const rawItems = res.cart || res.cartItems || [];
      const items = rawItems.map((item) => {
        const variant = item.variant || {};
        const product = variant.product || {};
        const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
        return {
          id: item.id,
          variantId: item.variantId || variant.id,
          quantity: item.quantity,
          price: Number(product.price || item.price || 0),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          productName: product.name || '',
          productSlug: product.slug || '',
          productId: product.id || variant.productId,
          size: variant.size || null,
          color: variant.color || null,
          stock: variant.stock || 0,
          image: primaryImage?.url || null,
        };
      });
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch {
      setCartItems([]);
      setCartCount(0);
    } finally {
      setCartLoading(false);
      setLoadedUserId(user.id);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (variantId, quantity = 1) => {
    const res = await cartAPI.addToCart({ variantId, quantity });
    await fetchCart();
    return res;
  };

  const updateQuantity = async (id, quantity) => {
    await cartAPI.updateQuantity(id, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await cartAPI.removeItem(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartLoading: !isCartReady, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
