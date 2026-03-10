import styles from './Home.module.css'
import photo1 from '../../assets/images/photo1.jpg'
import photo2 from '../../assets/images/photo2.jpg'
import photo3 from '../../assets/images/photo3.jpg'
import { useNavigate } from 'react-router-dom'
import { artists } from '../../data/mockData'



const Home = () => {
    const navigate = useNavigate();

    return (
        <main className={styles.main}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroLeft}>
                    <div className={styles.heroTag}>Your beauty, your time</div>
                    <h1 className={styles.heroTitle}>
                        Book a nail artist<br/>you'll <em>love</em>
                    </h1>
                    <p className={styles.heroDesc}>
                        Discover talented nail artists near you. Browse portfolios,
                        check availability, and book your perfect appointment — all in one place.
                    </p>
                    <div className={styles.heroCta}>
                        <button className={styles.btnPrimary}>Find an Artist</button>
                        <button className={styles.btnGhost}>See how it works</button>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>48+</div>
                            <div className={styles.statLabel}>Nail Artists</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>1.2k</div>
                            <div className={styles.statLabel}>Happy Clients</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>4.9★</div>
                            <div className={styles.statLabel}>Average Rating</div>
                        </div>
                    </div>
                </div>

                <div className={styles.heroRight}>
                    <div className={styles.heroGrid}>
                        <div className={`${styles.heroImg} ${styles.large}`}>
                            <img src={photo1} alt="nail art"/>
                            <div className={styles.heroBadge}>
                                <div className={styles.heroBadgeTitle}>Featured Artist</div>
                                <div className={styles.heroBadgeName}>Nails by Gaya</div>
                                <div className={styles.heroBadgeAvailable}>Available today</div>
                            </div>
                        </div>
                        <div className={styles.heroImg}>
                            <img src={photo2} alt="nail art"/>
                        </div>
                        <div className={styles.heroImg}>
                            <img src={photo3} alt="nail art"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCROLL STRIP */}
            <div className={styles.scrollStrip}>
                <div className={styles.scrollTrack}>
                    {['Manicure', 'Nail Art', 'Gel Polish', 'Pedicure', 'Extensions', 'Nail Lessons', 'French Tips',
                        'Manicure', 'Nail Art', 'Gel Polish', 'Pedicure', 'Extensions', 'Nail Lessons', 'French Tips'
                    ].map((item, i) => (
                        <div key={i} className={styles.scrollItem}>
                            <span className={styles.scrollDot}></span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            {/* HOW IT WORKS */}
            <section className={styles.howItWorks}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}>Simple & fast</div>
                    <h2 className={styles.sectionTitle}>How it <em>works</em></h2>
                    <p className={styles.sectionSub}>
                        From browsing to booking in just a few taps. No phone calls, no waiting.
                    </p>
                </div>

                <div className={styles.steps}>
                    {[
                        {
                            number: '01',
                            icon: '🔍',
                            title: 'Browse Artists',
                            desc: 'Explore profiles of talented nail artists. Filter by style, availability, or price range.'
                        },
                        {
                            number: '02',
                            icon: '💅',
                            title: 'Choose a Service',
                            desc: 'Pick from manicure, pedicure, nail art and more. See duration and pricing upfront.'
                        },
                        {
                            number: '03',
                            icon: '📅',
                            title: 'Pick a Time',
                            desc: 'View real-time availability and select a slot that works for you. Instant confirmation.'
                        },
                        {
                            number: '04',
                            icon: '✨',
                            title: 'Enjoy & Review',
                            desc: 'Show up and enjoy your appointment. Leave a review to help others discover great artists.'
                        },
                    ].map((step) => (
                        <div key={step.number} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <div className={styles.stepTitle}>{step.title}</div>
                            <p className={styles.stepDesc}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ARTISTS */}
            <div className={styles.artistsGrid}>
                {artists.slice(0, 3).map((artist) => (
                    <div key={artist.id} className={styles.artistCard}
                         onClick={() => navigate(`/artist/${artist.username}`)}>
                        <div className={styles.artistImg}>
                            <img src={artist.photo} alt={artist.name}/>
                            <div className={styles.artistBadge}>
                                {artist.available === 'today' ? 'Available today' :
                                    artist.available === 'tomorrow' ? 'Tomorrow' : 'This week'}
                            </div>
                        </div>
                        <div className={styles.artistInfo}>
                            <div className={styles.artistName}>{artist.name}</div>
                            <div className={styles.artistSpecialty}>{artist.specialty.join(' · ')}</div>
                            <div className={styles.artistMeta}>
                                <div className={styles.artistRating}>⭐ {artist.rating} · {artist.reviews} reviews</div>
                                <div className={styles.artistPrice}>from {artist.priceFrom.toLocaleString()} ֏</div>
                            </div>
                            <button
                                className={styles.bookBtn}
                                onClick={() => navigate(`/booking/${artist.id}`)}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
