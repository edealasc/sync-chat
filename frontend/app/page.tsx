"use client"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { Bot, Globe, Zap, Palette, BarChart3, Rocket } from "lucide-react"

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const impactRef = useRef<HTMLElement>(null)

  useEffect(() => {
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
        className="flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-br from-gray-50 to-white relative overflow-hidden opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] animate-pulse"></div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#a8c69f]/20 to-[#7db3d3]/20 rounded-full blur-xl animate-bounce"></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#7db3d3]/20 to-[#a8c69f]/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 leading-tight mb-8 animate-fade-in-up">
            AI-Powered Customer Support, <br />
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7db3d3] to-[#5a9bc4]">
              Your Website
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Deploy intelligent chatbots that automatically crawl your website and provide instant customer support.
          </p>

          <Button
            className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] hover:to-[#84a678] text-gray-800 font-semibold px-10 py-4 rounded-full text-lg mb-20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 transform animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Get started
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#a8c69f]/20 to-[#7db3d3]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <Image
              src="/dashboard-preview.png"
              alt="SyncChat Dashboard Preview showing chatbot deployment interface with AI agents and customer conversations"
              width={1200}
              height={600}
              className="w-full h-auto rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="bg-gradient-to-br from-white to-gray-50 px-6 py-24 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-semibold px-6 py-3 rounded-full mb-8 shadow-sm">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-8">
              Everything You Need to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7db3d3] to-[#5a9bc4]">
                Deploy Smart Chatbots
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive AI-powered tools designed to create, deploy, and manage intelligent customer support
              chatbots.
            </p>
          </div>

          <div className="relative">
            {/* Central Hub */}
            <div className="flex justify-center mb-20">
              <div className="bg-gradient-to-br from-[#a8c69f] to-[#96b88a] p-10 rounded-3xl text-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 transform group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Bot className="w-10 h-10 text-[#a8c69f]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">SyncChat AI Core</h3>
                <p className="text-gray-700">Central chatbot management hub</p>
              </div>
            </div>

            {/* Connected Features in Orbital Layout */}
            <div className="relative">
              {/* Top Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                {/* Website Crawling - Top Left */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-[#a8c69f] rounded-3xl p-10 h-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Automatic Website Crawling</h3>
                        <p className="text-gray-600 leading-relaxed">
                          AI automatically scans and learns from your website content to provide accurate customer
                          support.
                        </p>
                      </div>
                    </div>

                    {/* Mini Interface Preview */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-500 tracking-wide">PAGES CRAWLED</span>
                        <span className="text-2xl font-bold text-gray-800">247</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-3 text-sm shadow-sm border border-gray-100">
                          /products - Analyzed
                        </div>
                        <div className="bg-white rounded-xl p-3 text-sm shadow-sm border border-gray-100">
                          /support - Indexed
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="absolute -bottom-8 left-1/2 w-px h-16 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2"></div>
                </div>

                {/* Intelligent Responses - Top Right */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-[#7db3d3] rounded-3xl p-10 h-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Intelligent Responses</h3>
                        <p className="text-gray-600 leading-relaxed">
                          AI provides contextual, accurate answers based on your website content and customer queries.
                        </p>
                      </div>
                    </div>

                    {/* Mini Chat Preview */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border border-gray-200">
                      <div className="bg-gradient-to-r from-[#7db3d3] to-[#5a9bc4] text-white rounded-2xl p-3 text-sm mb-3 ml-6 shadow-lg">
                        How can I return an item?
                      </div>
                      <div className="bg-white rounded-2xl p-3 text-sm mr-6 shadow-sm border border-gray-100">
                        You can return items within 30 days. Here's our return policy...
                      </div>
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="absolute -bottom-8 right-1/4 w-px h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
                </div>
              </div>

              {/* Bottom Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform group">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Deployment</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">One-click integration with any website</p>
                    </div>
                  </div>

                  {/* Mini Deployment Preview */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-600">Live on website</span>
                    </div>
                    <div className="text-xs text-gray-500">Deployed: 2 min ago</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-300 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform group">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Monitor conversations and performance</p>
                    </div>
                  </div>

                  {/* Mini Analytics Feed */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 bg-orange-400 h-6 rounded-sm animate-pulse"></div>
                        <span className="text-sm font-medium">24 conversations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 bg-green-500 h-8 rounded-sm animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <span className="text-sm font-medium">95% satisfaction</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-300 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform group">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Branding</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Match your brand colors and style</p>
                    </div>
                  </div>

                  {/* Mini Customization Preview */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end gap-2 h-10 mb-3">
                      <div className="w-3 bg-indigo-400 h-6 rounded-sm animate-bounce"></div>
                      <div
                        className="w-3 bg-indigo-400 h-8 rounded-sm animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-3 bg-indigo-400 h-10 rounded-sm animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-3 bg-indigo-400 h-7 rounded-sm animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Brand colors</div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 800 600">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a8c69f" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#7db3d3" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M400 100 Q200 200 100 400 M400 100 Q600 200 700 400 M400 100 L400 400"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,8"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section
        ref={impactRef}
        className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-24 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 text-sm font-semibold px-6 py-3 rounded-full mb-8 shadow-sm">
              OUR IMPACT
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-8">
              Our AI Chatbots Don't Just Sound <br />
              Smart, They Solve Problems
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform Your Customer Support with Intelligent AI Agents
            </p>
          </div>

          {/* Impact Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Response Time Reduction Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform">
              <h3 className="text-4xl font-light mb-4">85% faster response time</h3>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                Instant Customer Support Responses
                <br />
                Let AI handle customer queries 24/7 so your team can focus on complex issues.
              </p>

              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl relative border border-gray-600">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">SyncBot</div>
                    <div className="text-gray-400">AI Support Agent</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-700 to-gray-600 p-6 rounded-xl mb-6 border border-gray-500">
                  <div className="text-sm font-semibold mb-3 text-gray-300">CUSTOMER QUERY</div>
                  <p className="text-sm leading-relaxed">
                    Hi, I'm having trouble with my order. Can you help me track it and let me know when it will arrive?
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction Card */}
            <div className="bg-gradient-to-br from-[#a8c69f] to-[#96b88a] text-gray-800 p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform">
              <div className="text-5xl font-bold mb-4">96%</div>
              <p className="mb-8 leading-relaxed">
                Customer satisfaction rate —<br />
                Customers love getting instant, accurate answers to their questions.
              </p>

              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="text-sm font-semibold mb-4 text-gray-700">AUGUST 2024</div>
                <div className="grid grid-cols-7 gap-2 text-sm">
                  {Array.from({ length: 31 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        [5, 12, 19, 26].includes(i + 1)
                          ? "bg-white text-gray-800 shadow-lg font-semibold"
                          : "text-gray-600 hover:bg-white/20"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Cost Reduction Card */}
            <div className="bg-gradient-to-br from-[#7db3d3] to-[#5a9bc4] text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform">
              <div className="text-4xl font-bold mb-4">60% Less</div>
              <p className="mb-8 text-lg leading-relaxed">
                Support Ticket Volume
                <br />
                Reduce support costs while improving customer experience with AI-first support.
              </p>

              <div className="bg-white text-gray-800 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold text-lg">Sarah</div>
                  <div className="text-gray-500">Customer</div>
                </div>
              </div>
            </div>

            {/* Setup Time Card */}
            <div className="bg-white border-2 border-gray-200 p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform">
              <div className="flex items-center gap-6 mb-8">
                <div className="text-sm font-semibold text-gray-600">Setup</div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-gray-300"></div>
                <div className="text-sm font-semibold text-gray-600">Training</div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-200"></div>
                <div className="text-sm font-semibold text-gray-600">Deploy</div>
              </div>

              <h3 className="text-3xl font-light text-gray-900 mb-6">5 Minutes to Deploy</h3>
              <p className="text-gray-600 leading-relaxed">
                Go Live in Minutes. From website crawl to chatbot deployment in under 5 minutes. No technical setup
                required.
              </p>
            </div>
          </div>

          {/* Bottom Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex items-center justify-center gap-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              </div>
              <span className="text-gray-700 font-semibold">Handles 90% of customer queries automatically</span>
            </div>

            <div className="flex items-center justify-center gap-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              </div>
              <span className="text-gray-700 font-semibold">24/7 customer support coverage</span>
            </div>

            <div className="flex items-center justify-center gap-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              </div>
              <span className="text-gray-700 font-semibold">Reduced support costs by 70%</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-8">How It Works</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Simple steps to deploy intelligent AI chatbots on your website in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#a8c69f] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 transform">
                <span className="text-3xl font-bold text-gray-800">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Website URL</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Simply provide your website URL and our AI will automatically crawl and learn from your content.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Learns Your Content</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our AI analyzes your pages, products, and support content to understand your business and customers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Deploy & Customize</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Add the chatbot to your website with one line of code and customize it to match your brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-8">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about SyncChat — from how it works with your website to the benefits it brings
              to your business.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-6">
            <AccordionItem
              value="item-1"
              className="border-2 border-gray-200 rounded-2xl px-8 hover:border-[#a8c69f] transition-colors duration-300"
            >
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline py-8">
                What is SyncChat and how can it benefit my website?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-8 leading-relaxed text-lg">
                SyncChat is an AI-powered customer support platform that automatically crawls your website and creates
                intelligent chatbots. It learns from your content to provide accurate, instant responses to customer
                queries 24/7, reducing support costs while improving customer satisfaction.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-2 border-gray-200 rounded-2xl px-8 hover:border-[#7db3d3] transition-colors duration-300"
            >
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline py-8">
                How does SyncChat integrate with my existing website?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-8 leading-relaxed text-lg">
                SyncChat integrates seamlessly with any website using a simple JavaScript snippet. No complex setup
                required - just add one line of code and your AI chatbot is live and ready to help customers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-2 border-gray-200 rounded-2xl px-8 hover:border-gray-400 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline py-8">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-8 leading-relaxed text-lg">
                Getting started is simple. Sign up, enter your website URL, and our AI will crawl your site and create a
                custom chatbot in minutes. You can then customize the appearance and deploy it to your website
                instantly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-16 md:p-20 overflow-hidden shadow-2xl mx-8">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
              <div
                className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent transform skew-x-12 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform skew-y-12 animate-pulse"
                style={{ animationDelay: "3s" }}
              ></div>
            </div>

            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#a8c69f]/20 to-[#7db3d3]/20 rounded-full blur-2xl animate-bounce"></div>
            <div
              className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-[#7db3d3]/20 to-[#a8c69f]/20 rounded-full blur-2xl animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>

            <div className="relative z-10 text-center">
              <div className="inline-block bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 text-sm font-semibold px-6 py-3 rounded-full mb-10 shadow-lg">
                START YOUR FREE TRIAL
              </div>

              <h2 className="text-4xl md:text-6xl font-light text-white leading-tight mb-8">
                Deploy Smart Chatbots in Minutes, Not Months
              </h2>

              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform Your Customer Support with AI That Actually Understands Your Business
              </p>

              <Button className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] hover:to-[#84a678] text-gray-800 font-semibold px-12 py-4 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 transform">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-white to-gray-50 border-t border-gray-200 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">SyncChat</div>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                AI-powered customer support chatbots that automatically learn from your website content.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110 transform"
                >
                  <span className="sr-only">Twitter</span>
                  <div className="w-8 h-8 bg-gray-400 rounded-lg hover:bg-gray-600 transition-colors duration-200"></div>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110 transform"
                >
                  <span className="sr-only">LinkedIn</span>
                  <div className="w-8 h-8 bg-gray-400 rounded-lg hover:bg-gray-600 transition-colors duration-200"></div>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Product</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-lg">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-lg">© 2024 SyncChat. All rights reserved.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-lg">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-lg">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-lg">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
