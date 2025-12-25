import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import { CartProvider } from './context/CartContext';
import { CheckCircle2 } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ProfileModal from './components/ProfileModal';

const SuccessToast = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up">
      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
        <span className="material-symbols-rounded text-green-400">check_circle</span>
        <span className="font-bold">Order Placed Successfully!</span>
        <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100">
          <span className="material-symbols-rounded">close</span>
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleRegisterSuccess = () => {
    setAuthView('login');
  };

  // If not logged in, show Auth screens
  if (!user) {
    return authView === 'login' ? (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthView('register')}
      />
    ) : (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <CartProvider>
      <div className="min-h-screen">
        <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />

        <Navbar
          onOpenCart={() => setCartOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
        />

        <main>
          <Hero />
          <ProductList onOpenDetail={handleOpenDetail} />
        </main>

        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

              {/* Brand Info */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                    <span className="material-symbols-rounded text-3xl">school</span>
                  </div>
                  <span className="font-black text-2xl tracking-tight dark:text-white">Student'S Mart</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-sm font-medium">
                  Nurturing entrepreneurial spirits through practical retail experience. Providing high-quality uniforms and healthy snacks for a brighter future.
                </p>
                <div className="flex gap-4">
                  <a className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:scale-110" href="https://www.facebook.com/rmdispcmc/" target="_blank" rel="noreferrer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
                  </a>
                  <a className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300 hover:scale-110" href="https://www.instagram.com/rmdispcmc?igsh=endxaWtlZ3lvczVi" target="_blank" rel="noreferrer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                  </a>
                </div>
              </div>

              {/* Links Sections */}
              <div className="md:col-span-2">
                <h4 className="font-bold text-gray-900 dark:text-white mb-8 text-lg">Shop</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <li><a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="#products">Uniforms</a></li>
                  <li><a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="#products">Snacks</a></li>
                  <li><a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="#products">Beverages</a></li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-bold text-gray-900 dark:text-white mb-8 text-lg">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <li><a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="#about">About</a></li>
                  <li><a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="#contact">Contact</a></li>
                  <li><a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="#">Terms</a></li>
                </ul>
              </div>
              <div className="md:col-span-3">
                <h4 className="font-bold text-gray-900 dark:text-white mb-8 text-lg">Get in Touch</h4>
                <ul className="space-y-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-rounded text-primary-500 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">location_on</span>
                    <span className="leading-relaxed">Pradhikaran, Nigdi, Pune, Maharashtra 411044</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="material-symbols-rounded text-primary-500 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">mail</span>
                    <span>info@rmdis.org</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-gray-100 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
              <p>© 2025 Student Mart. All rights reserved.</p>
              <div className="flex gap-8">
                <a className="hover:text-primary-600 transition-colors" href="#">Privacy Policy</a>
                <a className="hover:text-primary-600 transition-colors" href="#">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseDetail}
        />

        <CartModal
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
        />

        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handlePaymentSuccess}
        />

        <OrderHistoryModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
        />

      </div>
    </CartProvider>
  );
};

export default App;
