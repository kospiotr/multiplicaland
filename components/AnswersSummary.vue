<script setup lang="ts">
import type {Answer} from "~/types";


const {answers} = defineProps<{
  answers: Answer[];
}>();

</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <AnswersStats :answers="answers"/>
    <AnswersAccuracyHeatmap :answers="answers"/>
    <AnswersTimingsHeatmap :answers="answers"/>
    <AnswerHistory :answers="answers"/>
  </div>
</template> 