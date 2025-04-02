<template>
  <div class="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center p-4 gap-8">
    <UTabs v-model="activeTab" :content="false" :items="items" class="w-full"/>
    <AnswersSummary :answers="filteredAnswers"/>
  </div>
</template>

<style scoped>
</style>
<script setup lang="ts">
import {useGameProgressStore} from "~/store/progressStore";
import type {TabsItem} from "#ui/components/Tabs.vue";

const store = useGameProgressStore()
const activeTab = ref('0');
const items: TabsItem[] = [
  {
    label: 'Today'
  },
  {
    label: 'This Week'
  },
  {
    label: 'This Month'
  },
  {
    label: 'All'
  }
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
</script>
