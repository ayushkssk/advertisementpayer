"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, ArrowRight, MousePointer, Pause, Play } from "lucide-react"

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

interface AdSliderProps {
  ads: Ad[]
}

export default function AdSlider({ ads }: AdSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [currentImageIndices, setCurrentImageIndices] = useState<number[]>(ads.map(() => 0))
  const [activeAdIndex, setActiveAdIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('down')
  const [showScrollTip, setShowScrollTip] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [autoScrollDirection, setAutoScrollDirection] = useState<'up' | 'down'>('down')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null)

  // Hide scroll tip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollTip(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll function
  const startAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
    }
    
    autoScrollTimerRef.current = setInterval(() => {
      if (!isScrolling) {
        handleScroll(autoScrollDirection, activeAdIndex)
      }
    }, 4000) // Change image every 4 seconds
  }
  
  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }
  }
  
  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setIsAutoScrolling(prev => !prev)
  }

  const toggleScrollDirection = () => {
    setAutoScrollDirection(prev => prev === 'up' ? 'down' : 'up')
  }

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
    
    // Clean up on component unmount
    return () => {
      stopAutoScroll()
    }
  }, [isAutoScrolling, autoScrollDirection, activeAdIndex])

  // Function to handle image change on scroll
  const handleScroll = (direction: 'up' | 'down', adIndex: number) => {
    if (isScrolling) return
    
    // Set scrolling state and direction
    setIsScrolling(true)
    setTransitionDirection(direction)
    
    // After a short delay, change the image
    setTimeout(() => {
      setCurrentImageIndices(prev => {
        const newIndices = [...prev]
        const currentAd = ads[adIndex]
        
        if (direction === 'down') {
          // Next image with loop
          newIndices[adIndex] = (newIndices[adIndex] + 1) % currentAd.images.length
        } else {
          // Previous image with loop
          newIndices[adIndex] = (newIndices[adIndex] - 1 + currentAd.images.length) % currentAd.images.length
        }
        
        return newIndices
      })
      
      // After image change, reset scrolling state
      setTimeout(() => {
        setIsScrolling(false)
      }, 600)
    }, 150)
  }

  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window === "undefined") return

    const slider = sliderRef.current
    const container = containerRef.current

    if (!slider || !container) return

    // Calculate the width of the slider
    const sliderWidth = slider.scrollWidth
    const containerWidth = container.offsetWidth
    
    // Create a horizontal scrolling animation
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'mainScroll', // Add ID for reference
        trigger: container,
        pin: true,
        start: "top top",
        end: () => `+=${sliderWidth - containerWidth}`,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Calculate which ad is currently active based on scroll position
          const progress = self.progress
          const newActiveIndex = Math.min(
            Math.floor(progress * ads.length),
            ads.length - 1
          )
          
          if (newActiveIndex !== activeAdIndex) {
            setActiveAdIndex(newActiveIndex)
          }
        }
      },
    })

    // Animate the slider from right to left
    tl.to(slider, {
      x: () => -(sliderWidth - containerWidth),
      ease: "power1.inOut",
    })
    
    // Auto horizontal scrolling
    const autoHorizontalScroll = () => {
      const mainScroll = ScrollTrigger.getById('mainScroll')
      if (mainScroll && isAutoScrolling) {
        const currentProgress = mainScroll.progress
        let newProgress = currentProgress + 0.005 // Small increment for smooth scrolling
        
        // Loop back to start when reaching the end
        if (newProgress >= 1) {
          newProgress = 0
        }
        
        mainScroll.scroll(newProgress * (sliderWidth - containerWidth))
        requestAnimationFrame(autoHorizontalScroll)
      }
    }
    
    // Start auto horizontal scrolling if auto-scrolling is enabled
    if (isAutoScrolling) {
      requestAnimationFrame(autoHorizontalScroll)
    }

    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (ScrollTrigger.isInViewport(container)) {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          const mainScroll = ScrollTrigger.getById('mainScroll')
          if (mainScroll) {
            const progress = mainScroll.progress
            const newProgress = Math.min(1, progress + (1 / ads.length))
            mainScroll.scroll(newProgress * (sliderWidth - containerWidth))
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const mainScroll = ScrollTrigger.getById('mainScroll')
          if (mainScroll) {
            const progress = mainScroll.progress
            const newProgress = Math.max(0, progress - (1 / ads.length))
            mainScroll.scroll(newProgress * (sliderWidth - containerWidth))
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          handleScroll('up', activeAdIndex)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          handleScroll('down', activeAdIndex)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)

    // Add wheel event listener for image navigation
    const handleWheel = (e: WheelEvent) => {
      // If we're in the slider section
      if (ScrollTrigger.isInViewport(container)) {
        // If ScrollTrigger is pinned (we're in the slider section)
        const mainScroll = ScrollTrigger.getById('mainScroll')
        
        if (mainScroll?.isActive && !isScrolling) {
          // If we're at the start or end of horizontal scroll, allow image navigation
          const progress = mainScroll.progress
          
          if ((progress === 0 && e.deltaY < 0) || (progress === 1 && e.deltaY > 0) || 
              (progress > 0 && progress < 1)) {
            // Only prevent default if we're handling the scroll within our component
            e.preventDefault()
            handleScroll(e.deltaY > 0 ? 'down' : 'up', activeAdIndex)
          }
        }
      }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })

    // Add touch event listeners for image navigation
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      setTouchMoveX(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (touchStartX !== null && touchMoveX !== null) {
        const diff = touchMoveX - touchStartX
        if (Math.abs(diff) > 50) {
          handleScroll(diff > 0 ? 'up' : 'down', activeAdIndex)
        }
      }
      setTouchStartX(null)
      setTouchMoveX(null)
    }

    slider.addEventListener('touchstart', handleTouchStart)
    slider.addEventListener('touchmove', handleTouchMove)
    slider.addEventListener('touchend', handleTouchEnd)

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
      slider.removeEventListener('touchstart', handleTouchStart)
      slider.removeEventListener('touchmove', handleTouchMove)
      slider.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ads.length, activeAdIndex, isScrolling])

  // Function to handle image change via indicator click
  const handleImageChange = (adIndex: number, imgIndex: number) => {
    if (isScrolling) return
    
    const currentIndex = currentImageIndices[adIndex]
    const direction = imgIndex > currentIndex ? 'down' : 'up'
    
    setIsScrolling(true)
    setTransitionDirection(direction)
    
    setTimeout(() => {
      setCurrentImageIndices(prev => {
        const newIndices = [...prev]
        newIndices[adIndex] = imgIndex
        return newIndices
      })
      
      setTimeout(() => {
        setIsScrolling(false)
      }, 600)
    }, 150)
  }

  // Add navigation buttons for horizontal scrolling
  const goToNextAd = () => {
    if (activeAdIndex < ads.length - 1) {
      const mainScroll = ScrollTrigger.getById('mainScroll')
      if (mainScroll) {
        const newProgress = (activeAdIndex + 1) / ads.length
        const sliderWidth = sliderRef.current?.scrollWidth || 0
        const containerWidth = containerRef.current?.offsetWidth || 0
        mainScroll.scroll(newProgress * (sliderWidth - containerWidth))
      }
    }
  }

  const goToPrevAd = () => {
    if (activeAdIndex > 0) {
      const mainScroll = ScrollTrigger.getById('mainScroll')
      if (mainScroll) {
        const newProgress = (activeAdIndex - 1) / ads.length
        const sliderWidth = sliderRef.current?.scrollWidth || 0
        const containerWidth = containerRef.current?.offsetWidth || 0
        mainScroll.scroll(newProgress * (sliderWidth - containerWidth))
      }
    }
  }

  // Add vertical scroll controls
  const scrollUp = () => {
    handleScroll('up', activeAdIndex);
  };

  const scrollDown = () => {
    handleScroll('down', activeAdIndex);
  };

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden bg-gradient-to-br from-white to-gray-100">
      <div 
        ref={sliderRef} 
        className="flex flex-nowrap h-full" 
        style={{ width: `${ads.length * 100}vw` }}
      >
        {ads.map((ad, adIndex) => (
          <div 
            key={ad.id} 
            className="ad-section w-screen h-full flex flex-row-reverse p-0"
            style={{ 
              transform: `translateX(${adIndex === activeAdIndex ? '0' : adIndex < activeAdIndex ? '-100%' : '100%'})`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {/* Right side - Image gallery */}
            <div className="w-full md:w-2/3 h-full relative flex items-center justify-center p-8 overflow-hidden">
              {/* Images container with card-like appearance */}
              <div 
                className={`relative w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform ${
                  activeAdIndex === adIndex ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                } ${isScrolling ? 'scale-[0.97] rotate-1' : 'scale-100 rotate-0'}`}
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(0, 0, 0, 0.1) inset',
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {ad.images.map((image, imgIndex) => (
                  <div 
                    key={imgIndex}
                    className={`absolute inset-0 transition-all duration-800 ease-out ${
                      currentImageIndices[adIndex] === imgIndex 
                        ? 'opacity-100 z-10 transform-none' 
                        : `opacity-0 z-0 ${
                            transitionDirection === 'down' 
                              ? 'translate-y-full rotate-6' 
                              : 'translate-y-[-100%] rotate-[-6deg]'
                          }`
                    }`}
                    style={{
                      transformOrigin: transitionDirection === 'down' ? 'bottom' : 'top',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${ad.title} - Image ${imgIndex + 1}`}
                      fill
                      className="object-cover rounded-2xl"
                      priority={imgIndex === 0}
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    
                    {/* Image caption overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <p className="text-white text-xl font-semibold">{ad.title}</p>
                      <p className="text-white/80 text-sm">{ad.location}</p>
                    </div>
                    
                    {/* Image number */}
                    <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
                      {imgIndex + 1}/{ad.images.length}
                    </div>
                  </div>
                ))}
                
                {/* Image indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3">
                  {ad.images.map((_, imgIndex) => (
                    <button
                      key={imgIndex}
                      onClick={() => handleImageChange(adIndex, imgIndex)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentImageIndices[adIndex] === imgIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/40 w-2 hover:bg-white/70 hover:w-4'
                      }`}
                      aria-label={`View image ${imgIndex + 1}`}
                    />
                  ))}
                </div>
                
                {/* Previous/Next buttons */}
                <div className="absolute inset-0 flex items-center justify-between z-20 px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => handleScroll('up', adIndex)}
                    className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transform rotate-90 hover:bg-black/50 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => handleScroll('down', adIndex)}
                    className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transform -rotate-90 hover:bg-black/50 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {/* Scroll tip */}
              {showScrollTip && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 animate-bounce">
                  <MousePointer className="h-4 w-4" />
                  <span>Scroll up/down to navigate images</span>
                </div>
              )}
            </div>

            {/* Left side - Text content with light white shade */}
            <div className="w-full md:w-1/3 h-full flex flex-col justify-center p-8 md:p-12 bg-white/80 backdrop-blur-md relative z-10">
              <div className={`transition-all duration-700 transform ${
                activeAdIndex === adIndex ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
              }`}>
                <h2 className="ad-title text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gray-900">{ad.title}</h2>
                <h3 className="ad-title text-xl md:text-2xl font-medium mb-8 text-gray-700">{ad.location}</h3>

                <div className="ad-details space-y-4 mb-8">
                  <p className="text-xl md:text-2xl font-bold text-primary">{ad.price}</p>
                  <p className="text-base md:text-lg text-gray-600">{ad.description}</p>

                  <ul className="grid grid-cols-1 gap-3 mt-6">
                    {ad.features.map((feature, index) => (
                      <li key={index} className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm transform transition-transform hover:translate-x-1">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ad-cta flex flex-col sm:flex-row gap-4 mt-8">
                  <Button size="lg" className="text-lg relative overflow-hidden group">
                    <span className="relative z-10">View Details</span>
                    <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Contact Agent
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
        {ads.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-all duration-500 ${
              activeAdIndex === index 
                ? 'bg-primary w-8' 
                : 'bg-gray-300 w-3'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4">
        {/* Navigation buttons removed as only one ad is present */}
      </div>
      
      {/* Auto-scroll controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button 
          className="bg-white/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 transition-all"
          onClick={toggleAutoScroll}
          aria-label={isAutoScrolling ? "Pause auto-scroll" : "Play auto-scroll"}
        >
          {isAutoScrolling ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button 
          className="bg-white/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 transition-all"
          onClick={toggleScrollDirection}
          aria-label={autoScrollDirection === 'up' ? "Switch to down" : "Switch to up"}
        >
          {autoScrollDirection === 'up' ? <ChevronRight className="h-6 w-6 -rotate-90" /> : <ChevronRight className="h-6 w-6 rotate-90" />}
        </button>
      </div>
    </div>
  )
}
