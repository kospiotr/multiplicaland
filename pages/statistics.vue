<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:py-8">
    <h1 class="flex items-center gap-2 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
      <span>📊</span> Statistics
    </h1>
    <UTabs v-model="activeTab" :content="false" :items="items" class="w-full"/>
    <AnswersSummary :answers="filteredAnswers"/>

    <div class="mt-2 flex flex-wrap items-center justify-center gap-3 border-t border-white/40 pt-6 dark:border-white/10">
      <UButton color="neutral" variant="soft" size="lg" icon="i-lucide-download" class="rounded-full px-6 font-bold" @click="exportData">
        Export
      </UButton>
      <UButton color="neutral" variant="soft" size="lg" icon="i-lucide-upload" class="rounded-full px-6 font-bold" @click="triggerImport">
        Import
      </UButton>
      <UButton color="error" variant="soft" size="lg" icon="i-lucide-trash-2" class="rounded-full px-6 font-bold" @click="confirmReset = true">
        Reset
      </UButton>
      <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="importData"/>
    </div>

    <UModal v-model:open="confirmReset" title="Reset statistics?">
      <template #body>
        <p class="text-slate-600 dark:text-slate-300">
          This permanently deletes all your answer history. This can't be undone — consider exporting a backup first.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton color="neutral" variant="soft" @click="confirmReset = false">Cancel</UButton>
          <UButton color="error" icon="i-lucide-trash-2" @click="doReset">Reset</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>
<script setup lang="ts">
import {useGameProgressStore} from "~/store/progressStore";
import type {Answer} from "~/types";
import type {TabsItem} from "#ui/components/Tabs.vue";

const store = useGameProgressStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const confirmReset = ref(false)
const activeTab = ref('0');
const items: TabsItem[] = [
  {label: 'Today'},
  {label: 'This Week'},
  {label: 'This Month'},
  {label: 'All'},
]
const filteredAnswers = computed(() => {
  const now = new Date();
  return store.answers.filter(answer => {
    const answerDate = new Date(answer.finishedTs);
    switch (activeTab.value) {
      case '0':
        return answerDate.toDateString() === now.toDateString();
      case '1':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return answerDate >= startOfWeek;
      case '2':
        return answerDate.getMonth() === now.getMonth() && answerDate.getFullYear() === now.getFullYear();
      case '3':
      default:
        return true;
    }
  });
});

function exportData() {
  const payload = {version: 1, exportedAt: new Date().toISOString(), answers: store.answers};
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `multiplicaland-stats-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerImport() {
  fileInput.value?.click();
}

async function importData(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const answers = Array.isArray(parsed) ? parsed : parsed?.answers;
    if (!Array.isArray(answers)) throw new Error('Invalid file');
    store.importAnswers(answers as Answer[]);
    toast.add({title: 'Imported', description: `${answers.length} answers loaded.`, color: 'success'});
  } catch {
    toast.add({title: 'Import failed', description: 'That file could not be read.', color: 'error'});
  } finally {
    input.value = '';
  }
}

function doReset() {
  store.reset();
  confirmReset.value = false;
  toast.add({title: 'Statistics reset', color: 'success'});
}
</script>
