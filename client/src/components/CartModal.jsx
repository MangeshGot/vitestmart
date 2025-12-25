import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight as ArrowForward } from 'lucide-react';

const CartModal = ({ isOpen, onClose, onCheckout }) => {
    const { cart, removeFromCart, updateQty, subtotal } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex justify-between items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary-600">shopping_bag</span>
                        Your Bag
                    </h2>
                    <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
                        onClick={onClose}
                    >
                        <span className="material-symbols-rounded text-xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <span className="material-symbols-rounded text-6xl mb-4 opacity-20">shopping_bag</span>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">Your bag is empty</p>
                            <p className="text-sm opacity-60">Looks like you haven't added anything yet.</p>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 group animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-800 p-2 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain blend-image" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white truncate pr-4">{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-rounded text-lg">delete</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-primary-600 font-bold">₹{item.price.toFixed(2)}</span>
                                        {item.size && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400">
                                                Size: {item.size}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                                                className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500"
                                            >
                                                <span className="material-symbols-rounded text-lg">remove</span>
                                            </button>
                                            <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                                                className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500"
                                            >
                                                <span className="material-symbols-rounded text-lg">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm font-medium text-gray-500">
                            <span>Subtotal</span>
                            <span className="text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-gray-500">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <div className="flex justify-between text-xl font-black">
                            <span className="text-gray-900 dark:text-white">Total</span>
                            <span className="text-primary-600">₹{subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        Checkout
                        <span className="material-symbols-rounded">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
