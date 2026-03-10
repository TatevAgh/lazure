import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { artists } from '../../data/mockData'
import styles from './Artists.module.css'

const availabilityLabel = {
    'today': 'Available today',
    'tomorrow': 'Tomorrow',
    'this-week': 'This week',
}

const Artists = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [filterService, setFilterService] = useState('All')
    const [filterAvailable, setFilterAvailable] = useState('All')

    const services = ['All', 'Nail Art', 'Extensions', 'Gel Polish', 'French', 'Manicure', 'Pedicure']

    const filtered = artists.filter(artist => {
        const matchSearch = artist.name.toLowerCase().includes(search.toLowerCase())
        const matchService = filterService === 'All' || artist.specialty.includes(filterService)
        const matchAvailable = filterAvailable === 'All' || artist.available === filterAvailable
        return matchSearch && matchService && matchAvailable
    })

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <div className={styles.tag}>Our Artists</div>
                    <h1 className={styles.title}>Find your perfect <em>nail artist</em></h1>
                    <p className={styles.sub}>{filtered.length} artists available</p>
                </div>
            </div>

            {/* FILTERS */}
            <div className={styles.filters}>
                <input
                    className={styles.search}
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={styles.filterGroup}>
                    {services.map(s => (
                        <button
                            key={s}
                            className={`${styles.filterBtn} ${filterService === s ? styles.active : ''}`}
                            onClick={() => setFilterService(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className={styles.filterGroup}>
                    {[
                        { value: 'All', label: 'Any time' },
                        { value: 'today', label: 'Today' },
                        { value: 'tomorrow', label: 'Tomorrow' },
                        { value: 'this-week', label: 'This week' },
                    ].map(opt => (
                        <button
                            key={opt.value}
                            className={`${styles.filterBtn} ${filterAvailable === opt.value ? styles.active : ''}`}
                            onClick={() => setFilterAvailable(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID */}
            <div className={styles.grid}>
                {filtered.length === 0 ? (
                    <div className={styles.empty}>No artists found 😔</div>
                ) : (
                    filtered.map(artist => (
                        <div
                            key={artist.id}
                            className={styles.card}
                            onClick={() => navigate(`/artist/${artist.username}`)}
                        >
                            <div className={styles.cardImg}>
                                <img src={artist.photo} alt={artist.name} />
                                <div className={styles.badge}>
                                    {availabilityLabel[artist.available]}
                                </div>
                            </div>
                            <div className={styles.cardInfo}>
                                <div className={styles.artistName}>{artist.name}</div>
                                <div className={styles.specialty}>{artist.specialty.join(' · ')}</div>
                                <div className={styles.meta}>
                                    <span className={styles.rating}>⭐ {artist.rating} · {artist.reviews} reviews</span>
                                    <span className={styles.price}>from {artist.priceFrom.toLocaleString()} ֏</span>
                                </div>
                                <button
                                    className={styles.bookBtn}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/booking/${artist.id}`)
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}

export default Artists
