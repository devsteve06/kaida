import db from "../db.js";

const orderItemsModel = {

    async create(client, orderId, productId, quantity, priceAtPurchase){
        return await client.query(`INSERT INTO order_items(order_id, product_id, quantity, price_at_purchase)
             VALUES($1, $2, $3, $4)`,[orderId, productId, quantity, priceAtPurchase]);
    }
}

export default  orderItemsModel;
