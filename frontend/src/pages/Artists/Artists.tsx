// Данные из API вместо mockData — JSX и классы точно как оригинал

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Artists.module.css'
import { getArtists, type ArtistListItem } from '../../api/artists'

const availabilityLabel: Record<string, string> = {
    'today':     'Available today',
    'tomorrow':  'Tomorrow',
    'this-week': 'This week',
}

const SERVICES = ['All', 'Nail Art', 'Extensions', 'Gel Polish', 'French', 'Manicure', 'Pedicure']

const Artists = () => {
    const navigate = useNavigate()

    const [artists, setArtists] = useState<ArtistListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [filterService, setFilterService] = useState('All')
    const [filterAvailable, setFilterAvailable] = useState('All')

    useEffect(() => {
        getArtists()
            .then(setArtists)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const filtered = artists.filter(a => {
        const matchSearch    = a.name.toLowerCase().includes(search.toLowerCase())
        const matchService   = filterService === 'All' || a.specialty.includes(filterService)
        const matchAvailable = filterAvailable === 'All' || a.available === filterAvailable
        return matchSearch && matchService && matchAvailable
    })

    if (loading) return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.tag}>Our Artists</div>
                <h1 className={styles.title}>Find your perfect <em>nail artist</em></h1>
            </div>
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-light)' }}>Loading...</div>
        </main>
    )

    if (error) return (
        <main className={styles.main}>
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--deep-rose)' }}>Error: {error}</div>
        </main>
    )

    return (
        <main className={styles.main}>

            <div className={styles.header}>
                <div className={styles.tag}>Our Artists</div>
                <h1 className={styles.title}>Find your perfect <em>nail artist</em></h1>
                <p className={styles.sub}>{filtered.length} artists available</p>
            </div>

            <div className={styles.filters}>
                <input
                    className={styles.search}
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className={styles.filterGroup}>
                    {SERVICES.map(s => (
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
                        { value: 'All',       label: 'Any time' },
                        { value: 'today',     label: 'Today' },
                        { value: 'tomorrow',  label: 'Tomorrow' },
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

            <div className={styles.grid}>
                {filtered.length === 0 ? (
                    <div className={styles.empty}>No artists found 😔</div>
                ) : (
                    filtered.map(artist => (
                        <div
                            key={artist.id}
                            className={styles.card}
                            onClick={() => navigate(`/booking/${artist.username}`)}
                        >
                            <div className={styles.cardImg}>
                                {artist.photo
                                    ? <img src={artist.photo} alt={artist.name} />
                                    : <div style={{ width:'100%', height:'100%', background:'var(--blush)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'64px' }}>💅</div>
                                }
                                <div className={styles.badge}>
                                    {availabilityLabel[artist.available] || artist.available}
                                </div>
                            </div>
                            <div className={styles.cardInfo}>
                                <div className={styles.artistName}>{artist.name}</div>
                                <div className={styles.specialty}>{artist.specialty?.join(' · ')}</div>
                                <div className={styles.meta}>
                                    <span className={styles.rating}>⭐ {Number(artist.rating).toFixed(1)} · {artist.reviews} reviews</span>
                                    <span className={styles.price}>from {artist.priceFrom?.toLocaleString()} ֏</span>
                                </div>
                                <button
                                    className={styles.bookBtn}
                                    onClick={e => { e.stopPropagation(); navigate(`/booking/${artist.username}`) }}
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
