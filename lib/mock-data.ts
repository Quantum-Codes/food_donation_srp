// Mock Donations
export const mockDonations = [
  {
    id: "1",
    imageUrl: "/vegetable-curry-indian-food.jpg",
    address: "123 Main Street, Tirupati",
    volume: 50,
    priority: "high" as const,
    status: "active" as const,
    points: 35,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    donorName: "John Doe",
    description: "Fresh vegetable curry and rice, cooked this morning",
  },
  {
    id: "2",
    imageUrl: "/packaged-food-boxes.jpg",
    address: "456 Oak Avenue, Tirupati",
    volume: 30,
    priority: "medium" as const,
    status: "completed" as const,
    points: 25,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    donorName: "Jane Smith",
    description: "Packaged snacks and beverages",
  },
  {
    id: "3",
    imageUrl: "/biryani-rice-dish.jpg",
    address: "789 Temple Road, Tirupati",
    volume: 100,
    priority: "high" as const,
    status: "active" as const,
    points: 50,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    donorName: "Rajesh Kumar",
    description: "Leftover biryani from wedding function",
  },
  {
    id: "4",
    imageUrl: "/assorted-baked-goods.png",
    address: "321 Market Street, Tirupati",
    volume: 20,
    priority: "low" as const,
    status: "pending" as const,
    points: 15,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    donorName: "Lakshmi Bakery",
    description: "Day-old bread and pastries, still fresh",
  },
  {
    id: "5",
    imageUrl: "/dal-rice-lentils.jpg",
    address: "567 College Road, Tirupati",
    volume: 40,
    priority: "medium" as const,
    status: "declined" as const,
    points: 0,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    donorName: "College Canteen",
    description: "Dal and rice from college mess",
  },
  {
    id: "6",
    imageUrl: "/fruit-basket-fresh.jpg",
    address: "890 Garden Lane, Tirupati",
    volume: 25,
    priority: "high" as const,
    status: "active" as const,
    points: 30,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    donorName: "Fresh Mart",
    description: "Overripe fruits, perfect for immediate consumption",
  },
]

// Mock Leaderboard
export const mockLeaderboard = [
  { rank: 1, name: "John Doe", points: 245, donations: 15, avatar: "/man-avatar.png" },
  { rank: 2, name: "Jane Smith", points: 198, donations: 12, avatar: "/diverse-woman-avatar.png" },
  { rank: 3, name: "Bob Johnson", points: 176, donations: 10, avatar: "/man-glasses-avatar.jpg" },
  { rank: 4, name: "Alice Brown", points: 145, donations: 8, avatar: "/professional-woman-avatar.png" },
  { rank: 5, name: "Rajesh Kumar", points: 132, donations: 7, avatar: "/indian-man-avatar.png" },
  { rank: 6, name: "Priya Sharma", points: 118, donations: 6, avatar: "/indian-woman-avatar.png" },
  {
    rank: 7,
    name: "Current User",
    points: 112,
    donations: 5,
    avatar: "/person-smiling-avatar.jpg",
    isCurrentUser: true,
  },
  { rank: 8, name: "David Wilson", points: 95, donations: 5, avatar: "/man-beard-avatar.png" },
  { rank: 9, name: "Sunita Patel", points: 87, donations: 4, avatar: "/smiling-woman-avatar.png" },
  { rank: 10, name: "Michael Lee", points: 72, donations: 3, avatar: "/asian-man-avatar.png" },
]

// Mock NGOs
export const mockNGOs = [
  {
    id: "1",
    name: "Green Hands Foundation",
    address: "123 Main St, Tirupati",
    email: "contact@greenhands.org",
    phone: "+91 98765 43210",
    staffCount: 5,
    location: { lat: 13.6288, lng: 79.4192 },
    completedPickups: 156,
    activePickups: 3,
  },
  {
    id: "2",
    name: "Hope Kitchen",
    address: "456 Oak Ave, Tirupati",
    email: "info@hopekitchen.org",
    phone: "+91 98765 43211",
    staffCount: 3,
    location: { lat: 13.635, lng: 79.425 },
    completedPickups: 89,
    activePickups: 2,
  },
  {
    id: "3",
    name: "Food For All Trust",
    address: "789 Temple Road, Tirupati",
    email: "help@foodforall.org",
    phone: "+91 98765 43212",
    staffCount: 4,
    location: { lat: 13.62, lng: 79.41 },
    completedPickups: 112,
    activePickups: 4,
  },
]

// Mock User
export const mockCurrentUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  role: "donor" as const,
  points: 145,
  totalDonations: 12,
  activeDonations: 3,
  joinedAt: "2024-06-15",
}

// Mock Staff User
export const mockStaffUser = {
  id: "staff-1",
  name: "Sarah Wilson",
  email: "sarah@greenhands.org",
  role: "staff" as const,
  ngoId: "1",
  ngoName: "Green Hands Foundation",
}

// Mock Admin User
export const mockAdminUser = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@fooddonation.org",
  role: "admin" as const,
}

// Mock Platform Stats (for admin)
export const mockPlatformStats = {
  totalDonations: 127,
  activeDonations: 15,
  completedDonations: 112,
  totalDonors: 45,
  totalNGOs: 3,
  totalStaff: 12,
  pointsAwarded: 3250,
}

// Mock Activity Log (for admin)
export const mockActivityLog = [
  { id: "1", action: "Donation completed", user: "Green Hands Foundation", time: "10 minutes ago" },
  { id: "2", action: "New donor signup", user: "Amit Verma", time: "25 minutes ago" },
  { id: "3", action: "New donation created", user: "Fresh Mart", time: "1 hour ago" },
  { id: "4", action: "Donation declined", user: "Hope Kitchen", time: "2 hours ago" },
  { id: "5", action: "NGO staff added", user: "Food For All Trust", time: "3 hours ago" },
]

// Helper function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Types
export type Priority = "high" | "medium" | "low"
export type Status = "active" | "completed" | "pending" | "declined"
export type UserRole = "donor" | "staff" | "admin"

export interface Donation {
  id: string
  imageUrl: string
  address: string
  volume: number
  priority: Priority
  status: Status
  points: number
  createdAt: string
  donorName: string
  description?: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  donations: number
  avatar?: string
  isCurrentUser?: boolean
}

export interface NGO {
  id: string
  name: string
  address: string
  email: string
  phone?: string
  staffCount: number
  location: { lat: number; lng: number }
  completedPickups?: number
  activePickups?: number
}
