import db from "../db.js";
import paymentsModel from "../models/payments.model.js";
import orderModel from "../models/order.model.js";
import Stripe from "stripe";


export const paymentService = {
    async initiatePayment(orderId, provider){
        // Validate provider
        const validProviders = ["stripe", "mpesa"];
        if (!provider || !validProviders.includes(provider)) {
            throw new Error(`Invalid payment provider. Must be one of: ${validProviders.join(", ")}`);
        }

        const client = await db.connect()

        try {
            await client.query("BEGIN")

            const orderResult = await client.query("SELECT * FROM orders WHERE id = $1", [orderId])
            const order = orderResult.rows[0];

            if (!order) {
                throw new Error("Order Not Found");
            }

            if (order.status === "paid") {
                throw new Error("Order already paid");
            }

            const transactionRef = "sim-" + Date.now();
            
            const paymentResult = await paymentsModel.create(client, {orderId,
                 amount : order.total_amount,
                  provider,
                status :"pending",
                transactionalRef: transactionRef
            });

            const payment = paymentResult.rows[0];

            if (!payment) {
                throw new Error("Failed to create payment");
            }

            //simulate success
            const isSuccess = Math.random() < 0.8

            if (isSuccess) {
                await paymentsModel.updateStatus(client, payment.id, "success");
                await client.query("UPDATE orders SET status = $1 WHERE id = $2", ["paid", orderId])

            }else{
                await paymentsModel.updateStatus(client, payment.id, "failed")
            }

            await client.query("COMMIT")
            
            return {paymentId :payment.id, success : isSuccess}

        } catch (err) {
            await client.query("ROLLBACK")
            throw err;

        }finally{
             client.release(); 
        }
    }
}