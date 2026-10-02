import type { Cafe, Review } from '../types'

export const mockCafes: Cafe[] = [
  {
    id: 'cafe-1',
    name: 'Kopi Daong',
    description: 'Pine forest coffee shop',
    lat: -6.7118,
    lng: 106.8722,
    rating_avg: 4.8,
    rating_count: 24,
    created_at: new Date().toISOString()
  },
  {
    id: 'cafe-2',
    name: 'Popolo Coffee',
    description: 'Minimalist coffee shop in Sentul',
    lat: -6.5828,
    lng: 106.8625,
    rating_avg: 4.2,
    rating_count: 15,
    created_at: new Date().toISOString()
  },
  {
    id: 'cafe-3',
    name: 'Raindear Coffee & Kitchen',
    description: 'Cozy place with great food',
    lat: -6.5944,
    lng: 106.7891,
    rating_avg: 3.5,
    rating_count: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'cafe-4',
    name: 'Unreviewed Hidden Gem',
    description: 'A new spot waiting to be discovered',
    lat: -6.6100,
    lng: 106.8200,
    rating_avg: 0,
    rating_count: 0,
    created_at: new Date().toISOString()
  }
]

export const mockReviews: Record<string, Review[]> = {
  'cafe-1': [
    {
      id: 'rev-1',
      cafe_id: 'cafe-1',
      user_id: 'user-1',
      rating: 5,
      comment: 'Amazing view and coffee!',
      created_at: new Date().toISOString(),
      profiles: {
        full_name: 'Budi Santoso',
        avatar_url: 'https://i.pravatar.cc/150?u=user-1'
      }
    },
    {
      id: 'rev-2',
      cafe_id: 'cafe-1',
      user_id: 'user-2',
      rating: 4,
      comment: 'Great atmosphere but a bit crowded.',
      created_at: new Date().toISOString(),
      profiles: {
        full_name: 'Siti Rahma',
        avatar_url: 'https://i.pravatar.cc/150?u=user-2'
      }
    }
  ],
  'cafe-2': [
    {
      id: 'rev-3',
      cafe_id: 'cafe-2',
      user_id: 'user-3',
      rating: 4,
      comment: 'Love the minimalist design.',
      created_at: new Date().toISOString(),
      profiles: {
        full_name: 'Agus Wijaya',
        avatar_url: 'https://i.pravatar.cc/150?u=user-3'
      }
    }
  ],
  'cafe-3': [
    {
      id: 'rev-4',
      cafe_id: 'cafe-3',
      user_id: 'user-4',
      rating: 3,
      comment: 'Okay place, but food is pricey.',
      created_at: new Date().toISOString(),
      profiles: {
        full_name: 'Dewi Lestari',
        avatar_url: 'https://i.pravatar.cc/150?u=user-4'
      }
    }
  ]
}
