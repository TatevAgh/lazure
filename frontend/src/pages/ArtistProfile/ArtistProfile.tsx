import { useParams, useNavigate } from 'react-router-dom'
import { artists, services } from '../../data/mockData'
import styles from './ArtistProfile.module.css'

const ArtistProfile = () => {
    const { username } = useParams()
    const navigate = useNavigate()
    const artist = artists.find(a => a.username === username)

    if (!artist) return (
        <main className={styles.main}>
            <div className={styles.notFound}>Artist not found 😔</div>
        </main>
    )

    return (
        <main className={styles.main}>

            {/* HERO */}
            <div className={styles.hero}>
                <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
                <div className={styles.heroContent}>
                    <div className={styles.artistPhotoWrap}>
                        <img src={artist.photo} alt={artist.name} className={styles.artistPhoto} />
                    </div>
                    <div className={styles.artistInfo}>
                        <div className={styles.tag}>Nail Artist</div>
                        <h1 className={styles.name}>{artist.name}</h1>
                        <div className={styles.specialty}>{artist.specialty.join(' · ')}</div>
                        <div className={styles.meta}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaValue}>⭐ {artist.rating}</span>
                                <span className={styles.metaLabel}>{artist.reviews} reviews</span>
                            </div>
                            <div className={styles.metaDivider} />
                            <div className={styles.metaItem}>
                                <span className={styles.metaValue}>from {artist.priceFrom.toLocaleString()} ֏</span>
                                <span className={styles.metaLabel}>per service</span>
                            </div>
                            <div className={styles.metaDivider} />
                            <div className={styles.metaItem}>
                                <span className={styles.metaValue + ' ' + styles.available}>● Available</span>
                                <span className={styles.metaLabel}>
                  {artist.available === 'today' ? 'Today' :
                      artist.available === 'tomorrow' ? 'Tomorrow' : 'This week'}
                </span>
                            </div>
                        </div>
                        <button
                            className={styles.bookBtn}
                            onClick={() => navigate(`/booking/${artist.id}`)}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.body}>

                {/* PORTFOLIO */}
                <section className={styles.section}>
                    <div className={styles.sectionTag}>Portfolio</div>
                    <h2 className={styles.sectionTitle}>Recent <em>works</em></h2>
                    <div className={styles.portfolio}>
                        {[artist.photo, artist.photo, artist.photo, artist.photo].map((photo, i) => (
                            <div key={i} className={styles.portfolioImg}>
                                <img src={photo} alt={`work ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* SERVICES */}
                <section className={styles.section}>
                    <div className={styles.sectionTag}>Services & Pricing</div>
                    <h2 className={styles.sectionTitle}>What I <em>offer</em></h2>
                    <div className={styles.servicesList}>
                        {services.map(service => (
                            <div key={service.id} className={styles.serviceRow}>
                                <div className={styles.serviceLeft}>
                                    <span className={styles.serviceIcon}>{service.icon}</span>
                                    <div>
                                        <div className={styles.serviceName}>{service.name}</div>
                                        <div className={styles.serviceDuration}>{service.duration}</div>
                                    </div>
                                </div>
                                <div className={styles.serviceRight}>
                                    <div className={styles.servicePrice}>from {service.priceFrom.toLocaleString()} ֏</div>
                                    <button
                                        className={styles.serviceBookBtn}
                                        onClick={() => navigate(`/booking/${artist.id}`)}
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* REVIEWS */}
                <section className={styles.section}>
                    <div className={styles.sectionTag}>Reviews</div>
                    <h2 className={styles.sectionTitle}>What clients <em>say</em></h2>
                    <div className={styles.reviews}>
                        {[
                            { name: 'Anna M.', rating: 5, text: 'Amazing work! Exactly what I wanted. Will definitely come back!', date: 'March 2026' },
                            { name: 'Sofia K.', rating: 5, text: 'Very professional and talented. My nails look stunning!', date: 'February 2026' },
                            { name: 'Maria L.', rating: 4, text: 'Great experience, very clean and comfortable studio.', date: 'February 2026' },
                        ].map((review, i) => (
                            <div key={i} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.reviewAvatar}>{review.name[0]}</div>
                                    <div>
                                        <div className={styles.reviewName}>{review.name}</div>
                                        <div className={styles.reviewDate}>{review.date}</div>
                                    </div>
                                    <div className={styles.reviewStars}>{'⭐'.repeat(review.rating)}</div>
                                </div>
                                <p className={styles.reviewText}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    )
}

export default ArtistProfile
