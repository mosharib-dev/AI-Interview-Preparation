import { Component } from 'react'
import './ErrorBoundary.scss'

// BUG FIX: there was no error boundary anywhere in the app. Any uncaught
// render-time exception (a malformed AI report missing an expected field,
// a third-party script failure, etc.) would unmount the entire React tree
// and leave the user staring at a blank white page with no way to recover
// short of manually reloading.
class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error('Unhandled UI error:', error, info)
    }

    handleReload = () => {
        window.location.href = '/'
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className='error-boundary'>
                    <div className='error-boundary__card'>
                        <h1>Something went wrong</h1>
                        <p>An unexpected error occurred. Please try reloading the page — if the problem continues, come back a bit later.</p>
                        <button className='button primary-button' onClick={this.handleReload}>Back to Home</button>
                    </div>
                </main>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
