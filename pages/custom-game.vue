<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:py-8">
    <template v-if="currentGameStore.isStarted() && currentGameStore.mode === 'custom'">
      <div class="flex flex-col items-center justify-center gap-6">
        <GameComponent v-if="!currentGameStore.isCompleted()"/>
        <GameComplete v-else :answers="currentGameStore.answers" @replay="startCustomGame" @home="goHome"/>
      </div>
    </template>

    <template v-else>
      <h1 class="mb-5 flex items-center gap-2 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        <span>🎛️</span> Custom Game
      </h1>
      <UForm ref="form" :state="state" class="w-full flex flex-col gap-4" @submit="onSubmit">
        <UCard variant="subtle" class="rounded-3xl">
          <template #header>
            <div class="flex items-center gap-2 font-display text-lg font-bold"><span>🔢</span> Question range</div>
          </template>
          <div class="overflow-x-auto">
          <table class="justify-self-center mx-auto mb-8">
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
                    <UButton style="width: 40px; height: 40px; justify-content: center;"
                             :disabled="!questionInRange((row-1), (col-1))">{{ (row - 1) * (col - 1) }}
                    </UButton>
                  </td>
                </template>
              </tr>
            </template>
            </tbody>
          </table>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <UFormField name="slider" label="X" :hint="state.multiplicandRange+''">
              <USlider v-model="state.multiplicandRange" :min="X_MIN" :max="X_MAX"/>
            </UFormField>
            <UFormField name="slider" label="Y" :hint="state.multiplierRange+''">
              <USlider v-model="state.multiplierRange" :min="Y_MIN" :max="Y_MAX"/>
            </UFormField>
            <UFormField name="slider" label="Z" :hint="state.productRange+''">
              <USlider v-model="state.productRange" :min="Z_MIN" :max="Z_MAX"/>
            </UFormField>
          </div>
        </UCard>


        <UCard variant="subtle" class="rounded-3xl">
          <template #header>
            <div class="flex items-center gap-2 font-display text-lg font-bold"><span>❓</span> Variable position</div>
          </template>
          <div class="grid grid-cols-3 gap-4">
            <UCheckbox label="X" v-model="state.multiplicandVariable" class="justify-self-center"/>
            <UCheckbox label="Y" v-model="state.multiplierVariable" class="justify-self-center"/>
            <UCheckbox label="Z" v-model="state.productVariable" class="justify-self-center"/>
          </div>
        </UCard>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <UCard variant="subtle" class="rounded-3xl">
            <template #header>
              <div class="flex items-center gap-2 font-display text-lg font-bold"><span>🔁</span> Questions count</div>
            </template>
            <UInputNumber v-model="state.questionsCount" class=""/>
          </UCard>

          <UCard variant="subtle" class="rounded-3xl">
            <template #header>
              <div class="flex items-center gap-2 font-display text-lg font-bold"><span>⏱️</span> Timer</div>
            </template>
            <URadioGroup v-model="state.timer" :items="TIMER" orientation="horizontal"/>
          </UCard>
        </div>

        <UCard variant="subtle" class="rounded-3xl">
          <template #header>
            <div class="flex items-center gap-2 font-display text-lg font-bold"><span>🌱</span> Foster questions</div>
          </template>
          <div class="grid grid-cols-2 gap-4">
            <UFormField name="slider" label="Failed" :hint="state.productRange+''" class="flex-auto">
              <USlider v-model="state.fosterFailed" :min="PERCENTAGE_MIN" :max="PERCENTAGE_MAX"/>
            </UFormField>
            <UFormField name="slider" label="Unanswered" :hint="state.productRange+''" class="flex-auto">
              <USlider v-model="state.fosterUnanswered" :min="PERCENTAGE_MIN" :max="PERCENTAGE_MAX"/>
            </UFormField>
          </div>
        </UCard>

      </UForm>

      <div class="sticky bottom-4 mt-6 flex justify-center">
        <UButton
            color="primary"
            size="xl"
            icon="i-lucide-play"
            class="rounded-full px-10 py-3 text-lg font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
            @click="startCustomGame"
        >
          Start game
        </UButton>
      </div>
    </template>
  </div>
</template>
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

<script setup lang="ts">
import type {FormSubmitEvent} from '@nuxt/ui'
import {
  inRangeOfInclusive, PERCENTAGE_MAX, PERCENTAGE_MIN,
  TIMER,
  useGameSettingsStore,
  X_MAX,
  X_MIN,
  Y_MAX,
  Y_MIN,
  Z_MAX,
  Z_MIN
} from "~/store/gameSettingsStore";
import {useCurrentGameStore} from "~/store/currentGameStore";


function questionInRange(multiplicand: number, multiplier: number): boolean {
  return inRangeOfInclusive(multiplicand, state.multiplicandRange[0], state.multiplicandRange[1]) &&
      inRangeOfInclusive(multiplier, state.multiplierRange[0], state.multiplierRange[1]) &&
      inRangeOfInclusive(multiplicand * multiplier, state.productRange[0], state.productRange[1]);
}

const store = useGameSettingsStore();
const state = store.data;
const currentGameStore = useCurrentGameStore();
const router = useRouter();

function startCustomGame() {
  currentGameStore.createNewGame(state, 'custom');
}

function goHome() {
  currentGameStore.reset();
  router.push('/');
}

const form = useTemplateRef('form')


const toast = useToast()

async function onSubmit(event: FormSubmitEvent<any>) {
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log('data', event.data)
  store.store(event.data)
}

const multiplicandMin = ref(1);
const multiplicandMax = ref(10);
const multiplierMin = ref(1);
const multiplierMax = ref(10);

</script>
