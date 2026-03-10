import styles from './Footer.module.css'

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
                        <a href="#">Instagram</a>
                        <a href="#">TikTok</a>
                        <a href="#">Telegram</a>
                    </div>
                </div>

                <div className={styles.footerCol}>
                    <div className={styles.footerColTitle}>Platform</div>
                    <ul className={styles.footerLinks}>
                        <li><a href="#">Find an Artist</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">How it Works</a></li>
                    </ul>
                </div>

                <div className={styles.footerCol}>
                    <div className={styles.footerColTitle}>Artists</div>
                    <ul className={styles.footerLinks}>
                        <li><a href="#">Join as Artist</a></li>
                        <li><a href="#">Artist Dashboard</a></li>
                        <li><a href="#">Success Stories</a></li>
                    </ul>
                </div>

                <div className={styles.footerCol}>
                    <div className={styles.footerColTitle}>Support</div>
                    <ul className={styles.footerLinks}>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
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
