import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Truck, Star, Trophy } from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Easy Donation",
    description: "Simply upload a photo, add your location, and submit. It takes less than 2 minutes.",
  },
  {
    icon: Truck,
    title: "Quick Pickup",
    description: "Local NGOs are notified instantly and can pick up your donation the same day.",
  },
  {
    icon: Star,
    title: "Earn Points",
    description: "Get rewarded for every donation. Higher priority items earn more points.",
  },
  {
    icon: Trophy,
    title: "Climb the Leaderboard",
    description: "Compete with other donors and earn recognition for your contributions.",
  },
]

export default function LandingPage() {
  console.log("[v0] LandingPage rendering")

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-emerald-700">Food Donation</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-500 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Reduce Food Waste, Feed Communities</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 text-pretty max-w-2xl mx-auto">
            Connect with local NGOs to donate surplus food. Every meal shared makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg bg-transparent"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">127+</p>
              <p className="text-gray-600">Donations Made</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">45+</p>
              <p className="text-gray-600">Active Donors</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">3</p>
              <p className="text-gray-600">Partner NGOs</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">5000+</p>
              <p className="text-gray-600">Meals Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-emerald-800 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our platform makes food donation simple, fast, and rewarding for everyone involved.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-lg text-emerald-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                  <div className="mt-4 text-sm font-medium text-emerald-600">Step {index + 1}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-emerald-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-white/80 mb-8">
            Join our community of donors and help reduce food waste in Tirupati.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-6 text-lg"
          >
            <Link href="/register">Start Donating Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="font-bold text-emerald-700">Food Donation Platform</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 Food Donation Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
