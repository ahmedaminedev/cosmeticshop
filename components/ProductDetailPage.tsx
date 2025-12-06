
import React, { useState, useMemo, useEffect } from 'react';
import type { Product } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { useCart } from './CartContext';
import { useFavorites } from './FavoritesContext';
import { PlusIcon, MinusIcon, HeartIcon, SparklesIcon, CheckCircleIcon } from './IconComponents';
import { ProductCarousel } from './ProductCarousel';
import { ProductGallery } from './ProductGallery';
import { ProductHighlights } from './ProductHighlights';
import { ReviewsSection } from './ReviewsSection'; // Import

// Icônes spécifiques beauté (SVG inline)
const VeganIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18c-4.418 0-8 3.582-8 8s3.582 8 8 8m0-16c4.418 0 8 3.582 8 8s-3.582 8-8 8m-4-6a4 4 0 008 0" />
    </svg>
);

const CrueltyFreeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.318l7.682-7.636a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

interface ProductDetailPageProps {
    product: Product;
    allProducts: Product[];
    onNavigateHome: () => void;
    onNavigateToProductDetail: (productId: number | string) => void;
    onPreview: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => (
    <div className="flex items-center gap-2 group cursor-pointer">
        <div className="flex items-center text-gold-400">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <span className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors border-b border-dashed border-gray-300">
            ({reviewCount} avis)
        </span>
    </div>
);

type Tab = 'description' | 'ingredients' | 'shipping';

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, allProducts, onNavigateHome, onNavigateToProductDetail, onPreview }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>('description');
    const { addToCart, openCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const isFav = isFavorite(product.id as number);
    const isOutOfStock = product.quantity === 0;

    const productImages = useMemo(() => {
        if (product.images && product.images.length > 0) return product.images;
        return product.imageUrl ? [product.imageUrl] : [];
    }, [product]);

    const similarProducts = useMemo(() => 
        allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10),
    [allProducts, product]);

    useEffect(() => {
        document.title = `${product.name} - Cosmetics Shop`;
        window.scrollTo(0,0);
    }, [product]);

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity);
        openCart();
    };

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-gray-800 dark:text-gray-200 pb-20 lg:pb-0">
            
            {/* Minimalist Breadcrumb */}
            <div className="border-b border-gray-50 dark:border-gray-900 hidden lg:block">
                <div className="max-w-screen-xl mx-auto px-8 py-4">
                    <Breadcrumb items={[{ name: 'Accueil', onClick: onNavigateHome }, { name: product.category }, { name: product.name }]} />
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-0 lg:px-8 py-0 lg:py-12">
                <div className="flex flex-col lg:flex-row lg:gap-16 items-start">
                    
                    {/* Left Column: Gallery */}
                    <div className="w-full lg:w-[60%] mb-8 lg:mb-0 bg-gray-50 dark:bg-gray-900 lg:bg-transparent">
                        <div className="sticky top-24">
                            <ProductGallery images={productImages} productName={product.name} />
                            
                            {/* Visual Reassurance (Desktop only) */}
                            <div className="hidden lg:grid mt-10 grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="text-center group">
                                    <div className="w-12 h-12 mx-auto bg-rose-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-400 mb-3 transition-colors group-hover:bg-rose-100">
                                        <SparklesIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Authentique</span>
                                </div>
                                <div className="text-center group">
                                    <div className="w-12 h-12 mx-auto bg-rose-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-400 mb-3 transition-colors group-hover:bg-rose-100">
                                        <VeganIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Naturel</span>
                                </div>
                                <div className="text-center group">
                                    <div className="w-12 h-12 mx-auto bg-rose-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-400 mb-3 transition-colors group-hover:bg-rose-100">
                                        <CrueltyFreeIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Cruelty Free</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="w-full lg:w-[40%] px-6 lg:px-0 relative lg:pt-4">
                        <div className="sticky top-24 space-y-8">
                            
                            {/* Product Header */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em]">
                                        {product.brand}
                                    </h2>
                                    {/* Placeholder star rating (dynamic later) */}
                                    <StarRating rating={5} reviewCount={0} />
                                </div>

                                <h1 className="text-3xl lg:text-5xl font-serif font-medium text-gray-900 dark:text-white leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-4 pt-2">
                                    <p className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white">
                                        {product.price.toFixed(3)} <span className="text-base lg:text-lg font-normal text-gray-500">TND</span>
                                    </p>
                                    {product.oldPrice && (
                                        <p className="text-base lg:text-lg text-gray-400 line-through font-light">
                                            {product.oldPrice.toFixed(3)} TND
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                                <p>{product.description ? product.description.substring(0, 150) + '...' : "Un essentiel beauté pour sublimer votre quotidien."}</p>
                            </div>

                            {/* Selectors & Actions (Desktop) */}
                            <div className="hidden lg:block pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                <div className="flex gap-4">
                                    {/* Quantity */}
                                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full px-1 py-1 w-32 justify-between border border-gray-200 dark:border-gray-700">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-gray-600 hover:text-rose-500 shadow-sm" disabled={quantity <= 1}><MinusIcon className="w-3 h-3" /></button>
                                        <span className="font-serif font-bold text-lg">{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-gray-600 hover:text-rose-500 shadow-sm"><PlusIcon className="w-3 h-3" /></button>
                                    </div>

                                    {/* Add to Bag Button */}
                                    <button 
                                        onClick={handleAddToCart} 
                                        disabled={isOutOfStock}
                                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-serif font-bold uppercase tracking-widest text-sm py-4 rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        <span>{isOutOfStock ? 'Indisponible' : 'Ajouter au sac'}</span>
                                        {!isOutOfStock && <span className="w-1 h-1 bg-current rounded-full"></span>}
                                        {!isOutOfStock && <span>{(product.price * quantity).toFixed(3)} TND</span>}
                                    </button>
                                    
                                    <button onClick={() => toggleFavorite(product.id as number)} className={`p-4 rounded-full border transition-all ${isFav ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                                        <HeartIcon className="w-5 h-5" solid={isFav} />
                                    </button>
                                </div>
                                {!isOutOfStock && (
                                    <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-medium">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        En stock - Expédition sous 24h
                                    </div>
                                )}
                            </div>

                            {/* Info Tabs */}
                            <div className="pt-4 lg:pt-8">
                                <div className="flex border-b border-gray-100 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
                                    {[{id: 'description', label: 'Détails'}, {id: 'ingredients', label: 'Composition'}, {id: 'shipping', label: 'Livraison'}].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as Tab)}
                                            className={`pb-3 px-4 text-xs lg:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap relative ${activeTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {tab.label}
                                            {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white"></span>}
                                        </button>
                                    ))}
                                </div>

                                <div className="min-h-[100px] animate-fadeIn text-sm lg:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                                    {activeTab === 'description' && (
                                        <>
                                            <p className="mb-4">{product.description || "Description détaillée à venir."}</p>
                                            <p className="text-xs text-gray-400">REF: {product.id}</p>
                                        </>
                                    )}
                                    
                                    {activeTab === 'ingredients' && (
                                        (product.specifications && product.specifications.length > 0) ? (
                                            <ul className="space-y-2">
                                                {product.specifications.map((spec, idx) => (
                                                    <li key={idx} className="flex justify-between border-b border-gray-50 dark:border-gray-800 pb-2">
                                                        <span className="text-xs uppercase tracking-wide text-gray-500">{spec.name}</span>
                                                        <span className="font-serif italic">{spec.value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p className="italic text-gray-400">Ingrédients non listés.</p>
                                    )}

                                    {activeTab === 'shipping' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /> Livraison offerte dès 300 DT</div>
                                            <div className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /> Expédition 24/48h</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BLOC ÉDITORIAL DYNAMIQUE "WHY WE LOVE IT" --- */}
                {product.highlights && (
                    <div className="px-6 lg:px-0">
                        <ProductHighlights highlights={product.highlights} />
                    </div>
                )}

                {/* Reviews Section */}
                <ReviewsSection targetId={product.id} targetType="product" />

                {/* Similar Products */}
                <div className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800 px-6 lg:px-0">
                    <h2 className="text-2xl lg:text-3xl font-serif text-gray-900 dark:text-white text-center mb-10">Vous aimerez aussi</h2>
                    {similarProducts.length > 0 && (
                        <ProductCarousel title="" products={similarProducts} onPreview={onPreview} onNavigateToProductDetail={onNavigateToProductDetail} />
                    )}
                </div>
            </div>
        </div>
    );
};
