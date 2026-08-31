import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './AppHeader.scss'

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
)
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
)

// BUG FIX: there was no logout control anywhere in the UI. The backend
// route (/api/auth/logout) and hook (handleLogout) both existed and
// worked, but nothing in the app ever called them — once logged in, a
// user had no way to log out short of manually clearing cookies.
const AppHeader = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const [ loggingOut, setLoggingOut ] = useState(false)

    const onLogout = async () => {
        setLoggingOut(true)
        try {
            await handleLogout()
        } catch (err) {
            // even if the server call fails, the cookie clearing on the
            // client side + local user state reset means we should still
            // send the person back to login rather than leave them stuck
            console.log(err)
        } finally {
            setLoggingOut(false)
            navigate('/login')
        }
    }

    return (
        <header className='app-header'>
            <Link to='/' className='app-header__brand'>
                <span className='app-header__brand-icon'><SparkleIcon /></span>
                <span>InterviewAI</span>
            </Link>

            {user && (
                <div className='app-header__user'>
                    <span className='app-header__username'>{user.username}</span>
                    <button
                        className='app-header__logout'
                        onClick={onLogout}
                        disabled={loggingOut}
                    >
                        <LogoutIcon />
                        {loggingOut ? 'Logging out...' : 'Log Out'}
                    </button>
                </div>
            )}
        </header>
    )
}

export default AppHeader
