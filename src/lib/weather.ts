import { createServerFn } from '@tanstack/react-start'

export interface GameWeather {
  tempF: number
  condition: string
  emoji: string
  rainChance: number
}

// WMO weather code → { condition, emoji }
function describeCode(code: number): { condition: string; emoji: string } {
  if (code === 0) return { condition: 'Clear', emoji: '☀️' }
  if (code <= 2) return { condition: 'Partly Cloudy', emoji: '⛅' }
  if (code === 3) return { condition: 'Overcast', emoji: '☁️' }
  if (code <= 48) return { condition: 'Foggy', emoji: '🌫️' }
  if (code <= 57) return { condition: 'Drizzle', emoji: '🌦️' }
  if (code <= 67) return { condition: 'Rain', emoji: '🌧️' }
  if (code <= 77) return { condition: 'Snow', emoji: '🌨️' }
  if (code <= 82) return { condition: 'Rain Showers', emoji: '🌧️' }
  return { condition: 'Thunderstorm', emoji: '⛈️' }
}

export const getGameWeather = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: { lat: number; lng: number; date: string; time: string } }): Promise<GameWeather | null> => {
    try {
      const { lat, lng, date, time } = data
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,weathercode&temperature_unit=fahrenheit&timezone=America%2FChicago&start_date=${date}&end_date=${date}`
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
      if (!res.ok) return null
      const json = await res.json()

      // Parse game hour from time string (e.g. "6:45 PM" → 18)
      const [hourStr] = time.split(':')
      const isPM = time.toLowerCase().includes('pm')
      let hour = parseInt(hourStr) % 12
      if (isPM) hour += 12

      const temps: number[] = json.hourly?.temperature_2m ?? []
      const rainChances: number[] = json.hourly?.precipitation_probability ?? []
      const codes: number[] = json.hourly?.weathercode ?? []

      const tempF = Math.round(temps[hour] ?? temps[Math.min(hour, temps.length - 1)])
      const rainChance = rainChances[hour] ?? 0
      const { condition, emoji } = describeCode(codes[hour] ?? 0)

      return { tempF, condition, emoji, rainChance }
    } catch {
      return null
    }
  },
)
