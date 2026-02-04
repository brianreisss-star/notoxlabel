-- Tabela de Histórico de Scans
CREATE TABLE IF NOT EXISTS scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    product_name TEXT,
    overall_score INTEGER,
    risk_level TEXT,
    data JSONB, -- Armazena o JSON completo do resultado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para Scan History
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio histórico"
ON scan_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar itens no histórico"
ON scan_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Opcional: Permitir admin ver tudo
CREATE POLICY "Admin vê tudo"
ON scan_history FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ATUALIZAÇÃO DE PERFIL (SEGURANÇA DE CRÉDITOS)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_redeemed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by TEXT;

