'use client';

import { motion } from 'framer-motion';
import { Leaf, GraduationCap, DollarSign } from 'lucide-react';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "NGUYÊN LIỆU TƯƠI NGON",
      subtitle: "- AN TOÀN",
      description: "Cam kết sử dụng nguyên liệu tươi ngon, an toàn cho sức khỏe với nguồn gốc rõ ràng",
      image: "/images/content-1.jpg"
    },
    {
      icon: GraduationCap, 
      title: "CÔNG THỨC LỚP HỌC QUYỀN",
      subtitle: "NGON CHUẨN VỊ",
      description: "Công thức được truyền dạy từ thế hệ này qua thế hệ khác, đảm bảo hương vị đặc trưng",
      image: "/images/content-2.jpg"
    },
    {
      icon: DollarSign,
      title: "GIÁ CẢ PHẢI CHĂNG",
      subtitle: "",
      description: "Giá cả hợp lý, phù hợp với sinh viên và người lao động, đảm bảo chất lượng tốt nhất",
      image: "/images/content-3.avif"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            TẠI SAO CHỌN CƠM <span className="text-orange-500">TẤM TẮC</span>?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                
                {/* Subtitle */}
                {feature.subtitle && (
                  <p className="text-lg font-semibold text-orange-500 mb-3">
                    {feature.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;