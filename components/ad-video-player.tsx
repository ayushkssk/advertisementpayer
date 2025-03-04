"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
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

interface AdVideoPlayerProps {
  ads: Ad[]
}

export default function AdVideoPlayer({ ads }: AdVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>(ads.map(() => 0))
  const [progress, setProgress] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const [showScrollTip, setShowScrollTip] = useState(false)
  
  // Function to cycle through images for a specific ad
  const cycleImages = (adIndex: number) => {
    // First fade out text
    setTextVisible(false)
    
    // After text fades out, change the image
    setTimeout(() => {
      setCurrentImageIndex(prev => {
        const newState = [...prev]
        const currentAd = ads[adIndex]
        if (!currentAd) return prev
        
        newState[adIndex] = (newState[adIndex] + 1) % currentAd.images.length
        return newState
      })
      
      // Then fade text back in
      setTimeout(() => {
        setTextVisible(true)
      }, 300)
    }, 300)
  }

  // Initialize the GSAP animation
  useEffect(() => {
    if (!containerRef.current) return

    // Create a master timeline
    const masterTimeline = gsap.timeline({
      paused: true,
      onUpdate: () => {
        // Update progress for progress bar
        if (timelineRef.current) {
          setProgress(timelineRef.current.progress() * 100)
        }

        // Update current ad index based on timeline progress
        if (timelineRef.current) {
          const currentProgress = timelineRef.current.progress()
          const newIndex = Math.min(Math.floor(currentProgress * ads.length), ads.length - 1)
          if (currentAdIndex !== newIndex) {
            setCurrentAdIndex(newIndex)
            // Reset text visibility when changing ads
            setTextVisible(true)
          }
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

    // Create a sequence of animations for each ad
    adElements.forEach((adElement, index) => {
      const adTimeline = gsap.timeline()

      // Move the ad from right to left
      adTimeline.to(adElement, {
        xPercent: -100,
        duration: 15, // Longer duration for slower movement
        ease: "none",
      })

      // Add the ad's timeline to the master timeline
      masterTimeline.add(adTimeline, index > 0 ? "-=2" : 0) // Overlap for smoother transitions
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
  }, [ads.length, currentAdIndex])

  // Setup image rotation intervals for each ad
  useEffect(() => {
    // Create intervals for each ad to cycle through its images
    const intervals = ads.map((_, index) => {
      return setInterval(() => {
        if (index === currentAdIndex && isPlaying) {
          cycleImages(index)
        }
      }, 5000) // Change image every 5 seconds
    })
    
    // Cleanup intervals
    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [ads, currentAdIndex, isPlaying])

  // Handle play/pause
  useEffect(() => {
    if (!timelineRef.current) return

    if (isPlaying) {
      timelineRef.current.play()
      setShowScrollTip(false)
    } else {
      timelineRef.current.pause()
      // Show scroll tip when paused
      setShowScrollTip(true)
    }
  }, [isPlaying])
  
  // Add scroll event listener for image navigation when paused
  useEffect(() => {
    if (!isPlaying) {
      const handleWheel = (e: WheelEvent) => {
        if (!isPlaying) {
          if (e.deltaY > 0) {
            // Scroll down - next image
            cycleImages(currentAdIndex)
          } else if (e.deltaY < 0) {
            // Scroll up - previous image
            const prevImageIndex = (currentImageIndex[currentAdIndex] - 1 + ads[currentAdIndex].images.length) % ads[currentAdIndex].images.length
            selectImage(currentAdIndex, prevImageIndex)
          }
        }
      }
      
      window.addEventListener('wheel', handleWheel)
      return () => {
        window.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isPlaying, currentAdIndex, currentImageIndex, ads])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
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
  
  // Function to manually select an image
  const selectImage = (adIndex: number, imageIndex: number) => {
    // First fade out text
    setTextVisible(false)
    
    // After text fades out, change the image
    setTimeout(() => {
      setCurrentImageIndex(prev => {
        const newState = [...prev]
        newState[adIndex] = imageIndex
        return newState
      })
      
      // Then fade text back in
      setTimeout(() => {
        setTextVisible(true)
      }, 300)
    }, 300)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Video-like container */}
      <div ref={containerRef} className="w-full h-full relative">
        {ads.map((ad, index) => (
          <div key={ad.id} className="ad-container absolute top-0 left-0 w-full h-full flex flex-row">
            {/* Left side - Text content with fade transition */}
            <div className="w-1/2 h-full flex flex-col justify-center p-8 bg-white">
              <div className={`transition-opacity duration-300 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-5xl md:text-6xl font-bold mb-2">{ad.title}</h2>
                <h3 className="text-2xl md:text-3xl font-medium mb-8">{ad.location}</h3>

                <div className="space-y-4 mb-8">
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

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Button size="lg" className="text-lg">
                    View Details
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg">
                    Contact Agent
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Images with transition */}
            <div className="w-1/2 h-full bg-white relative">
              {ad.images.map((image, imgIndex) => (
                <div 
                  key={imgIndex}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentImageIndex[index] === imgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${ad.title} - Image ${imgIndex + 1}`}
                      fill
                      className="object-cover"
                      priority={imgIndex === 0}
                      sizes="50vw"
                      unoptimized={false}
                    />
                  </div>
                </div>
              ))}
              
              {/* Scroll tip message */}
              {showScrollTip && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 text-white px-4 py-2 rounded-full text-sm animate-bounce">
                  Scroll up/down to navigate between images
                </div>
              )}
              
              {/* Image dot indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2">
                {ad.images.map((_, imgIndex) => (
                  <button
                    key={imgIndex}
                    onClick={() => selectImage(index, imgIndex)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentImageIndex[index] === imgIndex 
                        ? 'bg-primary scale-110' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View image ${imgIndex + 1}`}
                  />
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                <p className="text-xl font-semibold">{ad.title}</p>
                <p>{ad.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg">
        <Button variant="outline" size="icon" onClick={handlePrevious} className="rounded-full">
          <SkipBack className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>

        <Button variant="outline" size="icon" onClick={handlePlayPause} className="rounded-full">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
          <SkipForward className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div className="h-full bg-primary transition-all duration-300 ease-linear" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
