
import React from 'react';
import type { Brand } from '../types';
import { SparklesIcon } from './IconComponents';

interface BrandCarouselProps {
    brands: Brand[];
}

export const BrandCarousel: React.FC<BrandCarouselProps> = ({ brands }) => {
    // Dupliquer les marques pour créer l'effet de boucle infini sans coupure
    // On s'assure d'avoir assez d'éléments pour remplir l'écran
    const marqueeBrands = [...brands, ...brands, ...brands, ...brands];

    return (
        <section className="relative py-20 bg-gradient-to-b from-white via-rose-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
            
            {/* Header Éditorial */}
            <div className="text-center mb-12 relative z-10 px-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-rose-100 dark:border-gray-700 shadow-sm mb-4 animate-fadeIn">
                    <SparklesIcon className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        Confiance & Authenticité
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-3 tracking-tight">
                    Nos Maisons <span className="italic text-rose-500">Partenaires</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-light max-w-lg mx-auto text-sm md:text-base">
                    Nous collaborons avec les marques les plus prestigieuses pour vous offrir l'excellence.
                </p>
            </div>

            {/* Masques de fondu sur les côtés pour l'effet infini */}
            <div className="absolute top-0 left-0 h-full w-24 md:w-64 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-24 md:w-64 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden group">
                <div 
                    className="flex gap-8 md:gap-12 w-max animate-marquee hover:[animation-play-state:paused]"
                >
                    {marqueeBrands.map((brand, index) => (
                        <a 
                            href="#" 
                            key={`${brand.id}-${index}`} 
                            className="relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 hover:border-rose-200 dark:hover:border-rose-900 transition-all duration-300 transform hover:scale-105 group/brand"
                        >
                            {/* Logo - Affichage CLAIR (Sans filtre gris/opacité) */}
                            <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center p-3">
                                <img 
                                    src={brand.logoUrl} 
                                    alt={`${brand.name} logo`}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover/brand:scale-110" 
                                />
                            </div>
                            
                            {/* Tooltip au survol */}
                            <span className="absolute -bottom-8 opacity-0 group-hover/brand:opacity-100 transition-opacity duration-300 text-xs font-bold uppercase tracking-wider text-rose-500 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
                                {brand.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Style pour l'animation custom */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                /* Mobile plus rapide */
                @media (max-width: 768px) {
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                    }
                }
            `}</style>
        </section>
    );
};
