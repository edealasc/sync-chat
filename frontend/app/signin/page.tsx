"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Bot } from "lucide-react"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-start pl-24"
      style={{
        backgroundImage: `radial-gradient(circle, #b0b3b8 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#a8c69f]/10 to-[#7db3d3]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-40 w-48 h-48 bg-gradient-to-br from-[#7db3d3]/10 to-[#a8c69f]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-br from-[#a8c69f]/5 to-[#7db3d3]/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm animate-fade-in border-none shadow-none">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#a8c69f] to-[#7db3d3] rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SyncChat</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Sign in to continue to SyncChat</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 border-gray-200 focus:border-[#a8c69f] focus:ring-[#a8c69f]/20 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password*
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 pr-12 border-gray-200 focus:border-[#a8c69f] focus:ring-[#a8c69f]/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-[#a8c69f] focus:ring-[#a8c69f]/20" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#6b8f5a] hover:text-[#5a7a4a] transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-0"
            >
              Continue
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[#6b8f5a] hover:text-[#5a7a4a] transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
