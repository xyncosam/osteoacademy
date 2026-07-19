'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { nextSlideIndex } from './HeroSlideshow.logic'

const SLIDE_INTERVAL_MS = 6000

const SLIDES = [
  '/images/img-2093.jpg',
  '/images/img-2100.jpg',
  '/images/img-2777.jpg',
  '/images/6f1a9529.jpg',
  '/images/img-2016.jpg',
  '/images/6f1a9506.jpg',
]

export function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => nextSlideIndex(current, SLIDES.length))
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {SLIDES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-forest-900/70" />
    </div>
  )
}
