
import React from 'react';
import { DeliveryTruckIcon, SecurePaymentIcon, CustomerSupportIcon, GuaranteeIcon } from './IconComponents';
import type { TrustBadgeConfig } from '../types';

const TrustBadge: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="flex items-center space-x-4">
        <div className="text-red-600">{icon}</div>
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
    </div>
);

interface TrustBadgesProps {
    badges?: TrustBadgeConfig[];
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ badges }) => {
    // Default badges if none provided
    const defaultBadges = [
        { id: 1, title: "Livraison Rapide", subtitle: "Sur toute la Tunisie" },
        { id: 2, title: "Paiement Sécurisé", subtitle: "100% sécurisé" },
        { id: 3, title: "Service Client", subtitle: "A votre écoute 7j/7" },
        { id: 4, title: "Garantie", subtitle: "Produits authentiques" }
    ];

    const displayBadges = badges && badges.length > 0 ? badges : defaultBadges;

    // Map fixed icons to index
    const icons = [
        <DeliveryTruckIcon className="w-10 h-10" />,
        <SecurePaymentIcon className="w-10 h-10" />,
        <CustomerSupportIcon className="w-10 h-10" />,
        <GuaranteeIcon className="w-10 h-10" />
    ];

    return (
        <section className="my-8 py-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                {displayBadges.map((badge, index) => (
                    <TrustBadge 
                        key={badge.id || index}
                        icon={icons[index % icons.length]} 
                        title={badge.title} 
                        subtitle={badge.subtitle} 
                    />
                ))}
            </div>
        </section>
    );
};