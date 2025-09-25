import image from '@/assets/images/Home - Banner.jpg';
import { BlogCard } from '@/components/common/card';
import { Blog } from '@/types/blog.type';

const mockBlogs: Blog[] = [
  {
    id: 'com-tam-gioi-thieu-1',
    title: 'Cơm Tấm Sài Gòn: Hương Vị Không Thể Nhầm Lẫn Của Đất Phương Nam',
    description:
      'Khám phá đĩa cơm tấm trứ danh với sườn nướng, bì, chả, cùng nước mắm chua ngọt đặc trưng làm say lòng bao thế hệ người Sài Gòn.',
    img: `${image}`,
    subtitle: 'Món ăn sáng, trưa, chiều, tối đều hợp',
  },
  {
    id: 'com-tam-quan-ngon-2',
    title: 'Đi Đâu Ăn Cơm Tấm "Đỉnh" Nhất Sài Gòn? Gợi Ý Các Quán Nổi Tiếng',
    description:
      'Danh sách những địa chỉ cơm tấm có "thâm niên" và được người dân địa phương yêu thích, từ vỉa hè đến nhà hàng sang trọng.',
    img: `${image}`,
  },
  {
    id: 'com-tam-che-bien-3',
    title: 'Bí Quyết Nướng Sườn, Làm Bì, Hấp Chả Trứng Chuẩn Vị Cơm Tấm',
    description:
      'Tìm hiểu cách chế biến từng thành phần làm nên đĩa cơm tấm hoàn hảo ngay tại nhà, từ cách ướp sườn đến công thức pha nước mắm.',
    img: `${image}`,
    subtitle: 'Tự tay làm món ngon tại nhà',
  },
];

const BlogList = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {mockBlogs.map((item) => (
        <BlogCard item={item} key={item.id} />
      ))}
    </div>
  );
};

export default BlogList;
