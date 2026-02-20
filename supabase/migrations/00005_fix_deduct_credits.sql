-- Migration 00005: Fix deduct_credits to validate sufficient balance

CREATE OR REPLACE FUNCTION deduct_credits(amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_credits INTEGER;
    new_balance INTEGER;
    uid UUID;
BEGIN
    uid := auth.uid();

    IF uid IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Lock row to prevent race conditions
    SELECT credits INTO current_credits
    FROM profiles
    WHERE id = uid
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
    END IF;

    -- Validate sufficient credits
    IF current_credits < amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits', 'current_balance', current_credits);
    END IF;

    new_balance := current_credits - amount;

    UPDATE profiles
    SET credits = new_balance, updated_at = NOW()
    WHERE id = uid;

    RETURN jsonb_build_object('success', true, 'new_balance', new_balance);
END;
$$;

-- Also fix add_xp to be more robust
CREATE OR REPLACE FUNCTION add_xp(amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_xp INTEGER;
    new_xp INTEGER;
    new_level INTEGER;
    old_level INTEGER;
    uid UUID;
BEGIN
    uid := auth.uid();

    IF uid IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    SELECT xp, level INTO current_xp, old_level
    FROM profiles
    WHERE id = uid
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
    END IF;

    new_xp := COALESCE(current_xp, 0) + amount;
    new_level := FLOOR(SQRT(new_xp / 100.0)) + 1;

    UPDATE profiles
    SET xp = new_xp, level = new_level, updated_at = NOW()
    WHERE id = uid;

    RETURN jsonb_build_object(
        'success', true,
        'new_xp', new_xp,
        'new_level', new_level,
        'level_up', new_level > COALESCE(old_level, 1)
    );
END;
$$;
