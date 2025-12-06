
import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ProductCard } from './ProductCard';
import { Squares2X2Icon, Bars3Icon, ChevronDownIcon, ShoppingBagIcon } from './IconComponents';
import { ProductListItem } from './ProductListItem';
import { useCart } from './CartContext';

interface PromotionsPageProps {
    onNavigateHome: () => void;
    onNavigateToCategory: (categoryName: string) => void;
    onPreview: (product: Product) => void;
    products: Product[];
    onNavigateToProductDetail: (productId: number) => void;
}

const CountdownTimer: React.FC = () => {
    // ... timer logic ...
    const calculateTimeLeft = () => {
        const difference = +new Date("2024-12-31") - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
                heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                secondes: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map(interval => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return null;
        }
        return (
            <div key={interval} className="flex flex-col items-center mx-2">
                <span className="text-3xl md:text-4xl font-extrabold font-serif">{String(timeLeft[interval]).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{interval}</span>
            </div>
        );
    });

    return (
        <div className="flex items-center justify-center text-gray-900 dark:text-white bg-white/80 dark:bg-black/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
            {timerComponents.length ? timerComponents : <span>Terminé</span>}
        </div>
    );
};

const DealOfTheDay: React.FC<{ product: Product; onPreview: (product: Product) => void; onNavigateToProductDetail: (productId: number) => void; }> = ({ product, onPreview, onNavigateToProductDetail }) => {
    const { addToCart, openCart } = useCart();
    
    const handleAddToCart = () => {
        addToCart(product);
        openCart();
    };

    return (
        <section className="my-16 relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 lg:p-16 gap-12">
                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-rose-500 rounded-full filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToProductDetail(product.id); }}>
                            <img src={product.imageUrl} alt={product.name} className="relative w-full max-w-sm object-contain drop-shadow-2xl transform group-hover:-rotate-6 transition-transform duration-700" />
                        </a>
                    </div>
                </div>
                
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <span className="inline-block bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">Offre Flash</span>
                    <h3 className="text-4xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-lg text-gray-300 mb-8 font-light max-w-lg mx-auto lg:mx-0">{product.description}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
                        <div className="text-left">
                            <span className="block text-sm text-gray-400 line-through">{product.oldPrice?.toFixed(0)} DT</span>
                            <span className="block text-5xl font-bold text-white">{product.price.toFixed(0)} DT</span>
                        </div>
                        <div className="h-12 w-px bg-gray-700 hidden sm:block"></div>
                        <CountdownTimer />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                         <button onClick={handleAddToCart} className="bg-white text-black font-bold uppercase tracking-widest text-xs py-4 px-10 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span>Ajouter au sac</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};


export const PromotionsPage: React.FC<PromotionsPageProps> = ({ onNavigateHome, onPreview, products: allProducts, onNavigateToProductDetail }) => {
    // ... logic remains same ...
    const promotionProducts = useMemo(() => allProducts.filter(p => p.promo || p.discount), [allProducts]);
    const [sortOrder, setSortOrder] = useState('discount-desc');
    const [viewMode, setViewMode] = useState('grid');
    
    useEffect(() => {
        document.title = `Offres Spéciales - Cosmetics Shop`;
    }, []);

    const displayedProducts = useMemo(() => {
        const sorted = [...promotionProducts];
        
        sorted.sort((a, b) => {
            switch (sortOrder) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'discount-desc': return (b.discount || 0) - (a.discount || 0);
                default: return 0;
            }
        });
        
        return sorted;
    }, [promotionProducts, sortOrder]);

    const gridClasses = useMemo(() => {
        switch (viewMode) {
            case 'grid': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            case 'list': return 'grid-cols-1';
            default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
        }
    }, [viewMode]);

    const dealOfTheDayProduct = useMemo(() => {
        return [...promotionProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0))[0] || allProducts[0];
    }, [promotionProducts, allProducts]);

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Breadcrumb items={[{ name: 'Accueil', onClick: onNavigateHome }, { name: 'Offres' }]} />
                
                <DealOfTheDay product={dealOfTheDayProduct} onPreview={onPreview} onNavigateToProductDetail={onNavigateToProductDetail} />

                <main>
                    <div className="flex justify-between items-end mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Toutes les offres</h2>
                            <p className="text-sm text-gray-500">{displayedProducts.length} produits trouvés</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-400'}`}><Squares2X2Icon className="w-5 h-5"/></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-400'}`}><Bars3Icon className="w-5 h-5"/></button>
                            </div>

                            <div className="relative group">
                                <select 
                                    value={sortOrder} 
                                    onChange={(e) => setSortOrder(e.target.value)} 
                                    className="appearance-none bg-transparent pr-8 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none"
                                >
                                    <option value="discount-desc">Meilleures remises</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-gray-600" />
                            </div>
                        </div>
                    </div>
                    
                    {displayedProducts.length > 0 ? (
                        viewMode === 'list' ? (
                            <div className="space-y-6">
                                {displayedProducts.map(product => (
                                    <ProductListItem key={product.id} product={product} onPreview={onPreview} onNavigateToProductDetail={onNavigateToProductDetail} />
                                ))}
                            </div>
                        ) : (
                            <div className={`grid ${gridClasses} gap-8`}>
                                {displayedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} onPreview={onPreview} onNavigateToProductDetail={onNavigateToProductDetail} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <p className="text-lg text-gray-600 dark:text-gray-400">Aucune offre disponible.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
