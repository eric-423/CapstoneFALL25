'use client';

import { CartDrawer, CartPopover } from '@/components/common/cart';
import { Button } from '@/components/ui/button';
import configs from '@/utils/configs';
import { useAuth } from '@/utils/hooks';
import { useOutsideClicked } from '@/utils/hooks/useOutsideClicked';
import { removeAccessToken, removeRefreshToken } from '@/utils/cookies';

import { LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useOutsideClicked(document.getElementById('mobile-menu') as HTMLDivElement, () => setIsMenuOpen(false), isMenuOpen);

  return (
    <header className='sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <div className='relative w-32 md:w-36 h-8'>
            <Image
              src='/full-logo.svg'
              alt='Tấm Tắc Logo'
              fill
              className='object-contain'
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center space-x-8'>
          <NavLinks />
        </nav>

        {/* Desktop Action Buttons */}
        <div className='hidden lg:flex items-center space-x-3'>
          <ActionButtons isAuthenticated={isAuthenticated} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-primary hover:bg-orange-50'
          onClick={() => setIsMenuOpen(true)}
          disabled={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white border-t border-gray-100 py-4 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'visible' : 'hidden'}`}
        id='mobile-menu'
      >
        <div className='container mx-auto px-4 flex flex-col space-y-4'>
          <nav className='flex flex-col space-y-3'>
            <NavLinks mobile onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </nav>
          <div className='flex justify-center space-x-6 pt-4 border-t border-gray-100'>
            <ActionButtons mobile isAuthenticated={isAuthenticated} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLinks({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const links = [
    { href: configs.routes.about, label: 'Về Tấm Tắc' },
    { href: configs.routes.menu, label: 'Đặt Hàng' },
    { href: '/thuc-don-ai', label: 'Thực đơn từ AI' },
    { href: '/chuyen-com-tam', label: 'Chuyện Cơm Tấm' },
    { href: '/nhuong-quyen', label: 'Nhượng Quyền' },
    { href: '/cua-hang', label: 'Cửa Hàng' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={`font-medium text-primary hover:text-orange-600 transition-colors duration-300 ${mobile ? 'text-lg py-4' : 'text-base'}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

function ActionButtons({
  mobile = false,
  isAuthenticated = false,
  onClick,
}: {
  mobile?: boolean;
  isAuthenticated?: boolean;
  onClick: () => void;
}) {
  const url = usePathname();
  const handleLogout = () => {
    removeAccessToken();
    removeRefreshToken();
    localStorage.removeItem('mock_user_id');
    localStorage.removeItem('access_token');
    if (onClick) onClick();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Notification Icon */}
      <Button
        variant='ghost'
        size='icon'
        className='text-orange-500 hover:text-orange-600 hover:bg-orange-50'
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {isAuthenticated ? (
        <>
          <Link href={configs.routes.profile}>
            <Button
              variant='ghost'
              size='icon'
              className='text-orange-500 hover:text-orange-600 hover:bg-orange-50'
              onClick={onClick}
            >
              <User size={24} />
              {mobile && <span className='ml-2'>Tài khoản</span>}
            </Button>
          </Link>
          <Button
            variant='ghost'
            size={mobile ? 'default' : 'icon'}
            className='text-orange-500 hover:text-orange-600 hover:bg-orange-50'
            onClick={handleLogout}
          >
            <LogOut size={mobile ? 20 : 24} />
            {mobile && <span className='ml-2'>Đăng xuất</span>}
          </Button>
        </>
      ) : (
        <>
          <Link href={configs.routes.login}>
            <Button
              variant='ghost'
              size='icon'
              className='text-orange-500 hover:text-orange-600 hover:bg-orange-50'
            >
              <User size={24} />
              {mobile && <span className='ml-2'>Đăng nhập</span>}
            </Button>
          </Link>
        </>
      )}

      {/* Cart Icon */}
      {url !== configs.routes.checkout && (
        <div className="relative">
          {mobile ? <CartDrawer /> : <CartPopover />}
          {/* Cart badge - can be added based on cart count */}
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            0
          </span>
        </div>
      )}
    </>
  );
}
