
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  imageUrl: string; // Gardé pour rétrocompatibilité (sera l'image principale)
  images: string[]; // Nouveau champ pour la galerie
  discount?: number;
  category: string;
  promo?: boolean;
  material?: string;
  description?: string;
  quantity: number;
  specifications?: { name: string; value: string; }[];
  // Nouveau bloc éditorial
  highlights?: {
    title: string;
    imageUrl: string;
    sections: {
      subtitle: string;
      features: {
        title: string;
        description: string;
      }[];
    }[];
  };
}

export interface Review {
    _id: string;
    userId: string | number;
    userName: string;
    targetId: number;
    targetType: 'product' | 'pack';
    rating: number;
    comment: string;
    date: string;
}

export interface SubCategoryItem {
    name: string;
}

export interface SubCategoryGroup {
    title: string;
    items: SubCategoryItem[];
}

export interface Category {
  name: string;
  subCategories?: string[];
  megaMenu?: SubCategoryGroup[];
}

export interface Brand {
    name: string;
    productCount: number;
    logoUrl: string;
}

export interface Pack {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  imageUrl: string;
  includedItems: string[];
  includedProductIds: number[];
  includedPackIds?: number[];
  discount?: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  authorImageUrl: string;
  date: string;
  category: string;
  featured?: boolean;
}

export type Cartable = Product | Pack;

export interface CartItem {
  id: string; // e.g., 'product-1' or 'pack-2'
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  originalItem: Cartable;
}

export interface OrderItem {
  productId: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}


export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'En attente' | 'Expédiée' | 'Livrée' | 'Annulée';
  itemCount: number;
  items: (OrderItem & Product)[]; // Merging for convenience to have product details readily available
  shippingAddress: Address;
  paymentMethod: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Address {
  id: number | string; // Changé pour accepter les IDs générés par Mongo ou Frontend
  type: 'Domicile' | 'Travail';
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string | number; // Changé pour accepter l'ObjectId MongoDB converti en string
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: 'CUSTOMER' | 'ADMIN';
  age?: number;
  addresses: Address[];
  photo_profil?: string;
}

// Advertisement Types
export interface HeroSlide {
  id: number;
  bgImage: string; // Utilisé comme image de fond ou poster vidéo
  videoUrl?: string; // URL optionnelle pour la vidéo (mp4)
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface DestockageAd {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  coverImage: string;
  buttonText: string;
}

export interface AudioPromoAd {
  id: number;
  title: string;
  subtitle1: string;
  subtitle2: string;
  image: string;
  background: string;
  duration: number;
}

export interface MediumPromoAd {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  linkType: 'category' | 'pack';
  linkTarget: string; // Category name or Pack ID as a string
}

export interface ImagePromoAd {
  id: number;
  imageUrl: string;
  altText: string;
  link: string;
}

export interface CollageItem {
  id: number;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link: string;
  size: 'large' | 'tall' | 'wide' | 'small'; // Determine la taille dans la grille
}

export interface ShoppableVideo {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  username: string; // ex: @kylieskin
  description: string; // ex: lip and cheek glow balm
  productIds?: number[]; // IDs des produits liés
}

// FIX: Export specific types for SmallPromoBanner
export interface BaseSmallPromoAd {
  id: number;
  bgGradient: string;
  image: string;
}

export interface DiscountPromoAd extends BaseSmallPromoAd {
  type: 'discount';
  promoText: string;
  title: string;
  discount: string;
}

export interface PriceStartPromoAd extends BaseSmallPromoAd {
  type: 'price_start';
  title: string;
  features: string[];
  priceStartText: string;
  price: string;
  priceUnit: string;
}

export interface FlashSalePromoAd extends BaseSmallPromoAd {
  type: 'flash_sale';
  flashTitle: string;
  title?: string;
  discountText?: string;
  flashSubtitle: string;
  notice: string;
}

export type SmallPromoAd = DiscountPromoAd | PriceStartPromoAd | FlashSalePromoAd;

// --- NEW CONFIG TYPES FOR HOME PAGE ---
export interface TrustBadgeConfig {
    id: number;
    title: string;
    subtitle: string;
}

export interface ProductCarouselConfig {
    title: string;
    productIds: number[];
    limit?: number;
}

export interface VirtualTryOnConfig {
    title: string;
    description: string;
    buttonText: string;
    imageLeft?: string;
    imageRight?: string;
    link?: string;
}

export interface FeaturedGridConfig {
    title: string;
    productIds: number[];
    buttonText: string;
    buttonLink: string;
}

export interface Advertisements {
  heroSlides: HeroSlide[];
  trustBadges?: TrustBadgeConfig[]; // New
  audioPromo: AudioPromoAd[];
  promoBanners: [MediumPromoAd, MediumPromoAd];
  smallPromoBanners: ImagePromoAd[];
  editorialCollage: CollageItem[];
  shoppableVideos: ShoppableVideo[];
  newArrivals?: ProductCarouselConfig; 
  summerSelection?: ProductCarouselConfig;
  virtualTryOn?: VirtualTryOnConfig; 
  featuredGrid?: FeaturedGridConfig; // New
}

export interface OffersPageConfig {
    header: {
        title: string;
        titleColor?: string;
        subtitle: string;
        subtitleColor?: string;
    };
    glowRoutine: {
        title: string;
        titleColor?: string;
        subtitle: string;
        subtitleColor?: string;
        buttonText: string;
        buttonColor?: string;
        buttonTextColor?: string;
        image: string;
    };
    essentials: {
        title: string;
        titleColor?: string;
        subtitle: string;
        subtitleColor?: string;
        buttonText: string;
        buttonColor?: string;
        buttonTextColor?: string;
        image: string;
    };
    dealOfTheDay: {
        productId: number;
        titleColor?: string;
        subtitleColor?: string;
    };
    allOffersGrid: {
        title: string;
        titleColor?: string;
        useManualSelection: boolean;
        manualProductIds: number[];
        limit: number;
    };
}

export interface Promotion {
  id: number;
  name: string;
  discountPercentage: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  productIds: number[];
  packIds: number[];
}

export interface SearchResultItem {
  item: Product;
  context: string; // e.g., 'In category: ...', 'In pack: ...'
}

export interface SearchResult {
  products: SearchResultItem[];
  categories: { name: string }[];
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}

export interface Store {
    id: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    openingHours: string;
    mapUrl?: string;
    imageUrl: string;
    isPickupPoint: boolean;
}
