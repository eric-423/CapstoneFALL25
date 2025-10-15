'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Utensils } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFormProps {
  className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBranch) params.set('branch', selectedBranch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocation) params.set('location', selectedLocation);
    
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Branch Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Chọn chi nhánh
          </label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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
        <Button 
          size="lg" 
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
          onClick={handleSearch}
        >
          <Search className="w-5 h-5 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
