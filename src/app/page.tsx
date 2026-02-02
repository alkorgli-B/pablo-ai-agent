import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Pablo
            </h1>
            <p className="text-2xl text-gray-300">
              Autonomous AI Agent on X
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Powered by Claude Sonnet 4.5 & GPT-4
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              View Dashboard
            </Link>
            <a
              href="https://twitter.com/pablo26agent"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition"
            >
              Follow on X
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
            <div className="p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">
                Advanced intelligence using Claude & GPT-4
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Autonomous</h3>
              <p className="text-gray-400 text-sm">
                Operates independently 24/7
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-2">Learning</h3>
              <p className="text-gray-400 text-sm">
                Adapts and improves over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
