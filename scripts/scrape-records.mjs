/**
 * Scrapes each opponent's current W-L record from MaxPreps and updates
 * the opponentRecord field in src/data/games.ts.
 *
 * Run via: node scripts/scrape-records.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GAMES_FILE = resolve(__dirname, '../src/data/games.ts')

const OPPONENTS = [
  { name: 'Stevenson',       url: 'https://www.maxpreps.com/il/lincolnshire/stevenson-patriots/lacrosse/schedule/' },
  { name: 'Maine South',     url: 'https://www.maxpreps.com/il/park-ridge/maine-south-hawks/lacrosse/schedule/' },
  { name: 'Wheeling',        url: 'https://www.maxpreps.com/il/wheeling/wheeling-wildcats/lacrosse/schedule/' },
  { name: 'Libertyville',    url: 'https://www.maxpreps.com/il/libertyville/libertyville-wildcats/lacrosse/schedule/' },
  { name: 'Notre Dame',      url: 'https://www.maxpreps.com/il/niles/niles-notre-dame-dons/lacrosse/schedule/' },
  { name: 'Fremd',           url: 'https://www.maxpreps.com/il/palatine/fremd-vikings/lacrosse/schedule/' },
  { name: 'Rolling Meadows', url: 'https://www.maxpreps.com/il/rolling-meadows/rolling-meadows-mustangs/lacrosse/schedule/' },
  { name: 'Hersey',          url: 'https://www.maxpreps.com/il/arlington-heights/hersey-huskies/lacrosse/schedule/' },
  { name: 'Deerfield',       url: 'https://www.maxpreps.com/il/deerfield/deerfield-warriors/lacrosse/schedule/' },
]

/** Visits a MaxPreps schedule page and returns the team's "W-L" record string, or null. */
async function getRecord(page, url, teamName) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    const record = await page.evaluate(() => {
      const text = document.body.innerText

      // Method 1: Look for "Overall X-Y" displayed in the stats section
      const m1 = text.match(/[Oo]verall\s+(\d+)\s*[-–]\s*(\d+)/)
      if (m1) return `${m1[1]}-${m1[2]}`

      // Method 2: Count W/L result lines from the schedule table.
      // MaxPreps renders completed games as lines containing "W X-Y" or "L X-Y".
      const wins   = (text.match(/\bW\s+\d+\s*-\s*\d+/g) || []).length
      const losses = (text.match(/\bL\s+\d+\s*-\s*\d+/g) || []).length
      if (wins + losses > 0) return `${wins}-${losses}`

      // Method 3: Standalone "(X-Y)" near the team header
      const m3 = text.match(/\((\d+)\s*-\s*(\d+)\)/)
      if (m3) return `${m3[1]}-${m3[2]}`

      return null
    })

    if (record && /^\d+-\d+$/.test(record)) {
      console.log(`  ${teamName}: ${record}`)
      return record
    }
    console.warn(`  ${teamName}: could not extract record from page`)
    return null
  } catch (err) {
    console.warn(`  ${teamName}: error — ${err.message}`)
    return null
  }
}

async function scrape() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  let content = readFileSync(GAMES_FILE, 'utf8')
  let updatedCount = 0

  for (const { name, url } of OPPONENTS) {
    const record = await getRecord(page, url, name)
    if (!record) continue

    // Replace opponentRecord for this opponent.
    // Matches: opponent: 'NAME' ... opponentRecord: 'OLD'
    // within the same game object (lazy match keeps it scoped).
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(
      `(opponent:\\s*'${escapedName}'[\\s\\S]*?opponentRecord:\\s*')[^']*(')`
    )

    if (regex.test(content)) {
      content = content.replace(regex, `$1${record}$2`)
      updatedCount++
    } else {
      console.warn(`  ${name}: opponentRecord field not found in games.ts`)
    }
  }

  await browser.close()

  writeFileSync(GAMES_FILE, content, 'utf8')
  console.log(`\ngames.ts updated: ${updatedCount} opponent records refreshed.`)
}

scrape().catch((err) => {
  console.error(err)
  process.exit(1)
})
