import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Use service role for webhooks
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    const object = event.data.object as any;

    switch (event.type) {
        case 'checkout.session.completed':
            const session = object;
            if (session.subscription) {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                await supabaseAdmin
                    .from('profiles')
                    .update({
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: subscription.id,
                        subscription_status: subscription.status,
                        trial_end_date: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
                    })
                    .eq('id', session.metadata.user_id);
            }
            break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
            const sub = object;
            await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_status: sub.status,
                    trial_end_date: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
                })
                .eq('stripe_customer_id', sub.customer);

            // Reactivate public links if status is active or trialing
            if (['active', 'trialing'].includes(sub.status)) {
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', sub.customer)
                    .single();

                if (profile) {
                    await supabaseAdmin
                        .from('public_links')
                        .update({ is_active: true })
                        .eq('user_id', profile.id);
                }
            }
            break;

        case 'customer.subscription.deleted':
            const deletedSub = object;
            await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_status: 'canceled',
                })
                .eq('stripe_customer_id', deletedSub.customer);

            // Deactivate public links
            const { data: prof } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('stripe_customer_id', deletedSub.customer)
                .single();

            if (prof) {
                await supabaseAdmin
                    .from('public_links')
                    .update({ is_active: false })
                    .eq('user_id', prof.id);
            }
            break;
    }

    return NextResponse.json({ received: true });
}
