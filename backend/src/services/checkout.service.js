//handles the checkout service by integrating the value

import db from "../db.js";
import cartModel from "../models/cart.model.js";
import cartItemsModel from "../models/cart_items.model.js";
import orderItemsModel from "../models/order.items.model.js";
import orderModel from "../models/order.model.js"

const checkoutService = {
    async checkout(userId){

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const cart = await cartModel.findByUserId(client, userId);

        if (!cart) {
            throw new Error("cart not found");
        }

        const items = await cartItemsModel.getItems(client, cart.id);

        if (!items.length) {
            throw new Error("cart is empty");
        }

        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await orderModel.createOrder(client, userId, total);

        for (const item of items) {
            await orderItemsModel.create(
                client,
                order.id,
                item.product_id,
                item.quantity,
                item.price
            );
        }

        await cartItemsModel.clearCart(client, cart.id);

        await client.query("COMMIT");

        return order;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

}

export default checkoutService;