import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import AuthProvider from './Context/UserContext.jsx';
import { ShopProvider } from './Context/ShopContext.jsx';
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./Context/NotificationContext.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
          <ShopProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                 
                  background: "rgba(255, 255, 255, 0.85)", 
                  backdropFilter: "blur(10px)",           
                  color: "#333333",
                  border: "1px solid rgba(175, 143, 66, 0.2)", 
                  borderRadius: "4px",                     
                  padding: "12px 20px",

                  
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "0.15em",                 
                  textTransform: "uppercase",              
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)", 
                },
                success: {
                  icon: <span style={{ color: "#AF8F42" }}>•</span>, 
                  style: {
                    borderLeft: "2px solid #AF8F42", 
                  },
                },
                error: {
                  icon: <span style={{ color: "#D14343" }}>•</span>, 
                  style: {
                    borderLeft: "2px solid #D14343",
                  },
                },
              }}
            />
            <App />
          </ShopProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);