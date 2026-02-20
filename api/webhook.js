export const config = {
    api: {
        bodyParser: false,
    },
};

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { buffer } = require('micro');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, planId, type } = session.metadata;

        console.log(`[Stripe Webhook] Payment success for User ${userId} - Plan ${planId}`);

        try {
            // Idempotency check: skip if already processed
            const { data: existingTx } = await supabase
                .from('transactions')
                .select('id')
                .eq('stripe_session_id', session.id)
                .maybeSingle();

            if (existingTx) {
                console.log(`[Stripe Webhook] Session ${session.id} already processed, skipping.`);
                res.status(200).json({ received: true });
                return;
            }

            // Determine amount
            const amountCents = session.amount_total || 0;

            if (planId === 'credits_50') {
                const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();

                if (profile) {
                    await supabase.from('profiles').update({
                        credits: (profile.credits || 0) + 50,
                        updated_at: new Date().toISOString()
                    }).eq('id', userId);
                }

            } else if (planId === 'pro_monthly' || planId === 'pro_annual') {
                await supabase.from('profiles').update({
                    subscription_plan: 'pro',
                    is_professional: true,
                    credits: 999,
                    updated_at: new Date().toISOString()
                }).eq('id', userId);
            }

            // Log transaction for audit
            await supabase.from('transactions').insert({
                user_id: userId,
                stripe_session_id: session.id,
                plan_id: planId,
                type: type || (planId === 'credits_50' ? 'credits' : 'subscription'),
                amount_cents: amountCents,
                currency: session.currency || 'brl',
                status: 'completed',
                metadata: {
                    stripe_customer: session.customer,
                    stripe_payment_intent: session.payment_intent
                }
            });

            res.status(200).json({ received: true });

        } catch (dbError) {
            console.error('[Stripe Webhook] Database Error:', dbError);
            res.status(500).json({ error: 'Database update failed' });
        }
    } else {
        res.status(200).json({ received: true });
    }
}
