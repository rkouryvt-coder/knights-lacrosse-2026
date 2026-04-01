import { createFileRoute } from '@tanstack/react-router'
import { roster } from '@/data/games'

export const Route = createFileRoute('/roster')({
  component: RosterPage,
})

function RosterPage() {
  const positions = ['Attack', 'Midfield', 'FOGO', 'LSM', 'Defense', 'Goalie']
  const grouped = positions.map((pos) => ({
    position: pos,
    players: roster.filter((p) => p.position === pos).sort((a, b) => a.number - b.number),
  })).filter((g) => g.players.length > 0)

  const totalGoals = roster.reduce((sum, p) => sum + p.goals, 0)
  const totalAssists = roster.reduce((sum, p) => sum + p.assists, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-knights-navy">Team Roster</h1>
          <p className="text-gray-500 mt-1">2026 Spring Season</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white shadow-sm border rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-knights-navy">{roster.length}</div>
            <div className="text-xs text-gray-500">Players</div>
          </div>
          <div className="bg-white shadow-sm border rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-knights-navy">{totalGoals}</div>
            <div className="text-xs text-gray-500">Team Goals</div>
          </div>
          <div className="bg-white shadow-sm border rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-knights-navy">{totalAssists}</div>
            <div className="text-xs text-gray-500">Team Assists</div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-knights-navy text-white text-sm">
              <th className="text-left py-3 px-4">#</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Position</th>
              <th className="text-center py-3 px-4">Grade</th>
              <th className="text-center py-3 px-4">G</th>
              <th className="text-center py-3 px-4">A</th>
              <th className="text-center py-3 px-4">PTS</th>
              <th className="text-center py-3 px-4">GB</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map((group) => (
              <GroupRows key={group.position} group={group} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {grouped.map((group) => (
          <div key={group.position}>
            <h2 className="text-lg font-bold text-knights-navy mb-3 border-b-2 border-knights-gold pb-1">
              {group.position}
            </h2>
            <div className="space-y-2">
              {group.players.map((player) => (
                <div
                  key={player.id}
                  className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-knights-navy text-knights-gold w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                      {player.number}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{player.name}</div>
                      <div className="text-xs text-gray-500">Grade {player.grade}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <div className="text-sm font-bold">{player.goals}</div>
                      <div className="text-xs text-gray-400">G</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{player.assists}</div>
                      <div className="text-xs text-gray-400">A</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{player.groundBalls}</div>
                      <div className="text-xs text-gray-400">GB</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GroupRows({ group }: { group: { position: string; players: typeof roster } }) {
  return (
    <>
      <tr className="bg-gray-50">
        <td
          colSpan={8}
          className="py-2 px-4 text-sm font-bold text-knights-navy border-l-4 border-knights-gold"
        >
          {group.position}
        </td>
      </tr>
      {group.players.map((player) => (
        <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
          <td className="py-3 px-4 font-bold text-knights-gold">{player.number}</td>
          <td className="py-3 px-4 font-medium">{player.name}</td>
          <td className="py-3 px-4 text-gray-600 text-sm">{player.position}</td>
          <td className="py-3 px-4 text-center text-sm">{player.grade}</td>
          <td className="py-3 px-4 text-center text-sm">{player.goals}</td>
          <td className="py-3 px-4 text-center text-sm">{player.assists}</td>
          <td className="py-3 px-4 text-center text-sm font-bold">{player.goals + player.assists}</td>
          <td className="py-3 px-4 text-center text-sm">{player.groundBalls}</td>
        </tr>
      ))}
    </>
  )
}
