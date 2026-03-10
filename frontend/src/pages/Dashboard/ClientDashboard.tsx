import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { artists } from '../../data/mockData'
import styles from './ClientDashboard.module.css'

const mockBookings = [
    { id: '1', artistId: '1', service: 'Nail Art', date: 'March 15, 2026', time: '14:00', status: 'confirmed' },
    { id: '2', artistId: '2', service: 'Gel Polish', date: 'March 20, 2026', time: '11:00', status: 'pending' },
    { id: '3', artistId: '3', service: 'Manicure', date: 'February 28, 2026', time: '15:30', status: 'confirmed' },
]

const statusColor = {
    confirmed: { bg: '#E8F5E8', text: '#5A8A5A', label: 'Confirmed' },
    pending: { bg: '#FFF8E8', text: '#B8860B', label: 'Pending' },
    cancelled: { bg: '#FDE8E8', text: '#B07060', label: 'Cancelled' },
}

const ClientDashboard = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

    const upcoming = mockBookings.filter(b => b.status !== 'cancelled' && b.date >= 'March 10')
    const history = mockBookings.filter(b => b.date < 'March 10' || b.status === 'cancelled')

    const bookings = activeTab === 'upcoming' ? upcoming : history

    return (
        <main className={styles.main}>
            <div className={styles.sidebar}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>T</div>
                    <div className={styles.profileName}>Tatevik</div>
                    <div className={styles.profilePhone}>+374 96 773 737</div>
                </div>

                <nav className={styles.nav}>
                    {[
                        { icon: '📅', label: 'My Bookings', active: true },
                        { icon: '❤️', label: 'Saved Artists', active: false },
                        { icon: '⭐', label: 'My Reviews', active: false },
                        { icon: '⚙️', label: 'Settings', active: false },
                    ].map(item => (
                        <div
                            key={item.label}
                            className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
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
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>My Bookings</h1>
                        <p className={styles.sub}>Manage your nail appointments</p>
                    </div>
                    <button
                        className={styles.bookBtn}
                        onClick={() => navigate('/artists')}
                    >
                        + New Booking
                    </button>
                </div>

                {/* TABS */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming ({upcoming.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History ({history.length})
                    </button>
                </div>

                {/* BOOKINGS */}
                <div className={styles.bookingsList}>
                    {bookings.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>💅</div>
                            <p>No bookings yet</p>
                            <button className={styles.bookBtn} onClick={() => navigate('/artists')}>
                                Find an Artist
                            </button>
                        </div>
                    ) : (
                        bookings.map(booking => {
                            const artist = artists.find(a => a.id === booking.artistId)
                            const status = statusColor[booking.status as keyof typeof statusColor]
                            return (
                                <div key={booking.id} className={styles.bookingCard}>
                                    <div className={styles.bookingArtist}>
                                        <img
                                            src={artist?.photo}
                                            alt={artist?.name}
                                            className={styles.bookingPhoto}
                                        />
                                        <div>
                                            <div className={styles.bookingArtistName}>{artist?.name}</div>
                                            <div className={styles.bookingService}>{booking.service}</div>
                                        </div>
                                    </div>
                                    <div className={styles.bookingDetails}>
                                        <div className={styles.bookingDate}>📅 {booking.date}</div>
                                        <div className={styles.bookingTime}>🕐 {booking.time}</div>
                                    </div>
                                    <div
                                        className={styles.bookingStatus}
                                        style={{ background: status.bg, color: status.text }}
                                    >
                                        {status.label}
                                    </div>
                                    {activeTab === 'upcoming' && (
                                        <button className={styles.cancelBtn}>Cancel</button>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </main>
    )
}

export default ClientDashboard
