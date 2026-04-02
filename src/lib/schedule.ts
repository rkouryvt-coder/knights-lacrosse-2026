import { createServerFn } from '@tanstack/react-start'
import { games as staticGames } from '@/data/games'
import type { Game } from '@/data/games'

const RSCHOOL_URL =
  'https://prospecthighschool.rschoolteams.com/page/3000'

// Attempt to extract live score data from the rschoolteams schedule page.
// rschoolteams renders a server-side HTML table; we look for score cells of the
// form "W 12-8" / "L 5-10" and correlate them with our static schedule by
// matching opponent names. Falls back to static data on any failure.

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Returns a map of opponent name (lowercased) → { knightsScore, opponentScore }.
function parseRschoolHtml(
  html: string,
): Map<string, { knightsScore: number; opponentScore: number }> | null {
  try {
    const scores = new Map<string, { knightsScore: number; opponentScore: number }>()

    // rschoolteams score format (from team's POV): "W 12-8" or "L 5-10"
    // Also handle plain scores like "12-8" that appear inside a W/L cell.
    const scoreRe = /\b([WL])\s+(\d{1,3})\s*[-–]\s*(\d{1,3})\b/i

    // Split HTML into table rows so we can search row-by-row.
    const rowRe = /<tr[\s>][\s\S]*?<\/tr>/gi
    let rowMatch: RegExpExecArray | null

    while ((rowMatch = rowRe.exec(html)) !== null) {
      const rowHtml = rowMatch[0]
      const scoreMatch = scoreRe.exec(rowHtml)
      if (!scoreMatch) continue

      const wl = scoreMatch[1].toUpperCase()
      const a = parseInt(scoreMatch[2], 10)
      const b = parseInt(scoreMatch[3], 10)

      // rschoolteams shows winner's score first.
      // "W 12-8" → Knights won, knights=12 opp=8
      // "L 5-10" → Knights lost, opp=5 knights=10... use W/L to assign correctly
      const knightsScore = wl === 'W' ? Math.max(a, b) : Math.min(a, b)
      const opponentScore = wl === 'W' ? Math.min(a, b) : Math.max(a, b)

      // Match opponent name against our static schedule
      const rowText = stripTags(rowHtml).toLowerCase()
      for (const game of staticGames) {
        if (rowText.includes(game.opponent.toLowerCase())) {
          scores.set(game.opponent.toLowerCase(), { knightsScore, opponentScore })
          break
        }
      }
    }

    // Also try a broader scan: look for score patterns anywhere in the page
    // and associate with the nearest opponent name mention
    if (scores.size === 0) {
      const broadScoreRe = /\b([WL])\s+(\d{1,3})\s*[-–]\s*(\d{1,3})\b/gi
      let m: RegExpExecArray | null
      while ((m = broadScoreRe.exec(html)) !== null) {
        const wl = m[1].toUpperCase()
        const a = parseInt(m[2], 10)
        const b = parseInt(m[3], 10)
        const knightsScore = a
        const opponentScore = b

        // Check a surrounding window of text for an opponent name
        const start = Math.max(0, m.index - 500)
        const end = Math.min(html.length, m.index + 500)
        const window = stripTags(html.slice(start, end)).toLowerCase()

        for (const game of staticGames) {
          const key = game.opponent.toLowerCase()
          if (!scores.has(key) && window.includes(key)) {
            // Confirm direction: W means we won so knights > opp
            const ks = wl === 'W' ? Math.max(a, b) : Math.min(a, b)
            const os = wl === 'W' ? Math.min(a, b) : Math.max(a, b)
            scores.set(key, { knightsScore: ks, opponentScore: os })
            break
          }
        }
      }
    }

    return scores.size > 0 ? scores : null
  } catch {
    return null
  }
}

async function fetchLiveScores(): Promise<
  Map<string, { knightsScore: number; opponentScore: number }> | null
> {
  try {
    const res = await fetch(RSCHOOL_URL, {
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
    return parseRschoolHtml(html)
  } catch {
    return null
  }
}

// Merge live scores from rschoolteams into our static schedule.
// Static data holds the authoritative schedule (dates, times, venues).
// Live data provides up-to-date scores for completed games.
function mergeScores(
  liveScores: Map<string, { knightsScore: number; opponentScore: number }>,
): Array<Game> {
  return staticGames.map((game) => {
    const live = liveScores.get(game.opponent.toLowerCase())
    if (live) {
      return {
        ...game,
        knightsScore: live.knightsScore,
        opponentScore: live.opponentScore,
        status: 'final' as const,
      }
    }
    return game
  })
}

export const getSchedule = createServerFn({ method: 'GET' }).handler(
  async () => {
    const liveScores = await fetchLiveScores()
    if (!liveScores) return staticGames
    return mergeScores(liveScores)
  },
)
