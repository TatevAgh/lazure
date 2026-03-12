const BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
    const token = localStorage.getItem('token');

    return await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        }
    })
}
