import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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
  ],
  css: ['~/assets/css/main.css'],
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
})