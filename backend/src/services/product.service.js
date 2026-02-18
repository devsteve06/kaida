//contains the business logic of the 
import productModel from "../models/product.model.js";
import { appError } from "../utils/appError.js";

const productService = {
    //implementing pagination here
    async getAllProducts(filters){
        const productsResult = await productModel.findAll(filters);
        const countResult = await productModel.countFiltered(filters);

        const total = Number(countResult.rows[0].count);
        const totalPages = Math.ceil(total/filters.limit)

        return {
            page: filters.page,
            limit : filters.limit,
            total,
            totalPages,
             products : productsResult.rows,total }
    },

    getProduct(id){
        return productModel.findById(id);
    },
    
    createProduct(data){
        if(data.price <= 0){
            throw new appError("Invalid product price", 400);
        }
        return productModel.create(data); 
    },
    
    updateProduct(id, data){
            return productModel.update(id, data);
        },

    dropProduct(id){
        return productModel.softDelete(id); //temporary deletion
    }
}

export default productService;