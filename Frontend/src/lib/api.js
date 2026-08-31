import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 45000,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const url = error?.config?.url || ""
        const isExemptEndpoint = ["/api/auth/login", "/api/auth/register", "/api/auth/getme"]
            .some((path) => url.includes(path))

        if (status === 401 && !isExemptEndpoint && window.location.pathname !== "/login") {
            window.location.href = "/login"
        }

        return Promise.reject(error)
    }
)