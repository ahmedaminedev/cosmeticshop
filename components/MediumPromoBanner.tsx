
import React, { useMemo } from 'react';
import type { MediumPromoAd, Product, Pack } from '../types';
import { ArrowUpRightIcon } from './IconComponents';

interface MediumPromoBannerProps {
    banner: MediumPromoAd;
    isPreview?: boolean;
    allProducts: Product[];
    allPacks: Pack[];
    onPreview: (product: Product) => void;
}

const getProductsFromPack = (packId: number, allProducts: Product[], allPacks: Pack[]): Product[] => {
    const pack = allPacks.find(p => p.id === packId);
    if (!pack) return [];
    
    let productIds = new Set<number>();

    const collectProductIds = (p: Pack) => {
        p.includedProductIds.forEach(id => productIds.add(id));
        if (p.includedPackIds) {
            p.includedPackIds.forEach(subPackId => {
                const subPack = allPacks.find(sp => sp.id === subPackId);
                if (subPack) {
                    collectProductIds(subPack);
                }
            });
        }
    }
    
    collectProductIds(pack);
    
    return allProducts.filter(p => productIds.has(p.id));
};

export const MediumPromoBanner: React.FC<MediumPromoBannerProps> = ({ banner, isPreview = false, allProducts, allPacks, onPreview }) => {

    const productsToShow = useMemo(() => {
        if (banner.linkType === 'category') {
            return allProducts.filter(p => p.category === banner.linkTarget);
        }
        if (banner.linkType === 'pack') {
            const packId = parseInt(banner.linkTarget, 10);
            if (isNaN(packId)) return [];
            return getProductsFromPack(packId, allProducts, allPacks);
        }
        return [];
    }, [banner, allProducts, allPacks]);
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const productId = parseInt(e.target.value, 10);
        if (productId) {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                onPreview(product);
            }
            // Reset select to default option after selection
            e.target.value = "";
        }
    };
    
    // Common content layout for both preview and live modes
    const Content = () => (
        <>
            <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-2xl">
                 <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-tight mb-6">
                    {banner.title}
                 </h3>
                 
                 <div className="w-12 h-0.5 bg-black dark:bg-white mb-6"></div>

                 <p className="font-sans text-lg text-gray-700 dark:text-gray-300 mb-10 font-light leading-relaxed max-w-sm">
                    {banner.subtitle}
                 </p>
                 
                 <div className="relative inline-block w-fit group/btn">
                    <select 
                        onChange={handleSelectChange}
                        className="appearance-none bg-black dark:bg-white text-white dark:text-black pl-10 pr-10 py-4 uppercase tracking-[0.2em] text-xs font-bold cursor-pointer focus:outline-none focus:ring-0 transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 min-w-[200px] text-center"
                        defaultValue=""
                        aria-label={`Sélectionner un produit pour ${banner.title}`}
                    >
                        <option value="" disabled>{banner.buttonText}</option>
                        {productsToShow.length > 0 ? (
                            productsToShow.map(product => (
                                <option key={product.id} value={product.id} disabled={product.quantity === 0} className="text-gray-900 bg-white py-2">
                                    {product.name} {product.quantity === 0 ? '(Épuisé)' : ''}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Aucun produit disponible</option>
                        )}
                    </select>
                    {/* Invisible overlay to allow clicking the select but show custom styles if needed, though appearance-none handles most */}
                </div>
             </div>
        </>
    );

    if (isPreview) {
         return (
            <div className="relative h-[500px] overflow-hidden group bg-gray-100">
                <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                />
                {/* Gradient mimicking a solid color card on the left blending into image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F0F0F0] via-[#F0F0F0]/90 to-transparent dark:from-gray-900 dark:via-gray-900/90 w-3/4 md:w-2/3"></div>
                <Content />
            </div>
        );
    }

    return (
        <div className="relative h-[500px] overflow-hidden group rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-500 bg-gray-100">
             <img 
                src={banner.image} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
            />
             {/* Gradient Overlay: Solid on left, fading to transparent on right to reveal image */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F5] via-[#F5F5F5]/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 w-full md:w-3/4 lg:w-2/3"></div>

             <Content />
        </div>
    );
};
