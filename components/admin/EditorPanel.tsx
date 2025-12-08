
import React, { useMemo, useState } from 'react';
import type { Product, Category, Pack, TrustBadgeConfig } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { ImageInput } from '../ImageInput';
import { SearchIcon, CheckCircleIcon, PlusIcon, TrashIcon } from '../IconComponents';

interface EditorPanelProps {
    section: string; // Handle generic sections
    data: any;
    onChange: (data: any) => void;
    allProducts: Product[];
    allCategories?: Category[];
    allPacks?: Pack[];
}

const BRAND_COLORS = [
    '#e11d48', // Rose 600
    '#f43f5e', // Rose 500
    '#111827', // Gray 900
    '#4b5563', // Gray 600
    '#d4af37', // Gold
    '#000000', // Black
    '#ffffff', // White
];

const ColorInput: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase">{value}</span>
                <input 
                    type="color" 
                    value={value || "#000000"} 
                    onChange={(e) => onChange(e.target.value)} 
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
            </div>
        </div>
        
        {/* Preset Palette */}
        <div className="flex gap-1.5 flex-wrap">
            {BRAND_COLORS.map(color => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={`w-5 h-5 rounded-full border border-gray-300 dark:border-gray-500 hover:scale-110 transition-transform ${value === color ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800' : ''}`}
                    style={{ backgroundColor: color }}
                    title={color}
                />
            ))}
        </div>
    </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={onChange} 
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
        />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</label>
        <textarea 
            value={value} 
            onChange={onChange} 
            rows={3}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
        />
    </div>
);

