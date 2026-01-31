import React, { useState, useEffect, useContext, createContext } from 'react';
import * as supabase from '../services/supabase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Auth User
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('notoxlabel_user') || localStorage.getItem('rotulimpo_user');
        return saved ? JSON.parse(saved) : null;
    });

    // Profile Data (credits, gamification, history)
    const [profile, setProfile] = useState({
        credits: 3,
        xp: 0,
        level: 1,
        streak: 0,
        badges: [],
        referral_code: '',
        onboarding_completed: false,
        evolution: [],
        clean_habit_score: 0,
        subscription_plan: 'free', // 'free' | 'pro' | 'admin'
        coupons: [] // { code, credits, type: 'influencer' }
    });

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const isDemo = user?.id === 'demo-admin';

    // 1. Initial Load from Supabase
    useEffect(() => {
        const loadInitialData = async () => {
            // Always try to restore session if not in demo mode
            if (!isDemo && supabase.isSupabaseConfigured()) {
                const sessionUser = supabase.getCurrentUser();

                // If we have a user in state or local storage, verify profile
                if (user || sessionUser) {
                    const userId = user?.id || sessionUser?.id;
                    if (!userId) return;

                    setLoading(true);
                    try {
                        const sbProfile = await supabase.getProfile(userId);

                        if (sbProfile) {
                            setProfile(sbProfile);

                            // Sync User Metadata Key: Name
                            // If Supabase profile has a name but the Auth user metadata is missing/stale, update it.
                            if (sbProfile.name && (!user?.name || user.name !== sbProfile.name || !user?.user_metadata?.name)) {
                                const updatedUser = {
                                    ...(user || sessionUser),
                                    name: sbProfile.name,
                                    user_metadata: { ...(user?.user_metadata || {}), name: sbProfile.name }
                                };
                                setUser(updatedUser);
                                localStorage.setItem('notoxlabel_user', JSON.stringify(updatedUser)); // Update local persistence
                            }
                        } else {
                            // Create initial profile if it doesn't exist
                            const initialProfile = {
                                name: user?.user_metadata?.name || '',
                                credits: 3,
                                xp: 0,
                                level: 1,
                                streak: 0,
                                // Generate a robust referral code
                                referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                                badges: [],
                                onboarding_completed: false
                            };

                            // Only create if we have a valid ID
                            if (userId) {
                                await supabase.createProfile(userId, initialProfile);
                                setProfile({ ...initialProfile, id: userId });
                            }
                        }

                        // Ensure referral_code exists for existing profiles (Migration fix)
                        if (sbProfile && !sbProfile.referral_code) {
                            const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                            await supabase.updateProfile(userId, { referral_code: newCode });
                            setProfile(prev => ({ ...prev, referral_code: newCode }));
                        }

                        const sbHistory = await supabase.getScanHistory(userId);
                        const formattedHistory = sbHistory.map(item => ({ ...item.data, id: item.id, date: item.created_at }));

                        // Migration Logic: If SB history is empty but local has data, migrate it
                        if (formattedHistory.length === 0) {
                            const localHistory = JSON.parse(localStorage.getItem('notoxlabel_history') || '[]');
                            if (localHistory.length > 0) {
                                console.log("[NoToxLabel] Migrating local history to Supabase...");
                                for (const scan of localHistory) {
                                    await supabase.addScan(userId, scan);
                                }
                                const refreshedHistory = await supabase.getScanHistory(userId);
                                setHistory(refreshedHistory.map(item => ({ ...item.data, id: item.id, date: item.created_at })));
                            } else {
                                setHistory([]);
                            }
                        } else {
                            setHistory(formattedHistory);
                        }
                    } catch (err) {
                        console.error("Supabase Load Error:", err);
                        // Do NOT wipe local state on error, keep what we have in memory/localstorage
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            } else if (isDemo || !supabase.isSupabaseConfigured()) {
                // Load from LocalStorage for Demo/Offline (with legacy fallback)
                const savedProfile = localStorage.getItem('notoxlabel_profile') || localStorage.getItem('rotulimpo_profile');
                if (savedProfile) setProfile(JSON.parse(savedProfile));

                const savedHistory = localStorage.getItem('notoxlabel_history') || localStorage.getItem('rotulimpo_history');
                if (savedHistory) setHistory(JSON.parse(savedHistory));

                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [user, isDemo]);

    // 2. Local Storage Sync (Backup / Demo)
    useEffect(() => {
        if (isDemo || !supabase.isSupabaseConfigured()) {
            localStorage.setItem('notoxlabel_profile', JSON.stringify(profile));
        }
    }, [profile, isDemo]);

    useEffect(() => {
        if (isDemo || !supabase.isSupabaseConfigured()) {
            localStorage.setItem('notoxlabel_history', JSON.stringify(history));
        }
    }, [history, isDemo]);

    // 3. Actions
    const updateUser = async (data) => {
        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);

        // Sync name and photo to user state if they changed
        if (data.name || data.photoURL) {
            const updatedUser = { ...user };
            if (data.name) updatedUser.name = data.name;
            if (data.photoURL) updatedUser.photoURL = data.photoURL;
            setUser(updatedUser);
            localStorage.setItem('notoxlabel_user', JSON.stringify(updatedUser));
        }

        if (user && !isDemo && supabase.isSupabaseConfigured()) {
            await supabase.updateProfile(user.id, data);
        }
    };

    const updateEvolution = async (metrics) => {
        const newEntry = {
            ...metrics,
            date: new Date().toISOString()
        };
        const updatedEvolution = [...(profile.evolution || []), newEntry];
        const updates = { evolution: updatedEvolution };

        setProfile(prev => ({ ...prev, ...updates }));

        if (user && !isDemo && supabase.isSupabaseConfigured()) {
            await supabase.updateProfile(user.id, updates);
        }
    };

    const addXp = async (amount) => {
        const newXp = profile.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;

        const updates = { xp: newXp, level: newLevel };
        setProfile(prev => ({ ...prev, ...updates }));

        if (user && !isDemo && supabase.isSupabaseConfigured()) {
            await supabase.updateProfile(user.id, updates);
        }
    };

    const addCredits = async (amount) => {
        const newCredits = profile.credits + amount;
        setProfile(prev => ({ ...prev, credits: newCredits }));

        if (user && !isDemo && supabase.isSupabaseConfigured()) {
            await supabase.updateProfile(user.id, { credits: newCredits });
        }
    };

    const deductCredit = async () => {
        const newCredits = Math.max(0, profile.credits - 1);
        setProfile(prev => ({ ...prev, credits: newCredits }));

        if (user && !isDemo && supabase.isSupabaseConfigured()) {
            await supabase.updateProfile(user.id, { credits: newCredits });
        }
    };

    const addScanToHistory = async (scanResult) => {
        const newScan = {
            ...scanResult,
            date: new Date().toISOString()
        };

        // UI Update (Optimistic)
        setHistory(prev => [newScan, ...prev]);

        // Supabase Save
        if (user && !isDemo && supabase.isSupabaseConfigured()) {
            const result = await supabase.addScan(user.id, scanResult);
            // Refresh history to get the real DB ID
            const sbHistory = await supabase.getScanHistory(user.id);
            const formattedHistory = sbHistory.map(item => ({ ...item.data, id: item.id, date: item.created_at }));
            setHistory(formattedHistory);

            // Calculate Clean Habit Score (avg of last 10)
            if (formattedHistory.length > 0) {
                const last10 = formattedHistory.slice(0, 10);
                const avg = last10.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / last10.length;
                updateUser({ clean_habit_score: Number(avg.toFixed(1)) });
            }
        }

        // Badge Logic
        const badges = [...profile.badges];
        let bonusXp = 0;

        if (history.length === 0 && !badges.includes('first_scan')) {
            badges.push('first_scan');
            bonusXp += 50;
            alert("🏆 Conquista Desbloqueada: Primeira Análise!");
        }

        if (history.length === 9 && !badges.includes('10_scans')) {
            badges.push('10_scans');
            bonusXp += 100;
            alert("🏆 Conquista Desbloqueada: 10 Produtos Analisados!");
        }

        if (bonusXp > 0) {
            const updates = { badges, xp: profile.xp + bonusXp };
            setProfile(prev => ({ ...prev, ...updates }));
            if (user && !isDemo && supabase.isSupabaseConfigured()) {
                await supabase.updateProfile(user.id, updates);
            }
        }
    };

    const isAdminUser = user?.email === 'admin@notoxlabel.com.br';
    const isPro = profile.subscription_plan === 'pro' || profile.subscription_plan === 'admin' || profile.is_professional || isAdminUser;

    // Admin gets unlimited (999) credits for testing
    const currentCredits = isAdminUser ? 999 : profile.credits;

    const visibleHistory = isPro ? history : history.slice(0, 5);

    const applyCoupon = async (code) => {
        // Mock coupon logic for influencers
        const validCoupons = {
            'HEALTHY50': { credits: 50, plan: 'free' },
            'BIOHACKER_PRO': { credits: 100, plan: 'pro' },
            'INFLUENCER_999': { credits: 999, plan: 'pro' }
        };

        const coupon = validCoupons[code.toUpperCase()];
        if (coupon) {
            const updates = {
                credits: profile.credits + coupon.credits,
                subscription_plan: coupon.plan === 'pro' ? 'pro' : profile.subscription_plan
            };
            await updateUser(updates);
            alert(`🎟️ Cupom Ativado! +${coupon.credits} créditos adicionados.`);
            return true;
        }
        throw new Error('CUPOM_INVALIDO');
    };

    const setCustomReferralCode = async (newCode) => {
        if (!newCode || newCode.length < 4) throw new Error('CÓDIGO_MUITO_CURTO');

        const isUnique = await supabase.checkReferralCodeUnique(newCode);
        if (!isUnique) throw new Error('CÓDIGO_JÁ_EXISTE');

        await updateUser({ referral_code: newCode.toUpperCase() });
        return true;
    };

    const value = {
        user,
        setUser,
        updateUser,
        profile,
        isPro,
        gamification: {
            xp: profile.xp,
            level: profile.level,
            streak: profile.streak,
            badges: profile.badges
        },
        addXp,
        credits: currentCredits,
        addCredits,
        deductCredit: isAdminUser ? () => { } : deductCredit, // No deduction for admin
        history: visibleHistory,
        fullHistoryCount: history.length,
        addScanToHistory,
        updateEvolution,
        applyCoupon,
        setCustomReferralCode,
        referralCode: profile.referral_code,
        loading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
