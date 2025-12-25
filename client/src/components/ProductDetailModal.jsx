import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingCart, Leaf as Eco } from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0) {
                setSelectedSize(product.variants[0].size);
                setPrice(product.variants[0].price);
            } else {
                setPrice(product.basePrice);
            }
        }
    }, [product]);

    const handleSizeChange = (e) => {
        const size = e.target.value;
        setSelectedSize(size);
        const variant = product.variants.find(v => v.size === size);
        if (variant) setPrice(variant.price);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedSize, price);
        onClose();
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row animate-fade-in-up">
                <button
                    className="absolute top-8 right-8 z-20 p-3 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full text-gray-600 dark:text-gray-300 transition-colors backdrop-blur-md"
                    onClick={onClose}
                >
                    <span className="material-symbols-rounded text-xl">close</span>
                </button>

                <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-8 md:p-16 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 to-transparent"></div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-[300px] md:max-h-[500px] w-auto object-contain drop-shadow-2xl z-10 transition-transform duration-500 hover:scale-105 blend-image"
                    />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto bg-white dark:bg-gray-900">
                    <div className="mb-auto">
                        <span className="px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                            {product.category}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
                            {product.name}
                        </h2>
                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-4xl font-black text-primary-600 dark:text-primary-400">
                                ₹{price.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10 font-light">
                            {product.description}
                        </p>

                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-10">
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                                    Select Variation
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedSize}
                                        onChange={handleSizeChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none appearance-none cursor-pointer font-bold text-lg text-gray-900 dark:text-white transition-all shadow-sm"
                                    >
                                        {product.variants.map(v => (
                                            <option key={v.size} value={v.size}>{v.size} - ₹{v.price.toFixed(2)}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-rounded absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-2xl">expand_more</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 mb-8">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-gray-900 dark:text-white uppercase tracking-wider">
                                <span className="material-symbols-rounded text-green-500">eco</span>
                                Highlights
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3 list-disc pl-5 marker:text-primary-500 font-medium">
                                {(product.nutrition && product.nutrition.length > 0)
                                    ? product.nutrition.map((n, i) => <li key={i}>{n}</li>)
                                    : <li>No additional specs available.</li>
                                }
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold shadow-xl hover:scale-[1.02] transition-all duration-300 flex justify-center items-center gap-3 text-lg"
                    >
                        <span className="material-symbols-rounded">shopping_cart</span>
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
