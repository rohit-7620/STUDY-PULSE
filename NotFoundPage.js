import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="not-found-page container" style={styles.page}>
            <h1 style={styles.heading}>404</h1>
            <h2 style={styles.subheading}>Page Not Found</h2>
            <p style={styles.text}>
                Oops! The page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Link to="/" className="btn-primary" style={styles.button}>
                Go Back to Home
            </Link>
            {/* You could add a search bar or suggested links here */}
        </div>
    );
}

// Basic inline styles for simplicity (can move to a CSS file if preferred)
const styles = {
    page: {
        textAlign: 'center',
        paddingTop: '60px',
        paddingBottom: '60px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px - 60px)', // Adjust based on Navbar/Footer
    },
    heading: {
        fontSize: '6rem',
        fontWeight: '700',
        color: 'var(--primary-color)',
        margin: '0',
    },
    subheading: {
        fontSize: '2rem',
        fontWeight: '600',
        color: 'var(--text-dark)',
        margin: '10px 0 20px',
    },
    text: {
        fontSize: '1.1rem',
        color: '#6c757d',
        maxWidth: '500px',
        marginBottom: '30px',
    },
    button: {
        padding: '12px 30px',
        fontSize: '1.1rem',
    }
};

export default NotFoundPage; 