
import React, { useState, useEffect } from 'react';
import type { Review } from '../types';
import { StarIcon, UserIcon } from './IconComponents';
import { api } from '../utils/api';
import { useToast } from './ToastContext';

interface ReviewsSectionProps {
    targetId: number;
    targetType: 'product' | 'pack';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ targetId, targetType }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        
        const loadReviews = async () => {
            try {
                const data = await api.getReviews(targetType, targetId);
                setReviews(data);
            } catch (error) {
                console.error("Error loading reviews", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadReviews();
    }, [targetId, targetType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            const newReview = await api.createReview({
                targetId,
                targetType,
                rating,
                comment
            });
            setReviews([newReview, ...reviews]);
            setComment('');
            setRating(5);
            addToast("Merci pour votre avis !", "success");
        } catch (error: any) {
            addToast(error.message || "Erreur lors de l'envoi de l'avis", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    return (
        <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-8 text-center">Avis Clientèle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Summary */}
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                        <span className="text-6xl font-bold text-gray-900 dark:text-white font-serif">{averageRating}</span>
                        <div className="flex flex-col items-start">
                            <div className="flex text-yellow-400 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon key={star} className={`w-5 h-5 ${star <= Number(averageRating) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{reviews.length} avis</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                        Découvrez ce que nos clients pensent de ce produit. La transparence est au cœur de notre démarche qualité.
                    </p>
                </div>

                {/* Review Form */}
                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8">
                    {isLoggedIn ? (
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Laisser un avis</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Votre note</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <StarIcon className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Votre commentaire</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-rose-500 focus:border-rose-500 transition-shadow p-3 text-sm"
                                    placeholder="Partagez votre expérience..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-rose-600 dark:hover:bg-rose-400 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Envoi...' : 'Publier mon avis'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">Connectez-vous pour partager votre expérience.</p>
                            <a href="/#/login" className="inline-block border-b-2 border-rose-500 text-rose-600 font-bold pb-1 hover:text-rose-700 transition-colors">
                                Se connecter
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews List */}
            <div className="mt-12 space-y-8">
                {isLoading ? (
                    <div className="text-center text-gray-500">Chargement des avis...</div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0 animate-fadeIn">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{review.userName}</p>
                                        <div className="flex text-yellow-400 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed pl-13 ml-13 md:ml-14 text-sm">
                                {review.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">Soyez le premier à donner votre avis !</p>
                )}
            </div>
        </div>
    );
};
