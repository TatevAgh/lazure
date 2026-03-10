import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { artists, services } from '../../data/mockData'
import styles from './Booking.module.css'

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June',
    'July','August','September','October','November','December']

const Booking = () => {
    const { artistId } = useParams()
    const navigate = useNavigate()
    const artist = artists.find(a => a.id === artistId)

    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedService, setSelectedService] = useState<string | null>(null)
    const [step, setStep] = useState<1 | 2 | 3>(1)

    if (!artist) return (
        <main className={styles.main}>
            <div className={styles.notFound}>Artist not found 😔</div>
        </main>
    )

    // Build calendar days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const isPast = (day: number) => {
        const date = new Date(currentYear, currentMonth, day)
        date.setHours(0, 0, 0, 0)
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        return date < t
    }

    const isSelected = (day: number) => {
        if (!selectedDate) return false
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear
    }

    const isToday = (day: number) => {
        return today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear
    }

    const prevMonth = () => {
        if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) return
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
    }

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
    }

    const handleConfirm = () => {
        navigate('/confirmation', {
            state: {
                artistName: artist.name,
                service: selectedService,
                date: selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
                time: selectedTime,
            }
        })
    }

    const canGoBack = !(currentMonth === today.getMonth() && currentYear === today.getFullYear())

    return (
        <main className={styles.main}>
            {/* HEADER */}
            <div className={styles.header}>
                <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
                <div className={styles.artistInfo}>
                    <img src={artist.photo} alt={artist.name} className={styles.artistPhoto} />
                    <div>
                        <div className={styles.artistName}>{artist.name}</div>
                        <div className={styles.artistSpecialty}>{artist.specialty.join(' · ')}</div>
                    </div>
                </div>
            </div>

            {/* STEPS */}
            <div className={styles.steps}>
                {['Choose Service', 'Pick a Date', 'Select Time'].map((s, i) => (
                    <div key={s} className={`${styles.step} ${step === i + 1 ? styles.stepActive : ''} ${step > i + 1 ? styles.stepDone : ''}`}>
                        <div className={styles.stepNum}>{step > i + 1 ? '✓' : i + 1}</div>
                        <div className={styles.stepLabel}>{s}</div>
                    </div>
                ))}
            </div>

            <div className={styles.content}>

                {/* STEP 1 — SERVICE */}
                {step === 1 && (
                    <div className={styles.serviceGrid}>
                        {services.map(service => (
                            <div
                                key={service.id}
                                className={`${styles.serviceCard} ${selectedService === service.name ? styles.serviceSelected : ''}`}
                                onClick={() => setSelectedService(service.name)}
                            >
                                <div className={styles.serviceIcon}>{service.icon}</div>
                                <div className={styles.serviceName}>{service.name}</div>
                                <div className={styles.serviceDuration}>{service.duration}</div>
                                <div className={styles.servicePrice}>from {service.priceFrom.toLocaleString()} ֏</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* STEP 2 — CALENDAR */}
                {step === 2 && (
                    <div className={styles.calendar}>
                        <div className={styles.calendarHeader}>
                            <button
                                className={`${styles.calNav} ${!canGoBack ? styles.calNavDisabled : ''}`}
                                onClick={prevMonth}
                                disabled={!canGoBack}
                            >←</button>
                            <div className={styles.calMonth}>{MONTHS[currentMonth]} {currentYear}</div>
                            <button className={styles.calNav} onClick={nextMonth}>→</button>
                        </div>

                        <div className={styles.calDays}>
                            {DAYS.map(d => <div key={d} className={styles.calDayName}>{d}</div>)}
                        </div>

                        <div className={styles.calGrid}>
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className={styles.calEmpty} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const past = isPast(day)
                                const selected = isSelected(day)
                                const todayDay = isToday(day)
                                return (
                                    <button
                                        key={day}
                                        disabled={past}
                                        className={`${styles.calDay}
                      ${past ? styles.calDayPast : ''}
                      ${selected ? styles.calDaySelected : ''}
                      ${todayDay && !selected ? styles.calDayToday : ''}
                    `}
                                        onClick={() => !past && setSelectedDate(new Date(currentYear, currentMonth, day))}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* STEP 3 — TIME */}
                {step === 3 && (
                    <div className={styles.timeSection}>
                        <div className={styles.selectedDateLabel}>
                            📅 {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
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

                {/* NAVIGATION BUTTONS */}
                <div className={styles.navBtns}>
                    {step > 1 && (
                        <button className={styles.btnBack} onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}>
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            className={styles.btnNext}
                            disabled={step === 1 ? !selectedService : !selectedDate}
                            onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)}
                        >
                            Continue →
                        </button>
                    ) : (
                        <button
                            className={styles.btnConfirm}
                            disabled={!selectedTime}
                            onClick={handleConfirm}
                        >
                            Confirm Booking ✓
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Booking
