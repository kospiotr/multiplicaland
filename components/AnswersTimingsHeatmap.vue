<template>
  <UCard variant="subtle">
    <template #header>Timing Heatmap</template>
    <table class="justify-self-center mb-8">
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
              <UButton
                  :style="{ backgroundColor: getCellColor(row - 1, col - 1) }"
                  style="width: 40px; height: 40px; justify-content: center;"
              >
                {{ formatDuration(getCellDuration(row - 1, col - 1)) }}
                <!--              {{ (row - 1) * (col - 1) }}-->
              </UButton>
            </td>
          </template>
        </tr>
      </template>
      </tbody>
    </table>
    <div class="timings-container">
      <div class="timing-item">
        <strong>Fastest:</strong> {{ formatDuration(fastest) }}
      </div>
      <div class="timing-item">
        <strong>Average:</strong> {{ formatDuration(average) }}
      </div>
      <div class="timing-item">
        <strong>Slowest:</strong> {{ formatDuration(slowest) }}
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type {Answer} from '~/types';

const props = defineProps<{
  answers: Answer[];
}>();

const slowest = computed(() => getMaxAnswersDuration(props.answers));
const average = computed(() => getAverageAnswersDuration(props.answers));
const fastest = computed(() => getMinAnswersDuration(props.answers));

const multiplicandMin = ref(1);
const multiplicandMax = ref(10);
const multiplierMin = ref(1);
const multiplierMax = ref(10);

function getCellDuration(multiplicand: number, multiplier: number) {
  const relevantAnswers = props.answers.filter(answer =>
      answer.question.multiplicand === multiplicand && answer.question.multiplier === multiplier
  );
  return getAverageAnswersDuration(relevantAnswers);
}

function getAverageAnswersDuration(answers: Answer[]) {
  if (answers.length === 0) {
    return undefined;
  }
  let totalDuration = answers.reduce((acc, value) => acc + (value.finishedTs - value.startedTs), 0);
  return totalDuration / answers.length;
}

function getMinAnswersDuration(answers: Answer[]) {
  if (answers.length === 0) {
    return undefined;
  }
  return answers.reduce((acc, value) => {
    const duration = value.finishedTs - value.startedTs;
    return acc > 0 && acc < duration ? acc : duration;
  }, 0);
}

function getMaxAnswersDuration(answers: Answer[]) {
  if (answers.length === 0) {
    return undefined;
  }
  return answers.reduce((acc, value) => {
    const duration = value.finishedTs - value.startedTs;
    return acc > 0 && acc > duration ? acc : duration;
  }, 0);
}


function getCellColor(multiplicand: number, multiplier: number): string {
  const duration = getCellDuration(multiplicand, multiplier);
  return blendColor(duration);
}

function blendColor(duration: number | undefined): string {
  if (duration === undefined || fastest.value === undefined || slowest.value === undefined) {
    return 'lightgrey';
  }

  if (duration <= fastest.value) {
    return 'green';
  } else if (duration >= slowest.value) {
    return 'red';
  } else {
    const range = slowest.value - fastest.value;
    const position = (duration - fastest.value) / range;
    const red = Math.min(255, Math.floor(position * 255));
    const green = Math.min(255, Math.floor((1 - position) * 255));
    return `rgb(${red}, ${green}, 0)`;
  }
}

function formatDuration(value: number | undefined): string {
  if(value === undefined){
    return '-'
  }
  return Math.ceil(value / 1000) + 's'
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

.timings-container {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  margin-top: 20px;
}

.timing-item {
  padding: 10px;
}
</style>