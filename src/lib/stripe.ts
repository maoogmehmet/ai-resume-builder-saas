import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-02-24-preview' as any,
    appInfo: {
        name: 'Novatypalcv',
        version: '0.1.0',
    },
});
