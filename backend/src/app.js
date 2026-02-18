import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.route.js'
import cartRoutes from './routes/cart.route.js'
import checkoutRoutes from "./routes/checkout.routes.js"
import paymentRoutes from './routes/payments.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js'
import Stripe from 'stripe';

const port = process.env.PORT || 5001;

const app = express();

//middlewares
app.use(express.json());
app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders',orderRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/payments',paymentRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorHandler)


app.listen(port,console.log(`server successfully running on port ${port}`));

