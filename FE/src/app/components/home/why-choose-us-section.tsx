import {
  ShoppingCart,
  Calendar,
  Clock,
  ChefHat,
  Home,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import chefImg from "@/assets/images/chefImg.png";
import configs from "@/utils/configs";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

const WhyChooseUsSection = () => {
  const services = [
    {
      icon: ShoppingCart,
      title: "Đặt hàng online",
      color: "bg-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: Calendar,
      title: "Ăn tại bàn",
      color: "bg-amber-200",
      iconColor: "text-amber-700",
    },
    {
      icon: Clock,
      title: "Phục vụ 24/7",
      color: "bg-orange-200",
      iconColor: "text-orange-600",
    },
    {
      icon: ChefHat,
      title: "Không gian gần gũi",
      color: "bg-amber-200",
      iconColor: "text-amber-700",
    },
    {
      icon: Home,
      title: "Bếp sạch sẽ",
      color: "bg-pink-200",
      iconColor: "text-pink-600",
    },
    {
      icon: Users,
      title: "Đầu bếp chuyên nghiệp",
      color: "bg-red-200",
      iconColor: "text-red-600",
    },
  ];

  return (
    <section className={`py-20 bg-[#FFFCF7] ${montserrat.className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="relative w-full aspect-square max-w-xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={chefImg}
                    alt="Đầu bếp"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10">
                  <div className="text-3xl">🥬</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight">
                Chúng tôi không chỉ là
              </h2>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight">
                Quán cơm tấm
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                Đây là một loại hình phục vụ cơm tấm tự động, cùng với các món
                ăn kèm. Chúng tôi cam kết mang đến trải nghiệm ẩm thực tốt nhất
                cho bạn.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 bg-[#FFFCF7] rounded-full px-4 py-3  hover:shadow-lg transition-shadow cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    <span className="text-sm md:text-base font-semibold text-black">
                      {service.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="pt-4">
              <Link href={configs.routes.about}>
                <Button
                  size="lg"
                  className="bg-[#F8A91F] hover:bg-[#EC6426] text-white font-semibold px-8 py-6 rounded-full text-base md:text-lg"
                >
                  Về chúng tôi
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
