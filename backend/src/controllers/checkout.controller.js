//handles the http methods
import checkoutService from "../services/checkout.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkoutController = {
    checkout : asyncHandler(
        async (req, res)=>{
            const order = await checkoutService.checkout(req.user.id); //order is tied to the user 
            res.status(201).json(order)// returns the order if the user is valid 
        }
    )
}

export default checkoutController;