import { useEffect, useMemo, useState } from 'react'
import { addProblem, deleteProblem, getProblems, updateProblem } from '../api/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Problem = {
  id: number
  title: string
  leetcode_number?: number | null
  difficulty: string
  topic?: string | null
  company?: string | null
  url?: string | null
  status: string
  time_complexity?: string | null
  space_complexity?: string | null
  time_taken_mins?: number | null
  attempts?: number
  confidence?: number
  notes?: string | null
  next_review_date?: string | null
  solved_at?: string | null
  updated_at?: string | null
}

function fmtDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString()
}

export function ProblemsPage() {
  const qc = useQueryClient()

  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState('')
  const [company, setCompany] = useState('')
  const [search, setSearch] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<any>({
    title: '',
    difficulty: 'Easy',
    leetcode_number: '',
    topic: '',
    company: '',
    url: '',
    status: 'solved',
    time_complexity: '',
    space_complexity: '',
    time_taken_mins: '',
    attempts: 1,
    confidence: 3,
    notes: '',
  })

  const queryKey = useMemo(() => ['problems', { difficulty, topic, status, company, search }], [difficulty, topic, status, company, search])

  const problemsQuery = useQuery({
    queryKey,
    queryFn: () => getProblems({ difficulty: difficulty || undefined, topic: topic || undefined, status: status || undefined, company: company || undefined, search: search || undefined }),
  })

  useEffect(() => {
    // Close form when filters change (keeps UX simpler)
    setShowForm(false)
  }, [difficulty, topic, status, company, search])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      ...form,
      leetcode_number: form.leetcode_number ? Number(form.leetcode_number) : undefined,
      time_taken_mins: form.time_taken_mins ? Number(form.time_taken_mins) : undefined,
    }

    await addProblem(payload)
    setShowForm(false)
    qc.invalidateQueries({ queryKey: ['problems'] })
  }

  async function onDelete(id: number) {
    await deleteProblem(id)
    qc.invalidateQueries({ queryKey: ['problems'] })
  }

  async function onUpdateConfidence(p: Problem, newConfidence: number) {
    await updateProblem(p.id, { confidence: newConfidence })
    qc.invalidateQueries({ queryKey: ['problems'] })
  }

  const problems = problemsQuery.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Problems</h1>
          <div className="text-sm text-gray-600">Track your LeetCode problems and spaced repetition schedule.</div>
        </div>
        <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close' : 'Add problem'}
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
              <div className="text-sm font-medium text-gray-700">Difficulty</div>
              <select className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">LeetCode #</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.leetcode_number} onChange={(e) => setForm({ ...form, leetcode_number: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Topic</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Company</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">URL</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Status</div>
              <select className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="solved">solved</option>
                <option value="unsolved">unsolved</option>
                <option value="in progress">in progress</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Confidence (1-5)</div>
              <select className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.confidence} onChange={(e) => setForm({ ...form, confidence: Number(e.target.value) })}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Time complexity</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.time_complexity} onChange={(e) => setForm({ ...form, time_complexity: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Space complexity</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.space_complexity} onChange={(e) => setForm({ ...form, space_complexity: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Time taken (mins)</div>
              <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.time_taken_mins} onChange={(e) => setForm({ ...form, time_taken_mins: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Attempts</div>
              <input type="number" className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={form.attempts} onChange={(e) => setForm({ ...form, attempts: Number(e.target.value) })} />
            </label>
          </div>

          <label className="block">
            <div className="text-sm font-medium text-gray-700">Notes</div>
            <textarea className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>

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

      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Difficulty</div>
            <select className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Topic</div>
            <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. DP" />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Status</div>
            <select className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="solved">solved</option>
              <option value="unsolved">unsolved</option>
              <option value="in progress">in progress</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Company</div>
            <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Amazon" />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Search</div>
            <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="title" />
          </label>
        </div>
      </div>

      {problemsQuery.isLoading ? <div>Loading problems...</div> : null}
      {problemsQuery.error ? <div className="text-red-600">Failed to load problems.</div> : null}

      {!problemsQuery.isLoading ? (
        <div className="space-y-3">
          {problems.length === 0 ? <div className="text-gray-600">No problems found.</div> : null}
          {problems.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.difficulty}{p.topic ? ` • ${p.topic}` : ''}{p.company ? ` • ${p.company}` : ''}</div>
                  <div className="text-sm text-gray-500">Status: {p.status} • Next review: {fmtDate(p.next_review_date)}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <select
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-sm"
                    value={p.confidence ?? 3}
                    onChange={(e) => onUpdateConfidence(p, Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="text-sm text-gray-700">
                  Attempts: {p.attempts ?? 1} • Time taken: {p.time_taken_mins ?? '—'} mins
                </div>
                <div className="text-sm text-gray-700">
                  Complexity: {p.time_complexity ?? '—'} / {p.space_complexity ?? '—'}
                </div>
              </div>

              {p.notes ? <div className="mt-2 text-sm text-gray-700">Notes: {p.notes}</div> : null}

              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-gray-600">
                  Solved at: {fmtDate(p.solved_at)}
                  {p.leetcode_number ? ` • #${p.leetcode_number}` : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                      const next = prompt('Update notes (optional):', p.notes ?? '')
                      if (next === null) return
                      updateProblem(p.id, { notes: next }).then(() => qc.invalidateQueries({ queryKey: ['problems'] }))
                    }}
                  >
                    Edit notes
                  </button>
                  <button className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700" onClick={() => onDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

