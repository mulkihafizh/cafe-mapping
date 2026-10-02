import { ref, shallowRef, unref } from 'vue'
import maplibregl from 'maplibre-gl'
import type { Map, MapOptions } from 'maplibre-gl'

export function useBogorMap() {
  const mapInstance = shallowRef<Map | null>(null)
  const isLoaded = ref(false)

  const initMap = (container: HTMLElement | string, options?: Partial<MapOptions>) => {
    const defaultOptions: MapOptions = {
      container,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // Free alternative to generic OSM that works well
      center: [106.82, -6.61],
      zoom: 12,
      ...options
    } as MapOptions

    const map = new maplibregl.Map(defaultOptions)

    map.on('load', () => {
      isLoaded.value = true
    })

    mapInstance.value = map
    return map
  }

  const flyTo = (lng: number, lat: number, zoom = 15) => {
    if (mapInstance.value) {
      mapInstance.value.flyTo({
        center: [lng, lat],
        zoom,
        essential: true
      })
    }
  }

  const destroyMap = () => {
    if (mapInstance.value) {
      mapInstance.value.remove()
      mapInstance.value = null
      isLoaded.value = false
    }
  }

  return {
    mapInstance,
    isLoaded,
    initMap,
    flyTo,
    destroyMap
  }
}
