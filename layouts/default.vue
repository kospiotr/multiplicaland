<template>
  <div class="default-layout">
    <UNavigationMenu
        highlight
        highlight-color="secondary"
        orientation="horizontal"
        :items="items"
        class="data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
    />

    <slot/>
  </div>
</template>

<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Multiplica-Land'
    }

  ],
  [
    {label: 'Quick Game', to: '/quick-game'},
    {label: 'Adventure', to: '/adventure'},
    {label: 'Progress', to: '/progress'},
    {label: 'Achievements', to: '/achievements'},
    {label: 'Settings', to: '/settings'},
    {
      icon: isDark.value ?  'i-lucide-sun' : 'i-lucide-moon', onSelect(e) {
        isDark.value = !isDark.value;
      },
    },
  ]
])
</script>
