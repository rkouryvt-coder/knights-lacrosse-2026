import { HeadContent, Scripts, Outlet, Link, createRootRoute } from '@tanstack/react-router'

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
              <img src="/knights-logo.png" alt="Prospect Knights" className="w-10 h-10 object-cover rounded-full" />
              <div>
                <h1 className="text-xl font-bold leading-tight">Prospect Knights</h1>
                <p className="text-xs text-knights-blue tracking-wider uppercase">Lacrosse</p>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium hover:text-knights-blue transition-colors no-underline text-white"
                activeProps={{ className: 'text-sm font-medium text-knights-blue no-underline' }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
              <Link
                to="/schedule"
                className="text-sm font-medium hover:text-knights-blue transition-colors no-underline text-white"
                activeProps={{ className: 'text-sm font-medium text-knights-blue no-underline' }}
              >
                Schedule
              </Link>
              <Link
                to="/roster"
                className="text-sm font-medium hover:text-knights-blue transition-colors no-underline text-white"
                activeProps={{ className: 'text-sm font-medium text-knights-blue no-underline' }}
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
      <footer className="bg-knights-navy text-white shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-semibold text-white">Prospect Knights Lacrosse</span>
              <span>·</span>
              <span>2025–26 Season</span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/phsknightslax/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1.5"
              >
                Instagram
              </a>
              <a
                href="https://fan.hudl.com/usa/il/mt-prospect/organization/4523/prospect-high-school/team/578919/boys-varsity-lacrosse/video"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Hudl
              </a>
              <a
                href="https://www.maxpreps.com/il/mt-prospect/prospect-knights/lacrosse/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                MaxPreps
              </a>
              <Link
                to="/schedule"
                className="text-gray-400 hover:text-white transition-colors text-sm no-underline"
              >
                Schedule
              </Link>
              <Link
                to="/roster"
                className="text-gray-400 hover:text-white transition-colors text-sm no-underline"
              >
                Roster
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
