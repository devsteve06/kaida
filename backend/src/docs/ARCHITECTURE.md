# Backend Architecture

## Overview
**Kaida** is a Node.js + Express + PostgreSQL e-commerce backend implementing a layered architecture with clear separation of concerns. The system handles user authentication, product management, shopping carts, orders, and payment processing through multiple payment gateways.

**Version:** 1.0.0  
**Author:** Stephen Ogwel  
**License:** ISC

---

## Technology Stack

### Core
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.2.1
- **Database:** PostgreSQL (pg 8.18.0)
- **Environment:** dotenv for configuration management

### Authentication & Security
- **JWT:** jsonwebtoken 9.0.3 for token-based auth
- **Encryption:** bcrypt 6.0.0 for password hashing
- **Validation:** Joi 18.0.2 + express-validator 7.3.1

### Payment Integration
- **Stripe:** stripe 20.3.1
- **M-Pesa:** Custom integration via axios

### Additional Tools
- **Image Storage:** Cloudinary 2.9.0
- **API Documentation:** Swagger/OpenAPI (swagger-jsdoc, swagger-ui-express)
- **HTTP Client:** axios 1.13.5
- **CORS:** cors 2.8.6
- **Development:** nodemon 3.1.11
- **Testing:** Jest 30.2.0

---

## Architecture Layers

### 1. **Routes Layer** (`/routes`)
HTTP endpoint definitions that map requests to controllers.

**Responsibilities:**
- Define REST API endpoints
- Attach route-specific middleware
- Delegate to controller handlers

**Files:**
- `user.routes.js` - User authentication and profile endpoints
- `product.routes.js` - Product catalog endpoints
- `cart.routes.js` - Shopping cart endpoints
- `order.routes.js` - Order management endpoints
- `checkout.routes.js` - Checkout flow endpoints
- `payments.routes.js` - Payment processing endpoints

### 2. **Controllers Layer** (`/controllers`)
HTTP request/response handlers that validate input and orchestrate business logic.

**Responsibilities:**
- Extract and validate request data
- Call appropriate service methods
- Format and return HTTP responses
- Pass errors to global error handler

**Files:**
- `user.controller.js` - User registration, login, profile updates
- `product.controller.js` - Product CRUD operations
- `cart.controller.js` - Add, remove, update cart items
- `order.controller.js` - Order creation and retrieval
- `checkout.controller.js` - Checkout process orchestration
- `payments.controller.js` - Payment initiation and webhooks

### 3. **Services Layer** (`/services`)
Business logic implementation. Services are **stateless** and **response-agnostic**.

**Responsibilities:**
- Implement business rules
- Coordinate with models for data operations
- Never send HTTP responses
- Throw errors for controllers to handle

**Core Services:**
- `user.service.js` - User management logic
- `product.service.js` - Product operations
- `cart.service.js` - Cart calculations
- `order.service.js` - Order processing
- `checkout.service.js` - Checkout workflow
- `payments.service.js` - Payment orchestration

**Payment Subservices** (`/services/payments`):
- `paymentFactory.js` - Factory pattern for payment providers
- `stripeService.js` - Stripe payment processing
- `mpesaService.js` - M-Pesa payment processing

### 4. **Models Layer** (`/models`)
Database access layer using raw SQL queries via PostgreSQL client.

**Responsibilities:**
- Execute database queries
- Return raw data from database
- Contain **no business logic**
- No error handling (pass to services)

**Models:**
- `user.models.js` - User CRUD operations
- `product.model.js` - Product data access
- `cart.model.js` - Cart persistence
- `cart_items.model.js` - Cart item operations
- `order.model.js` - Order storage
- `order_items.model.js` - Order item storage
- `payments.model.js` - Payment record storage

---

## Middleware (`/middlewares`)

### 1. **auth.middleware.js**
Bearer token validation using JWT.

**Flow:**
```
Request Header: Authorization: Bearer <token>
↓
Extract token from Bearer scheme
↓
Verify signature using JWT secret
↓
Attach decoded user (id, email) to req.user
↓
Pass to next middleware/controller
```

### 2. **authorize.js**
Role-based access control (RBAC) for protected endpoints.

**Responsibility:** Verify user roles and permissions after authentication.

