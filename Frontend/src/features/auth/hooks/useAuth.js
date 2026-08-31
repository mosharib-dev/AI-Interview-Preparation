import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

// Pulls a friendly message out of an axios error, falling back sensibly
// when the backend is unreachable or returns something unexpected.
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
    if (err?.response?.data?.message) return err.response.data.message
    if (err?.request && !err?.response) return "Can't reach the server. Please check your connection and try again."
    return fallback
}

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data.user
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data.user
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch {
                // A failed getMe() on first load just means "not logged in" —
                // this one is fine to swallow since Protected.jsx already
                // reacts correctly to `user` staying null.
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

        // eslint-disable-next-line react-hooks/exhaustive-deps -- setUser/setLoading are stable context setters
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
