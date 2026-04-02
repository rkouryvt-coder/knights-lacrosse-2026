import { Link, createFileRoute } from '@tanstack/react-router'
import { getSchedule } from '@/lib/schedule'
import { getMediaFeed } from '@/lib/media'
import { Shield, Calendar, Trophy, MapPin, Youtube, Newspaper } from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [games, media] = await Promise.all([getSchedule(), getMediaFeed()])
    return { games, media }
  },
  component: HomePage,
})

function HomePage() {
  const { games, media } = Route.useLoaderData()

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
  const totalGoalsFor = scoredGames.reduce((sum, g) => sum + (g.knightsScore ?? 0), 0)
  const totalGoalsAgainst = scoredGames.reduce((sum, g) => sum + (g.opponentScore ?? 0), 0)

  const nextGame = upcomingGames[0]
  const lastScoredGame = scoredGames[0]

  return (
    <div>
      {/* Hero */}
      <div className="bg-knights-navy text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Shield className="w-16 h-16 text-knights-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Prospect Knights</h1>
          <p className="text-knights-gold text-lg tracking-wider uppercase mb-6">
            High School Lacrosse · 2025-26
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
                  {nextGame.location === 'home' ? 'vs' : '@'} {nextGame.opponent}
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
                {nextGame.isConference && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-knights-gold/20 text-knights-navy">
                    Conference Game
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Last Result */}
          {lastScoredGame && (
            <Link
              to="/games/$gameId"
              params={{ gameId: lastScoredGame.id.toString() }}
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
                      {lastScoredGame.location === 'home' ? 'Home' : 'Away'} vs
                    </div>
                    <div className="text-xl font-bold text-knights-navy">
                      {lastScoredGame.opponent}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        lastScoredGame.knightsScore! > lastScoredGame.opponentScore!
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {lastScoredGame.knightsScore} - {lastScoredGame.opponentScore}
                      {lastScoredGame.overtime && (
                        <span className="text-base font-normal ml-1">(OT)</span>
                      )}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        lastScoredGame.knightsScore! > lastScoredGame.opponentScore!
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {lastScoredGame.knightsScore! > lastScoredGame.opponentScore!
                        ? 'WIN'
                        : 'LOSS'}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Recent Results */}
        {scoredGames.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
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
              {scoredGames.slice(0, 4).map((game) => (
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
                      {game.overtime && <span className="font-normal text-xs ml-0.5">(OT)</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Games */}
        {upcomingGames.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-knights-navy">Upcoming Games</h2>
              <Link
                to="/schedule"
                className="text-sm text-knights-gold hover:text-knights-gold-light font-medium"
              >
                Full Schedule →
              </Link>
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
                  <div className="text-sm text-gray-600 mt-1">{game.time}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                        game.location === 'home'
                          ? 'bg-knights-navy text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {game.location === 'home' ? 'HOME' : 'AWAY'}
                    </span>
                    {game.isConference && (
                      <span className="inline-block text-xs px-2 py-1 rounded-full font-medium bg-knights-gold/20 text-knights-navy">
                        CONF
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News & Videos */}
        {media.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-knights-navy mb-4">News &amp; Videos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.slice(0, 6).map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-knights-navy/10 flex items-center justify-center">
                      {item.type === 'video'
                        ? <Youtube className="w-10 h-10 text-knights-navy/30" />
                        : <Newspaper className="w-10 h-10 text-knights-navy/30" />
                      }
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      {item.type === 'video'
                        ? <Youtube className="w-3.5 h-3.5 text-red-600" />
                        : <Newspaper className="w-3.5 h-3.5 text-knights-navy" />
                      }
                      <span className="text-xs font-medium text-gray-500">{item.source}</span>
                      {item.date && (
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-knights-navy leading-snug line-clamp-3">
                      {item.title}
                    </p>
                  </div>
                </a>
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
