const API_BASE_URL=import.meta.env.BACKEND_API||'http://localhost:3000/api'

const request=async(endpoint,method,payload)=>{
    const response=await fetch(`${API_BASE_URL}${endpoint}`,{
        method,
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(payload)

    })
    const data=await response.json()

    if(!response.ok){
        const error=new Error(data.message||"Something Went Wrong")
        error.status=response.status
        error.data=data
        throw error
    }

    return data
}

export function registerUser(payload){
    return request("/auth/register","POST",payload)
}

export function verifyEmail(payload) {
  return request("/auth/verify-otp", "POST", payload);
}

export function loginUser(payload) {
  return request("/auth/login", "POST", payload);
}

export function forgotPassword(payload) {
  return request("/auth/forgot-password", "POST", payload);
}

export function resetPassword(payload) {
  return request("/auth/reset-password", "POST", payload);
}