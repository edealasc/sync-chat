"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { isThereToken } from "@/lib/api"
import { Bot, Globe, BarChart3, ArrowRight, Sparkles, MessageCircle, Users, Clock, MessageSquare } from "lucide-react"

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const impactRef = useRef<HTMLElement>(null)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setHasToken(isThereToken())

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    const sections = [heroRef.current, featuresRef.current, impactRef.current]
    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Handler for Get Started buttons
  const handleGetStarted = () => {
    window.location.href = hasToken ? "/dashboard" : "/signup"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">SyncChat</div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105 transform"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105 transform"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105 transform"
          >
            Pricing
          </a>
          <Button className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] hover:to-[#84a678] text-gray-800 font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
            Get started
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_0)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30"></div>

          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-[#a8c69f]/10 to-[#7db3d3]/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#7db3d3]/10 to-[#a8c69f]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#a8c69f]/5 to-[#7db3d3]/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16 relative">
            {/* Floating geometric shapes around the title */}
            <div
              className="absolute -top-12 -left-8 w-6 h-6 bg-gradient-to-br from-[#a8c69f] to-[#7db3d3] rounded-full opacity-60 animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            ></div>
            <div
              className="absolute -top-8 right-12 w-4 h-4 bg-[#7db3d3] rotate-45 opacity-50 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-16 -right-16 w-8 h-8 border-2 border-[#a8c69f] rounded-full opacity-40 animate-spin"
              style={{ animationDuration: "8s" }}
            ></div>
            <div
              className="absolute top-32 -left-12 w-5 h-5 bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] rounded-sm opacity-60 animate-bounce"
              style={{ animationDelay: "2s", animationDuration: "4s" }}
            ></div>

            {/* Floating mini cards */}
            <div
              className="absolute -top-6 left-24 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg opacity-80 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-[#a8c69f]" />
                <span className="text-xs font-medium text-gray-700">AI Chat</span>
              </div>
            </div>

            <div
              className="absolute top-20 right-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg opacity-80 animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-[#7db3d3]" />
                <span className="text-xs font-medium text-gray-700">Analytics</span>
              </div>
            </div>

            <div
              className="absolute top-48 -left-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg opacity-80 animate-float"
              style={{ animationDelay: "2.5s" }}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-[#a8c69f]" />
                <span className="text-xs font-medium text-gray-700">Multi-Site</span>
              </div>
            </div>

            {/* Floating particles */}
            <div
              className="absolute -top-4 left-16 w-2 h-2 bg-[#a8c69f] rounded-full opacity-60 animate-ping"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute top-12 right-20 w-1.5 h-1.5 bg-[#7db3d3] rounded-full opacity-50 animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-40 left-32 w-2 h-2 bg-[#a8c69f] rounded-full opacity-40 animate-ping"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-28 -right-4 w-1 h-1 bg-[#7db3d3] rounded-full opacity-60 animate-ping"
              style={{ animationDelay: "3s" }}
            ></div>

            {/* Glowing orbs around text */}
            <div
              className="absolute top-8 left-8 w-12 h-12 bg-gradient-to-br from-[#a8c69f]/20 to-transparent rounded-full blur-sm animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute top-24 right-16 w-16 h-16 bg-gradient-to-br from-[#7db3d3]/15 to-transparent rounded-full blur-md animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-44 left-20 w-10 h-10 bg-gradient-to-br from-[#a8c69f]/25 to-transparent rounded-full blur-sm animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Sparkles className="w-4 h-4 text-[#a8c69f] group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-semibold text-gray-700">AI-Powered Customer Support</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-light text-gray-900 leading-[0.9] mb-8 tracking-tight">
              Deploy Smart
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                AI Chatbots
              </span>
              <br />
              Across Sites
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Create intelligent chatbots that learn from your website content and provide accurate customer support.
              Manage multiple sites, track performance, and customize experiences from one powerful dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Button
                className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] hover:to-[#84a678] text-gray-800 font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group"
                onClick={handleGetStarted}
              >
                Get started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

            </div>
          </div>

          {/* Bento Grid Features */}

        </div>
      </main>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="bg-gradient-to-br from-white to-gray-50 px-6 py-24 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#a8c69f]" />
              <span className="text-sm font-semibold text-gray-700">Powerful Features</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
              Everything You Need for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                Smart Support
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge technology with intuitive design to deliver exceptional
              customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Large Card */}
            <div className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-3xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 flex-shrink-0">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent AI Training</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our AI automatically crawls and learns from your website content, documentation, and knowledge base
                    to provide accurate, contextual responses.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                      <div className="text-sm font-semibold text-gray-700 mb-1">Website Crawling</div>
                      <div className="text-xs text-gray-600">Automatic content discovery</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#a8c69f]/10 to-[#96b88a]/10 rounded-2xl p-4 border border-[#a8c69f]/20">
                      <div className="text-sm font-semibold text-gray-700 mb-1">Smart Learning</div>
                      <div className="text-xs text-gray-600">Contextual understanding</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">24/7 Availability</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Never miss a customer inquiry. Your AI assistant works around the clock to provide instant support.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Clock className="w-4 h-4" />
                <span>Always online, always ready</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Track conversations, measure satisfaction, and optimize performance with detailed insights.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-bold text-gray-900">&lt; 2s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Easy Integration</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Add to any website with a single line of code. No complex setup required.
              </p>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <code className="text-xs text-green-400 font-mono">npm install syncchat</code>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-language Support</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Serve customers globally with automatic language detection and translation.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">EN</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">ES</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">FR</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">+50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Site Management Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Globe className="w-4 h-4 text-[#a8c69f]" />
              <span className="text-sm font-semibold text-gray-700">Multi-Site Management</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
              One Dashboard
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                Multiple Sites
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage chatbots across all your domains from a single, unified dashboard. Scale your AI support
              effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Dashboard Preview */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400 ml-2">SyncChat Dashboard</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#a8c69f]/20 to-[#96b88a]/20 rounded-xl p-4 border border-[#a8c69f]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">ecommerce-store.com</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs text-white/70">247 conversations today</div>
                  </div>

                  <div className="bg-gradient-to-r from-[#7db3d3]/20 to-[#5a9bc4]/20 rounded-xl p-4 border border-[#7db3d3]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">support-docs.com</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs text-white/70">89 conversations today</div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-xl p-4 border border-gray-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">blog.company.com</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs text-white/70">156 conversations today</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Centralized Control</h3>
                    <p className="text-sm text-gray-600">Manage all domains from one place</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Deploy and manage chatbots across unlimited domains with unified settings, branding, and performance
                  monitoring.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Cross-Domain Analytics</h3>
                    <p className="text-sm text-white/80">Unified reporting and insights</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Get comprehensive analytics across all your websites with comparative performance metrics and trends.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#96b88a] to-[#84a678] rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Shared Knowledge Base</h3>
                    <p className="text-sm text-gray-600">Consistent responses everywhere</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Share knowledge and training data across all your chatbots while maintaining site-specific
                  customizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Analytics Section */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <BarChart3 className="w-4 h-4 text-[#7db3d3]" />
              <span className="text-sm font-semibold text-gray-700">Real-Time Analytics</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
              Data-Driven
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                Insights
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Monitor performance, track satisfaction, and optimize your chatbot with comprehensive real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chats per Day Chart */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Daily Conversations</h3>
                  <p className="text-sm text-gray-600">Last 7 days</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Mon</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Tue</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-5/6"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">289</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Wed</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-full"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">312</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Thu</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-4/5"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">267</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Fri</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-5/6"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">298</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[#a8c69f]/10 to-[#7db3d3]/10 rounded-2xl border border-[#a8c69f]/20">
                <div className="text-2xl font-bold text-gray-900">1,413</div>
                <div className="text-sm text-gray-600">Total this week</div>
              </div>
            </div>

            {/* User Satisfaction Chart */}
            <div className="bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Satisfaction Score</h3>
                  <p className="text-sm text-white/80">Over time</p>
                </div>
              </div>

              <div className="relative h-32 mb-6">
                <svg className="w-full h-full" viewBox="0 0 200 80">
                  <path
                    d="M 10 60 Q 50 40 100 45 T 190 35"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    className="opacity-80"
                  />
                  <path
                    d="M 10 60 Q 50 40 100 45 T 190 35 L 190 80 L 10 80 Z"
                    fill="url(#gradient)"
                    className="opacity-30"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">96%</div>
                  <div className="text-xs text-white/80">Current</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-xs text-white/80">Last Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">+2%</div>
                  <div className="text-xs text-white/80">Trend</div>
                </div>
              </div>
            </div>

            {/* Trending Questions */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#96b88a] to-[#84a678] rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Trending Questions</h3>
                  <p className="text-sm text-gray-600">Most asked today</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Return policy</span>
                    <span className="text-xs bg-[#a8c69f] text-white px-2 py-1 rounded-full">47</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-1 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Shipping info</span>
                    <span className="text-xs bg-[#7db3d3] text-white px-2 py-1 rounded-full">32</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-1 rounded-full w-3/4"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Product specs</span>
                    <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">28</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-1 rounded-full w-2/3"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Account help</span>
                    <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full">19</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-1 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Personalization Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#a8c69f]" />
              <span className="text-sm font-semibold text-gray-700">Smart Personalization</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
              Adaptive
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                Intelligence
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your chatbot automatically adapts its tone and appearance based on context, creating personalized
              experiences for every visitor.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Tone Examples */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Context-Aware Tone</h3>
                    <p className="text-sm text-gray-600">Adapts to page and user intent</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 mb-2">PROFESSIONAL TONE • Support Page</div>
                    <p className="text-sm text-gray-700">
                      "I'd be happy to help you resolve this technical issue. Let me walk you through the
                      troubleshooting steps."
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                    <div className="text-xs font-semibold text-green-700 mb-2">CASUAL TONE • Blog Page</div>
                    <p className="text-sm text-gray-700">
                      "Hey there! 👋 Looking for more info about this topic? I can point you to some great resources!"
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-700 mb-2">SALES TONE • Product Page</div>
                    <p className="text-sm text-gray-700">
                      "This product is perfect for your needs! Would you like to see how it compares to our other
                      options?"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Theme Customization */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Theme Customization</h3>
                    <p className="text-sm text-white/80">Match your brand perfectly</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-sm font-medium mb-3">Color Themes</div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                      <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                      <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-sm font-medium mb-3">Position</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                      <div className="w-4 h-4 bg-white rounded"></div>
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-sm font-medium mb-3">Custom Branding</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold">L</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/80">Upload your logo</div>
                      <div className="text-xs text-white/60">Maintain brand consistency</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#96b88a] to-[#84a678] rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Smart Behavior</h3>
                    <p className="text-sm text-gray-600">Learns from interactions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Greeting Style</span>
                    <span className="text-xs bg-[#a8c69f] text-white px-2 py-1 rounded-full">Auto</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Response Length</span>
                    <span className="text-xs bg-[#7db3d3] text-white px-2 py-1 rounded-full">Adaptive</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Emoji Usage</span>
                    <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">Context</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section
        ref={impactRef}
        className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-24 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      ></section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <ArrowRight className="w-4 h-4 text-[#7db3d3]" />
              <span className="text-sm font-semibold text-gray-700">Simple Process</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
              How It
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                Works
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get your AI chatbot up and running in minutes with our streamlined three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-px bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] transform -translate-y-1/2 z-0"></div>
            <div className="hidden lg:block absolute top-1/2 right-1/3 w-1/3 h-px bg-gradient-to-r from-[#7db3d3] to-[#a8c69f] transform -translate-y-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-3xl mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">1</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Connect Your Website</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Simply provide your website URL and our AI will automatically crawl and analyze your content,
                documentation, and knowledge base.
              </p>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-[#a8c69f]" />
                  <span className="text-sm font-medium text-gray-700">Website Analysis</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] h-2 rounded-full w-full animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Scanning 247 pages...</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-3xl mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">2</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">AI Training</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Our advanced AI processes your content to understand your business, products, and services for accurate
                customer support.
              </p>

              <div className="space-y-3">
                <div className="bg-gradient-to-br from-[#a8c69f]/10 to-[#96b88a]/10 rounded-2xl p-3 border border-[#a8c69f]/20">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#a8c69f]" />
                    <span className="text-sm font-medium text-gray-700">Learning product catalog...</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#7db3d3]/10 to-[#5a9bc4]/10 rounded-2xl p-3 border border-[#7db3d3]/20">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#7db3d3]" />
                    <span className="text-sm font-medium text-gray-700">Training conversation patterns...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#96b88a] to-[#84a678] rounded-3xl mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">3</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Deploy & Go Live</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Add a single line of code to your website and your AI chatbot is ready to assist customers instantly.
              </p>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400 ml-2">index.html</span>
                </div>
                <code className="text-sm text-green-400 font-mono block">{'<script src="syncchat.js"></script>'}</code>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Button
              className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] hover:to-[#84a678] text-gray-800 font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group"
              onClick={handleGetStarted}
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <p className="text-sm text-gray-600 mt-4">No credit card required • 5-minute setup</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <MessageCircle className="w-4 h-4 text-[#7db3d3]" />
              <span className="text-sm font-semibold text-gray-700">Frequently Asked Questions</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
              Got
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8c69f] to-[#7db3d3] font-medium">
                Questions?
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to the most common questions about SyncChat and how it can transform your customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-bold">?</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">How quickly can I set up SyncChat?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    SyncChat can be deployed in under 5 minutes. Simply provide your website URL, let our AI crawl and
                    learn from your content, then add one line of code to your site. Your intelligent chatbot will be
                    ready to assist customers immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">How accurate are the AI responses?</h3>
                  <p className="text-white/90 leading-relaxed">
                    Our AI achieves 96% customer satisfaction by learning directly from your website content,
                    documentation, and knowledge base. It provides contextually accurate responses and can escalate
                    complex queries to human agents when needed.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Can I customize the chatbot's appearance?</h3>
                  <p className="text-white/90 leading-relaxed">
                    SyncChat offers full customization options including colors, fonts, positioning, and branding. You
                    can match your website's design perfectly while maintaining a professional, modern appearance.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What analytics and insights do I get?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get comprehensive analytics including conversation volume, response times, customer satisfaction
                    scores, common queries, and performance metrics. Track your chatbot's impact on customer support
                    efficiency in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Does it support multiple languages?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! SyncChat supports over 50 languages with automatic detection and translation. Your chatbot can
                    communicate with customers in their preferred language, expanding your global reach effortlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Is there a free trial available?</h3>
                  <p className="text-white/90 leading-relaxed">
                    Yes! Start with our free trial that includes full access to all features for 14 days. No credit card
                    required. Experience the power of AI-driven customer support risk-free.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <Button
              variant="outline"
              className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-2xl text-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 transform"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-white to-gray-50 border-t border-gray-200 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">SyncChat</div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Transform your customer support with AI-powered chatbots that understand your business and provide
                instant, accurate responses 24/7.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <span className="text-white font-bold text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Product</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Status Page
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 mb-12 shadow-xl">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                Get the latest updates on new features, integrations, and AI advancements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a8c69f] focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
                <Button className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] hover:to-[#84a678] text-gray-800 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200">
            <div className="text-gray-600 mb-4 md:mb-0">© 2024 SyncChat. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
