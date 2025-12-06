
import React from 'react';
import type { Product } from '../types';
import { EyeIcon, ShoppingBagIcon } from './IconComponents';
import { useCart } from './CartContext';

interface ProductListItemProps {
    product: Product;
    onPreview: (product: Product) => void;
    onNavigateToProductDetail: (productId: number) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, onPreview, onNavigateToProductDetail }) => {
    const { addToCart, openCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart(product);
        openCart();
    };
    
    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onNavigateToProductDetail(product.id);
    }

    const discountPercentage = product.oldPrice && product.price 
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : product.discount;

    return (
        <div className="flex flex-col md:flex-row items-center p-4 gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group cursor-pointer" onClick={handleProductClick}>
            {/* Image Section */}
            <div className="relative flex-shrink-0 w-full md:w-48 aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
                {discountPercentage && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        -{discountPercentage}%
                    </div>
                )}
            </div>

            {/* Middle Section: Product Details */}
            <div className="flex-grow text-center md:text-left self-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-lg">{product.description}</p>
            </div>

            {/* Right Section: Price and Actions */}
            <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.price.toFixed(0)} DT</p>
                    {product.oldPrice && (
                         <p className="text-sm text-gray-400 line-through">{product.oldPrice.toFixed(0)} DT</p>
                    )}
                </div>
                <button 
                    onClick={handleAddToCart}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs py-3 rounded-lg hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    <ShoppingBagIcon className="w-4 h-4" />
                    <span>Ajouter</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onPreview(product); }} className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 uppercase tracking-wide">
                    <EyeIcon className="w-4 h-4" />
                    Aperçu
                </button>
            </div>
        </div>
    );
};
