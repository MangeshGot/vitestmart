import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Moon, Sun, LogOut, Menu, History, Info, Package, Home } from 'lucide-react'; // Placeholder for material icons if needed, or use material icons via link

const Navbar = ({ onOpenCart, onOpenHistory, onOpenAdmin, onOpenProfile }) => {
    const { cartCount } = useCart();
    const [isDark, setIsDark] = useState(sessionStorage.theme === 'dark' || (!('theme' in sessionStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            sessionStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            sessionStorage.theme = 'light';
        }
    }, [isDark]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 top-0 ${isScrolled ? 'glass shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 group-hover:scale-105 transition-transform duration-500 rotate-0 group-hover:-rotate-6">
                            <span className="material-symbols-rounded text-3xl">school</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-2xl tracking-tight leading-none text-gray-900 dark:text-white">Student'S</span>
                            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 tracking-[0.2em] uppercase">Mart</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full p-1.5 border border-gray-100 dark:border-gray-700 mr-6">
                            <a href="#home" className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Home</a>
                            <a href="#products" className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Products</a>
                            <a href="#about" className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">About</a>
                            <button onClick={onOpenHistory} className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Orders</button>
                            {JSON.parse(sessionStorage.getItem('user'))?.isAdmin && (
                                <button onClick={onOpenAdmin} className="px-5 py-2.5 rounded-full text-sm font-bold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:shadow-md transition-all">Dashboard</button>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center text-gray-500 dark:text-gray-400"
                            >
                                <span className="material-symbols-rounded text-xl">{isDark ? 'light_mode' : 'dark_mode'}</span>
                            </button>

                            <button onClick={onOpenCart} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center group relative">
                                <span className="material-symbols-rounded text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors text-xl">shopping_bag</span>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm animate-fade-in-up">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-2 px-1 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                    {(JSON.parse(sessionStorage.getItem('user'))?.full_name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 pr-2 max-w-[80px] truncate">
                                    {JSON.parse(sessionStorage.getItem('user'))?.full_name.split(' ')[0]}
                                </span>
                                <button onClick={onOpenProfile} className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 flex items-center justify-center hover:scale-105 transition-all shadow-sm mr-1">
                                    <span className="material-symbols-rounded text-sm">manage_accounts</span>
                                </button>
                                <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:scale-105 transition-all shadow-md">
                                    <span className="material-symbols-rounded text-sm">logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={onOpenCart} className="relative p-2">
                            <span className="material-symbols-rounded text-2xl text-gray-700 dark:text-gray-200">shopping_bag</span>
                            {cartCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <span className="material-symbols-rounded text-3xl">menu_open</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileMenuOpen && (
                    <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 absolute w-full left-0 shadow-xl z-40 transition-all rounded-b-3xl animate-fade-in-up">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            <a href="#home" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                                <span className="material-symbols-rounded text-primary-500">home</span> Home
                            </a>
                            <a href="#products" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                                <span className="material-symbols-rounded text-primary-500">inventory_2</span> Products
                            </a>
                            <a href="#about" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                                <span className="material-symbols-rounded text-primary-500">info</span> About
                            </a>
                            <button onClick={onOpenHistory} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                                <span className="material-symbols-rounded text-primary-500">history</span> Order History
                            </button>
                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setIsDark(!isDark)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold"
                                >
                                    <span className="material-symbols-rounded">{isDark ? 'light_mode' : 'dark_mode'}</span>
                                    Theme
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold"
                                >
                                    <span className="material-symbols-rounded">logout</span>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
