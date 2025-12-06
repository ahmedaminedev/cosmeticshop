
import React, { useState, useEffect, useMemo } from 'react';
import type { Pack, Product, Category } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ShoppingBagIcon, Squares2X2Icon, Bars3Icon, ChevronDownIcon } from './IconComponents';
import { FiltersSidebar } from './FiltersSidebar';
import { useCart } from './CartContext';

interface PacksPageProps {
    onNavigateHome: () => void;
    onNavigateToCategory: (categoryName: string) => void;
    packs: Pack[];
    allProducts: Product[];
    allPacks: Pack[];
    onNavigateToPacks: () => void;
    onNavigateToPackDetail: (packId: number) => void;
    categories: Category[];
}

const isPackAvailable = (pack: Pack, allProducts: Product[], allPacks: Pack[]): boolean => {
    for (const productId of pack.includedProductIds) {
        const product = allProducts.find(p => p.id === productId);
        if (!product || product.quantity === 0) {
            return false;
        }
    }
    if (pack.includedPackIds) {
        for (const subPackId of pack.includedPackIds) {
            const subPack = allPacks.find(p => p.id === subPackId);
            if (!subPack || !isPackAvailable(subPack, allProducts, allPacks)) {
                return false;
            }
        }
    }
    return true;
};

const PackCard: React.FC<{ pack: Pack; allProducts: Product[]; allPacks: Pack[]; onNavigateToPackDetail: (packId: number) => void; }> = ({ pack, allProducts, allPacks, onNavigateToPackDetail }) => {
    const { addToCart, openCart } = useCart();
    const savings = pack.oldPrice - pack.price;
    const isAvailable = useMemo(() => isPackAvailable(pack, allProducts, allPacks), [pack, allProducts, allPacks]);

    const handleAddToCart = () => {
        if (!isAvailable) return;
        addToCart(pack);
        openCart();
    };
    
    const includedProducts = pack.includedProductIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    const includedPacks = (pack.includedPackIds || []).map(id => allPacks.find(p => p.id === id)).filter(Boolean);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:-translate-y-1">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToPackDetail(pack.id); }} className="relative block h-64 overflow-hidden">
                <img 
                    src={pack.imageUrl} 
                    alt={pack.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-serif font-bold text-white leading-tight">{pack.name}</h3>
                </div>
                 {!isAvailable && (
                    <span className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Rupture
                    </span>
                )}
            </a>

            <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow font-light leading-relaxed">{pack.description}</p>

                <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Ce coffret contient</h4>
                    <ul className="space-y-2">
                        {includedPacks.map((item, index) => (
                             <li key={`subpack-${index}`} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-3 shrink-0"></span>
                                <span className="font-semibold text-rose-500 mr-1">[Set]</span> {item.name}
                            </li>
                        ))}
                        {includedProducts.map((item, index) => (
                            <li key={`product-${index}`} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <span className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${item.quantity > 0 ? 'bg-gray-400' : 'bg-red-400'}`}></span>
                                {item.name} {item.quantity === 0 && <span className="text-[10px] text-red-500 ml-2 font-bold uppercase">Épuisé</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                         <div className="flex flex-col">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{pack.price.toFixed(0)} DT</span>
                            <span className="text-sm text-gray-400 line-through">{pack.oldPrice.toFixed(0)} DT</span>
                        </div>
                         <div className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                            -{(savings / pack.oldPrice * 100).toFixed(0)}%
                        </div>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs py-3.5 rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <ShoppingBagIcon className="w-4 h-4" />
                        <span>{isAvailable ? 'Ajouter au sac' : 'Indisponible'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const PackListItem: React.FC<{ pack: Pack; allProducts: Product[]; allPacks: Pack[]; onNavigateToPackDetail: (packId: number) => void; }> = ({ pack, allProducts, allPacks, onNavigateToPackDetail }) => {
    const { addToCart, openCart } = useCart();
    const isAvailable = useMemo(() => isPackAvailable(pack, allProducts, allPacks), [pack, allProducts, allPacks]);

    const handleAddToCart = () => {
        if (!isAvailable) return;
        addToCart(pack);
        openCart();
    };

    const includedProducts = pack.includedProductIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    const includedPacks = (pack.includedPackIds || []).map(id => allPacks.find(p => p.id === id)).filter(Boolean);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center p-4 gap-6 hover:shadow-md transition-shadow">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToPackDetail(pack.id); }} className="relative flex-shrink-0 w-full md:w-48 aspect-square block rounded-lg overflow-hidden">
                <img
                    src={pack.imageUrl}
                    alt={pack.name}
                    className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                />
            </a>

            <div className="flex-grow text-center md:text-left">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToPackDetail(pack.id); }} className="block">
                    <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-rose-600 transition-colors">{pack.name}</h3>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{pack.description}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {includedPacks.map((item, index) => (
                         <span key={`subpack-${index}`} className="text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100">
                            {item.name}
                        </span>
                    ))}
                    {includedProducts.map((item, index) => (
                        <span key={`product-${index}`} className={`text-xs px-2 py-1 rounded border ${item.quantity > 0 ? 'bg-gray-50 border-gray-100 text-gray-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                            {item.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{pack.price.toFixed(0)} DT</p>
                    <p className="text-sm text-gray-400 line-through">{pack.oldPrice.toFixed(0)} DT</p>
                </div>
                <button 
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs py-3 rounded-lg hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors shadow-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <ShoppingBagIcon className="w-4 h-4" />
                    <span>{isAvailable ? 'Ajouter' : 'Indisponible'}</span>
                </button>
            </div>
        </div>
    );
};

export const PacksPage: React.FC<PacksPageProps> = ({ onNavigateHome, onNavigateToCategory, packs, allProducts, allPacks, onNavigateToPacks, onNavigateToPackDetail, categories }) => {
    // ... logic remains same ...
    const [sortOrder, setSortOrder] = useState('price-asc');
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        price: { min: 0, max: 5000 },
        brands: [] as string[],
        materials: [] as string[],
    });

    const productsInPacks = useMemo(() => {
        const productIds = new Set(packs.flatMap(p => p.includedProductIds));
        return allProducts.filter(p => productIds.has(p.id));
    }, [packs, allProducts]);

    const maxPrice = useMemo(() =>
        Math.ceil(packs.reduce((max, p) => p.price > max ? p.price : max, 0)) || 5000,
        [packs]
    );

    useEffect(() => {
        document.title = `Nos Coffrets - Cosmetics Shop`;
        const newMaxPrice = Math.ceil(packs.reduce((max, p) => p.price > max ? p.price : max, 0)) || 5000;
        setFilters({
            price: { min: 0, max: newMaxPrice },
            brands: [],
            materials: [],
        });
    }, [packs]);
    
    const displayedPacks = useMemo(() => {
        let filtered = [...packs]
            .filter(p => p.price >= filters.price.min && p.price <= filters.price.max);
        
        // ... filtering logic ...
        if (filters.brands.length > 0) {
            filtered = filtered.filter(pack => 
                pack.includedProductIds.some(productId => {
                    const product = allProducts.find(p => p.id === productId);
                    return product && filters.brands.includes(product.brand);
                })
            );
        }

        if (filters.materials.length > 0) {
             filtered = filtered.filter(pack => 
                pack.includedProductIds.some(productId => {
                    const product = allProducts.find(p => p.id === productId);
                    return product && product.material && filters.materials.includes(product.material);
                })
            );
        }

        filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.name.localeCompare(b.name);
                default: return 0;
            }
        });
        
        return filtered;
    }, [packs, filters, sortOrder, allProducts]);
    
    const gridClasses = viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1';

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 min-w-0">
                    <Breadcrumb items={[{ name: 'Accueil', onClick: onNavigateHome }, { name: 'Coffrets & Packs' }]} />
                    
                    <div className="my-8 text-center lg:text-left">
                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">Coffrets Cadeaux</h1>
                        <p className="text-gray-500 mt-2 font-light">Offrez le meilleur de la beauté avec nos sélections exclusives.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <FiltersSidebar 
                            products={productsInPacks}
                            filters={filters}
                            onFilterChange={setFilters}
                            maxPrice={maxPrice}
                        />

                        <main className="flex-1">
                            {/* Toolbar (View Mode, Sort) - Same as ProductListPage logic, reusing styling */}
                            <div className="flex justify-between items-center mb-6 p-2">
                                <div className="flex items-center gap-2">
                                     <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`} aria-label="Grid view"><Squares2X2Icon className="w-5 h-5"/></button>
                                     <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`} aria-label="List view"><Bars3Icon className="w-5 h-5"/></button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <select 
                                            value={sortOrder} 
                                            onChange={(e) => setSortOrder(e.target.value)} 
                                            className="appearance-none bg-transparent pr-8 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none"
                                        >
                                            <option value="price-asc">Prix croissant</option>
                                            <option value="price-desc">Prix décroissant</option>
                                            <option value="name-asc">Nom (A-Z)</option>
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-gray-600" />
                                    </div>
                                </div>
                            </div>
                            
                            {displayedPacks.length > 0 ? (
                                viewMode === 'list' ? (
                                    <div className="space-y-6">
                                        {displayedPacks.map(pack => (
                                            <PackListItem key={pack.id} pack={pack} allProducts={allProducts} allPacks={allPacks} onNavigateToPackDetail={onNavigateToPackDetail} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`grid ${gridClasses} gap-8`}>
                                        {displayedPacks.map(pack => (
                                            <PackCard key={pack.id} pack={pack} allProducts={allProducts} allPacks={allPacks} onNavigateToPackDetail={onNavigateToPackDetail} />
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Aucun coffret trouvé.</p>
                                    <button onClick={() => setFilters({price: {min: 0, max: maxPrice}, brands: [], materials: []})} className="mt-4 text-rose-600 font-bold underline hover:no-underline">Réinitialiser les filtres</button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};
