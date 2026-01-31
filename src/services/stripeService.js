/**
 * NoToxLabel - Stripe Payment Service (MVP)
 * Uses Payment Links for simple subscription management.
 */

// REPLACE THESE LINKS WITH YOUR REAL STRIPE PAYMENT LINKS
export const STRIPE_LINKS = {
    essencial: "https://buy.stripe.com/6oU8wPbpj5Kzarz25qgw000",
    unlimited: "https://buy.stripe.com/3cI28r2SNc8Xarz9xSgw001",
    pro: "https://buy.stripe.com/eVqeVdbpjfl9gPX39ugw002"
};

export const createCheckoutSession = async (planId, userId) => {
    console.log(`Initiating payment for ${planId} (User: ${userId})`);

    const link = STRIPE_LINKS[planId];

    if (!link) {
        throw new Error("Plano inválido ou link não configurado.");
    }

    // In a real app, you might want to append ?client_reference_id={userId} 
    // to the URL to track who paid via webhook.
    const finalUrl = `${link}?client_reference_id=${userId}`;

    // Simulate short delay for UX
    await new Promise(r => setTimeout(r, 800));

    // Return the URL for redirection
    return { url: finalUrl };
};
