
import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronRightIcon } from './IconComponents';

interface ProductGridSectionProps {
    allProducts: Product[];
    onPreview: (product: Product) => void;
    onNavigateToProductDetail: (productId: number) => void;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({ allProducts, onPreview, onNavigateToProductDetail }) => {
    const [activeTab, setActiveTab] = useState('En promotion');

    const filteredProducts = useMemo(() => {
        if (activeTab === 'En promotion') {
            return allProducts.filter(p => p.promo).slice(0, 8);
        }
        if (activeTab === 'Les plus vendus') {
            // Faking "best selling" by sorting by discount
            return [...allProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0)).slice(0, 8);
        }
        // Faking "newest" by reversing the array
        return [...allProducts].reverse().slice(0, 8);
    }, [activeTab, allProducts]);

    const TABS = ['Nouveautés', 'En promotion', 'Les plus vendus'];

    return (
        <section className="my-12">
            <div className="flex justify-center items-center mb-8 border-b dark:border-gray-700">
                {TABS.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`px-6 py-3 font-semibold text-lg relative transition-colors ${activeTab === tab ? 'text-red-600' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'}`}
                    >
                        {tab}
                        {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></span>}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onPreview={onPreview} onNavigateToProductDetail={onNavigateToProductDetail} />
                ))}
            </div>

            <div className="mt-16 text-center">
                <a href="#" className="relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-serif font-medium tracking-tighter text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full group shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-rose-600 rounded-full group-hover:w-96 group-hover:h-96 opacity-90"></span>
                    <span className="relative flex items-center gap-3 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                        Voir tous les produits
                        <ChevronRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </a>
            </div>
        </section>
    );
};
