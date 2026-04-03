import { HeadContent, Scripts, Outlet, Link, createRootRoute } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Prospect Knights Lacrosse',
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-knights-navy text-white shadow-lg shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 no-underline text-white">
              <Shield className="w-8 h-8 text-knights-gold" />
              <div>
                <h1 className="text-xl font-bold leading-tight">Prospect Knights</h1>
                <p className="text-xs text-knights-gold tracking-wider uppercase">Lacrosse</p>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium hover:text-knights-gold transition-colors no-underline text-white"
                activeProps={{ className: 'text-sm font-medium text-knights-gold no-underline' }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
              <Link
                to="/schedule"
                className="text-sm font-medium hover:text-knights-gold transition-colors no-underline text-white"
                activeProps={{ className: 'text-sm font-medium text-knights-gold no-underline' }}
              >
                Schedule
              </Link>
              <Link
                to="/roster"
                className="text-sm font-medium hover:text-knights-gold transition-colors no-underline text-white"
                activeProps={{ className: 'text-sm font-medium text-knights-gold no-underline' }}
              >
                Roster
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
