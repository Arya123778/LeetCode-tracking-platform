import { api } from './axios'

export type AuthResponse = { token: string; user: any }

export async function register(payload: { username: string; email: string; password: string }) {
  const res = await api.post('/auth/register', payload)
  return res.data as AuthResponse
}

export async function login(payload: { email: string; password: string }) {
  const res = await api.post('/auth/login', payload)
  return res.data as AuthResponse
}

export async function me() {
  const res = await api.get('/auth/me')
  return res.data
}

export async function updateProfile(payload: { username?: string; leetcode_username?: string }) {
  const res = await api.put('/auth/update-profile', payload)
  return res.data
}

export async function getProblems(params?: { difficulty?: string; topic?: string; status?: string; company?: string; search?: string }) {
  const res = await api.get('/problems/', { params })
  return res.data as any[]
}

export async function addProblem(payload: any) {
  const res = await api.post('/problems/', payload)
  return res.data
}

export async function updateProblem(problemId: number, payload: any) {
  const res = await api.put(`/problems/${problemId}`, payload)
  return res.data
}

export async function deleteProblem(problemId: number) {
  const res = await api.delete(`/problems/${problemId}`)
  return res.data
}

export async function getDueForReview() {
  const res = await api.get('/problems/due-for-review')
  return res.data as any[]
}

export async function updateProblemConfidence(problemId: number, confidence: number) {
  return updateProblem(problemId, { confidence })
}

export async function getGoals() {
  const res = await api.get('/goals/')
  return res.data as any[]
}

export async function createGoal(payload: any) {
  const res = await api.post('/goals/', payload)
  return res.data
}

export async function deleteGoal(goalId: number) {
  const res = await api.delete(`/goals/${goalId}`)
  return res.data
}

export async function getStatsOverview() {
  const res = await api.get('/stats/overview')
  return res.data
}

export async function getStatsDifficulty() {
  const res = await api.get('/stats/difficulty')
  return res.data
}

export async function getStatsTopics() {
  const res = await api.get('/stats/topics')
  return res.data
}

export async function getStatsHeatmap() {
  const res = await api.get('/stats/heatmap')
  return res.data
}

export async function getStatsWeekly() {
  const res = await api.get('/stats/weekly')
  return res.data
}

