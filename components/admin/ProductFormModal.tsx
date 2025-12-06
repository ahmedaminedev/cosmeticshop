
import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Category } from '../../types';
import { XMarkIcon, PlusIcon, TrashIcon, InformationCircleIcon, CartIcon, HeartIcon, PhotoIcon, MinusIcon, StarIcon, CheckCircleIcon, SparklesIcon } from '../IconComponents';
import { ImageInput } from '../ImageInput';
import { useToast } from '../ToastContext'; 
import { ProductGallery } from '../ProductGallery';
import { ProductHighlights } from '../ProductHighlights';

// Icônes spécifiques pour l'aperçu (clones de ProductDetailPage)
const VeganIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18c-4.418 0-8 3.582-8 8s3.582 8 8 8m0-16c4.418 0 8 3.582 8 8s-3.582 8-8 8m-4-6a4 4 0 008 0" />
    </svg>
);

const CrueltyFreeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.318l7.682-7.636a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Omit<Product, 'id'>) => void;
    product: Product | null;
    categories: Category[];
}

type Specification = { name: string; value: string; };
type Tab = 'description' | 'ingredients' | 'shipping';

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product, categories }) => {
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [previewTab, setPreviewTab] = useState<Tab>('description'); // State for Preview Tabs
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
                    {/* LEFT COLUMN: FORM */}
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
                                    <h3 className="font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Composition / Ingrédients</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-500">Ajoutez ici la liste des ingrédients ou caractéristiques techniques.</span>
                                        <button type="button" onClick={addSpec} className="text-xs bg-green-100 text-green-700 font-bold py-1 px-2 rounded hover:bg-green-200">
                                            + Ajouter
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.specifications.map((spec, index) => (
                                            <div key={index} className="grid grid-cols-10 gap-2 items-center bg-gray-50 dark:bg-gray-700/30 p-2 rounded-md">
                                                <input type="text" placeholder="Type (ex: Ingrédient)" value={spec.name} onChange={(e) => handleSpecChange(index, 'name', e.target.value)} className="col-span-4 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm" />
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

                    {/* RIGHT COLUMN: LIVE PREVIEW (MATCHING FRONT OFFICE) */}
                    <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-100 dark:bg-gray-900 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
                        <div className="max-w-screen-xl mx-auto h-full flex flex-col">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:p-8 border border-gray-200 dark:border-gray-700 flex-grow">
                                <div className="flex items-center justify-between mb-6 border-b pb-4 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aperçu en direct (Front Office)</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Mode Desktop</span>
                                </div>
                                
                                {step === 1 || step === 2 ? (
                                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                                        {/* Left: Gallery */}
                                        <div className="w-full lg:w-[55%]">
                                            <ProductGallery 
                                                images={formData.images} 
                                                productName={formData.name || "Nom du produit"} 
                                            />
                                            {/* Visual Reassurance Clones */}
                                            <div className="hidden lg:grid mt-10 grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                                                <div className="text-center group">
                                                    <div className="w-12 h-12 mx-auto bg-rose-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-400 mb-3 transition-colors group-hover:bg-rose-100">
                                                        <SparklesIcon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Authentique</span>
                                                </div>
                                                <div className="text-center group">
                                                    <div className="w-12 h-12 mx-auto bg-rose-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-400 mb-3 transition-colors group-hover:bg-rose-100">
                                                        <VeganIcon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Naturel</span>
                                                </div>
                                                <div className="text-center group">
                                                    <div className="w-12 h-12 mx-auto bg-rose-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-400 mb-3 transition-colors group-hover:bg-rose-100">
                                                        <CrueltyFreeIcon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Cruelty Free</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Product Info */}
                                        <div className="w-full lg:w-[45%]">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em]">
                                                        {formData.brand || "MARQUE"}
                                                    </h2>
                                                    <div className="flex items-center gap-2 group cursor-pointer">
                                                        <div className="flex items-center text-gold-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg key={i} className="w-3.5 h-3.5 fill-current text-yellow-400" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-400 border-b border-dashed border-gray-300">(0 avis)</span>
                                                    </div>
                                                </div>

                                                <h1 className="text-3xl lg:text-4xl font-serif font-medium text-gray-900 dark:text-white leading-tight">
                                                    {formData.name || "Nom du produit"}
                                                </h1>

                                                <div className="flex items-baseline gap-4 pt-2">
                                                    <p className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white">
                                                        {finalPrice.toFixed(3)} <span className="text-base lg:text-lg font-normal text-gray-500">TND</span>
                                                    </p>
                                                    {isPromo && (
                                                        <p className="text-base lg:text-lg text-gray-400 line-through font-light">
                                                            {(formData.oldPrice || 0).toFixed(3)} TND
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed mt-6">
                                                <p>{formData.description ? formData.description.substring(0, 150) + '...' : "Un essentiel beauté pour sublimer votre quotidien."}</p>
                                            </div>

                                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 mt-6">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-full px-1 py-1 w-32 justify-between border border-gray-200 dark:border-gray-600">
                                                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 text-gray-600 shadow-sm"><MinusIcon className="w-3 h-3" /></button>
                                                        <span className="font-serif font-bold text-lg">1</span>
                                                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 text-gray-600 shadow-sm"><PlusIcon className="w-3 h-3" /></button>
                                                    </div>
                                                    <button className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-serif font-bold uppercase tracking-widest text-sm py-4 rounded-full hover:bg-rose-600 transition-all shadow-lg flex items-center justify-center gap-3">
                                                        <span>Ajouter au sac</span>
                                                        <span className="w-1 h-1 bg-current rounded-full"></span>
                                                        <span>{finalPrice.toFixed(3)} TND</span>
                                                    </button>
                                                    <button className="p-4 rounded-full border border-gray-200 text-gray-400">
                                                        <HeartIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-medium">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    En stock - Expédition sous 24h
                                                </div>
                                            </div>

                                            {/* Tabs Logic within Preview */}
                                            <div className="pt-8 mt-4">
                                                <div className="flex border-b border-gray-100 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
                                                    {[{id: 'description', label: 'Détails'}, {id: 'ingredients', label: 'Composition'}, {id: 'shipping', label: 'Livraison'}].map((tab) => (
                                                        <button
                                                            key={tab.id}
                                                            onClick={(e) => { e.preventDefault(); setPreviewTab(tab.id as Tab); }}
                                                            className={`pb-3 px-4 text-xs lg:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap relative ${previewTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            {tab.label}
                                                            {previewTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white"></span>}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="min-h-[100px] text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                                                    {previewTab === 'description' && (
                                                        <>
                                                            <p className="mb-4 whitespace-pre-wrap">{formData.description || "Description détaillée..."}</p>
                                                            <p className="text-xs text-gray-400">REF: PREVIEW-123</p>
                                                        </>
                                                    )}
                                                    
                                                    {previewTab === 'ingredients' && (
                                                        (formData.specifications && formData.specifications.filter(s => s.name && s.value).length > 0) ? (
                                                            <ul className="space-y-2">
                                                                {formData.specifications.filter(s => s.name && s.value).map((spec, idx) => (
                                                                    <li key={idx} className="flex justify-between border-b border-gray-50 dark:border-gray-800 pb-2">
                                                                        <span className="text-xs uppercase tracking-wide text-gray-500">{spec.name}</span>
                                                                        <span className="font-serif italic">{spec.value}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : <p className="italic text-gray-400">Aucune caractéristique technique ajoutée.</p>
                                                    )}

                                                    {previewTab === 'shipping' && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /> Livraison offerte dès 300 DT</div>
                                                            <div className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /> Expédition 24/48h</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
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
