import AdSlider from "@/components/ad-slider"

export default function Home() {
  // Sample ad data - in a real application, this could come from an API or CMS
  const ads = [
    {
      id: 1,
      title: "NEW ON SALE",
      location: "NEW YORK, NY",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1470&auto=format&fit=crop"
      ],
      description: "Luxury apartment with modern design and premium finishes",
      price: "$2,500,000",
      features: ["3 Bedrooms", "2.5 Bathrooms", "1,800 sq ft"],
    }
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <AdSlider ads={ads} />
      </div>
    </main>
  )
}
