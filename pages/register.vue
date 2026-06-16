<template>
  <div class="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-10">
    <div class="text-center">
      <div class="text-5xl">🚀</div>
      <h1 class="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">Join the fun!</h1>
    </div>
    <UCard variant="subtle" class="w-full rounded-3xl">
      <EmailPassword/>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import EmailPassword from "~/components/EmailPassword.vue";
</script>
