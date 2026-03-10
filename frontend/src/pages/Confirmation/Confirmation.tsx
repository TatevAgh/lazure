import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Confirmation.module.css'

const Confirmation = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { artistName, service, date, time } = location.state || {}

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <div className={styles.checkmark}>✓</div>
                <h1 className={styles.title}>Booking Confirmed!</h1>
                <p className={styles.sub}>Your appointment has been successfully booked</p>

                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Artist</span>
                        <span className={styles.detailValue}>{artistName || 'Nails by Gaya'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Service</span>
                        <span className={styles.detailValue}>{service || 'Nail Art'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Date</span>
                        <span className={styles.detailValue}>{date || 'March 15, 2026'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Time</span>
                        <span className={styles.detailValue}>{time || '14:00'}</span>
                    </div>
                </div>

                <p className={styles.note}>📱 You will receive an SMS confirmation shortly</p>

                <div className={styles.btns}>
                    <button className={styles.btnPrimary} onClick={() => navigate('/dashboard/client')}>
                        View My Bookings
                    </button>
                    <button className={styles.btnGhost} onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Confirmation
