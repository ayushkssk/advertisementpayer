"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdControlsProps {
  totalAds: number
  onPrevious: () => void
  onNext: () => void
  onTogglePlay: () => void
  isPlaying: boolean
}

export default function AdControls({ totalAds, onPrevious, onNext, onTogglePlay, isPlaying }: AdControlsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
    onPrevious()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalAds - 1 ? prev + 1 : prev))
    onNext()
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous</span>
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalAds }).map((_, i) => (
          <div key={i} className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-primary" : "bg-gray-300"}`} />
        ))}
      </div>

      <Button variant="outline" size="icon" onClick={onTogglePlay} className="rounded-full">
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentIndex === totalAds - 1}
        className="rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  )
}

