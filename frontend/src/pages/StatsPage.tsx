import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts'
import { getStatsDifficulty, getStatsHeatmap, getStatsOverview, getStatsTopics, getStatsWeekly } from '../api/client'

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700">{children}</span>
}

export function StatsPage() {
  const overviewQ = useQuery({ queryKey: ['stats-overview'], queryFn: getStatsOverview })
  const difficultyQ = useQuery({ queryKey: ['stats-difficulty'], queryFn: getStatsDifficulty })
  const topicsQ = useQuery({ queryKey: ['stats-topics'], queryFn: getStatsTopics })
  const heatmapQ = useQuery({ queryKey: ['stats-heatmap'], queryFn: getStatsHeatmap })
  const weeklyQ = useQuery({ queryKey: ['stats-weekly'], queryFn: getStatsWeekly })

  const overview = overviewQ.data
  const difficulty = difficultyQ.data ?? []
  const topics = topicsQ.data ?? []
  const heatmap = heatmapQ.data ?? {}
  const heatmapEntries = Object.entries(heatmap).sort((a, b) => (a[0] < b[0] ? -1 : 1))
  const weekly = weeklyQ.data ?? []

  const maxHeat = Math.max(1, ...heatmapEntries.map(([, v]) => v as number))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stats</h1>
        <div className="text-sm text-gray-600">Track progress, streaks, and spaced repetition history.</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-2xl font-semibold">{overview?.total ?? 0}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500">Solved</div>
          <div className="text-2xl font-semibold">{overview?.solved ?? 0}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500">Current streak</div>
          <div className="text-2xl font-semibold">{overview?.current_streak ?? 0}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500">Longest streak</div>
          <div className="text-2xl font-semibold">{overview?.longest_streak ?? 0}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500">Easy</div>
          <div className="text-2xl font-semibold">{overview?.easy ?? 0}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500">Hard</div>
          <div className="text-2xl font-semibold">{overview?.hard ?? 0}</div>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded p-4">
        <div>
          <div className="font-semibold">Difficulty breakdown</div>
          <div className="text-sm text-gray-600">Solved problems by difficulty.</div>
        </div>
        <div className="h-72 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficulty} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value">
                {difficulty.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Hard' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-4">
        <div className="font-semibold">Top topics</div>
        <div className="text-sm text-gray-600">Most frequent topics across your tracked problems.</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.length === 0 ? <div className="text-gray-600">No topic data yet.</div> : null}
          {topics.slice(0, 20).map((t: any) => (
            <Badge key={t.topic}>
              {t.topic}: {t.count}
            </Badge>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-4">
        <div className="font-semibold">1-year activity heatmap</div>
        <div className="text-sm text-gray-600">Counts of solved problems per day.</div>
        <div className="mt-3 max-h-72 overflow-auto border border-gray-100 rounded p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {heatmapEntries.slice(-200).map(([date, c]) => {
              const count = c as number
              const intensity = count / maxHeat
              const bg = `rgba(59,130,246,${0.15 + intensity * 0.6})`
              return (
                <div key={date} className="rounded border border-gray-100 p-2">
                  <div className="text-xs font-medium">{date}</div>
                  <div className="text-lg" style={{ color: '#1d4ed8' }}>
                    {count}
                  </div>
                  <div className="mt-1 h-1.5 rounded" style={{ background: bg }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-4">
        <div className="font-semibold">Weekly progress (last 8 weeks)</div>
        <div className="text-sm text-gray-600">Solved count per ISO week.</div>
        <div className="h-72 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

