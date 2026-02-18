//handles retrieving data from the db
import db from "../db.js";

const ALLOWED_SORT_FIELDS = ["price", "created_at", "name"]
const ALLOWED_ORDER = ["asc","desc"]

const productModel = {
    //retrieves all products from the database
    findAll({page, limit, search, minPrice, maxPrice, category, sortBy, order}){
        const offset = (page-1)*limit;
        
        let query = `SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.created_at,
            c.name AS category
        from products p
        JOIN categories c ON p.category_id = c.id 
         WHERE p.is_active = true`

        const values = [];
        let idx = 1; //to align with human based indexing 

        if (search) {
            query += ` AND (p.name ILIKE $${idx} OR p.description ILIKE $${idx})`;
            values.push(`%${search}%`);
            idx++;
        }

        if (minPrice) {
            query += ` AND p.price >= $${idx}`;
            values.push(minPrice);
            idx++;
        }

        if (maxPrice) {
            query += ` AND p.price <= $${idx}`;
            values.push(maxPrice);
            idx++;
        }

        if (category) {
            query +=` AND p.category_id = $${idx}`;
            values.push(category);
            idx++;
        }

        const SORT_FIELD_MAP ={
            price : "p.price",
            created_at : "p.created_at",
            name : "p.name"
        }
        const sortField = SORT_FIELD_MAP[sortBy] || "p.created_at" // matches user input to exact tables columns 
        const sortOrder = ALLOWED_ORDER.includes(order?.toLowerCase()) ? order.toUpperCase() :"DESC"

        query += ` ORDER BY ${sortField} ${sortOrder} LIMIT $${idx} OFFSET $${idx+1} `;

        values.push(limit, offset);

        return db.query(query, values)

    },

        countFiltered({search, minPrice, maxPrice, category}){
            let query = `SELECT COUNT(*) FROM products p WHERE p.is_active = true`;

            const values = [];
            let idx = 1;

            if (search) {
                query += ` AND (p.name ILIKE $${idx} OR p.description ILIKE $${idx})`;
                values.push(`%${search}%`);
                idx++;
            }

             if (minPrice) {
            query += ` AND p.price >= $${idx}`;
            values.push(minPrice);
            idx++;
            }

             if (maxPrice) {
            query += ` AND p.price <= $${idx}`;
            values.push(maxPrice);
            idx++;
            }

            if (category) {
                query += ` AND p.category_id = $${idx}`;
                values.push(category);
                idx++;
            }

            
            return db.query(query, values);

        },
    

    //obtains  products using their id
    findById(id){

        return db.query(
            "SELECT * from products WHERE id =$1",[id]
        );
    },

    //creating a new product (admin role)
    create(data){
        const {name,description,price,stock,category_id} = data; // obj destructuring 
        return db.query(
            `INSERT INTO products(name,
            description,price,stock, category_id) 
            VALUES($1,$2,$3,$4, $5)
            RETURNING *`,[name, description, price, stock, category_id]
        );
    
    },

    //update an existing product 
    update(id,data){
        const {name, description, price, stock} = data
        return db.query(
                `UPDATE products
                SET name=$1, description=$2, price=$3, stock=$4
                WHERE id =$5
                RETURNING *`,[name, description, price, stock, id]
        )
    },

    //hard deleting an item
    softDelete(id){
        return db.query(`
            UPDATE products SET is_active =false WHERE id = $1`,[id]
        )
    }
}

export default productModel;
