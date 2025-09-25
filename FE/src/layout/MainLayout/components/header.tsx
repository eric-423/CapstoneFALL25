'use client';

import logo from '@/assets/full-logo.svg';
import { CartDrawer, CartPopover } from '@/components/common/cart';
import { Button } from '@/components/ui/button';
import configs from '@/configs';
import { useAuth } from '@/hooks';
import { useOutsideClicked } from '@/hooks/useOutsideClicked';
import { removeAccessToken, removeRefreshToken } from '@/utils/cookies';

import { LogIn, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useOutsideClicked(document.getElementById('mobile-menu') as HTMLDivElement, () => setIsMenuOpen(false), isMenuOpen);

  return (
    <header className='sticky top-0 z-50 w-full bg-background shadow-sm'>
      <div className='container mx-auto px-5 md:px-16 py-0 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <div className='relative w-30'>
            <img src={logo} alt='Tấm Tắc Logo' className='mx-auto w-30' />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center space-x-6'>
          <NavLinks />
        </nav>

        {/* Desktop Action Buttons */}
        <div className='hidden md:flex items-center space-x-4'>
          <ActionButtons isAuthenticated={isAuthenticated} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden text-primary'
          onClick={() => setIsMenuOpen(true)}
          disabled={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-background border-t py-4 px-4 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'visible' : 'hidden'}`}
        id='mobile-menu'
      >
        <div className='container mx-auto px-4 flex flex-col space-y-4'>
          <nav className='flex flex-col space-y-3'>
            <NavLinks mobile onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </nav>
          <div className='flex justify-center space-x-6 pt-4 border-t'>
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
    { href: configs.routes.menu, label: 'Đặt Hàng Ngay!' },
    // { href: '', label: 'Chuyện Cơm Tấm' },
    // { href: '', label: 'Nhượng Quyền' },
    // { href: '', label: 'Cửa Hàng' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onClick}
          className={`font-medium mx-24 text-primary group transition-all duration-300 ease-in-out ${mobile ? 'text-lg py-4' : ''}`}
        >
          <span className='bg-left-bottom font-semibold bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out'>
            {link.label}
          </span>
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
  const url = useLocation().pathname;
  const handleLogout = () => {
    onClick();
    removeAccessToken();
    removeRefreshToken();
    window.location.reload();
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Link to={configs.routes.profile}>
            <Button
              variant='ghost'
              size={mobile ? 'default' : 'icon'}
              className='text-primary hover:text-[#B84A0E] hover:bg-[#FFE8D6]'
              onClick={onClick}
            >
              <User size={mobile ? 20 : 24} />
              {mobile && <span className='ml-2'>Tài khoản</span>}
            </Button>
          </Link>
          <Button
            variant='ghost'
            size={mobile ? 'default' : 'icon'}
            className='text-primary hover:text-[#B84A0E] hover:bg-[#FFE8D6]'
            onClick={handleLogout}
          >
            <LogOut size={mobile ? 20 : 24} />
            {mobile && <span className='ml-2'>Đăng xuất</span>}
          </Button>
        </>
      ) : (
        <>
          <Link to={configs.routes.login}>
            <Button
              variant='ghost'
              size={mobile ? 'default' : 'icon'}
              className='text-primary hover:text-[#B84A0E] hover:bg-[#FFE8D6]'
            >
              <LogIn size={mobile ? 20 : 24} />
              {mobile && <span className='ml-2'>Đăng nhập</span>}
            </Button>
          </Link>
        </>
      )}

      {url !== configs.routes.checkout && (mobile ? <CartDrawer /> : <CartPopover />)}
    </>
  );
}
