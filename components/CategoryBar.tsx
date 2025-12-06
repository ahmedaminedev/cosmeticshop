
import React, { useState } from 'react';
import type { Category } from '../types';
import { ChevronDownIcon } from './IconComponents';

interface CategoryBarProps {
    categories: Category[];
    onCategoryClick: (categoryName: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ categories, onCategoryClick }) => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 relative z-30 hidden md:block">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex justify-center items-center gap-8 lg:gap-12">
                    {categories.map((category) => (
                        <li 
                            key={category.name} 
                            className="py-4"
                            onMouseEnter={() => setHoveredCategory(category.name)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); onCategoryClick(category.name); }}
                                className={`
                                    text-xs lg:text-sm font-sans font-bold uppercase tracking-widest transition-colors duration-300 flex items-center gap-1
                                    ${hoveredCategory === category.name ? 'text-rose-600' : 'text-gray-600 dark:text-gray-300 hover:text-rose-500'}
                                `}
                            >
                                {category.name}
                                {(category.megaMenu || category.subCategories) && (
                                    <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${hoveredCategory === category.name ? 'rotate-180' : ''}`} />
                                )}
                            </a>

                            {/* Mega Menu Dropdown */}
                            {(hoveredCategory === category.name && (category.megaMenu || category.subCategories)) && (
                                <div className="absolute left-0 top-full w-full bg-white dark:bg-gray-900 shadow-xl border-t border-rose-100 dark:border-gray-700 animate-fadeIn">
                                    <div className="max-w-screen-2xl mx-auto px-8 py-8">
                                        {category.megaMenu ? (
                                            <div className="grid grid-cols-4 gap-8">
                                                {category.megaMenu.map((group, idx) => (
                                                    <div key={idx}>
                                                        <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4 text-base border-b border-gray-100 dark:border-gray-700 pb-2">
                                                            {group.title}
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {group.items.map((item, i) => (
                                                                <li key={i}>
                                                                    <a 
                                                                        href="#" 
                                                                        onClick={(e) => { e.preventDefault(); onCategoryClick(item.name); }}
                                                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors block py-0.5"
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                {/* Image promo dans le menu (Optionnel) */}
                                                <div className="col-span-1 bg-rose-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <p className="font-serif text-rose-600 font-bold text-lg mb-2">Nouveautés</p>
                                                        <p className="text-xs text-gray-500 mb-4">Découvrez la collection</p>
                                                        <button className="text-xs font-bold uppercase underline">Voir tout</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Simple Subcategories List */
                                            <ul className="grid grid-cols-4 gap-4">
                                                {category.subCategories?.map((sub, i) => (
                                                    <li key={i}>
                                                        <a 
                                                            href="#" 
                                                            onClick={(e) => { e.preventDefault(); onCategoryClick(sub); }}
                                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-600 transition-colors"
                                                        >
                                                            {sub}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};
