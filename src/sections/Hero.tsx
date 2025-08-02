import GLBViewer from "@/pages/jewellary/GLBViewer"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <div className="h-max flex py-24  justify-between items-center w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.03)_0,_rgba(0,0,0,0)_50%)] animate-rotate-slow"></div>
        <div className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0,_rgba(0,0,0,0)_40%)] animate-rotate-slow-reverse"></div>
      </div>

      {/* Left side content */}
      <motion.div
        className="w-1/2 h-full flex flex-col justify-center pl-16 pr-8"
        initial={{ opacity: 0, x: -0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-4"
        >
          <span className="inline-block px-4 text-white py-1 border border-white/20 rounded-full text-sm tracking-wider bg-white/5 backdrop-blur-sm">
            HANDCRAFTED LUXURY
          </span>
        </motion.div>

        <motion.h1
          className="text-6xl font-light mb-6 leading-tight tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="block text-gray-200">Timeless</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-white font-medium">
            Elegance
          </span>
          <span className="block text-gray-300">Redefined</span>
        </motion.h1>

        <motion.p
          className="text-white/80 text-lg mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Discover our exquisite collection of fine jewelry, where artistry meets innovation to create pieces that
          transcend time.
        </motion.p>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button className="px-8 py-3 bg-white text-gray-900 rounded-full hover:bg-white/90 transition-colors duration-300 font-medium">
            Explore Collection
          </button>
          <button className="px-8 py-3 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors duration-300">
            Book Consultation
          </button>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          className="flex text-white gap-12 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div>
            <p className="text-3xl font-light">15+</p>
            <p className="text-white/60 text-sm">Years of Excellence</p>
          </div>
          <div>
            <p className="text-3xl font-light">5K+</p>
            <p className="text-white/60 text-sm">Happy Clients</p>
          </div>
          <div>
            <p className="text-3xl font-light">100%</p>
            <p className="text-white/60 text-sm">Authentic Materials</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right side with 3D model */}
      <GLBViewer />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <p className="text-white/60 text-sm mb-2">Scroll to explore</p>
        <div className="w-0.5 h-8 bg-white/20 relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-white absolute top-0"
            animate={{
              top: ["0%", "100%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
