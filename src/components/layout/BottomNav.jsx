import React from 'react';
import { Home, Search, User, Gift, Trophy, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: Home, label: 'Explorar' },
        { path: '/scan', icon: Search, label: 'Escanear' },
        { path: '/community', icon: Users, label: 'Comunidade' },
        { path: '/referral', icon: Gift, label: 'Indicar' },
        { path: '/profile', icon: User, label: 'Perfil' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center z-50 pt-3 pb-8 px-2">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 transition-all relative ${isActive(item.path) ? 'text-[#FF385C]' : 'text-gray-400'
                        }`}
                >
                    <item.icon
                        size={24}
                        strokeWidth={isActive(item.path) ? 2.5 : 2}
                        className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : ''}`}
                    />
                    <span className={`text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isActive(item.path) ? 'opacity-100 mt-1' : 'opacity-60'
                        }`}>
                        {item.label}
                    </span>

                    {isActive(item.path) && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute -bottom-2 w-1 h-1 bg-[#FF385C] rounded-full"
                        />
                    )}
                </Link>
            ))}
        </div>
    );
};

export default BottomNav;
