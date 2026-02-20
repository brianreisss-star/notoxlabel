-- Migration 00003: Create transactions table for payment audit trail

CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    stripe_session_id TEXT UNIQUE NOT NULL,
    plan_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credits', 'subscription')),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'brl',
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own transactions
CREATE POLICY "Users view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert (webhook)
CREATE POLICY "Service role inserts transactions"
    ON transactions FOR INSERT
    WITH CHECK (true);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session ON transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
