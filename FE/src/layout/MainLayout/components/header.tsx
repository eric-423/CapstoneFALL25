'use client';

import { CartDrawer, CartPopover } from '@/components/common/cart';
import { Button } from '@/components/ui/button';
import configs from '@/utils/configs';
import { useAuth } from '@/utils/hooks';
import { useOutsideClicked } from '@/utils/hooks/useOutsideClicked';

import { LogOut, Menu, User, X } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClicked(mobileMenuRef, () => setIsMenuOpen(false), isMenuOpen);

  return (
    <header className='sticky top-0 z-50 w-full bg-background shadow-sm border-b border-gray-100'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <div className='relative w-36 md:w-48 h-8 overflow-visible'>
            <Image
              src='/full-logo.svg'
              alt='Tấm Tắc Logo'
              fill
              sizes='(max-width: 768px) 144px, 192px'
              className='object-contain scale-110 md:scale-125'
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

      <div
        ref={mobileMenuRef}
        className={`lg:hidden bg-background border-t border-gray-100 py-4 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'visible' : 'hidden'}`}
        id='mobile-menu'
      >
        <div className='container mx-auto px-4 flex flex-col space-y-4'>
          <nav className='flex flex-col space-y-3'>
            <NavLinks mobile onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </nav>
          <div className='flex justify-center items-center w-full pt-4 border-t border-gray-100'>
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
    // { href: '/chuyen-com-tam', label: 'Chuyện Cơm Tấm' },
    { href: '/nhuong-quyen', label: 'Nhượng Quyền' },
    // { href: '/cua-hang', label: 'Cửa Hàng' },
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
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (onClick) onClick();

    await logout();
  };

  return (
    <div className='flex items-center justify-center gap-x-3 sm:gap-x-4 flex-wrap'>
      <Button
        variant='ghost'
        size={mobile ? 'default' : 'icon'}
        className='text-orange-500 hover:text-orange-600 hover:bg-orange-50 flex items-center gap-x-2'
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {mobile && <span className='text-sm font-medium'>Thông báo</span>}
      </Button>

      {isAuthenticated ? (
        <>
          <Link href={configs.routes.profile}>
            <Button
              variant='ghost'
              size={mobile ? 'default' : 'icon'}
              className='text-orange-500 hover:text-orange-600 hover:bg-orange-50 flex items-center gap-x-2'
              onClick={onClick}
            >
              <User size={mobile ? 20 : 24} />
              {mobile && <span className='text-sm font-medium'>Tài khoản</span>}
            </Button>
          </Link>

          <Button
            variant='ghost'
            size={mobile ? 'default' : 'icon'}
            className='text-orange-500 hover:text-orange-600 hover:bg-orange-50 flex items-center gap-x-2'
            onClick={handleLogout}
          >
            <LogOut size={mobile ? 20 : 24} />
            {mobile && <span className='text-sm font-medium'>Đăng xuất</span>}
          </Button>
        </>
      ) : (
        <>
          <Link href={configs.routes.login}>
            <Button
              variant='ghost'
              size={mobile ? 'default' : 'icon'}
              className='text-orange-500 hover:text-orange-600 hover:bg-orange-50 flex items-center gap-x-2'
            >
              <User size={mobile ? 20 : 24} />
              {mobile && <span className='text-sm font-medium'>Đăng nhập</span>}
            </Button>
          </Link>
        </>
      )}

      {url !== configs.routes.checkout && (
        <div className="relative flex items-center">
          {mobile ? <CartDrawer /> : <CartPopover />}
        </div>
      )}
    </div>
  );
}

