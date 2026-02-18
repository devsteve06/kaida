// will handle the order http
import orderService from "../services/order.service.js";
import asyncHandler from "../utils/asyncHandler.js";


const orderController = {
    fetch : asyncHandler(async (req, res) =>{
        const result = await orderService.getOrders(orderId)
        res.status(200).json(result)
        
    }),
    
    checkout : asyncHandler( async (req, res) =>{
        const order =  await orderService.createFromCart(req.user.id);
        res.status(201).json(order);
    })
    
}

export default orderController;