import { GET_DISTRICTS_QUERY_KEY, getDistricts } from '@/apis/common.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Provinces } from '@/utils/province';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

const FranchiseForm = () => {
  const [province, setProvince] = useState<string>('');
  const [district, setDistrict] = useState<string>('');

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setDistrict('');
  };
  const handleDistrictChange = (value: string) => {
    setDistrict(value);
  };

  const { data: districts } = useQuery({
    queryKey: [GET_DISTRICTS_QUERY_KEY, province],
    queryFn: async () => await getDistricts(province),
    refetchOnWindowFocus: false,
    enabled: !!province,
  });

  return (
    <>
      <form className='space-y-2'>
        <div>
          <Label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
            Họ tên
          </Label>
          <Input
            type='text'
            name='name'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all'
            placeholder='Nhập họ tên của bạn'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
              Số điện thoại
            </Label>
            <Input
              type='tel'
              name='phone'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all'
              placeholder='Nhập số điện thoại'
            />
          </div>
          <div>
            <Label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </Label>
            <Input
              type='email'
              name='email'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all'
              placeholder='Nhập email của bạn'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='province' className='block text-sm font-medium text-gray-700 mb-1'>
              Khu vực
            </Label>
            <Select value={province} onValueChange={handleProvinceChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn khu vực' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Provinces).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='province' className='block text-sm font-medium text-gray-700 mb-1'>
              Quận huyện
            </Label>
            <Select value={district} disabled={!province} onValueChange={handleDistrictChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn quận huyện' />
              </SelectTrigger>
              <SelectContent>
                {districts?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor='capital' className='block text-sm font-medium text-gray-700 mb-1'>
            Mức vốn
          </Label>
          <Input
            type='number'
            name='capital'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all'
            placeholder='Mức vốn đầu tư'
          />
        </div>
        <div>
          <Label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
            Lời nhắn
          </Label>
          <Textarea
            name='message'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none'
            placeholder='Nhập lời nhắn của bạn'
          />
        </div>

        <Button className='w-full bg-primary hover:bg-[#C04A00] text-white py-3 mt-3'>Đăng ký ngay</Button>
      </form>
    </>
  );
};

export default FranchiseForm;
