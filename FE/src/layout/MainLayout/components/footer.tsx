import configs from '@/utils/configs';
import { STORE_INFO } from '@/utils/mockupData';

import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='bg-gradient-to-r from-primary to-[#F17732] text-white'>
      <div className='container mx-auto p-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Logo and Tagline */}
          <div className='flex flex-col items-start'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='relative w-40 h-12 overflow-visible'>
                <Image
                  src='/full-logo-white.svg'
                  alt='Tấm Tắc Logo'
                  fill
                  className='object-contain scale-110 lg:scale-125 p-1'
                />
              </div>
            </div>
            <div className='mt-6 flex mx-auto space-x-4'>
              <Link
                href='https://www.facebook.com/tamtac.vn'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:opacity-80 transition-opacity'
              >
                <div className='bg-card/20 rounded-full p-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className='text-xl font-semibold mb-4 pb-2 border-b border-white/20'>Thông tin</h3>
            <ul className='space-y-3'>
              <li>
                <Link href={configs.routes.about} className='hover:underline transition-all inline-block'>
                  Về Tấm Tắc
                </Link>
              </li>
              <li>
                {/* <Link to='/story' className='hover:underline transition-all inline-block'> */}
                Chuyện Cơm Tấm
                {/* </Link> */}
              </li>
              {/* <li>
                <Link to='/news' className='hover:underline transition-all inline-block'>
                  Tin tức & Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to='/career' className='hover:underline transition-all inline-block'>
                  Tuyển dụng
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-xl font-semibold mb-4 pb-2 border-b border-white/20'>Dịch vụ</h3>
            <ul className='space-y-3'>
              <li>
                <Link href='/menu' className='hover:underline transition-all inline-block'>
                  Đặt hàng
                </Link>
              </li>
              <li>
                {/* <Link to='/franchise' className='hover:underline transition-all inline-block'> */}
                Nhượng quyền
                {/* </Link> */}
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-xl font-semibold mb-4 pb-2 border-b border-white/20'>Liên hệ</h3>
            <ul className='space-y-4'>
              <li className='flex items-start'>
                <MapPin className='mr-3 h-5 w-5 mt-0.5 flex-shrink-0' />
                <span>{STORE_INFO.address}</span>
              </li>
              <li className='flex items-center'>
                <Phone className='mr-3 h-5 w-5 flex-shrink-0' />
                {STORE_INFO.phone}
              </li>
              <li className='flex items-center'>
                <Mail className='mr-3 h-5 w-5 flex-shrink-0' />
                cskh@tamtac.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-white/80 text-sm mb-4 md:mb-0'>Copyright © 2025 Tấm Tắc. Tất cả quyền được bảo lưu.</p>
          <div className='flex space-x-6'>
            <Link href='/privacy' className='text-white/80 text-sm hover:text-white transition-colors'>
              Chính sách bảo mật
            </Link>
            <Link href='/terms' className='text-white/80 text-sm hover:text-white transition-colors'>
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

