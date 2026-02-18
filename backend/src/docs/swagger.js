//handles documentation 
import swaggerJSDoc from "swagger-jsdoc";

export default swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Kaida E-Commerce API',
            version: '1.0.0',
            description: 'Complete REST API documentation for the Kaida e-commerce platform with user authentication, product management, shopping cart, orders, and payment processing'
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            },
            {
                url: 'https://api.kaida.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Bearer token for authentication'
                }
            }
        },
        tags: [
            {
                name: 'Users',
                description: 'User authentication and profile endpoints'
            },
            {
                name: 'Products',
                description: 'Product catalog management'
            },
            {
                name: 'Cart',
                description: 'Shopping cart operations'
            },
            {
                name: 'Orders',
                description: 'Order management'
            },
            {
                name: 'Checkout',
                description: 'Checkout process'
            },
            {
                name: 'Payments',
                description: 'Payment processing (Stripe & M-Pesa)'
            }
        ]
    },
    apis: ["./src/routes/*.js"]
});
