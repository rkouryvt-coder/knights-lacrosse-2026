import { Link, createFileRoute } from '@tanstack/react-router'
import { getSchedule } from '@/lib/schedule'
import { Calendar, MapPin } from 'lucide-react'

export const Route = createFileRoute('/schedule')({
  loader: () => getSchedule(),
  component: SchedulePage,
})

function SchedulePage() {
  const games = Route.useLoaderData()

  const completedGames = games
    .filter((g) => g.status === 'final')
    .sort((a, b) => b.date.localeCompare(a.date))
  const upcomingGames = games
    .filter((g) => g.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))

  const scoredGames = completedGames.filter(
    (g) => g.knightsScore !== null && g.opponentScore !== null,
  )
  const wins = scoredGames.filter((g) => g.knightsScore! > g.opponentScore!).length
  const losses = scoredGames.filter((g) => g.knightsScore! < g.opponentScore!).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-knights-navy">Schedule & Results</h1>
          <p className="text-gray-500 mt-1">2025-26 Spring Season · Mid-Suburban Conference</p>
        </div>
        <div className="bg-knights-navy text-white px-4 py-2 rounded-lg text-center">
          <div className="text-2xl font-bold">{wins}-{losses}</div>
          <div className="text-xs text-knights-gold">Season Record</div>
        </div>
      </div>

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-knights-gold" />
            <h2 className="text-xl font-bold text-knights-navy">Upcoming</h2>
          </div>
          <div className="space-y-3">
            {upcomingGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-medium text-gray-500">
                      {formatDateShort(game.date)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDay(game.date)}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div>
                    <div className="font-bold text-knights-navy">
                      {game.location === 'home' ? 'vs' : '@'} {game.opponent}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {game.venue}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{game.time}</div>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                        game.location === 'home'
                          ? 'bg-knights-navy text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {game.location === 'home' ? 'HOME' : 'AWAY'}
                    </span>
                    {game.isConference && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-knights-gold/20 text-knights-navy">
                        CONF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Games */}
      {completedGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-knights-navy mb-4">Results</h2>
          <div className="space-y-3">
            {completedGames.map((game) => {
              const hasScore =
                game.knightsScore !== null && game.opponentScore !== null
              const isWin = hasScore && game.knightsScore! > game.opponentScore!
              return (
                <Link
                  key={game.id}
                  to="/games/$gameId"
                  params={{ gameId: game.id.toString() }}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <div className="text-sm font-medium text-gray-500">
                          {formatDateShort(game.date)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDay(game.date)}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-gray-200" />
                      <div>
                        <div className="font-bold text-knights-navy">
                          {game.location === 'home' ? 'vs' : '@'} {game.opponent}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {game.venue}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {hasScore ? (
                        <>
                          <div
                            className={`text-xl font-bold ${
                              isWin ? 'text-green-600' : 'text-red-500'
                            }`}
                          >
                            {game.knightsScore}-{game.opponentScore}
                            {game.overtime && (
                              <span className="text-sm font-normal ml-1">(OT)</span>
                            )}
                          </div>
                          <div
                            className={`text-xs font-semibold ${
                              isWin ? 'text-green-600' : 'text-red-500'
                            }`}
                          >
                            {isWin ? 'WIN' : 'LOSS'}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Score N/R</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
