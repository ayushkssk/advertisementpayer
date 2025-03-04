"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Ad {
  id: number
  title: string
  location: string
  images: string[]
  description: string
  price: string
  features: string[]
}

interface AdSectionProps {
  ad: Ad
}

export default function AdSection({ ad }: AdSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !imagesRef.current) return

    // Animate the images container
    const imageContainer = imagesRef.current
    const images = imageContainer.querySelectorAll(".image-item")

    // Create a timeline for each section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        containerAnimation: gsap.getById("mainScroll"),
        start: "left center",
        end: "right center",
        toggleActions: "play none none reverse",
      },
    })

    // Animate title and location
    tl.from(
      ".ad-title",
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
      },
      0,
    )

    // Animate images
    tl.from(
      images,
      {
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      },
      0.2,
    )

    // Animate details
    tl.from(
      ".ad-details",
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
      },
      0.4,
    )

    // Animate CTA
    tl.from(
      ".ad-cta",
      {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
      },
      0.6,
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={sectionRef} className="w-screen h-full flex flex-col md:flex-row p-4 md:p-8 lg:p-12">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-4 md:p-8">
        <h2 className="ad-title text-5xl md:text-6xl lg:text-7xl font-bold mb-2">{ad.title}</h2>
        <h3 className="ad-title text-2xl md:text-3xl font-medium mb-8">{ad.location}</h3>

        <div className="ad-details space-y-4 mb-8">
          <p className="text-xl md:text-2xl font-bold">{ad.price}</p>
          <p className="text-lg md:text-xl text-gray-700">{ad.description}</p>

          <ul className="grid grid-cols-2 gap-2 mt-4">
            {ad.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <ChevronRight className="h-5 w-5 text-primary mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ad-cta flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="text-lg">
            View Details
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            Contact Agent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <div ref={imagesRef} className="w-full md:w-1/2 flex flex-col gap-4 p-4 md:p-8">
        {ad.images.map((image, index) => (
          <div key={index} className="image-item relative w-full h-[200px] overflow-hidden rounded-lg">
            <Image
              src={image || "/placeholder.svg"}
              alt={`${ad.title} - Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

