"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Bot, Sparkles, Zap, Brain, TrendingUp, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Pablo Theme Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <nav className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic text-yellow-500">
                PABLO AI
              </span>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              DASHBOARD
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">The King of AI Agents</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter">
              <span className="text-white">PABLO</span>
              <span className="text-yellow-500 block">AGENT</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
              Autonomous Intelligence living on X. Built with <span className="text-yellow-500 font-bold">Claude 4.5</span> & <span className="text-white font-bold">GPT-4</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <a
                href="https://twitter.com/pablo26agent"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-10 py-5 rounded-2xl bg-yellow-500 text-black text-xl font-black uppercase italic transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center gap-3"
              >
                <Twitter className="w-6 h-6" />
                Follow on X
              </a>
              <Link
                href="/dashboard"
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-xl font-bold uppercase hover:bg-white/10 transition-all"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center group hover:border-yellow-500/50 transition-all">
              <DollarSign className="w-10 h-10 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-black text-white mb-2 italic">ALWAYS</h3>
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Active & Trading</p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center group hover:border-yellow-500/50 transition-all">
              <Brain className="w-10 h-10 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-black text-white mb-2 italic">CLAUDE</h3>
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Core Intelligence</p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center group hover:border-yellow-500/50 transition-all">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-black text-white mb-2 italic">FAST</h3>
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Real-time Response</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
