"use client"

import { useState } from "react"
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

export default function Dashboard() {
  const [selectedChatbot, setSelectedChatbot] = useState("main-website")

  const chatbots = [
    {
      id: "main-website",
      name: "Main Website Bot",
      website: "mycompany.com",
      status: "active",
      conversations: 1247,
      satisfaction: 94,
      responseTime: "1.2s",
      lastCrawl: "2 hours ago",
    },
    {
      id: "support-portal",
      name: "Support Portal Bot",
      website: "support.mycompany.com",
      status: "active",
      conversations: 856,
      satisfaction: 91,
      responseTime: "0.8s",
      lastCrawl: "4 hours ago",
    },
    {
      id: "docs-site",
      name: "Documentation Bot",
      website: "docs.mycompany.com",
      status: "crawling",
      conversations: 423,
      satisfaction: 96,
      responseTime: "1.5s",
      lastCrawl: "In progress",
    },
  ]

  const recentConversations = [
    {
      id: 1,
      customer: "Sarah Johnson",
      message: "How do I reset my password?",
      bot: "Main Website Bot",
      time: "2 minutes ago",
      resolved: true,
    },
    {
      id: 2,
      customer: "Mike Chen",
      message: "What are your pricing plans?",
      bot: "Main Website Bot",
      time: "5 minutes ago",
      resolved: true,
    },
    {
      id: 3,
      customer: "Emma Davis",
      message: "Integration with Slack not working",
      bot: "Support Portal Bot",
      time: "12 minutes ago",
      resolved: false,
    },
    {
      id: 4,
      customer: "Alex Rodriguez",
      message: "API documentation unclear",
      bot: "Documentation Bot",
      time: "18 minutes ago",
      resolved: true,
    },
  ]

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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
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

        <Tabs defaultValue="chatbots" className="space-y-6">
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
              {chatbots.map((bot) => (
                <Card
                  key={bot.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedChatbot(bot.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">{bot.name}</CardTitle>
                      <Badge
                        variant={
                          bot.status === "active" ? "default" : bot.status === "crawling" ? "secondary" : "destructive"
                        }
                      >
                        {bot.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {bot.status === "crawling" && <Zap className="w-3 h-3 mr-1" />}
                        {bot.status === "paused" && <Pause className="w-3 h-3 mr-1" />}
                        {bot.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      {bot.website}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Conversations</p>
                        <p className="font-semibold text-gray-900">{bot.conversations.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Satisfaction</p>
                        <p className="font-semibold text-gray-900">{bot.satisfaction}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Response Time</p>
                        <p className="font-semibold text-gray-900">{bot.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Crawl</p>
                        <p className="font-semibold text-gray-900">{bot.lastCrawl}</p>
                      </div>
                    </div>

                    {bot.status === "crawling" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Crawling Progress</span>
                          <span className="text-gray-900">73%</span>
                        </div>
                        <Progress value={73} className="h-2" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
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
                    <div key={conversation.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {conversation.customer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{conversation.customer}</p>
                              <p className="text-sm text-gray-500">{conversation.bot}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{conversation.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{conversation.time}</span>
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Analytics Overview</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Last 7 days
                </Button>
                <Button variant="outline" size="sm">
                  Last 30 days
                </Button>
                <Button variant="outline" size="sm">
                  Last 90 days
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Conversation Volume</CardTitle>
                  <CardDescription>Daily conversation trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Response Times</CardTitle>
                  <CardDescription>Average response time by chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Top Questions</CardTitle>
                  <CardDescription>Most frequently asked questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { question: "How do I reset my password?", count: 156 },
                      { question: "What are your pricing plans?", count: 134 },
                      { question: "How do I cancel my subscription?", count: 98 },
                      { question: "Integration setup help", count: 87 },
                      { question: "API documentation", count: 76 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-gray-700 flex-1">{item.question}</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#a8c69f] to-[#96b88a] h-2 rounded-full"
                              style={{ width: `${(item.count / 156) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                        </div>
                      </div>
                    ))}
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
                    {chatbots.map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{bot.name}</p>
                          <p className="text-sm text-gray-500">{bot.website}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#7db3d3] to-[#5a9bc4] h-2 rounded-full"
                              style={{ width: `${bot.satisfaction}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{bot.satisfaction}%</span>
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
    </div>
  )
}
