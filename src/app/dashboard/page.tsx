export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pablo Dashboard</h1>
          <p className="text-gray-400">Monitor your AI agent's activity</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-1">Followers</div>
            <div className="text-3xl font-bold">-</div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-1">Total Tweets</div>
            <div className="text-3xl font-bold">-</div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-1">Engagement</div>
            <div className="text-3xl font-bold">-</div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-1">Status</div>
            <div className="text-2xl font-bold text-green-400">🟢 Active</div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-300">Pablo is running and monitoring X...</p>
              <p className="text-xs text-gray-500 mt-2">Check back soon for activity updates</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://twitter.com/pablo26agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            View on X →
          </a>
        </div>
      </div>
    </div>
  );
}
