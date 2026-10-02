<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
      <button @click="emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <Icon name="lucide:x" class="w-5 h-5" />
      </button>

      <h3 class="text-xl font-bold mb-4">Leave a Review</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div class="flex space-x-2">
          <button
            v-for="star in 5"
            :key="star"
            @click="form.rating = star"
            class="focus:outline-none"
          >
            <Icon
              name="lucide:star"
              class="w-8 h-8 transition-colors"
              :class="star <= form.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
            />
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
        <textarea
          v-model="form.comment"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          placeholder="What did you think of this cafe?"
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
        <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <Icon name="lucide:camera" class="w-6 h-6 mx-auto text-gray-400 mb-1" />
          <span class="text-sm text-gray-500">Click to upload photos</span>
        </div>
        <p class="text-xs text-gray-400 mt-2">Note: Storage logic to be implemented later.</p>
      </div>

      <button @click="submitReview" class="w-full bg-orange-600 text-white rounded-md py-2 px-4 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium">
        Submit Review
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const form = ref({
  rating: 0,
  comment: ''
})

const submitReview = () => {
  // Mock logic - to be replaced by actual Supabase insert
  alert(`Review submitted! Rating: ${form.value.rating}`)
  form.value = { rating: 0, comment: '' }
  emit('close')
}
</script>
