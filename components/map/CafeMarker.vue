<template>
  <div
    class="relative cursor-pointer transition-transform duration-300 hover:scale-110"
    :class="[dynamicStyle.shadow]"
    :style="{ width: dynamicStyle.size + 'px', height: dynamicStyle.size + 'px', zIndex: zIndex }"
    @click="onClick"
  >
    <!-- State 1: Baseline (Unreviewed) -->
    <div
      v-if="cafe.rating_count === 0"
      class="absolute inset-0 bg-slate-500 rounded-full flex items-center justify-center shadow-md"
    >
      <Icon name="lucide:coffee" class="text-white w-1/2 h-1/2" />
    </div>

    <!-- State 2: Community Reviewed (Dynamic Avatar Ring) -->
    <div
      v-else
      class="absolute inset-0 rounded-full overflow-hidden border-[3px]"
      :style="{ borderColor: dynamicStyle.borderColor }"
    >
      <!-- Avatar cycling based on global tick -->
      <img
        v-if="currentReviewerAvatar"
        :src="currentReviewerAvatar"
        class="w-full h-full object-cover"
        alt="Reviewer Avatar"
      />
      <!-- Fallback initials (if somehow avatar is missing) -->
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
        {{ currentReviewerInitials }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/useMapStore'
import { useMarkerStyle } from '@/composables/useMarkerStyle'
import type { Cafe } from '@/types'

const props = defineProps<{
  cafe: Cafe
}>()

const mapStore = useMapStore()
const { getStyleForCafe } = useMarkerStyle()

const reviews = computed(() => mapStore.getCafeReviews(props.cafe.id))

// State logic
const dynamicStyle = computed(() => {
  if (props.cafe.rating_count === 0) {
    return { size: 24, borderColor: '', shadow: '' }
  }
  return getStyleForCafe(props.cafe.rating_avg, props.cafe.rating_count)
})

const zIndex = computed(() => props.cafe.rating_count === 0 ? 10 : 50)

// Cycling logic based on global tick
const currentReview = computed(() => {
  if (reviews.value.length === 0) return null
  const index = mapStore.globalAvatarTick % reviews.value.length
  return reviews.value[index]
})

const currentReviewerAvatar = computed(() => {
  return currentReview.value?.profiles?.avatar_url || null
})

const currentReviewerInitials = computed(() => {
  const name = currentReview.value?.profiles?.full_name || '?'
  return name.substring(0, 2).toUpperCase()
})

const onClick = () => {
  mapStore.selectCafe(props.cafe.id)
}
</script>
