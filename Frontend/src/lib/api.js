import axios from "axios"

// BUG FIX / CLEANUP: auth.api.js and interview.api.js each created their
// own separate axios.create({...}) with identical config. Two copies of
// the same setup is a maintenance trap (e.g. someone adds a header to one
// and forgets the other). This is now the single source of truth.
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// If a request comes back 401 (expired/invalid session) anywhere in the
// app, force a clean redirect to /login instead of leaving the UI in a
// half-authenticated, confusing state. We skip this for the auth endpoints
// themselves so a failed login attempt doesn't bounce the user away from
// the login page they're already on.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const url = error?.config?.url || ""
        const isAuthEndpoint = url.includes("/api/auth/login") || url.includes("/api/auth/register")

        if (status === 401 && !isAuthEndpoint && window.location.pathname !== "/login") {
            window.location.href = "/login"
        }

        return Promise.reject(error)
    }
)
