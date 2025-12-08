
import React from 'react';
import { SparklesIcon } from './IconComponents';
import type { VirtualTryOnConfig } from '../types';

interface VirtualTryOnSectionProps {
    config?: VirtualTryOnConfig;
}

export const VirtualTryOnSection: React.FC<VirtualTryOnSectionProps> = ({ config }) => {
    const title = config?.title || "Virtual Try-On";
    const description = config?.description || "Essayez rouges à lèvres, fards à joues et plus encore pour découvrir votre nouvelle teinte préférée.";
    const buttonText = config?.buttonText || "Découvrir maintenant";
    const imageLeft = config?.imageLeft || "https://images.unsplash.com/photo-1625093742435-09869634721c?q=80&w=600&auto=format&fit=crop";
    const imageRight = config?.imageRight || "https://images.unsplash.com/photo-1591360236480-943049ceab63?q=80&w=600&auto=format&fit=crop";
    const link = config?.link || "#";

    return (
        <section className="relative w-full bg-white dark:bg-gray-900 py-16 md:py-24 overflow-hidden my-16 border-t border-rose-50 dark:border-gray-800">
            {/* Background Texture/Gradient (Subtle) */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-50/30 via-white to-rose-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 opacity-50 pointer-events-none"></div>

            {/* Decorative Images (Floating Tubes Effect) */}
            {/* Left Image */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 md:translate-x-0 w-1/3 md:w-1/4 h-full max-w-[300px] pointer-events-none opacity-90">
                 <img
                    src={imageLeft}
                    alt="Left Decorative Element"
                    className="w-full h-full object-contain object-left scale-125 md:scale-100 rotate-12 transform origin-center transition-transform duration-[10s] hover:rotate-6"
                />
            </div>
            
            {/* Right Image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 md:translate-x-0 w-1/3 md:w-1/4 h-full max-w-[300px] pointer-events-none opacity-90">
                <img
                    src={imageRight}
                    alt="Right Decorative Element"
                    className="w-full h-full object-contain object-right scale-125 md:scale-100 -rotate-12 transform origin-center transition-transform duration-[10s] hover:-rotate-6"
                />
            </div>

            {/* Centered Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#C58F8F] dark:text-rose-300 mb-6 uppercase tracking-widest drop-shadow-sm">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-10 font-light leading-relaxed">
                    {description}
                </p>
                
                <a 
                    href={link}
                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Shine Effect Animation */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-[-20deg]"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-3 text-white">
                        <span className="font-bold uppercase tracking-[0.2em] text-xs">{buttonText}</span>
                        <SparklesIcon className="w-5 h-5 transition-transform duration-700 group-hover:rotate-180 group-hover:scale-110" />
                    </div>
                </a>
            </div>
        </section>
    );
};
