
import React, { useMemo, useState } from 'react';
import type { Product } from '../../types';
import type { SectionType } from './ManageOffersPage';
import { RichTextEditor } from './RichTextEditor';
import { ImageInput } from '../ImageInput';
import { SearchIcon, CheckCircleIcon } from '../IconComponents';

interface EditorPanelProps {
    section: SectionType;
    data: any;
    onChange: (data: any) => void;
    allProducts: Product[];
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

export const EditorPanel: React.FC<EditorPanelProps> = ({ section, data, onChange, allProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const toggleGridProduct = (productId: number) => {
        const currentIds = data.manualProductIds || [];
        if (currentIds.includes(productId)) {
            handleChange('manualProductIds', currentIds.filter((id: number) => id !== productId));
        } else {
            handleChange('manualProductIds', [...currentIds, productId]);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return allProducts.slice(0, 20);
        return allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50);
    }, [allProducts, searchTerm]);

    const selectedProduct = useMemo(() => 
        allProducts.find(p => p.id === data.productId), 
    [allProducts, data.productId]);

    const renderHeader = (title: string) => (
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-xs text-gray-500">Modifiez les champs ci-dessous pour voir le résultat en direct.</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            {renderHeader(section === 'header' ? "En-tête de page" : section === 'dealOfTheDay' ? "Offre du Jour" : section === 'allOffersGrid' ? "Grille des Offres" : "Bloc Promotionnel")}
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
                
                {/* --- HEADER --- */}
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
                            <div className="max-h-60 overflow-y-auto border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
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

                {/* --- GRID --- */}
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
                                    <div className="relative mb-2">
                                        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Chercher pour ajouter..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                                        />
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
