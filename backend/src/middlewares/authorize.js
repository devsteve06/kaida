//handles authorization

export const authorize = (...allowedRoles) =>{
     (req, res, next) => {
        const userRole = req.user.role;
     }
}