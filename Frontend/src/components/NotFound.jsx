import { Link } from 'react-router'
import './NotFound.scss'

const NotFound = () => (
    <main className='not-found'>
        <div className='not-found__card'>
            <h1>404</h1>
            <p>We couldn't find the page you're looking for.</p>
            <Link to='/' className='button primary-button'>Back to Home</Link>
        </div>
    </main>
)

export default NotFound
