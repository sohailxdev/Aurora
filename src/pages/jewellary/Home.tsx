import Layout from "@/Layout";
import CustomJewelryDesign from "@/sections/CustomJewelryDesign";
import FeaturedCollection from "@/sections/FeaturedCollection";
import Hero from "@/sections/Hero";
import InstagramGallery from "@/sections/InstagramGallery";
import Newsletter from "@/sections/Newsletter";
import ProductCarousel from "@/sections/ProductCarousel";
import WhyOurJewelry from "@/sections/WhyOurJewellery";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <ProductCarousel />
      <section className="my-24 w-full py-12 alumni-sans-pinstripe-regular  border-t-white border-t-[1.5px] border-b-[1.5px] border-b-white">
        <marquee behavior="" scrollamount="15" direction="">
          <span className="uppercase text-9xl text-white tracking-[2rem]   ">
            AURURA Jewelry
          </span>
        </marquee>
      </section>
      <WhyOurJewelry />
      <FeaturedCollection />
      <InstagramGallery />
      <CustomJewelryDesign />
      <Newsletter />
    </Layout>
  );
};

export default Home;
