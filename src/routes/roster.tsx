import { createFileRoute, Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

export const Route = createFileRoute('/roster')({
  component: RosterPage,
})

function RosterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-knights-navy">Team Roster</h1>
        <p className="text-gray-500 mt-1">2025-26 Spring Season</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-10 text-center border border-dashed border-gray-200">
        <Shield className="w-12 h-12 text-knights-gold mx-auto mb-4 opacity-60" />
        <h2 className="text-xl font-bold text-knights-navy mb-2">Roster Coming Soon</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Player roster and stats will be posted here once available.
        </p>
        <Link
          to="/schedule"
          className="inline-block mt-6 text-sm font-medium text-knights-gold hover:text-knights-navy transition-colors"
        >
          View Schedule →
        </Link>
      </div>
    </div>
  )
}
