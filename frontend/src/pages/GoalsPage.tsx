import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGoal, deleteGoal, getGoals } from '../api/client'

type Goal = {
  id: number
  title: string
  target_count: number
  difficulty?: string | null
  topic?: string | null
  deadline?: string | null
  is_active: boolean
  current_count?: number
  created_at?: string
}

function fmtDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString()
}

export function GoalsPage() {
  const qc = useQueryClient()
  const goalsQuery = useQuery({ queryKey: ['goals'], queryFn: getGoals })
  const goals = (goalsQuery.data ?? []) as Goal[]

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<any>({
    title: '',
    target_count: 10,
    difficulty: '',
    topic: '',
    deadline: '',
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      title: form.title,
      target_count: Number(form.target_count),
      difficulty: form.difficulty || undefined,
      topic: form.topic || undefined,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
    }

    await createGoal(payload)
    setShowForm(false)
    qc.invalidateQueries({ queryKey: ['goals'] })
  }

  async function onDelete(id: number) {
    await deleteGoal(id)
    qc.invalidateQueries({ queryKey: ['goals'] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <div className="text-sm text-gray-600">Create goals and track progress based on solved problems.</div>
        </div>
        <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close' : 'Add goal'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Title</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Target count</div>
              <input type="number" className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.target_count} onChange={(e) => setForm({ ...form, target_count: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Difficulty (optional)</div>
              <select className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="">Any</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Topic (optional)</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            </label>
            <label className="block sm:col-span-2">
              <div className="text-sm font-medium text-gray-700">Deadline (optional)</div>
              <input type="date" className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Create
            </button>
            <button type="button" className="rounded bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {goalsQuery.isLoading ? <div>Loading goals...</div> : null}
      {goalsQuery.error ? <div className="text-red-600">Failed to load goals.</div> : null}

      {!goalsQuery.isLoading ? (
        <div className="space-y-3">
          {goals.length === 0 ? <div className="text-gray-600">No active goals.</div> : null}
          {goals.map((g) => (
            <div key={g.id} className="bg-white border border-gray-200 rounded p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-semibold">{g.title}</div>
                  <div className="text-sm text-gray-600">
                    {g.difficulty ? `Difficulty: ${g.difficulty} • ` : ''}
                    {g.topic ? `Topic: ${g.topic} • ` : ''}
                    Deadline: {fmtDate(g.deadline)}
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Progress: {(g.current_count ?? 0)}/{g.target_count}
                </div>
              </div>

              <div className="mt-3 h-2 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${Math.min(100, ((g.current_count ?? 0) / g.target_count) * 100)}%` }}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  onClick={() => onDelete(g.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

