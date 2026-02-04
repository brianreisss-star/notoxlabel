/**
 * NoToxLabel - Stripe Service
 * Frontend wrapper for calling serverless checkout functions
 */

export const createCheckoutSession = async (planId, userId, userEmail) => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                planId,
                userId,
                userEmail, // Important for receipt
                returnUrl: window.location.origin + '/profile' // Return to profile after payment
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Checkout initialization failed');
        }

        const data = await response.json();
        return data; // { url: '...' }

    } catch (error) {
        console.error('Stripe Service Error:', error);
        throw error;
    }
};
