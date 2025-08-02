
import { useState } from "react"
import { motion } from "framer-motion"

const collections = [
  {
    id: 1,
    name: "Celestial Dreams",
    description: "Inspired by the night sky, this collection features star and moon motifs with sparkling diamonds.",
    image: "/products-carousel/dummy-product-2.jpeg",
    accent: "from-blue-400 to-purple-500",
  },
  {
    id: 2,
    name: "Eternal Bloom",
    description: "Delicate floral designs crafted with colored gemstones that capture nature's beauty.",
    image: "/products-carousel/dummy-product-8.jpeg",
    accent: "from-pink-400 to-rose-500",
  },
  {
    id: 3,
    name: "Modern Minimalist",
    description: "Clean lines and geometric shapes for the contemporary woman who appreciates subtle elegance.",
    image: "/public/products-carousel/dummy-product-3.jpeg",
    accent: "from-gray-400 to-gray-600",
  },
  {
    id: 4,
    name: "Heritage",
    description: "Timeless designs inspired by vintage jewelry with a modern twist.",
    image: "/products-carousel/dummy-product-6.jpeg",
    accent: "from-amber-400 to-yellow-500",
  },
]

const FeaturedCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeCollection = collections[activeIndex]

  return (
    <section className="py-24 relative overflow-hidden text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light mb-4">
            Featured <span className="font-medium">Collections</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explore our curated collections, each telling a unique story through exceptional craftsmanship and design.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Collection Image */}
          <motion.div
            className="lg:w-1/2 relative rounded-2xl overflow-hidden group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            key={activeCollection.id}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

            {/* Animated gradient border */}
            <div className="absolute inset-0 p-0.5 rounded-2xl -z-20">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${activeCollection.accent} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              ></div>
              <div className="absolute inset-0.5 bg-gray-900 rounded-xl"></div>
            </div>

            <img
              src={activeCollection.image || "/products-carousel/dummy-product-4.jpeg"}
              alt={activeCollection.name}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <motion.h3
                className="text-3xl font-medium mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={`title-${activeCollection.id}`}
              >
                {activeCollection.name}
              </motion.h3>
              <motion.p
                className="text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                key={`desc-${activeCollection.id}`}
              >
                {activeCollection.description}
              </motion.p>
              <motion.button
                className="mt-6 px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-white/90 transition-colors duration-300 text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                key={`btn-${activeCollection.id}`}
              >
                Explore Collection
              </motion.button>
            </div>
          </motion.div>

          {/* Collection Selection */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-medium mb-6">Our Collections</h3>

            <div className="space-y-4">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-white/10 border border-white/20"
                      : "bg-transparent border border-white/5 hover:border-white/10"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-lg font-medium mb-2">{collection.name}</h4>
                  <p className="text-white/70 text-sm">{collection.description}</p>

                  <div
                    className={`h-0.5 w-16 mt-4 bg-gradient-to-r ${collection.accent} ${
                      activeIndex === index ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                  ></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
