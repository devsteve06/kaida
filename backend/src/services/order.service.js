import db from '../db.js';
import orderItemsModel from '../models/order.items.model.js';
import cartService from '../services/cart.service.js';
import orderModel from '../models/order.model.js';
import cartItemsModel from '../models/cart_items.model.js';
import cartModel from '../models/cart.model.js';


const orderService = {
    async createFromCart(userId) {
        const client = await db.connect();

        try {
            await client.query("BEGIN");

            const { items } = await cartService.getCart(client, userId);

            if (!items.length) {
                throw new Error("cart is empty");
            }

            const total = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const order = await orderModel.createOrder(client, userId, total);

            if (!order) {
                throw new Error("Failed to create order");
            }

            for (const item of items) {
                await orderItemsModel.create(
                    client,
                    order.id,
                    item.product_id,
                    item.quantity,
                    item.price
                );
            }

            const cart = await cartModel.findByUserId(client, userId);
            if (cart) {
                await cartItemsModel.clearCart(client, cart.id);
            }

            await client.query("COMMIT");

            return order;

        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async fetchExistingOrder (orderId){
        const result = await orderModel.findById(orderId)
    }
,

    async getOrdersByUser(userId) {
        const orders = await orderModel.findByUser(userId);
        return orders;
    }
};

export default orderService;   
