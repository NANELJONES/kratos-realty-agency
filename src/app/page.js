import Background from "./components/Background";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import FeaturedProperties from "./components/FeaturedProperties";
import OurServices from "./components/OurServices";
import WhyUs from "./components/WhyUs";
import ContactUs from "./components/ContactUs";
import CTA from "./components/CTA";
export default function Home() {
  return (
    <div className="relative h-auto  ">


   
    <div className="w-full font-sans  flex flex-col gap-[5em] relative">
      <Background />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(25, 27, 50, 0.5) 0%, transparent 100%)'
        }}
      />

      
 <Header />
 <AboutUs />
 <FeaturedProperties />
 <OurServices />
 <WhyUs />
 <CTA />
 {/* <ContactUs /> */}
    </div>
  
    </div>
  );
}
