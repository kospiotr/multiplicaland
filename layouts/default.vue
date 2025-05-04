<template>
  <div class="default-layout">
    <UNavigationMenu
        highlight
        highlight-color="secondary"
        orientation="horizontal"
        content-orientation="vertical"
        :items="items"
        class="data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
    />

    <slot/>
  </div>
</template>

<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'
import {useGameSettingsStore} from "~/store/gameSettingsStore";
import {useCurrentGameStore} from "~/store/currentGameStore";
const router = useRouter();
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
      label: 'Multiplica-Land',
      icon: 'i-lucide-house',
      to: '/'
    }
  ],
  [
    {
      icon: 'i-lucide-square-plus', onSelect(e) {
        const settingsStore = useGameSettingsStore()
        const currentGameStore = useCurrentGameStore()
        currentGameStore.createNewGame(settingsStore.data);
        router.push('/');
      }
    },
    {
      icon: isDark.value ? 'i-lucide-sun' : 'i-lucide-moon', onSelect(e) {
        isDark.value = !isDark.value;
      },
    },
    {
      icon: 'i-lucide-user' , children:
          [
            {label: 'Login', to: '/login'},
            {label: 'Register', to: '/register'},
            {label: 'Progress', to: '/progress'},
            {label: 'Achievements', to: '/achievements'},
            {label: 'Settings', to: '/settings'},
          ]
    }

  ]
])
</script>
