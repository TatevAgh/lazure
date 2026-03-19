// src/api/artists.ts
import { api } from './client'

export interface ArtistListItem {
    id: number; username: string; name: string; photo: string
    specialty: string[]; priceFrom: number; rating: number; reviews: number
    available: 'today' | 'tomorrow' | 'this-week'; is_verified: boolean
}
export interface Service {
    id: number; name: string; icon: string | null; duration: string | null; price: number
}
export interface ArtistFull extends ArtistListItem {
    bio: string | null; phone: string; services: Service[]
}

export const getArtists = (params?: { available?: string; max_price?: number }) => {
    const q = new URLSearchParams()
    if (params?.available) q.append('available', params.available)
    if (params?.max_price) q.append('max_price', String(params.max_price))
    const qs = q.toString()
    return api.get<ArtistListItem[]>(`/api/artists${qs ? `?${qs}` : ''}`)
}
export const getArtistByUsername = (username: string) => api.get<ArtistFull>(`/api/artists/${username}`)
export const getMyArtistProfile  = () => api.get<ArtistFull>('/api/artists/profile/me')
export const updateMyArtistProfile = (data: Partial<{ bio: string; specialty: string[]; price_from: number; available: string; username: string }>) =>
    api.patch('/api/artists/profile/me', data)
export const addService    = (data: { name: string; duration?: string; price: number; icon?: string }) =>
    api.post<Service>('/api/artists/services', data)
export const deleteService = (id: number) => api.delete(`/api/artists/services/${id}`)
