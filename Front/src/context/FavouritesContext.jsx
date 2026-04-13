
// src/context/FavouritesContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
 
export const FavouritesContext = createContext();
 
export const FavouritesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favouritesCount, setFavouritesCount] = useState(0);
 
  // ✅ Track if component is mounted
  const isMounted = useRef(true);
 
  // ✅ Track last action timestamp
  const lastActionTime = useRef({});
 
  // ✅ Track toast IDs
  const toastIds = useRef({});
 
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
 
  const fetchFavourites = useCallback(async () => {
    if (!user) {
      setFavourites([]);
      setFavouritesCount(0);
      return;
    }
 
    setLoading(true);
    try {
      const res = await API.get("/favourites");
 
      const favData = Array.isArray(res.data) 
        ? res.data 
        : (res.data.data || []);
 
      if (isMounted.current) {
        setFavourites(favData);
        setFavouritesCount(favData.length);
      }
 
    } catch (err) {
      console.error("Failed to fetch favourites:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user]);
 
  // ✅ ADD TO FAVOURITES - WITH DEBOUNCE
  const addToFavourites = async (productId) => {
    if (!user) {
      if (!toastIds.current.warning) {
        toastIds.current.warning = toast.warning("Please login to add to favourites");
      }
      return;
    }
 
    if (!productId) return;
 
    // 🔥 DEBOUNCE - 2 seconds mein sirf ek baar
    const now = Date.now();
    const lastCall = lastActionTime.current[productId] || 0;
 
    if (now - lastCall < 2000) {
      console.log("⏳ Debouncing: Too many clicks for product", productId);
 
      // Show a single debounce message
      if (!toastIds.current.debounce) {
        toastIds.current.debounce = toast.info("Please wait...", {
          autoClose: 1000,
          toastId: 'debounce-message'
        });
      }
      return;
    }
 
    lastActionTime.current[productId] = now;
 
    // Clear any existing toasts for this product
    if (toastIds.current[`add-${productId}`]) {
      toast.dismiss(toastIds.current[`add-${productId}`]);
    }
 
    try {
      const res = await API.post("/favourites/add", { productId });
 
      // Update state in a batch
      let updatedFavs;
      if (Array.isArray(res.data)) {
        updatedFavs = res.data;
      } else if (res.data?.data) {
        updatedFavs = res.data.data;
      } else {
        updatedFavs = [...favourites, { productId }];
      }
 
      // ✅ Batch both state updates together
      if (isMounted.current) {
        setFavourites(updatedFavs);
        setFavouritesCount(updatedFavs.length);
      }
 
      // ✅ Show single toast with unique ID
      toastIds.current[`add-${productId}`] = toast.success("❤️ Added to favourites!", {
        toastId: `fav-add-${productId}-${now}`,
        autoClose: 2000,
      });
 
    } catch (err) {
      console.error("Failed to add favourite:", err);
 
      if (!toastIds.current.error) {
        toastIds.current.error = toast.error(
          err.response?.data?.message || "Failed to add to favourites", 
          { toastId: 'fav-add-error' }
        );
      }
    }
  };
 
  // ✅ REMOVE FROM FAVOURITES - WITH DEBOUNCE
  const removeFromFavourites = async (productId) => {
    if (!user || !productId) return;
 
    const now = Date.now();
    const lastCall = lastActionTime.current[`remove-${productId}`] || 0;
 
    if (now - lastCall < 2000) {
      console.log("⏳ Debouncing: Too many remove clicks");
      return;
    }
 
    lastActionTime.current[`remove-${productId}`] = now;
 
    try {
      const res = await API.post("/favourites/remove", { productId });
 
      let updatedFavs;
      if (Array.isArray(res.data)) {
        updatedFavs = res.data;
      } else if (res.data?.data) {
        updatedFavs = res.data.data;
      } else {
        updatedFavs = favourites.filter(f => {
          const favId = f.productId?._id || f.productId;
          return favId !== productId;
        });
      }
 
      // ✅ Batch state updates
      if (isMounted.current) {
        setFavourites(updatedFavs);
        setFavouritesCount(updatedFavs.length);
      }
 
      toastIds.current[`remove-${productId}`] = toast.info("Removed from favourites", {
        toastId: `fav-remove-${productId}-${now}`,
        autoClose: 2000,
      });
 
    } catch (err) {
      console.error("Failed to remove favourite:", err);
      if (!toastIds.current.error) {
        toastIds.current.error = toast.error("Failed to remove from favourites", {
          toastId: 'fav-remove-error',
        });
      }
    }
  };
 
  const isFavourite = useCallback((productId) => {
    return favourites.some(f => {
      const favId = f.productId?._id || f.productId;
      return favId === productId;
    });
  }, [favourites]);
 
  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);
 
  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        loading,
        favouritesCount, // ✅ Navbar count - ab safe hai
        addToFavourites,
        removeFromFavourites,
        fetchFavourites,
        isFavourite,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
 
 