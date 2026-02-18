import express, { response } from 'express';
import orderModel from '../models/order.model.js';

const router = express.Router();

router.post('/callback', async (req, res)=>{
    try {
        const callback = req.body.Body.stkcallback;

        const resultCode = callback.ResultCode;
        const metadata = callback.Callbackmetadata?.Item || [];

        const orderRef = callback.AccountReference;
        const orderId = orderRef?.split("-")[1];

        if(resultcode === 0) {
            const mpesaReceipt = metadata.find( i => i.Name === "MpesaReceiptNumber")?.Value;

            await orderModel.markAsPaid(orderId, mpesaReceipt);

        }else{
            await orderModel.markAsFailed(orderId)
        }

        response.json({ResultCode : 0, Resultdesc : 'Accepted'})
    } catch (error) {
        console.error("M-pesa callback error", err);
        res.status(500).json({message : "Calling processing failed"})
    }
})

export default router;