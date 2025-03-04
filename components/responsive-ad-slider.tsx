"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import AdSection from "./ad-section"
import AdControls from "./ad-controls"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface Ad {
  id: number
  title: string
  location: string
  images: string[]
  description: string
  price: string
  features: string[]
}

interface ResponsiveAdSliderProps {
  ads: Ad[]
}

export default function ResponsiveAdSlider({ ads }: ResponsiveAdSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize GSAP animations
  useEffect(() => {
    if (typeof window === "undefined" || !sliderRef.current) return

    // Create a timeline for the slider
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
    })

    // Set up animations for each ad section
    const sections = sliderRef.current.querySelectorAll(".ad-section")
    const sectionWidth = window.innerWidth

    // Initial position (all sections to the right)
    gsap.set(sections, { x: sectionWidth })
    gsap.set(sections[0], { x: 0 }) // First section visible

    // Create animations for each section
    sections.forEach((section, i) => {
      if (i === 0) return // Skip first section as it's already visible

      // Move previous section out to the left and bring current section in from the right
      tl.to(sections[i - 1], { x: -sectionWidth, duration: 1 }, `section${i}`).to(
        sections[i],
        { x: 0, duration: 1 },
        `section${i}`,
      )
    })

    timelineRef.current = tl

    // Clean up
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [])

  // Handle autoplay
  useEffect(() => {
    if (!timelineRef.current) return

    if (isPlaying) {
      autoplayRef.current = setInterval(() => {
        const progress = timelineRef.current?.progress() || 0
        if (progress >= 1) {
          timelineRef.current?.progress(0)
        } else {
          const nextLabel = `section${Math.floor(progress * ads.length) + 1}`
          if (timelineRef.current?.labels[nextLabel] !== undefined) {
            timelineRef.current?.play(nextLabel)
          } else {
            timelineRef.current?.progress(0)
          }
        }
      }, 5000)
    } else if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [isPlaying, ads.length])

  const handlePrevious = () => {
    if (!timelineRef.current) return

    const progress = timelineRef.current.progress()
    const currentSection = Math.floor(progress * ads.length)

    if (currentSection > 0) {
      timelineRef.current.play(`section${currentSection}`)
    } else {
      timelineRef.current.progress(0)
    }
  }

  const handleNext = () => {
    if (!timelineRef.current) return

    const progress = timelineRef.current.progress()
    const currentSection = Math.floor(progress * ads.length)

    if (currentSection < ads.length - 1) {
      timelineRef.current.play(`section${currentSection + 1}`)
    }
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={sliderRef} className="w-full h-full">
        {ads.map((ad, index) => (
          <div key={ad.id} className={`ad-section absolute top-0 left-0 w-full h-full ${index === 0 ? "z-10" : "z-0"}`}>
            <AdSection ad={ad} />
          </div>
        ))}
      </div>

      <AdControls
        totalAds={ads.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePlay={togglePlay}
        isPlaying={isPlaying}
      />
    </div>
  )
}

