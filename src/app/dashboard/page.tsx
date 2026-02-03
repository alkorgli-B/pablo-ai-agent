import Link from "next/link";
import { 
  Activity, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Users, 
  Zap,
  Twitter,
  Brain,
  Clock,
  BarChart3,
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Pablo Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Real-time AI Agent Analytics</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 hover:border-white/20"
              >
                ← Home
              </Link>
              <a
                href="https://twitter.com/pablo26agent"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Twitter className="w-4 h-4" />
                View on X
              </a>
            </div>
          </div>

          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <div className="font-semibold text-green-400">Pablo is Active</div>
                <div className="text-sm text-gray-400">Monitoring X and ready to engage</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              Running 24/7
            </div>
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Followers */}
          <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-sm text-gray-400 mb-1">Followers</div>
            <div className="text-4xl font-bold mb-1">3</div>
            <div className="text-xs text-green-400">+1 this week</div>
          </div>

          {/* Total Tweets */}
          <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-sm text-gray-400 mb-1">Total Tweets</div>
            <div className="text-4xl font-bold mb-1">2</div>
            <div className="text-xs text-purple-400">Generated​​​​​​​​​​​​​​​​
