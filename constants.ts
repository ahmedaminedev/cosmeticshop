
import type { Advertisements, BlogPost, Product, Category, Pack, Store, Promotion, Order, ContactMessage, User } from './types';

export const mockAdmin: User | null = {
    id: 1,
    firstName: 'Sophie',
    lastName: 'Admin',
    email: 'admin@cosmeticsshop.com',
    phone: '00000000',
    role: 'ADMIN',
    addresses: []
};

// ... (Product data remains the same - abbreviated for brevity if allowed, but here I keep it as per instruction to return full file usually, but for constants it is huge. I will keep existing content and just append new)
// NOTE: I am injecting the new data into the initialAdvertisements object within the full file content.

export const allProducts: Product[] = [
    { id: 1, name: 'Coffret Rituel Jeunesse Absolue', brand: 'LANCÔME', price: 289, oldPrice: 350, imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400'], discount: 18, category: 'Coffrets Cadeaux', promo: true, description: 'Un rituel complet pour une peau éclatante de jeunesse. Contient le sérum star, une crème de jour et un contour des yeux.', quantity: 20 },
    { id: 2, name: 'Parfum "La Vie est Belle" 50ml', brand: 'LANCÔME', price: 210, oldPrice: 240, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400'], discount: 12, category: 'Parfums', promo: true, description: 'Une fragrance iconique mêlant l\'iris, le jasmin et la fleur d\'oranger. Un hymne à la beauté de la vie.', quantity: 15 },
    { id: 3, name: 'Rouge à Lèvres Mat "Ruby Woo"', brand: 'MAC', price: 75, oldPrice: 85, imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062dc?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062dc?auto=format&fit=crop&q=80&w=400'], discount: 10, category: 'Maquillage Lèvres', description: 'Le rouge mat parfait. Tenue longue durée et couleur intense pour un sourire inoubliable.', quantity: 30 },
    { id: 4, name: 'Palette Yeux "Nude Obsession"', brand: 'HUDA BEAUTY', price: 110, imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400'], category: 'Maquillage Yeux', description: '9 teintes universelles pour créer des looks du plus naturel au plus sophistiqué.', quantity: 25 },
    { id: 5, name: 'Fond de Teint "Double Wear"', brand: 'ESTÉE LAUDER', price: 145, oldPrice: 160, imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400'], discount: 9, category: 'Teint', description: 'Couvrance parfaite et tenue 24h. Résiste à la chaleur et à l\'humidité pour un teint zéro défaut.', quantity: 18 },
    { id: 6, name: 'Sérum "Advanced Night Repair"', brand: 'ESTÉE LAUDER', price: 320, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'], category: 'Soins Visage', description: 'Le sérum n°1 pour réparer, hydrater et protéger la peau. Réduit visiblement les signes de l\'âge.', quantity: 10, specifications: [{ name: 'Type de peau', value: 'Toutes peaux' },{ name: 'Contenance', value: '30ml' }] },
    { id: 7, name: 'Crème Hydratante "Moisture Surge"', brand: 'CLINIQUE', price: 95, oldPrice: 120, imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=400'], discount: 20, category: 'Soins Visage', description: 'Un gel-crème désaltérant qui offre 100h d\'hydratation. Peau repulpée et éclatante.', quantity: 40 },
    { id: 8, name: 'Mascara "Better Than Sex"', brand: 'TOO FACED', price: 89, imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400'], category: 'Maquillage Yeux', description: 'Volume intense, courbes voluptueuses. Le mascara culte pour un regard de biche.', quantity: 50 },
    { id: 9, name: 'Huile Prodigieuse 100ml', brand: 'NUXE', price: 85, imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400'], category: 'Soins Corps', description: 'L\'huile sèche mythique n°1 aux huiles végétales précieuses. Nourrit et sublime visage, corps et cheveux.', quantity: 35 },
    { id: 10, name: 'Eau de Parfum "Black Opium"', brand: 'YVES SAINT LAURENT', price: 290, oldPrice: 330, imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea477942698?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1594035910387-fea477942698?auto=format&fit=crop&q=80&w=400'], discount: 12, category: 'Parfums', description: 'Le café noir rencontre la sensualité des fleurs blanches. Une dose d\'adrénaline glamour.', quantity: 12 },
    { id: 11, name: 'Poudre Libre "Prisme Libre"', brand: 'GIVENCHY', price: 160, imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400'], category: 'Teint', description: 'La poudre culte à 4 teintes pour matifier, flouter et illuminer le teint en un seul geste.', quantity: 22 },
    { id: 12, name: 'Shampoing Réparateur "Numéro 4"', brand: 'OLAPLEX', price: 99, imageUrl: 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=400', images: ['https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=400'], category: 'Cheveux', description: 'Répare les liens rompus du cheveu. Idéal pour les cheveux abîmés, colorés ou cassants.', quantity: 28 },
    { id: 13, name: 'Lingettes nettoyantes pour bébé', brand: 'Pampers', price: 36.47, oldPrice: 48.63, imageUrl: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=400&auto=format&fit=crop'], discount: 25, category: 'Accessoires', promo: true, description: 'Lot de 24x48 lingettes Aqua Harmony. Douceur et pureté pour la peau de bébé.', quantity: 50 },
    { id: 14, name: 'Fer à lisser professionnel SteamPod 4.0', brand: 'L\'Oréal', price: 709, imageUrl: 'https://images.unsplash.com/photo-1580920461931-fcb03ab940b2?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1580920461931-fcb03ab940b2?q=80&w=400&auto=format&fit=crop'], category: 'Accessoires', description: 'Le lisseur vapeur professionnel pour un lissage parfait et durable tout en protégeant la fibre capillaire.', quantity: 15 },
    { id: 15, name: 'Appareil de nettoyage ultrasonique', brand: 'Reclar', price: 195, oldPrice: 279, imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=400&auto=format&fit=crop'], discount: 30, category: 'Accessoires', promo: true, description: 'Galvanic Water Peeler 24K Gold Plus. Nettoyage profond, peeling et luminothérapie.', quantity: 8 },
    { id: 16, name: 'Pince à cuticules professionnelle', brand: 'Staleks Pro', price: 42.32, imageUrl: 'https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?q=80&w=400&auto=format&fit=crop'], category: 'Accessoires', description: 'Pince NE-11-11 en acier chirurgical. Précision et durabilité pour une manucure parfaite.', quantity: 20 },
    { id: 17, name: 'Lingettes nettoyantes Fresh Clean', brand: 'Pampers', price: 28.07, oldPrice: 37.43, imageUrl: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=400&auto=format&fit=crop'], discount: 25, category: 'Accessoires', promo: true, description: 'Lot de 15x80 lingettes. Une sensation de fraîcheur à chaque utilisation.', quantity: 45 },
    { id: 18, name: 'Miroir LED Tactile', brand: 'Babyliss', price: 155, oldPrice: 190, imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400&auto=format&fit=crop'], discount: 18, category: 'Accessoires', description: 'Miroir grossissant lumineux avec intensité réglable. Idéal pour le maquillage et les soins.', quantity: 12 },
    { id: 19, name: 'Set Pinceaux Maquillage Pro', brand: 'Real Techniques', price: 89, imageUrl: 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?q=80&w=400&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1631730486784-5456119f69ae?q=80&w=400&auto=format&fit=crop'], category: 'Accessoires', description: 'Kit complet de 10 pinceaux pour le teint et les yeux. Poils synthétiques ultra-doux.', quantity: 30 }
];

export const categories: Category[] = [
    { name: 'Coffrets Cadeaux' },
    { 
        name: 'Maquillage', 
        megaMenu: [
            { 
                title: 'Teint', 
                items: [
                    { name: 'Fond de Teint' },
                    { name: 'Anti-cernes' },
                    { name: 'Poudre' },
                    { name: 'Blush & Bronzer' },
                    { name: 'Highlighter' },
                ]
            },
            { 
                title: 'Yeux', 
                items: [
                    { name: 'Mascara' },
                    { name: 'Palettes Yeux' },
                    { name: 'Eyeliner' },
                    { name: 'Sourcils' },
                ]
            },
            { 
                title: 'Lèvres', 
                items: [
                    { name: 'Rouge à Lèvres' },
                    { name: 'Gloss' },
                    { name: 'Crayon Lèvres' },
                    { name: 'Baumes' },
                ]
            }
        ]
    },
    { 
        name: 'Soins Visage', 
        megaMenu: [
            {
                title: 'Type de Soin',
                items: [
                    { name: 'Démaquillants & Nettoyants' },
                    { name: 'Sérums' },
                    { name: 'Crèmes de Jour' },
                    { name: 'Crèmes de Nuit' },
                    { name: 'Masques & Gommages' },
                ]
            },
            {
                title: 'Préoccupation',
                items: [
                    { name: 'Anti-âge' },
                    { name: 'Hydratation' },
                    { name: 'Imperfections' },
                    { name: 'Éclat' },
                ]
            }
        ]
    },
    { name: 'Parfums', subCategories: ['Parfum Femme', 'Parfum Homme', 'Parfum Mixte', 'Coffrets Parfum'] },
    { name: 'Corps & Bain', subCategories: ['Hydratants Corps', 'Gommages', 'Gels Douche', 'Solaire', 'Mains & Pieds'] },
    { name: 'Cheveux', subCategories: ['Shampoing', 'Après-shampoing', 'Masques', 'Huiles & Sérums', 'Coiffants'] },
    { name: 'Accessoires', subCategories: ['Pinceaux', 'Éponges', 'Trousses', 'Miroirs', 'Appareils Beauté'] },
    { name: 'Onglerie', subCategories: ['Vernis', 'Semi-permanent', 'Soins des ongles'] },
    { name: 'Bio & Naturel' }
];

export const packs: Pack[] = [
    { 
        id: 1, 
        name: 'Pack Glow Up Visage', 
        description: 'La routine complète pour un teint lumineux. Comprend un sérum vitamine C, une crème éclat et un roller jade.',
        price: 250,
        oldPrice: 320,
        discount: 22,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-1957be83f3bf?auto=format&fit=crop&q=80&w=400',
        includedItems: ['Sérum Vitamine C', 'Crème Éclat', 'Roller Jade'],
        includedProductIds: [6, 7]
    },
    { 
        id: 2, 
        name: 'Pack Soirée Glamour', 
        description: 'Les essentiels pour un look de soirée réussi : Palette yeux, Mascara volume et Rouge à lèvres iconique.',
        price: 195,
        oldPrice: 230,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&q=80&w=400',
        includedItems: ['Palette Yeux', 'Mascara Volume', 'Rouge à Lèvres'],
        includedProductIds: [3, 4, 8]
    },
    { 
        id: 3, 
        name: 'Pack Réparation Cheveux', 
        description: 'Sauvez vos cheveux avec ce trio réparateur intense.',
        price: 220,
        oldPrice: 260,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400',
        includedItems: ['Shampoing Réparateur', 'Masque Intense', 'Huile Capillaire'],
        includedProductIds: [12, 9]
    }
];

export const initialStores: Store[] = [
    {
        id: 1,
        name: "Cosmetics Shop Tunis - Lac 2",
        address: "Rue de la Feuille d'Érable, Les Berges du Lac 2",
        city: "Tunis",
        postalCode: "1053",
        phone: "+216 71 111 222",
        email: "lac2@cosmeticsshop.tn",
        openingHours: "Lun - Dim: 10h00 - 20h00",
        imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=600",
        isPickupPoint: true,
        mapUrl: ""
    },
    {
        id: 2,
        name: "Cosmetics Shop Ennasr",
        address: "Avenue Hédi Nouira",
        city: "Ariana",
        postalCode: "2037",
        phone: "+216 70 333 444",
        email: "ennasr@cosmeticsshop.tn",
        openingHours: "Lun - Sam: 09h30 - 19h30",
        imageUrl: "https://images.unsplash.com/photo-1570857502809-08184874388e?auto=format&fit=crop&q=80&w=600",
        isPickupPoint: true,
        mapUrl: ""
    }
];

export const mockPromotions: Promotion[] = [
    {
        id: 1,
        name: "Beauty Days",
        discountPercentage: 20,
        startDate: "2024-05-01",
        endDate: "2024-05-30",
        productIds: [2, 3, 8, 10],
        packIds: [],
    }
];

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'routine-soin-matin',
        title: 'Quelle routine soin adopter le matin pour une peau éclatante ?',
        excerpt: 'Nettoyage, sérum, hydratation... On vous explique l\'ordre exact pour maximiser l\'efficacité de vos produits.',
        content: 'Le matin, votre peau a besoin de protection et d\'hydratation. Commencez toujours par nettoyer votre visage pour éliminer le sébum accumulé la nuit. Appliquez ensuite un sérum antioxydant (Vitamine C), suivi de votre crème hydratante. N\'oubliez jamais, au grand jamais, votre protection solaire !',
        imageUrl: 'https://images.unsplash.com/photo-1576426863848-c2185fc6e818?auto=format&fit=crop&q=80&w=800',
        author: 'Sarah Bensaid',
        authorImageUrl: 'https://i.pravatar.cc/150?u=sarah',
        date: '2023-11-15',
        category: 'Soins Visage',
        featured: true,
    },
    {
        id: 2,
        slug: 'tendance-makeup-2024',
        title: 'Les tendances maquillage incontournables de 2024',
        excerpt: 'Du "Clean Girl Aesthetic" au retour des lèvres audacieuses, découvrez ce qui va marquer l\'année beauté.',
        content: 'Cette année, le teint se veut frais et naturel. On mise sur des blushes crèmes pour un effet bonne mine immédiat. Côté yeux, les liners graphiques colorés font leur grand retour.',
        imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800',
        author: 'Leila K.',
        authorImageUrl: 'https://i.pravatar.cc/150?u=leila',
        date: '2023-11-10',
        category: 'Maquillage',
    },
    {
        id: 3,
        slug: 'choisir-son-parfum',
        title: 'Comment trouver sa signature olfactive ?',
        excerpt: 'Floral, boisé, oriental... Nos conseils pour choisir le parfum qui révèle votre personnalité.',
        content: 'Un parfum est une émotion. Testez toujours le parfum sur votre peau et attendez quelques heures pour découvrir ses notes de cœur et de fond.',
        imageUrl: 'https://images.unsplash.com/photo-1595867359265-22365a2df23f?auto=format&fit=crop&q=80&w=800',
        author: 'Myriam D.',
        authorImageUrl: 'https://i.pravatar.cc/150?u=myriam',
        date: '2023-10-25',
        category: 'Parfums',
    }
];

export const contactMessages: ContactMessage[] = [
    { id: 1, name: 'Sophie Martin', email: 'sophie@email.com', subject: 'Conseil teinte fond de teint', message: 'Bonjour, j\'hésite entre deux teintes pour le Double Wear...', date: '2023-11-20', read: false },
];

export const sampleOrders: Order[] = [
    { 
        id: 'CS-8024', 
        customerName: 'Sarra Jlassi', 
        date: '2023-11-12', 
        total: 289, 
        status: 'Livrée', 
        itemCount: 1,
        items: [{ ...allProducts[0] as any, productId: 1, quantity: 1, price: 289 }],
        shippingAddress: { id: 1, type: 'Domicile', street: 'Rue du Lac', city: 'Tunis', postalCode: '1053', isDefault: true },
        paymentMethod: 'Carte Bancaire'
    }
];

export const initialAdvertisements: Advertisements = {
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
