<template>
  <div class="play-bg">
    <VitePwaManifest/>
    <header class="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
          class="mx-auto flex max-w-4xl items-center justify-center rounded-full border border-white/40 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 sm:px-4">
        <!-- Brand -->
        <button
            class="font-display text-lg font-extrabold tracking-tight text-violet-600 transition-transform hover:scale-105 active:scale-95 dark:text-violet-300 sm:text-xl"
            @click="goToModeSelect"
        >
          Multiplica<span class="text-pink-500 dark:text-pink-400">Land</span>
        </button>
      </nav>
    </header>

    <main class="pb-16">
      <slot/>
    </main>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";

const router = useRouter();

function goToModeSelect() {
  useCurrentGameStore().reset();
  router.push('/');
}
</script>
