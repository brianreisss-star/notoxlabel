import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Plus, X, ShieldCheck, Instagram, Award, CheckCircle2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../layout/BottomNav';
import ChatSystem from '../chat/ChatSystem';
import { getPosts, createPost, togglePostLike } from '../../services/supabase'; // Import backend functions

const CommunityPage = () => {
    const { profile, user } = useUser();
    const navigate = useNavigate();
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatTarget, setChatTarget] = useState(null);

    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");

    // Fetch real posts
    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getPosts();
            if (data && data.length > 0) {
                setPosts(data);
            } else {
                // Fallback to demo posts if DB empty
                setPosts([
                    {
                        id: 'demo-1',
                        author: "Dra. Ana Silva",
                        role: "Nutricionista",
                        credentials: "CRN 12345",
                        scansCount: 428,
                        content: "DEMO: Conecte o banco de dados para ver posts reais! Você sabia que muitos 'sucos naturais' de caixinha possuem tanto açúcar quanto refrigerantes?",
                        likes: 245,
                        comments: 12,
                        isPro: true,
                        goal: "⚖️ Emagrecer"
                    }
                ]);
            }
        };
        fetchPosts();
    }, []);

    const isPro = profile?.role === 'professional' || profile?.is_professional === true;
    const userGoals = Array.isArray(profile?.goals) ? profile.goals : [];

    // Smart Sort: Posts matching user goals come first
    const sortedPosts = [...posts].sort((a, b) => {
        const aMatches = postMatchesGoal(a, userGoals);
        const bMatches = postMatchesGoal(b, userGoals);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
    });

    function postMatchesGoal(post, goals) {
        if (!post.goal || !goals.length) return false;
        return goals.includes(post.goal);
    }

    const openChat = (postAuthor) => {
        // Mock target user object based on post author
        const target = {
            id: postAuthor.id, // In real app would be author_id
            name: postAuthor.author,
            role: postAuthor.isPro ? 'professional' : 'user'
        };
        setChatTarget(target);
        setIsChatOpen(true);
    };

    // Like Logic
    const toggleLike = async (postId) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        // Optimistic Update
        const isLiked = post.isLiked;
        setPosts(currentPosts => currentPosts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    isLiked: !isLiked,
                    likes: isLiked ? p.likes - 1 : p.likes + 1
                };
            }
            return p;
        }));

        // Backend Sync
        if (user) {
            await togglePostLike(postId, user.id, isLiked);
        }
    };

    // Create Post Logic
    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        if (user) {
            await createPost(user.id, newPostContent);
            setNewPostContent("");
            setIsPostModalOpen(false);
            alert("Post enviado! Atualize a página para ver (ou implemente realtime depois).");
            // Ideally refetch posts here
            const data = await getPosts();
            setPosts(data);
        }
    };

    // Comment State
    const [commentModalPostId, setCommentModalPostId] = useState(null);
    const [newComment, setNewComment] = useState("");

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        setPosts(current => current.map(p => {
            if (p.id === commentModalPostId) {
                return { ...p, comments: p.comments + 1 };
            }
            return p;
        }));
        setNewComment("");
        setCommentModalPostId(null);
        alert("Comentário enviado!");
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            <ChatSystem
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                initialTargetUser={chatTarget}
            />

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-8 sticky top-0 z-40">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Comunidade</h1>
                        <p className="text-gray-400 text-xs font-medium italic mt-1">Consciência coletiva e autoridade.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setChatTarget(null); setIsChatOpen(true); }}
                            className="bg-gray-100 text-gray-600 p-4 rounded-3xl hover:bg-gray-200 transition-colors"
                        >
                            <MessageCircle size={24} />
                        </button>
                        {isPro && (
                            <button
                                onClick={() => setIsPostModalOpen(true)}
                                className="bg-gray-900 text-white p-4 rounded-3xl shadow-lg shadow-gray-200 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Plus size={24} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {sortedPosts.map((post, idx) => {
                    const matchesGoal = userGoals.includes(post.goal);
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={post.id || idx}
                            className={`p-6 rounded-[2.5rem] border-2 shadow-xl ${post.isMe && user?.email === 'admin@notoxlabel.com.br'
                                ? 'bg-blue-50/20 border-blue-200 shadow-blue-900/5'
                                : post.isPro
                                    ? 'bg-emerald-50/20 border-emerald-200 shadow-emerald-900/5'
                                    : 'bg-white border-gray-100 shadow-gray-200/50'
                                } ${matchesGoal ? 'ring-2 ring-[#FF385C]/10 border-[#FF385C]/20' : ''} relative group hover:scale-[1.01] transition-all`}
                        >
                            {matchesGoal && (
                                <div className="absolute -top-2 left-8 bg-[#FF385C] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-pink-500/20">
                                    Relevante para você
                                </div>
                            )}

                            {/* Blue Verified for CEO, Green for Pro */}
                            {post.isMe && user?.email === 'admin@notoxlabel.com.br' ? (
                                <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                                    <CheckCircle2 size={20} strokeWidth={3} />
                                </div>
                            ) : post.isPro ? (
                                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg">
                                    <ShieldCheck size={20} />
                                </div>
                            ) : null}

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-xl shadow-md overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    {post.photo ? (
                                        <img src={post.photo} alt={post.author} className="w-full h-full object-cover" />
                                    ) : post.isMe ? (
                                        <div className="w-full h-full bg-gradient-to-br from-[#FF385C] to-pink-600 flex items-center justify-center text-white font-black text-xs">
                                            {post.author.charAt(0)}
                                        </div>
                                    ) : (
                                        <img src={`https://i.pravatar.cc/100?u=${post.id}`} alt={post.author} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-black text-gray-900 flex items-center gap-1 ${post.isMe && user?.email === 'admin@notoxlabel.com.br' ? 'text-lg' : 'text-sm'}`}>
                                        {post.author}
                                        {post.isMe && user?.email === 'admin@notoxlabel.com.br' ? (
                                            <div className="bg-blue-500 text-white rounded-full p-0.5 ml-1">
                                                <CheckCircle2 size={10} strokeWidth={4} />
                                            </div>
                                        ) : post.isPro ? (
                                            <span className="p-0.5 bg-emerald-500 rounded-full"></span>
                                        ) : null}
                                        <span className="ml-2 bg-gray-100 text-[10px] text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-black">
                                            🎯 {post.scansCount}
                                        </span>
                                    </h4>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FF385C]">
                                            {post.isMe && user?.email === 'admin@notoxlabel.com.br' ? '' : `${post.role} ${post.isPro && post.credentials ? `• ${post.credentials}` : ''}`}
                                        </p>
                                        <div className="inline-block bg-gray-50 text-[8px] font-black px-2 py-0.5 rounded-md border border-gray-100 text-gray-400 uppercase tracking-widest">
                                            {post.goal}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className={`text-gray-600 font-medium leading-relaxed mb-6 italic ${post.isMe && user?.email === 'admin@notoxlabel.com.br' ? 'text-lg' : ''}`}>
                                "{post.content}"
                            </p>

                            <div className="flex items-center justify-between border-t border-gray-100/50 pt-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                    >
                                        <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                                        <span className="text-[10px] font-black">{post.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => setCommentModalPostId(post.id)}
                                        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-[10px] font-black">{post.comments}</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {!post.isMe && (
                                        <button
                                            onClick={() => openChat(post)}
                                            className="p-2.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                    )}
                                    {post.isPro && post.instagram && (
                                        <a
                                            href={`https://instagram.com/${post.instagram}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-white border border-gray-100 rounded-xl text-pink-500 shadow-sm hover:scale-110 transition-transform"
                                        >
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {!isPro && (
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2 tracking-tight">Quer compartilhar insights?</h3>
                            <p className="text-gray-400 text-xs font-medium mb-6">Torne-se um **Pro Health** para construir autoridade e ajudar milhares de pessoas.</p>
                            <button onClick={() => navigate('/plans')} className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all">Ver Planos Pro</button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    </div>
                )}
            </div>

            <BottomNav />

            {/* Post Modal (Placeholder) */}
            <AnimatePresence>
                {isPostModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-8 w-full max-w-lg shadow-2xl relative">
                            <button onClick={() => setIsPostModalOpen(false)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                            <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tighter">Novo Insight</h3>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                className="w-full h-40 bg-gray-50 border border-transparent rounded-3xl p-6 text-gray-600 font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 mb-6"
                                placeholder="Compartilhe uma dica ou curiosidade sobre rótulos..."
                            ></textarea>
                            <button onClick={handleCreatePost} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-lg shadow-emerald-200">Publicar Agora</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comment Modal */}
            <AnimatePresence>
                {commentModalPostId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-8 w-full max-w-lg shadow-2xl relative">
                            <button onClick={() => setCommentModalPostId(null)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                            <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tighter">Comentar</h3>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full h-32 bg-gray-50 border border-transparent rounded-3xl p-6 text-gray-600 font-medium focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 mb-6"
                                placeholder="Escreva seu comentário..."
                            ></textarea>
                            <button onClick={handlePostComment} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-lg">Enviar Comentário</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityPage;
