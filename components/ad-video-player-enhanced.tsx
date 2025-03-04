"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
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

interface AdVideoPlayerEnhancedProps {
  ads: Ad[]
}

export default function AdVideoPlayerEnhanced({ ads }: AdVideoPlayerEnhancedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Initialize the GSAP animation
  useEffect(() => {
    if (!containerRef.current) return

    // Create a master timeline
    const masterTimeline = gsap.timeline({
      paused: true,
      onUpdate: () => {
        // Update progress for progress bar
        if (timelineRef.current) {
          const currentProgress = timelineRef.current.progress()
          setProgress(currentProgress * 100)

          // Calculate current time based on total duration
          setCurrentTime(currentProgress * duration)

          // Update current ad index based on timeline progress
          const newIndex = Math.min(Math.floor(currentProgress * ads.length), ads.length - 1)
          setCurrentAdIndex(newIndex)
        }
      },
      onComplete: () => {
        // Loop the animation when it completes
        if (timelineRef.current) {
          timelineRef.current.restart()
        }
      },
    })

    // Get all ad elements
    const adElements = containerRef.current.querySelectorAll(".ad-container")

    // Set initial positions - all ads start off-screen to the right
    gsap.set(adElements, { xPercent: 100 })

    // Calculate total duration (15 seconds per ad)
    const totalDuration = ads.length * 15
    setDuration(totalDuration)

    // Create a sequence of animations for each ad
    adElements.forEach((adElement, index) => {
      const adTimeline = gsap.timeline()

      // Animate the ad content elements
      const titleElement = adElement.querySelector(".ad-title")
      const locationElement = adElement.querySelector(".ad-location")
      const detailsElement = adElement.querySelector(".ad-details")
      const ctaElement = adElement.querySelector(".ad-cta")
      const imageElement = adElement.querySelector(".ad-image")

      // Set initial states
      gsap.set([titleElement, locationElement, detailsElement, ctaElement], {
        autoAlpha: 0,
        y: 20,
      })
      gsap.set(imageElement, {
        autoAlpha: 0,
        scale: 1.1,
      })

      // Move the ad from right to left
      adTimeline
        .to(adElement, {
          xPercent: 0,
          duration: 1.5,
          ease: "power2.out",
        })
        // Animate in the content
        .to(
          titleElement,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5",
        )
        .to(
          locationElement,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          imageElement,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.8",
        )
        .to(
          detailsElement,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          ctaElement,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        )
        // Hold for a while
        .to({}, { duration: 8 })
        // Move the ad out to the left
        .to(adElement, {
          xPercent: -100,
          duration: 1.5,
          ease: "power2.in",
        })

      // Add the ad's timeline to the master timeline
      masterTimeline.add(adTimeline, index > 0 ? "-=1" : 0) // Slight overlap for smoother transitions
    })

    // Store the timeline reference
    timelineRef.current = masterTimeline

    // Start playing
    masterTimeline.play()

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [ads.length, duration])

  // Handle play/pause
  useEffect(() => {
    if (!timelineRef.current) return

    if (isPlaying) {
      timelineRef.current.play()
    } else {
      timelineRef.current.pause()
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handlePrevious = () => {
    if (!timelineRef.current) return

    // Go to previous ad
    const newIndex = Math.max(0, currentAdIndex - 1)
    const targetProgress = newIndex / ads.length
    timelineRef.current.progress(targetProgress)
    setCurrentAdIndex(newIndex)
  }

  const handleNext = () => {
    if (!timelineRef.current) return

    // Go to next ad
    const newIndex = Math.min(ads.length - 1, currentAdIndex + 1)
    const targetProgress = newIndex / ads.length
    timelineRef.current.progress(targetProgress)
    setCurrentAdIndex(newIndex)
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !e.currentTarget) return

    // Calculate click position as percentage of progress bar width
    const rect = e.currentTarget.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    // Set timeline to that position
    timelineRef.current.progress(clickPosition)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video-like container */}
      <div ref={containerRef} className="w-full h-full relative">
        {ads.map((ad, index) => (
          <div key={ad.id} className="ad-container absolute top-0 left-0 w-full h-full flex flex-col md:flex-row">
            {/* Left side - Text content */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 bg-white">
              <h2 className="ad-title text-5xl md:text-6xl font-bold mb-2">{ad.title}</h2>
              <h3 className="ad-location text-2xl md:text-3xl font-medium mb-8">{ad.location}</h3>

              <div className="ad-details space-y-4 mb-8">
                <p className="text-3xl font-bold">{ad.price}</p>
                <p className="text-xl text-gray-700">{ad.description}</p>

                <ul className="grid grid-cols-2 gap-2 mt-4">
                  {ad.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-lg">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ad-cta flex flex-col sm:flex-row gap-4 mt-auto">
                <Button size="lg" className="text-lg">
                  View Details
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Contact Agent
                </Button>
              </div>
            </div>

            {/* Right side - Images */}
            <div className="w-full md:w-1/2 h-full bg-gray-100">
              <div className="ad-image relative w-full h-full">
                <Image
                  src={ad.images[0] || "/placeholder.svg"}
                  alt={`${ad.title} - Main Image`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <p className="text-xl font-semibold">{ad.title}</p>
                  <p>{ad.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video controls */}
      <div className="absolute bottom-12 left-0 w-full px-4 z-50">
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-4" onClick={handleProgressBarClick}>
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full bg-white/90 backdrop-blur-sm"
            >
              <SkipBack className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="rounded-full bg-white/90 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full bg-white/90 backdrop-blur-sm"
            >
              <SkipForward className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleMuteToggle}
            className="rounded-full bg-white/90 backdrop-blur-sm"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

