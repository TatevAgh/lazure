import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { artists } from '../../data/mockData'
import styles from './AdminPanel.module.css'

const mockClients = [
    { id: '1', name: 'Anna M.', phone: '+374 91 111 111', bookings: 5, joined: 'Jan 2026' },
    { id: '2', name: 'Sofia K.', phone: '+374 93 222 222', bookings: 3, joined: 'Feb 2026' },
    { id: '3', name: 'Maria L.', phone: '+374 94 333 333', bookings: 8, joined: 'Jan 2026' },
]

const AdminPanel = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'overview' | 'artists' | 'clients' | 'subscriptions'>('overview')

    return (
        <main className={styles.main}>
            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <div className={styles.logo}>La<span>Zure</span><div className={styles.adminBadge}>Admin</div></div>

                <nav className={styles.nav}>
                    {[
                        { icon: '📊', label: 'Overview', tab: 'overview' },
                        { icon: '💅', label: 'Artists', tab: 'artists' },
                        { icon: '👥', label: 'Clients', tab: 'clients' },
                        { icon: '💳', label: 'Subscriptions', tab: 'subscriptions' },
                    ].map(item => (
                        <div
                            key={item.label}
                            className={`${styles.navItem} ${activeTab === item.tab ? styles.navActive : ''}`}
                            onClick={() => setActiveTab(item.tab as typeof activeTab)}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </nav>

                <button className={styles.logoutBtn} onClick={() => navigate('/')}>← Exit Admin</button>
            </div>

            {/* CONTENT */}
            <div className={styles.content}>

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div>
                        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                        <div className={styles.statsGrid}>
                            {[
                                { label: 'Total Artists', value: '48', icon: '💅', change: '+3 this month' },
                                { label: 'Total Clients', value: '1,240', icon: '👥', change: '+86 this month' },
                                { label: 'Total Bookings', value: '3,891', icon: '📅', change: '+241 this month' },
                                { label: 'Revenue', value: '2.4M ֏', icon: '💰', change: '+18% vs last month' },
                                { label: 'Active Subscriptions', value: '41', icon: '💳', change: '7 trial, 34 paid' },
                                { label: 'Avg Rating', value: '4.8★', icon: '⭐', change: 'across all artists' },
                            ].map(stat => (
                                <div key={stat.label} className={styles.statCard}>
                                    <div className={styles.statIcon}>{stat.icon}</div>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                    <div className={styles.statChange}>{stat.change}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ARTISTS */}
                {activeTab === 'artists' && (
                    <div>
                        <div className={styles.tableHeader}>
                            <h1 className={styles.pageTitle}>Artists</h1>
                            <button className={styles.addBtn}>+ Add Artist</button>
                        </div>
                        <div className={styles.table}>
                            <div className={`${styles.tableRow} ${styles.tableHead}`}>
                                <div>Artist</div>
                                <div>Specialty</div>
                                <div>Rating</div>
                                <div>Bookings</div>
                                <div>Subscription</div>
                                <div>Actions</div>
                            </div>
                            {artists.map(artist => (
                                <div key={artist.id} className={styles.tableRow}>
                                    <div className={styles.artistCell}>
                                        <img src={artist.photo} alt={artist.name} className={styles.tablePhoto} />
                                        <div>
                                            <div className={styles.artistCellName}>{artist.name}</div>
                                            <div className={styles.artistCellLink}>@{artist.username}</div>
                                        </div>
                                    </div>
                                    <div className={styles.cellLight}>{artist.specialty.join(', ')}</div>
                                    <div>⭐ {artist.rating}</div>
                                    <div className={styles.cellLight}>{artist.reviews}</div>
                                    <div>
                                        <span className={styles.subBadge}>Pro</span>
                                    </div>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.editBtn} onClick={() => navigate(`/artist/${artist.username}`)}>View</button>
                                        <button className={styles.deleteBtn}>Block</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CLIENTS */}
                {activeTab === 'clients' && (
                    <div>
                        <div className={styles.tableHeader}>
                            <h1 className={styles.pageTitle}>Clients</h1>
                        </div>
                        <div className={styles.table}>
                            <div className={`${styles.tableRow} ${styles.tableHead}`}>
                                <div>Client</div>
                                <div>Phone</div>
                                <div>Bookings</div>
                                <div>Joined</div>
                                <div>Actions</div>
                            </div>
                            {mockClients.map(client => (
                                <div key={client.id} className={styles.tableRow}>
                                    <div className={styles.artistCell}>
                                        <div className={styles.clientAvatar}>{client.name[0]}</div>
                                        <div className={styles.artistCellName}>{client.name}</div>
                                    </div>
                                    <div className={styles.cellLight}>{client.phone}</div>
                                    <div>{client.bookings} bookings</div>
                                    <div className={styles.cellLight}>{client.joined}</div>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.deleteBtn}>Block</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUBSCRIPTIONS */}
                {activeTab === 'subscriptions' && (
                    <div>
                        <h1 className={styles.pageTitle}>Subscriptions</h1>
                        <div className={styles.subCards}>
                            {[
                                { plan: 'Starter', price: '2,990 ֏/mo', artists: 12, color: '#F2E4DC' },
                                { plan: 'Pro', price: '24,990 ֏/yr', artists: 22, color: '#E8F0FF' },
                                { plan: 'Trial', price: 'Free 7 days', artists: 7, color: '#FFF8E8' },
                            ].map(sub => (
                                <div key={sub.plan} className={styles.subCard} style={{ background: sub.color }}>
                            <div className={styles.subPlan}>{sub.plan}</div>
                            <div className={styles.subPrice}>{sub.price}</div>
                            <div className={styles.subArtists}>{sub.artists} artists</div>
                        </div>
                        ))}
                    </div>

                    <div className={styles.table} style={{ marginTop: 32 }}>
                <div className={`${styles.tableRow} ${styles.tableHead}`}>
                    <div>Artist</div>
                    <div>Plan</div>
                    <div>Started</div>
                    <div>Expires</div>
                    <div>Status</div>
                </div>
                {artists.map((artist, i) => (
                    <div key={artist.id} className={styles.tableRow}>
                        <div className={styles.artistCell}>
                            <img src={artist.photo} alt={artist.name} className={styles.tablePhoto} />
                            <div className={styles.artistCellName}>{artist.name}</div>
                        </div>
                        <div><span className={styles.subBadge}>{i === 0 ? 'Pro' : i === 1 ? 'Starter' : 'Trial'}</span></div>
                        <div className={styles.cellLight}>Mar 1, 2026</div>
                        <div className={styles.cellLight}>{i === 0 ? 'Mar 1, 2027' : i === 1 ? 'Apr 1, 2026' : 'Mar 17, 2026'}</div>
                        <div><span className={styles.activeBadge}>Active</span></div>
                    </div>
                ))}
            </div>
        </div>
    )}

</div>
</main>
)
}

export default AdminPanel
