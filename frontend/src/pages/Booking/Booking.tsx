// Данные из API — JSX точно под Booking.module.css (Steps + Calendar + TimeGrid)

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './Booking.module.css'
import { getArtistByUsername, type ArtistFull } from '../../api/artists'
import { createBooking } from '../../api/bookings'
import { isLoggedIn } from '../../api/auth'

type BookingStep = 1 | 2 | 3

// Временные слоты 10:00–19:00
const generateTimeSlots = (): string[] => {
    const slots: string[] = []
    for (let h = 10; h <= 19; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`)
        if (h < 19) slots.push(`${String(h).padStart(2, '0')}:30`)
    }
    return slots
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']

const toDateStr = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

const Booking = () => {
    const { artistId } = useParams<{ artistId: string }>()
    const navigate = useNavigate()

    const [artist, setArtist] = useState<ArtistFull | null>(null)
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState('')
    const [submitError, setSubmitError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const [step, setStep] = useState<BookingStep>(1)
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')

    const today = new Date()
    const [calYear, setCalYear] = useState(today.getFullYear())
    const [calMonth, setCalMonth] = useState(today.getMonth())

    const timeSlots = generateTimeSlots()

    useEffect(() => {
        if (!artistId) return
        getArtistByUsername(artistId)
            .then(setArtist)
            .catch(err => setFetchError(err.message))
            .finally(() => setLoading(false))
    }, [artistId])

    const selectedService = artist?.services.find(s => s.id === selectedServiceId)

    const canNext = () => {
        if (step === 1) return selectedServiceId !== null
        if (step === 2) return !!selectedDate && !!selectedTime
        return true
    }

    const goNext = () => setStep(s => Math.min(s + 1, 3) as BookingStep)
    const goBack = () => setStep(s => Math.max(s - 1, 1) as BookingStep)

    const handleConfirm = async () => {
        if (!isLoggedIn()) { navigate('/auth'); return }
        if (!artist || !selectedServiceId || !selectedDate || !selectedTime) return
        setSubmitting(true)
        setSubmitError('')
        try {
            await createBooking({ artist_id: artist.id, service_id: selectedServiceId, date: selectedDate, time: selectedTime })
            navigate('/confirmation')
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : 'Booking failed')
        } finally {
            setSubmitting(false)
        }
    }

    // Calendar
    const prevMonth = () => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1)
    const nextMonth = () => calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1)
    const isPrevDisabled = calYear === today.getFullYear() && calMonth === today.getMonth()
    const todayStr = today.toISOString().split('T')[0]

    const renderCalendarCells = () => {
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
        const firstDay = (() => { const d = new Date(calYear, calMonth, 1).getDay(); return d === 0 ? 6 : d - 1 })()
        const cells = []

        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`e${i}`} className={styles.calEmpty} />)
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = toDateStr(calYear, calMonth, d)
            const isPast = dateStr < todayStr
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate

            let cls = styles.calDay
            if (isPast)       cls += ` ${styles.calDayPast}`
            else if (isSelected) cls += ` ${styles.calDaySelected}`
            else if (isToday) cls += ` ${styles.calDayToday}`

            cells.push(
                <button
                    key={d}
                    className={cls}
                    disabled={isPast}
                    onClick={() => { if (!isPast) { setSelectedDate(dateStr); setSelectedTime('') } }}
                >
                    {d}
                </button>
            )
        }
        return cells
    }

    if (loading) return (
        <main className={styles.main}>
            <div style={{ textAlign:'center', padding:'100px', color:'var(--text-light)' }}>Loading...</div>
        </main>
    )
    if (fetchError) return <main className={styles.main}><div className={styles.notFound}>{fetchError}</div></main>
    if (!artist) return null

    return (
        <main className={styles.main}>

            {/* HEADER */}
            <div className={styles.header}>
                <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
                <div className={styles.artistInfo}>
                    {artist.photo && <img src={artist.photo} alt={artist.name} className={styles.artistPhoto} />}
                    <div>
                        <div className={styles.artistName}>{artist.name}</div>
                        <div className={styles.artistSpecialty}>{artist.specialty?.join(' · ')}</div>
                    </div>
                </div>
            </div>

            {/* STEPS */}
            <div className={styles.steps}>
                {[{num:1,label:'Service'},{num:2,label:'Date & Time'},{num:3,label:'Confirm'}].map(({num,label}) => (
                    <div
                        key={num}
                        className={`${styles.step} ${step === num ? styles.stepActive : ''} ${step > num ? styles.stepDone : ''}`}
                    >
                        <div className={styles.stepNum}>{step > num ? '✓' : num}</div>
                        <span className={styles.stepLabel}>{label}</span>
                    </div>
                ))}
            </div>

            {/* CONTENT */}
            <div className={styles.content}>

                {/* Step 1: service */}
                {step === 1 && (
                    <div className={styles.serviceGrid}>
                        {artist.services.map(service => (
                            <div
                                key={service.id}
                                className={`${styles.serviceCard} ${selectedServiceId === service.id ? styles.serviceSelected : ''}`}
                                onClick={() => setSelectedServiceId(service.id)}
                            >
                                <div className={styles.serviceIcon}>{service.icon || '💅'}</div>
                                <div className={styles.serviceName}>{service.name}</div>
                                <div className={styles.serviceDuration}>{service.duration}</div>
                                <div className={styles.servicePrice}>from {service.price.toLocaleString()} ֏</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 2: Date + Time */}
                {step === 2 && (
                    <>
                        <div className={styles.calendar}>
                            <div className={styles.calendarHeader}>
                                <button
                                    className={`${styles.calNav} ${isPrevDisabled ? styles.calNavDisabled : ''}`}
                                    onClick={prevMonth}
                                    disabled={isPrevDisabled}
                                >←</button>
                                <span className={styles.calMonth}>{MONTHS[calMonth]} {calYear}</span>
                                <button className={styles.calNav} onClick={nextMonth}>→</button>
                            </div>
                            <div className={styles.calDays}>
                                {WEEKDAYS.map(d => <div key={d} className={styles.calDayName}>{d}</div>)}
                            </div>
                            <div className={styles.calGrid}>{renderCalendarCells()}</div>
                        </div>

                        {selectedDate && (
                            <div className={styles.timeSection}>
                                <p className={styles.selectedDateLabel}>
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                                        weekday:'long', day:'numeric', month:'long'
                                    })}
                                </p>
                                <div className={styles.timeGrid}>
                                    {timeSlots.map(time => (
                                        <button
                                            key={time}
                                            className={`${styles.timeSlot} ${selectedTime === time ? styles.timeSelected : ''}`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && selectedService && (
                    <div style={{ maxWidth:'480px', margin:'0 auto' }}>
                        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:300, color:'var(--dark)', marginBottom:'32px' }}>
                            Confirm booking
                        </h2>
                        {[
                            { label: 'Artist',  value: artist.name },
                            { label: 'Service', value: selectedService.name },
                            { label: 'Date',    value: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
                            { label: 'Time',    value: selectedTime },
                            { label: 'Price',   value: `from ${selectedService.price.toLocaleString()} ֏` },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'16px 0', borderBottom:'1px solid var(--border)', fontSize:'14px' }}>
                                <span style={{ color:'var(--text-light)' }}>{label}</span>
                                <span style={{ color:'var(--dark)', fontWeight:500 }}>{value}</span>
                            </div>
                        ))}
                        {submitError && <p style={{ color:'var(--deep-rose)', fontSize:'13px', marginTop:'16px' }}>{submitError}</p>}
                    </div>
                )}

                {/* Buttons */}
                <div className={styles.navBtns}>
                    {step > 1 && <button className={styles.btnBack} onClick={goBack}>Back</button>}
                    {step < 3 && (
                        <button className={styles.btnNext} onClick={goNext} disabled={!canNext()}>
                            Next →
                        </button>
                    )}
                    {step === 3 && (
                        <button className={styles.btnConfirm} onClick={handleConfirm} disabled={submitting}>
                            {submitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    )}
                </div>

            </div>
        </main>
    )
}

export default Booking
