import db from "../db.js";

//to understand cartItemsModel 
 const cartItemsModel = {
    async addItem (client,cartId, productId, quantity){
        const result = await client.query(`INSERT INTO cart_items(cart_id, product_id, quantity) VALUES($1, $2, $3)
            ON CONFLICT (cart_id, product_id) 
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
            RETURNING *`, [cartId, productId, quantity]);
            
            return result.rows[0]
    },

    async getItems(client, cartId){
        const result = await client.query(`
            SELECT
            ci.id,
            ci.quantity,
            p.id AS product_id,
            p.name,
            p.price
            FROM  cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1
            `,
            [cartId]
        );
        return result.rows;
    },

    async clearCart(client, cartId){
        return client.query(` DELETE FROM cart_items WHERE cart_id =$1`, [cartId]);
    }
};

export default cartItemsModel;
