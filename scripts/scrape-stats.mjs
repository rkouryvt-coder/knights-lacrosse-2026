/**
 * Scrapes scoring stats from MaxPreps and updates src/data/stats.ts
 * Run via: node scripts/scrape-stats.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATS_URL = 'https://www.maxpreps.com/il/mt-prospect/prospect-knights/lacrosse/stats/'
const STATS_FILE = resolve(__dirname, '../src/data/stats.ts')

async function scrape() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('Loading MaxPreps stats page...')
  await page.goto(STATS_URL, { waitUntil: 'networkidle', timeout: 30000 })

  // Wait for the stats table to appear
  await page.waitForSelector('table', { timeout: 15000 }).catch(() => {
    console.error('Stats table not found — MaxPreps may have changed their layout.')
    process.exit(1)
  })

  const players = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'))
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td')).map((td) => td.textContent?.trim() ?? '')
      // MaxPreps lacrosse scoring stats columns: #, Name, GP, G, A, Pts
      // Column indices may vary; we look for numeric columns after the name
      return cells
    }).filter((cells) => cells.length >= 4)
  })

  await browser.close()

  if (players.length === 0) {
    console.error('No player rows found.')
    process.exit(1)
  }

  console.log(`Found ${players.length} player rows.`)

  // Parse rows — MaxPreps scoring table for lacrosse:
  // [0]=# [1]=Name [2]=GP [3]=G [4]=A [5]=Pts  (indices may shift if columns differ)
  const parsed = players
    .map((cells) => {
      const num = parseInt(cells[0])
      const name = cells[1]
      const gp = parseInt(cells[2])
      const g = parseInt(cells[3])
      const asst = parseInt(cells[4])
      const pts = parseInt(cells[5])
      if (isNaN(num) || !name || isNaN(gp) || isNaN(g) || isNaN(asst) || isNaN(pts)) return null
      // Convert "Last, First" → "L. First" style
      const nameParts = name.split(',').map((s) => s.trim())
      const lastName = nameParts[0] ?? name
      const firstInitial = nameParts[1]?.[0] ?? ''
      const shortName = firstInitial ? `${firstInitial}. ${lastName}` : lastName
      return { number: num, name: shortName, gp, g, asst, pts }
    })
    .filter(Boolean)
    .sort((a, b) => b.pts - a.pts || b.g - a.g)

  if (parsed.length === 0) {
    console.error('Could not parse any valid player rows.')
    process.exit(1)
  }

  const today = new Date().toISOString().split('T')[0]
  const lines = parsed
    .map((p) => `  { number: ${String(p.number).padEnd(2)}, name: '${p.name.padEnd(15)}', gp: ${p.gp}, g: ${String(p.g).padEnd(2)}, asst: ${String(p.asst).padEnd(2)}, pts: ${p.pts} },`)
    .join('\n')

  const output = `// Player scoring stats — updated weekly from MaxPreps
// https://www.maxpreps.com/il/mt-prospect/prospect-knights/lacrosse/stats/
// Stats last updated: ${today}

export interface PlayerStats {
  number: number
  name: string        // Last, First initial (matches MaxPreps)
  gp: number          // Games played
  g: number           // Goals
  asst: number        // Assists
  pts: number         // Points (G + Asst)
}

export const scoringStats: PlayerStats[] = [
${lines}
]

export const statsLastUpdated = '${today}'
`

  writeFileSync(STATS_FILE, output, 'utf8')
  console.log(`stats.ts updated with ${parsed.length} players (${today}).`)
}

scrape().catch((err) => {
  console.error(err)
  process.exit(1)
})
