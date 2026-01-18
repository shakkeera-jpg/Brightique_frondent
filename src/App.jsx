import { Routes, Route,useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home"
import About from "./Pages/About";
import Products from './Pages/Products'


import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductCard from "./Pages/ProductCard.jsx";
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/CheckOut";
import OrderConfirmed from "./Pages/OrderConfirmed";
import Order from "./Pages/Order";
import Footer from "./Components/Footer";
import Profile from "./Pages/Profile";
import AdminApp from "./Admin/AdminApp";
import AdminRoute from "./Admin/Components/AdminRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import useNotificationSocket from "./hooks/useNotificationSocket.js";
import { useContext } from "react";
import { AuthContext } from "./Context/UserContext";




function App() {

  const { user } = useContext(AuthContext);
  const location=useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin");

  const token = localStorage.getItem("access");
  useNotificationSocket(user ? token : null);
  return (
    <div>
   
     {!isAdminRoute &&<Navbar/>} 
    
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/About" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/product/:id" element={<ProductCard/>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmed />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Profile" element={<Profile/>} />
        
       

       <Route path="/admin/*" 
       element={
        <AdminRoute>
       <AdminApp />
       </AdminRoute>
       } />
      </Routes>
      {!isAdminRoute && <Footer/>}
    
    </div>
  )
}

export default App