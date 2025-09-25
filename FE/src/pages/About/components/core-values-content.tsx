import content1 from '@/assets/images/content-1.jpg';
import content2 from '@/assets/images/content-2.jpg';
import content3 from '@/assets/images/content-3.avif';
import content4 from '@/assets/images/content-4.jpg';
import content5 from '@/assets/images/content-5.jpg';
import content6 from '@/assets/images/content-6.jpg';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp } from '@/utils/animation';

import { motion } from 'framer-motion';
import { Handshake, Heart, Shield, Smartphone, Users, Zap } from 'lucide-react';

const content = [
  {
    icon: Shield,
    title: 'Chất lượng bữa ăn',
    description: 'Luôn sử dụng nguyên liệu tươi sạch, chế biến đảm bảo vệ sinh an toàn thực phẩm.',
    image: content1,
  },
  {
    icon: Users,
    title: 'Thấu hiểu khách hàng',
    description: 'Lắng nghe và phục vụ đúng nhu cầu, khẩu vị, túi tiền sinh viên.',
    image: content2,
  },
  {
    icon: Smartphone,
    title: 'Ứng dụng công nghệ',
    description: 'Tích hợp AI, nền tảng số và phần mềm quản lý thông minh để tối ưu trải nghiệm người dùng.',
    image: content3,
  },
  {
    icon: Handshake,
    title: 'Khởi nghiệp dễ dàng',
    description: 'Xây dựng mô hình nhượng quyền toàn diện, hỗ trợ pháp lý – tài chính – đào tạo vận hành.',
    image: content4,
  },
  {
    icon: Zap,
    title: 'Linh hoạt và thân thiện',
    description: 'Chính sách hỗ trợ ban đầu hấp dẫn, dịch vụ thanh toán không tiền mặt, giao hàng nhanh chóng.',
    image: content6,
  },
  {
    icon: Heart,
    title: 'Đồng hành cùng bạn trẻ',
    description: 'Hỗ trợ toàn diện cho các bạn trẻ đam mê kinh doanh thông qua mô hình franchise.',
    image: content5,
  },
];

const CoreValuesContent = () => {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {content.map((value, index) => (
        <motion.div key={index} variants={fadeInUp}>
          <Card className='h-full bg-white hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm'>
            <CardContent className='p-0'>
              <div className='relative'>
                <img
                  src={value.image}
                  alt={value.title}
                  className='w-80 h-48 object-cover align-center rounded-t-lg mx-6 bg-top'
                />
                <div className='absolute top-4 left-4 bg-white p-3 rounded-full shadow-lg'>
                  <value.icon className='h-6 w-6 text-primary' />
                </div>
              </div>
              <div className='p-6'>
                <h3 className='text-lg font-bold text-foreground mb-3'>{value.title}</h3>
                <p className='text-foreground leading-relaxed text-sm'>{value.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CoreValuesContent;
