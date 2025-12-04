"use client";

import foodCourt from "@/assets/images/food-court.jpg";
import friends from "@/assets/images/future.jpeg";
import { CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import useScrollTop from "@/utils/hooks/useScrollTop";
import { fadeInUp, staggerContainer } from "@/utils/animation";
import minhduy from "@/assets/images/minhduy.png";
import vietthai from "@/assets/images/vietthai.png";
import ngocan from "@/assets/images/ngocan.png";
import quanghuy from "@/assets/images/quanghuy.png";
import futureValue from "@/assets/images/futureValue.png";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import Image from "next/image";

import StyledHeading from "@/components/common/styled-heading";

export default function AboutPage() {
  const isMobile = useIsMobile();

  useScrollTop();


  return (
    <div className="min-h-screen flex bg-[#FFFCF7]">
      <nav
        className={`${isMobile ? "hidden" : ""} fixed left-0 top-16 bottom-0 w-56 z-40 transition-colors duration-300 py-8 px-6`}
      >
        <div className="flex flex-col space-y-4 text-foreground sticky top-24">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="font-medium hover:text-primary transition-colors py-2 border-l-4 border-transparent hover:border-primary pl-4 hover:bg-white/50 rounded-r-lg"
          >
            Về chúng tôi
          </a>
          <a
            href="#values"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("values")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="font-medium hover:text-primary transition-colors py-2 border-l-4 border-transparent hover:border-primary pl-4 hover:bg-white/50 rounded-r-lg"
          >
            Giá trị
          </a>
          <a
            href="#vision"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("vision")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="font-medium hover:text-primary transition-colors py-2 border-l-4 border-transparent hover:border-primary pl-4 hover:bg-white/50 rounded-r-lg"
          >
            Tầm nhìn
          </a>
        </div>
      </nav>
      <div className={`flex-1 ${isMobile ? "" : "ml-56"}`}>
        <section className="py-16 px-16 bg-[#FFFCF7]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-6">
                  <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    Câu chuyện của chúng tôi
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                    Về Tấm Tắc
                    <br />
                    <span className="text-primary">
                      &ldquo;Tấm ngon, Tắc nhớ!&rdquo;
                    </span>
                  </h1>
                  <p className="text-lg text-foreground leading-relaxed">
                    Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành
                    cho sinh viên. Chúng tôi hiểu rõ nhu cầu của bạn về một bữa
                    ăn ngon – bổ – rẻ, nhanh chóng nhưng vẫn đảm bảo chất lượng.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={foodCourt}
                    alt="Tấm Tắc Story"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2025</div>
                    <div className="text-sm text-foreground">
                      Khởi đầu hành trình
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-4 bg-[#FFFCF7]">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: false }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  <StyledHeading text="Chúng tôi là ai" />
                </h1>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <motion.div variants={fadeInUp}>
                    <div className="grid grid-cols-2 gap-4">
                      <CardContent className=" text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                          <Image
                            src={ngocan}
                            alt="Trịnh Đình Ngọc An"
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                          />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          Trịnh Đình Ngọc An
                        </h4>
                      </CardContent>

                      <CardContent className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                          <Image
                            src={minhduy}
                            alt="Lê Minh Duy"
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                          />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          Lê Minh Duy
                        </h4>
                      </CardContent>

                      <CardContent className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                          <Image
                            src={quanghuy}
                            alt="Lê Quang Huy"
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                          />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          Lê Quang Huy
                        </h4>
                      </CardContent>

                      <CardContent className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                          <Image
                            src={vietthai}
                            alt="Nguyễn Viết Thái"
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                          />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          Nguyễn Viết Thái
                        </h4>
                      </CardContent>
                    </div>
                  </motion.div>
                  <div className="space-y-6 text-left my-auto">
                    <p className="text-lg font-regular text-foreground leading-relaxed">
                      Tấm Tắc là đồ án tốt nghiệp được sáng lập bởi một nhóm
                      sinh viên với khát vọng xây dựng thương hiệu Cơm Tấm hàng
                      đầu dành cho sinh viên tại TP.HCM.
                    </p>
                    <p className="text-lg text-foreground leading-relaxed">
                      Chúng tôi hiểu rõ nhu cầu thực tế của sinh viên: cần một
                      bữa ăn{" "}
                      <span className="font-semibold text-primary">
                        ngon – bổ – rẻ
                      </span>
                      , nhanh chóng nhưng vẫn đảm bảo chất lượng và vệ sinh.
                    </p>
                    <p className="text-lg text-foreground leading-relaxed">
                      Với tinh thần đó, Tấm Tắc không chỉ là nơi bán Cơm Tấm –
                      mà là nơi mang đến trải nghiệm ẩm thực gần gũi, tiện lợi
                      và hiện đại.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="values" className="py-20 px-4 bg-[#FFFCF7]">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: false }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Giá trị cốt lõi
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
                <p className="text-lg text-foreground max-w-2xl mx-auto mb-8">
                  Những giá trị định hướng mọi hoạt động của chúng tôi
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex justify-center">
                <div className="relative w-full max-w-6xl rounded-xl overflow-hidden ">
                  <Image
                    src={futureValue}
                    alt="Giá trị cốt lõi"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="vision" className="py-20 px-4 bg-[#FFFCF7]">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: false }}
              variants={staggerContainer}
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div variants={fadeInUp}>
                  <Image
                    src={friends}
                    alt="Tầm nhìn Tấm Tắc"
                    className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <div className="space-y-6">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Eye className="h-4 w-4 inline mr-2" />
                        Tầm nhìn
                      </span>
                      <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                        Hướng đến tương lai
                      </h2>
                    </div>

                    <p className="text-lg text-foreground leading-relaxed">
                      Tấm Tắc hướng đến trở thành một{" "}
                      <span className="font-semibold text-blue-800">
                        thương hiệu Cơm Tấm hiện đại
                      </span>
                      , dẫn đầu thị trường sinh viên tại TP.HCM và mở rộng ra
                      toàn quốc.
                    </p>

                    <p className="text-lg text-foreground leading-relaxed">
                      Chúng tôi muốn biến món ăn truyền thống này thành một trải
                      nghiệm dễ tiếp cận, dễ chia sẻ và dễ nhân rộng thông qua
                      mô hình bán hàng trực tiếp kết hợp nhượng quyền thông
                      minh.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
