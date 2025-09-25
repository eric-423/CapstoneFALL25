import content7 from '@/assets/images/content-7.jpg';
import content8 from '@/assets/images/content-8.jpg';
import content9 from '@/assets/images/content-9.png';
import content10 from '@/assets/images/content-10.jpg';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp } from '@/utils/animation';

import { motion } from 'framer-motion';
import { ChefHat, Handshake, Smartphone, Star } from 'lucide-react';

const content = [
  {
    icon: ChefHat,
    title: 'Phục vụ bữa ăn chất lượng',
    description: 'Giá hợp lý – trải nghiệm tiện lợi cho cộng đồng sinh viên.',
    image: content7,
  },
  {
    icon: Handshake,
    title: 'Đồng hành cùng bạn trẻ',
    description: 'Khởi nghiệp thông qua mô hình franchise hỗ trợ toàn diện.',
    image: content8,
  },
  {
    icon: Smartphone,
    title: 'Tận dụng công nghệ',
    description: 'Phục vụ cá nhân hóa: gợi ý món ăn theo khẩu vị, thời tiết, khuyến mãi và lịch sử đặt hàng.',
    image: content9,
  },
  {
    icon: Star,
    title: 'Nâng tầm Cơm Tấm',
    description: 'Kết hợp ẩm thực truyền thống với phong cách phục vụ hiện đại.',
    image: content10,
  },
];

const MissionContent = () => {
  return (
    <div className='grid md:grid-cols-2 gap-8 mb-16'>
      {content.map((mission, index) => (
        <motion.div key={index} variants={fadeInUp}>
          <Card className='bg-white hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm overflow-hidden'>
            <CardContent className='p-0'>
              <div className='flex'>
                <div className='w-32 flex-shrink-0 ml-5 rounded-lg overflow-hidden'>
                  <img
                    src={mission.image || '/placeholder.svg'}
                    alt={mission.title}
                    className='w-full h-32 object-cover'
                  />
                </div>
                <div className='p-6 py-3 flex-1'>
                  <div className='flex items-start'>
                    <div className='bg-orange-100 p-2 rounded-lg mr-4 flex-shrink-0'>
                      <mission.icon className='h-5 w-5 text-orange-600' />
                    </div>
                    <div>
                      <h3 className='font-bold text-foreground mb-2'>{mission.title}</h3>
                      <p className='text-foreground text-sm leading-relaxed'>{mission.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default MissionContent;
