/**
 * NoToxLabel - Supabase Client
 * Backend service for authentication and data persistence
 */

// Supabase configuration
// In production, use environment variables
const SUPABASE_URL = localStorage.getItem('notoxlabel_supabase_url') || localStorage.getItem('rotulimpo_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = localStorage.getItem('notoxlabel_supabase_key') || localStorage.getItem('rotulimpo_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

import { createClient } from '@supabase/supabase-js';

// Export the official client for advanced usage (like in AdminDashboard)
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

// Simple fetch wrapper for Supabase REST API
const supabaseFetch = async (endpoint, options = {}) => {
    if (!isSupabaseConfigured()) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
    }

    const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
};

// Auth functions using Supabase Auth API
const authFetch = async (endpoint, body) => {
    if (!isSupabaseConfigured()) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
    }

    const url = `${SUPABASE_URL}/auth/v1${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || data.error);
    }
    return data;
};

// ==================== AUTH ====================

export const signUp = async (email, password, name, additionalData = {}) => {
    // Demo Mode Bypass
    if (email === 'admin@notoxlabel.com.br') {
        const demoUser = { id: 'demo-admin', email, user_metadata: { name: 'Admin NoToxLabel', ...additionalData } };
        localStorage.setItem('notoxlabel_user', JSON.stringify(demoUser));
        return { user: demoUser };
    }

    const data = await authFetch('/signup', {
        email,
        password,
        data: { name, ...additionalData }
    });

    if (data.user) {
        localStorage.setItem('notoxlabel_token', data.access_token);
        localStorage.setItem('notoxlabel_user', JSON.stringify(data.user));
    }

    return data;
};

export const signIn = async (email, password) => {
    // Hardcoded Admin Bypass for Testing
    if (email === 'admin@notoxlabel.com.br' && password === 'admin123') {
        const demoUser = { id: 'demo-admin', email, user_metadata: { name: 'Admin NoToxLabel' } };
        localStorage.setItem('notoxlabel_user', JSON.stringify(demoUser));
        return { user: demoUser, access_token: 'demo-token' };
    }

    const data = await authFetch('/token?grant_type=password', {
        email,
        password
    });

    if (data.access_token) {
        localStorage.setItem('notoxlabel_token', data.access_token);
        localStorage.setItem('notoxlabel_user', JSON.stringify(data.user));
    }

    return data;
};

export const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
    }

    // Redirect to Google OAuth
    const redirectUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
};

export const signInWithFacebook = async () => {
    if (!isSupabaseConfigured()) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
    }

    // Redirect to Facebook OAuth
    const redirectUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`.replace('provider=google', 'provider=facebook');
};

export const signOut = async () => {
    localStorage.removeItem('notoxlabel_token');
    localStorage.removeItem('notoxlabel_user');
    localStorage.removeItem('rotulimpo_token');
    localStorage.removeItem('rotulimpo_user');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('notoxlabel_user') || localStorage.getItem('rotulimpo_user');
    return userStr ? JSON.parse(userStr) : null;
};

export const getAuthToken = () => {
    return localStorage.getItem('notoxlabel_token') || localStorage.getItem('rotulimpo_token');
};

// ==================== PROFILES ====================

