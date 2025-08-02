import { motion } from "framer-motion"

// Icons
const CraftsmanshipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
    />
  </svg>
)

const EthicalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>
)

const WarrantyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
)

const ReviewsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
)

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
  testimonial = null,
  customerImage = null,
  customerName = null,
}) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-white/10 text-white group-hover:bg-white/15 transition-colors duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-white/70 mb-4">{description}</p>

          {testimonial && (
            <motion.div
              className="mt-6 pt-4 border-t border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-white/80 italic text-sm mb-3">"{testimonial}"</p>
              <div className="flex items-center gap-3">
                {customerImage && (
                  <img
                    src={customerImage || "/placeholder.svg"}
                    alt={customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{customerName}</p>
                  <div className="flex text-yellow-400 text-xs">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const WhyOurJewelry = () => {
  return (
    <section className="py-24 relative overflow-hidden text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.03)_0,_rgba(0,0,0,0)_50%)] animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl font-light mb-4">
            Why Our <span className="font-medium">Jewelry</span>?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We combine traditional craftsmanship with modern design to create pieces that are not just beautiful, but
            meaningful.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<CraftsmanshipIcon />}
            title="Exceptional Craftsmanship"
            description="Each piece is meticulously handcrafted by our master artisans with decades of experience, ensuring unparalleled quality and attention to detail."
            delay={0.1}
            testimonial="The detail in my engagement ring is unlike anything I've seen before. You can truly see the craftsmanship in every angle."
            customerImage="/customers/customer1.jpg"
            customerName="Sophia Chen"
          />

          <FeatureCard
            icon={<EthicalIcon />}
            title="Ethical Sourcing"
            description="We are committed to responsible sourcing practices, using only conflict-free diamonds and recycled precious metals to create sustainable luxury."
            delay={0.2}
            testimonial="Knowing my jewelry comes from ethical sources makes wearing these beautiful pieces even more special."
            customerImage="/customers/customer2.jpg"
            customerName="James Wilson"
          />

          <FeatureCard
            icon={<WarrantyIcon />}
            title="Lifetime Warranty"
            description="We stand behind our craftsmanship with a comprehensive lifetime warranty, offering complimentary cleaning, polishing, and repairs for the life of your jewelry."
            delay={0.3}
            testimonial="Their warranty service is exceptional. My pendant was restored to its original beauty after years of wear, at no cost."
            customerImage="/customers/customer3.jpg"
            customerName="Amara Patel"
          />

          <FeatureCard
            icon={<ReviewsIcon />}
            title="Authentic Customer Experiences"
            description="Don't just take our word for it. Our clients' experiences speak volumes about our commitment to quality and service excellence."
            delay={0.4}
            testimonial="The custom design process was collaborative and exciting. They captured exactly what I wanted for our anniversary gift."
            customerImage="/customers/customer4.jpg"
            customerName="Michael Rodriguez"
          />
        </div>
      </div>
    </section>
  )
}

export default WhyOurJewelry
