<template>
  <div class="play-bg">
    <header class="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
          class="mx-auto flex max-w-4xl items-center justify-between gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 sm:px-4">
        <!-- Brand -->
        <button
            class="font-display text-lg font-extrabold tracking-tight text-violet-600 transition-transform hover:scale-105 active:scale-95 dark:text-violet-300 sm:text-xl"
            @click="goToModeSelect"
        >
          Multiplica<span class="text-pink-500 dark:text-pink-400">Land</span>
        </button>

        <!-- Actions -->
        <div class="flex items-center gap-1 sm:gap-2">
          <UButton
              color="primary"
              variant="solid"
              size="md"
              icon="i-lucide-play"
              class="rounded-full font-semibold shadow-md transition-transform hover:scale-105 active:scale-95"
              @click="startNewGame"
          >
            <span class="hidden sm:inline">New game</span>
          </UButton>

          <UButton
              color="neutral"
              variant="ghost"
              size="md"
              :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
              class="rounded-full transition-transform hover:scale-110 active:scale-95"
              :aria-label="isDark ? 'Light mode' : 'Dark mode'"
              @click="isDark = !isDark"
          />

          <UDropdownMenu :items="userItems" :content="{ align: 'end' }">
            <UButton
                color="neutral"
                variant="ghost"
                size="md"
                icon="i-lucide-user"
                class="rounded-full transition-transform hover:scale-110 active:scale-95"
                aria-label="Account menu"
            />
          </UDropdownMenu>
        </div>
      </nav>
    </header>

    <main class="pb-16">
      <slot/>
    </main>
  </div>
</template>

<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'
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

function startNewGame() {
  const settingsStore = useGameSettingsStore()
  const currentGameStore = useCurrentGameStore()
  currentGameStore.createNewGame(settingsStore.data);
  router.push('/');
}

function goToModeSelect() {
  useCurrentGameStore().reset();
  router.push('/');
}

const userItems = ref<DropdownMenuItem[][]>([
  [
    {label: 'Progress', icon: 'i-lucide-trending-up', to: '/progress'},
    {label: 'Achievements', icon: 'i-lucide-trophy', to: '/achievements'},
    {label: 'Settings', icon: 'i-lucide-settings', to: '/settings'},
  ],
  [
    {label: 'Login', icon: 'i-lucide-log-in', to: '/login'},
    {label: 'Register', icon: 'i-lucide-user-plus', to: '/register'},
  ]
])
</script>
