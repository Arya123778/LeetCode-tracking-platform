import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDueForReview, updateProblem } from '../api/client'

type Problem = {
  id: number
  title: string
  difficulty: string
  topic?: string | null
  company?: string | null
  url?: string | null
  status: string
  confidence?: number
  next_review_date?: string | null
  notes?: string | null
}

function fmtDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString()
}

export function DueForReviewPage() {
  const qc = useQueryClient()
  const dueQuery = useQuery({ queryKey: ['due-for-review'], queryFn: getDueForReview })

  const problems = (dueQuery.data ?? []) as Problem[]

  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({})
  const [confidenceDraft, setConfidenceDraft] = useState<Record<number, number>>({})

  const counts = useMemo(() => {
    const m: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 }
    for (const p of problems) m[p.difficulty] = (m[p.difficulty] ?? 0) + 1
    return m
  }, [problems])

  async function onUpdate(p: Problem) {
    const confidence = confidenceDraft[p.id] ?? p.confidence ?? 3
    const notes = notesDraft[p.id] ?? p.notes ?? ''

    await updateProblem(p.id, { confidence, notes })
    setNotesDraft((prev) => ({ ...prev, [p.id]: '' }))
    setConfidenceDraft((prev) => ({ ...prev, [p.id]: 3 }))
    qc.invalidateQueries({ queryKey: ['due-for-review'] })
    qc.invalidateQueries({ queryKey: ['problems'] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Due for review</h1>
          <div className="text-sm text-gray-600">Spaced repetition queue (update confidence to schedule next review).</div>
        </div>
        <div className="text-sm text-gray-700 flex gap-3">
          <span>Easy: {counts.Easy}</span>
          <span>Medium: {counts.Medium}</span>
          <span>Hard: {counts.Hard}</span>
        </div>
      </div>

      {dueQuery.isLoading ? <div>Loading due problems...</div> : null}
      {dueQuery.error ? <div className="text-red-600">Failed to load due problems.</div> : null}

      {!dueQuery.isLoading ? (
        <div className="space-y-3">
          {problems.length === 0 ? <div className="text-gray-600">Nothing due right now. 🎉</div> : null}

          {problems.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.difficulty}{p.topic ? ` • ${p.topic}` : ''}{p.company ? ` • ${p.company}` : ''}</div>
                  <div className="text-sm text-gray-500">Next review (current): {fmtDate(p.next_review_date)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <div className="text-gray-600">Confidence</div>
                    <select
                      className="mt-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm"
                      value={confidenceDraft[p.id] ?? p.confidence ?? 3}
                      onChange={(e) => setConfidenceDraft((prev) => ({ ...prev, [p.id]: Number(e.target.value) }))}
                    >
                      {[1, 2, 3, 4, 5].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => onUpdate(p)}
                  >
                    Schedule next
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700">Notes (optional)</div>
                <textarea
                  className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2"
                  rows={2}
                  value={notesDraft[p.id] ?? ''}
                  placeholder={p.notes ? `Current: ${p.notes}` : 'Add notes for future review'}
                  onChange={(e) => setNotesDraft((prev) => ({ ...prev, [p.id]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

