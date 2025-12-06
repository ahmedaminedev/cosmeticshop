
import React, { useMemo } from 'react';
import type { Product, Pack, Advertisements, Category, Brand } from '../types';
import { HeroSection } from './HeroSection';
import { TrustBadges } from './TrustBadges';
import { ProductCarousel } from './ProductCarousel';
import { AudioPromoBanner } from './AudioPromoBanner';
import { PromoBanners } from './PromoBanners';
import { EditorialMasonry } from './EditorialMasonry';
import { ProductGridSection } from './ProductGridSection';
import { BrandCarousel } from './BrandCarousel';
import { EditorialProductList } from './EditorialProductList';
import { ShoppableVideoCarousel } from './ShoppableVideoCarousel';
import { VirtualTryOnSection } from './VirtualTryOnSection';

interface HomePageProps {
    onNavigate: (categoryName: string) => void;
    onPreview: (product: Product) => void;
    onNavigateToPacks: () => void;
    products: Product[];
    packs: Pack[];
    advertisements: Advertisements;
    onNavigateToProductDetail: (productId: number | string) => void;
    categories: Category[];
    brands: Brand[];
}

export const HomePage: React.FC<HomePageProps> = ({ 
    onNavigate, 
    onPreview, 
    onNavigateToPacks, 
    products, 
    packs, 
    advertisements, 
    onNavigateToProductDetail, 
    categories, 
    brands 
}) => {
    
    // Calcul dynamique des sélections (Nouveautés = derniers produits)
    const newArrivalProducts = useMemo(() => {
        return products.length > 0 ? products.slice(0, 8) : [];
    }, [products]);

    // Filter products for the "Accessoires" Editorial List
    const accessoryProducts = useMemo(() => {
        return products.filter(p => p.category === 'Accessoires');
    }, [products]);

    // Calcul dynamique des sélections (Été = produits avec mots clés spécifiques)
    const summerSelectionProducts = useMemo(() => {
        const summerItems = products.filter(p => 
            p.category.toLowerCase().includes('climat') || 
            p.name.toLowerCase().includes('climat') || 
            p.category.toLowerCase().includes('froid') ||
            p.category.toLowerCase().includes('ventilateur')
        );
        return summerItems.length > 0 ? summerItems.slice(0, 8) : products.slice(8, 16);
    }, [products]);
    
    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8">
            <main className="flex-1 min-w-0 relative z-10">
                <HeroSection slides={advertisements.heroSlides} />
                <TrustBadges />
                
                {newArrivalProducts.length > 0 && (
                    <ProductCarousel 
                        title="Nouvelles Arrivées" 
                        products={newArrivalProducts} 
                        onPreview={onPreview} 
                        onNavigateToProductDetail={onNavigateToProductDetail} 
                    />
                )}
                
                <AudioPromoBanner ads={advertisements.audioPromo} />
                
                {/* Section Accessoires Style Editorial */}
                {accessoryProducts.length > 0 && (
                    <EditorialProductList 
                        title="Accessoires"
                        products={accessoryProducts}
                        onPreview={onPreview}
                        onNavigateToProductDetail={onNavigateToProductDetail}
                    />
                )}
                
                <PromoBanners 
                    banners={advertisements.promoBanners}
                    allProducts={products}
                    allPacks={packs}
                    onPreview={onPreview}
                />
                
                {/* Nouveau bloc Shoppable Videos (Gifts List) */}
                <ShoppableVideoCarousel videos={advertisements.shoppableVideos || []} />
                
                {/* Remplacement des SmallPromoBanners par le nouveau bloc Masonry */}
                <EditorialMasonry items={advertisements.editorialCollage || []} />
                
                {summerSelectionProducts.length > 0 && (
                    <ProductCarousel 
                        title="Sélection d'été" 
                        products={summerSelectionProducts} 
                        onPreview={onPreview} 
                        onNavigateToProductDetail={onNavigateToProductDetail} 
                    />
                )}
                
                <ProductGridSection allProducts={products} onPreview={onPreview} onNavigateToProductDetail={onNavigateToProductDetail} />
                
                {/* Virtual Try-On Block */}
                <VirtualTryOnSection />
                
                <BrandCarousel brands={brands} />
            </main>
        </div>
    );
};
