export const config = {
    runtime: 'nodejs', // Stripe library needs Node.js runtime, not Edge
};

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { planId, userId, userEmail, returnUrl } = req.body;

        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY missing in Vercel Env Vars');
        }

        // Define Products/Prices
        // In a real app, these are Price IDs from Stripe Dashboard (e.g. price_12345)
        // For MVP, we use ad-hoc line items

        let lineItem;
        let mode = 'payment'; // 'payment' for one-time, 'subscription' for pro

        if (planId === 'credits_50') {
            lineItem = {
                price_data: {
                    currency: 'brl',
                    product_data: { name: 'Pacote 50 Créditos (NoToxLabel)' },
                    unit_amount: 1990, // R$ 19,90
                },
                quantity: 1,
            };
        } else if (planId === 'pro_monthly') {
            mode = 'subscription';
            lineItem = {
                price_data: {
                    currency: 'brl',
                    product_data: { name: 'Assinatura Pro (Mensal)' },
                    unit_amount: 2990, // R$ 29,90
                    recurring: { interval: 'month' }
                },
                quantity: 1,
            };
        } else if (planId === 'pro_annual') {
            mode = 'subscription';
            lineItem = {
                price_data: {
                    currency: 'brl',
                    product_data: { name: 'Assinatura Pro (Anual)' },
                    unit_amount: 29900, // R$ 299,00
                    recurring: { interval: 'year' }
                },
                quantity: 1,
            };
        } else {
            throw new Error('Invalid Plan ID');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'boleto'],
            line_items: [lineItem],
            mode: mode,
            success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true`,
            customer_email: userEmail,
            metadata: {
                userId: userId,
                planId: planId,
                type: mode === 'subscription' ? 'subscription' : 'credits'
            }
        });

        res.status(200).json({ url: session.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
}
