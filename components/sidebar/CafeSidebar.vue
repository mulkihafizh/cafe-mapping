<template>
  <div
    class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 z-40 overflow-y-auto"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div v-if="cafe" class="p-6">
      <button @click="closeSidebar" class="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
        <Icon name="lucide:x" class="w-5 h-5" />
      </button>

      <h2 class="text-2xl font-bold mt-4">{{ cafe.name }}</h2>
      <p class="text-gray-600 mt-2">{{ cafe.description }}</p>

      <div class="mt-4 flex items-center space-x-2">
        <Icon name="lucide:star" class="w-5 h-5 text-yellow-500" />
        <span class="font-semibold">{{ cafe.rating_avg.toFixed(1) }}</span>
        <span class="text-sm text-gray-500">({{ cafe.rating_count }} reviews)</span>
      </div>

      <div v-if="cafe.rating_count === 0" class="mt-8 p-4 bg-slate-50 rounded-lg text-center border border-slate-200">
        <Icon name="lucide:coffee" class="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p class="text-slate-600 font-medium">No reviews yet!</p>
        <p class="text-sm text-slate-500 mb-4">Be the first to rate this spot.</p>
        <button @click="emit('open-review')" class="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600">
          Leave a Review
        </button>
      </div>

      <div v-else class="mt-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Community Reviews</h3>
          <button @click="emit('open-review')" class="text-sm text-orange-600 font-medium hover:underline">
            Write Review
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="review in reviews" :key="review.id" class="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <img v-if="review.profiles?.avatar_url" :src="review.profiles.avatar_url" class="w-8 h-8 rounded-full" />
                <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {{ review.profiles?.full_name?.substring(0, 2) || '?' }}
                </div>
                <span class="font-medium text-sm">{{ review.profiles?.full_name }}</span>
              </div>
              <div class="flex items-center text-yellow-500">
                <Icon name="lucide:star" class="w-4 h-4" />
                <span class="text-sm ml-1">{{ review.rating }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-700">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/useMapStore'

const emit = defineEmits(['open-review'])

const mapStore = useMapStore()

const cafe = computed(() => mapStore.selectedCafe)
const reviews = computed(() => mapStore.selectedCafeReviews)
const isOpen = computed(() => !!mapStore.selectedCafeId)

const closeSidebar = () => {
  mapStore.selectCafe(null)
}
</script>
