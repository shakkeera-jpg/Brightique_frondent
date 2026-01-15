import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { base } from "../api/axios";
import api from "../api/axios";
import { AuthContext } from "../Context/UserContext";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

 const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const [pagination, setPagination] = useState({
  next: null,
  previous: null,
  currentPage: 1,
  totalPages: 1,
});
  const limit = 8;

  

  
  const fetchProducts = async ({
  search = "",
  category = "All",
  sortOrder = "none",
  url = `${base}products/`,
} = {}) => {
  try {
    setLoading(true);

    const res = await axios.get(url, {
      params: {
        search: search || undefined,
        category: category !== "All" ? category : undefined,
        ordering:
          sortOrder === "lowToHigh"
            ? "price"
            : sortOrder === "highToLow"
            ? "-price"
            : undefined,
      },
    });

    setProducts(res.data.products || res.data.results || []);
    setPagination({
      next: res.data.pagination?.next || null,
      previous: res.data.pagination?.previous || null,
      currentPage: res.data.pagination?.current_page || 1,
      totalPages: res.data.pagination?.total_pages || 1,
    });
  } catch (err) {
    console.error("Product fetch failed", err);
    setError("Failed to load products");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setCart([]);
      setOrders([]);
    }
  }, [user]);

 
  useEffect(() => {
  const loadOrders = async () => {
    if (!user) return;

    try {
      const res = await api.get("orders/"); 
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed loading orders:", err.response?.data || err);
    }
  };

  loadOrders();
}, [user]);

 
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await api.get("wishlist/");
        setWishlist(res.data);
      } catch (err) {
        console.error("Wishlist fetch failed", err);
      }
    };

    fetchWishlist();
  }, [user]);

 
  const toggleWishlist = async (productId) => {
  const alreadyInWishlist = isInWishlist(productId);

  
  setWishlist(prev =>
    alreadyInWishlist
      ? prev.filter(item => item.product.id !== productId)
      : [...prev, { product: { id: productId } }]
  );

  try {
    await api.post("wishlist/", { product_id: productId });
  } catch (err) {
    console.error("Wishlist toggle failed", err);

    
    setWishlist(prev =>
      alreadyInWishlist
        ? [...prev, { product: { id: productId } }]
        : prev.filter(item => item.product.id !== productId)
    );
  }
};

  
  const isInWishlist = (productId) =>
  wishlist.some(item => item.product.id === productId);

  
  const saveCart = async (updatedCart) => {
    if (!user) return;
    try {
      await axios.patch(
        `${base}users/${user.id}/`,
        { cart: updatedCart },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.error("Failed saving cart:", err);
    }
  };

  
  const loadCart = async () => {
  if (!user) return;

  try {
    const res = await api.get("cart/");
    setCart(res.data.items || []);
  } catch (err) {
    console.error("Cart load failed", err);
  }
};

useEffect(() => {
  loadCart();
}, [user]);

const addToCart = async (product) => {
  
  setCart(prev => {
    const existing = prev.find(
      item => item.product.id === product.id
    );

    if (existing) {
      return prev.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        id: Date.now(),   
        product,          
        quantity: 1,
      },
    ];
  });

  try {
    await api.post("cart/add/", {
      product_id: product.id,
    });
  } catch (err) {
    console.error("Add to cart failed", err);
    loadCart(); 
  }
};



const increaseQuantity = async (cartItemId) => {
  const item = cart.find(i => i.id === cartItemId);
  if (!item) return;

  const stock = getProductStock(item.product.id);

  
  if (item.quantity >= stock) {
    console.warn("Stock limit reached");
    return;
  }

  
  setCart(prev =>
    prev.map(i =>
      i.id === cartItemId
        ? { ...i, quantity: i.quantity + 1 }
        : i
    )
  );

  
  try {
    await api.patch(`cart/update/${cartItemId}/`, {
      quantity: item.quantity + 1,
    });
  } catch (err) {
    console.error("Increase qty failed", err);
  }
};

const getProductStock = (productId) => {
  const product = products.find(p => p.id === productId);
  return product?.stock ?? 0;
};


const decreaseQuantity = async (cartItemId) => {
  setCart(prev =>
    prev.map(item =>
      item.id === cartItemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
  );

  try {
    await api.patch(`cart/update/${cartItemId}/`, {
      action: "decrease",
    });
  } catch (err) {
    console.error("Decrease qty failed", err);
  }
};



const removeFromCart = async (cartItemId) => {
  
  const previousCart = cart;

  setCart(prev => prev.filter(item => item.id !== cartItemId));

  try {
    await api.delete(`cart/remove/${cartItemId}/`);
  } catch (err) {
    console.error("Remove cart failed", err);

    
    setCart(previousCart);
  }
};


  
const getCartQuantity = (productId) => {
  const item = cart.find(i => i.product.id === productId);
  return item?.quantity ?? 0;
};

const isOutOfStock = (productId) => {
  return getCartQuantity(productId) >= getProductStock(productId);
};


  const addToCartFromWishlist = async (product) => {
  try {
    await api.post("cart/add/", {
      product_id: product.id,
    });

    await removeFromWishlist(product.id);

    await Promise.all([
      loadCart(),
      fetchProducts(), 
    ]);
  } catch (err) {
    console.error("Add to cart from wishlist failed", err.response?.data || err);
  }
};


const isInCart = (productId) => {
  return cart.some(
    (item) => item.product.id === productId
  );
};

const fetchCart = async () => {
  try {
    const res = await api.get("cart/");
    setCart(res.data.items || []);
  } catch (err) {
    console.error("Failed to fetch cart", err);
  }
};


  //  CANCEL ORDER 
  const cancelOrder = async (orderId) => {
  try {
    const res = await axios.post(
      `${base}orders/${orderId}/cancel/`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
    );
    // Update local orders state
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: res.data.status } : order
      )
    );
  } catch (err) {
    console.error("Cancel order failed:", err);
  }
};

  const removeFromWishlist = async (productId) => {
  try {
    const res = await api.post("wishlist/", {
      product_id: productId,
    });

    if (res.data.removed) {
      setWishlist((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    }
  } catch (err) {
    console.error("Remove wishlist failed", err);
  }
};

  return (
    <ShopContext.Provider
      value={{
        wishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        products,
        isOutOfStock,
        setCart,
        addToCartFromWishlist,
        orders,
        setOrders,
        cancelOrder,
        limit,
        isInCart,
        fetchCart,
        getProductStock
        
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
