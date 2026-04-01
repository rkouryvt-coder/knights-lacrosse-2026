import { createFileRoute } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

export const Route = createFileRoute('/roster')({
  component: RosterPage,
})

const players = [
  { number: 1,  name: 'Grant Heaton',       position: 'A',      grade: 'So.' },
  { number: 2,  name: 'Bryant Powell',       position: 'DM',     grade: 'Sr.' },
  { number: 3,  name: 'Daniel Geisler',      position: 'M / A',  grade: 'Jr.' },
  { number: 4,  name: 'Gavin Quinn',         position: 'A',      grade: 'Jr.' },
  { number: 5,  name: 'James Riesing',       position: 'A',      grade: 'Sr.' },
  { number: 6,  name: 'Kieran Fitzpatrick',  position: 'M',      grade: 'Sr.' },
  { number: 7,  name: 'Ryan Russo',          position: 'M',      grade: 'Sr.' },
  { number: 8,  name: 'JT Freeman',          position: 'M',      grade: 'Sr.' },
  { number: 9,  name: 'Brady Anderson',      position: 'LSM',    grade: 'Jr.' },
  { number: 10, name: 'Grant Biewenga',      position: 'M / A',  grade: 'Sr.' },
  { number: 11, name: 'Chase Koury',         position: 'D',      grade: 'Jr.' },
  { number: 13, name: 'Colbin Anderson',     position: 'M / A',  grade: 'Fr.' },
  { number: 14, name: 'Quinn Lokun',         position: 'A',      grade: 'Jr.' },
  { number: 15, name: 'Joey Centracchio',    position: 'D',      grade: 'Sr.' },
  { number: 17, name: 'Kirk Hammerstrom',    position: 'M',      grade: 'Sr.' },
  { number: 18, name: 'Michael Lundvick',    position: 'M',      grade: 'Sr.' },
  { number: 20, name: 'Dylan Matray',        position: 'M',      grade: 'Sr.' },
  { number: 21, name: 'Kaden Chung',         position: 'DM',     grade: 'Sr.' },
  { number: 22, name: 'Michael Grund',       position: 'D',      grade: 'Sr.' },
  { number: 23, name: 'Rohan Riedel',        position: 'M',      grade: 'Sr.' },
  { number: 25, name: 'Roscoe Happ',         position: 'D',      grade: 'Sr.' },
  { number: 28, name: 'Liam Finnamore',      position: 'LSM / D', grade: 'So.' },
  { number: 30, name: 'Patrick Kauke',       position: 'D / LSM', grade: 'Jr.' },
  { number: 32, name: 'Ryan Janke',          position: 'G',      grade: 'Sr.' },
  { number: 33, name: 'Ryan Pet',            position: 'G',      grade: 'Jr.' },
  { number: 34, name: 'Dimitrious Intounas', position: 'D',      grade: 'Sr.' },
]

const positionColor: Record<string, string> = {
  A:   'bg-red-100 text-red-700',
  M:   'bg-blue-100 text-blue-700',
  D:   'bg-green-100 text-green-700',
  G:   'bg-yellow-100 text-yellow-700',
  DM:  'bg-purple-100 text-purple-700',
  LSM: 'bg-orange-100 text-orange-700',
}

function positionBadgeClass(position: string): string {
  const base = position.split(' / ')[0]
  return positionColor[base] ?? 'bg-gray-100 text-gray-700'
}

function RosterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-knights-navy">Team Roster</h1>
        <p className="text-gray-500 mt-1">2025-26 Spring Season · Head Coach: Tom Riesing</p>
      </div>

      {/* Position legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(positionColor).map(([pos, cls]) => (
          <span key={pos} className={`text-xs px-2 py-1 rounded-full font-medium ${cls}`}>
            {pos === 'A' ? 'A — Attack' :
             pos === 'M' ? 'M — Midfield' :
             pos === 'D' ? 'D — Defense' :
             pos === 'G' ? 'G — Goalie' :
             pos === 'DM' ? 'DM — Def. Mid' :
             'LSM — Long Stick Mid'}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-knights-navy px-6 py-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-knights-gold" />
          <span className="text-white font-semibold text-sm uppercase tracking-wider">
            Players — {players.length} Varsity
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-12">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr
                key={p.number}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}
              >
                <td className="px-4 py-3 font-bold text-knights-navy text-sm">{p.number}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${positionBadgeClass(p.position)}`}>
                    {p.position}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
