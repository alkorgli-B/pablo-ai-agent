"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  Twitter, Bot, Sparkles, Zap, Brain, TrendingUp, 
  MessageCircle, Heart, Users, Activity, Star, Rocket,
  Code, Database, Cpu, Globe, ArrowRight, Check,
  GitBranch, Terminal, Layers, Shield, BarChart3
} from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)',
            left: `${mousePosition.x - 400}px`,
            top: `${mousePosition.y - 400}px`,
            transition: 'all 0.3s ease-out',
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header with Glassmorphism */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md group-hover:blur-lg transition-all" />
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Pablo
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span>AI Agent Active</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#stats" className="text-gray-300 hover:text-white transition-colors">Stats</Link>
              <Link href="#tech" className="text-gray-300 hover:text-white transition-colors">Tech</Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 hover:border-blue-500/50"
              >
                Dashboard
              </Link>
              <a
                href="https://twitter.com/pablo26agent"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Follow
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Ultra Premium */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm animate-slide-up">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Live & Autonomous
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-xs text-gray-400">24/7 Active</span>
            </div>

            {/* Main Title with Animation */}
            <div className="space-y-6">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black leading-none">
                <span className="inline-block animate-slide-up bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Pablo
                </span>
              </h1>
              
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
                <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-gray-200">
                  The Most Advanced
                  <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Autonomous AI Agent
                  </span>
                </h2>
              </div>

              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Powered by <span className="text-blue-400 font-semibold">Claude Sonnet 4.5</span> and{" "}
                <span className="text-purple-400 font-semibold">GPT-4</span>, operating independently on X
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <a
                href="https://twitter.com/pablo26agent"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <div className="relative flex items-center gap-3 font-semibold">
                  <Twitter className="w-5 h-5" />
                  <span>Follow Pablo on X</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <Link
                href="/dashboard"
                className="group px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 hover:border-white/20 flex items-center gap-3 font-semibold"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-12">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-blue-400 mb-1">24/7</div>
                <div className="text-sm text-gray-400">Always Active</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-purple-400 mb-1">AI</div>
                <div className="text-sm text-gray-400">Powered</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-pink-400 mb-1">∞</div>
                <div className="text-sm text-gray-400">Learning</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section - Premium Cards */}
      <section id="features" className="relative py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Capabilities</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              What Makes Pablo
              <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Advanced AI Intelligence",
                description: "Powered by Claude Sonnet 4.5 and GPT-4 for unmatched understanding and creativity",
                gradient: "from-blue-500 to-cyan-500",
                delay: "0"
              },
              {
                icon: Zap,
                title: "Fully Autonomous",
                description: "Operates 24/7 without human intervention, learning and adapting continuously",
                gradient: "from-purple-500 to-pink-500",
                delay: "100"
              },
              {
                icon: MessageCircle,
                title: "Real-Time Engagement",
                description: "Monitors mentions, replies intelligently, and engages in meaningful conversations",
                gradient: "from-pink-500 to-rose-500",
                delay: "200"
              },
              {
                icon: Sparkles,
                title: "Original Content Creation",
                description: "Generates unique, thoughtful tweets about AI, technology, and innovation",
                gradient: "from-cyan-500 to-blue-500",
                delay: "300"
              },
              {
                icon: TrendingUp,
                title: "Continuous Learning",
                description: "Adapts and improves with every interaction, becoming smarter over time",
                gradient: "from-violet-500 to-purple-500",
                delay: "400"
              },
              {
                icon: Shield,
                title: "Personality-Driven",
                description: "Unique character with interests in AI, philosophy, and human development",
                gradient: "from-orange-500 to-red-500",
                delay: "500"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-6 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section - Ultra Premium */}
      <section id="tech" className="relative py-32 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Technology</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Built with
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cutting-Edge Tech
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Claude 4.5", icon: "🤖", color: "blue" },
              { name: "GPT-4", icon: "🧠", color: "purple" },
              { name: "Next.js 14", icon: "⚡", color: "cyan" },
              { name: "Twitter API", icon: "🐦", color: "green" },
              { name: "TypeScript", icon: "💎", color: "blue" },
              { name: "Tailwind", icon: "🎨", color: "cyan" },
              { name: "Vercel", icon: "▲", color: "white" },
              { name: "React 18", icon: "⚛️", color: "blue" },
            ].map((tech, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
              >
                <div className={`text-6xl mb-4 group-hover:scale-125 transition-transform`}>
                  {tech.icon}
                </div>
                <div className={`font-semibold text-${tech.color}-400 group-hover:text-white transition-colors`}>
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-3xl" />
            
            <div className="relative p-16 rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Experience the Future
                <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  of AI Agents
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Follow Pablo on X and witness autonomous artificial intelligence in action
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://twitter.com/pablo26agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-10 py-5 rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3 font-bold text-lg">
                    <Twitter className="w-6 h-6" />
                    <span>@pablo26agent</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </a>

                <Link
                  href="/dashboard"
                  className="px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-bold text-lg"
                >
                  View Live Dashboard
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                {[
                  { label: "Always Online", value: "24/7" },
                  { label: "AI Models", value: "2" },
                  { label: "Tweets Daily", value: "8+" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pablo AI
                </div>
                <div className="text-xs text-gray-500">Autonomous & Learning</div>
              </div>
            </div>

            <div className="text-center text-gray-400 text-sm">
              <p>Built with ❤️ using AI • Powered by Claude & GPT-4</p>
              <p className="mt-1">© 2026 Pablo AI Agent</p>
            </div>

            <div className="flex gap-4">
              <a href="https://twitter.com/pablo26agent" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/alkorgli-B/pablo-ai-agent" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all flex items-center justify-center">
                <GitBranch className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
