import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Search, SearchX } from 'lucide-react';

const ProductList = ({ onOpenDetail }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = ['all', 'chiki', 'smooth', 'milk', 'Dress'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCategory === 'all' || p.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="py-32 bg-white dark:bg-gray-900/50 relative" id="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Filter Tabs */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                            Curated <span className="text-gradient">Collection</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                            Thoughtfully selected essentials for every student's daily needs.
                        </p>
                    </div>

                    <div className="flex overflow-x-auto pb-4 lg:pb-0 gap-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-2xl mx-auto mb-20 group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span className="material-symbols-rounded text-gray-400 group-focus-within:text-primary-500 transition-colors text-2xl">search</span>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all shadow-xl shadow-gray-200/50 dark:shadow-none text-lg font-medium placeholder-gray-400"
                        placeholder="Search for uniforms, snacks, drinks..."
                    />
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onOpenDetail={onOpenDetail}
                        />
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-24 text-gray-400 flex flex-col items-center">
                            <span className="material-symbols-rounded text-7xl mb-6 opacity-20">search_off</span>
                            <p className="text-xl font-medium">No products found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductList;
