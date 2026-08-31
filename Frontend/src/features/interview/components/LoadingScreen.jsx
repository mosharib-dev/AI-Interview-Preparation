import { useEffect, useState } from 'react'
import '../style/loading.scss'

const DEFAULT_STEPS = [
    'Reading your profile...',
    'Analyzing the job description...',
    'Identifying key skill matches...',
    'Crafting tailored questions...',
    'Building your preparation roadmap...',
]

const LoadingScreen = ({ title = 'Crafting Your Interview Plan', steps = DEFAULT_STEPS }) => {
    const [ stepIndex, setStepIndex ] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex(prev => (prev + 1) % steps.length)
        }, 2200)
        return () => clearInterval(interval)
    }, [ steps.length ])

    return (
        <main className='loading-screen'>
            <div className='loading-screen__card'>
                <div className='loading-screen__spinner'>
                    <span className='loading-screen__spinner-ring' />
                    <svg className='loading-screen__spinner-icon' xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
                    </svg>
                </div>

                <h1 className='loading-screen__title'>{title}</h1>

                <div className='loading-screen__status'>
                    <span className='loading-screen__status-dot' />
                    <p key={stepIndex} className='loading-screen__status-text'>{steps[ stepIndex ]}</p>
                </div>

                <div className='loading-screen__bar'>
                    <span />
                </div>

                <p className='loading-screen__hint'>This usually takes about 30 seconds. Please don&apos;t close this tab.</p>
            </div>
        </main>
    )
}

export default LoadingScreen
