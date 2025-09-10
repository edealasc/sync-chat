"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Bot, Zap, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiRequest } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    websiteUrl: "",
    businessName: "",
    businessType: "",
    supportGoals: "",
    chatbotName: "",
    tone: "",
    languages: ["English"],
    allowedDomains: [] as string[], // <-- Add allowedDomains to formData
  })
  const [domainInput, setDomainInput] = useState("") // <-- For domain input field
  const [botId, setBotId] = useState<number | null>(null)
  const [botStatus, setBotStatus] = useState<string | null>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  const totalSteps = 4 // <-- Increase total steps to 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  // Polling function
  useEffect(() => {
    if (isProcessing && botId) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await apiRequest("api/user/dashboard/", "GET", undefined, { auth: true })
          if (res.bots) {
            const bot = res.bots.find((b: any) => b.id === botId)
            if (bot) {
              setBotStatus(bot.status)
              if (bot.status === "active") {
                clearInterval(pollingRef.current!)
                router.push("/dashboard")
              }
            }
          }
        } catch (err) {
          // Optionally handle error
        }
      }, 3000) // Poll every 3 seconds

      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current)
      }
    }
  }, [isProcessing, botId, router])

  const handleSubmit = async () => {
    setIsProcessing(true)
    try {
      const res = await apiRequest(
        "api/user/onboarding/",
        "POST",
        formData,
        { auth: true }
      )
      if (res.success && res.bot_id) {
        setBotId(res.bot_id)
        setBotStatus("crawling")
        // Polling will start via useEffect
      } else if (res.error) {
        // Show error message
      }
    } catch (err) {
      // Show error message
    }
    // Don't set isProcessing to false here, let polling handle redirect
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddDomain = () => {
    const trimmed = domainInput.trim()
    if (
      trimmed &&
      !formData.allowedDomains.includes(trimmed)
    ) {
      updateFormData("allowedDomains", [...formData.allowedDomains, trimmed])
      setDomainInput("")
    }
  }

  const handleRemoveDomain = (domain: string) => {
    updateFormData(
      "allowedDomains",
      formData.allowedDomains.filter((d) => d !== domain)
    )
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #374151 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-2xl p-8 text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#a8c69f] to-[#96b88a] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Creating Your AI Assistant</h1>
              <p className="text-gray-600">We're analyzing your website and building your custom chatbot...</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    {botStatus === "active"
                      ? "Website crawling completed"
                      : "Website crawling in progress"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Loader2 className={`w-5 h-5 text-blue-600 ${botStatus !== "active" ? "animate-spin" : ""}`} />
                  <span className="text-blue-800 font-medium">
                    {botStatus === "active"
                      ? "AI model training completed"
                      : "Training AI model with your content"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <span className="text-gray-600 font-medium">Configuring chatbot settings</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <span className="text-gray-600 font-medium">Deploying to your website</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Progress value={45} className="h-2 mb-4" />
              <p className="text-sm text-gray-500">This usually takes 2-3 minutes</p>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-[#a8c69f]/10 to-[#7db3d3]/10 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Pro tip:</strong> While we're setting up your chatbot, you can customize its appearance and
                behavior in the dashboard once it's ready.
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #374151 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Bot className="w-6 h-6 text-[#a8c69f]" />
              <span className="text-xl font-bold">SyncChat</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Your AI Assistant</h1>
            <p className="text-gray-600">Let's create a custom chatbot for your website in just a few steps</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <Badge variant="outline" className="mb-4">
                    Website Information
                  </Badge>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Tell us about your website</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
                      Website URL *
                    </Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.websiteUrl}
                      onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">We'll crawl this website to understand your business</p>
                  </div>

                  <div>
                    <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="Your Business Name"
                      value={formData.businessName}
                      onChange={(e) => updateFormData("businessName", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                      Business Type *
                    </Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => updateFormData("businessType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <Badge variant="outline" className="mb-4">
                    Chatbot Configuration
                  </Badge>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Customize your AI assistant</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chatbotName" className="text-sm font-medium text-gray-700">
                      Chatbot Name *
                    </Label>
                    <Input
                      id="chatbotName"
                      placeholder="e.g., Alex, Support Bot, Assistant"
                      value={formData.chatbotName}
                      onChange={(e) => updateFormData("chatbotName", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tone" className="text-sm font-medium text-gray-700">
                      Conversation Tone *
                    </Label>
                    <Select value={formData.tone} onValueChange={(value) => updateFormData("tone", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose conversation style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="supportGoals" className="text-sm font-medium text-gray-700">
                      Support Goals
                    </Label>
                    <Textarea
                      id="supportGoals"
                      placeholder="What should your chatbot help customers with? (e.g., answer product questions, handle bookings, provide support)"
                      value={formData.supportGoals}
                      onChange={(e) => updateFormData("supportGoals", e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <Badge variant="outline" className="mb-4">
                    Allowed Domains
                  </Badge>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Where will you use this chatbot?
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Enter all the domains (e.g., <span className="font-mono">yourwebsite.com</span>, <span className="font-mono">help.yourwebsite.com</span>) where you plan to embed this bot. The chatbot will only work on these domains.
                  </p>
                </div>
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. yourwebsite.com"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddDomain()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddDomain} disabled={!domainInput.trim()}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.allowedDomains.length === 0 && (
                      <span className="text-xs text-gray-400">No domains added yet.</span>
                    )}
                    {formData.allowedDomains.map((domain) => (
                      <Badge
                        key={domain}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        <span>{domain}</span>
                        <button
                          type="button"
                          className="ml-1 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveDomain(domain)}
                          aria-label={`Remove ${domain}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You can add or remove domains later in your dashboard.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <Badge variant="outline" className="mb-4">
                    Final Setup
                  </Badge>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Review and launch</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Website:</span>
                    <span className="text-sm text-gray-900">{formData.websiteUrl}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Business:</span>
                    <span className="text-sm text-gray-900">{formData.businessName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Chatbot Name:</span>
                    <span className="text-sm text-gray-900">{formData.chatbotName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Tone:</span>
                    <span className="text-sm text-gray-900 capitalize">{formData.tone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Allowed Domains:</span>
                    <span className="text-sm text-gray-900">
                      {formData.allowedDomains.length > 0
                        ? formData.allowedDomains.join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#a8c69f]/10 to-[#7db3d3]/10 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-[#a8c69f] mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Ready to launch!</h3>
                      <p className="text-sm text-gray-600">
                        We'll crawl your website, train the AI model, and have your chatbot ready in just a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6"
            >
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.websiteUrl || !formData.businessName || !formData.businessType)) ||
                (currentStep === 2 && (!formData.chatbotName || !formData.tone)) ||
                (currentStep === 3 && formData.allowedDomains.length === 0)
              }
              className="px-6 bg-gradient-to-r from-[#a8c69f] to-[#96b88a] hover:from-[#96b88a] to-[#84a578] text-white border-0"
            >
              {currentStep === totalSteps ? "Create Chatbot" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
