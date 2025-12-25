import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onOpenDetail }) => {
    const displayPrice = product.variants && product.variants.length > 0
        ? `From ₹${product.variants[0].price.toFixed(2)}`
        : `₹${product.basePrice.toFixed(2)}`;

    return (
        <div
            className="group bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
            onClick={() => onOpenDetail(product)}
        >
            <div className="h-72 overflow-hidden relative bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-8 group-hover:bg-primary-50 dark:group-hover:bg-gray-800 transition-colors">
                <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain h-full w-full transform group-hover:scale-110 transition duration-700 drop-shadow-xl blend-image"
                />
                <div className="absolute top-5 right-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1 text-[10px] font-bold text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 uppercase tracking-widest shadow-sm">
                    {product.category}
                </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {product.name}
                    </h3>
                </div>
                <div className="mb-4">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{displayPrice}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 line-clamp-2 min-h-[40px] leading-relaxed font-medium">
                    {product.description}
                </p>
                <button
                    className="w-full mt-auto py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 shadow-sm group-hover:shadow-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(product);
                    }}
                >
                    <span className="material-symbols-rounded text-xl">shopping_cart</span>
                    {product.variants && product.variants.length > 0 ? 'Select Size' : 'Add to Bag'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
