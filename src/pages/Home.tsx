import { useEffect, useRef, useState } from "react";
import newVid from "@/assets/Images/IMG_2205.mp4";
import banner1 from "@/assets/Images/banner-1.jpg";
import banner2 from "@/assets/Images/banner-1-B1CTPwpk_(1)[1].jpg";
import shirt1 from "@/assets/Images/shirt1.jpg";
import shirt2 from "@/assets/Images/shirt2.jpg";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="min-h-screen">
      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col mb-9 relative">
        {/* Brand Panel */}
        <div className="relative">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <Skeleton className="h-auto w-full" />
            </div>
          )}
          <img
            loading="lazy"
            src={banner2}
            alt="banner image"
            className="object-contain"
            style={{ height: "auto", width: "100%" }}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
        <div className="text-logoGreen font-opensans text-xl sm:text-2xl md:text-3xl my-14 w-[80%] mx-auto text-center ">
          Every stitch, every seam, and every detail is designed with purpose,
          embodying the balance of function and style.&nbsp;
          <span className="inline-flex items-baseline">
            House of Valor
            <sup className="ml-1 text-xs md:text-3xl align-text-top"><span className="inline-flex place-items-start justify-center w-3 h-3 rounded-full border text-xs font-semibold border-logoGreen ">
<span className=" mb-6">  ™</span>
</span></sup>
          </span>
          &nbsp;creates clothing that empowers men to navigate life's diverse roles with ease.
        </div>
        <div className="w-[90%] mx-auto">
          <div className="relative flex flex-col md:flex-row gap-3">
            {/* Image 1 */}
            <div
              onClick={() => {
                navigate("/category/products/113/SKU-171");
              }}
              className="w-full md:w-1/2 h-full"
            >
              <img
                loading="lazy"
                src={shirt1}
                alt="Contemporary Design"
                className="object-cover rounded-md w-full md:h-[670px]"
                style={{ height: "670px", width: "100%" }}
              />
            </div>

            {/* Centered Text */}
            <button className="absolute font-custom inset-0 flex items-center justify-center pointer-events-none">
              <p
                onClick={() => {
                  navigate("/category");
                }}
                className="bg-logoGreen z-10 text-white text-lg md:text-2xl px-4 py-2 pointer-events-auto"
              >
                Explore Now
              </p>
            </button>

            {/* Image 2 */}
            <div
              onClick={() => {
                navigate("/category/products/112/SKU-100");
              }}
              className="w-full md:w-1/2 h-full"
            >
              <img
                loading="lazy"
                src={shirt2}
                alt="Contemporary Design"
                className="object-cover rounded-md w-full md:h-[670px]"
                style={{ height: "670px", width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col">
        {/* Stacked Images */}
        <div className="flex flex-col sm:gap-2">
          <div className="relative">
            {!isVideoLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <Skeleton className="inset-0 w-full h-full object-cover" />
                <p className="absolute text-gray-500">Loading..</p>
              </div>
            )}
            <video
              ref={videoRef}
              className="inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onCanPlayThrough={() => setIsVideoLoaded(true)}
            >
              <source src={newVid} type="video/mp4" />
            </video>
          </div>
          <div className="relative">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <Skeleton className="inset-0 w-full h-full object-cover" />
                <p className="absolute text-gray-500">Loading..</p>
              </div>
            )}
            <img
              loading="lazy"
              src={banner2}
              alt="Holiday Collection"
              className="w-full h-full object-contain "
              style={{ height: "auto", width: "100%" }}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        </div>
        <div className="text-logoGreen font-opensans text-sm sm:text-2xl md:text-3xl my-8 sm:my-14 w-[90%] sm:w-[80%] mx-auto text-center">
          Every stitch, every seam, and every detail is designed with purpose,
          <span className="inline-flex items-baseline mr-0.5">
            House of Valor
            <sup className="ml-0.5 text-[10px] align-top justify-start ">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full border border-logoGreen font-semibold">
                <span className="text-[6px] leading-none mt-0.5">™</span>
              </span>
            </sup>
          </span>creates
          clothing that empowers men to navigate life's diverse roles with ease.
        </div>
        <div className="relative flex flex-row gap-1 sm:gap-3 mb-10 mx-2 sm:px-0">
          {/* Image 1 */}
          <img
            loading="lazy"
            src={shirt1}
            alt="Stripe Shirt"
            onClick={() => {
              navigate("/category/products/113/SKU-171");
            }}
            className="object-cover rounded-md w-1/2 h-[250px] md:h-[550px]"
            style={{ height: "250px", width: "50%" }}
          />

          {/* Centered Text */}
          <button className="flex pointer-events-none font-custom absolute inset-0 items-center justify-center">
            <p
              onClick={() => {
                navigate("/category");
              }}
              className="bg-logoGreen text-white md:text-2xl px-2 sm:px-4 sm:py-2 pointer-events-auto"
            >
              Explore Now
            </p>
          </button>

          {/* Image 2 */}
          <img
            loading="lazy"
            src={shirt2}
            alt="Solid Shirt"
            onClick={() => {
              navigate("/category/products/112/SKU-100");
            }}
            className="object-cover rounded-md  w-1/2 h-[250px] md:h-[550px]"
            style={{ height: "250px", width: "50%" }}
          />
        </div>
      </div>
    </section>
  );
}
