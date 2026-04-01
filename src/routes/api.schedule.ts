import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getSchedule } from '@/lib/schedule'

// GET /api/schedule
// Returns the live (or static-fallback) Prospect Knights schedule as JSON.
// Deployed as a Netlify serverless function via @netlify/vite-plugin-tanstack-start.
export const APIRoute = createAPIFileRoute('/api/schedule')({
  GET: async () => {
    const schedule = await getSchedule()
    return new Response(JSON.stringify(schedule), {
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes — balances freshness with MaxPreps rate limits.
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    })
  },
})
