import {defineStore} from 'pinia'

export interface Profile {
    id: string
    name: string
    createdAt: number
}

export const DEFAULT_PROFILE_ID = 'default'
export const PROFILES_STORAGE_KEY = 'profiles'

// Store ids whose persisted state is namespaced per profile (see getActiveProfileId).
const PROFILE_SCOPED_STORE_IDS = ['progress', 'adventure', 'learning', 'gameSettings', 'current-game']

// One-time migration for users who had data saved before profiles existed:
// move their existing `<id>` keys to the default profile's `<id>:default` keys.
function migrateLegacyStorage() {
    if (typeof localStorage === 'undefined') return
    for (const id of PROFILE_SCOPED_STORE_IDS) {
        const legacy = localStorage.getItem(id)
        const scopedKey = `${id}:${DEFAULT_PROFILE_ID}`
        if (legacy !== null && localStorage.getItem(scopedKey) === null) {
            localStorage.setItem(scopedKey, legacy)
            localStorage.removeItem(id)
        }
    }
}

migrateLegacyStorage()

// Read synchronously from localStorage (not the store) so per-profile stores
// can compute their storage key at module-eval time, before Pinia exists.
export function getActiveProfileId(): string {
    if (typeof localStorage === 'undefined') return DEFAULT_PROFILE_ID
    try {
        const raw = localStorage.getItem(PROFILES_STORAGE_KEY)
        if (!raw) return DEFAULT_PROFILE_ID
        const parsed = JSON.parse(raw)
        return typeof parsed?.activeProfileId === 'string' ? parsed.activeProfileId : DEFAULT_PROFILE_ID
    } catch {
        return DEFAULT_PROFILE_ID
    }
}

function makeProfileId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useProfileStore = defineStore('profiles', () => {
    const profiles = ref<Profile[]>([{id: DEFAULT_PROFILE_ID, name: 'You', createdAt: Date.now()}])
    const activeProfileId = ref(DEFAULT_PROFILE_ID)

    const activeProfile = computed(() =>
        profiles.value.find(p => p.id === activeProfileId.value) ?? profiles.value[0]
    )

    function addProfile(name: string): Profile {
        const profile: Profile = {id: makeProfileId(), name: name.trim() || 'Player', createdAt: Date.now()}
        profiles.value.push(profile)
        return profile
    }

    function renameProfile(id: string, name: string) {
        const trimmed = name.trim()
        if (!trimmed) return
        const profile = profiles.value.find(p => p.id === id)
        if (profile) profile.name = trimmed
    }

    return {profiles, activeProfileId, activeProfile, addProfile, renameProfile}
}, {
    persist: {
        key: PROFILES_STORAGE_KEY,
        storage: piniaPluginPersistedstate.localStorage(),
    },
})

// Every other store's persisted data is namespaced by active profile id, so
// switching persists synchronously and reloads to re-hydrate all stores.
export function activateProfile(id: string) {
    const store = useProfileStore()
    if (id === store.activeProfileId || !store.profiles.some(p => p.id === id)) return
    store.activeProfileId = id
    store.$persist()
    if (typeof window !== 'undefined') window.location.reload()
}

export function deleteProfile(id: string) {
    const store = useProfileStore()
    if (store.profiles.length <= 1) return
    const wasActive = store.activeProfileId === id
    store.profiles = store.profiles.filter(p => p.id !== id)
    if (wasActive) {
        store.activeProfileId = store.profiles[0].id
    }
    store.$persist()
    if (wasActive && typeof window !== 'undefined') window.location.reload()
}
