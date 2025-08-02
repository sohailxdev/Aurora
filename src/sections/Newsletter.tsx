"use client"
import { motion } from "framer-motion"

const Newsletter = () => {
  return (
    <section className="py-24 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.03)_0,_rgba(0,0,0,0)_50%)] animate-rotate-slow"></div>
      </div>
      <motion.div
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{ x: ["0vw", "100vw", "0vw"], y: ["0vh", "100vh", "0vh"], opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute z-0 top-0 left-0 h-24 w-24 rounded-full bg-gradient-to-br from-white/20 via-white/60 to-white/20 blur-2xl"
      ></motion.div>


      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-light mb-4">
              Join Our <span className="font-medium">Inner Circle</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Subscribe to receive exclusive offers, early access to new collections, and personalized styling advice.
            </p>
          </motion.div>

          <motion.form
            className="flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-white/90 transition-colors duration-300 font-medium"
            >
              Subscribe
            </button>
          </motion.form>

          <motion.p
            className="text-white/50 text-xs text-center mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </motion.p>

          <motion.div
            className="flex justify-center gap-8 mt-10 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <p className="text-2xl font-light">10%</p>
              <p className="text-white/60 text-sm">First Order Discount</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light">Early</p>
              <p className="text-white/60 text-sm">Collection Access</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light">Free</p>
              <p className="text-white/60 text-sm">Styling Advice</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
