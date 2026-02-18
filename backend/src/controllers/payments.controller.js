import { paymentService } from "../services/payments.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import Stripe from "stripe";
import paymentFactory from '../services/payments/paymentFactory.js'

const paymentController = {
     initiatePayment : asyncHandler(async (req, res) =>{
      
            const {orderId, provider} = req.body
            const userId = req.user.id;

            // Validate input
            if (!orderId) {
                return res.status(400).json({ message: "Order ID is required" });
            }
            
            if (!provider) {
                return res.status(400).json({ message: "Payment provider is required" });
            }

            const paymentService = paymentFactory(provider);

            const response = await paymentService.initiate({orderId, userId})

            return res.json(response)
       
    })
}

export default paymentController;
