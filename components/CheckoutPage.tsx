
import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { 
    DeliveryTruckIcon, 
    LockIcon,
    MailIcon,
    PhoneIcon,
    LocationIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    HomeIcon,
    VisaIcon,
    MastercardIcon,
    PencilIcon,
    StorefrontIcon
} from './IconComponents';
import type { CartItem, CustomerInfo, Store } from '../types';
import { api } from '../utils/api';

interface CheckoutPageProps {
    onNavigateHome: () => void;
    onOrderComplete: (cartItems: CartItem[], customerInfo: CustomerInfo, paymentId?: string) => void;
    onNavigateToPaymentGateway: (orderId: string, total: number, customerInfo: CustomerInfo) => void;
    stores: Store[];
}

const FormInputWithIcon: React.FC<{ name: string; label: string; icon: React.ReactNode; type?: string; optional?: boolean; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ name, label, icon, type = 'text', optional, value, onChange }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
        </div>
        <input 
            type={type} 
            id={name} 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={`${label}${optional ? ' (facultatif)' : ''}`}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 placeholder:text-gray-400"
            aria-label={label}
        />
    </div>
);


const CheckoutStep: React.FC<{
    stepNumber: number;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
    summary?: React.ReactNode;
    onHeaderClick: () => void;
    children: React.ReactNode;
    isDisabled: boolean;
}> = ({ stepNumber, title, isActive, isCompleted, summary, onHeaderClick, children, isDisabled }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 mb-4 ${isActive ? 'shadow-md ring-1 ring-rose-100 dark:ring-gray-600' : ''} ${isDisabled ? 'opacity-60 grayscale' : ''}`}>
            <div 
                className={`flex justify-between items-center p-5 ${isCompleted && !isDisabled ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750' : ''}`}
                onClick={isDisabled ? undefined : onHeaderClick}
                aria-expanded={isActive}
            >
                <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${
                        isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-rose-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>
                        {isCompleted ? '✓' : stepNumber}
                    </div>
                    <h2 className={`text-base lg:text-lg font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{title}</h2>
                </div>
                {isCompleted && !isActive && (
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block truncate max-w-[150px]">{summary}</div>
                        <button className="text-rose-600 hover:text-rose-700 transition-colors text-xs font-semibold uppercase tracking-wider">
                            Modifier
                        </button>
                    </div>
                )}
            </div>
            {isActive && (
                <div className="px-5 pb-6 animate-fadeIn">
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};


const OrderSummary: React.FC<{ shippingCost: number; fiscalStamp: number }> = ({ shippingCost, fiscalStamp }) => {
    const { cartItems, cartTotal } = useCart();
    const [isExpandedOnMobile, setIsExpandedOnMobile] = useState(false);

    const savings = React.useMemo(() => {
        const oldTotal = cartItems.reduce((total, item) => {
            const oldPrice = 'oldPrice' in item.originalItem && item.originalItem.oldPrice ? item.originalItem.oldPrice : item.price;
            return total + (oldPrice * item.quantity);
        }, 0);
        return oldTotal - cartTotal;
    }, [cartItems, cartTotal]);
    
    const total = cartTotal + shippingCost + fiscalStamp;

    return (
        <aside className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:sticky lg:top-24">
                 <div className="flex justify-between items-center cursor-pointer lg:cursor-auto" onClick={() => setIsExpandedOnMobile(!isExpandedOnMobile)}>
                    <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-white">Récapitulatif</h2>
                    <div className="lg:hidden">
                        <button className="text-rose-600 font-semibold flex items-center gap-1 text-sm">
                            <span>{total.toFixed(3)} DT</span>
                            {isExpandedOnMobile ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className={`mt-6 ${isExpandedOnMobile ? 'block' : 'hidden'} lg:block`}>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 border-b border-gray-100 dark:border-gray-700 pb-4 custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-start gap-3">
                                <div className="relative flex-shrink-0">
                                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-contain rounded-md border border-gray-100 dark:border-gray-700 bg-gray-50"/>
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{item.name}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{(item.price * item.quantity).toFixed(3)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Sous-total</span>
                            <span>{cartTotal.toFixed(3)} DT</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Livraison</span>
                            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>{shippingCost > 0 ? shippingCost.toFixed(3) + ' DT' : 'Gratuite'}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Timbre Fiscal</span>
                            <span>{fiscalStamp.toFixed(3)} DT</span>
                        </div>
                         {savings > 0.001 && (
                             <div className="flex justify-between text-green-600 dark:text-green-400 text-xs mt-2 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <span className="font-semibold">Économies réalisées</span>
                                <span className="font-bold">-{savings.toFixed(3)} DT</span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex justify-between items-end">
                            <span className="font-bold text-base text-gray-900 dark:text-white">Total à payer</span>
                            <span className="font-serif font-bold text-xl text-rose-600">{total.toFixed(3)} <span className="text-sm font-sans font-normal text-gray-500">DT</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const ShippingOptionCard: React.FC<{id: string; title: string; description: string; selectedOption: string; onSelect: (id: string) => void; icon?: React.ReactNode; price?: string }> = ({ id, title, description, selectedOption, onSelect, icon, price }) => {
    const isSelected = id === selectedOption;
    return (
        <label htmlFor={id} className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-200 ${isSelected ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10 shadow-sm ring-1 ring-rose-500' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300'}`}>
            <input type="radio" id={id} name="shipping-option" value={id} checked={isSelected} onChange={() => onSelect(id)} className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        {icon}
                        {title}
                    </span>
                    {price && <span className={`text-xs font-bold ${price === 'gratuit' ? 'text-green-600 uppercase tracking-wide' : 'text-gray-700 dark:text-gray-300'}`}>{price}</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
        </label>
    );
};

const PaymentMethodSelector: React.FC<{ method: 'cod' | 'card'; selectedMethod: 'cod' | 'card'; onSelect: (method: 'cod' | 'card') => void; title: string; description: string; icons?: React.ReactNode; }> = ({ method, selectedMethod, onSelect, title, description, icons }) => {
    const isSelected = method === selectedMethod;
    return (
        <div className={`p-4 border rounded-xl transition-all duration-200 cursor-pointer ${isSelected ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10 ring-1 ring-rose-500' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300'}`} onClick={() => onSelect(method)}>
            <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-rose-600' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-rose-600 rounded-full"></div>}
                </div>
                <div className="flex-grow">
                    <div className="flex items-center gap-3 justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
                        {icons}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigateHome, onOrderComplete, stores }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState<CustomerInfo>({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        postalCode: '',
        city: '',
        country: 'Tunisia',
        phone: '',
    });
    const [shippingOption, setShippingOption] = useState('transporteur-tunisie');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('card');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    
    const { cartItems, clearCart, cartTotal } = useCart();
    const { addToast } = useToast(); 
    
    const isStorePickup = shippingOption.startsWith('store-');
    const SHIPPING_COST = isStorePickup ? 0 : (cartTotal >= 300 ? 0.000 : 7.000);
    const FISCAL_STAMP = 1.000;
    const finalTotal = cartTotal + SHIPPING_COST + FISCAL_STAMP;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep1 = () => {
        if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            addToast("Email invalide.", "error");
            return false;
        }
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            addToast("Nom et prénom requis.", "error");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
            addToast("Adresse incomplète.", "error");
            return false;
        }
        if (!formData.phone || !/^\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
            addToast("Téléphone invalide (8 chiffres).", "error");
            return false;
        }
        return true;
    };

    const handleNext = (step: number) => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setActiveStep(prev => Math.min(prev + 1, 4));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGoTo = (step: number) => {
        if (step < activeStep) setActiveStep(step);
    };

    const handleConfirmOrder = async () => {
        if (!validateStep1() || !validateStep2()) return;
        if (!termsAgreed) {
            addToast("Veuillez accepter les conditions.", "warning");
            return;
        }
        if (cartItems.length === 0) {
            addToast("Votre sac est vide.", "warning");
            return;
        }

        setIsProcessing(true);

        try {
            const orderId = 'ES' + Date.now().toString().slice(-8).toUpperCase();
            
            const newOrder = {
                id: orderId,
                customerName: `${formData.firstName} ${formData.lastName}`,
                date: new Date().toISOString(),
                total: finalTotal,
                status: 'En attente',
                itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                items: cartItems.map(item => ({
                    productId: parseInt(item.id.split('-')[1]),
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    imageUrl: item.imageUrl
                })),
                shippingAddress: {
                    type: 'Domicile',
                    street: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    isDefault: true
                },
                paymentMethod: paymentMethod === 'card' ? 'Carte Bancaire (Paymee)' : 'Paiement à la livraison'
            };

            await api.createOrder(newOrder);

            if (paymentMethod === 'cod') {
                clearCart();
                window.location.href = `/?payment=success&orderId=${orderId}`;
            } else if (paymentMethod === 'card') {
                const response = await api.initiatePayment({
                    orderId: orderId,
                    amount: finalTotal,
                    customerInfo: formData
                });
                if (response && response.payment_url) {
                    window.location.href = response.payment_url;
                } else {
                    throw new Error("Erreur paiement.");
                }
            }

        } catch (error: any) {
            console.error("Order Error:", error);
            addToast(error.message || "Erreur validation commande.", "error");
            setIsProcessing(false);
        }
    };

    const pickupStores = stores.filter(s => s.isPickupPoint);
    const selectedShippingTitle = shippingOption === 'transporteur-tunisie' 
        ? 'Transporteur Standard' 
        : `Retrait : ${stores.find(s => `store-${s.id}` === shippingOption)?.city || ''}`;

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans pb-20 lg:pb-0">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
            
            {/* Header Simplified */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={onNavigateHome} className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-rose-600 transition-colors">
                        <HomeIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">Retour Boutique</span>
                    </button>
                    <h1 className="text-lg font-serif font-bold text-gray-900 dark:text-white">Validation Commande</h1>
                    <div className="w-20"></div> {/* Spacer for center alignment */}
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Main Form Area */}
                    <main className="flex-grow max-w-3xl mx-auto lg:mx-0 w-full">
                        <CheckoutStep 
                            stepNumber={1} 
                            title="Informations" 
                            isActive={activeStep === 1} 
                            isCompleted={activeStep > 1} 
                            onHeaderClick={() => handleGoTo(1)} 
                            isDisabled={false}
                            summary={<span>{formData.email}</span>}
                        >
                            <div className="space-y-4">
                                <FormInputWithIcon name="email" label="Adresse e-mail" icon={<MailIcon className="w-5 h-5"/>} value={formData.email} onChange={handleInputChange} />
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormInputWithIcon name="firstName" label="Prénom" icon={<div />} value={formData.firstName} onChange={handleInputChange} />
                                    <FormInputWithIcon name="lastName" label="Nom" icon={<div />} value={formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6"><button onClick={() => handleNext(1)} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase text-xs py-3 px-8 rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors">Continuer</button></div>
                        </CheckoutStep>
                        
                        <CheckoutStep 
                            stepNumber={2} 
                            title="Livraison" 
                            isActive={activeStep === 2} 
                            isCompleted={activeStep > 2} 
                            onHeaderClick={() => handleGoTo(2)} 
                            isDisabled={activeStep < 2}
                            summary={<span>{formData.city}</span>}
                        >
                             <div className="space-y-4">
                                <FormInputWithIcon name="address" label="Adresse" icon={<LocationIcon className="w-5 h-5"/>} value={formData.address} onChange={handleInputChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInputWithIcon name="city" label="Ville" icon={<div />} value={formData.city} onChange={handleInputChange} />
                                    <FormInputWithIcon name="postalCode" label="Code Postal" icon={<div />} value={formData.postalCode} onChange={handleInputChange} />
                                </div>
                                <FormInputWithIcon name="phone" label="Téléphone" icon={<PhoneIcon className="w-5 h-5"/>} value={formData.phone} onChange={handleInputChange} />
                             </div>
                             <div className="flex justify-end mt-6"><button onClick={() => handleNext(2)} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase text-xs py-3 px-8 rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors">Continuer</button></div>
                        </CheckoutStep>
                        
                        <CheckoutStep 
                            stepNumber={3} 
                            title="Méthode" 
                            isActive={activeStep === 3} 
                            isCompleted={activeStep > 3} 
                            onHeaderClick={() => handleGoTo(3)} 
                            isDisabled={activeStep < 3}
                            summary={<span>{selectedShippingTitle}</span>}
                        >
                            <div className="space-y-3">
                                <ShippingOptionCard 
                                    id="transporteur-tunisie" 
                                    title="Livraison à Domicile" 
                                    description="Livraison rapide partout en Tunisie." 
                                    selectedOption={shippingOption} 
                                    onSelect={setShippingOption}
                                    icon={<DeliveryTruckIcon className="w-5 h-5 text-rose-500" />}
                                    price={cartTotal >= 300 ? 'gratuit' : '7.000 DT'}
                                />
                                
                                {pickupStores.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Points de retrait</h3>
                                        <div className="space-y-2">
                                            {pickupStores.map(store => (
                                                <ShippingOptionCard 
                                                    key={store.id}
                                                    id={`store-${store.id}`} 
                                                    title={`Magasin ${store.city}`} 
                                                    description={store.address}
                                                    selectedOption={shippingOption} 
                                                    onSelect={setShippingOption}
                                                    icon={<StorefrontIcon className="w-5 h-5 text-blue-500" />}
                                                    price="gratuit"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                             <div className="flex justify-end mt-6"><button onClick={() => handleNext(3)} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase text-xs py-3 px-8 rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors">Continuer</button></div>
                        </CheckoutStep>

                        <CheckoutStep 
                            stepNumber={4} 
                            title="Paiement" 
                            isActive={activeStep === 4} 
                            isCompleted={false} 
                            onHeaderClick={() => handleGoTo(4)} 
                            isDisabled={activeStep < 4}
                        >
                             <div className="space-y-3">
                                <PaymentMethodSelector 
                                    method="card"
                                    selectedMethod={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    title="Carte Bancaire"
                                    description="Payez en toute sécurité via Paymee."
                                    icons={
                                        <div className="flex items-center gap-1 opacity-80">
                                            <VisaIcon className="h-5" />
                                            <MastercardIcon className="h-5" />
                                        </div>
                                    }
                                />
                                <PaymentMethodSelector 
                                    method="cod"
                                    selectedMethod={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    title="Paiement à la livraison"
                                    description="Réglez votre commande en espèces à la réception."
                                />
                            </div>
                             <div className="mt-6 flex items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <input type="checkbox" id="terms" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 mt-0.5" />
                                <label htmlFor="terms" className="ml-3 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                                    Je confirme avoir lu et accepté les <a href="#" className="font-bold underline hover:text-rose-600">Conditions Générales de Vente</a>.
                                </label>
                            </div>
                             
                             {/* Mobile Sticky Button */}
                             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] lg:static lg:bg-transparent lg:border-none lg:shadow-none lg:p-0 z-50 lg:z-auto lg:mt-8">
                                 <div className="flex flex-col lg:flex-row lg:justify-end gap-3">
                                    <div className="lg:hidden flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-500">Total à payer</span>
                                        <span className="text-xl font-bold text-rose-600">{finalTotal.toFixed(3)} DT</span>
                                    </div>
                                    <button 
                                        onClick={handleConfirmOrder}
                                        disabled={!termsAgreed || isProcessing}
                                        className="w-full lg:w-auto bg-rose-600 text-white font-bold uppercase text-sm py-4 lg:py-3 px-10 rounded-full hover:bg-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                                    >
                                        <LockIcon className="w-4 h-4" />
                                        {isProcessing ? 'Traitement...' : 'Payer et Commander'}
                                    </button>
                                </div>
                            </div>
                        </CheckoutStep>

                    </main>
                    
                    <OrderSummary shippingCost={SHIPPING_COST} fiscalStamp={FISCAL_STAMP} />
                </div>
            </div>
        </div>
    );
};
