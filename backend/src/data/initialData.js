
// ... (imports et autres données restent inchangés)

const { allProducts, categories, packs, stores, promotions, sampleOrders, blogPosts, contactMessages } = require('./initialData_part1'); // Pseudo-import pour conserver le contexte si nécessaire, dans la réalité on garde tout le fichier

const initialAdvertisements = {
    heroSlides: [
        {
            id: 1,
            bgImage: "https://images.unsplash.com/photo-1487412947132-232a8408a345?q=80&w=1200&auto=format&fit=crop",
            title: "Révélez votre éclat naturel",
            subtitle: "Découvrez notre nouvelle collection de soins bio et naturels.",
            buttonText: "Découvrir"
        },
        {
            id: 2,
            bgImage: "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&q=80&w=1200",
            videoUrl: "https://videos.pexels.com/video-files/4108683/4108683-hd_1920_1080_25fps.mp4",
            title: "L'Essence de la Beauté",
            subtitle: "Découvrez notre nouvelle campagne Rouge Intense.",
            buttonText: "Voir la collection"
        },
        {
            id: 3,
            bgImage: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
            title: "L'art du Maquillage",
            subtitle: "Les essentiels des plus grandes marques pour sublimer votre beauté.",
            buttonText: "Acheter maintenant"
        },
        {
            id: 4,
            bgImage: "https://images.unsplash.com/photo-1595867359265-22365a2df23f?q=80&w=1200&auto=format&fit=crop",
            title: "Parfums d'Exception",
            subtitle: "Laissez votre sillage raconter votre histoire.",
            buttonText: "Explorer"
        }
    ],
    audioPromo: [
        {
            id: 1,
            title: "-30% sur les Parfums",
            subtitle1: "POUR ELLE & LUI",
            subtitle2: "Offre limitée ce week-end",
            image: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?auto=format&fit=crop&q=80&w=600",
            background: "from-rose-400 to-pink-600",
            duration: 8,
        }
    ],
    promoBanners: [
        {
            id: 1,
            title: "Soins Visage",
            subtitle: "Une peau parfaite au quotidien",
            buttonText: "Voir la sélection",
            image: "https://images.unsplash.com/photo-1556228720-1957be83f3bf?auto=format&fit=crop&q=80&w=600",
            linkType: 'category',
            linkTarget: 'Soins Visage',
        },
        {
            id: 2,
            title: "Coffrets Cadeaux",
            subtitle: "Faites plaisir à coup sûr",
            buttonText: "Choisir un coffret",
            image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600",
            linkType: 'category',
            linkTarget: 'Coffrets Cadeaux',
        }
    ],
    smallPromoBanners: [], // Deprecated
    editorialCollage: [
        {
            id: 1,
            imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
            title: "Look Naturel",
            subtitle: "L'essentiel du teint parfait",
            link: "#",
            size: "large"
        },
        {
            id: 2,
            imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&auto=format&fit=crop",
            title: "Yeux",
            subtitle: "Palettes & Ombres",
            link: "#",
            size: "small"
        },
        {
            id: 3,
            imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
            title: "Sérums",
            subtitle: "Routine soin",
            link: "#",
            size: "small"
        },
        {
            id: 4,
            imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=600&auto=format&fit=crop",
            title: "Lèvres Audacieuses",
            subtitle: "Rouges mats et brillants",
            link: "#",
            size: "tall"
        },
        {
            id: 5,
            imageUrl: "https://images.unsplash.com/photo-1595867359265-22365a2df23f?q=80&w=400&auto=format&fit=crop",
            title: "Parfums",
            link: "#",
            size: "small"
        }
    ],
    shoppableVideos: [
        {
            id: 1,
            thumbnailUrl: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
            videoUrl: "https://videos.pexels.com/video-files/4108683/4108683-hd_1920_1080_25fps.mp4",
            username: "@sarah.beauty",
            description: "Ma routine glowy du matin ✨",
            productIds: [6, 7]
        },
        {
            id: 2,
            thumbnailUrl: "https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?q=80&w=600&auto=format&fit=crop",
            videoUrl: "https://videos.pexels.com/video-files/3756003/3756003-hd_1920_1080_25fps.mp4",
            username: "@makeup.addict",
            description: "Le rouge parfait pour l'été 💋",
            productIds: [3]
        },
        {
            id: 3,
            thumbnailUrl: "https://images.unsplash.com/photo-1571781565036-d3f75df02f67?q=80&w=600&auto=format&fit=crop",
            videoUrl: "https://videos.pexels.com/video-files/8306353/8306353-hd_1080_1920_25fps.mp4",
            username: "@skincare.pro",
            description: "Astuce hydratation intense 💧",
            productIds: [9, 12]
        },
        {
            id: 4,
            thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=600&auto=format&fit=crop",
            videoUrl: "https://videos.pexels.com/video-files/6837775/6837775-hd_1080_1920_25fps.mp4",
            username: "@glam.girl",
            description: "Unboxing de ma commande 🎁",
            productIds: [1, 2]
        }
    ]
};

// Note: Ensure other exports match your existing file structure
module.exports = {
    allProducts,
    categories,
    packs,
    stores,
    initialAdvertisements,
    promotions,
    sampleOrders,
    blogPosts,
    contactMessages
};
