<script setup lang="ts">
import type {Answer} from "~/types";


const {answers} = defineProps<{
  answers: Answer[];
}>();

</script>

<template>
  <div class="flex flex-col gap-8">
    <AnswersStats :answers="answers"/>
    <AnswersAccuracyHeatmap :answers="answers"/>
    <AnswersTimingsHeatmap :answers="answers"/>
    <AnswerHistory :answers="answers"/>
  </div>
</template> 