<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useGameSettingsStore} from "~/store/gameSettingsStore";
import {useAdventureStore} from "~/store/adventureStore";
import {ADVENTURE_LEVELS} from "~/store/adventureLevels";

const router = useRouter();
const currentGameStore = useCurrentGameStore();
const settingsStore = useGameSettingsStore();
const adventureStore = useAdventureStore();

function playQuick() {
  currentGameStore.createNewGame(settingsStore.data, 'quick');
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-6">
    <div class="text-center">
      <div class="text-6xl animate-float sm:text-7xl">✖️</div>
      <h1 class="mt-2 font-display text-4xl font-extrabold text-violet-600 dark:text-violet-300 sm:text-5xl">
        Multiplica<span class="text-pink-500 dark:text-pink-400">Land</span>
      </h1>
      <p class="mt-1 text-lg font-medium text-slate-500 dark:text-slate-300">Pick a game and let's play!</p>
    </div>

    <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Quick game -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="playQuick"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-3xl shadow-md">⚡</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Quick Game</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">Jump right in with your current settings.</span>
        </span>
      </button>

      <!-- Custom game -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/settings')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-3xl shadow-md">🎛️</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Custom Game</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">Choose your own rules, then play.</span>
        </span>
      </button>

      <!-- Adventure -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/adventure')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-3xl shadow-md">🗺️</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Adventure</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">
            {{ ADVENTURE_LEVELS.length }} levels • {{ adventureStore.totalStars }}/{{ adventureStore.maxStars }} ⭐
          </span>
        </span>
      </button>

      <!-- Learning -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/learning')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl shadow-md">🎓</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Learning</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">Master each result by repetition.</span>
        </span>
      </button>

      <!-- Competition (coming soon) -->
      <div
          class="relative flex cursor-not-allowed items-center gap-4 rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 p-5 text-left opacity-70 dark:border-slate-600 dark:bg-slate-800/50"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 text-3xl shadow-md">🏁</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-600 dark:text-slate-200">Competition</span>
          <span class="block text-sm font-medium text-slate-400 dark:text-slate-400">Race your friends — coming soon!</span>
        </span>
        <span class="absolute right-3 top-3 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">Soon</span>
      </div>
    </div>
  </div>
</template>
