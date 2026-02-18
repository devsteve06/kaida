import Joi from "joi";

/**
 * Validation for creating a product
 */
export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required(),

  description: Joi.string()
    .min(5)
    .max(2000)
    .required(),

  price: Joi.number()
    .positive()
    .precision(2)
    .required(),

  stock: Joi.number()
    .integer()
    .min(0)
    .required(),

  category_id: Joi.number()
    .integer()
    .positive()
    .required()
  
});


/**
 * Validation for updating a product
 * (all fields optional)
 */
export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255),

  description: Joi.string()
    .min(5)
    .max(2000),

  price: Joi.number()
    .positive()
    .precision(2),

  stock: Joi.number()
    .integer()
    .min(0),

  category_id: Joi.number()
    .integer()
    .positive()
}).min(1); // must update at least one field


/**
 * Validation for query params
 * Pagination + filtering + sorting
 */
export const productQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  search: Joi.string()
    .min(1)
    .max(255)
    .optional(),

  minPrice: Joi.number()
    .positive()
    .optional(),

  maxPrice: Joi.number()
    .positive()
    .optional(),

  category: Joi.number()
    .integer()
    .positive()
    .optional(),

  sortBy: Joi.string()
    .valid("price", "created_at", "name")
    .default("created_at"),

  order: Joi.string()
    .valid("asc", "desc")
    .default("desc")
});

