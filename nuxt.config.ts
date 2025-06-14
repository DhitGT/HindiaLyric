// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
          defer: true,
        },
      ],
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
});
