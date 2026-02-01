-- ==============================================================================
-- SCHEMA DO BLOG E CHAT (ADDITIONAL FEATURES)
-- Execute este script no SQL Editor do Supabase para ativar Blog e Chat reais.
-- ==============================================================================

-- 1. Tabela de Blog
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content_markdown TEXT, -- Conteúdo completo em Markdown
    image_url TEXT,
    tags TEXT[],
    author_ai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de Segurança do Blog
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- Todos podem ler
CREATE POLICY "Public blog read" ON blog_posts FOR SELECT USING (true);
-- Apenas admin pode escrever (na prática, via banco ou se tiver role admin)
-- Para simplificar neste MVP, vamos permitir que usuários autenticados criem (se você for o admin)
-- Ou melhor, vamos deixar aberto para INSERT apenas se o email for o do admin
CREATE POLICY "Admin insert blog" ON blog_posts FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@notoxlabel.com.br'
);


-- 2. Sistema de Chat (Conversas e Mensagens)

-- Tabela de Conversas (Sala)
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Participantes (Quem está em qual conversa)
CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Tabela de Mensagens
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de Segurança do Chat
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Regras de Conversa:
-- Usuários podem ver conversas das quais participam
CREATE POLICY "View own conversations" ON conversations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversation_participants cp 
        WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
    )
);
-- Qualquer logado pode criar conversa (a associação vem depois)
CREATE POLICY "Create conversations" ON conversations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Regras de Participantes:
-- Ver participantes das minhas conversas
CREATE POLICY "View conversation participants" ON conversation_participants FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversation_participants cp 
        WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
);
-- Entrar em conversa (ou adicionar alguém)
CREATE POLICY "Insert participants" ON conversation_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Regras de Mensagens:
-- Ver mensagens das minhas conversas
CREATE POLICY "View conversation messages" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversation_participants cp 
        WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
);
-- Enviar mensagem (se eu participo da conversa)
CREATE POLICY "Send messages" ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM conversation_participants cp 
        WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
);

-- Índices para performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);
