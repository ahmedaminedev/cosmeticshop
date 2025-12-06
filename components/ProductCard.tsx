
import React from 'react';
import type { Product } from '../types';
import { ShoppingBagIcon, EyeIcon, HeartIcon } from './IconComponents';
import { useCart } from './CartContext';
import { useFavorites } from './FavoritesContext';
import { useToast } from './ToastContext';

interface ProductCardProps {
    product: Product;
    onPreview: (product: Product) => void;
    onNavigateToProductDetail: (productId: number | string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPreview, onNavigateToProductDetail }) => {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToast } = useToast();
    
    const isOutOfStock = product.quantity === 0;
    const isFav = isFavorite(product.id as number);

    const displayImage = (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isOutOfStock) return;
        addToCart(product);
        addToast("Ajouté au sac", "success");
    };
    
    const handlePreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onPreview(product);
    }

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(product.id as number);
    }
    
    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onNavigateToProductDetail(product.id);
    };

    const discountPercentage = product.discount || (product.oldPrice && product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
    const isNew = product.name.toLowerCase().includes('nouveau') || (!product.discount && !product.oldPrice && Math.random() > 0.7);

    return (
        <div className="group relative w-full bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full hover:-translate-y-1">
            
            {/* Zone Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-t-[1.5rem]">
                <a href="#" onClick={handleProductClick} className="block w-full h-full p-4">
                    <img 
                        src={displayImage} 
                        alt={product.name} 
                        loading="lazy"
                        className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                    />
                </a>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
                    {discountPercentage > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            -{discountPercentage}%
                        </span>
                    )}
                    {isNew && (
                        <span className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            Nouveau
                        </span>
                    )}
                </div>

                {/* Bouton Favoris */}
                <button 
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all z-20 hover:scale-110 ${isFav ? 'text-rose-500 bg-white/80 shadow-sm' : 'text-gray-400 hover:text-rose-500'}`}
                    aria-label="Favoris"
                >
                    <HeartIcon className="w-4 h-4" solid={isFav} />
                </button>

                {/* Action Bar (Hover Desktop / Always visible Mobile if desired, but here stick to hover for clean look) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingBagIcon className="w-4 h-4" />
                        {isOutOfStock ? 'Rupture' : 'Ajouter au sac'}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-grow text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {product.brand}
                </p>
                
                <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5em] leading-snug">
                    <a href="#" onClick={handleProductClick} className="hover:text-rose-600 transition-colors">
                        {product.name}
                    </a>
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                            {product.price.toFixed(3)} DT
                        </span>
                        {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                {product.oldPrice.toFixed(3)} DT
                            </span>
                        )}
                    </div>
                    {/* Quick Eye for preview */}
                    <button onClick={handlePreview} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors lg:hidden">
                        <EyeIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};
