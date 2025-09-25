import { BranchCard } from '@/components/common/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Branch } from '@/types/branch.type';

import { Utensils } from 'lucide-react';

interface BranchListItemProps {
  items: Branch[];
}

const BranchList = ({ items }: BranchListItemProps) => {
  return (
    <div>
      <Tabs defaultValue='tphcm' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 bg-background/80'>
          <TabsTrigger value='tphcm'>TP.HCM</TabsTrigger>
          <TabsTrigger value='hanoi'>Hà Nội</TabsTrigger>
          <TabsTrigger value='danang'>Đà Nẵng</TabsTrigger>
        </TabsList>
        <TabsContent value='tphcm'>
          {items?.map((item) => <BranchCard item={item} key={item.id} className='mt-2' />)}
        </TabsContent>
        <TabsContent value='hanoi' className='mt-2'>
          <div className='bg-white rounded-xl p-8 shadow-md text-center'>
            <Utensils className='h-12 w-12 mx-auto text-primary/50 mb-4' />
            <h3 className='text-xl font-bold mb-2'>Sắp ra mắt</h3>
            <p className='text-gray-600'>Chúng tôi sẽ sớm có mặt tại Hà Nội. Hãy đăng ký nhượng quyền ngay hôm nay!</p>
          </div>
        </TabsContent>
        <TabsContent value='danang' className='mt-2'>
          <div className='bg-white rounded-xl p-8 shadow-md text-center'>
            <Utensils className='h-12 w-12 mx-auto text-primary/50 mb-4' />
            <h3 className='text-xl font-bold mb-2'>Sắp ra mắt</h3>
            <p className='text-gray-600'>Chúng tôi sẽ sớm có mặt tại Đà Nẵng. Hãy đăng ký nhượng quyền ngay hôm nay!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BranchList;
