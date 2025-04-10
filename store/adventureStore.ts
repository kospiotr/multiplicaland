import { defineStore } from 'pinia';

export interface LevelProgress {
  completed: boolean;
  stars: number; // 0-3 stars based on performance
  highScore: number;
}

export interface AdventureProgress {
  beginner: Record<number, LevelProgress>;
  intermediate: Record<number, LevelProgress>;
  advanced: Record<number, LevelProgress>;
}

export const useAdventureStore = defineStore('adventure', {
  state: () => ({
    progress: {
      beginner: {
        1: { completed: false, stars: 0, highScore: 0 },
        2: { completed: false, stars: 0, highScore: 0 },
        3: { completed: false, stars: 0, highScore: 0 },
        4: { completed: false, stars: 0, highScore: 0 },
      },
      intermediate: {
        1: { completed: false, stars: 0, highScore: 0 },
        2: { completed: false, stars: 0, highScore: 0 },
        3: { completed: false, stars: 0, highScore: 0 },
        4: { completed: false, stars: 0, highScore: 0 },
      },
      advanced: {
        1: { completed: false, stars: 0, highScore: 0 },
        2: { completed: false, stars: 0, highScore: 0 },
        3: { completed: false, stars: 0, highScore: 0 },
        4: { completed: false, stars: 0, highScore: 0 },
      }
    } as AdventureProgress,
    unlockedLevels: {
      beginner: 1, // Start with only the first beginner level unlocked
      intermediate: 0,
      advanced: 0
    }
  }),
  
  getters: {
    getUnlockedLevels: (state) => state.unlockedLevels,
    
    getLevelProgress: (state) => (category: string, level: number) => {
      return state.progress[category as keyof AdventureProgress]?.[level];
    },
    
    getTotalStars: (state) => {
      let totalStars = 0;
      
      for (const category of Object.keys(state.progress) as Array<keyof AdventureProgress>) {
        for (const level of Object.keys(state.progress[category])) {
          totalStars += state.progress[category][Number(level)].stars;
        }
      }
      
      return totalStars;
    },
    
    getCompletionPercentage: (state) => {
      let completedLevels = 0;
      let totalLevels = 0;
      
      for (const category of Object.keys(state.progress) as Array<keyof AdventureProgress>) {
        for (const level of Object.keys(state.progress[category])) {
          totalLevels++;
          if (state.progress[category][Number(level)].completed) {
            completedLevels++;
          }
        }
      }
      
      return Math.round((completedLevels / totalLevels) * 100);
    }
  },
  
  actions: {
    updateLevelProgress(category: string, level: number, result: Partial<LevelProgress>) {
      if (
        category in this.progress && 
        level in this.progress[category as keyof AdventureProgress]
      ) {
        const currentProgress = this.progress[category as keyof AdventureProgress][level];
        
        // Update progress
        this.progress[category as keyof AdventureProgress][level] = {
          ...currentProgress,
          ...result,
          // Only update high score if the new score is higher
          highScore: Math.max(currentProgress.highScore, result.highScore || 0)
        };
        
        // Mark as completed if it wasn't before
        if (result.completed) {
          this.progress[category as keyof AdventureProgress][level].completed = true;
          
          // Unlock next level in the same category
          this.unlockNextLevel(category, level);
        }
      }
    },
    
    unlockNextLevel(category: string, completedLevel: number) {
      if (completedLevel === 4 && category === 'beginner') {
        // Unlock the first intermediate level when all beginner levels are completed
        if (this.unlockedLevels.intermediate === 0) {
          this.unlockedLevels.intermediate = 1;
        }
      } else if (completedLevel === 4 && category === 'intermediate') {
        // Unlock the first advanced level when all intermediate levels are completed
        if (this.unlockedLevels.advanced === 0) {
          this.unlockedLevels.advanced = 1;
        }
      } else {
        // Unlock the next level in the current category
        const categoryKey = category as keyof typeof this.unlockedLevels;
        const nextLevel = completedLevel + 1;
        
        if (nextLevel <= 4 && this.unlockedLevels[categoryKey] < nextLevel) {
          this.unlockedLevels[categoryKey] = nextLevel;
        }
      }
    },
    
    resetProgress() {
      this.progress = {
        beginner: {
          1: { completed: false, stars: 0, highScore: 0 },
          2: { completed: false, stars: 0, highScore: 0 },
          3: { completed: false, stars: 0, highScore: 0 },
          4: { completed: false, stars: 0, highScore: 0 },
        },
        intermediate: {
          1: { completed: false, stars: 0, highScore: 0 },
          2: { completed: false, stars: 0, highScore: 0 },
          3: { completed: false, stars: 0, highScore: 0 },
          4: { completed: false, stars: 0, highScore: 0 },
        },
        advanced: {
          1: { completed: false, stars: 0, highScore: 0 },
          2: { completed: false, stars: 0, highScore: 0 },
          3: { completed: false, stars: 0, highScore: 0 },
          4: { completed: false, stars: 0, highScore: 0 },
        }
      };
      
      this.unlockedLevels = {
        beginner: 1,
        intermediate: 0,
        advanced: 0
      };
    }
  },
  
  persist: true
}); 