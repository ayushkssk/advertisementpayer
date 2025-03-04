import AdVideoPlayer from "@/components/ad-video-player"
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
    },
    {
      id: 2,
      title: "FEATURED LISTING",
      location: "BROOKLYN, NY",
      images: [
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1374&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1384&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560440021-33f9b867899d?q=80&w=1459&auto=format&fit=crop"
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
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1470&auto=format&fit=crop"
      ],
      description: "Penthouse with panoramic views and private terrace",
      price: "$4,200,000",
      features: ["4 Bedrooms", "3.5 Bathrooms", "2,400 sq ft"],
    },
    {
      id: 4,
      title: "LUXURY VILLA",
      location: "HAMPTONS, NY",
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600047508788-26bb381340ba?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613977257592-4a9a32f9141b?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=1470&auto=format&fit=crop"
      ],
      description: "Beachfront villa with private pool and stunning ocean views",
      price: "$8,500,000",
      features: ["5 Bedrooms", "4.5 Bathrooms", "4,200 sq ft", "Private Pool", "Beachfront"],
    },
    {
      id: 5,
      title: "MODERN TOWNHOUSE",
      location: "QUEENS, NY",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1475&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1374&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1470&auto=format&fit=crop"
      ],
      description: "Contemporary townhouse with smart home features and rooftop deck",
      price: "$1,250,000",
      features: ["3 Bedrooms", "2.5 Bathrooms", "1,650 sq ft", "Rooftop Deck", "Smart Home"],
    },
    {
      id: 6,
      title: "HISTORIC BROWNSTONE",
      location: "PARK SLOPE, NY",
      images: [
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop"
      ],
      description: "Beautifully restored brownstone with original details and modern updates",
      price: "$3,750,000",
      features: ["4 Bedrooms", "3 Bathrooms", "3,200 sq ft", "Garden", "Original Woodwork"],
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Choose one of the components to display */}
        {/* <AdVideoPlayer ads={ads} /> */}
        <AdSlider ads={ads} />
      </div>
    </main>
  )
}
