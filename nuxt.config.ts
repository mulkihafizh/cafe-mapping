export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    'nuxt-icon'
  ],
  supabase: {
    redirect: false
  },
  css: [
    'maplibre-gl/dist/maplibre-gl.css'
  ],
  devtools: { enabled: true }
})
