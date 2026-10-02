export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      'Plus+Jakarta+Sans': [300, 400, 500, 600, 700]
    }
  },
  supabase: {
    redirect: false
  },
  css: [
    'maplibre-gl/dist/maplibre-gl.css'
  ],
  devtools: { enabled: true }
})
