import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

const API_BASE = "http://13.204.186.114/api/";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");
const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

api.interceptors.request.use(
  (config) => {
    const token = getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}
function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);
    if (error.response.status !== 401 || originalRequest._retry)
      return Promise.reject(error);
    originalRequest._retry = true;

    const refreshToken = getRefresh();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          } else reject(error);
        });
      });
    }

    isRefreshing = true;
    try {
      const res = await axios.post(`${API_BASE}auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccess = res.data.access;
      setTokens({ access: newAccess });
      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      onRefreshed(newAccess);
      isRefreshing = false;
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      onRefreshed(null);
      clearTokens();
      toast.error("Session expired — please login again.");
      return Promise.reject(err);
    }
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const requireLogin = () => {
    if (!user) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const initUser = async () => {
      const access = getAccess();
      if (!access) {
        setLoading(false);
        return;
      }

      try {
        const resUser = await api.get("auth/user/");
        setUser(resUser.data);
      } catch (err) {
        console.error("User load failed", err);
        clearTokens();
        setUser(null);
      }
      setLoading(false);
    };

    initUser();
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        const [cartData, wishlistData] = await Promise.all([
          getCart(),
          getWishlist(),
        ]);
        setCart(cartData);
        setWishlist(wishlistData);
      })();
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.post("auth/login/", { email, password });
      const { access, refresh, user: returnedUser } = res.data;

      setTokens({ access, refresh });
      api.defaults.headers.common.Authorization = `Bearer ${access}`;
      setUser(returnedUser);

      await Promise.all([getCart(), getWishlist()]);
      toast.success(`Welcome back, ${returnedUser?.username || "User"}!`);
      return { success: true, user: returnedUser };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Invalid credentials or email not verified");
      } else {
        toast.error("Login failed. Try again later");
      }
      return { success: false };
    }
  };


  const signup = async ({ username, email, password, confirmPassword }) => {
    try {
      const res = await api.post("auth/register/", {
        username,
        email,
        password,
        password2: confirmPassword,
      });

      toast.success("Signup successful! Logging you in...");
      console.log("Signup response:", res.data);

      const loginRes = await login(email, password);
      if (loginRes.success) {
        return { success: true, user: loginRes.user };
      } else {
        toast.warn("Account created, please login manually");
        return { success: false };
      }
    } catch (err) {
      console.error("Signup backend error:", err.response?.data);
      const errors = err.response?.data;
      if (errors) {
        Object.entries(errors).forEach(([field, msgs]) => {
          msgs.forEach((msg) => toast.error(`${field}: ${msg}`));
        });
      } else {
        toast.error("Signup failed");
      }
      return { success: false };
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setCart([]);
    setWishlist([]);
    toast.info("Logged out");
  };

  const getCart = async () => {
    if (!requireLogin()) return [];
    try {
      const res = await api.get("cart/");
      setCart(res.data || []);
      return res.data;
    } catch {
      toast.error("Failed to load cart");
      return [];
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!requireLogin()) return { success: false };
    try {
      const res = await api.post("cart/", { product_id: productId, quantity });
      setCart((prev) => {
        const exists = prev.find((c) => c.product.id === res.data.product.id);
        return exists
          ? prev.map((c) =>
              c.product.id === res.data.product.id ? res.data : c
            )
          : [...prev, res.data];
      });
      toast.success("Added to cart");
      return { success: true };
    } catch {
      toast.error("Failed to add to cart");
      return { success: false };
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!requireLogin()) return { success: false };
    try {
      const res = await api.patch(`cart/${cartItemId}/`, {
        quantity: newQuantity,
      });
      setCart((prev) => prev.map((c) => (c.id === cartItemId ? res.data : c)));
      toast.info("Cart updated");
      return { success: true };
    } catch {
      toast.error("Failed to update cart");
      return { success: false };
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!requireLogin()) return { success: false };
    try {
      await api.delete(`cart/${cartItemId}/`);
      setCart((prev) => prev.filter((c) => c.id !== cartItemId));
      toast.info("Removed from cart");
      return { success: true };
    } catch {
      toast.error("Failed to remove cart item");
      return { success: false };
    }
  };

  const getWishlist = async () => {
    if (!requireLogin()) return [];
    try {
      const res = await api.get("wishlist/");
      setWishlist(res.data || []);
      return res.data;
    } catch {
      toast.error("Failed to fetch wishlist");
      return [];
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const res = await api.post("wishlist/", { product_id: productId });
      setWishlist([...wishlist, res.data]);
      toast.success("Added to wishlist!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add wishlist!");
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await api.delete(`wishlist/${wishlistId}/`);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const moveToCart = async (productId, quantity = 1) => {
    if (!requireLogin()) return { success: false };
    try {
      const res = await api.post("wishlist/move_to_cart/", {
        product_id: productId,
        quantity,
      });

      setWishlist((prev) => prev.filter((w) => w.product.id !== productId));
      setCart((prev) => {
        const exists = prev.find((c) => c.product.id === res.data.product.id);
        return exists
          ? prev.map((c) =>
              c.product.id === res.data.product.id ? res.data : c
            )
          : [...prev, res.data];
      });

      toast.success("Moved to cart");
      return { success: true };
    } catch {
      toast.error("Failed to move item");
      return { success: false };
    }
  };

  const checkout = async (payment_method = "COD") => {
    if (!requireLogin()) return { success: false };
    try {
      const res = await api.post("checkout/", { payment_method });
      await getCart();
      toast.success("Order placed successfully!");
      return { success: true, order: res.data };
    } catch {
      toast.error("Checkout failed");
      return { success: false };
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      cart,
      wishlist,
      login,
      signup,
      logout,
      getCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      getWishlist,
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      checkout,
      api,
      setUser,
    }),
    [user, loading, cart, wishlist]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
