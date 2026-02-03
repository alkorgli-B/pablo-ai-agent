"use client";

import React from "react";
import Link from "next/link";
import { Activity, TrendingUp, MessageCircle, Users, Twitter, Clock, Bot, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Yellow Glow */}
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic italic text-yellow-500 flex items-center gap-3">
              <Bot className="w-10 h-10" />
              Pablo Control Center
            </h1>
            <p className="text-gray-500 font-medium">Monitoring the empire 24/7</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/" className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-center font-bold">
              ← Back
            </Link>
            <a href="https://twitter.com/pablo26agent" target="_blank" className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-yellow-500 text-black font-black text-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              Live Feed
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Users className="text-yellow-500" />} label="Followers" value="3" trend="+1" />
          <StatCard icon={<MessageCircle className="text-yellow-500" />} label="Total Tweets" value="2" trend="+100%" />
          <StatCard icon={<DollarSign className="text-yellow-500" />} label="Engagement" value="High" trend="Hot" />
          <StatCard icon={<Activity className="text-yellow-500" />} label="Status" value="Online" trend="Stable" color="text-green-500" />
        </div>

        {/* Console Box */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-xs font-mono text-gray-500 tracking-widest uppercase">System_Logs_v4.5.terminal</span>
          </div>
          <div className="space-y-4 font-mono text-sm">
            <p className="text-yellow-500/80 tracking-tight"> {`> Initializing Pablo AI... Success`} </p>
            <p className="text-white/60"> {`> Connecting to X API... Connected`} </p>
            <p className="text-white/60"> {`> Analyzing market sentiment... Success`} </p>
            <p className="text-green-500"> {`> Status: THE KING IS ACTIVE`} </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color = "text-white" }: any) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="p-3 bg-yellow-500/10 rounded-2xl">{icon}</div>
        <span className="text-xs font-bold text-yellow-500 px-2 py-1 bg-yellow-500/10 rounded-lg">{trend}</span>
      </div>
      <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-4xl font-black italic uppercase ${color}`}>{value}</p>
    </div>
  );
}
