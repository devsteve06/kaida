//contains the implementation for the stripe payment strategy

import Stripe from "stripe";
import orderModel from "../../models/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const stripeService = {
    // Create a PaymentIntent and return client secret for frontend testing
    async initiate({ orderId, userId, currency = "usd" }) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Stripe secret key not configured");
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        // order.total_amount is stored as numeric (e.g. 145000.00). Convert to cents.
        const amountCents = Math.round(Number(order.total_amount) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountCents,
            currency,
            metadata: { orderId: String(orderId), userId: String(userId) },
            payment_method_types: ["card"]
        });

        return {
            provider: "stripe",
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            amount: amountCents,
            currency
        };
    },

    // Optional: create a Checkout Session for quick testing in Stripe dashboard
    async createCheckoutSession({ orderId, userId, successUrl, cancelUrl, currency = "usd" }) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Stripe secret key not configured");
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        // Build line items from aggregated order items. `price` comes from price_at_purchase.
        const line_items = (order.items || []).map((it) => ({
            price_data: {
                currency,
                product_data: { name: `Product ${it.product_id}` },
                unit_amount: Math.round(Number(it.price) * 100)
            },
            quantity: it.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { orderId: String(orderId), userId: String(userId) }
        });

        return { sessionId: session.id, url: session.url };
    }
};

export default stripeService;
