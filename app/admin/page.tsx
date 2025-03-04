"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Upload } from "lucide-react"

interface Ad {
  id: number
  title: string
  location: string
  images: string[]
  description: string
  price: string
  features: string[]
}

export default function AdminPage() {
  const [ads, setAds] = useState<Ad[]>([
    {
      id: 1,
      title: "NEW ON SALE",
      location: "NEW YORK, NY",
      images: ["/placeholder.svg?height=600&width=800"],
      description: "Luxury apartment with modern design and premium finishes",
      price: "$2,500,000",
      features: ["3 Bedrooms", "2.5 Bathrooms", "1,800 sq ft"],
    },
  ])

  const [newFeature, setNewFeature] = useState("")

  const addNewAd = () => {
    const newAd: Ad = {
      id: ads.length + 1,
      title: "NEW LISTING",
      location: "LOCATION",
      images: ["/placeholder.svg?height=600&width=800"],
      description: "Description goes here",
      price: "$0",
      features: [],
    }
    setAds([...ads, newAd])
  }

  const addFeature = (adIndex: number) => {
    if (!newFeature.trim()) return

    const updatedAds = [...ads]
    updatedAds[adIndex].features.push(newFeature)
    setAds(updatedAds)
    setNewFeature("")
  }

  const removeFeature = (adIndex: number, featureIndex: number) => {
    const updatedAds = [...ads]
    updatedAds[adIndex].features.splice(featureIndex, 1)
    setAds(updatedAds)
  }

  const updateAdField = (adIndex: number, field: keyof Ad, value: string) => {
    const updatedAds = [...ads]
    
    if (field === 'images') {
      // Handle images array separately
      updatedAds[adIndex].images = [value] 
    } else {
      // For non-array fields, directly assign the value
      (updatedAds[adIndex][field] as string) = value
    }
    
    setAds(updatedAds)
  }

  const removeAd = (adIndex: number) => {
    const updatedAds = [...ads]
    updatedAds.splice(adIndex, 1)
    setAds(updatedAds)
  }

  const addImageToAd = (adIndex: number, imageUrl: string) => {
    const updatedAds = [...ads]
    updatedAds[adIndex].images.push(imageUrl)
    setAds(updatedAds)
  }

  const removeImageFromAd = (adIndex: number, imageIndex: number) => {
    const updatedAds = [...ads]
    updatedAds[adIndex].images.splice(imageIndex, 1)
    setAds(updatedAds)
  }

  const handleImageUpload = (adIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // In a real app, you would upload the file to a server
    // For now, we'll just create a URL for the local file
    const file = files[0]
    const imageUrl = URL.createObjectURL(file)
    addImageToAd(adIndex, imageUrl)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Ad Manager</h1>

      <div className="space-y-8">
        {ads.map((ad, adIndex) => (
          <div key={ad.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ad #{ad.id}</h2>
              <Button variant="destructive" size="sm" onClick={() => removeAd(adIndex)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Ad
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`title-${ad.id}`}>Title</Label>
                    <Input
                      id={`title-${ad.id}`}
                      value={ad.title}
                      onChange={(e) => updateAdField(adIndex, "title", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`location-${ad.id}`}>Location</Label>
                    <Input
                      id={`location-${ad.id}`}
                      value={ad.location}
                      onChange={(e) => updateAdField(adIndex, "location", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`price-${ad.id}`}>Price</Label>
                    <Input
                      id={`price-${ad.id}`}
                      value={ad.price}
                      onChange={(e) => updateAdField(adIndex, "price", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`description-${ad.id}`}>Description</Label>
                    <Textarea
                      id={`description-${ad.id}`}
                      value={ad.description}
                      onChange={(e) => updateAdField(adIndex, "description", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <ul className="mt-2 space-y-2">
                  {ad.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-between">
                      <span>{feature}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFeature(adIndex, featureIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>

                <div className="flex mt-4">
                  <Input
                    placeholder="Add new feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={() => addFeature(adIndex)}>Add</Button>
                </div>

                <div className="mt-6">
                  <Label>Images</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Drag and drop images here or click to browse</p>
                    <input 
                      type="file" 
                      id={`image-upload-${ad.id}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(adIndex, e)} 
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => document.getElementById(`image-upload-${ad.id}`)?.click()}
                    >
                      Upload Images
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {ad.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative group">
                        <img 
                          src={image} 
                          alt={`Ad ${ad.id} - Image ${imageIndex + 1}`} 
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImageFromAd(adIndex, imageIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={addNewAd} className="mt-6">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New Ad
      </Button>
    </div>
  )
}
