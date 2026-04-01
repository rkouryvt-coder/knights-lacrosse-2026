export interface Game {
  id: number
  date: string
  time: string
  opponent: string
  location: 'home' | 'away'
  venue: string
  knightsScore: number | null
  opponentScore: number | null
  status: 'upcoming' | 'final'
  overtime?: boolean
  isConference?: boolean
}

// Real 2025-26 Prospect Knights Boys Varsity Lacrosse schedule.
// Used as fallback when the live API fetch fails.
export const games: Array<Game> = [
  {
    id: 1,
    date: '2026-03-18',
    time: '5:00 PM',
    opponent: 'Stevenson',
    location: 'home',
    venue: 'Prospect High School',
    knightsScore: null,
    opponentScore: null,
    status: 'final',
  },
  {
    id: 2,
    date: '2026-03-31',
    time: '7:00 PM',
    opponent: 'Maine South',
    location: 'home',
    venue: 'Prospect High School',
    knightsScore: null,
    opponentScore: null,
    status: 'final',
  },
  {
    id: 3,
    date: '2026-04-02',
    time: '5:30 PM',
    opponent: 'Wheeling',
    location: 'away',
    venue: 'Wheeling High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 4,
    date: '2026-04-06',
    time: '6:45 PM',
    opponent: 'Libertyville',
    location: 'away',
    venue: 'Libertyville High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 5,
    date: '2026-04-07',
    time: '7:00 PM',
    opponent: 'Notre Dame',
    location: 'home',
    venue: 'Prospect High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 6,
    date: '2026-04-09',
    time: '7:00 PM',
    opponent: 'Fremd',
    location: 'away',
    venue: 'Fremd High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 7,
    date: '2026-04-13',
    time: '7:00 PM',
    opponent: 'Rolling Meadows',
    location: 'away',
    venue: 'Rolling Meadows High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 8,
    date: '2026-04-16',
    time: '7:00 PM',
    opponent: 'Hersey',
    location: 'home',
    venue: 'Prospect High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
  {
    id: 9,
    date: '2026-04-21',
    time: '5:00 PM',
    opponent: 'Deerfield',
    location: 'away',
    venue: 'Deerfield High School',
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
  },
]
