const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('lazure_token')
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
    }
    if (response.status === 204) return null as T
    return response.json()
}

export const api = {
    get:    <T = unknown>(path: string) => apiFetch<T>(path, { method: 'GET' }),
    post:   <T = unknown>(path: string, body: unknown) => apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch:  <T = unknown>(path: string, body: unknown) => apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T = unknown>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
}
