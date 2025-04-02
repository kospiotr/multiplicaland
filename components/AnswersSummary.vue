<script setup lang="ts">
import type {Answer} from "~/types";


const {answers} = defineProps<{
  answers: Answer[];
}>();

</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 gap-8">
    <!-- Stats Summary -->
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Summary</h2>
      <AnswersStats :answers="answers"/>
    </div>

    <!-- Accuracy Heatmap -->
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Accuracy Heatmap</h2>

      <div class="overflow-x-auto">
        <AnswersAccuracyHeatmap :answers="answers"/>
      </div>
    </div>

    <!-- Duration Heatmap -->
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Duration Heatmap</h2>

      <div class="overflow-x-auto">
        <AnswersTimingsHeatmap :answers="answers"/>
      </div>
    </div>

    <!-- Answer History -->
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Answer History</h2>

      <div class="overflow-x-auto">
        <AnswerHistory :answers="answers"/>
      </div>
    </div>
  </div>
</template> 