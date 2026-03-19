import photo1 from '../assets/images/photo1.jpg'
import photo2 from '../assets/images/photo2.jpg'
import photo3 from '../assets/images/photo3.jpg'
import photo4 from '../assets/images/photo4.jpg'
import type { Artist, Service } from '../types'

export const cachedPhotos = [
    photo1,
    photo2,
    photo3,
    photo4
]

export const artists: Artist[] = [
    {
        id: '1',
        username: 'nails-by-gaya',
        name: 'Nails by Gaya',
        specialty: ['Nail Art', 'Extensions'],
        rating: 4.9,
        reviews: 142,
        priceFrom: 8000,
        available: 'today',
        photo: photo1,
    },
    {
        id: '2',
        username: 'nails-by-lena',
        name: 'Nails by Lena',
        specialty: ['Gel Polish', 'French'],
        rating: 4.8,
        reviews: 98,
        priceFrom: 6500,
        available: 'today',
        photo: photo2,
    },
    {
        id: '3',
        username: 'nails-by-toma',
        name: 'Nails by Toma',
        specialty: ['Pedicure', 'Manicure'],
        rating: 4.7,
        reviews: 76,
        priceFrom: 5000,
        available: 'tomorrow',
        photo: photo3,
    },
    {
        id: '4',
        username: 'nails-by-anna',
        name: 'Nails by Anna',
        specialty: ['Nail Art', 'Gel Polish'],
        rating: 4.6,
        reviews: 54,
        priceFrom: 7000,
        available: 'this-week',
        photo: photo4,
    },
]

export const services: Service[] = [
    { id: '1', name: 'Manicure', duration: '45–60 min', priceFrom: 5000, icon: '💅' },
    { id: '2', name: 'Gel Polish', duration: '60–90 min', priceFrom: 7000, icon: '✨' },
    { id: '3', name: 'Nail Art', duration: '90–120 min', priceFrom: 9000, icon: '🌸' },
    { id: '4', name: 'Pedicure', duration: '60–75 min', priceFrom: 6000, icon: '🦶' },
    { id: '5', name: 'Extensions', duration: '120–150 min', priceFrom: 12000, icon: '💎' },
    { id: '6', name: 'Nail Lessons', duration: '2–3 hours', priceFrom: 15000, icon: '📚' },
]
