import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import paymentController from "../controllers/payments.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/payments/{orderId}/pay:
 *   post:
 *     summary: Initiate payment for order
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to pay for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [stripe, mpesa]
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 default: KES
 *               phoneNumber:
 *                 type: string
 *                 description: Required for M-Pesa payments
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *       400:
 *         description: Invalid input or order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:orderId/pay', authenticate, paymentController.initiatePayment);

export default router;