export const EditorPanel: React.FC<EditorPanelProps> = ({ section, data, onChange, allProducts, allCategories = [], allPacks = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(''); // New state for category filtering

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // --- Array Item Management Helpers (Hero, Audio, etc.) ---
    const handleArrayItemChange = (index: number, field: string, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };

    const addArrayItem = (template: any) => {
        onChange([...data, { ...template, id: Date.now() }]);
        setActiveSlideIndex(data.length);
    };

    const removeArrayItem = (index: number) => {
        if (data.length <= 1) {
            alert("Il doit y avoir au moins un élément.");
            return;
        }
        onChange(data.filter((_: any, i: number) => i !== index));
        setActiveSlideIndex(Math.max(0, index - 1));
    };

    // --- Product Selection Helper for Lists ---
    const toggleProductInList = (productId: number, listField: string = 'productIds') => {
        const currentIds = data[listField] || [];
        if (currentIds.includes(productId)) {
            handleChange(listField, currentIds.filter((id: number) => id !== productId));
        } else {
            handleChange(listField, [...currentIds, productId]);
        }
    };

    // --- Data processing ---
    const toggleGridProduct = (productId: number) => {
        const currentIds = data.manualProductIds || [];
        if (currentIds.includes(productId)) {
            handleChange('manualProductIds', currentIds.filter((id: number) => id !== productId));
        } else {
            handleChange('manualProductIds', [...currentIds, productId]);
        }
    };

    const filteredProducts = useMemo(() => {
        let filtered = allProducts;
        
        // Filter by Search Term
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        
        // Filter by Category Dropdown
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        return filtered.slice(0, 50);
    }, [allProducts, searchTerm, selectedCategory]);

    const selectedProduct = useMemo(() => 
        allProducts.find(p => p.id === data.productId), 
    [allProducts, data.productId]);

    const allCategoryNames = useMemo(() => {
         const names = allCategories.flatMap(c => 
            [c.name, ...(c.subCategories || []), ...(c.megaMenu?.flatMap(m => m.items.map(i => i.name)) || [])]
        );
        return [...new Set(names)].sort();
    }, [allCategories]);

    const renderHeader = (title: string) => (
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-xs text-gray-500">Modifiez les champs ci-dessous pour voir le résultat en direct.</p>
        </div>
    );

    // Dynamic Title mapping
    const titles: {[key: string]: string} = {
        header: "En-tête de page",
        dealOfTheDay: "Offre du Jour",
        allOffersGrid: "Grille des Offres",
        glowRoutine: "Bloc Glow Routine",
        essentials: "Bloc Essentials",
        hero: "Carrousel Principal (Hero)",
        trustBadges: "Badges de Confiance",
        audioPromo: "Publicités Audio",
        promoBanner: "Bannière Promotionnelle",
        editorialCollage: "Collage Éditorial (Masonry)",
        shoppableVideos: "Vidéos Shopping (Reels)",
        newArrivals: "Carrousel Nouvelles Arrivées",
        summerSelection: "Carrousel Sélection Été",
        virtualTryOn: "Bloc Virtual Try-On",
        featuredGrid: "Grille de Produits (Accueil)"
    };

    const displayTitle = titles[section] || (section.startsWith('promoBanner') ? "Bannière Promotionnelle" : "Bloc Promotionnel");

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            {renderHeader(displayTitle)}
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
                
                {/* --- HEADER (OFFERS PAGE) --- */}
                {section === 'header' && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Titre Principal</label>
                            <RichTextEditor value={data.title} onChange={(html) => handleChange('title', html)} />
                            <div className="mt-2">
                                <ColorInput label="Couleur Titre" value={data.titleColor} onChange={(v) => handleChange('titleColor', v)} />
                            </div>
                        </div>
                        <hr className="dark:border-gray-700"/>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sous-titre</label>
                            <RichTextEditor value={data.subtitle} onChange={(html) => handleChange('subtitle', html)} />
                            <div className="mt-2">
                                <ColorInput label="Couleur Sous-titre" value={data.subtitleColor} onChange={(v) => handleChange('subtitleColor', v)} />
                            </div>
                        </div>
                    </>
                )}

                {/* --- BLOCS PROMOS (Glow / Essentials) --- */}
                {(section === 'glowRoutine' || section === 'essentials') && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Textes</label>
                            <RichTextEditor label="Titre" value={data.title} onChange={(html) => handleChange('title', html)} className="mb-2" />
                            <ColorInput label="Couleur Titre" value={data.titleColor} onChange={(v) => handleChange('titleColor', v)} />
                            
                            <div className="mt-4">
                                <RichTextEditor label="Sous-titre" value={data.subtitle} onChange={(html) => handleChange('subtitle', html)} className="mb-2" />
                                <ColorInput label="Couleur Sous-titre" value={data.subtitleColor} onChange={(v) => handleChange('subtitleColor', v)} />
                            </div>
                        </div>

                        <hr className="dark:border-gray-700"/>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Visuel</label>
                            <ImageInput label="Image d'illustration" value={data.image} onChange={(v) => handleChange('image', v)} />
                        </div>

                        <hr className="dark:border-gray-700"/>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4">Configuration du Bouton</label>
                            <InputField label="Texte du bouton" value={data.buttonText} onChange={(e) => handleChange('buttonText', e.target.value)} />
                            <ColorInput label="Couleur de Fond" value={data.buttonColor} onChange={(v) => handleChange('buttonColor', v)} />
                            <ColorInput label="Couleur du Texte" value={data.buttonTextColor} onChange={(v) => handleChange('buttonTextColor', v)} />
                        </div>
                    </>
                )}

                {/* --- TRUST BADGES --- */}
                {section === 'trustBadges' && Array.isArray(data) && (
                    <div className="space-y-6">
                        {data.map((badge: TrustBadgeConfig, index: number) => (
                            <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <h4 className="font-bold text-sm mb-3">Badge {index + 1}</h4>
                                <InputField label="Titre" value={badge.title} onChange={(e) => handleArrayItemChange(index, 'title', e.target.value)} />
                                <InputField label="Sous-titre" value={badge.subtitle} onChange={(e) => handleArrayItemChange(index, 'subtitle', e.target.value)} />
                            </div>
                        ))}
                    </div>
                )}

                {/* --- VIRTUAL TRY ON --- */}
                {section === 'virtualTryOn' && (
                    <div className="space-y-4">
                        <InputField label="Titre" value={data.title} onChange={(e) => handleChange('title', e.target.value)} />
                        <TextAreaField label="Description" value={data.description} onChange={(e) => handleChange('description', e.target.value)} />
                        
                        <hr className="dark:border-gray-700"/>
                        
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Images Décoratives</label>
                        <ImageInput label="Image Gauche" value={data.imageLeft} onChange={(v) => handleChange('imageLeft', v)} />
                        <ImageInput label="Image Droite" value={data.imageRight} onChange={(v) => handleChange('imageRight', v)} />
                        
                        <hr className="dark:border-gray-700"/>
                        
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bouton d'action</label>
                        <InputField label="Texte du bouton" value={data.buttonText} onChange={(e) => handleChange('buttonText', e.target.value)} />
                        <InputField label="Lien du bouton (URL)" value={data.link} onChange={(e) => handleChange('link', e.target.value)} />
                    </div>
                )}

                {/* --- CAROUSELS & FEATURED GRID --- */}
                {(section === 'newArrivals' || section === 'summerSelection' || section === 'featuredGrid') && (
                    <div className="space-y-4">
                        <InputField label="Titre du bloc" value={data.title} onChange={(e) => handleChange('title', e.target.value)} />
                        
                        {/* Featured Grid Specific Fields */}
                        {section === 'featuredGrid' && (
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bouton bas de grille</label>
                                <InputField label="Texte" value={data.buttonText} onChange={(e) => handleChange('buttonText', e.target.value)} />
                                <InputField label="Lien (URL)" value={data.buttonLink} onChange={(e) => handleChange('buttonLink', e.target.value)} />
                            </div>
                        )}

                        {/* Limit input for Carousels only */}
                        {section !== 'featuredGrid' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre maximum de produits</label>
                                <input 
                                    type="number" 
                                    value={data.limit || 8} 
                                    onChange={(e) => handleChange('limit', parseInt(e.target.value))} 
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                                />
                            </div>
                        )}

                        <hr className="dark:border-gray-700"/>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sélection des produits</label>
                        
                        <div className="grid gap-2 mb-2">
                            {/* Category Filter */}
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-rose-500"
                            >
                                <option value="">Toutes les catégories</option>
                                {allCategoryNames.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Search Bar */}
                            <div className="relative">
                                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Chercher par nom..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
                            {filteredProducts.map(p => {
                                const isSelected = (data.productIds || []).includes(p.id);
                                return (
                                    <div 
                                        key={p.id} 
                                        onClick={() => toggleProductInList(p.id, 'productIds')}
                                        className={`p-2 flex items-center gap-3 cursor-pointer border-b last:border-0 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${isSelected ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                                            {isSelected && <CheckCircleIcon className="w-3.5 h-3.5" />}
                                        </div>
                                        <img src={p.imageUrl} className="w-8 h-8 rounded object-cover" />
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-medium truncate">{p.name}</p>
                                            <p className="text-[10px] text-gray-500">{p.price} DT</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">{data.productIds?.length || 0} produits sélectionnés</p>
                    </div>
                )}

                {/* --- DEAL OF THE DAY --- */}
                {section === 'dealOfTheDay' && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Style</label>
                            <ColorInput label="Couleur Titre Produit" value={data.titleColor} onChange={(v) => handleChange('titleColor', v)} />
                            <ColorInput label="Couleur Description" value={data.subtitleColor} onChange={(v) => handleChange('subtitleColor', v)} />
                        </div>

                        <hr className="dark:border-gray-700"/>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Produit mis en avant</label>
                            {selectedProduct && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900 rounded-lg mb-4 flex items-center gap-3">
                                    <img src={selectedProduct.imageUrl} className="w-10 h-10 rounded bg-white object-cover" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-rose-700 dark:text-rose-300 truncate">{selectedProduct.name}</p>
                                        <p className="text-xs text-rose-500">{selectedProduct.price} DT</p>
                                    </div>
                                </div>
                            )}

                            <div className="relative mb-2">
                                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un produit..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
                                {filteredProducts.map(p => (
                                    <div 
                                        key={p.id} 
                                        onClick={() => handleChange('productId', p.id)}
                                        className={`p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${data.productId === p.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                                    >
                                        <img src={p.imageUrl} className="w-8 h-8 rounded object-cover" />
                                        <span className="text-xs truncate">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* --- HERO SLIDER --- */}
                {section === 'hero' && Array.isArray(data) && (
                    <>
                        <div className="flex items-center gap-2 border-b dark:border-gray-600 pb-2 mb-4 overflow-x-auto no-scrollbar">
                            {data.map((_, index) => (
                                <button key={index} type="button" onClick={() => setActiveSlideIndex(index)} className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${activeSlideIndex === index ? 'bg-rose-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    Slide {index + 1}
                                </button>
                            ))}
                            <button type="button" onClick={() => addArrayItem({ bgImage: "https://picsum.photos/1200/600", title: "Nouveau Slide", subtitle: "Description", buttonText: "Découvrir" })} className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200"><PlusIcon className="w-4 h-4" /></button>
                        </div>
                        {data[activeSlideIndex] && (
                            <div className="space-y-4 animate-fadeIn">
                                <InputField label="Titre" value={data[activeSlideIndex].title} onChange={e => handleArrayItemChange(activeSlideIndex, 'title', e.target.value)} />
                                <InputField label="Sous-titre" value={data[activeSlideIndex].subtitle} onChange={e => handleArrayItemChange(activeSlideIndex, 'subtitle', e.target.value)} />
                                <InputField label="Texte du bouton" value={data[activeSlideIndex].buttonText} onChange={e => handleArrayItemChange(activeSlideIndex, 'buttonText', e.target.value)} />
                                <InputField label="URL Vidéo (Optionnel)" value={data[activeSlideIndex].videoUrl || ''} onChange={e => handleArrayItemChange(activeSlideIndex, 'videoUrl', e.target.value)} />
                                <ImageInput label="Image de fond / Poster" value={data[activeSlideIndex].bgImage} onChange={val => handleArrayItemChange(activeSlideIndex, 'bgImage', val)} />
                                <button type="button" onClick={() => removeArrayItem(activeSlideIndex)} className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-2">
                                    <TrashIcon className="w-3 h-3"/> Supprimer ce slide
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* --- PROMO BANNERS --- */}
                {section.startsWith('promoBanner') && (
                    <div className="space-y-4">
                        <InputField label="Titre" value={data.title} onChange={e => handleChange('title', e.target.value)} />
                        <InputField label="Sous-titre" value={data.subtitle} onChange={e => handleChange('subtitle', e.target.value)} />
                        <InputField label="Texte du bouton" value={data.buttonText} onChange={e => handleChange('buttonText', e.target.value)} />
                        <ImageInput label="Image" value={data.image} onChange={val => handleChange('image', val)} />
                        
                        <div className="pt-4 border-t dark:border-gray-700">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Lien vers</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <select 
                                        value={data.linkType} 
                                        onChange={e => handleChange('linkType', e.target.value)} 
                                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
                                    >
                                        <option value="category">Catégorie</option>
                                        <option value="pack">Pack</option>
                                    </select>
                                </div>
                                <div>
                                    <select 
                                        value={data.linkTarget} 
                                        onChange={e => handleChange('linkTarget', e.target.value)} 
                                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
                                    >
                                        {data.linkType === 'category' ? (
                                            allCategoryNames.map(cat => <option key={cat} value={cat}>{cat}</option>)
                                        ) : (
                                            allPacks.map(pack => <option key={pack.id} value={pack.id}>{pack.name}</option>)
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- AUDIO PROMO --- */}
                {section === 'audioPromo' && Array.isArray(data) && (
                    <>
                        <div className="flex items-center gap-2 border-b dark:border-gray-600 pb-2 mb-4 overflow-x-auto no-scrollbar">
                            {data.map((_, index) => (
                                <button key={index} type="button" onClick={() => setActiveSlideIndex(index)} className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${activeSlideIndex === index ? 'bg-rose-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    Pub {index + 1}
                                </button>
                            ))}
                            <button type="button" onClick={() => addArrayItem({ title: "Titre", subtitle1: "Sous-titre 1", subtitle2: "Sous-titre 2", image: "https://picsum.photos/800/400", duration: 8 })} className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200"><PlusIcon className="w-4 h-4" /></button>
                        </div>
                        {data[activeSlideIndex] && (
                            <div className="space-y-4 animate-fadeIn">
                                <InputField label="Titre" value={data[activeSlideIndex].title} onChange={e => handleArrayItemChange(activeSlideIndex, 'title', e.target.value)} />
                                <InputField label="Sous-titre 1" value={data[activeSlideIndex].subtitle1} onChange={e => handleArrayItemChange(activeSlideIndex, 'subtitle1', e.target.value)} />
                                <InputField label="Sous-titre 2" value={data[activeSlideIndex].subtitle2} onChange={e => handleArrayItemChange(activeSlideIndex, 'subtitle2', e.target.value)} />
                                <ImageInput label="Image" value={data[activeSlideIndex].image} onChange={val => handleArrayItemChange(activeSlideIndex, 'image', val)} />
                                <InputField label="Durée (sec)" value={data[activeSlideIndex].duration} onChange={e => handleArrayItemChange(activeSlideIndex, 'duration', parseInt(e.target.value))} />
                                <button type="button" onClick={() => removeArrayItem(activeSlideIndex)} className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-2">
                                    <TrashIcon className="w-3 h-3"/> Supprimer
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* --- MASONRY / COLLAGE --- */}
                {section === 'editorialCollage' && Array.isArray(data) && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">{data.length} éléments</span>
                            <button type="button" onClick={() => addArrayItem({ imageUrl: "https://picsum.photos/400/400", link: "#", size: 'small', title: 'Titre' })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200">+ Ajouter</button>
                        </div>
                        <div className="space-y-4">
                            {data.map((item: any, index: number) => (
                                <div key={item.id || index} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold">Image {index + 1}</span>
                                        <button onClick={() => removeArrayItem(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                    <ImageInput label="" value={item.imageUrl} onChange={val => handleArrayItemChange(index, 'imageUrl', val)} />
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <InputField label="Titre" value={item.title || ''} onChange={e => handleArrayItemChange(index, 'title', e.target.value)} />
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Taille</label>
                                            <select 
                                                value={item.size} 
                                                onChange={e => handleArrayItemChange(index, 'size', e.target.value)}
                                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
                                            >
                                                <option value="small">Carré (1x1)</option>
                                                <option value="large">Grand (2x2)</option>
                                                <option value="tall">Haut (1x2)</option>
                                                <option value="wide">Large (2x1)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <InputField label="Lien" value={item.link} onChange={e => handleArrayItemChange(index, 'link', e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- SHOPPABLE VIDEOS --- */}
                {section === 'shoppableVideos' && Array.isArray(data) && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">{data.length} vidéos</span>
                            <button type="button" onClick={() => addArrayItem({ thumbnailUrl: "https://picsum.photos/400/700", videoUrl: "", username: "@user", description: "Desc", productIds: [] })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200">+ Ajouter</button>
                        </div>
                        <div className="space-y-4">
                            {data.map((item: any, index: number) => (
                                <div key={item.id || index} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold">Vidéo {index + 1}</span>
                                        <button onClick={() => removeArrayItem(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                    <ImageInput label="Miniature" value={item.thumbnailUrl} onChange={val => handleArrayItemChange(index, 'thumbnailUrl', val)} />
                                    <InputField label="URL Vidéo (.mp4)" value={item.videoUrl} onChange={e => handleArrayItemChange(index, 'videoUrl', e.target.value)} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <InputField label="User" value={item.username} onChange={e => handleArrayItemChange(index, 'username', e.target.value)} />
                                        <InputField label="Description" value={item.description} onChange={e => handleArrayItemChange(index, 'description', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- GRID (OFFERS PAGE) --- */}
                {section === 'allOffersGrid' && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">En-tête de section</label>
                            <RichTextEditor value={data.title} onChange={(html) => handleChange('title', html)} />
                            <div className="mt-2">
                                <ColorInput label="Couleur du Titre" value={data.titleColor} onChange={(v) => handleChange('titleColor', v)} />
                            </div>
                        </div>

                        <hr className="dark:border-gray-700"/>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4">Configuration de la Grille</label>
                            
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium">Nombre limite</span>
                                <input 
                                    type="number" 
                                    value={data.limit} 
                                    onChange={(e) => handleChange('limit', parseInt(e.target.value))} 
                                    className="w-20 p-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <input 
                                    type="checkbox" 
                                    id="manualMode" 
                                    checked={data.useManualSelection} 
                                    onChange={(e) => handleChange('useManualSelection', e.target.checked)} 
                                    className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                                />
                                <label htmlFor="manualMode" className="text-sm font-bold cursor-pointer select-none">Sélection Manuelle</label>
                            </div>

                            {data.useManualSelection ? (
                                <div>
                                    <div className="grid gap-2 mb-2">
                                        <select 
                                            value={selectedCategory} 
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-rose-500"
                                        >
                                            <option value="">Toutes les catégories</option>
                                            {allCategoryNames.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="relative">
                                            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Chercher pour ajouter..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
                                        {filteredProducts.map(p => {
                                            const isSelected = (data.manualProductIds || []).includes(p.id);
                                            return (
                                                <div 
                                                    key={p.id} 
                                                    onClick={() => toggleGridProduct(p.id)}
                                                    className={`p-2 flex items-center gap-3 cursor-pointer border-b last:border-0 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${isSelected ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                                                >
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                                                        {isSelected && <CheckCircleIcon className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <img src={p.imageUrl} className="w-8 h-8 rounded object-cover" />
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-medium truncate">{p.name}</p>
                                                        <p className="text-[10px] text-gray-500">{p.price} DT</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-right">{data.manualProductIds?.length || 0} produits sélectionnés</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic bg-white dark:bg-gray-900 p-3 border rounded">
                                    En mode automatique, les produits ayant une promotion (champ 'promo' ou 'oldPrice') seront affichés.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
