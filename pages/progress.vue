<template>
  <div class="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center p-4 gap-8">
    <AnswersSummary :answers="store.answers"/>

  </div>
</template>

<style scoped>
</style>
<script setup lang="ts">
import {useGameProgressStore} from "~/store/progressStore";

const store = useGameProgressStore()
</script>
