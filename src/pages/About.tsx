import {
  HeadphonesIcon,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Valor from "@/assets/Images/velor_(1)[1].png";
import cotton from "@/assets/Images/pexels-cottonbro-4621659.jpg";
import fabricLogo from "@/assets/Images/Untitled design-2.png";
// import streetSignBoard from "@/assets/Images/Street_Sign_Mockup (2).jpg";
import streetSignBoard from "@/assets/Images/sign_board.jpg[1].png";

import about from "@/assets/Images/about.png";
import mens1 from "@/assets/Images/abt2.jpeg";
import mens2 from "@/assets/Images/mens2.jpg";
import logoNew from "@/assets/Images/Logo.png";

const bannerItems = [
  { icon: <Package className="w-4 h-4" />, text: "ELEVATED PACKAGING" },
  {
    icon: <HeadphonesIcon className="w-4 h-4" />,
    text: "WHITE GLOVE CUSTOMER SUPPORT",
  },
  { icon: <Truck className="w-4 h-4" />, text: "FREE SHIPPING" },
  { icon: <RotateCcw className="w-4 h-4" />, text: "30 DAYS FREE RETURN" },
  {
    icon: <ShoppingBag className="w-4 h-4" />,
    text: "CURATED SHOPPING EXPERIENCE",
  },
];

const About = () => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const startAnimation = () => {
    controls.start({
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);
  return (
    <main className="min-h-screen px-4 relative mx-auto">
      {/* Top logo section */}

      <div className="max-w-7xl mx-auto">
        <div className="w-full mb-10">
          <img
            src={streetSignBoard}
            // src = {`src\assets\Images\sign_board.jpg[1].png`}
            alt="House Of Valor Sign"
            className="w-full object-contain max-h-screen"
          />
        </div>
        {/* First content section */}
        <div className="flex flex-row relative gap-4 sm:gap-7">
          <div className="w-1/2">
            <p className="text-logoGreen font-opensans  text-xs sm:text-sm md:text-2xl">
                        {/* <span className="inline-flex items-baseline">
            House of Valor
             <sup className="ml-1  text-xs align-text-top  mr-1.5"><span className="inline-flex place-items-start justify-center w-3 h-3 rounded-full border text-xs font-semibold border-logoGreen ">
<span className=" mb-6">  ™</span>
</span></sup>
          </span> */}

           <span className="inline-flex items-baseline mr-0.5 ml-0.5 md:mr-0 md:ml-0.5 ">
            House of Valor
            <sup className="ml-0.5 md:ml-0.5 md:text-xs md:align-text-top md:mr-1.5 text-[10px] align-top justify-start mr-0.5">
              <span className="inline-flex items-center justify-center w-2 h-2 md:w-3 md:h-3 rounded-full border border-logoGreen font-semibold">
                <span className="text-[6px] leading-none mt-0.5 md:text-[10px] lg:mt-1">™</span>
              </span>
            </sup>
          </span>
 was founded on a profound yet effortless vision: to
              create a fashion line that speaks to the modern man—the provider,
              the protector, and the cornerstone of his family and community.
              With every garment,            <span className="inline-flex items-baseline mr-0.5 ml-0.5 md:mr-0 md:ml-0.5 ">
            House of Valor
            <sup className="ml-0.5 md:ml-0.5 md:text-xs md:align-text-top md:mr-1.5 text-[10px] align-top justify-start mr-0.5">
              <span className="inline-flex items-center justify-center w-2 h-2 md:w-3 md:h-3 rounded-full border border-logoGreen font-semibold">
                <span className="text-[6px] leading-none mt-0.5 md:text-[10px] lg:mt-1">™</span>
              </span>
            </sup>
          </span>
celebrates the strength,
              resilience, and depth of today's men, acknowledging that true
              masculinity is as much about vulnerability and grace as it is
              about ambition and power.
            </p>
          </div>
          <div className="w-1/2 relative flex gap-4 items-start">
            <img
              src={mens1}
              alt="Men in stylish clothing"
              className="object-cover w-[90%] max-h-[500px]"
            />
            <p className="absolute left-full top-0 sm:-ml-4 font-custom text-logoGreen transform rotate-90 origin-left text-sm sm:text-lg md:text-xl whitespace-nowrap">
              Born to Break the Ordinary
            </p>
          </div>
        </div>

        {/* Logo and description section */}
        <div className="flex flex-row mb-10 ">
          <div className="w-1/2 sm:w-1/3 flex items-start">
            {/* <img src={logoNew} */}
            <img src ={Valor} />
             {/* alt="" className="w-full" /> */}
          </div>
          <div className="w-1/2 sm:w-2/3 flex justify-end items-end sm:justify-center sm:items-center">
            <p className="text-logoGreen  font-opensans text-xs sm:text-sm md:text-2xl">
              The bull, the emblem of          <span className="inline-flex items-baseline mr-0.5 ml-0.5 md:mr-0 md:ml-0.5 ">
            House of Valor
            <sup className="ml-0.5 md:ml-0.5 md:text-xs md:align-text-top md:mr-1.5 text-[10px] align-top justify-start ">
              <span className="inline-flex items-center justify-center w-2 h-2 md:w-3 md:h-3 rounded-full border border-logoGreen font-semibold">
                <span className="text-[6px] leading-none mt-0.5 md:text-[10px] lg:mt-1">™</span>
              </span>
            </sup>
          </span>
, stands as a symbol of
              strength, determination, and perseverance. It mirrors the modern
              man's journey—a life driven by purpose, guided by principles, and
              fueled by an unrelenting desire to provide, inspire, and thrive
            </p>
          </div>
        </div>

        {/* Third content section */}
        <div className="flex flex-row gap-2 sm:gap-7 mb-10 relative">
          <div className="relative flex w-1/2 justify-center items-center">
            <img
              src={mens2}
              alt="Men in stylish clothing"
              className="object-contain sm:object-cover w-[90%] max-h-[600px] pl-3"
            />
            <p className="absolute left-0 bottom-10 sm:ml-4 font-custom text-logoGreen transform -rotate-90 origin-left text-sm sm:text-lg md:text-xl whitespace-nowrap">
              Fashion with Purpose and Integrity
            </p>
          </div>
          <div className="w-1/2">
            <p className="text-logoGreen  font-opensans text-xs sm:text-sm md:text-2xl">
              We are more than a clothing brand; it's a movement that recognizes
              and celebrates the everyday triumphs of men who lead with
              integrity and strength. From ambitious achievers to unwavering
              family men, the brand honours every facet of what it means to be a
              man in today's world. Together, let's redefine masculinity with
              purpose, confidence, and, above all, Valor.
            </p>
          </div>
          <div className="w-1/4 relative">
            <img
              src={fabricLogo}
              alt="House of Valor pattern"
              className="w-[100%]"
            />
          </div>
        </div>

        {/* Pattern image section */}
        <div className="flex flex-row gap-4 relative mb-10">
          <div className="w-1/2">
            <p className="text-logoGreen  font-opensans text-xs sm:text-sm md:text-2xl mb-4">
              Every stitch, every seam, and every detail is designed with
              purpose, embodying the balance of function and style.
            </p>
          </div>
          <div className="w-1/2 mb-6 flex gap-2">
            <img
              src={cotton}
              alt="House Of Valor clothing"
              className="w-[100%] sm:w-[90%] object-cover pr-3"
            />
            <h2 className="font-custom text-logoGreen transform rotate-90 whitespace-nowrap text-xs md:text-2xl absolute bottom-14 top-4 sm:top-0 sm:-right-8 -right-[5.5rem]">
              A Legacy of Strength, Tailored for You
            </h2>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
