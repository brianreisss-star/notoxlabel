-- Tabela de Perfis de Usuário
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    name TEXT,
    photo_url TEXT,
    goals TEXT[],
    conditions TEXT[],
    gender TEXT,
    role TEXT DEFAULT 'user', -- 'user', 'professional', 'admin'
    professional_specialty TEXT,
    professional_number TEXT,
    credits INTEGER DEFAULT 3,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    badges TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Histórico de Scans
CREATE TABLE scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    product_name TEXT,
    overall_score INTEGER,
    risk_level TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sistema de Chat
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

-- Sistema de Blog
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    content TEXT,
    image_url TEXT,
    tags TEXT[],
    author_ai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (Segurança)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Simplificadas para funcionar de imediato)
-- Perfil: Todos podem ver (público), mas só o dono edita
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Histórico: Usuário só vê o seu
CREATE POLICY "Users view own history" ON scan_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own history" ON scan_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat: Participantes veem conversas e mensagens
CREATE POLICY "Participants view conversations" ON conversations FOR SELECT USING (
    exists (select 1 from conversation_participants cp where cp.conversation_id = id and cp.user_id = auth.uid())
);

CREATE POLICY "Participants insert conversations" ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants view participants" ON conversation_participants FOR SELECT USING (
    exists (select 1 from conversation_participants cp where cp.conversation_id = conversation_id and cp.user_id = auth.uid())
);

CREATE POLICY "Participants insert participants" ON conversation_participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants view messages" ON messages FOR SELECT USING (
    exists (select 1 from conversation_participants cp where cp.conversation_id = conversation_id and cp.user_id = auth.uid())
);

CREATE POLICY "Participants send messages" ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);
