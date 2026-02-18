//handles the http req and res for user related routes
import asyncHandler from "../utils/asyncHandler.js"
import userService from '../services/user.service.js';
import orderService from '../services/order.service.js';
import { signToken } from '../utils/jwt.js'; //issues token at login 

export const userController = {
  register: asyncHandler( async(req, res, next) => {
   
    const user = await userService.register(req.body,req.user);
    
    res.status(201).json(user);
  }),

  login: asyncHandler(async (req, res, next) => {

    const result = await userService.login(req.body);
    res.status(200).json(result);
  }),

  me: asyncHandler(async (req, res, next) => {
    // req.user is populated by the authenticate middleware
    res.json(req.user);
  })
,

  getOrders: asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const orders = await orderService.getOrdersByUser(userId);
    res.status(200).json(orders);
  })
}

export default userController;     