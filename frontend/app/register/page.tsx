"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { toast } from "sonner"
import { mockNGOs } from "@/lib/mock-data"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "donor",
    ngoId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (formData.role === "staff" && !formData.ngoId) {
      newErrors.ngoId = "Please select an NGO"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Account created successfully!")

    if (formData.role === "staff") {
      router.push("/staff/dashboard")
    } else {
      router.push("/donor/dashboard")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🍽️</span>
          <span className="font-bold text-2xl text-[#2d6a4f]">Food Donation</span>
        </Link>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-bold text-[#1b4332]">Create Account</h1>
            <p className="text-[#4a4a4a]">Join our community of food donors</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#1a1a1a]">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10 h-12"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-[#1a1a1a]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#4a4a4a]">
                      Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too weak"}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#1a1a1a]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-[#1a1a1a]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-[#1a1a1a]">I am a:</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value, ngoId: "" })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donor" id="donor" />
                    <Label htmlFor="donor" className="cursor-pointer">
                      Donor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff" className="cursor-pointer">
                      NGO Staff
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.role === "staff" && (
                <div className="space-y-2">
                  <Label htmlFor="ngo" className="text-[#1a1a1a]">
                    Select NGO
                  </Label>
                  <Select value={formData.ngoId} onValueChange={(value) => setFormData({ ...formData, ngoId: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose your organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockNGOs.map((ngo) => (
                        <SelectItem key={ngo.id} value={ngo.id}>
                          {ngo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ngoId && <p className="text-sm text-red-600">{errors.ngoId}</p>}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-lg"
              >
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#4a4a4a]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#2d6a4f] font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
