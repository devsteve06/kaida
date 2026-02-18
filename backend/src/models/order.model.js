//handles the order models
import db from "../db.js";


const orderModel = {
     async createOrder(client, userId, totalAmount){
      
        const result = await client.query(`INSERT INTO orders(user_id, total_amount) VALUES($1,$2) RETURNING *`, [userId, totalAmount]);
        return  result.rows[0];
     } , 

     async findById(orderId) {
  const result = await db.query(
    `
    SELECT 
        o.id,
        o.user_id,
        o.status,
        COALESCE(
            json_agg(
                json_build_object(
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price_at_purchase
                )
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'
        ) AS items,
        COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_amount
    FROM orders o
    LEFT JOIN order_items oi
        ON oi.order_id = o.id
    WHERE o.id = $1
    GROUP BY o.id
    `,
    [orderId]
  );

  return result.rows[0];
},
    async findByUser(userId) {
      const result = await db.query(
        `
        SELECT 
            o.id,
            o.user_id,
            o.status,
            o.create_at,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price_at_purchase
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items,
            COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_amount
        FROM orders o
        LEFT JOIN order_items oi
            ON oi.order_id = o.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.create_at DESC
        `,
        [userId]
      );

      return result.rows;
    }

     }

    
     


export default orderModel;