<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8 text-center">Multiplication Adventure</h1>
    
    <p class="text-center mb-8">Begin your journey through the world of multiplication!</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <!-- Beginner Levels -->
      <div class="bg-emerald-50 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-emerald-700">Beginner</h2>
        <div class="grid grid-cols-2 gap-4">
          <UButton 
            v-for="level in 4" 
            :key="`beginner-${level}`"
            @click="startLevel('beginner', level)"
            class="h-24 flex flex-col items-center justify-center"
            color="emerald"
            variant="soft"
            :disabled="!isLevelUnlocked('beginner', level)"
          >
            <UIcon 
              :name="getLevelIcon('beginner', level)" 
              class="text-2xl mb-2" 
            />
            <span>Level {{ level }}</span>
            <div v-if="getLevelProgress('beginner', level)?.completed" class="flex mt-1">
              <UIcon 
                v-for="star in getLevelProgress('beginner', level)?.stars" 
                :key="star"
                name="i-heroicons-star" 
                class="text-yellow-500 text-sm" 
              />
            </div>
          </UButton>
        </div>
      </div>
      
      <!-- Intermediate Levels -->
      <div class="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-blue-700">Intermediate</h2>
        <div class="grid grid-cols-2 gap-4">
          <UButton 
            v-for="level in 4" 
            :key="`intermediate-${level}`"
            @click="startLevel('intermediate', level)"
            class="h-24 flex flex-col items-center justify-center"
            color="blue"
            variant="soft"
            :disabled="!isLevelUnlocked('intermediate', level)"
          >
            <UIcon 
              :name="getLevelIcon('intermediate', level)" 
              class="text-2xl mb-2" 
            />
            <span>Level {{ level }}</span>
            <div v-if="getLevelProgress('intermediate', level)?.completed" class="flex mt-1">
              <UIcon 
                v-for="star in getLevelProgress('intermediate', level)?.stars" 
                :key="star"
                name="i-heroicons-star" 
                class="text-yellow-500 text-sm" 
              />
            </div>
          </UButton>
        </div>
      </div>
      
      <!-- Advanced Levels -->
      <div class="bg-purple-50 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-purple-700">Advanced</h2>
        <div class="grid grid-cols-2 gap-4">
          <UButton 
            v-for="level in 4" 
            :key="`advanced-${level}`"
            @click="startLevel('advanced', level)"
            class="h-24 flex flex-col items-center justify-center"
            color="purple"
            variant="soft"
            :disabled="!isLevelUnlocked('advanced', level)"
          >
            <UIcon 
              :name="getLevelIcon('advanced', level)" 
              class="text-2xl mb-2" 
            />
            <span>Level {{ level }}</span>
            <div v-if="getLevelProgress('advanced', level)?.completed" class="flex mt-1">
              <UIcon 
                v-for="star in getLevelProgress('advanced', level)?.stars" 
                :key="star"
                name="i-heroicons-star" 
                class="text-yellow-500 text-sm" 
              />
            </div>
          </UButton>
        </div>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="mt-8 max-w-xl mx-auto">
      <p class="mb-2">Your Adventure Progress: {{ completionPercentage }}%</p>
      <UProgress :value="completionPercentage" color="amber" />
      <div class="flex justify-between mt-3">
        <p>Total Stars: {{ totalStars }}/36</p>
        <UButton @click="resetAdventure" color="red" variant="soft" size="xs">
          Reset Progress
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAdventureStore } from '~/store/adventureStore';

const router = useRouter();
const adventureStore = useAdventureStore();

// Get computed values from the store
const unlockedLevels = adventureStore.getUnlockedLevels;
const totalStars = adventureStore.getTotalStars;
const completionPercentage = adventureStore.getCompletionPercentage;

// Check if a particular level is unlocked
function isLevelUnlocked(category: string, level: number): boolean {
  return unlockedLevels[category as keyof typeof unlockedLevels] >= level;
}

// Get level progress information
function getLevelProgress(category: string, level: number) {
  return adventureStore.getLevelProgress(category, level);
}

// Get the appropriate icon for a level based on its state
function getLevelIcon(category: string, level: number): string {
  if (!isLevelUnlocked(category, level)) {
    return 'i-heroicons-lock-closed';
  }
  
  const progress = getLevelProgress(category, level);
  
  if (progress?.completed) {
    if (category === 'beginner') {
      return 'i-heroicons-star';
    } else if (category === 'intermediate') {
      return 'i-heroicons-academic-cap';
    } else {
      return 'i-heroicons-fire';
    }
  } else {
    // Level is unlocked but not completed
    if (category === 'beginner') {
      return 'i-heroicons-star';
    } else if (category === 'intermediate') {
      return 'i-heroicons-academic-cap';
    } else {
      return 'i-heroicons-fire';
    }
  }
}

// Start a level when clicked
function startLevel(category: string, level: number) {
  if (!isLevelUnlocked(category, level)) {
    return;
  }
  
  // Create level config based on difficulty
  const levelConfig = getLevelConfig(category, level);
  
  // Navigate to game with level configuration
  router.push({
    path: '/quick-game',
    query: { 
      mode: 'adventure',
      category,
      level: level.toString(),
      ...levelConfig
    }
  });
}

// Generate game settings for each level
function getLevelConfig(category: string, level: number) {
  // Default settings
  const config: Record<string, string> = {
    timer: '0'
  };
  
  if (category === 'beginner') {
    config.multiplicandRange = '1,5';
    config.multiplierRange = '1,5';
    config.questionsCount = '10';
  } else if (category === 'intermediate') {
    config.multiplicandRange = '2,10';
    config.multiplierRange = '2,10';
    config.questionsCount = '15';
  } else if (category === 'advanced') {
    config.multiplicandRange = '5,12';
    config.multiplierRange = '5,12';
    config.questionsCount = '20';
  }
  
  // Add level-specific adjustments
  config.questionsCount = (parseInt(config.questionsCount) + level).toString();
  
  return config;
}

// Reset all adventure progress
function resetAdventure() {
  if (confirm('Are you sure you want to reset all adventure progress? This cannot be undone.')) {
    adventureStore.resetProgress();
  }
}
</script>

<style scoped>
/* Add any custom styling here */
</style>
