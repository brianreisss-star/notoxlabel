export const config = {
    api: {
        bodyParser: false, // Critical for Stripe Signature Verification
    },
};

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { buffer } = require('micro'); // Helper to read raw body

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Use Service Role Key to bypass RLS (Admin Access)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Read raw body
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, planId, type } = session.metadata;

        console.log(`[Stripe Webhook] Payment success for User ${userId} - Plan ${planId}`);

        try {
            if (planId === 'credits_50') {
                // Add 50 credits securely
                // We can't use RPC here easily because RPC relies on auth.uid() context usually,
                // unless we made the RPC 'security definer' AND accessible to anon/service_role.
                // Since we have SERVICE_ROLE_KEY, we can direct update or call a specific admin RPC.

                // Let's use direct update for simplicity as we have full admin access
                const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();

                if (profile) {
                    await supabase.from('profiles').update({
                        credits: (profile.credits || 0) + 50,
                        updated_at: new Date().toISOString()
                    }).eq('id', userId);
                }

            } else if (planId === 'pro_monthly' || planId === 'pro_annual') {
                // Activate Pro Subscription
                await supabase.from('profiles').update({
                    subscription_plan: 'pro',
                    is_professional: true, // Optional: give pro features
                    credits: 999, // Unlimited logic or high cap
                    updated_at: new Date().toISOString()
                }).eq('id', userId);
            }

            res.status(200).json({ received: true });

        } catch (dbError) {
            console.error('[Stripe Webhook] Database Error:', dbError);
            res.status(500).json({ error: 'Database update failed' });
        }
    } else {
        res.status(200).json({ received: true });
    }
}
