// src/api/bookings.ts
import { api } from './client'

export interface BookingOut {
    id: number; artist_id: number; client_id: number; service_id: number | null
    date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    notes: string | null; created_at: string
    artist_name?: string; artist_username?: string; artist_photo?: string | null
    service_name?: string; service_price?: number; duration?: string
    client_name?: string; client_phone?: string
}

export const createBooking = (data: { artist_id: number; service_id?: number; date: string; time: string; notes?: string }) =>
    api.post<BookingOut>('/api/bookings', data)
export const getMyBookings = () => api.get<BookingOut[]>('/api/bookings/my')
export const updateBookingStatus = (id: number, status: string) =>
    api.patch<BookingOut>(`/api/bookings/${id}/status`, { status })
