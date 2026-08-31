import './auth-loading.scss'

const AuthLoadingScreen = () => {
    return (
        <main className='auth-loading'>
            <div className='auth-loading__spinner'>
                <span className='auth-loading__ring' />
                <svg className='auth-loading__icon' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
                </svg>
            </div>
        </main>
    )
}

export default AuthLoadingScreen
