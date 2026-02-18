import asyncHandler from "../utils/asyncHandler.js"
import productService from "../services/product.service.js";

export const productController = {
    //gets all the products
    list : asyncHandler(async (req,res,next) => {
        const page  = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10; // number of items that can be display per page 

        const filters = {
            page,
            limit,
            search : req.query.search,
            minPrice : req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice : req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            category : req.query.category,
        }

        const {products, total} = await productService.getAllProducts(filters);

        res.json({page, total, limit, totalPages : Math.ceil(total/limit), products
        });
    }),

     get : asyncHandler( async (req,res,next) =>{
        const result = await productService.getProduct(req.params.id);
        res.json(result.rows[0]);
    }),

    create : asyncHandler(async(req,res,next) => {
        const result = await productService.createProduct(req.body);
        res.status(201).json(result.rows[0])
    }),

    update : asyncHandler( async(req,res,next) =>{
        const result = await productService.updateProduct(req.params.id, req.body);
        res.json(result.rows[0])

    }),
    
     remove : asyncHandler( async (req,res,next) =>{
        const result = await productService.dropProduct(req.params.id)
        res.status(204).send()
    })
}