
const paymentsModel = {
    async create(client, {orderId, amount, provider, status, transactionalRef}){
        return await client.query(`INSERT INTO payments(order_id, amount, provider, status, transaction_ref)
            VALUES($1, $2, $3, $4, $5) 
            RETURNING *`,[orderId, amount, provider, status, transactionalRef]); 
    },

   async  updateStatus(client,paymentId, status){
       return  await client.query(`UPDATE payments SET status =$1 WHERE id = $2  RETURNING *`,[status, paymentId])
    }
}

export default paymentsModel;