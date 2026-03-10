export interface Artist {
    id: string
    username: string
    name: string
    specialty: string[]
    rating: number
    reviews: number
    priceFrom: number
    available: 'today' | 'tomorrow' | 'this-week'
    photo: string
}

export interface Service {
    id: string
    name: string
    duration: string
    priceFrom: number
    icon: string
}

export interface Booking {
    id: string
    artistId: string
    clientId: string
    service: string
    date: string
    time: string
    status: 'pending' | 'confirmed' | 'cancelled'
}
export interface Availability {
    date: string
    slots: string[]  // только свободные слоты
}
