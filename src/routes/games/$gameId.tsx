import { Link, createFileRoute } from '@tanstack/react-router'
import { getSchedule } from '@/lib/schedule'
import { getGameWeather } from '@/lib/weather'
import type { GameWeather } from '@/lib/weather'
import { ArrowLeft, MapPin, Calendar, Clock, Navigation } from 'lucide-react'

export const Route = createFileRoute('/games/$gameId')({
  loader: async ({ params }) => {
    const games = await getSchedule()
    const game = games.find((g) => g.id === +params.gameId)
    if (!game) throw new Error('Game not found')
    let weather: GameWeather | null = null
    if (game.status === 'upcoming' && game.coords) {
      weather = await getGameWeather({
        data: { lat: game.coords.lat, lng: game.coords.lng, date: game.date, time: game.time },
      })
    }
    return { game, weather }
  },
  component: GameDetail,
})

function GameDetail() {
  const { game, weather } = Route.useLoaderData()

  const hasScore = game.knightsScore !== null && game.opponentScore !== null
  const isWin = hasScore && game.knightsScore! > game.opponentScore!
  const isLoss = hasScore && game.knightsScore! < game.opponentScore!

  const date = new Date(game.date + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/schedule"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-knights-navy mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Schedule
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-knights-navy text-white p-6">
          <div className="flex items-center gap-2 text-knights-blue text-sm mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
            {game.time !== 'TBD' && game.time !== 'Final' && (
              <>
                <span className="mx-1">·</span>
                <Clock className="w-4 h-4" />
                <span>{game.time}</span>
              </>
            )}
            {game.isConference && (
              <span className="ml-2 text-xs bg-knights-blue/30 text-knights-blue px-2 py-0.5 rounded-full">
                Conference
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-sm text-knights-blue uppercase tracking-wider mb-1">
                {game.location === 'home' ? 'Home' : 'Away'}
              </div>
              <div className="text-2xl font-bold">Knights</div>
            </div>

            {game.status === 'final' ? (
              <div className="text-center px-8">
                {hasScore ? (
                  <>
                    <div className="text-4xl font-bold">
                      {game.knightsScore} - {game.opponentScore}
                    </div>
                    <div
                      className={`text-sm font-semibold mt-1 ${
                        isWin ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'
                      }`}
                    >
                      {isWin ? 'WIN' : isLoss ? 'LOSS' : 'TIE'}
                      {game.overtime && ' (OT)'}
                      {' — FINAL'}
                    </div>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-gray-300">Score not reported</div>
                )}
              </div>
            ) : (
              <div className="text-center px-8">
                <div className="text-2xl font-bold text-knights-blue">VS</div>
                <div className="text-sm text-gray-300 mt-1">{game.time}</div>
              </div>
            )}

            <div className="text-center flex-1">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                {game.location === 'home' ? 'Away' : 'Home'}
              </div>
              <div className="text-2xl font-bold">{game.opponent}</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-knights-blue shrink-0" />
              <div>
                <div className="font-medium">{game.venue}</div>
                <div className="text-sm text-gray-400">
                  {game.location === 'home' ? 'Home Game' : 'Away Game'}
                </div>
              </div>
            </div>
            {game.coords && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.venue + ', IL')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-knights-blue font-medium hover:underline shrink-0"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            )}
          </div>

          {weather && game.status === 'upcoming' && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{weather.emoji}</span>
              <div>
                <div className="font-semibold text-gray-800">{weather.tempF}°F — {weather.condition}</div>
                {weather.rainChance > 20 && (
                  <div className="text-sm text-blue-500">{weather.rainChance}% chance of rain — bring a layer</div>
                )}
              </div>
            </div>
          )}

          {game.status === 'upcoming' && (
            <div className="border-t pt-4 mt-4 text-center">
              <span className="inline-block bg-knights-blue text-knights-navy px-4 py-2 rounded-full font-bold text-sm">
                Game Day: {formattedDate} at {game.time}
              </span>
            </div>
          )}

          {game.status === 'final' && !hasScore && (
            <div className="border-t pt-4 mt-4 text-center text-sm text-gray-400">
              Score has not been reported yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
