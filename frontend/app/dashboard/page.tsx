"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import {
  Bot,
  Globe,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  Pause,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, Label } from "recharts"

// Add this helper function before your Dashboard component
function computeSatisfaction(messages: any[]) {
  if (!messages || messages.length === 0) return null
  let satisfied = 0, total = 0
  messages.forEach(msg => {
    if (msg.satisfaction === 1) satisfied++
    if (msg.satisfaction !== -1) total++
  })
  if (total === 0) return null
  return Math.round((satisfied / total) * 100)
}

export default function Dashboard() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChatbot, setSelectedChatbot] = useState(null)
  const [recentConversations, setRecentConversations] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalBot, setModalBot] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversationModalOpen, setConversationModalOpen] = useState(false)
  const [conversationVolume, setConversationVolume] = useState([])
  const [responseTimes, setResponseTimes] = useState({})
  const [selectedRange, setSelectedRange] = useState(7)
  const [tab, setTab] = useState("chatbots")
  const [analyticsLoading, setAnalyticsLoading] = useState(false) // NEW

  // Fetch bots and static info only once
  useEffect(() => {
    async function fetchBots() {
      setLoading(true)
      const res = await apiRequest(`api/user/dashboard/?days=90`, "GET", undefined, { auth: true }) // fetch with max range for bots/convos
      if (res.bots) {
        setBots(res.bots)
        if (res.bots.length > 0) setSelectedChatbot(res.bots[0].id)
        const allConvos = res.bots.flatMap(bot =>
          (bot.recent_conversations || []).map(convo => ({
            ...convo,
            bot: bot.chatbot_name,
            bot_id: bot.id,
            website_url: bot.website_url,
          }))
        )
        setRecentConversations(allConvos)
      }
      setLoading(false)
    }
    fetchBots()
  }, [])

  // Fetch analytics data when selectedRange changes
  useEffect(() => {
    async function fetchAnalytics() {
      setAnalyticsLoading(true)
      const res = await apiRequest(`api/user/dashboard/?days=${selectedRange}`, "GET", undefined, { auth: true })
      setConversationVolume(res.conversation_volume || [])
      setResponseTimes(res.response_times || {})
      setAnalyticsLoading(false)
    }
    fetchAnalytics()
  }, [selectedRange])

  if (loading) return <div>Loading...</div>

  // Prepare data for response times chart
  const responseTimesData = bots.map(bot => ({
    name: bot.chatbot_name,
    response: responseTimes[bot.id] ? Number(responseTimes[bot.id].toFixed(2)) : 0,
  }))

  // Custom tooltip for better readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 text-xs">
          <div className="font-semibold text-gray-800">{label}</div>
          {payload.map((entry: any, idx: number) => (
            <div key={idx} className="text-gray-600">
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  // Compute satisfaction for each bot
  const botsWithSatisfaction = bots.map(bot => {
    // Flatten all messages from recent conversations
    const allMessages = (bot.recent_conversations || []).flatMap((c: any) => c.messages || [])
    const satisfaction = computeSatisfaction(allMessages)
    return { ...bot, satisfaction }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#a8c69f] to-[#96b88a] rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">SyncChat Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your AI chatbots</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-[#a8c69f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2,526</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-[#7db3d3]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1.1s</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                -0.3s improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Satisfaction Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#a8c69f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +2% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Chatbots</CardTitle>
              <Bot className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="chatbots" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Your Chatbots</h2>
              <Button className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] to-[#84a577] text-white">
                <Bot className="w-4 h-4 mr-2" />
                Create New Bot
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {bots.map((bot) => (
                <Card
                  key={bot.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setModalBot(bot)
                    setModalOpen(true)
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {bot.chatbot_name ? bot.chatbot_name.charAt(0).toUpperCase() + bot.chatbot_name.slice(1) : ""}
                      </CardTitle>
                      <Badge variant={bot.status === "active" ? "default" : bot.status === "crawling" ? "secondary" : "destructive"}>
                        {bot.status ? bot.status.charAt(0).toUpperCase() + bot.status.slice(1) : ""}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      {bot.website_url}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Business Name</p>
                        <p className="font-semibold text-gray-900">
                          {bot.business_name ? bot.business_name.charAt(0).toUpperCase() + bot.business_name.slice(1) : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Business Type</p>
                        <p className="font-semibold text-gray-900">
                          {bot.business_type ? bot.business_type.charAt(0).toUpperCase() + bot.business_type.slice(1) : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conversations</p>
                        <p className="font-semibold text-gray-900">{bot.conversation_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Conversations</h2>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {recentConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedConversation(conversation)
                        setConversationModalOpen(true)
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {conversation.customer_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{conversation.customer_name}</p>
                              <p className="text-sm text-gray-500">{conversation.bot}</p>
                            </div>
                          </div>
                          {/* Show the FIRST message if available */}
                          <p className="text-gray-700 mb-2">
                            {conversation.messages && conversation.messages.length > 0
                              ? conversation.messages[0].text
                              : ""}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{conversation.created_at}</span>
                            <Badge variant={conversation.resolved ? "default" : "secondary"}>
                              {conversation.resolved ? "Resolved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversation Modal */}
            <Dialog open={conversationModalOpen} onOpenChange={setConversationModalOpen}>
              <DialogContent className="max-w-lg p-0 overflow-hidden">
                {selectedConversation && (
                  <div className="bg-white rounded-2xl shadow-xl">
                    {/* Header similar to bot modal */}
                    <div className="bg-gradient-to-r from-[#a8c69f]/20 to-[#7db3d3]/20 px-8 py-6 flex flex-col items-center border-b">
                      <MessageSquare className="w-12 h-12 text-[#7db3d3] mb-2" />
                      <DialogHeader className="items-center">
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                          Conversation with {selectedConversation.customer_name}
                        </DialogTitle>
                        <DialogDescription>
                          <span className="text-gray-500">{selectedConversation.created_at}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <Badge
                        variant={selectedConversation.resolved ? "default" : "secondary"}
                        className="mt-3"
                      >
                        {selectedConversation.resolved ? "Resolved" : "Pending"}
                      </Badge>
                    </div>
                    {/* Chat body */}
                    <div className="px-8 py-6 space-y-4 max-h-96 overflow-y-auto bg-gray-50">
                      {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                        selectedConversation.messages.map((msg, idx) => (
                          <div
                            key={msg.id || idx}
                            className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
                          >
                            <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm
                              ${msg.sender === "user"
                                ? "bg-white text-gray-900 border border-gray-200"
                                : "bg-gradient-to-r from-[#a8c69f]/80 to-[#7db3d3]/80 text-white"
                              }`}
                            >
                              <div className="flex items-center mb-1">
                                <span className="font-semibold text-xs mr-2">
                                  {msg.sender === "user"
                                    ? selectedConversation.customer_name
                                    : selectedConversation.bot}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {msg.timestamp}
                                </span>
                              </div>
                              <span className="whitespace-pre-line break-words">
                                <ReactMarkdown
                                  components={{
                                    a: ({node, ...props}) => <a {...props} className="underline text-blue-600" target="_blank" rel="noopener noreferrer" />,
                                    code: ({node, ...props}) => <code {...props} className="bg-gray-100 px-1 rounded text-xs" />,
                                    pre: ({node, ...props}) => <pre {...props} className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto" />,
                                  }}
                                >
                                  {msg.text}
                                </ReactMarkdown>
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No messages in this conversation.</p>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Analytics Overview</h2>
              <div className="flex space-x-2">
                <Button
                  variant={selectedRange === 7 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange(7)}
                >
                  Last 7 days
                </Button>
                <Button
                  variant={selectedRange === 30 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange(30)}
                >
                  Last 30 days
                </Button>
                <Button
                  variant={selectedRange === 90 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange(90)}
                >
                  Last 90 days
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversation Volume Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Conversation Volume</CardTitle>
                  <CardDescription>Daily conversation trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 sm:h-80 md:h-96 flex items-center justify-center">
                    {analyticsLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : conversationVolume.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={conversationVolume} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#7db3d3" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#a8c69f" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-15} textAnchor="end">
                            <Label value="Date" offset={-10} position="insideBottom" />
                          </XAxis>
                          <YAxis allowDecimals={false} tick={{ fontSize: 12 }}>
                            <Label value="Conversations" angle={-90} position="insideLeft" />
                          </YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#7db3d3"
                            strokeWidth={3}
                            dot={{ r: 4, stroke: "#7db3d3", strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 7 }}
                            fill="url(#colorVolume)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Response Times Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Response Times</CardTitle>
                  <CardDescription>Average response time by chatbot (seconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 sm:h-80 md:h-96 flex items-center justify-center">
                    {analyticsLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : responseTimesData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={responseTimesData}
                          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                          barCategoryGap="20%"
                        >
                          <defs>
                            <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a8c69f" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#7db3d3" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }}>
                            <Label value="Chatbot" offset={-10} position="insideBottom" />
                          </XAxis>
                          <YAxis tick={{ fontSize: 12 }}>
                            <Label value="Seconds" angle={-90} position="insideLeft" />
                          </YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="response"
                            fill="url(#colorResponse)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                            name="Avg Response Time"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Issues Resolved per Bot */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Issues Resolved</CardTitle>
                  <CardDescription>Number of resolved conversations per chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bots.map((bot) => {
                      // Only count conversations where is_resolved === 1
                      const resolvedCount = (bot.recent_conversations || []).filter(
                        (c: any) => c.is_resolved === 1
                      ).length
                      return (
                        <div key={bot.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{bot.chatbot_name}</p>
                            <p className="text-sm text-gray-500">{bot.website_url}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-700">{resolvedCount}</span>
                            <span className="text-sm text-gray-500">resolved</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Satisfaction Scores</CardTitle>
                  <CardDescription>Customer satisfaction by chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {botsWithSatisfaction.map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{bot.chatbot_name}</p>
                          <p className="text-sm text-gray-500">{bot.website_url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#7db3d3] to-[#5a9bc4] h-2 rounded-full"
                              style={{ width: `${bot.satisfaction !== null ? bot.satisfaction : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {bot.satisfaction !== null ? `${bot.satisfaction}%` : "N/A"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bot Info Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {modalBot && (
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="bg-gradient-to-r from-[#a8c69f]/20 to-[#7db3d3]/20 px-8 py-6 flex flex-col items-center border-b">
                <Bot className="w-12 h-12 text-[#7db3d3] mb-2" />
                <DialogHeader className="items-center">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {modalBot.chatbot_name ? modalBot.chatbot_name.charAt(0).toUpperCase() + modalBot.chatbot_name.slice(1) : ""}
                  </DialogTitle>
                  <DialogDescription>
                    <span className="text-gray-500">{modalBot.website_url}</span>
                  </DialogDescription>
                </DialogHeader>
                <Badge
                  variant={modalBot.status === "active" ? "default" : modalBot.status === "crawling" ? "secondary" : "destructive"}
                  className="mt-3"
                >
                  {modalBot.status ? modalBot.status.charAt(0).toUpperCase() + modalBot.status.slice(1) : ""}
                </Badge>
              </div>
              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Business Name</div>
                  <div className="font-semibold text-gray-900">
                    {modalBot.business_name ? modalBot.business_name.charAt(0).toUpperCase() + modalBot.business_name.slice(1) : ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Business Type</div>
                  <div className="font-semibold text-gray-900">
                    {modalBot.business_type ? modalBot.business_type.charAt(0).toUpperCase() + modalBot.business_type.slice(1) : ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tone</div>
                  <div className="font-semibold text-gray-900">
                    {modalBot.tone ? modalBot.tone.charAt(0).toUpperCase() + modalBot.tone.slice(1) : ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Support Goals</div>
                  <div className="font-semibold text-gray-900">
                    {modalBot.support_goals ? modalBot.support_goals.charAt(0).toUpperCase() + modalBot.support_goals.slice(1) : ""}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {(modalBot.languages || []).map((lang: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Conversations</div>
                  <div className="font-semibold text-gray-900">{modalBot.conversation_count}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
