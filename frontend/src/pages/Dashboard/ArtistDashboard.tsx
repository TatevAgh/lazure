import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ArtistDashboard.module.css'
import { getMyArtistProfile, type ArtistFull } from '../../api/artists'
import { getMyBookings, updateBookingStatus, type BookingOut } from '../../api/bookings'
import { clearAuth, isLoggedIn } from '../../api/auth'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:   { bg: '#FFF8E1', color: '#F9A825' },
    confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' },
    completed: { bg: '#F3E5F5', color: '#6A1B9A' },
}
const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled', completed: 'Completed',
}

const ArtistDashboard = () => {
    const navigate = useNavigate()

    const [profile,   setProfile]   = useState<ArtistFull | null>(null)
    const [bookings,  setBookings]  = useState<BookingOut[]>([])
    const [loading,   setLoading]   = useState(true)
    const [activeNav, setActiveNav] = useState('bookings')
    const [activeTab, setActiveTab] = useState('all')

    useEffect(() => {
        if (!isLoggedIn()) { navigate('/auth'); return }
        Promise.all([getMyArtistProfile(), getMyBookings()])
            .then(([p, b]) => { setProfile(p); setBookings(b) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleStatus = async (id: number, status: string) => {
        await updateBookingStatus(id, status)
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as BookingOut['status'] } : b))
    }

    const pending   = bookings.filter(b => b.status === 'pending')
    const confirmed = bookings.filter(b => b.status === 'confirmed')
    const completed = bookings.filter(b => b.status === 'completed')
    const totalEarned = completed.reduce((s, b) => s + (b.service_price || 0), 0)

    const displayed = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)

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
                    <div className={styles.artistPhoto}>
                        {profile?.photo
                            ? <img src={profile.photo} alt={profile.name} />
                            : <div style={{ width:'100%', height:'100%', background:'var(--blush)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>💅</div>
                        }
                    </div>
                    <div className={styles.profileName}>{profile?.name}</div>
                    <div className={styles.profileSpec}>{profile?.specialty?.slice(0,2).join(' · ')}</div>
                    <span className={styles.ratingBadge}>⭐ {Number(profile?.rating || 0).toFixed(1)}</span>
                </div>

                {profile && (
                    <div className={styles.linkBox}>
                        <div className={styles.linkLabel}>Your booking link</div>
                        <div className={styles.linkValue}>lazure.com/artist/{profile.username}</div>
                        <button
                            className={styles.copyBtn}
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/artist/${profile.username}`).then(() => alert('Copied!'))}
                        >
                            Copy Link
                        </button>
                    </div>
                )}

                <nav className={styles.nav}>
                    {[
                        { id: 'bookings',  icon: '📅', label: 'Bookings' },
                        { id: 'schedule',  icon: '🗓', label: 'Schedule' },
                        { id: 'portfolio', icon: '🖼', label: 'Portfolio' },
                        { id: 'earnings',  icon: '💳', label: 'Earnings' },
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

                <button className={styles.logoutBtn} onClick={() => { clearAuth(); navigate('/') }}>Sign Out</button>
            </aside>

            {/* CONTENT */}
            <div className={styles.content}>

                {/* STATS */}
                <div className={styles.stats}>
                    {[
                        { value: pending.length,                    label: 'Pending',   sub: 'Need confirmation' },
                        { value: confirmed.length,                  label: 'Confirmed', sub: 'Upcoming sessions' },
                        { value: completed.length,                  label: 'Completed', sub: 'All time' },
                        { value: `${totalEarned.toLocaleString()} ֏`, label: 'Earned',   sub: 'This month' },
                    ].map((s, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statValue}>{s.value}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                            <div className={styles.statSub}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* BOOKINGS */}
                {activeNav === 'bookings' && (
                    <>
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2 className={styles.sectionTitle}>Bookings</h2>
                                <p className={styles.sectionSub}>{bookings.length} total appointments</p>
                            </div>
                        </div>

                        <div className={styles.tabs}>
                            {[
                                { id: 'all',       label: `All (${bookings.length})` },
                                { id: 'pending',   label: `Pending (${pending.length})` },
                                { id: 'confirmed', label: `Confirmed (${confirmed.length})` },
                                { id: 'completed', label: `Completed (${completed.length})` },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className={styles.bookingsList}>
                            {displayed.length === 0 && (
                                <div style={{ textAlign:'center', padding:'60px', color:'var(--text-light)' }}>No bookings yet</div>
                            )}
                            {displayed.map(booking => {
                                const st = STATUS_COLORS[booking.status] || STATUS_COLORS.pending
                                const initials = (booking.client_name || 'C').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0,2)
                                return (
                                    <div key={booking.id} className={styles.bookingCard}>
                                        <div className={styles.clientInfo}>
                                            <div className={styles.clientAvatar}>{initials}</div>
                                            <div>
                                                <div className={styles.clientName}>{booking.client_name || 'Client'}</div>
                                                {booking.client_phone && (
                                                    <div className={styles.clientPhone}>{booking.client_phone}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.bookingService}>{booking.service_name}</div>

                                        <div className={styles.bookingDateTime}>
                                            <div className={styles.bookingDate}>
                                                {new Date(booking.date).toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' })}
                                            </div>
                                            <div className={styles.bookingTime}>{booking.time?.slice(0,5)}</div>
                                        </div>

                                        <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>
                                            {STATUS_LABELS[booking.status]}
                                        </span>

                                        {booking.status === 'pending' && (
                                            <div className={styles.actionBtns}>
                                                <button className={styles.confirmBtn} onClick={() => handleStatus(booking.id, 'confirmed')}>Confirm</button>
                                                <button className={styles.rejectBtn}  onClick={() => handleStatus(booking.id, 'cancelled')}>✕</button>
                                            </div>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button
                                                className={styles.confirmBtn}
                                                onClick={() => handleStatus(booking.id, 'completed')}
                                                style={{ background:'var(--deep-rose)' }}
                                            >Done ✓</button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {activeNav !== 'bookings' && (
                    <div style={{ textAlign:'center', padding:'80px', color:'var(--text-light)' }}>
                        {activeNav === 'schedule'  && '🗓 Schedule — coming soon'}
                        {activeNav === 'portfolio' && '🖼 Portfolio — coming soon'}
                        {activeNav === 'earnings'  && `💳 Total earned: ${totalEarned.toLocaleString()} ֏`}
                    </div>
                )}
            </div>

        </main>
    )
}

export default ArtistDashboard
