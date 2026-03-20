import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className={styles.nav}>
            <Link to="/" className={styles.logo}>
                La<span>Zure</span>
            </Link>

            <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link to="/artists" onClick={() => setMenuOpen(false)}>Find an Artist</Link></li>
                <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
                <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
                <li className={styles.mobileActions}>
                    <Link to="/auth" className={styles.btnOutline} onClick={() => setMenuOpen(false)}>Sign in</Link>
                    <Link to="/booking" className={styles.btnFilled} onClick={() => setMenuOpen(false)}>Book Now</Link>
                </li>
            </ul>

            <div className={styles.navActions}>
                <Link to="/auth" className={styles.btnOutline}>Sign in</Link>
                <Link to="/booking" className={styles.btnFilled}>Book Now</Link>
            </div>

            <button
                className={styles.burger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className={menuOpen ? styles.burgerOpen : ''}></span>
                <span className={menuOpen ? styles.burgerOpen : ''}></span>
                <span className={menuOpen ? styles.burgerOpen : ''}></span>
            </button>
        </nav>
    )
}

export default Navbar
