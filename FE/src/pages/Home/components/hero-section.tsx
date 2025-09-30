'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Utensils } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Home - Banner.jpg"
          alt="Cơm Tấm Tắc Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12 max-w-4xl">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Cơm Tấm Tắc
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-orange-300 mb-6">
            Tấm ngon, Tắc nhớ!
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-12">
            Thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Branch Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Chọn chi nhánh
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn chi nhánh..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quan-1">Quận 1</SelectItem>
                    <SelectItem value="quan-3">Quận 3</SelectItem>
                    <SelectItem value="quan-5">Quận 5</SelectItem>
                    <SelectItem value="thu-duc">Thủ Đức</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  Thể loại món ăn
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Thể loại món ăn..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="com-tam">Cơm Tấm</SelectItem>
                    <SelectItem value="com-dia">Cơm Dĩa</SelectItem>
                    <SelectItem value="nuoc-uong">Nước Uống</SelectItem>
                    <SelectItem value="trang-mieng">Tráng Miệng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Vị trí hiện tại
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vị trí hiện tại..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gan-nhat">Gần nhất</SelectItem>
                    <SelectItem value="quan-1">Quận 1</SelectItem>
                    <SelectItem value="quan-3">Quận 3</SelectItem>
                    <SelectItem value="quan-5">Quận 5</SelectItem>
                    <SelectItem value="thu-duc">Thủ Đức</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3">
                <Search className="w-5 h-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;