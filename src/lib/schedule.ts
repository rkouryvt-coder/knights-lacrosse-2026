import { createServerFn } from '@tanstack/react-start'
import { games as staticGames } from '@/data/games'
import type { Game } from '@/data/games'

const MAXPREPS_URL =
  'https://www.maxpreps.com/il/mt-prospect/prospect-knights/lacrosse/schedule/'

// Attempt to parse the MaxPreps __NEXT_DATA__ script tag for live schedule data.
// MaxPreps is a Next.js app; it embeds dehydrated React Query state in the page.
function parseMaxPrepsHtml(html: string): Array<Game> | null {
  try {
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    )
    if (!match) return null

    const nextData = JSON.parse(match[1]) as Record<string, unknown>

    // MaxPreps serialises React Query cache inside dehydratedState.queries.
    // Walk every query's state.data looking for an array with schedule-shaped objects.
    const queries: Array<unknown> =
      (
        nextData?.props as Record<string, unknown> | undefined
      )?.pageProps
        ? (
            (nextData.props as Record<string, unknown>)
              .pageProps as Record<string, unknown>
          )?.dehydratedState
          ? (
              (
                (nextData.props as Record<string, unknown>)
                  .pageProps as Record<string, unknown>
              ).dehydratedState as Record<string, unknown>
            )?.queries as Array<unknown>
          : []
        : []

    if (!Array.isArray(queries)) return null

    for (const query of queries) {
      const data = (
        (query as Record<string, unknown>)?.state as Record<string, unknown>
      )?.data

      const scheduleArray = findScheduleArray(data)
      if (scheduleArray) {
        const parsed = parseScheduleArray(scheduleArray)
        if (parsed && parsed.length > 0) return parsed
      }
    }
    return null
  } catch {
    return null
  }
}

function findScheduleArray(data: unknown): Array<unknown> | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>

  // Direct arrays we care about
  for (const key of ['schedule', 'games', 'contests', 'events']) {
    if (Array.isArray(obj[key]) && (obj[key] as Array<unknown>).length > 0) {
      return obj[key] as Array<unknown>
    }
  }

  // One level deeper
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object') {
      const found = findScheduleArray(val)
      if (found) return found
    }
  }
  return null
}

// Best-effort map of MaxPreps schedule item to our Game type.
// MaxPreps field names vary; we try common variants.
function parseScheduleArray(items: Array<unknown>): Array<Game> | null {
  try {
    const games: Array<Game> = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as Record<string, unknown>

      // Date
      const rawDate: string =
        (item.date as string) ||
        (item.gameDate as string) ||
        (item.contestDate as string) ||
        ''
      if (!rawDate) return null
      const date = rawDate.split('T')[0] // ISO date portion only

      // Opponent
      const opponentObj =
        (item.opponent as Record<string, unknown>) ||
        (item.opposingTeam as Record<string, unknown>)
      const opponent: string =
        (opponentObj?.name as string) ||
        (opponentObj?.shortName as string) ||
        (item.opponentName as string) ||
        'Unknown'

      // Home/away
      const homeFlag =
        (item.isHome as boolean) ??
        ((item.location as string)?.toLowerCase() === 'home')
      const location: 'home' | 'away' = homeFlag ? 'home' : 'away'
      const venue: string =
        (item.venue as string) ||
        (item.venueName as string) ||
        (location === 'home' ? 'Prospect High School' : `${opponent} High School`)

      // Scores
      const teamScore =
        (item.teamScore as number | null) ??
        (item.homeScore as number | null) ??
        null
      const opponentScore =
        (item.opponentScore as number | null) ??
        (item.awayScore as number | null) ??
        null
      const hasScore =
        teamScore !== null && opponentScore !== null

      // Status
      const statusRaw = (item.status as string) || ''
      const isFinal =
        statusRaw.toLowerCase().includes('final') ||
        statusRaw.toLowerCase().includes('complete') ||
        hasScore
      const status: 'upcoming' | 'final' = isFinal ? 'final' : 'upcoming'

      // Time
      const time: string =
        (item.time as string) ||
        (item.gameTime as string) ||
        (isFinal ? 'Final' : 'TBD')

      games.push({
        id: i + 1,
        date,
        time,
        opponent,
        location,
        venue,
        knightsScore: location === 'home' ? teamScore : opponentScore,
        opponentScore: location === 'home' ? opponentScore : teamScore,
        status,
        overtime: !!(item.isOvertime || item.overtime),
        isConference: !!(item.isConference || item.conference),
      })
    }

    return games.length > 0 ? games : null
  } catch {
    return null
  }
}

async function fetchLiveSchedule(): Promise<Array<Game> | null> {
  try {
    const res = await fetch(MAXPREPS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const html = await res.text()
    return parseMaxPrepsHtml(html)
  } catch {
    return null
  }
}

export const getSchedule = createServerFn({ method: 'GET' }).handler(
  async () => {
    const live = await fetchLiveSchedule()
    return live ?? staticGames
  },
)
