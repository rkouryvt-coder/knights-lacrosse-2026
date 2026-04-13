export interface Game {
  id: number
  date: string
  time: string
  opponent: string
  location: 'home' | 'away'
  venue: string
  coords?: { lat: number; lng: number }
  knightsScore: number | null
  opponentScore: number | null
  status: 'upcoming' | 'final'
  overtime?: boolean
  isConference?: boolean
  opponentRecord?: string
  hudlUrl?: string  // Hudl live stream or replay URL — add before each game
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
    coords: { lat: 42.0703, lng: -87.9406 },
    knightsScore: 15,
    opponentScore: 2,
    status: 'final',
    opponentRecord: '1-3',
  },
  {
    id: 2,
    date: '2026-03-31',
    time: '7:00 PM',
    opponent: 'Maine South',
    location: 'home',
    venue: 'Prospect High School',
    coords: { lat: 42.0703, lng: -87.9406 },
    knightsScore: 6,
    opponentScore: 7,
    status: 'final',
    overtime: true,
    opponentRecord: '3-1',
  },
  {
    id: 3,
    date: '2026-04-02',
    time: '5:30 PM',
    opponent: 'Wheeling',
    location: 'away',
    venue: 'Wheeling High School',
    coords: { lat: 42.1288, lng: -87.9223 },
    knightsScore: 19,
    opponentScore: 0,
    status: 'final',
    opponentRecord: '0-1',
  },
  {
    id: 4,
    date: '2026-04-06',
    time: '6:45 PM',
    opponent: 'Libertyville',
    location: 'away',
    venue: 'Libertyville High School',
    coords: { lat: 42.2813, lng: -87.9538 },
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
    opponentRecord: '2-3',
  },
  {
    id: 5,
    date: '2026-04-07',
    time: '7:00 PM',
    opponent: 'Notre Dame',
    location: 'home',
    venue: 'Prospect High School',
    coords: { lat: 42.0703, lng: -87.9406 },
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
    opponentRecord: '2-2',
  },
  {
    id: 6,
    date: '2026-04-09',
    time: '7:00 PM',
    opponent: 'Fremd',
    location: 'away',
    venue: 'Fremd High School',
    coords: { lat: 42.1055, lng: -88.0516 },
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
    opponentRecord: '1-2',
  },
  {
    id: 7,
    date: '2026-04-13',
    time: '7:00 PM',
    opponent: 'Rolling Meadows',
    location: 'away',
    venue: 'Rolling Meadows High School',
    coords: { lat: 42.0661, lng: -88.0207 },
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
    opponentRecord: '0-1',
  },
  {
    id: 8,
    date: '2026-04-16',
    time: '7:00 PM',
    opponent: 'Hersey',
    location: 'home',
    venue: 'Prospect High School',
    coords: { lat: 42.0703, lng: -87.9406 },
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
    opponentRecord: '2-0',
  },
  {
    id: 9,
    date: '2026-04-21',
    time: '5:00 PM',
    opponent: 'Deerfield',
    location: 'away',
    venue: 'Deerfield High School',
    coords: { lat: 42.1730, lng: -87.8453 },
    knightsScore: null,
    opponentScore: null,
    status: 'upcoming',
    opponentRecord: '0-1',
  },
]
