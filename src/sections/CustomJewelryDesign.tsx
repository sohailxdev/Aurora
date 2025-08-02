"use client"
import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Schedule a one-on-one consultation with our design experts to discuss your vision, preferences, and budget.",
  },
  {
    number: "02",
    title: "Design",
    description: "Our artisans create detailed sketches and 3D renderings of your custom piece for your approval.",
  },
  {
    number: "03",
    title: "Creation",
    description:
      "Once approved, our master craftspeople bring your design to life using the finest materials and techniques.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Your finished piece is presented in our signature packaging, complete with care instructions and certification.",
  },
]

const CustomJewelryDesign = () => {
  return (
    <section className="py-24 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0,_rgba(0,0,0,0)_40%)] animate-rotate-slow-reverse"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left side image */}
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 border border-white/10 rounded-xl"></div>
              <div className="absolute -inset-8 border border-white/5 rounded-xl"></div>
              <img
                src="/products-carousel/dummy-product-1.jpeg"
                alt="Custom Jewelry Design Process"
                className="rounded-lg w-full h-auto relative z-10"
              />

              {/* Floating elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 z-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-sm">
                  <span className="block text-xl font-medium mb-1">100+</span>
                  Custom Designs Monthly
                </p>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 z-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="text-sm">
                  <span className="block text-xl font-medium mb-1">98%</span>
                  Client Satisfaction
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side content */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light mb-4">
              Create Your <span className="font-medium">Dream Piece</span>
            </h2>
            <p className="text-white/70 mb-8">
              Your story is unique, and your jewelry should be too. Our bespoke design service allows you to create a
              one-of-a-kind piece that perfectly captures your personal style and sentiment.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0">
                    <span className="inline-block w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-medium">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="mt-10 px-8 py-3 bg-white text-gray-900 rounded-full hover:bg-white/90 transition-colors duration-300 font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Schedule Consultation
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CustomJewelryDesign
