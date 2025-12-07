
import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    label?: string;
    className?: string;
}

// Couleurs dominantes de l'application (Brand Palette)
const BRAND_COLORS = [
    '#e11d48', // Rose 600 (Boutons Primary)
    '#f43f5e', // Rose 500
    '#111827', // Gray 900 (Titres Dark)
    '#4b5563', // Gray 600 (Textes)
    '#d4af37', // Gold (Luxe)
    '#000000', // Noir
    '#ffffff', // Blanc
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label, className }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleInput();
        if (editorRef.current) editorRef.current.focus();
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        execCmd('foreColor', e.target.value);
    };

    return (
        <div className={`w-full ${className}`}>
            {label && <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</label>}
            
            <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-rose-500">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button type="button" onClick={() => execCmd('bold')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-xs w-6 h-6 flex items-center justify-center">B</button>
                    <button type="button" onClick={() => execCmd('italic')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 italic text-xs w-6 h-6 flex items-center justify-center font-serif">I</button>
                    <button type="button" onClick={() => execCmd('underline')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 underline text-xs w-6 h-6 flex items-center justify-center">U</button>
                    
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    
                    {/* Brand Colors Presets */}
                    <div className="flex items-center gap-1">
                        {BRAND_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => execCmd('foreColor', color)}
                                className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>

                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* Custom Color Picker */}
                    <div className="relative group cursor-pointer p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => colorInputRef.current?.click()} title="Couleur personnalisée">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-blue-500 border border-gray-400"></div>
                        <input 
                            ref={colorInputRef}
                            type="color" 
                            className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0"
                            onChange={handleColorChange}
                        />
                    </div>
                </div>

                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onBlur={handleInput}
                    className="p-3 min-h-[60px] max-h-[150px] overflow-y-auto outline-none text-sm text-gray-800 dark:text-white font-sans"
                    style={{ whiteSpace: 'pre-wrap' }}
                />
            </div>
        </div>
    );
};
