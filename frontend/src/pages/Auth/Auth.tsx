import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Auth.module.css'
import { api } from '../../api/client'

type Step = 'role' | 'phone' | 'otp'
type Role = 'client' | 'artist' | 'admin'

interface AuthResponse {
    token: string
    user: { id: number; name: string | null; phone: string; role: Role }
}

const saveAuth = (data: AuthResponse) => {
    localStorage.setItem('lazure_token', data.token)
    localStorage.setItem('lazure_user_id', String(data.user.id))
    localStorage.setItem('lazure_role', data.user.role)
    if (data.user.name) localStorage.setItem('lazure_name', data.user.name)
}

const Auth = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTo = (location.state as { redirectTo?: string })?.redirectTo

    const [step, setStep] = useState<Step>('role')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState<Role | null>(null)
    const [otp, setOtp] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [devCode, setDevCode] = useState('')

    const otpRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]

    const handleRoleSelect = (r: Role) => {
        setRole(r)
        setStep('phone')
    }

    const handleSendCode = async () => {
        setError('')
        const fullPhone = `+374${phone}`
        if (phone.length < 8) { setError('Enter phone number'); return }
        setLoading(true)
        try {
            const data = await api.post<{ code?: string }>('/api/auth/send-otp', { phone: fullPhone })
            if (data?.code) setDevCode(String(data.code))
            setStep('otp')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Sending error')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1)
        const newOtp = [...otp]
        newOtp[index] = digit
        setOtp(newOtp)
        if (digit && index < 3) otpRefs[index + 1].current?.focus()
        if (newOtp.every(d => d !== '') && digit) handleVerify(newOtp.join(''))
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs[index - 1].current?.focus()
    }

    const handleVerify = async (code?: string) => {
        setError('')
        const fullPhone = `+374${phone}`
        const finalCode = code || otp.join('')
        if (finalCode.length !== 4) { setError('Enter 4-digit code'); return }
        setLoading(true)
        try {
            const data = await api.post<AuthResponse>('/api/auth/verify-otp', {
                phone: fullPhone,
                code: finalCode,
            })
            saveAuth(data)

            if (redirectTo) {
                navigate(redirectTo, { replace: true })
            } else if (data.user.role === 'admin') {
                navigate('/admin')
            } else if (data.user.role === 'artist') {
                navigate('/dashboard/artist')
            } else {
                navigate('/dashboard/client')
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid code')
            setOtp(['', '', '', ''])
            otpRefs[0].current?.focus()
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <div className={styles.logo}>La<span>Zure</span></div>

                {step === 'role' && (
                    <div className={styles.section}>
                        <h1 className={styles.title}>Welcome back</h1>
                        <p className={styles.sub}>How are you joining us today?</p>
                        <div className={styles.roleGrid}>
                            <button className={styles.roleCard} onClick={() => handleRoleSelect('client')}>
                                <div className={styles.roleIcon}>💅</div>
                                <div className={styles.roleName}>I'm a Client</div>
                                <div className={styles.roleDesc}>Book nail appointments</div>
                            </button>
                            <button className={styles.roleCard} onClick={() => handleRoleSelect('artist')}>
                                <div className={styles.roleIcon}>✨</div>
                                <div className={styles.roleName}>I'm an Artist</div>
                                <div className={styles.roleDesc}>Manage my bookings</div>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'phone' && (
                    <div className={styles.section}>
                        <button className={styles.back} onClick={() => setStep('role')}>← Back</button>
                        <h1 className={styles.title}>Login</h1>
                        <p className={styles.sub}>Enter your number and we'll send a confirmation code.</p>
                        <div className={styles.phoneInput}>
                            <span className={styles.phonePrefix}>+374</span>
                            <input
                                className={styles.input}
                                type="tel"
                                placeholder="91 234 567"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                                autoFocus
                                maxLength={9}
                            />
                        </div>
                        {error && <p style={{ color: 'var(--deep-rose)', fontSize: '13px' }}>{error}</p>}
                        <button
                            className={styles.btnPrimary}
                            onClick={handleSendCode}
                            disabled={loading || phone.length < 8}
                        >
                            {loading ? 'Sending...' : 'Get code'}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className={styles.section}>
                        <button className={styles.back} onClick={() => setStep('phone')}>← Back</button>
                        <h1 className={styles.title}>
                            {role === 'client' ? 'Sign in as Client' : 'Sign in as Artist'}
                        </h1>
                        <p className={styles.sub}>Sent to +374{phone}</p>

                        {/* Dev подсказка — убрать в проде */}
                        {devCode && (
                            <div style={{
                                background: 'var(--blush)',
                                border: '1px solid var(--rose)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                fontSize: '13px',
                                color: 'var(--deep-rose)',
                                textAlign: 'center',
                            }}>
                                🔧 Dev mode — code: <strong style={{ fontSize: '22px', letterSpacing: '4px' }}>{devCode}</strong>
                            </div>
                        )}
                        <div className={styles.otpGrid}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={otpRefs[i]}
                                    className={styles.otpInput}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>
                        {error && <p style={{ color: 'var(--deep-rose)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
                        <button
                            className={styles.btnPrimary}
                            onClick={() => handleVerify()}
                            disabled={loading || otp.some(d => d === '')}
                        >
                            {loading ? 'Checking...' : 'Sign in'}
                        </button>
                        <p className={styles.hint}>
                            Didn't receive the code?{' '}
                            <button className={styles.resend} onClick={handleSendCode}>Send again</button>
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Auth
