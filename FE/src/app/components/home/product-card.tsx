"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

type ProductCardProps = {
  id: number;
  title: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  index: number;
};

export function ProductCard({
  title,
  description,
  rating,
  image,
  index,
}: ProductCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
        <div className="flex items-center gap-1 mb-3 justify-center">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
