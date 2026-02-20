-- Migration 00001: Add missing columns that exist in code but not in schema
-- These columns are referenced in UserContext.jsx and webhook.js

-- Add subscription_plan column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- Add evolution column (JSONB array for health tracking)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS evolution JSONB DEFAULT '[]'::jsonb;

-- Add clean_habit_score column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clean_habit_score NUMERIC DEFAULT 0;

-- Add coupons column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coupons JSONB DEFAULT '[]'::jsonb;

-- Ensure is_professional exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_professional BOOLEAN DEFAULT FALSE;

-- Ensure referral columns exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_redeemed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Ensure onboarding_completed exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
