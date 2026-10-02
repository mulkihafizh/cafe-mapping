import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Cafe = Database['public']['Tables']['cafes']['Row']
export type Review = Database['public']['Tables']['reviews']['Row'] & { profiles?: Pick<Profile, 'full_name' | 'avatar_url'> }
export type CafeImage = Database['public']['Tables']['cafe_images']['Row']

export interface MarkerStyle {
  size: number
  borderColor: string
  shadow: string
}
