const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// function for requesting

async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('lazure_token');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...options.headers
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong')
    }

    return response.json();
}

//api functions

export const api = {
    //authorization
    register: (data: object) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: object) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => apiRequest('/api/auth/me'),

    //masters
    getArtists: () => apiRequest('/api/artists'),
    getArtist: (username: string) => apiRequest(`/api/artists/${username}`),

    //booking
    createBooking: (data: object) => apiRequest('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
    getMyBookings: () => apiRequest('/api/bookings/my'),

}
