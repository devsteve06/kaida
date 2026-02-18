//contains the db querries for the cart
import db from "../db.js";

 const cartModel = {
    async findByUserId(client,userId){
        const result = await client.query(`SELECT * FROM  carts WHERE user_id = $1`,[userId])
        return result.rows[0]//should i result otherwise its false
    },

    async create(client,userId) {
        const result = await client.query(`INSERT INTO carts (user_id) VALUES($1)`,[userId]);
        return result.rows[0]
    },
}

export default cartModel;