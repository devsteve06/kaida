import api from '../../api'

export const loginUser = async  (data) =>{
    return api.post("/auth/login", data);
};

export const registerUser = async (data) =>{
    return api.post("/auth/register", data)
}

export const getCurrentUser =async  () =>{
    return api.get("/auth/me")
}

export const logOutUser = async () =>{
    return api.post("/auth/logout");
}