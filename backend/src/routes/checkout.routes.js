import express from 'express';
import checkoutController from "../controllers/checkout.controller.js";
import authenticate from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Process checkout
 *     description: Validate order, calculate totals, and create order
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: string
 *               billingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [stripe, mpesa]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout processed successfully
 *       400:
 *         description: Invalid input or checkout failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, checkoutController.checkout);

export default router; 