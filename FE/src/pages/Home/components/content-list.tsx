import image from '@/assets/images/tam-tac-content (2).jpg';
import image1 from '@/assets/images/tam-tac-content (3).jpg';
import image2 from '@/assets/images/tam-tac-content.jpg';
import { ContentCard } from '@/components/common/card';
import { Content } from '@/types/content.type';

import { Award, ShoppingBag, Sparkles } from 'lucide-react';

const promoteContent = [
  {
    id: '1',
    title: 'NGUYÊN LIỆU TƯƠI NGON',
    subtitle: 'ĂN TOÀN',
    icon: <Sparkles className='h-6 w-6 text-primary' />,
    img: `${image1}`,
    description:
      'Chúng tôi chỉ sử dụng những nguyên liệu tươi ngon nhất, được chọn lọc kỹ càng để đảm bảo hương vị tuyệt hảo cho mỗi món ăn.',
  } as Content,
  {
    id: '2',
    title: 'CÔNG THỨC ĐỘC ĐÁO',
    subtitle: 'NGON CHUẨN VỊ',
    icon: <Award className='h-6 w-6 text-primary' />,
    img: `${image}`,
    description:
      'Công thức độc quyền được phát triển bởi các đầu bếp hàng đầu, giữ trọn hương vị truyền thống Sài Gòn với chút biến tấu hiện đại.',
  } as Content,
  {
    id: '3',
    title: 'GIÁ CẢ PHẢI CHĂNG',
    subtitle: 'CHẤT LƯỢNG CAO',
    icon: <ShoppingBag className='h-6 w-6 text-primary' />,
    img: `${image2}`,
    description:
      'Chúng tôi cam kết mang đến trải nghiệm ẩm thực chất lượng với mức giá hợp lý, phù hợp với mọi đối tượng khách hàng.',
  } as Content,
];

const ContentList = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {promoteContent.map((item) => (
        <ContentCard item={item} key={item.id} />
      ))}
    </div>
  );
};

export default ContentList;
