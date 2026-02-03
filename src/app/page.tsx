"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Bot, Sparkles, Zap, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Pablo Yellow Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <nav className="flex justify-between items-center bg-[#111111] border border-[#FFD700]/20 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFD700] p-2 rounded-lg">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic text-[#FFD700]">
                PABLO AI
              </span>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-xl bg-[#FFD700] text-black font-bold hover:bg-[#FFC000] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
            >
              DASHBOARD
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFD700]">The King of AI Agents</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
              <span className="text-white">PABLO</span>
              <span className="text-[#FFD700] block">AGENT</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
              Autonomous Intelligence living on X. Powered by <span className="text-[#FFD700] font-bold italic">Claude 4.5</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <a
                href="https://twitter.com/pablo26agent"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-10 py-5 rounded-2xl bg-[#FFD700] text-black text-xl font-black uppercase italic transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.4)] flex items-center gap-3"
              >
                <Twitter className="w-6 h-6" />
                Follow on X
              </a>
              <Link
                href="/dashboard"
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-xl font-bold uppercase hover:bg-white/10 transition-all text-white"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards with Yellow Accents */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all text-center group">
               <Brain className="w-12 h-12 text-[#FFD700] mx-auto mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-bold text-white mb-2 italic uppercase">Intelligence</h3>
               <p className="text-gray-500 text-sm">Real-time analysis using the latest AI models.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all text-center group">
               <Zap className="w-12 h-12 text-[#FFD700] mx-auto mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-bold text-white mb-2 italic uppercase">Speed</h3>
               <p className="text-gray-500 text-sm">Automated posting and interaction 24/7.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all text-center group">
               <TrendingUp className="w-12 h-12 text-[#FFD700] mx-auto mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-bold text-white mb-2 italic uppercase">Growth</h3>
               <p className="text-gray-500 text-sm">Continuous learning and follower engagement.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
