<script setup lang="ts">
import {activateProfile, deleteProfile, useProfileStore, type Profile} from "~/store/profileStore";

const profileStore = useProfileStore();
const open = ref(false);
const editingId = ref<string | null>(null);
const editingName = ref('');
const newName = ref('');

function select(id: string) {
  if (id === profileStore.activeProfileId) return;
  activateProfile(id);
}

function startRename(p: Profile) {
  editingId.value = p.id;
  editingName.value = p.name;
}

function saveRename(id: string) {
  profileStore.renameProfile(id, editingName.value);
  editingId.value = null;
}

function remove(id: string) {
  deleteProfile(id);
}

function add() {
  if (!newName.value.trim()) return;
  profileStore.addProfile(newName.value);
  newName.value = '';
}
</script>

<template>
  <div>
    <UButton
        color="neutral"
        variant="soft"
        size="lg"
        icon="i-lucide-user-round"
        class="rounded-full px-6 font-bold"
        @click="open = true"
    >
      {{ profileStore.activeProfile.name }}
    </UButton>

    <UModal v-model:open="open" title="Profiles">
      <template #body>
        <div class="flex flex-col gap-2">
          <div
              v-for="p in profileStore.profiles"
              :key="p.id"
              class="flex items-center gap-2 rounded-2xl border-2 p-3 transition-colors"
              :class="p.id === profileStore.activeProfileId
                ? 'border-violet-400 bg-violet-50 dark:border-violet-500/60 dark:bg-violet-900/30'
                : 'border-white/60 dark:border-white/10'"
          >
            <template v-if="editingId === p.id">
              <UInput v-model="editingName" size="sm" class="flex-1" autofocus @keyup.enter="saveRename(p.id)"/>
              <UButton icon="i-lucide-check" size="sm" color="primary" variant="soft" @click="saveRename(p.id)"/>
              <UButton icon="i-lucide-x" size="sm" color="neutral" variant="ghost" @click="editingId = null"/>
            </template>
            <template v-else>
              <button class="flex flex-1 items-center gap-2 text-left font-semibold text-slate-800 dark:text-white" @click="select(p.id)">
                <UIcon
                    :name="p.id === profileStore.activeProfileId ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    class="h-5 w-5 shrink-0"
                    :class="p.id === profileStore.activeProfileId ? 'text-violet-600 dark:text-violet-300' : 'text-slate-300 dark:text-slate-600'"
                />
                <span>{{ p.name }}</span>
              </button>
              <UButton icon="i-lucide-pencil" size="sm" color="neutral" variant="ghost" aria-label="Rename profile" @click="startRename(p)"/>
              <UButton
                  v-if="profileStore.profiles.length > 1"
                  icon="i-lucide-trash-2"
                  size="sm"
                  color="error"
                  variant="ghost"
                  aria-label="Delete profile"
                  @click="remove(p.id)"
              />
            </template>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2 border-t border-white/40 pt-4 dark:border-white/10">
          <UInput v-model="newName" placeholder="New profile name" class="flex-1" @keyup.enter="add"/>
          <UButton icon="i-lucide-plus" color="primary" @click="add">Add</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
