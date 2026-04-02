import { createFileRoute } from '@tanstack/react-router'
import { Trophy } from 'lucide-react'

export const Route = createFileRoute('/stats')({
  component: StatsPage,
})

// Stats sourced from MaxPreps — updated through 2 games played (3/18, 3/31).
const fieldStats = [
  { name: 'Gavin Quinn',        position: 'A',   grade: 'Jr.', gp: 2, g: 6,  a: 1, pts: 7,  gb: null },
  { name: 'Grant Heaton',       position: 'A',   grade: 'So.', gp: 2, g: 4,  a: 0, pts: 4,  gb: null },
  { name: 'Kieran Fitzpatrick', position: 'M',   grade: 'Sr.', gp: 2, g: 3,  a: 1, pts: 4,  gb: 2    },
  { name: 'Colbin Anderson',    position: 'M/A', grade: 'Fr.', gp: 2, g: 0,  a: 1, pts: 1,  gb: 0    },
  { name: 'Brady Anderson',     position: 'LSM', grade: 'Jr.', gp: 2, g: null, a: null, pts: null, gb: 11 },
  { name: 'Ryan Russo',         position: 'M',   grade: 'Sr.', gp: 2, g: null, a: null, pts: null, gb: 3  },
  { name: 'Bryant Powell',      position: 'DM',  grade: 'Sr.', gp: 2, g: 0,  a: 0, pts: 0,  gb: 0    },
]

function fmt(val: number | null): string {
  return val === null ? '—' : String(val)
}

function StatsPage() {
  const byPoints = [...fieldStats]
    .filter((p) => p.pts !== null)
    .sort((a, b) => (b.pts ?? 0) - (a.pts ?? 0))

  const byGB = [...fieldStats]
    .filter((p) => p.gb !== null)
    .sort((a, b) => (b.gb ?? 0) - (a.gb ?? 0))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-knights-navy">Team Stats</h1>
        <p className="text-gray-500 mt-1">2025-26 Spring Season · Through 2 games</p>
      </div>

      {/* Scoring leaders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-knights-navy px-6 py-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-knights-gold" />
          <span className="text-white font-semibold text-sm uppercase tracking-wider">
            Scoring Leaders
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <th className="text-left px-4 py-3">Player</th>
              <th className="text-left px-4 py-3">Pos</th>
              <th className="text-left px-4 py-3">Yr</th>
              <th className="text-center px-4 py-3">GP</th>
              <th className="text-center px-4 py-3">G</th>
              <th className="text-center px-4 py-3">A</th>
              <th className="text-center px-4 py-3 font-bold text-knights-navy">Pts</th>
              <th className="text-center px-4 py-3">G/G</th>
            </tr>
          </thead>
          <tbody>
            {byPoints.map((p, i) => (
              <tr key={p.name} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.position}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.grade}</td>
                <td className="px-4 py-3 text-center text-sm">{fmt(p.gp)}</td>
                <td className="px-4 py-3 text-center text-sm">{fmt(p.g)}</td>
                <td className="px-4 py-3 text-center text-sm">{fmt(p.a)}</td>
                <td className="px-4 py-3 text-center font-bold text-knights-navy">{fmt(p.pts)}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-500">
                  {p.g !== null && p.gp ? (p.g / p.gp).toFixed(1) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ground ball leaders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-knights-navy px-6 py-3">
          <span className="text-white font-semibold text-sm uppercase tracking-wider">
            Ground Ball Leaders
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <th className="text-left px-4 py-3">Player</th>
              <th className="text-left px-4 py-3">Pos</th>
              <th className="text-left px-4 py-3">Yr</th>
              <th className="text-center px-4 py-3 font-bold text-knights-navy">GB</th>
              <th className="text-center px-4 py-3">GB/G</th>
            </tr>
          </thead>
          <tbody>
            {byGB.map((p, i) => (
              <tr key={p.name} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.position}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.grade}</td>
                <td className="px-4 py-3 text-center font-bold text-knights-navy">{fmt(p.gb)}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-500">
                  {p.gb !== null && p.gp ? (p.gb / p.gp).toFixed(1) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* News */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-dashed border-gray-200">
        <h2 className="text-lg font-bold text-knights-navy mb-1">In the News</h2>
        <p className="text-sm text-gray-500">
          No local news coverage found yet. Check back after more games — the{' '}
          <a
            href="https://www.dailyherald.com/sports/high-school-sports/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-knights-gold hover:underline"
          >
            Daily Herald
          </a>{' '}
          covers Northwest suburban Illinois high school sports.
        </p>
      </div>
    </div>
  )
}
