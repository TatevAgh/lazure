import { useNavigate } from 'react-router-dom'
import styles from './About.module.css'

const About = () => {
    const navigate = useNavigate()

    return (
        <main className={styles.main}>

            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <div className={styles.tag}>Our story</div>
                    <h1 className={styles.title}>
                        Beauty should be <em>effortless</em>
                    </h1>
                    <p className={styles.desc}>
                        LaZure was born in Yerevan with one simple idea — connecting talented nail artists with clients who appreciate their craft. No more phone tag, no more uncertainty. Just beautiful nails, booked in minutes.
                    </p>
                </div>
                <div className={styles.heroStats}>
                    {[
                        { number: '48+', label: 'Verified artists' },
                        { number: '1,200+', label: 'Happy clients' },
                        { number: '4.9★', label: 'Average rating' },
                        { number: '2026', label: 'Founded in Yerevan' },
                    ].map(stat => (
                        <div key={stat.label} className={styles.stat}>
                            <div className={styles.statNumber}>{stat.number}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MISSION */}
            <section className={styles.mission}>
                <div className={styles.missionContent}>
                    <div className={styles.sectionTag}>Why LaZure</div>
                    <h2 className={styles.sectionTitle}>Built for <em>artists</em>, loved by clients</h2>
                    <div className={styles.values}>
                        {[
                            {
                                icon: '🎨',
                                title: 'Artist-first platform',
                                desc: 'We built every feature with nail artists in mind. Easy scheduling, portfolio management, and a booking system that works for them.',
                            },
                            {
                                icon: '🔒',
                                title: 'Verified professionals',
                                desc: 'Every artist on LaZure is reviewed before being listed. You can book with confidence knowing you are in good hands.',
                            },
                            {
                                icon: '⚡',
                                title: 'Instant booking',
                                desc: 'Browse, choose, book — in under two minutes. No phone calls, no waiting for a reply. Real-time availability, instant confirmation.',
                            },
                            {
                                icon: '🇦🇲',
                                title: 'Made in Armenia',
                                desc: 'LaZure is proudly built and operated in Yerevan. We support local talent and help Armenian nail artists grow their business.',
                            },
                        ].map(value => (
                            <div key={value.title} className={styles.valueCard}>
                                <div className={styles.valueIcon}>{value.icon}</div>
                                <h3 className={styles.valueTitle}>{value.title}</h3>
                                <p className={styles.valueDesc}>{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <h2 className={styles.ctaTitle}>Ready to find your perfect nail artist?</h2>
                <p className={styles.ctaSub}>Join over 1,200 clients who trust LaZure for their beauty appointments.</p>
                <div className={styles.ctaBtns}>
                    <button className={styles.ctaBtnPrimary} onClick={() => navigate('/artists')}>
                        Find an Artist
                    </button>
                    <button className={styles.ctaBtnGhost} onClick={() => navigate('/auth')}>
                        Create Account
                    </button>
                </div>
            </section>

        </main>
    )
}

export default About
