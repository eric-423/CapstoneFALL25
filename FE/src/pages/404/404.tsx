import { Button } from '@/components/ui/button';
import useDocumentTitle from '@/hooks/useDocumentTitle';

import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  useDocumentTitle('Tấm Tắc | Không tìm thấy trang');
  const navigate = useNavigate();

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Không tìm thấy nội dung 😓</span>
        <p className='text-center text-muted-foreground'>Không có gì ở đây đâu, quay lại đi nhé!</p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
