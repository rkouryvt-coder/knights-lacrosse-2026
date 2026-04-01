export interface Game {
  id: number
  date: string
  time: string
  opponent: string
  location: 'home' | 'away'
  venue: string
  knightsScore: number | null
  opponentScore: number | null
  status: 'upcoming' | 'final' | 'in-progress'
  highlights?: string
}

export interface Player {
  id: number
  number: number
  name: string
  position: string
  grade: number
  goals: number
  assists: number
  groundBalls: number
}

const games: Array<Game> = [
  {
    id: 1,
    date: '2026-03-07',
    time: '4:00 PM',
    opponent: 'Riverside Hawks',
    location: 'home',
    venue: 'Prospect Knights Field',
    knightsScore: 12,
    opponentScore: 5,
    status: 'final',
    highlights: 'Strong start with 5 goals in the first quarter. Defense held the Hawks to just 2 goals in the second half. Jake M. had a hat trick and Dylan R. added 4 assists.',
  },
  {
    id: 2,
    date: '2026-03-10',
    time: '5:30 PM',
    opponent: 'Central Wildcats',
    location: 'away',
    venue: 'Central High Stadium',
    knightsScore: 8,
    opponentScore: 9,
    status: 'final',
    highlights: 'Tight game throughout. Knights rallied from 3 down in the 4th quarter but fell one short. Marcus T. scored the go-ahead goal in the 3rd but Wildcats answered back.',
  },
  {
    id: 3,
    date: '2026-03-14',
    time: '4:00 PM',
    opponent: 'Lakewood Eagles',
    location: 'home',
    venue: 'Prospect Knights Field',
    knightsScore: 15,
    opponentScore: 3,
    status: 'final',
    highlights: 'Dominant performance from start to finish. Every starter scored at least one goal. Coach pulled starters at halftime to give bench players time. Great team win.',
  },
  {
    id: 4,
    date: '2026-03-17',
    time: '6:00 PM',
    opponent: 'North Valley Trojans',
    location: 'away',
    venue: 'North Valley Sports Complex',
    knightsScore: 10,
    opponentScore: 7,
    status: 'final',
    highlights: 'Physical game with the Trojans. Knights controlled possession and won the ground ball battle 34-21. Goalie Ethan P. made 14 saves in a gutsy performance.',
  },
  {
    id: 5,
    date: '2026-03-21',
    time: '4:30 PM',
    opponent: 'Summit Cougars',
    location: 'home',
    venue: 'Prospect Knights Field',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 6,
    date: '2026-03-25',
    time: '5:00 PM',
    opponent: 'Eastside Panthers',
    location: 'away',
    venue: 'Eastside Athletic Fields',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 7,
    date: '2026-03-28',
    time: '4:00 PM',
    opponent: 'Riverside Hawks',
    location: 'away',
    venue: 'Hawks Stadium',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 8,
    date: '2026-04-01',
    time: '4:30 PM',
    opponent: 'Westfield Bears',
    location: 'home',
    venue: 'Prospect Knights Field',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 9,
    date: '2026-04-04',
    time: '6:00 PM',
    opponent: 'Central Wildcats',
    location: 'home',
    venue: 'Prospect Knights Field',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 10,
    date: '2026-04-08',
    time: '5:00 PM',
    opponent: 'Lakewood Eagles',
    location: 'away',
    venue: 'Eagle Field',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
]

const roster: Array<Player> = [
  { id: 1, number: 1, name: 'Ethan P.', position: 'Goalie', grade: 11, goals: 0, assists: 0, groundBalls: 8 },
  { id: 2, number: 3, name: 'Jake M.', position: 'Attack', grade: 12, goals: 11, assists: 5, groundBalls: 6 },
  { id: 3, number: 5, name: 'Dylan R.', position: 'Attack', grade: 11, goals: 7, assists: 12, groundBalls: 4 },
  { id: 4, number: 7, name: 'Marcus T.', position: 'Attack', grade: 10, goals: 9, assists: 3, groundBalls: 5 },
  { id: 5, number: 8, name: 'Ryan K.', position: 'Midfield', grade: 12, goals: 6, assists: 8, groundBalls: 18 },
  { id: 6, number: 10, name: 'Noah S.', position: 'Midfield', grade: 11, goals: 4, assists: 6, groundBalls: 22 },
  { id: 7, number: 12, name: 'Liam C.', position: 'Midfield', grade: 11, goals: 5, assists: 4, groundBalls: 15 },
  { id: 8, number: 14, name: 'Aiden W.', position: 'Midfield', grade: 10, goals: 2, assists: 3, groundBalls: 12 },
  { id: 9, number: 18, name: 'Cole B.', position: 'Defense', grade: 12, goals: 1, assists: 2, groundBalls: 28 },
  { id: 10, number: 21, name: 'Owen D.', position: 'Defense', grade: 11, goals: 0, assists: 1, groundBalls: 25 },
  { id: 11, number: 24, name: 'Tyler H.', position: 'Defense', grade: 10, goals: 0, assists: 0, groundBalls: 19 },
  { id: 12, number: 27, name: 'Jack F.', position: 'LSM', grade: 12, goals: 0, assists: 2, groundBalls: 31 },
  { id: 13, number: 30, name: 'Ben G.', position: 'FOGO', grade: 11, goals: 0, assists: 1, groundBalls: 35 },
  { id: 14, number: 33, name: 'Sam L.', position: 'Attack', grade: 10, goals: 3, assists: 2, groundBalls: 3 },
  { id: 15, number: 35, name: 'Caleb N.', position: 'Midfield', grade: 9, goals: 1, assists: 1, groundBalls: 7 },
  { id: 16, number: 40, name: 'Mason J.', position: 'Goalie', grade: 10, goals: 0, assists: 0, groundBalls: 5 },
]

export { games, roster }
