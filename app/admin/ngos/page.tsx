"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockNGOs, type NGO } from "@/lib/mock-data"
import { toast } from "sonner"
import { Plus, MapPin, Mail, Phone, Users, Edit, Eye, Building2 } from "lucide-react"

export default function NGOManagementPage() {
  const [ngos, setNgos] = useState(mockNGOs)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  })

  const resetForm = () => {
    setFormData({ name: "", address: "", email: "", phone: "" })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.address || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    const newNGO: NGO = {
      id: String(ngos.length + 1),
      name: formData.name,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
      staffCount: 0,
      location: { lat: 13.6288, lng: 79.4192 },
      completedPickups: 0,
      activePickups: 0,
    }

    setNgos([...ngos, newNGO])
    setShowAddDialog(false)
    resetForm()
    toast.success("NGO added successfully!")
  }

  const handleEdit = () => {
    if (!selectedNGO || !formData.name || !formData.address || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    setNgos((prev) =>
      prev.map((ngo) =>
        ngo.id === selectedNGO.id
          ? {
              ...ngo,
              name: formData.name,
              address: formData.address,
              email: formData.email,
              phone: formData.phone,
            }
          : ngo,
      ),
    )

    setShowEditDialog(false)
    setSelectedNGO(null)
    resetForm()
    toast.success("NGO updated successfully!")
  }

  const openEditDialog = (ngo: NGO) => {
    setSelectedNGO(ngo)
    setFormData({
      name: ngo.name,
      address: ngo.address,
      email: ngo.email,
      phone: ngo.phone || "",
    })
    setShowEditDialog(true)
  }

  const openDetailDialog = (ngo: NGO) => {
    setSelectedNGO(ngo)
    setShowDetailDialog(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#1b4332]">NGO Management</h1>
        <div className="flex items-center gap-4">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New NGO
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New NGO</DialogTitle>
                <DialogDescription>Enter the details of the new NGO partner organization.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Green Hands Foundation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g., 123 Main St, Tirupati"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., contact@ngo.org"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +91 98765 43210"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white">
                  Add NGO
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" asChild>
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* NGO List */}
          <div className="space-y-4">
            {ngos.map((ngo) => (
              <Card key={ngo.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-[#2d6a4f]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1b4332] mb-2">{ngo.name}</h3>
                    <div className="space-y-1 text-sm text-[#4a4a4a]">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {ngo.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {ngo.email}
                      </p>
                      {ngo.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {ngo.phone}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Staff: {ngo.staffCount}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(ngo)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailDialog(ngo)}
                      className="border-[#2d6a4f] text-[#2d6a4f] hover:bg-green-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit NGO</DialogTitle>
            <DialogDescription>Update the details of this NGO.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">
                Contact Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNGO?.name}</DialogTitle>
            <DialogDescription>NGO Details and Statistics</DialogDescription>
          </DialogHeader>
          {selectedNGO && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-green-50">
                  <p className="text-sm text-[#4a4a4a]">Completed Pickups</p>
                  <p className="text-2xl font-bold text-[#2d6a4f]">{selectedNGO.completedPickups}</p>
                </Card>
                <Card className="p-4 bg-orange-50">
                  <p className="text-sm text-[#4a4a4a]">Active Pickups</p>
                  <p className="text-2xl font-bold text-[#f77f00]">{selectedNGO.activePickups}</p>
                </Card>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-[#4a4a4a]">
                  <MapPin className="w-4 h-4" />
                  {selectedNGO.address}
                </p>
                <p className="flex items-center gap-2 text-[#4a4a4a]">
                  <Mail className="w-4 h-4" />
                  {selectedNGO.email}
                </p>
                {selectedNGO.phone && (
                  <p className="flex items-center gap-2 text-[#4a4a4a]">
                    <Phone className="w-4 h-4" />
                    {selectedNGO.phone}
                  </p>
                )}
                <p className="flex items-center gap-2 text-[#4a4a4a]">
                  <Users className="w-4 h-4" />
                  {selectedNGO.staffCount} staff members
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
