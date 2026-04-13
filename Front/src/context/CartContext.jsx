// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const isMounted = useRef(true);
  const lastActionTime = useRef({});
  const toastIds = useRef({});

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await API.get("/cart");
      
      let cartData = [];
      if (Array.isArray(res.data)) {
        cartData = res.data;
      } else if (res.data?.data) {
        cartData = res.data.data;
      }
      
      if (isMounted.current) {
        setCart(cartData);
        const totalItems = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      }

    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      if (!toastIds.current.warning) {
        toastIds.current.warning = toast.warning("Please login to add to cart");
      }
      return;
    }

    const now = Date.now();
    const lastCall = lastActionTime.current[productId] || 0;

    if (now - lastCall < 2000) {
      return;
    }

    lastActionTime.current[productId] = now;

    try {
      const res = await API.post("/cart/add", { productId, quantity });
      
      let updatedCart;
      if (Array.isArray(res.data)) {
        updatedCart = res.data;
      } else if (res.data?.data) {
        updatedCart = res.data.data;
      } else {
        updatedCart = [...cart, { product: productId, quantity }];
      }

      if (isMounted.current) {
        setCart(updatedCart);
        const totalItems = updatedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      }

      toastIds.current[`add-${productId}`] = toast.success("🛒 Added to cart!", {
        toastId: `cart-add-${productId}-${now}`,
        autoClose: 2000,
      });

    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !productId) return;

    const now = Date.now();
    const lastCall = lastActionTime.current[`remove-${productId}`] || 0;

    if (now - lastCall < 2000) {
      return;
    }

    lastActionTime.current[`remove-${productId}`] = now;

    try {
      const res = await API.post("/cart/remove", { productId });

      let updatedCart;
      if (Array.isArray(res.data)) {
        updatedCart = res.data;
      } else if (res.data?.data) {
        updatedCart = res.data.data;
      } else {
        updatedCart = cart.filter(item => {
          const itemId = item.product?._id || item.product;
          return itemId !== productId;
        });
      }

      if (isMounted.current) {
        setCart(updatedCart);
        const totalItems = updatedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      }

      toastIds.current[`remove-${productId}`] = toast.info("Removed from cart", {
        toastId: `cart-remove-${productId}-${now}`,
        autoClose: 2000,
      });

    } catch (err) {
      console.error("Failed to remove from cart:", err);
      toast.error("Failed to remove from cart");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user || !productId) return;
    if (newQuantity < 1) return;

    const currentItem = cart.find(item => {
      const itemId = item.product?._id || item.product;
      return itemId === productId;
    });

    if (!currentItem) return;

    const currentQuantity = currentItem.quantity || 1;
    const delta = newQuantity - currentQuantity;

    if (delta === 0) return;

    const now = Date.now();
    const lastCall = lastActionTime.current[`update-${productId}`] || 0;

    if (now - lastCall < 1000) {
      return;
    }

    lastActionTime.current[`update-${productId}`] = now;

    try {
      if (isMounted.current) {
        const updatedCart = cart.map(item => {
          const itemId = item.product?._id || item.product;
          if (itemId === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        setCart(updatedCart);
        const totalItems = updatedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      }

      await API.post("/cart/add", { productId, quantity: delta });

      const toastId = `cart-update-${productId}`;
      if (!toast.isActive(toastId)) {
        toast.success("Quantity updated", { toastId, autoClose: 1500 });
      }

    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity");
      fetchCart();
    }
  };

  // ✅ FIXED: Enhanced clearCart function
const clearCart = async () => {
  if (!user) {
    toast.error("Please login to clear cart");
    return false;
  }

  setLoading(true);
  
  try {
    // Local state update only - no API call
    if (isMounted.current) {
      setCart([]);
      setCartCount(0);
    }
    
    toast.success("Cart cleared successfully");
    return true;
    
  } catch (err) {
    toast.error("Failed to clear cart");
    return false;
    
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
};

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};