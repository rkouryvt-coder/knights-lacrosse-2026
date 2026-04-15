// Player scoring stats — updated weekly from MaxPreps
// https://www.maxpreps.com/il/mt-prospect/prospect-knights/lacrosse/stats/
// Stats last updated: 2026-04-14

export interface PlayerStats {
  number: number
  name: string        // Last, First initial (matches MaxPreps)
  gp: number          // Games played
  g: number           // Goals
  asst: number        // Assists
  pts: number         // Points (G + Asst)
}

export const scoringStats: PlayerStats[] = [
  { number: 1,  name: 'G. Heaton',       gp: 7, g: 14, asst: 6, pts: 20 },
  { number: 4,  name: 'G. Quinn',        gp: 7, g: 10, asst: 5, pts: 15 },
  { number: 5,  name: 'J. Riesing',      gp: 7, g: 12, asst: 2, pts: 14 },
  { number: 6,  name: 'K. Fitzpatrick',  gp: 7, g: 10, asst: 4, pts: 14 },
  { number: 12, name: 'C. Anderson',     gp: 7, g: 6,  asst: 7, pts: 13 },
  { number: 9,  name: 'B. Anderson',     gp: 7, g: 5,  asst: 5, pts: 10 },
  { number: 3,  name: 'D. Geisler',      gp: 6, g: 3,  asst: 2, pts: 5 },
  { number: 14, name: 'Q. Lokun',        gp: 5, g: 4,  asst: 1, pts: 5 },
  { number: 10, name: 'G. Biewenga',     gp: 4, g: 2,  asst: 1, pts: 3 },
  { number: 23, name: 'R. Riedel',       gp: 4, g: 1,  asst: 2, pts: 3 },
  { number: 11, name: 'C. Koury',        gp: 6, g: 2,  asst: 0, pts: 2 },
  { number: 8,  name: 'J. Freeman',      gp: 7, g: 1,  asst: 0, pts: 1 },
  { number: 17, name: 'K. Hammerstrom',  gp: 7, g: 0,  asst: 1, pts: 1 },
  { number: 18, name: 'M. Lundvick',     gp: 5, g: 1,  asst: 0, pts: 1 },
  { number: 20, name: 'D. Matray',       gp: 7, g: 0,  asst: 1, pts: 1 },
  { number: 22, name: 'M. Grund',        gp: 7, g: 0,  asst: 1, pts: 1 },
  { number: 33, name: 'R. Pet',          gp: 1, g: 0,  asst: 1, pts: 1 },
]

export const statsLastUpdated = '2026-04-14'
