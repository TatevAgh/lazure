import { useNavigate } from 'react-router-dom'
import styles from './Services.module.css'

const services = [
    {
        icon: '💅',
        name: 'Manicure',
        duration: '45–60 min',
        priceFrom: 5000,
        description: 'Classic manicure with cuticle care, nail shaping and polish of your choice.',
    },
    {
        icon: '✨',
        name: 'Gel Polish',
        duration: '60–90 min',
        priceFrom: 7000,
        description: 'Long-lasting gel polish that stays chip-free for up to 3 weeks.',
    },
    {
        icon: '🌸',
        name: 'Nail Art',
        duration: '90–120 min',
        priceFrom: 9000,
        description: 'Custom nail art designs — from minimalist lines to intricate patterns.',
    },
    {
        icon: '🦶',
        name: 'Pedicure',
        duration: '60–75 min',
        priceFrom: 6000,
        description: 'Full pedicure treatment including foot soak, exfoliation and polish.',
    },
    {
        icon: '💎',
        name: 'Extensions',
        duration: '120–150 min',
        priceFrom: 12000,
        description: 'Acrylic or gel extensions for the length and shape you have always wanted.',
    },
    {
        icon: '📚',
        name: 'Nail Lessons',
        duration: '2–3 hours',
        priceFrom: 15000,
        description: 'One-on-one lessons for beginners or professionals looking to level up.',
    },
]

const Services = () => {
    const navigate = useNavigate()

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.tag}>What we offer</div>
                <h1 className={styles.title}>Our <em>services</em></h1>
                <p className={styles.sub}>
                    Every service is performed by verified nail artists. Prices start from the listed amount and may vary by artist.
                </p>
            </div>

            <div className={styles.grid}>
                {services.map((service) => (
                    <div key={service.name} className={styles.card}>
                        <div className={styles.cardIcon}>{service.icon}</div>
                        <div className={styles.cardBody}>
                            <h2 className={styles.cardName}>{service.name}</h2>
                            <p className={styles.cardDesc}>{service.description}</p>
                            <div className={styles.cardMeta}>
                                <span className={styles.cardDuration}>{service.duration}</span>
                                <span className={styles.cardPrice}>from {service.priceFrom.toLocaleString()} ֏</span>
                            </div>
                        </div>
                        <button
                            className={styles.bookBtn}
                            onClick={() => navigate('/artists')}
                        >
                            Find an Artist
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.cta}>
                <h2 className={styles.ctaTitle}>Not sure which service to choose?</h2>
                <p className={styles.ctaSub}>Browse our artists — each one has their own specialties and pricing listed on their profile.</p>
                <button className={styles.ctaBtn} onClick={() => navigate('/artists')}>
                    Browse Artists
                </button>
            </div>
        </main>
    )
}

export default Services
