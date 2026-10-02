import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { mockCafes, mockReviews } from '../utils/mockData'
import type { Cafe, Review } from '../types'

export const useMapStore = defineStore('map', () => {
  const cafes = ref<Cafe[]>(mockCafes)
  const selectedCafeId = ref<string | null>(null)

  // Boger bounds / center
  const mapCenter = ref<[number, number]>([106.82, -6.61])

  // Global Avatar Cycling Tick
  const globalAvatarTick = ref(0)

  useIntervalFn(() => {
    globalAvatarTick.value++
  }, 3000)

  const selectedCafe = computed(() =>
    cafes.value.find(c => c.id === selectedCafeId.value) || null
  )

  const selectedCafeReviews = computed(() => {
    if (!selectedCafeId.value) return []
    return mockReviews[selectedCafeId.value] || []
  })

  function selectCafe(id: string | null) {
    selectedCafeId.value = id
  }

  function getCafeReviews(id: string): Review[] {
    return mockReviews[id] || []
  }

  return {
    cafes,
    selectedCafeId,
    mapCenter,
    globalAvatarTick,
    selectedCafe,
    selectedCafeReviews,
    selectCafe,
    getCafeReviews
  }
})
