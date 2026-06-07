import { useAuthStore } from '../store/auth'
import { me, updateProfile as apiUpdateProfile } from '../api/client'

export function getAuthUser() {
  return useAuthStore.getState().user
}

export async function updateProfile(payload: { username?: string; leetcode_username?: string }) {
  const updated = await apiUpdateProfile(payload)
  // Best-effort: update store
  const setAuth = useAuthStore.getState().setAuth
  const token = useAuthStore.getState().token
  if (token) {
    // Merge; backend returns full user
    setAuth(token, updated)
  }
  return updated
}

export async function refreshMe() {
  const u = await me()
  const token = useAuthStore.getState().token
  const setAuth = useAuthStore.getState().setAuth
  if (token) setAuth(token, u)
  return u
}

