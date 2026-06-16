<template>
  <UCard variant="subtle" class="rounded-3xl">
    <template #header>
      <div class="flex items-center gap-2 font-display text-lg font-bold">
        <span class="text-xl">🎯</span> Accuracy
      </div>
    </template>
    <div class="overflow-x-auto">
    <table class="justify-self-center mx-auto mb-2">
      <tbody>
      <template v-for="(row) in (multiplicandMax - multiplicandMin + 2)" :key="row">
        <tr>
          <template v-for="(col) in (multiplierMax - multiplierMin + 2)" :key="col">
            <th v-if="col === 1 && row === 1" class="corner">
              <span class="x">x</span>
              <span class="y">y</span>
            </th>
            <th v-else-if="col === 1">
              {{ row - 1 }}
            </th>
            <th v-else-if="row === 1">
              {{ col - 1 }}
            </th>
            <td v-else>
              <div
                  class="flex items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                  :style="{ backgroundColor: getCellColor(row - 1, col - 1), width: '38px', height: '38px' }"
              >
                {{ getAccuracy(row - 1, col - 1) }}
              </div>
            </td>
          </template>
        </tr>
      </template>
      </tbody>
    </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import type {Answer} from '~/types';

const props = defineProps<{
  answers: Answer[];
}>();

const multiplicandMin = ref(1);
const multiplicandMax = ref(10);
const multiplierMin = ref(1);
const multiplierMax = ref(10);

function getAccuracy(multiplicand: number, multiplier: number) {
  const relevantAnswers = props.answers.filter(answer =>
      answer.question.multiplicand === multiplicand && answer.question.multiplier === multiplier
  );

  if (relevantAnswers.length === 0) {
    return undefined;
  }

  const correctAnswers = relevantAnswers.filter(answer => answer.status === 'correct').length;
  return (correctAnswers / relevantAnswers.length) * 100;
}

function getCellColor(multiplicand: number, multiplier: number): string {
  const accuracy = getAccuracy(multiplicand, multiplier);
  return blendColor(accuracy);
}

function blendColor(accuracy: number | undefined): string {
  if (accuracy === undefined) {
    return 'lightgrey';
  }
  const red = Math.min(255, Math.floor((100 - accuracy) * 2.55));
  const green = Math.min(255, Math.floor(accuracy * 2.55));
  return `rgb(${red}, ${green}, 0)`;
}
</script>

<style scoped>
.corner {
  position: relative;
}

.x {
  position: absolute;
  top: 0;
  right: 0;
  line-height: 1;
}

.y {
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 1;
}

td, th {
  padding: 5px;
  text-align: center;
  align-content: center;
}
</style>