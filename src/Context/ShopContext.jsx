import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); 
  const limit= 8;
  
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://brightique.onrender.com/products');
      // const normalized = res.data.map((p) => ({
      //   ...p,
      //   stock: p.stock != null ? p.stock : p.quantity ?? 0,
      // }));
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products:", err);
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
      if (user.role === "admin") {
        // Admin: fetch all users and collect all orders
        const res = await axios.get("https://brightique.onrender.com/users");
        const allOrders = res.data.flatMap(u => u.orders || []);
        setOrders(allOrders);
      } else {
        // Normal user: fetch only their orders
        const res = await axios.get(`https://brightique.onrender.com/${user.id}`);
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error("Failed loading orders", err);
    }
  };

  loadOrders();
}, [user]);

  
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const res = await axios.get(`https://brightique.onrender.com/users/${user.id}`);
          setWishlist(res.data.wishlist || []);
          setCart(res.data.cart || []);
          setOrders(res.data.orders || []); 
        } catch (err) {
          console.error("Failed loading user data", err);
        }
      }
    };
    loadUserData();
  }, [user]);

  // Save user data to backend
  const saveUserData = async (updatedFields) => {
    if (!user) return;
    try {
      await axios.patch(`https://brightique.onrender.com/users/${user.id}`, updatedFields);
    } catch (err) {
      console.error("Failed saving user data", err);
    }
  };

  // Update product stock
  const updateProductStock = async (productId, change) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, (p.stock ?? 0) + change) } : p
      )
    );

    try {
      const productRes = await axios.get(`https://brightique.onrender.com/products/${productId}`);
      const currentStock = productRes.data.stock ?? productRes.data.quantity ?? 0;
      const newStock = Math.max(0, currentStock + change);

      await axios.patch(`https://brightique.onrender.com/products/${productId}`, { stock: newStock });
    } catch (err) {
      console.error("Stock update failed", err);
    }
  };

  // Cart actions
  const addToCart = async (product) => {
    if ((product.stock ?? 0) <= 0) return;

    let updatedCart;
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    await saveUserData({ cart: updatedCart });
    updateProductStock(product.id, -1);
  };

  const increaseQuantity = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCart(updatedCart);
    await saveUserData({ cart: updatedCart });
    updateProductStock(productId, -1);
  };

  const decreaseQuantity = async (productId) => {
    const cartItem = cart.find((i) => i.id === productId);
    if (!cartItem) return;

    const updatedCart = cart
      .map((i) => (i.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);

    setCart(updatedCart);
    await saveUserData({ cart: updatedCart });
    updateProductStock(productId, 1);
  };

  const removeFromCart = async (productId) => {
    const removedItem = cart.find((i) => i.id === productId);
    if (!removedItem) return;

    const updatedCart = cart.filter((i) => i.id !== productId);
    setCart(updatedCart);
    await saveUserData({ cart: updatedCart });
    updateProductStock(productId, removedItem.quantity);
  };

  
  const addToWishlist = async (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (!exists) {
        const updatedWishlist = [...prev, product];
        saveUserData({ wishlist: updatedWishlist });
        return updatedWishlist;
      }
      return prev;
    });
  };

  const removeFromWishlist = async (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    saveUserData({ wishlist: updatedWishlist });
  };

  const isOutOfStock = (productId) => {
    const product = products.find((p) => p.id === productId);
    return !product || (product.stock ?? 0) <= 0;
  };

  const addToCartFromWishlist = async (product) => {
    if ((product.stock ?? 0) <= 0) return;

    let updatedCart;
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    await saveUserData({ cart: updatedCart });
    await updateProductStock(product.id, -1);
  };

  
  const cancelOrder = async (orderId) => {
  if (!user) return;

  const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
  if (!confirmCancel) return;

  try {
    const res = await axios.get(`https://brightique.onrender.com/${user.id}`);
    const orders = res.data.orders || [];

    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    );

    
    await axios.patch(`https://brightique.onrender.com/${user.id}`, {
      orders: updatedOrders
    });

    
    setOrders(updatedOrders);

    alert("Your order was cancelled ");
  } catch (err) {
    console.error("Failed to cancel order", err);
    alert("Failed to cancel the order ");
  }
};



  return (
    <ShopContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        products,
        isOutOfStock,
        updateProductStock,
        setCart,
        addToCartFromWishlist,
        orders,
        setOrders,
        cancelOrder,
        limit,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
