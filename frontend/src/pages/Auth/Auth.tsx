import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'

type Step = 'role' | 'phone' | 'otp'
type Role = 'client' | 'artist'

const Auth = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState<Step>('role')
    const [role, setRole] = useState<Role | null>(null)
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(['', '', '', ''])

    const handleRoleSelect = (r: Role) => {
        setRole(r)
        setStep('phone')
    }

    const handlePhoneSubmit = () => {
        if (phone.length < 8) return
        setStep('otp')
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return
        if (value && !/^\d$/.test(value)) return  // только цифры!
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value && index < 3) {
            const next = document.getElementById(`otp-${index + 1}`)
            next?.focus()
        }
    }

    const handleConfirm = () => {
        alert('✅ Successfully signed in!')
        navigate('/')
    }

    return (
        <main className={styles.main}>
            <div className={styles.card}>

                {/* LOGO */}
                <div className={styles.logo}>La<span>Zure</span></div>

                {/* STEP: ROLE */}
                {step === 'role' && (
                    <div className={styles.section}>
                        <h1 className={styles.title}>Welcome back</h1>
                        <p className={styles.sub}>How are you joining us today?</p>
                        <div className={styles.roleGrid}>
                            <button
                                className={styles.roleCard}
                                onClick={() => handleRoleSelect('client')}
                            >
                                <div className={styles.roleIcon}>💅</div>
                                <div className={styles.roleName}>I'm a Client</div>
                                <div className={styles.roleDesc}>Book nail appointments</div>
                            </button>
                            <button
                                className={styles.roleCard}
                                onClick={() => handleRoleSelect('artist')}
                            >
                                <div className={styles.roleIcon}>✨</div>
                                <div className={styles.roleName}>I'm an Artist</div>
                                <div className={styles.roleDesc}>Manage my bookings</div>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP: PHONE */}
                {step === 'phone' && (
                    <div className={styles.section}>
                        <button className={styles.back} onClick={() => setStep('role')}>← Back</button>
                        <h1 className={styles.title}>
                            {role === 'client' ? 'Sign in as Client' : 'Sign in as Artist'}
                        </h1>
                        <p className={styles.sub}>Enter your phone number to continue</p>
                        <div className={styles.phoneInput}>
                            <span className={styles.phonePrefix}>+374</span>
                            <input
                                type="tel"
                                placeholder="XX XXX XXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className={styles.input}
                                maxLength={8}
                                autoFocus
                            />
                        </div>
                        <button
                            className={styles.btnPrimary}
                            disabled={phone.length < 8}
                            onClick={handlePhoneSubmit}
                        >
                            Send Code →
                        </button>
                        <p className={styles.hint}>We'll send a 4-digit code via SMS</p>
                    </div>
                )}

                {/* STEP: OTP */}
                {step === 'otp' && (
                    <div className={styles.section}>
                        <button className={styles.back} onClick={() => setStep('phone')}>← Back</button>
                        <h1 className={styles.title}>Enter the code</h1>
                        <p className={styles.sub}>Sent to +374 {phone}</p>
                        <div className={styles.otpGrid}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="tel"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    className={styles.otpInput}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>
                        <button
                            className={styles.btnPrimary}
                            disabled={otp.some(d => d === '')}
                            onClick={handleConfirm}
                        >
                            Confirm →
                        </button>
                        <p className={styles.hint}>
                            Didn't receive it?{' '}
                            <button className={styles.resend} onClick={() => setOtp(['', '', '', ''])}>
                                Resend
                            </button>
                        </p>
                    </div>
                )}

            </div>
        </main>
    )
}

export default Auth
