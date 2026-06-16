<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:py-8">
    <div class="flex items-center justify-between gap-3">
      <h1 class="flex items-center gap-2 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        <span>🗺️</span> Adventure
      </h1>
      <div class="flex items-center gap-1 rounded-full bg-amber-100 px-4 py-1.5 font-bold text-amber-600 shadow-sm dark:bg-amber-500/15 dark:text-amber-300">
        <span class="text-xl">⭐</span> {{ adventureStore.totalStars }}/{{ adventureStore.maxStars }}
      </div>
    </div>

    <p class="text-slate-500 dark:text-slate-300">
      Clear a level to earn stars and unlock the next challenge. Can you become the Grand Champion?
    </p>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <component
          :is="adventureStore.isUnlocked(lvl.level) ? 'button' : 'div'"
          v-for="lvl in ADVENTURE_LEVELS"
          :key="lvl.level"
          :disabled="!adventureStore.isUnlocked(lvl.level)"
          class="relative flex flex-col items-center gap-1 rounded-3xl border-2 p-4 text-center shadow-md transition-transform"
          :class="adventureStore.isUnlocked(lvl.level)
            ? 'border-white/60 bg-white/85 backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer dark:border-white/10 dark:bg-slate-800/85'
            : 'border-dashed border-slate-300 bg-white/40 opacity-70 cursor-not-allowed dark:border-slate-600 dark:bg-slate-800/40'"
          @click="adventureStore.isUnlocked(lvl.level) && play(lvl.level)"
      >
        <span class="absolute left-2 top-2 text-xs font-bold text-slate-400">{{ lvl.level }}</span>

        <span v-if="adventureStore.isUnlocked(lvl.level)" class="text-4xl">{{ lvl.emoji }}</span>
        <span v-else class="text-4xl">🔒</span>

        <span class="font-display text-sm font-bold leading-tight text-slate-700 dark:text-slate-200">{{ lvl.title }}</span>

        <span class="flex items-center gap-0.5">
          <span
              v-for="n in 3"
              :key="n"
              class="text-base"
              :class="n <= (adventureStore.getResult(lvl.level)?.stars ?? 0) ? '' : 'opacity-25 grayscale'"
          >⭐</span>
        </span>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useAdventureStore} from "~/store/adventureStore";
import {ADVENTURE_LEVELS, getAdventureLevel} from "~/store/adventureLevels";

const router = useRouter()
const currentGameStore = useCurrentGameStore()
const adventureStore = useAdventureStore()

function play(level: number) {
  const cfg = getAdventureLevel(level)
  if (!cfg) return
  currentGameStore.createNewGame(cfg.settings, 'adventure', level)
  router.push('/')
}
</script>
