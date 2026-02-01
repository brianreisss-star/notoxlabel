-- Tabela de Posts
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Likes
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- Tabela de Comentários
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de Segurança (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler posts
CREATE POLICY "Public posts" ON posts FOR SELECT USING (true);
-- Apenas usuários logados podem criar posts
CREATE POLICY "Auth users insert posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Usuários podem deletar seus próprios posts
CREATE POLICY "Users delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Likes e Comentários seguem a mesma lógica
CREATE POLICY "Public likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Auth users toggle likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users remove likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Auth users insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