export const getProfile = async (userId) => {
    try {
        const data = await supabaseFetch(`/profiles?id=eq.${userId}&select=*`);
        return data[0] || null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const updateProfile = async (userId, profileData) => {
    // Ensure we don't try to update the ID
    const { id, ...updates } = profileData;
    return supabaseFetch(`/profiles?id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            ...updates
            // updated_at removed to fix "column not found" error
        })
    });
};

export const checkReferralCodeUnique = async (code) => {
    try {
        const data = await supabaseFetch(`/profiles?referral_code=eq.${code.toUpperCase()}&select=id`);
        return data.length === 0;
    } catch (error) {
        console.error('Error checking referral code:', error);
        return true; // Fallback to allowing if check fails
    }
};

export const createProfile = async (userId, profileData) => {
    return supabaseFetch('/profiles', {
        method: 'POST',
        body: JSON.stringify({
            id: userId,
            ...profileData,
            created_at: new Date().toISOString()
            // updated_at removed
        })
    });
};

// ==================== SCAN HISTORY ====================

export const getScanHistory = async (userId) => {
    try {
        return await supabaseFetch(`/scan_history?user_id=eq.${userId}&select=*&order=created_at.desc&limit=50`);
    } catch (error) {
        console.error('Error fetching scan history:', error);
        return [];
    }
};

export const addScan = async (userId, scanResult) => {
    return supabaseFetch('/scan_history', {
        method: 'POST',
        body: JSON.stringify({
            user_id: userId,
            product_name: scanResult.product_name,
            overall_score: scanResult.overall_score,
            risk_level: scanResult.risk_level,
            data: scanResult,
            created_at: new Date().toISOString()
        })
    });
};

// ==================== SECURE FUNCTIONS (RPC) ====================

export const rpcDeductCredits = async (amount) => {
    return supabaseFetch('/rpc/deduct_credits', {
        method: 'POST',
        body: JSON.stringify({ amount })
    });
};

export const rpcAddXp = async (amount) => {
    return supabaseFetch('/rpc/add_xp', {
        method: 'POST',
        body: JSON.stringify({ amount })
    });
};

// ==================== CHAT SYSTEM ====================

export const getConversations = async (userId) => {
    try {
        // Fetch conversations where user is a participant
        // Note: This requires a many-to-many relationship setup or a simpler join
        // For simplicity, we'll fetch from a 'conversation_participants' view or table if it existed,
        // but here we will assume a 'conversations' table with an array of participants or similar, 
        // OR we just query messages.

        // Better Schema approach:
        // conversations: id, created_at
        // conversation_participants: conversation_id, user_id

        // Simplified approach for this MVP:
        // We will fetch conversations by finding 'conversation_participants'
        const { data: participations, error } = await supabaseFetch(`/conversation_participants?user_id=eq.${userId}&select=conversation_id,conversations(*)`);

        if (error) throw error;

        // Now for each conversation, get the OTHER participant info and last message
        const conversations = await Promise.all(participations.map(async (p) => {
            const conv = p.conversations;
            const { data: otherParticipants } = await supabaseFetch(`/conversation_participants?conversation_id=eq.${conv.id}&user_id=neq.${userId}&select=user_id,profiles(*)`);
            const otherUser = otherParticipants[0]?.profiles; // Assuming 1-on-1 chat

            // Get last message
            const { data: lastMsg } = await supabaseFetch(`/messages?conversation_id=eq.${conv.id}&order=created_at.desc&limit=1`);

            return {
                ...conv,
                otherUser,
                lastMessage: lastMsg?.[0] || null
            };
        }));

        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
};

export const getMessages = async (conversationId) => {
    try {
        return await supabaseFetch(`/messages?conversation_id=eq.${conversationId}&order=created_at.asc`);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

export const sendMessage = async (conversationId, senderId, content) => {
    return supabaseFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
            conversation_id: conversationId,
            sender_id: senderId,
            content,
            created_at: new Date().toISOString(),
            read: false
        })
    });
};

export const createConversation = async (userId1, userId2) => {
    // 1. Check if conversation already exists between these two
    // This is complex via REST, so for MVP we might just create a new one or simplistic check
    // For now, let's just create a new one

    // Create Conversation
    const conv = await supabaseFetch('/conversations', { method: 'POST', body: JSON.stringify({ created_at: new Date().toISOString() }) });
    const convId = conv ? conv[0]?.id : null; // Supabase usually returns array

    // If simplistic fetch returns single obj, handle that.
    // NOTE: supabaseFetch wrapper implies returns JSON. 
    // If standard PostgREST: POST returns new row if Prefer: return=representation.

    if (convId) {
        // Add Participants
        await supabaseFetch('/conversation_participants', { method: 'POST', body: JSON.stringify({ conversation_id: convId, user_id: userId1 }) });
        await supabaseFetch('/conversation_participants', { method: 'POST', body: JSON.stringify({ conversation_id: convId, user_id: userId2 }) });
        return convId;
    }
    return null;
};

// ==================== COMMUNITY ====================

export const getPosts = async () => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:user_id (name, role, professional_specialty, professional_number, xp, photo_url, is_professional, goals),
                post_likes (user_id)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data for UI
        const currentUser = getCurrentUser();
        return data.map(post => ({
            id: post.id,
            author: post.profiles?.name || 'Usuário',
            role: post.profiles?.role === 'professional' ? post.profiles.professional_specialty || "Profissional" : "Consumidor Consciente",
            credentials: post.profiles?.professional_number || "",
            scansCount: post.profiles?.xp ? Math.floor(post.profiles.xp / 10) : 0,
            content: post.content,
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            photo: post.profiles?.photo_url,
            isPro: post.profiles?.is_professional,
            isMe: post.user_id === currentUser?.id,
            goal: post.profiles?.goals?.[0] || "Saúde",
            isLiked: post.post_likes?.some(like => like.user_id === currentUser?.id),
            created_at: post.created_at
        }));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};

export const createPost = async (userId, content) => {
    return supabaseFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            user_id: userId,
            content,
            created_at: new Date().toISOString()
        })
    });
};

export const togglePostLike = async (postId, userId, isLiked) => {
    if (isLiked) {
        // Unlike
        await supabaseFetch(`/post_likes?post_id=eq.${postId}&user_id=eq.${userId}`, { method: 'DELETE' });
        // Decrement counter (simplified, ideally via RPC or trigger)
    } else {
        // Like
        await supabaseFetch('/post_likes', {
            method: 'POST',
            body: JSON.stringify({ post_id: postId, user_id: userId })
        });
    }
};


// ==================== BLOG ====================

export const getBlogPosts = async () => {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
};

export const createBlogPost = async (postData) => {
    return supabaseFetch('/blog_posts', {
        method: 'POST',
        body: JSON.stringify({
            ...postData,
            created_at: new Date().toISOString()
        })
    });
};


// ==================== CONFIGURATION ====================

export const setSupabaseConfig = (url, key) => {
    localStorage.setItem('notoxlabel_supabase_url', url);
    localStorage.setItem('notoxlabel_supabase_key', key);
    window.location.reload();
};

// ==================== DATABASE SCHEMA (for reference) ====================
/*
-- Run this in Supabase SQL Editor to create tables:

CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    name TEXT,
    photo_url TEXT,
    goals TEXT[],
    conditions TEXT[],
    gender TEXT, -- [NEW]
    role TEXT DEFAULT 'user', -- [NEW] 'user', 'professional', 'admin'
    professional_specialty TEXT, -- [NEW]
    professional_number TEXT, -- [NEW]
    credits INTEGER DEFAULT 3,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    badges TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    product_name TEXT,
    overall_score INTEGER,
    risk_level TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHAT SYSTEM [NEW]
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id),
    user_id UUID REFERENCES profiles(id),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES profiles(id),
    content TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BLOG SYSTEM [NEW]
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    content TEXT,
    image_url TEXT,
    tags TEXT[],
    author_ai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for MVP)
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Chat Policies
-- (In production, ensure users can only see their own conversations)
CREATE POLICY "Participants view conversations" ON conversations FOR SELECT USING (
    exists (select 1 from conversation_participants cp where cp.conversation_id = id and cp.user_id = auth.uid())
);
CREATE POLICY "Participants view messages" ON messages FOR SELECT USING (
    exists (select 1 from conversation_participants cp where cp.conversation_id = conversation_id and cp.user_id = auth.uid())
);
CREATE POLICY "Participants send messages" ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);

*/

