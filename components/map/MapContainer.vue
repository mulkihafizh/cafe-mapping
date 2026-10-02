<template>
  <div class="relative w-full h-screen">
    <!-- The actual map container -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Hidden template used to mount Vue components into maplibre markers natively in Nuxt context -->
    <div class="hidden">
      <div v-for="cafe in mapStore.cafes" :key="cafe.id" :id="`marker-container-${cafe.id}`" :ref="el => addMarkerRef(el, cafe.id)">
         <CafeMarker :cafe="cafe" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import maplibregl from 'maplibre-gl'
import { useBogorMap } from '@/composables/useBogorMap'
import { useMapStore } from '@/stores/useMapStore'
import CafeMarker from './CafeMarker.vue'

const mapContainer = ref<HTMLElement | null>(null)
const { initMap, destroyMap, mapInstance, flyTo } = useBogorMap()
const mapStore = useMapStore()

const maplibreMarkers = ref<Map<string, maplibregl.Marker>>(new Map())
const markerRefs = ref<Map<string, HTMLElement>>(new Map())

const addMarkerRef = (el: any, id: string) => {
  if (el) {
    markerRefs.value.set(id, el as HTMLElement)
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  initMap(mapContainer.value)

  if (mapInstance.value) {
    mapInstance.value.on('load', async () => {
      await nextTick()
      renderMarkers()
    })
  }
})

watch(() => mapStore.selectedCafeId, (newId) => {
  if (newId) {
    const cafe = mapStore.cafes.find(c => c.id === newId)
    if (cafe) {
      flyTo(cafe.lng, cafe.lat, 16)
    }
  }
})

const renderMarkers = () => {
  if (!mapInstance.value) return

  // Clear existing markers from maplibre
  maplibreMarkers.value.forEach(marker => marker.remove())
  maplibreMarkers.value.clear()

  // Add new markers from Nuxt-rendered DOM nodes
  mapStore.cafes.forEach(cafe => {
    const el = markerRefs.value.get(cafe.id)
    if (!el) return

    // We remove it from the hidden container and pass it to maplibregl,
    // although maplibregl just uses the DOM node.
    // It remains in the Vue reactivity tree because Vue manages it directly via v-for.
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([cafe.lng, cafe.lat])
      .addTo(mapInstance.value!)

    maplibreMarkers.value.set(cafe.id, marker)
  })
}

// Watch cafes array in case it updates from DB
watch(() => mapStore.cafes, async () => {
  await nextTick()
  renderMarkers()
}, { deep: true })

onBeforeUnmount(() => {
  maplibreMarkers.value.forEach(marker => marker.remove())
  maplibreMarkers.value.clear()
  destroyMap()
})
</script>
