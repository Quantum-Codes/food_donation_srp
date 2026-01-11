"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AppHeader } from "@/components/app-header"
import { mockCurrentUser } from "@/lib/mock-data"
import { toast } from "sonner"
import { Camera, MapPin, Loader2, X } from "lucide-react"

export default function DonatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    image: null as File | null,
    address: "",
    volume: "",
    priority: "",
    description: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, image: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAutoDetect = async () => {
    setIsLocating(true)
    // Simulate geolocation API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setFormData({ ...formData, address: "123 Current Location, Tirupati, Andhra Pradesh" })
    setIsLocating(false)
    toast.success("Location detected!")
  }

  const isFormValid = formData.address && formData.volume && formData.priority

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success("Donation submitted successfully! You earned +35 points.", {
      description: "An NGO will be notified to pick up your donation.",
    })

    router.push("/donor/my-donations")
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader pageTitle="Create New Donation" points={mockCurrentUser.points} userRole="donor" />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-[#1a1a1a] font-medium">Upload Food Image</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    imagePreview ? "border-[#2d6a4f] bg-green-50" : "border-gray-300 hover:border-[#2d6a4f]"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Food preview"
                        width={300}
                        height={200}
                        className="mx-auto rounded-lg object-cover max-h-48"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearImage()
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-12 h-12 mx-auto text-[#4a4a4a]" />
                      <p className="text-[#4a4a4a]">Click to upload image</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-[#1a1a1a] font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutoDetect}
                    disabled={isLocating}
                    className="border-[#2d6a4f] text-[#2d6a4f] hover:bg-green-50 bg-transparent"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Auto-detect
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  placeholder="Or enter address manually..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Volume */}
              <div className="space-y-3">
                <Label className="text-[#1a1a1a] font-medium">Volume (Servings)</Label>
                <RadioGroup
                  value={formData.volume}
                  onValueChange={(value) => setFormData({ ...formData, volume: value })}
                  className="grid grid-cols-3 gap-4"
                >
                  {[
                    { value: "small", label: "< 20", icon: "🍽️" },
                    { value: "medium", label: "20-50", icon: "🍽️🍽️" },
                    { value: "large", label: "50+", icon: "🍽️🍽️🍽️" },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.volume === option.value
                          ? "border-[#2d6a4f] bg-green-50"
                          : "border-gray-200 hover:border-[#52b788]"
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      <span className="text-2xl mb-1">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-[#4a4a4a]">servings</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <Label className="text-[#1a1a1a] font-medium">Priority Level</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  className="space-y-2"
                >
                  {[
                    {
                      value: "high",
                      label: "High Priority",
                      description: "Perishable food, needs immediate pickup",
                      color: "border-red-500 bg-red-50",
                      indicator: "bg-red-500",
                    },
                    {
                      value: "medium",
                      label: "Medium Priority",
                      description: "Cooked food, should be picked within hours",
                      color: "border-orange-500 bg-orange-50",
                      indicator: "bg-orange-500",
                    },
                    {
                      value: "low",
                      label: "Low Priority",
                      description: "Packaged/non-perishable items",
                      color: "border-green-500 bg-green-50",
                      indicator: "bg-green-500",
                    },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`priority-${option.value}`}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.priority === option.value ? option.color : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={`priority-${option.value}`} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${option.indicator}`} />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-sm text-[#4a4a4a] mt-1">{option.description}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-[#1a1a1a] font-medium">Description (Optional)</Label>
                <Textarea
                  placeholder="Add any additional details about the food..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 h-12 border-[#2d6a4f] text-[#2d6a4f]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 h-12 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Donation"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
