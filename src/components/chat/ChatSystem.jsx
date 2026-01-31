import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ChevronLeft, MessageCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import * as supabase from '../../services/supabase';

const ChatSystem = ({ isOpen, onClose, initialTargetUser }) => {
    const { user, profile } = useUser();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial Load or Target User Setup
    useEffect(() => {
        if (!isOpen) return;

        const initChat = async () => {
            setLoading(true);
            try {
                // If we are opening chat from a specific user profile
                if (initialTargetUser) {
                    // Check if conversation exists (mock check by just fetching all)
                    const userConvs = await supabase.getConversations(user.id);

                    // Simple client-side check for MVP
                    let targetConv = userConvs.find(c => c.otherUser?.id === initialTargetUser.id);

                    if (!targetConv) {
                        // Create optimistic conversation object
                        // On first message send, we will actually create it in DB
                        targetConv = {
                            id: 'new',
                            otherUser: initialTargetUser,
                            isNew: true
                        };
                    }
                    setConversations(userConvs);
                    setActiveConversation(targetConv);
                } else {
                    // Just list conversations
                    const userConvs = await supabase.getConversations(user.id);
                    setConversations(userConvs);
                }
            } catch (err) {
                console.error("Chat Init Error", err);
            } finally {
                setLoading(false);
            }
        };
        initChat();
    }, [isOpen, initialTargetUser, user]);

    // Fetch Messages when Active Conversation Changes
    useEffect(() => {
        if (!activeConversation || activeConversation.isNew) {
            setMessages([]);
            return;
        }

        const fetchMsgs = async () => {
            const msgs = await supabase.getMessages(activeConversation.id);
            setMessages(msgs);
            scrollToBottom();
        };

        fetchMsgs();

        // Realtime Polling Fallback (since we don't have sockets fully set up in this demo env)
        const interval = setInterval(fetchMsgs, 5000);
        return () => clearInterval(interval);

    }, [activeConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage(''); // Optimistic clear

        // Optimistic UI Update
        const optimisticMsg = {
            id: Date.now(),
            sender_id: user.id,
            content: content,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);
        scrollToBottom();

        try {
            let convId = activeConversation.id;

            // If it's a new conversation, create it first
            if (activeConversation.isNew) {
                const newConvId = await supabase.createConversation(user.id, activeConversation.otherUser.id);
                if (newConvId) {
                    convId = newConvId;
                    // Update active conversation state to remove 'isNew' flag
                    const updatedConv = { ...activeConversation, id: newConvId, isNew: false };
                    setActiveConversation(updatedConv);
                    setConversations(prev => [updatedConv, ...prev]);
                } else {
                    throw new Error("Failed to create conversation");
                }
            }

            await supabase.sendMessage(convId, user.id, content);

            // Refresh messages to confirm sync
            if (!activeConversation.isNew) {
                const msgs = await supabase.getMessages(convId);
                setMessages(msgs);
            }
        } catch (err) {
            console.error("Send Error", err);
            alert("Erro ao enviar mensagem.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-4xl h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
                    >
                        <button onClick={onClose} className="absolute right-4 top-4 z-20 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>

                        {/* Sidebar (Conversation List) */}
                        <div className={`w-full md:w-80 bg-gray-50 border-r border-gray-100 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-6 pb-4">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Mensagens</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Sua rede profissional</p>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4 scrollbar-hide">
                                {loading && <div className="text-center py-10 text-gray-400 text-sm">Carregando...</div>}

                                {!loading && conversations.length === 0 && !activeConversation?.isNew && (
                                    <div className="text-center py-10 px-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <MessageCircle size={24} />
                                        </div>
                                        <p className="text-gray-500 font-medium text-sm">Nenhuma conversa ainda.</p>
                                        <p className="text-gray-400 text-xs mt-2">Visite a Comunidade para iniciar um papo!</p>
                                    </div>
                                )}

                                {conversations.map(conv => {
                                    const other = conv.otherUser || { name: 'Usuário Desconhecido' }; // Fallback
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => setActiveConversation(conv)}
                                            className={`w-full p-4 rounded-3xl flex items-center gap-3 transition-all text-left ${activeConversation?.id === conv.id ? 'bg-white shadow-lg shadow-gray-200' : 'hover:bg-white hover:shadow-sm'}`}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black shadow-sm shrink-0">
                                                {other.name?.charAt(0)}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-gray-900 text-sm truncate">{other.name}</h4>
                                                <p className="text-xs text-gray-400 truncate font-medium">
                                                    {conv.isNew ? 'Nova conversa' : conv.lastMessage?.content || 'Toque para abrir'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className={`flex-1 flex flex-col bg-white h-full ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                            {!activeConversation ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                                    <MessageCircle size={64} className="mb-4 opacity-50" />
                                    <p className="font-black text-xl">Selecione uma conversa</p>
                                    <p className="text-sm font-medium">Conecte-se com outros membros e profissionais.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                        <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 text-gray-500">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-md">
                                            {activeConversation.otherUser?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 leading-none">{activeConversation.otherUser?.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                                {activeConversation.otherUser?.role === 'professional' ? 'Profissional de Saúde' : 'Membro'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                                        {messages.map((msg, idx) => {
                                            const isMe = msg.sender_id === user.id;
                                            return (
                                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${isMe
                                                            ? 'bg-gray-900 text-white rounded-br-sm shadow-xl shadow-gray-200'
                                                            : 'bg-white text-gray-600 rounded-bl-sm border border-gray-100 shadow-sm'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 bg-white border-t border-gray-100">
                                        <form onSubmit={handleSend} className="flex gap-2 relative">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                placeholder="Digite sua mensagem..."
                                                className="flex-1 bg-gray-50 rounded-[1.5rem] px-6 py-4 outline-none border-2 border-transparent focus:bg-white focus:border-gray-200 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="w-14 h-14 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-gray-300 disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <Send size={20} strokeWidth={2.5} className="-ml-0.5 mt-0.5" />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatSystem;
