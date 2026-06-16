import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,

  nitro: {
    preset: "cloudflare-pages",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  modules: [
    "nitro-cloudflare-dev",
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'MultiplicaLand',
      meta: [
        { name: 'theme-color', content: '#8b5cf6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'MultiplicaLand' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  colorMode:{
    preference: 'light',
    fallback: 'light',
    classPrefix: '',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'MultiplicaLand',
      short_name: 'MultiplicaLand',
      description: 'A fun multiplication practice game for kids.',
      theme_color: '#8b5cf6',
      background_color: '#ede9fe',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})