### 3. **errorHandler.js**
Global centralized error handling middleware (attached last to app).

**Responsibilities:**
- Catch all thrown errors from route handlers
- Format error responses consistently
- Log errors for debugging
- Return appropriate HTTP status codes

### 4. **validate.js**
Request validation middleware using Joi or express-validator schemas.

**Responsibility:** Validate request body, params, and query before passing to controllers.

---

## Utilities (`/utils`)

### **jwt.js**
JWT token generation and verification utilities.

**Functions:**
- `generateToken(payload, secret, expiry)` - Create signed tokens
- `verifyToken(token, secret)` - Validate and decode tokens

### **appError.js**
Custom error class for consistent error handling.

**Usage:** Thrown by services/controllers and caught by global error handler.

### **asyncHandler.js**
Wrapper function to catch async errors in controllers.

**Purpose:** Eliminates need for try-catch blocks in async route handlers.

---

## Validators (`/validators`)

Request schema definitions for input validation.

- `user.schema.js` - User registration/login validation rules
- `products.validator.js` - Product creation/update validation rules

---

## Key Architectural Decisions

### 1. **Service Layer Independence**
- Services **do not send HTTP responses**
- Services **do not access req/res objects**
- Services throw errors for controllers to handle
- **Benefit:** Services can be reused in different contexts (API, CLI, webhooks)

### 2. **Model Layer Simplicity**
- Models contain **only database queries**
- Models contain **no business logic**
- Models return raw database results
- **Benefit:** Easy to maintain and test

### 3. **Error Handling Strategy**
- **Global error handler** catches all errors
- Custom `AppError` class for consistent error objects
- Async errors wrapped via `asyncHandler`
- **Benefit:** Centralized error logging and formatting

### 4. **Authentication & Authorization**
- **JWT-based stateless authentication**
- Bearer token validation in `auth.middleware.js`
- User info attached to `req.user` for downstream use
- **Soft deletes** for products (logical deletion)

### 5. **Payment Processing**
- **Factory pattern** for multiple payment providers
- `paymentFactory.js` instantiates correct payment service
- Support for Stripe and M-Pesa
- Decoupled payment logic from order processing

### 6. **Database**
- PostgreSQL for relational data
- Raw SQL queries (no ORM)
- Connection pooling via pg client

---

## Request/Response Flow Example

### User Registration Flow
```
POST /api/users/register
  ↓
validate.js (Request validation via Joi schema)
  ↓
user.controller.registerUser()
  ├─ Extract email, password from req.body
  ├─ Call user.service.registerUser()
  │   ├─ Hash password with bcrypt
  │   ├─ Call user.model.createUser()
  │   │   └─ Execute INSERT SQL query
  │   └─ Return created user object
  ├─ Generate JWT token
  └─ Return 201 { user, token }
```

### Product Purchase Flow
```
POST /api/checkout
  ↓
authenticate (JWT validation)
  ↓
checkout.controller.processCheckout()
  ├─ Call checkout.service.validateOrder()
  │   └─ Verify inventory via product.model
  ├─ Call payments.service.processPayment()
  │   ├─ paymentFactory.getProvider('stripe')
  │   ├─ stripeService.charge()
  │   └─ Return payment confirmation
  ├─ Call order.service.createOrder()
  │   ├─ order.model.insert()
  │   └─ order_items.model.insert()
  └─ Return 200 { orderId, paymentId }
  
Error at any step → errorHandler catches → 400/500 response
```

---

## Environment Variables
Configure via `.env` file:
```
PORT=5001
DATABASE_URL=postgresql://user:pass@localhost/kaida_db
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLIC_KEY=pk_...
MPESA_API_KEY=...
CLOUDINARY_NAME=...
NODE_ENV=development
```

---

## API Documentation
Interactive Swagger UI available at: `/docs`

Generated from JSDoc comments in route files via `swagger.js` configuration.

---

## Deployment Considerations

1. **Environment:** Node.js production mode (`NODE_ENV=production`)
2. **Database:** Connection pooling configured in production
3. **Error Logging:** Implement structured logging (Winston, Pino)
4. **Monitoring:** Add APM tools for performance tracking
5. **Security:** Rate limiting, input sanitization, helmet.js
6. **Payment:** Use webhook signatures for payment verification
