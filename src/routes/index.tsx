import { Link, createFileRoute } from '@tanstack/react-router'
import { games, roster } from '@/data/games'
import { Shield, Calendar, Trophy, TrendingUp, MapPin } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const completedGames = games
    .filter((g) => g.status === 'final')
    .sort((a, b) => b.date.localeCompare(a.date))
  const upcomingGames = games
    .filter((g) => g.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))

  const wins = completedGames.filter(
    (g) => g.knightsScore !== null && g.opponentScore !== null && g.knightsScore > g.opponentScore,
  ).length
  const losses = completedGames.filter(
    (g) => g.knightsScore !== null && g.opponentScore !== null && g.knightsScore < g.opponentScore,
  ).length

  const totalGoalsFor = completedGames.reduce((sum, g) => sum + (g.knightsScore ?? 0), 0)
  const totalGoalsAgainst = completedGames.reduce((sum, g) => sum + (g.opponentScore ?? 0), 0)

  const topScorers = [...roster]
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
    .slice(0, 5)

  const nextGame = upcomingGames[0]
  const lastGame = completedGames[0]

  return (
    <div>
      {/* Hero */}
      <div className="bg-knights-navy text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Shield className="w-16 h-16 text-knights-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Prospect Knights</h1>
          <p className="text-knights-gold text-lg tracking-wider uppercase mb-6">
            High School Lacrosse
          </p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-3xl font-bold">{wins}-{losses}</div>
              <div className="text-sm text-gray-300">Record</div>
            </div>
            <div className="w-px h-10 bg-gray-600" />
            <div>
              <div className="text-3xl font-bold">{totalGoalsFor}</div>
              <div className="text-sm text-gray-300">Goals For</div>
            </div>
            <div className="w-px h-10 bg-gray-600" />
            <div>
              <div className="text-3xl font-bold">{totalGoalsAgainst}</div>
              <div className="text-sm text-gray-300">Goals Against</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Next Game */}
          {nextGame && (
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-knights-gold">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-knights-gold" />
                <h2 className="text-lg font-bold text-knights-navy">Next Game</h2>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-knights-navy">
                  vs {nextGame.opponent}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {nextGame.location === 'home' ? 'HOME' : 'AWAY'} — {nextGame.venue}
                  </span>
                </div>
                <div className="text-gray-600">
                  {formatDate(nextGame.date)} at {nextGame.time}
                </div>
              </div>
            </div>
          )}

          {/* Last Result */}
          {lastGame && (
            <Link
              to="/games/$gameId"
              params={{ gameId: lastGame.id.toString() }}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-knights-navy hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-knights-navy" />
                  <h2 className="text-lg font-bold text-knights-navy">Last Result</h2>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 uppercase">
                      {lastGame.location === 'home' ? 'Home' : 'Away'} vs
                    </div>
                    <div className="text-xl font-bold text-knights-navy">
                      {lastGame.opponent}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        lastGame.knightsScore! > lastGame.opponentScore!
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {lastGame.knightsScore} - {lastGame.opponentScore}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        lastGame.knightsScore! > lastGame.opponentScore!
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {lastGame.knightsScore! > lastGame.opponentScore! ? 'WIN' : 'LOSS'}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Recent Results and Top Players side by side */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Recent Results */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-knights-navy">Recent Results</h2>
              <Link
                to="/schedule"
                className="text-sm text-knights-gold hover:text-knights-gold-light font-medium"
              >
                Full Schedule →
              </Link>
            </div>
            <div className="space-y-3">
              {completedGames.slice(0, 4).map((game) => (
                <Link
                  key={game.id}
                  to="/games/$gameId"
                  params={{ gameId: game.id.toString() }}
                  className="block"
                >
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          game.knightsScore! > game.opponentScore!
                            ? 'bg-green-500'
                            : 'bg-red-400'
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {game.location === 'home' ? 'vs' : '@'} {game.opponent}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(game.date)}</div>
                      </div>
                    </div>
                    <div
                      className={`font-bold text-sm ${
                        game.knightsScore! > game.opponentScore!
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {game.knightsScore}-{game.opponentScore}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Players */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-knights-navy">Top Players</h2>
              <Link
                to="/roster"
                className="text-sm text-knights-gold hover:text-knights-gold-light font-medium"
              >
                Full Roster →
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-xs text-gray-500 font-medium px-3">
                <div className="flex-1">Player</div>
                <div className="w-12 text-center">G</div>
                <div className="w-12 text-center">A</div>
                <div className="w-12 text-center">PTS</div>
              </div>
              {topScorers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <span className="text-knights-gold font-bold text-sm mr-2">
                      #{player.number}
                    </span>
                    <span className="font-medium text-sm">{player.name}</span>
                  </div>
                  <div className="w-12 text-center text-sm">{player.goals}</div>
                  <div className="w-12 text-center text-sm">{player.assists}</div>
                  <div className="w-12 text-center text-sm font-bold">
                    {player.goals + player.assists}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Games */}
        {upcomingGames.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-knights-navy" />
              <h2 className="text-lg font-bold text-knights-navy">Upcoming Games</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingGames.slice(0, 3).map((game) => (
                <div
                  key={game.id}
                  className="border rounded-lg p-4 hover:border-knights-gold transition-colors"
                >
                  <div className="text-sm text-gray-500 mb-1">{formatDate(game.date)}</div>
                  <div className="font-bold text-knights-navy">
                    {game.location === 'home' ? 'vs' : '@'} {game.opponent}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{game.time} — {game.venue}</div>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                      game.location === 'home'
                        ? 'bg-knights-navy text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {game.location === 'home' ? 'HOME' : 'AWAY'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
