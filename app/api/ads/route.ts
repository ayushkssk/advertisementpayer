import { NextResponse } from "next/server"

// Sample ad data - in a real application, this would come from a database
const ads = [
  {
    id: 1,
    title: "NEW ON SALE",
    location: "NEW YORK, NY",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Luxury apartment with modern design and premium finishes",
    price: "$2,500,000",
    features: ["3 Bedrooms", "2.5 Bathrooms", "1,800 sq ft"],
  },
  {
    id: 2,
    title: "FEATURED LISTING",
    location: "BROOKLYN, NY",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Spacious loft with high ceilings and abundant natural light",
    price: "$1,850,000",
    features: ["2 Bedrooms", "2 Bathrooms", "1,500 sq ft"],
  },
  {
    id: 3,
    title: "JUST LISTED",
    location: "MANHATTAN, NY",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Penthouse with panoramic views and private terrace",
    price: "$4,200,000",
    features: ["4 Bedrooms", "3.5 Bathrooms", "2,400 sq ft"],
  },
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(ads)
}

