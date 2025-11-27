import Image from "next/image";
import { SearchForm } from "@/components/common/search-form";
import { memo } from "react";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import image from "@/assets/images/comtamhomepage.png";
import headerText from "@/assets/images/headerText.png";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

const HeroSection = memo(() => {
  return (
    <section
      className={`relative min-h-[85vh] bg-[#FFFCF7] flex flex-col items-center justify-center ${montserrat.className}`}
    >
      <div className="relative z-10 container mx-auto px-4 pb-10 min-h-[85vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 w-full items-center">
          <div className="items-center justify-center text-center flex flex-col lg:col-span-7">
            <Image
              src={headerText}
              alt="headerText"
              width={300}
              height={100}
              className="object-contain"
            />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-6">
              Tấm ngon, Tắc nhớ!
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-black mb-8">
              Thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên, dành cho
              sinh viên
            </p>
            <SearchForm />
          </div>

          <div className="hidden lg:flex items-center justify-center relative z-20 lg:col-span-5">
            <motion.div
              className="relative w-full max-w-xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full aspect-square rounded-full bg-[#FFFCF7] shadow-2xl overflow-visible">
                <Image
                  src={image}
                  alt="Cơm Tấm Tắc"
                  fill
                  sizes="(max-width: 1500px) 576px, 576px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
