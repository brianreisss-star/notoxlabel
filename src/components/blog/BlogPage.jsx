import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { ArrowLeft, BookOpen, Clock, Tag, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNav from '../layout/BottomNav';

import { getBlogPosts } from '../../services/supabase';

const BlogPage = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getBlogPosts();
                if (data && data.length > 0) {
                    setPosts(data);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error("Failed to fetch blog", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-white pb-32 font-sans">
            {selectedPost ? (
                // Article View
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
                    <div className="h-80 w-full relative">
                        <img src={selectedPost.image_url || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover" alt={selectedPost.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <button onClick={() => setSelectedPost(null)} className="absolute left-6 top-6 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                    </div>

                    <div className="px-6 -mt-10 relative z-10">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 min-h-screen">
                            <div className="flex gap-2 flex-wrap mb-4">
                                {selectedPost.tags && selectedPost.tags.map(tag => (
                                    <span key={tag} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4 tracking-tighter">
                                {selectedPost.title}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-400 text-xs font-bold mb-8 border-b border-gray-100 pb-6">
                                <span className="flex items-center gap-1"><Clock size={14} /> {selectedPost.estimated_read_time || "5 min"}</span>
                                <span className="flex items-center gap-1"><Sparkles size={14} className="text-purple-400" /> AI Insights</span>
                            </div>

                            <div className="prose prose-lg prose-gray">
                                <p className="text-gray-500 font-medium leading-relaxed mb-6 italic text-lg border-l-4 border-emerald-500 pl-4">{selectedPost.summary}</p>
                                <div className="text-gray-800 font-medium leading-relaxed space-y-4">
                                    {/* Simple Markdown Render (MVP) */}
                                    {selectedPost.content_markdown && selectedPost.content_markdown.split('\\n\\n').map((para, i) => {
                                        if (para.startsWith('##')) return <h2 key={i} className="text-xl font-black text-gray-900 mt-8 mb-4">{para.replace('##', '')}</h2>;
                                        return <p key={i}>{para}</p>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                // Feed View
                <>
                    <div className="px-6 py-10 bg-white">
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 opacity-5 absolute top-4 right-0 pointer-events-none">BLOG</h1>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Knowledge Hub</h1>
                        <p className="text-gray-400 text-sm font-medium">Curadoria de IA para sua longevidade.</p>
                    </div>

                    <div className="px-6 space-y-6">
                        {loading ? (
                            <div className="text-center py-20 text-gray-400 animate-pulse">Carregando artigos...</div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] mt-6">
                                <p className="text-gray-900 font-bold mb-2">Nenhum artigo publicado ainda.</p>
                                <p className="text-sm text-gray-500">Em breve nossos especialistas trarão novidades.</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    key={post.id}
                                    onClick={() => setSelectedPost(post)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200 mb-4">
                                        <img src={post.image_url || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            {post.tags && post.tags[0] && (
                                                <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block shadow-lg">
                                                    {post.tags[0]}
                                                </span>
                                            )}
                                            <h3 className="text-2xl font-black text-white leading-tight shadow-black drop-shadow-md">{post.title}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </>
            )}
            <BottomNav />
        </div>
    );
};

export default BlogPage;
