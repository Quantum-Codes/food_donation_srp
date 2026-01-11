"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock login - route based on email domain
    if (email.includes("admin")) {
      router.push("/admin/dashboard")
    } else if (email.includes("staff") || email.includes("ngo")) {
      router.push("/staff/dashboard")
    } else {
      router.push("/donor/dashboard")
    }

    toast.success("Welcome back!")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🍽️</span>
          <span className="font-bold text-2xl text-[#2d6a4f]">Food Donation</span>
        </Link>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-bold text-[#1b4332]">Welcome Back! 👋</h1>
            <p className="text-[#4a4a4a]">Sign in to continue your journey</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a1a1a]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1a1a1a]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-[#1a1a1a]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-[#4a4a4a] cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-sm text-[#2d6a4f] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-lg"
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#4a4a4a]">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#2d6a4f] font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo login hint */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-[#2d6a4f] text-center">
                <strong>Demo:</strong> Use any email to login.
                <br />
                Include "admin" for admin, "staff" for staff portal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
