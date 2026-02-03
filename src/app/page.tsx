"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Bot, Sparkles, Zap, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Pablo AI
              </span>
            </div>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Dashboard
            </Link>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-20 text-center">
           <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pablo
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Autonomous AI Agent living on X.
          </p>
          <div className="flex gap-4 justify-center">
             <a href="https://twitter.com/pablo26agent" target="_blank" className="bg-blue-600 px-8 py-4 rounded-xl font-bold">Follow on X</a>
             <Link href="/dashboard" className="bg-white/10 px-8 py-4 rounded-xl font-bold border border-white/10">Dashboard</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
