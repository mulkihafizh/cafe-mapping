import type { MarkerStyle } from '../types'

export function useMarkerStyle() {
  const getStyleForCafe = (rating: number, ratingCount: number): MarkerStyle => {
    // Formula: Math.min(65, 35 + ((Rating / 5.0) * 15) + (RatingCount / 10))
    const calculatedSize = 35 + ((rating / 5.0) * 15) + (ratingCount / 10)
    const size = Math.min(65, calculatedSize)

    let borderColor = '#94a3b8' // Slate (Neutral)
    let shadow = 'shadow-md'

    if (rating >= 4.5) {
      borderColor = '#fbbf24' // Gold
      shadow = 'shadow-yellow-500/50 shadow-lg'
    } else if (rating >= 4.0) {
      borderColor = '#f97316' // Coral/Orange
    }

    return {
      size,
      borderColor,
      shadow
    }
  }

  return {
    getStyleForCafe
  }
}
