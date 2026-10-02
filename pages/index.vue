<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Top Nav / Floating Header -->
    <header class="absolute top-4 left-4 z-40 flex items-center space-x-4 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100">
      <div class="flex items-center space-x-2 text-orange-600">
        <Icon name="lucide:coffee" class="w-6 h-6" />
        <h1 class="font-bold text-lg tracking-tight">Bogor Cafe Explorer</h1>
      </div>

      <div class="h-6 w-px bg-gray-300"></div>

      <div class="text-sm">
        <span v-if="authStore.role === 'guest'" class="text-gray-500 flex items-center gap-1">
          <Icon name="lucide:eye" class="w-4 h-4" /> Guest View
        </span>
        <span v-else-if="authStore.role === 'user'" class="text-blue-600 font-medium flex items-center gap-1">
          <Icon name="lucide:user" class="w-4 h-4" /> {{ authStore.user?.email }}
        </span>
        <span v-else-if="authStore.role === 'admin'" class="text-purple-600 font-medium flex items-center gap-1">
          <Icon name="lucide:shield" class="w-4 h-4" /> Admin
        </span>
      </div>

      <!-- Dev / Mock Auth Switcher for Scaffold Testing -->
      <div class="flex space-x-2 ml-4">
        <button v-if="authStore.role !== 'guest'" @click="authStore.logout()" class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Logout</button>
        <button v-if="authStore.role === 'guest'" @click="authStore.loginAsUser('u1', 'user@test.com')" class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200">Login User</button>
        <button v-if="authStore.role === 'guest'" @click="authStore.loginAsAdmin('a1', 'admin@test.com')" class="text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200">Login Admin</button>
      </div>
    </header>

    <!-- Client-Only Map -->
    <ClientOnly>
      <MapContainer />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-gray-50">
          <div class="animate-pulse flex flex-col items-center">
            <Icon name="lucide:map" class="w-12 h-12 text-gray-300 mb-4" />
            <p class="text-gray-400">Loading map environment...</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Sidebar UI -->
    <CafeSidebar @open-review="isReviewModalOpen = true" />

    <!-- Review Modal -->
    <ReviewModal :is-open="isReviewModalOpen" @close="isReviewModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapContainer from '@/components/map/MapContainer.vue'
import CafeSidebar from '@/components/sidebar/CafeSidebar.vue'
import ReviewModal from '@/components/modals/ReviewModal.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const isReviewModalOpen = ref(false)
</script>
