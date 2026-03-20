import styles from './Footer.module.css'
import { Link } from 'react-router-dom'

const Footer = () => {

    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className={styles.footerBrand}>
                    <div className={styles.footerLogo}>La<span>Zure</span></div>
                    <p className={styles.footerTagline}>
                        Your go-to platform for discovering and booking talented nail artists in Armenia.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
                        <a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
                    </div>
                </div>

                <div className={styles.footerCol}>
                    <div className={styles.footerColTitle}>Platform</div>
                    <ul className={styles.footerLinks}>
                        <li><Link to="/artists">Find an Artist</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/#how-it-works">How it Works</Link></li>
                    </ul>
                </div>

                <div className={styles.footerCol}>
                    <div className={styles.footerColTitle}>Artists</div>
                    <ul className={styles.footerLinks}>
                        <li><Link to="/auth">Join as Artist</Link></li>
                        <li><Link to="/dashboard/artist">Artist Dashboard</Link></li>
                        <li><Link to="/about">About LaZure</Link></li>
                    </ul>
                </div>

                <div className={styles.footerCol}>
                    <div className={styles.footerColTitle}>Support</div>
                    <ul className={styles.footerLinks}>
                        <li><Link to="/about">Help Center</Link></li>
                        <li><Link to="/about">Contact Us</Link></li>
                        <li><Link to="/about">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div>© 2026 LaZure. All rights reserved.</div>
            </div>
        </footer>
    )
}

export default Footer
