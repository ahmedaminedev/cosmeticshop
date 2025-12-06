
import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Category } from '../../types';
import { XMarkIcon, PlusIcon, TrashIcon, InformationCircleIcon, CartIcon, HeartIcon, PhotoIcon } from '../IconComponents';
import { ImageInput } from '../ImageInput';
import { useToast } from '../ToastContext'; 
import { ProductGallery } from '../ProductGallery';
import { ProductHighlights } from '../ProductHighlights'; // Pour la prévisualisation

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Omit<Product, 'id'>) => void;
    product: Product | null;
    categories: Category[];
}

type Specification = { name: string; value: string; };

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product, categories }) => {
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        oldPrice: 0,
        discount: 0,
        images: [] as string[],
        category: '',
        description: '',
        quantity: 0,
        specifications: [] as Specification[],
        // Highlights state
        highlightsTitle: 'Pourquoi on l\'adore',
        highlightsImage: '',
        highlightsSections: [] as { subtitle: string; features: { title: string; description: string; }[] }[]
    });
    
    const finalPrice = useMemo(() => {
        const basePrice = formData.oldPrice || 0;
        const discount = formData.discount || 0;
        if (basePrice > 0 && discount > 0) {
            const effectiveDiscount = Math.min(discount, 100);
            return basePrice * (1 - effectiveDiscount / 100);
        }
        return basePrice;
    }, [formData.oldPrice, formData.discount]);

    const isPromo = useMemo(() => (formData.discount || 0) > 0 && (formData.oldPrice || 0) > 0, [formData.discount, formData.oldPrice]);

    useEffect(() => {
        if (product) {
            const basePrice = product.oldPrice || product.price;
            let initialImages = product.images || [];
            if (initialImages.length === 0 && product.imageUrl) {
                initialImages = [product.imageUrl];
            }

            setFormData({
                name: product.name,
                brand: product.brand,
                oldPrice: basePrice,
                discount: product.discount || 0,
                images: initialImages,
                category: product.category,
                description: product.description || '',
                quantity: product.quantity,
                specifications: product.specifications || [],
                // Load highlights
                highlightsTitle: product.highlights?.title || 'Pourquoi on l\'adore',
                highlightsImage: product.highlights?.imageUrl || '',
                highlightsSections: product.highlights?.sections || []
            });
        } else {
             setFormData({
                name: '', brand: '', oldPrice: 0, discount: 0, images: [],
                category: '', description: '', quantity: 0, specifications: [],
                highlightsTitle: 'Pourquoi on l\'adore', highlightsImage: '', highlightsSections: []
            });
        }
        setStep(1);
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number = value;
        if (type === 'number') {
            processedValue = parseFloat(value) || 0;
            if (name === 'discount') {
                processedValue = Math.max(0, processedValue);
            }
        }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleImagesChange = (newImages: string[]) => {
        setFormData(prev => ({ ...prev, images: newImages }));
    };
    
    // --- Specs Logic ---
    const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };
    const addSpec = () => {
        setFormData(prev => ({...prev, specifications: [...prev.specifications, {name: '', value: ''}]}));
    };
    const removeSpec = (index: number) => {
        setFormData(prev => ({...prev, specifications: prev.specifications.filter((_, i) => i !== index)}));
    };

    // --- Highlights Logic ---
    const handleHighlightsImageChange = (val: string) => {
        setFormData(prev => ({ ...prev, highlightsImage: val }));
    };
    const addHighlightSection = () => {
        setFormData(prev => ({
            ...prev,
            highlightsSections: [...prev.highlightsSections, { subtitle: 'Nouveau point fort', features: [{ title: 'Avantage', description: 'Description...' }] }]
        }));
    };
    const removeHighlightSection = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            highlightsSections: prev.highlightsSections.filter((_, i) => i !== idx)
        }));
    };
    const handleSectionSubtitleChange = (idx: number, val: string) => {
        const newSections = [...formData.highlightsSections];
        newSections[idx].subtitle = val;
        setFormData(prev => ({ ...prev, highlightsSections: newSections }));
    };
    const addHighlightFeature = (sectionIdx: number) => {
        const newSections = [...formData.highlightsSections];
        newSections[sectionIdx].features.push({ title: '', description: '' });
        setFormData(prev => ({ ...prev, highlightsSections: newSections }));
    };
    const removeHighlightFeature = (sectionIdx: number, featureIdx: number) => {
        const newSections = [...formData.highlightsSections];
        newSections[sectionIdx].features = newSections[sectionIdx].features.filter((_, i) => i !== featureIdx);
        setFormData(prev => ({ ...prev, highlightsSections: newSections }));
    };
    const handleHighlightFeatureChange = (sectionIdx: number, featureIdx: number, field: 'title' | 'description', val: string) => {
        const newSections = [...formData.highlightsSections];
        newSections[sectionIdx].features[featureIdx] = { ...newSections[sectionIdx].features[featureIdx], [field]: val };
        setFormData(prev => ({ ...prev, highlightsSections: newSections }));
    };


    const validateForm = () => {
        if (!formData.name.trim()) {
            addToast("Le nom du produit est obligatoire.", "error");
            return false;
        }
        if (!formData.category) {
            addToast("Veuillez sélectionner une catégorie.", "error");
            return false;
        }
        if (formData.images.length === 0) {
            addToast("Veuillez ajouter au moins une image pour le produit.", "error");
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const productData: Omit<Product, 'id'> = {
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            description: formData.description,
            imageUrl: formData.images[0], // Set Main Image
            images: formData.images,
            quantity: formData.quantity,
            price: finalPrice,
            oldPrice: isPromo ? formData.oldPrice : undefined,
            discount: isPromo ? formData.discount : undefined,
            promo: isPromo,
            specifications: formData.specifications.filter(s => s.name.trim() && s.value.trim()),
            highlights: {
                title: formData.highlightsTitle,
                imageUrl: formData.highlightsImage,
                sections: formData.highlightsSections
            }
        };
        onSave(productData);
        onClose();
    };
    
    if (!isOpen) return null;

    const allCategoryNames = categories.flatMap(c => 
        [c.name, ...(c.subCategories || []), ...(c.megaMenu?.flatMap(m => m.items.map(i => i.name)) || [])]
    );
    const uniqueCategoryNames = [...new Set(allCategoryNames)].sort();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="relative w-[95vw] h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
                
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800 z-20">
                    <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">{product ? 'Modifier' : 'Ajouter'} Produit (Étape {step}/3)</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><XMarkIcon className="w-6 h-6"/></button>
                </div>
                
                <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                    <div className="w-full lg:w-1/3 xl:w-1/4 overflow-y-auto border-b lg:border-b-0 lg:border-r dark:border-gray-700 p-6 bg-white dark:bg-gray-800 z-10 custom-scrollbar">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {step === 1 && (
                                <>
                                    <h3 className="font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Informations Générales</h3>
                                    <InputField name="name" label="Nom du produit" value={formData.name} onChange={handleChange} required />
                                    <div className="grid grid-cols-1 gap-4">
                                        <InputField name="brand" label="Marque" value={formData.brand} onChange={handleChange} required />
                                        <InputField name="category" label="Catégorie" value={formData.category} onChange={handleChange} as="select" options={uniqueCategoryNames} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField name="oldPrice" label="Prix Original" type="number" value={formData.oldPrice} onChange={handleChange} required />
                                        <InputField name="discount" label="Remise (%)" type="number" value={formData.discount} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField name="price" label="Prix Final" value={finalPrice.toFixed(3)} readOnly />
                                        <InputField name="quantity" label="Stock" type="number" value={formData.quantity} onChange={handleChange} required />
                                    </div>
                                    <ImageInput label="Images" images={formData.images} onChange={handleImagesChange} required />
                                    <InputField name="description" label="Description" value={formData.description} onChange={handleChange} as="textarea" rows={4} />
                                </>
                            )}
                            {step === 2 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Fiche Technique (Specs)</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-500">Détails techniques (ingrédients, contenance...)</span>
                                        <button type="button" onClick={addSpec} className="text-xs bg-green-100 text-green-700 font-bold py-1 px-2 rounded hover:bg-green-200">
                                            + Ajouter
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.specifications.map((spec, index) => (
                                            <div key={index} className="grid grid-cols-10 gap-2 items-center bg-gray-50 dark:bg-gray-700/30 p-2 rounded-md">
                                                <input type="text" placeholder="Nom" value={spec.name} onChange={(e) => handleSpecChange(index, 'name', e.target.value)} className="col-span-4 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm" />
                                                <input type="text" placeholder="Valeur" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="col-span-5 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm" />
                                                <button type="button" onClick={() => removeSpec(index)} className="col-span-1 text-red-500 hover:text-red-700 flex justify-center"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Contenu Éditorial (Why we love it)</h3>
                                    <InputField name="highlightsTitle" label="Titre du bloc" value={formData.highlightsTitle} onChange={handleChange} />
                                    <ImageInput label="Image d'illustration (Droite)" value={formData.highlightsImage} onChange={handleHighlightsImageChange} />
                                    
                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium">Sections</label>
                                            <button type="button" onClick={addHighlightSection} className="text-xs bg-blue-100 text-blue-700 font-bold py-1 px-2 rounded hover:bg-blue-200">+ Section</button>
                                        </div>
                                        
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                            {formData.highlightsSections.map((section, sIdx) => (
                                                <div key={sIdx} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/30">
                                                    <div className="flex justify-between mb-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Sous-titre (ex: Lip Liner)" 
                                                            value={section.subtitle} 
                                                            onChange={(e) => handleSectionSubtitleChange(sIdx, e.target.value)}
                                                            className="bg-transparent border-b border-gray-300 dark:border-gray-500 w-full mr-2 text-sm font-bold text-rose-500 focus:outline-none focus:border-rose-500"
                                                        />
                                                        <button type="button" onClick={() => removeHighlightSection(sIdx)} className="text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                                    </div>
                                                    
                                                    <div className="pl-2 space-y-2 border-l-2 border-rose-200 dark:border-gray-600">
                                                        {section.features.map((feature, fIdx) => (
                                                            <div key={fIdx} className="flex gap-2 items-start">
                                                                <div className="flex-grow space-y-1">
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="Titre caractéristique" 
                                                                        value={feature.title} 
                                                                        onChange={(e) => handleHighlightFeatureChange(sIdx, fIdx, 'title', e.target.value)}
                                                                        className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-xs font-bold"
                                                                    />
                                                                    <textarea 
                                                                        placeholder="Description..." 
                                                                        value={feature.description} 
                                                                        onChange={(e) => handleHighlightFeatureChange(sIdx, fIdx, 'description', e.target.value)}
                                                                        rows={2}
                                                                        className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-xs"
                                                                    />
                                                                </div>
                                                                <button type="button" onClick={() => removeHighlightFeature(sIdx, fIdx)} className="text-gray-400 hover:text-red-500 mt-1"><TrashIcon className="w-3 h-3"/></button>
                                                            </div>
                                                        ))}
                                                        <button type="button" onClick={() => addHighlightFeature(sIdx)} className="text-xs text-blue-500 hover:underline">+ Ajouter point</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-6 border-t dark:border-gray-700 mt-4">
                                <div>
                                    {step > 1 && (
                                        <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">Précédent</button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">Annuler</button>
                                    {step < 3 ? (
                                        <button type="button" onClick={() => setStep(step + 1)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Suivant</button>
                                    ) : (
                                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Sauvegarder</button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-100 dark:bg-gray-900 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
                        <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:p-8 border border-gray-200 dark:border-gray-700 flex-grow">
                                <div className="flex items-center justify-between mb-6 border-b pb-4 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aperçu en direct</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Mode Desktop</span>
                                </div>
                                
                                {step === 1 || step === 2 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                                        <div className="w-full">
                                            <ProductGallery 
                                                images={formData.images} 
                                                productName={formData.name || "Nom du produit"} 
                                            />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wider">{(formData.brand || "MARQUE").toUpperCase()}</p>
                                            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 leading-tight">{formData.name || "Nom du produit"}</h1>
                                            
                                            <div className="mt-6 flex items-baseline gap-3 flex-wrap">
                                                <p className="text-4xl font-bold text-red-600">{finalPrice.toFixed(3).replace('.',',')} DT</p>
                                                {isPromo && (
                                                    <p className="text-2xl text-gray-400 line-through font-medium">{(formData.oldPrice || 0).toFixed(3).replace('.',',')} DT</p>
                                                )}
                                            </div>
                                            <p className="mt-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                {formData.description ? formData.description : "Description du produit..."}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Preview Step 3: Highlights Block */
                                    <div className="w-full">
                                        <div className="text-center mb-4 text-sm text-gray-400 uppercase">Aperçu du bloc éditorial</div>
                                        <ProductHighlights highlights={{
                                            title: formData.highlightsTitle,
                                            imageUrl: formData.highlightsImage,
                                            sections: formData.highlightsSections
                                        }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ name, label, value, onChange, type = 'text', as = 'input', options = [], required = false, readOnly = false }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {as === 'input' && <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} readOnly={readOnly} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 read-only:bg-gray-200 dark:read-only:bg-gray-800 read-only:text-gray-500" />}
        {as === 'textarea' && <textarea id={name} name={name} value={value} onChange={onChange} rows={6} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500" />}
        {as === 'select' && (
            <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500">
                <option value="">-- Sélectionnez --</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        )}
    </div>
);
