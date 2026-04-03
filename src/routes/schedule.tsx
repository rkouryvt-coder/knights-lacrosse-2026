import { Link, createFileRoute } from '@tanstack/react-router'
import { getSchedule } from '@/lib/schedule'
import { Calendar, MapPin, CalendarPlus, Video } from 'lucide-react'

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
  const nextGameId = upcomingGames[0]?.id

  return (
    <div className="h-full overflow-y-auto">
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-knights-navy">Schedule & Results</h1>
          <p className="text-gray-500 mt-1">2025-26 Spring Season · Mid-Suburban Conference</p>
        </div>
        <div className="bg-knights-navy text-white px-4 py-2 rounded-lg text-center">
          <div className="text-2xl font-bold">{wins}-{losses}</div>
          <div className="text-xs text-knights-blue">Season Record</div>
        </div>
      </div>

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-knights-blue" />
            <h2 className="text-xl font-bold text-knights-navy">Upcoming</h2>
          </div>
          <div className="space-y-3">
            {upcomingGames.map((game) => {
              const isNext = game.id === nextGameId
              return (
                <div
                  key={game.id}
                  className={`rounded-xl shadow-sm border p-5 flex items-center justify-between ${
                    isNext
                      ? 'bg-knights-navy/5 border-knights-blue border-l-4'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      {isNext && (
                        <div className="text-xs font-bold text-knights-blue uppercase mb-0.5">Next</div>
                      )}
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
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {game.coords ? (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.venue + ', IL')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-knights-blue hover:underline"
                            >
                              {game.venue}
                            </a>
                          ) : game.venue}
                        </div>
                        {game.opponentRecord && (
                          <span className="text-xs text-gray-400 font-medium">({game.opponentRecord})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-sm font-medium">{game.time}</div>
                    <div className="flex items-center gap-1 justify-end">
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
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-knights-blue/20 text-knights-navy">
                          CONF
                        </span>
                      )}
                    </div>
                    <a
                      href={buildIcsUrl(game)}
                      download={`knights-vs-${game.opponent.toLowerCase().replace(/\s+/g, '-')}.ics`}
                      className="flex items-center gap-1 text-xs text-knights-blue hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CalendarPlus className="w-3 h-3" />
                      Add to Calendar
                    </a>
                    {game.hudlUrl && (
                      <a
                        href={game.hudlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-orange-500 font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Video className="w-3 h-3" />
                        Watch Live
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
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
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {game.coords ? (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.venue + ', IL')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-knights-blue hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {game.venue}
                              </a>
                            ) : game.venue}
                          </div>
                          {game.opponentRecord && (
                            <span className="text-xs text-gray-400 font-medium">({game.opponentRecord})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
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
                      {game.hudlUrl && (
                        <a
                          href={game.hudlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-knights-blue hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Video className="w-3 h-3" />
                          Watch Replay
                        </a>
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

function buildIcsUrl(game: { date: string; time: string; opponent: string; location: string; venue: string }): string {
  const [hour, minutePart] = game.time.split(':')
  const minute = minutePart?.replace(/[^0-9]/g, '') ?? '00'
  const isPM = game.time.toLowerCase().includes('pm')
  const h = (parseInt(hour) % 12) + (isPM ? 12 : 0)
  const dateObj = new Date(`${game.date}T${String(h).padStart(2, '0')}:${minute}:00`)
  const endObj = new Date(dateObj.getTime() + 90 * 60 * 1000)

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(dateObj)}`,
    `DTEND:${fmt(endObj)}`,
    `SUMMARY:Prospect Knights ${game.location === 'home' ? 'vs' : '@'} ${game.opponent}`,
    `LOCATION:${game.venue}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines)}`
}
