import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setShowPrompt(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Download className="text-brand-green" />
                <span className="font-bold text-sm">Instalar NoToxLabel</span>
            </div>
            <button
                onClick={() => setShowPrompt(false)}
                className="text-gray-400"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default InstallPrompt;
