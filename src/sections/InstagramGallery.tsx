"use client"
import { motion } from "framer-motion"

const instagramPosts = [
  {
    id: 1,
    image: "/model-product/model1.jpeg",
    likes: 245,
    comments: 18,
  },
  {
    id: 2,
    image: "/model-product/model2.jpeg",
    likes: 312,
    comments: 24,
  },
  {
    id: 3,
    image: "/model-product/model3.jpeg",
    likes: 189,
    comments: 12,
  },
  {
    id: 4,
    image: "/model-product/model4.jpeg",
    likes: 276,
    comments: 31,
  },
  {
    id: 5,
    image: "/model-product/model5.jpeg",
    likes: 421,
    comments: 42,
  },
  {
    id: 6,
    image: "/model-product/model6.jpeg",
    likes: 198,
    comments: 15,
  },
]

const InstagramGallery = () => {
  return (
    <section className="py-24 relative text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light mb-4">
            Follow Our <span className="font-medium">Journey</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join our community on Instagram and discover how our clients style their favorite pieces.
          </p>
          <p className="text-lg mt-2">
            <span className="text-white/90">@</span>
            <span className="font-medium">AururaJewelry</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="relative group overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <img
                src={post.image || "/placeholder.svg"}
                alt={`Instagram post ${post.id}`}
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                      />
                    </svg>
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors duration-300">
            View Instagram Profile
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default InstagramGallery
