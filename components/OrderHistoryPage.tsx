
import React, { useState, useMemo, useEffect } from 'react';
import type { Order } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ShoppingBagIcon, CalendarIcon, SearchIcon, ChevronRightIcon } from './IconComponents';

interface OrderHistoryPageProps {
    orders: Order[];
    onNavigateHome: () => void;
    onNavigateToProfile: () => void;
    onNavigateToOrderDetail: (orderId: string) => void;
}

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statusClasses = {
        'Livrée': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Expédiée': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Annulée': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    };
    return <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const OrderHistoryCard: React.FC<{ order: Order; onNavigateToOrderDetail: (orderId: string) => void; }> = ({ order, onNavigateToOrderDetail }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer" onClick={() => onNavigateToOrderDetail(order.id)}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-grow">
                    <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">Commande <span className="font-mono text-gray-500">#{order.id}</span></h3>
                        <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(order.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                
                <div className="flex items-center gap-8 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700 pt-4 sm:pt-0 sm:pl-8">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Articles</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{order.itemCount}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total</p>
                        <p className="font-bold text-rose-600">{order.total.toFixed(3)} DT</p>
                    </div>
                    <div className="hidden sm:block text-gray-300">
                        <ChevronRightIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};


export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, onNavigateHome, onNavigateToProfile, onNavigateToOrderDetail }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');

    useEffect(() => {
        document.title = `Mes Commandes - Cosmetics Shop`;
    }, []);

    const filteredOrders = useMemo(() => {
        return orders
            .filter(o => filterStatus === 'all' || o.status === filterStatus)
            .filter(o => 
                o.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [orders, searchTerm, filterStatus]);

    const orderStatuses: Order['status'][] = ['En attente', 'Expédiée', 'Livrée', 'Annulée'];

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Breadcrumb items={[{ name: 'Accueil', onClick: onNavigateHome }, { name: 'Mon Compte', onClick: onNavigateToProfile }, { name: 'Mes Commandes' }]} />
                </div>

                <header className="mb-10">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Mes Commandes</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Suivez l'état de vos dernières commandes de beauté.</p>
                </header>
                
                <div className="bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Rechercher une commande..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none rounded-lg py-3 pl-10 pr-3 text-sm focus:ring-0 placeholder:text-gray-400"
                        />
                    </div>
                    <div className="h-px md:h-auto md:w-px bg-gray-100 dark:bg-gray-800"></div>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                        className="bg-transparent border-none py-3 pl-3 pr-8 text-sm focus:ring-0 text-gray-600 dark:text-gray-300 font-medium cursor-pointer"
                    >
                        <option value="all">Tous les statuts</option>
                        {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                
                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map(order => (
                            <OrderHistoryCard key={order.id} order={order} onNavigateToOrderDetail={onNavigateToOrderDetail} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBagIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Aucune commande trouvée</h2>
                        <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">Vous n'avez pas encore passé de commande ou aucune commande ne correspond à votre recherche.</p>
                        <button onClick={onNavigateHome} className="mt-8 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs py-3 px-8 rounded-full hover:bg-rose-600 transition-colors">
                            Découvrir nos produits
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
