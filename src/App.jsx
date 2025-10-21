import { Routes, Route,useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home"
import About from "./Pages/About";
import Products from './Pages/Products'


import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductCard from './Pages/ProductCard.jsx'
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/CheckOut";
import OrderConfirmed from "./Pages/OrderConfirmed";
import Order from "./Pages/Order";
import Footer from "./Components/Footer";
import Profile from "./Pages/Profile";
import AdminApp from "./Admin/AdminApp";
import AdminRoute from "./Admin/Components/AdminRoute";



function App() {

  const location=useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin"); 

  return (
    <div>
   
     {!isAdminRoute &&<Navbar/>} 
    
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/About" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/product/:id" element={<ProductCard/>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/OrderConfirmed/:id" element={<OrderConfirmed />} />
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