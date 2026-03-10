import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { artists } from '../../data/mockData'
import styles from './ArtistDashboard.module.css'

const mockBookings = [
    { id: '1', clientName: 'Anna M.', service: 'Nail Art', date: 'March 15, 2026', time: '14:00', status: 'confirmed', phone: '+374 91 111 111' },
    { id: '2', clientName: 'Sofia K.', service: 'Gel Polish', date: 'March 15, 2026', time: '16:00', status: 'pending', phone: '+374 93 222 222' },
    { id: '3', clientName: 'Maria L.', service: 'Manicure', date: 'March 16, 2026', time: '11:00', status: 'confirmed', phone: '+374 94 333 333' },
    { id: '4', clientName: 'Lara P.', service: 'Extensions', date: 'March 17, 2026', time: '13:00', status: 'pending', phone: '+374 95 444 444' },
]

const statusColor = {
    confirmed: { bg: '#E8F5E8', text: '#5A8A5A', label: 'Confirmed' },
    pending: { bg: '#FFF8E8', text: '#B8860B', label: 'Pending' },
    cancelled: { bg: '#FDE8E8', text: '#B07060', label: 'Cancelled' },
}

const ArtistDashboard = () => {
    const navigate = useNavigate()
    const artist = artists[0]
    const [activeTab, setActiveTab] = useState<'bookings' | 'schedule' | 'portfolio'>('bookings')
    const [bookingTab, setBookingTab] = useState<'upcoming' | 'past'>('upcoming')


    const uniqueLink = `lazure.am/artist/${artist.username}`

    return (
        <main className={styles.main}>
            <div className={styles.sidebar}>
                <div className={styles.profile}>
                    <div className={styles.artistPhoto}>
                        <img src={artist.photo} alt={artist.name} />
                    </div>
                    <div className={styles.profileName}>{artist.name}</div>
                    <div className={styles.profileSpec}>{artist.specialty.join(' · ')}</div>
                    <div className={styles.ratingBadge}>⭐ {artist.rating} · {artist.reviews} reviews</div>
                </div>

                <div className={styles.linkBox}>
                    <div className={styles.linkLabel}>Your unique link</div>
                    <div className={styles.linkValue}>{uniqueLink}</div>
                    <button
                        className={styles.copyBtn}
                        onClick={() => {
                            navigator.clipboard.writeText(uniqueLink)
                            alert('Link copied!')
                        }}
                    >
                        Copy Link
                    </button>
                </div>

                <nav className={styles.nav}>
                    {[
                        { icon: '📅', label: 'Bookings', tab: 'bookings' },
                        { icon: '🕐', label: 'Schedule', tab: 'schedule' },
                        { icon: '🖼️', label: 'Portfolio', tab: 'portfolio' },
                        { icon: '⚙️', label: 'Settings', tab: null },
                    ].map(item => (
                        <div
                            key={item.label}
                            className={`${styles.navItem} ${activeTab === item.tab ? styles.navActive : ''}`}
                            onClick={() => item.tab && setActiveTab(item.tab as typeof activeTab)}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </nav>

                <button className={styles.logoutBtn} onClick={() => navigate('/')}>
                    ← Sign Out
                </button>
            </div>

            <div className={styles.content}>

                {/* STATS */}
                <div className={styles.stats}>
                    {[
                        { label: 'This Month', value: '24', sub: 'bookings' },
                        { label: 'Pending', value: '2', sub: 'to confirm' },
                        { label: 'Revenue', value: '192,000', sub: '֏ this month' },
                        { label: 'Rating', value: '4.9★', sub: '142 reviews' },
                    ].map(stat => (
                        <div key={stat.label} className={styles.statCard}>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statSub}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                    <div>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Incoming Bookings</h2>
                        </div>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${bookingTab === 'upcoming' ? styles.tabActive : ''}`}
                                onClick={() => setBookingTab('upcoming')}
                            >Upcoming
                            </button>
                            <button
                                className={`${styles.tab} ${bookingTab === 'past' ? styles.tabActive : ''}`}
                                onClick={() => setBookingTab('past')}
                            >Past
                            </button>
                        </div>
                        <div className={styles.bookingsList}>
                            {mockBookings.map(booking => {
                                const status = statusColor[booking.status as keyof typeof statusColor]
                                return (
                                    <div key={booking.id} className={styles.bookingCard}>
                                        <div className={styles.clientInfo}>
                                            <div className={styles.clientAvatar}>{booking.clientName[0]}</div>
                                            <div>
                                                <div className={styles.clientName}>{booking.clientName}</div>
                                                <div className={styles.clientPhone}>{booking.phone}</div>
                                            </div>
                                        </div>
                                        <div className={styles.bookingService}>{booking.service}</div>
                                        <div className={styles.bookingDateTime}>
                                            <div className={styles.bookingDate}>📅 {booking.date}</div>
                                            <div className={styles.bookingTime}>🕐 {booking.time}</div>
                                        </div>
                                        <div
                                            className={styles.statusBadge}
                                            style={{ background: status.bg, color: status.text }}
                                        >
                                            {status.label}
                                        </div>
                                        {booking.status === 'pending' && (
                                            <div className={styles.actionBtns}>
                                                <button className={styles.confirmBtn}>✓ Confirm</button>
                                                <button className={styles.rejectBtn}>✕</button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* SCHEDULE TAB */}
                {activeTab === 'schedule' && (
                    <div>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>My Schedule</h2>
                            <p className={styles.sectionSub}>Set your working hours and days off</p>
                        </div>
                        <div className={styles.scheduleGrid}>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                                <div key={day} className={styles.scheduleDay}>
                                    <div className={styles.scheduleDayName}>{day}</div>
                                    <div className={styles.scheduleToggle}>
                                        <input type="checkbox" defaultChecked={i < 5} id={day} />
                                        <label htmlFor={day}>{i < 5 ? '10:00 — 19:00' : 'Day off'}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PORTFOLIO TAB */}
                {activeTab === 'portfolio' && (
                    <div>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>My Portfolio</h2>
                            <button className={styles.uploadBtn}>+ Upload Photo</button>
                        </div>
                        <div className={styles.portfolioGrid}>
                            {[artist.photo, artist.photo, artist.photo, artist.photo].map((photo, i) => (
                                <div key={i} className={styles.portfolioItem}>
                                    <img src={photo} alt={`work ${i}`} />
                                    <button className={styles.deletePhoto}>✕</button>
                                </div>
                            ))}
                            <div className={styles.uploadPlaceholder}>
                                <div className={styles.uploadIcon}>+</div>
                                <div>Add photo</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    )
}

export default ArtistDashboard
