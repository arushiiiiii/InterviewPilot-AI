import axios from "axios";


const api =axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,        //axios se by default hume cookies nahi milti, isliye hume withCredentials:true set karna padta hai
})
export async function register({username, email, password}){
    try {
        const response = await api.post("/api/auth/register", {
        username, email, password
        })
        
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function login({email, password}){
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function logout(){
    try {
        const response = await api.get("/api/auth/logout")
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getMe(){
    const response = await api.get("/api/auth/get-me");
    return response.data;
    // try {
    //     const response = await api.get("/api/auth/get-me")
    //     return response.data;
    // } catch (error) {
        // console.log(error)
        // throw error;
    // }
}
