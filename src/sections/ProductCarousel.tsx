"use client"

import { useState, useRef } from "react"
// import Image from "next/image"
import { motion, AnimatePresence, useMotionValue } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample product data - replace with your actual data
const products = [
  {
    id: 1,
    name: "Diamond Eternity Ring",
    price: "₹2,499",
    image: "/products-carousel/dummy-product-1.jpeg",
    description: "18K White Gold Diamond Eternity Ring featuring 2.5 carats of brilliant cut diamonds.",
  },
  {
    id: 2,
    name: "Sapphire Pendant",
    price: "₹1,899",
    image: "/products-carousel/dummy-product-9.jpeg",
    description: "Elegant blue sapphire pendant with diamond halo in 14K yellow gold.",
  },
  {
    id: 3,
    name: "Pearl Earrings",
    price: "₹899",
    image: "/products-carousel/dummy-product-3.jpeg",
    description: "South Sea pearl drop earrings with diamond accents in 18K rose gold.",
  },
  {
    id: 4,
    name: "Gold Chain Bracelet",
    price: "₹1,299",
    image: "/products-carousel/dummy-product-4.jpeg",
    description: "Italian crafted 14K gold chain bracelet with custom clasp design.",
  },
  {
    id: 5,
    name: "Emerald Cocktail Ring",
    price: "₹3,499",
    image: "/products-carousel/dummy-product-5.jpeg",
    description: "Statement emerald cocktail ring surrounded by diamonds in platinum setting.",
  },
]

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const constraintsRef = useRef(null)
  const x = useMotionValue(0)

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1))
  }

  // Calculate indices for visible products
  const getVisibleIndices = () => {
    const nextIndex = (currentIndex + 1) % products.length
    const nextNextIndex = (currentIndex + 2) % products.length
    return [currentIndex, nextIndex, nextNextIndex]
  }

  const visibleIndices = getVisibleIndices()

  return (
    <div className="relative w-full  text-white py-16 overflow-hidden">
      {/* Shine effect background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_center,_rgba(100,100,100,0.1)_0,_rgba(0,0,0,0)_50%)] animate-rotate-slow"></div>
        <div className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0,_rgba(0,0,0,0)_40%)] animate-rotate-slow-reverse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-white">
            Exquisite Collection
          </span>
        </h2>

        <div className="relative" ref={constraintsRef}>
          <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
            <AnimatePresence initial={false} custom={direction}>
              {visibleIndices.map((productIndex, i) => {
                const product = products[productIndex]
                const isFeatured = i === 0

                return (
                  <motion.div
                    key={product.id}
                    custom={direction}
                    initial={
                      i === 0 && direction !== 0
                        ? { x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.8 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    animate={{
                      x: 0,
                      opacity: 1,
                      scale: isFeatured ? 1 : 0.7,
                      zIndex: isFeatured ? 10 : 5 - i,
                    }}
                    exit={
                      (i === 2 && direction > 0) || (i === 0 && direction < 0)
                        ? { x: direction > 0 ? -300 : 300, opacity: 0, scale: 0.8 }
                        : { opacity: 0 }
                    }
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                    }}
                    className={`relative ${isFeatured ? "w-72 h-72 md:w-96 md:h-96" : "w-48 h-48 md:w-64 md:h-64"} flex-shrink-0`}
                  >
                    <div
                      className={`
                      relative w-full h-full rounded-lg overflow-hidden
                      ${isFeatured ? "border-2 border-white/30" : "border border-gray-800"}
                      transition-all duration-500 group
                    `}
                    >
                      {/* Shine overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                      {/* Moving shine effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 overflow-hidden pointer-events-none">
                        <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0,_rgba(255,255,255,0)_60%)] w-[20%] h-[20%] group-hover:animate-shine"></div>
                      </div>

                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />

                      {isFeatured && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                          <p className="text-white/80 text-sm mb-1">{product.description}</p>
                          <p className="text-white font-bold">{product.price}</p>
                        </div>
                      )}
                    </div>

                    {!isFeatured && (
                      <div className="absolute -bottom-2 left-0 right-0 text-center">
                        <p className="text-xs text-white font-medium truncate px-2">{product.name}</p>
                        <p className="text-xs text-white/80">{product.price}</p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:translate-x-0 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full border border-white/30 backdrop-blur-sm z-20"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full border border-white/30 backdrop-blur-sm z-20"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Product indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
