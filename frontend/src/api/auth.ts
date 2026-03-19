// src/api/auth.ts
import { api } from './client'

export interface AuthResponse {
    token: string
    user: { id: number; name: string | null; phone: string; role: 'client' | 'artist' | 'admin' }
}

export const getMe = () => api.get<AuthResponse['user']>('/api/auth/me')
export const updateMe = (name: string) => api.patch('/api/auth/me', { name })

export const saveAuth = (data: AuthResponse) => {
    localStorage.setItem('lazure_token', data.token)
    localStorage.setItem('lazure_user_id', String(data.user.id))
    localStorage.setItem('lazure_role', data.user.role)
    if (data.user.name) localStorage.setItem('lazure_name', data.user.name)
}
export const clearAuth = () => {
    ['lazure_token','lazure_user_id','lazure_role','lazure_name'].forEach(k => localStorage.removeItem(k))
}
export const getStoredUser = () => ({
    token:   localStorage.getItem('lazure_token'),
    user_id: localStorage.getItem('lazure_user_id'),
    role:    localStorage.getItem('lazure_role') as 'client' | 'artist' | 'admin' | null,
    name:    localStorage.getItem('lazure_name'),
})
export const isLoggedIn = () => !!localStorage.getItem('lazure_token')
