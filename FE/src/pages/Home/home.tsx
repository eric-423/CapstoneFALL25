import { GET_BRANCHES_QUERY_KEY, GET_BRANCHES_STALE_TIME, getBranches } from '@/apis/branch.api';
import { GET_PRODUCTS_QUERY_KEY, getProducts } from '@/apis/product.api';
import logo from '@/assets/favicon.svg';
import foodCourt from '@/assets/images/food-court.jpg';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import StyledHeading from '@/components/common/styled-heading';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import configs from '@/configs';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useScrollTop from '@/hooks/useScrollTop';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import BestSellerList from './components/best-seller-list';
import BranchList from './components/branch-list';
import ContentList from './components/content-list';
import FranchiseForm from './components/franchise-form';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
  useDocumentTitle('Tấm Tắc');
  useScrollTop();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [GET_PRODUCTS_QUERY_KEY],
    queryFn: () => getProducts(),
    select: (data) => data.content.slice(0, 3),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: [GET_BRANCHES_QUERY_KEY],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      {isLoadingProducts || isLoadingBranches ? (
        <div className='flex items-center justify-center min-h-screen'>
          <LoadingSpinner />
        </div>
      ) : (
        <main className='min-h-screen bg-background overflow-x-hidden'>
          <section className='relative pb-28 pt-15 px-4'>
            <div className='container mx-auto max-w-6xl'>
              <div className='grid lg:grid-cols-2 gap-12 items-center'>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className='mb-6'>
                    <span className='inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4'>
                      Câu chuyện của chúng tôi
                    </span>
                    <h1 className='text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight'>
                      Về Tấm Tắc
                      <br />
                      <span className='text-primary'>"Tấm ngon, Tắc nhớ!"</span>
                    </h1>
                    <p className='text-lg text-foreground leading-relaxed'>
                      Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên. Chúng tôi hiểu rõ nhu
                      cầu của bạn về một bữa ăn ngon – bổ – rẻ, nhanh chóng nhưng vẫn đảm bảo chất lượng.
                    </p>
                    <div className='mt-5 text-left'>
                      <Link
                        className={cn(
                          buttonVariants({ variant: 'outline' }),
                          'border-foreground rounded-full font-semibold text-base hover:bg-foreground hover:text-white',
                        )}
                        to={configs.routes.about}
                      >
                        Xem thêm về Tấm Tắc
                        <ChevronRight className='h-4 w-4 ml-2' />
                      </Link>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='relative'
                >
                  <div className='rounded-2xl overflow-hidden shadow-2xl'>
                    <img src={foodCourt} alt='Tấm Tắc Story' className='w-full h-[400px] object-cover' />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Best Sellers Section */}
          <section className='py-20 bg-gradient-to-b from-secondary to-background relative lg:px-30'>
            <div className='absolute top-[-32px] right-0 w-[120%] z-0 h-25 bg-background -rotate-2' />

            <div className='container mx-auto px-4'>
              <div className='flex flex-col items-center mb-12'>
                <Badge className='bg-background text-primary font-medium text-lg my-7 rounded-full px-4 py-1'>
                  Món ăn nổi bật
                </Badge>
                <h2 className='text-3xl md:text-4xl font-bold text-center'>BEST SELLERS</h2>
              </div>

              <BestSellerList products={products} />

              <div className='mt-8 text-right'>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'border-primary rounded-full text-lg hover:bg-secondary hover:text-foreground',
                  )}
                  to={configs.routes.menu}
                >
                  Toàn bộ thực đơn
                  <ChevronRight className='h-4 w-4 ml-1' />
                </Link>
              </div>
            </div>
          </section>

          <section className=' pt-0 pb-22 relative lg:px-30'>
            <div className='container mx-auto px-4'>
              <div className='flex flex-col items-center mb-12'>
                <Badge className='bg-primary/10 text-primary font-medium text-lg my-9 rounded-full px-4 py-1'>
                  Trải nghiệm ẩm thực
                </Badge>
                <h2 className='text-3xl md:text-4xl font-bold mb-3 text-center relative'>
                  <StyledHeading
                    text={
                      <>
                        TẠI SAO CHỌN CƠM
                        <span className='text-primary'> TẤM TẮC</span> ?
                      </>
                    }
                  />
                </h2>
              </div>

              <ContentList />
            </div>
          </section>

          {/* Franchise Section */}
          <section className='py-20 bg-gradient-to-b from-secondary to-background relative lg:px-30'>
            <div className='absolute top-[-31px] left-0 w-[130%] z-0 h-25 bg-background rotate-3' />

            <div className='container mx-auto px-4'>
              <div className='flex flex-col items-center mb-12'>
                <Badge className='bg-background text-primary font-medium text-lg my-7 rounded-full px-4 py-1'>
                  Cơ hội kinh doanh
                </Badge>
                <h2 className='text-3xl md:text-4xl font-bold text-center'>HỆ THỐNG NHƯỢNG QUYỀN</h2>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                <BranchList items={branches || []} />

                <div className='bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden'>
                  <div className='relative'>
                    <div className='flex items-center mb-4'>
                      <div className='w-12 h-12 rounded-full flex items-center justify-center mr-4'>
                        <img src={logo} alt='Tấm Tắc Logo' />
                      </div>
                      <h3 className='text-2xl font-bold'>ĐĂNG KÝ NHƯỢNG QUYỀN</h3>
                    </div>

                    <p className='text-gray-600 mb-4'>
                      Trở thành đối tác của Tấm Tắc để sở hữu mô hình kinh doanh ẩm thực hiệu quả với sự hỗ trợ toàn
                      diện từ đội ngũ chuyên nghiệp của chúng tôi.
                    </p>

                    <FranchiseForm />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
