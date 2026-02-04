-- ============================================
-- SECURE FUNCTIONS (RPC) FOR PHASE 2 SCALABILITY
-- ============================================

-- Force Enable Extensions if needed (usually handled by dashboard but good to safeguard)
-- CREATE EXTENSION IF NOT EXISTS "plpgsql";

-- 1. SECURE DEDUCT CREDITS
-- Prevents race conditions and frontend manipulation.
CREATE OR REPLACE FUNCTION deduct_credits(amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with admin privileges to bypass RLS if needed, or strictly enforces logic
AS $$
DECLARE
    current_credits INTEGER;
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    -- Check if User is Logged In
    IF user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Lock the row for update to prevent race conditions
    SELECT credits INTO current_credits FROM profiles WHERE id = user_id FOR UPDATE;

    IF current_credits IS NULL THEN 
         RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
    END IF;

    IF current_credits < amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits');
    END IF;

    -- Perform Update
    UPDATE profiles 
    SET credits = credits - amount,
        updated_at = NOW()
    WHERE id = user_id;

    RETURN jsonb_build_object('success', true, 'new_balance', current_credits - amount);
END;
$$;


-- 2. SECURE ADD XP
-- Adds XP and handles level up logic automatically on the server.
CREATE OR REPLACE FUNCTION add_xp(amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    current_xp INTEGER;
    current_level INTEGER;
    new_xp INTEGER;
    new_level INTEGER;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    SELECT xp, level INTO current_xp, current_level FROM profiles WHERE id = user_id FOR UPDATE;

    new_xp := current_xp + amount;
    
    -- Simple Level Logic: Level up every 1000 XP (Example)
    -- Or use the formula: Level = floor(sqrt(new_xp / 100)) + 1
    new_level := FLOOR(SQRT(new_xp / 100)) + 1;

    UPDATE profiles 
    SET xp = new_xp,
        level = new_level,
        updated_at = NOW()
    WHERE id = user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'new_xp', new_xp, 
        'new_level', new_level,
        'level_up', (new_level > current_level)
    );
END;
$$;
