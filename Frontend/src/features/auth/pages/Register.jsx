import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth, getErrorMessage } from '../hooks/useAuth'

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
)
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a17.4 17.4 0 0 1-3.24 4.26M6.61 6.61C3.9 8.5 2 12 2 12s3.5 8 10 8a9.26 9.26 0 0 0 5.39-1.61M1 1l22 22" /><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /></svg>
)
const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
)
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
)

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ error, setError ] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setError(getErrorMessage(err, "Couldn't create your account. Please check your details and try again."))
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-layout">

                {/* ── Branding Panel ── */}
                <aside className="auth-branding">
                    <div className="brand-mark">
                        <span className="brand-mark__icon"><SparkleIcon /></span>
                        <span className="brand-mark__name">InterviewAI</span>
                    </div>

                    <div className="brand-copy">
                        <h1>Create your account and <span>start preparing</span></h1>
                        <p>It takes less than a minute. Paste a job description, add your resume, and get a personalized interview strategy instantly.</p>
                    </div>

                    <ul className="brand-features">
                        <li><span className="feature-tick"><CheckIcon /></span>Free to get started</li>
                        <li><span className="feature-tick"><CheckIcon /></span>Unlimited saved interview plans</li>
                        <li><span className="feature-tick"><CheckIcon /></span>Downloadable, tailored resume</li>
                    </ul>
                </aside>

                {/* ── Form Panel ── */}
                <section className="auth-form-panel">
                    <div className="mobile-brand">
                        <span className="mobile-brand__icon"><SparkleIcon /></span>
                        <span>InterviewAI</span>
                    </div>

                    <div className="form-container">
                        <div className="form-heading">
                            <h1>Create your account</h1>
                            <p>Set up your profile to start generating interview plans.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="form-error">{error}</div>
                            )}

                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-shell">
                                    <span className="input-icon"><UserIcon /></span>
                                    <input
                                        onChange={(e) => { setUsername(e.target.value) }}
                                        value={username}
                                        type="text" id="username" name="username" placeholder="Choose a username" required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-shell">
                                    <span className="input-icon"><MailIcon /></span>
                                    <input
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        value={email}
                                        type="email" id="email" name="email" placeholder="you@example.com" required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-shell input-shell--password">
                                    <span className="input-icon"><LockIcon /></span>
                                    <input
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        value={password}
                                        type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Create a password" minLength={8} required />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(s => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                <p className="field-hint">Must be at least 8 characters.</p>
                            </div>

                            <button className="button primary-button" type="submit" disabled={loading}>
                                {loading && <span className="spinner" />}
                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="form-footer">Already have an account? <Link to={"/login"}>Log in</Link></p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Register
