import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ClientDashboard.module.css'
import { getMyBookings, updateBookingStatus, type BookingOut } from '../../api/bookings'
import { getStoredUser, clearAuth, isLoggedIn } from '../../api/auth'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:   { bg: '#FFF8E1', color: '#F9A825' },
    confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' },
    completed: { bg: '#F3E5F5', color: '#6A1B9A' },
}
const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled', completed: 'Completed',
}

const ClientDashboard = () => {
    const navigate = useNavigate()
    const user = getStoredUser()

    const [bookings, setBookings]   = useState<BookingOut[]>([])
    const [loading, setLoading]     = useState(true)
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
    const [activeNav, setActiveNav] = useState('bookings')

    useEffect(() => {
        if (!isLoggedIn()) { navigate('/auth'); return }
        getMyBookings()
            .then(setBookings)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleCancel = async (id: number) => {
        if (!confirm('Cancel this appointment?')) return
        await updateBookingStatus(id, 'cancelled')
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b))
    }

    const todayStr = new Date().toISOString().split('T')[0]
    const upcoming = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed' && b.date >= todayStr)
    const past     = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || b.date < todayStr)
    const displayed = activeTab === 'upcoming' ? upcoming : past

    const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

    if (loading) return (
        <main className={styles.main}>
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'80px', color:'var(--text-light)' }}>Loading...</div>
        </main>
    )

    return (
        <main className={styles.main}>

            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>{initials}</div>
                    <div className={styles.profileName}>{user.name || 'Guest'}</div>
                    <div className={styles.profilePhone}>LaZure Client</div>
                </div>

                <nav className={styles.nav}>
                    {[
                        { id: 'bookings',   icon: '📅', label: 'My Bookings' },
                        { id: 'favorites',  icon: '♡',  label: 'Saved Artists' },
                        { id: 'settings',   icon: '⚙',  label: 'Settings' },
                    ].map(item => (
                        <div
                            key={item.id}
                            className={`${styles.navItem} ${activeNav === item.id ? styles.navActive : ''}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>

                <button className={styles.logoutBtn} onClick={() => { clearAuth(); navigate('/') }}>
                    Sign Out
                </button>
            </aside>

            {/* CONTENT */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>
                            {activeNav === 'bookings' ? 'My Bookings' : activeNav === 'favorites' ? 'Saved Artists' : 'Settings'}
                        </h1>
                        {activeNav === 'bookings' && (
                            <p className={styles.sub}>{upcoming.length} upcoming appointments</p>
                        )}
                    </div>
                    <button className={styles.bookBtn} onClick={() => navigate('/artists')}>Book Now</button>
                </div>

                {activeNav === 'bookings' && (
                    <>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                Upcoming ({upcoming.length})
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'past' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('past')}
                            >
                                Past ({past.length})
                            </button>
                        </div>

                        {displayed.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>📅</div>
                                <p>No {activeTab === 'upcoming' ? 'upcoming' : 'past'} appointments</p>
                            </div>
                        ) : (
                            <div className={styles.bookingsList}>
                                {displayed.map(booking => {
                                    const st = STATUS_COLORS[booking.status] || STATUS_COLORS.pending
                                    return (
                                        <div key={booking.id} className={styles.bookingCard}>
                                            <div className={styles.bookingArtist}>
                                                {booking.artist_photo
                                                    ? <img src={booking.artist_photo} alt={booking.artist_name} className={styles.bookingPhoto} />
                                                    : <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--blush)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0 }}>💅</div>
                                                }
                                                <div>
                                                    <div className={styles.bookingArtistName}>{booking.artist_name}</div>
                                                    <div className={styles.bookingService}>{booking.service_name}</div>
                                                </div>
                                            </div>

                                            <div className={styles.bookingDetails}>
                                                <div className={styles.bookingDate}>
                                                    📅 {new Date(booking.date).toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' })}
                                                </div>
                                                <div className={styles.bookingTime}>🕐 {booking.time?.slice(0,5)}</div>
                                            </div>

                                            <div className={styles.bookingStatus} style={{ background: st.bg, color: st.color }}>
                                                {STATUS_LABELS[booking.status]}
                                            </div>

                                            {booking.status === 'pending' && (
                                                <button className={styles.cancelBtn} onClick={() => handleCancel(booking.id)}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {activeNav === 'favorites' && (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>♡</div>
                        <p>No saved artists yet</p>
                    </div>
                )}
                {activeNav === 'settings' && (
                    <div style={{ color:'var(--text-light)', padding:'40px 0' }}>Settings coming soon...</div>
                )}
            </div>

        </main>
    )
}

export default ClientDashboard
