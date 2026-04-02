// Player scoring stats — updated weekly from MaxPreps
// https://www.maxpreps.com/il/mt-prospect/prospect-knights/lacrosse/stats/
// Stats last updated: 2026-03-31

export interface PlayerStats {
  number: number
  name: string        // Last, First initial (matches MaxPreps)
  gp: number          // Games played
  g: number           // Goals
  asst: number        // Assists
  pts: number         // Points (G + Asst)
}

export const scoringStats: PlayerStats[] = [
  { number: 4,  name: 'G. Quinn',       gp: 2, g: 6,  asst: 1, pts: 7 },
  { number: 1,  name: 'G. Heaton',      gp: 2, g: 4,  asst: 0, pts: 4 },
  { number: 5,  name: 'J. Riesing',     gp: 2, g: 3,  asst: 1, pts: 4 },
  { number: 6,  name: 'K. Fitzpatrick', gp: 2, g: 3,  asst: 1, pts: 4 },
  { number: 9,  name: 'B. Anderson',    gp: 2, g: 2,  asst: 1, pts: 3 },
  { number: 13, name: 'C. Anderson',    gp: 2, g: 2,  asst: 1, pts: 3 },
  { number: 11, name: 'C. Koury',       gp: 2, g: 1,  asst: 0, pts: 1 },
  { number: 3,  name: 'D. Geisler',     gp: 2, g: 0,  asst: 1, pts: 1 },
  { number: 17, name: 'K. Hammerstrom', gp: 2, g: 0,  asst: 1, pts: 1 },
]

export const statsLastUpdated = '2026-03-31'
