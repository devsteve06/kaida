import axios from "axios";

const api = axios.create({
    baseURL :"localhost:5000/api",
    withCredentials  : true // tests everything that comes and goes through 
})

export default api;