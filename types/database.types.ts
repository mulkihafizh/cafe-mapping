export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'user' | 'guest'
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'user' | 'guest'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'user' | 'guest'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      cafes: {
        Row: {
          id: string
          name: string
          description: string | null
          lat: number
          lng: number
          rating_avg: number
          rating_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          lat: number
          lng: number
          rating_avg?: number
          rating_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          lat?: number
          lng?: number
          rating_avg?: number
          rating_count?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          cafe_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cafe_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cafe_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      cafe_images: {
        Row: {
          id: string
          cafe_id: string
          user_id: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          cafe_id: string
          user_id: string
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          cafe_id?: string
          user_id?: string
          storage_path?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
