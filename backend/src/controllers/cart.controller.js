//
import  cartService  from "../services/cart.service.js";
import asyncHandler from  '../utils/asyncHandler.js'
import db from '../db.js';

export const cartController = {
    //define the route for 
    getCart : asyncHandler( async (req, res, next)=>{
        const client = await db.connect();
        try {
            const data = await cartService.getCart(client, req.user.id);
            res.json(data);
        } finally {
            client.release();
        }
    }),

    addItem :  asyncHandler( async (req, res, next) =>{
        const {productId, quantity} = req.body;
        const client = await db.connect();
        try {
            const item = await cartService.addToCart(
                client,
                req.user.id,
                Number(productId),
                Number(quantity)
            )
            res.status(201).json(item);
        } finally {
            client.release();
        }
    })
}