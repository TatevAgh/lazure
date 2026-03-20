import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'
import { api } from '../../api/client'

interface AuthResponse {
    token: string
    user: { id: number; name: string | null; phone: string; role: string }
}

const AdminLogin = () => {
    const navigate = useNavigate()
    const [phone, setPhone] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [devCode, setDevCode] = useState('')

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
            setError(err instanceof Error ? err.message : 'Error sending code')
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async () => {
        setError('')
        const fullPhone = `+374${phone}`
        setLoading(true)
        try {
            const data = await api.post<AuthResponse>('/api/auth/verify-otp', {
                phone: fullPhone,
                code: otp,
            })
            if (data.user.role !== 'admin') {
                setError('Access denied. Admin only.')
                return
            }
            localStorage.setItem('lazure_token', data.token)
            localStorage.setItem('lazure_role', data.user.role)
            navigate('/admin')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid code')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <div className={styles.logo}>La<span>Zure</span></div>
                <div className={styles.adminLabel}>Admin Access</div>

                {step === 'phone' && (
                    <div className={styles.form}>
                        <h1 className={styles.title}>Sign in</h1>
                        <p className={styles.sub}>Enter your admin phone number</p>
                        <div className={styles.phoneInput}>
                            <span className={styles.prefix}>+374</span>
                            <input
                                className={styles.input}
                                type="tel"
                                placeholder="00 000 000"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                                autoFocus
                                maxLength={9}
                            />
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <button
                            className={styles.btn}
                            onClick={handleSendCode}
                            disabled={loading || phone.length < 8}
                        >
                            {loading ? 'Sending...' : 'Get Code'}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className={styles.form}>
                        <button className={styles.back} onClick={() => setStep('phone')}>← Back</button>
                        <h1 className={styles.title}>Enter code</h1>
                        <p className={styles.sub}>Sent to +374{phone}</p>
                        {devCode && (
                            <div className={styles.devCode}>
                                Dev code: <strong>{devCode}</strong>
                            </div>
                        )}
                        <input
                            className={styles.otpInput}
                            type="text"
                            inputMode="numeric"
                            placeholder="0000"
                            maxLength={4}
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={e => e.key === 'Enter' && handleVerify()}
                            autoFocus
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button
                            className={styles.btn}
                            onClick={handleVerify}
                            disabled={loading || otp.length !== 4}
                        >
                            {loading ? 'Checking...' : 'Sign In'}
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}

export default AdminLogin
