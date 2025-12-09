
import type { Advertisements } from './types';

// Initial empty state for the application before DB load
export const initialAdvertisements: Advertisements = {
    heroSlides: [],
    trustBadges: [],
    audioPromo: [],
    // Initialize with two empty banner objects to satisfy tuple type [MediumPromoAd, MediumPromoAd]
    promoBanners: [
        { id: 0, title: "", subtitle: "", buttonText: "", image: "", linkType: "category", linkTarget: "" },
        { id: 0, title: "", subtitle: "", buttonText: "", image: "", linkType: "category", linkTarget: "" }
    ],
    smallPromoBanners: [], 
    editorialCollage: [],
    shoppableVideos: [],
    newArrivals: {
        title: "",
        productIds: [],
        limit: 8
    },
    summerSelection: {
        title: "",
        productIds: [],
        limit: 8
    },
    virtualTryOn: {
        title: "",
        description: "",
        buttonText: "",
        link: "#",
        backgroundType: 'color',
        backgroundColor: '#FFFFFF',
        backgroundGallery: [], // Persisted user gallery
        textColor: '#000000',
        imageLeft: { url: "", scale: 100, top: 0, rotation: 0 },
        imageRight: { url: "", scale: 100, top: 0, rotation: 0 }
    },
    featuredGrid: {
        title: "Nos Trésors",
        productIds: [],
        buttonText: "",
        buttonLink: "#"
    }
};
