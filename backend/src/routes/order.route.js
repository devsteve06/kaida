import orderController from "../controllers/order.controller.js";
import express from "express";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', authenticate, orderController.fetch)

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Create order from cart
 *     tags:
 *       - Orders
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
 *             properties:
 *               shippingAddress:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input or empty cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/checkout', authenticate, orderController.checkout);

export default router;