import db from '../db.js'

const  userModel = {
    //create a new user
    create({name, email, passwordHash, role},currentUser){
        const finalRole = currentUser?.role === "admin " && role ?role : "user"
        return db.query(
            `INSERT INTO users(name, email, password_hash, role)
            VALUES($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at`, [name, email, passwordHash, finalRole]
        );
    },

    //find user by email (used in login )

    findByEmail(email){
        return db.query(
            `SELECT * FROM users WHERE email =$1`,[email]
        )
    },

    //find user by id (used with auth middleware)
    findById(id){
        return db.query(`SELECT name, email, role, created_at FROM users WHERE  ID = $1`,[id]);
    }
}

export default userModel;