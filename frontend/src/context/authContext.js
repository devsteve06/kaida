import { Children, createContext, useContext, useEffect,useState } from "react";
import { getCurrentUser,loginUser, logOutUser } from "../services/auth.service";

const authContext = createContext()

export function authProvider({Children}){
    const   [user,setUser] = useState(null); //uses the functions to 
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function fetchUser() {
                try {
                    const res = await getCurrentUser();
                    setUser(res.data); //already parsed in json  by api
                } catch {
                    setUser(null);
                } finally {
                    setLoading(false);
                }
        }

        fetchUser();
    }, []); //useEffect ends here 

    const login = async(data) =>{
        const res = await loginUser(data);
        setUser(res.data.user)
        return res;
    }

    const logout = async () =>{
        await logOutUser();
        setUser(null); // invalidates the users
    }
     
        return (
            <authContext.Provider  value={{user, login, logout, loading}}>
            {children}
            </authContext.Provider>
        )
}

export function useAuth(){
    return useContext(authContext);
}
