import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { config } from '@/configs/app';
import { cn } from '@/lib/utils';
import { Blog } from '@/types/blog.type';

import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type BlogCardProps = {
  item: Blog;
};

export const BlogCard = ({ item }: BlogCardProps) => {
  return (
    <Card className='group relative p-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
      <div className='aspect-square relative overflow-hidden'>
        <img
          src={item.img}
          alt={item.title}
          width={300}
          height={300}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4'>
          <h3 className='text-white font-bold text-lg'>{item.title}</h3>
          <p className='text-white/80 text-sm'>{item.subtitle}</p>
          <Link
            className={cn(
              buttonVariants({ variant: 'link' }),
              'text-secondary p-0 mt-2 flex items-center justify-end hover:text-white',
            )}
            to={config.routes.blogDetails.replace(':id', item.id)}
          >
            Đọc tiếp
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>
      </div>
    </Card>
  );
};
