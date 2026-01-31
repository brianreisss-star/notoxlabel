import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center int-p-6">
            <div className="text-6xl mb-4">🤔</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Página não encontrada</h1>
            <p className="text-gray-500 mb-6">Parece que você se perdeu no supermercado.</p>
            <Link to="/" className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold">
                Voltar ao Início
            </Link>
        </div>
    );
};

export default NotFound;
