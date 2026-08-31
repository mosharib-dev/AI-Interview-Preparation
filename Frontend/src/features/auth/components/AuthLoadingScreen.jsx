import { useEffect, useState } from 'react'
import './auth-loading.scss'

const STATUS_MESSAGES = [
    'Connecting to server...',
    'Verifying your session...',
    'This can take up to a minute if the server was asleep...',
    'Almost there...',
]

const AuthLoadingScreen = () => {
    const [ stepIndex, setStepIndex ] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((i) => (i + 1) % STATUS_MESSAGES.length)
        }, 1300)
        return () => clearInterval(interval)
    }, [])

    return (
        <main className='auth-loading'>
            <div className='auth-loading__content'>
                <div className='auth-loading__brand'>
                    <span className='auth-loading__brand-icon'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
                        </svg>
                    </span>
                    <span>InterviewAI</span>
                </div>

                <div className='auth-loading__spinner'>
                    <span className='auth-loading__ring' />
                </div>

                <p key={stepIndex} className='auth-loading__status'>
                    {STATUS_MESSAGES[ stepIndex ]}
                </p>
            </div>
        </main>
    )
}

export default AuthLoadingScreen