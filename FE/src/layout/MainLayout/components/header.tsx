"use client";

import { CartDrawer, CartPopover } from "@/components/common/cart";
import { Button } from "@/components/ui/button";
import configs from "@/utils/configs";
import { useAuth } from "@/utils/hooks";
import { useOutsideClicked } from "@/utils/hooks/useOutsideClicked";
import { BranchDropdown } from "./branch-dropdown";

import { LogOut, Menu, User, X } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isCheckoutPage = pathname?.startsWith("/checkout");

  useOutsideClicked(mobileMenuRef, () => setIsMenuOpen(false), isMenuOpen);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#FFFCF7] shadow-sm border-b border-gray-100 ${montserrat.className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-44 md:w-56 h-10 overflow-visible">
            <Image
              src="/full-logo.svg"
              alt="Tấm Tắc Logo"
              fill
              sizes="176px, 224px"
              className="object-contain scale-125 md:scale-160"
              priority
            />
          </div>
        </Link>
        <div className="hidden lg:flex items-center space-x-3">
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </nav>
          {!isCheckoutPage && <BranchDropdown />}
          <ActionButtons
            isAuthenticated={isAuthenticated}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden !bg-[#FFFCF7] !text-orange-500 hover:!text-orange-600 hover:!bg-[#FFFCF7]"
          onClick={() => setIsMenuOpen(true)}
          disabled={isMenuOpen}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </Button>
      </div>

      <div
        ref={mobileMenuRef}
        className={`lg:hidden bg-background border-t border-gray-100 py-4 transition-transform duration-300 ease-in-out ${isMenuOpen ? "visible" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <nav className="flex flex-col space-y-3">
            <NavLinks mobile onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </nav>
          {!isCheckoutPage && (
            <div className="flex justify-center items-center w-full pt-4 border-t border-gray-100 px-4">
              <BranchDropdown />
            </div>
          )}
          <div className="flex justify-center items-center w-full pt-4 border-t border-gray-100 ml-4">
            <ActionButtons
              mobile
              isAuthenticated={isAuthenticated}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLinks({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) {
  const links = [
    { href: configs.routes.home, label: "Trang chủ" },
    { href: configs.routes.about, label: "Về Tấm Tắc" },
    { href: configs.routes.menu, label: "Đặt Hàng" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={`font-medium !text-orange-500 hover:!text-orange-600 transition-colors duration-300 ${mobile ? "text-lg py-4" : "text-base"}`}
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
    <div className="flex items-center justify-center gap-x-3 sm:gap-x-4 flex-wrap">
      {isAuthenticated ? (
        <>
          <Link href={configs.routes.profile}>
            <Button
              variant="ghost"
              size={mobile ? "default" : "icon"}
              className="!bg-[#FFFCF7] !text-orange-500 hover:!text-orange-600 hover:!bg-[#FFFCF7] flex items-center gap-x-2"
              onClick={onClick}
            >
              <User size={mobile ? 24 : 28} />
              {mobile && <span className="text-sm font-medium">Tài khoản</span>}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size={mobile ? "default" : "icon"}
            className="!bg-[#FFFCF7] !text-orange-500 hover:!text-orange-600 hover:!bg-[#FFFCF7] flex items-center gap-x-2"
            onClick={handleLogout}
          >
            <LogOut size={mobile ? 24 : 28} />
            {mobile && <span className="text-sm font-medium">Đăng xuất</span>}
          </Button>
        </>
      ) : (
        <>
          <Link href={configs.routes.login}>
            <Button
              variant="ghost"
              size={mobile ? "default" : "icon"}
              className="!bg-[#FFFCF7] !text-orange-500 hover:!text-orange-600 hover:!bg-[#FFFCF7] flex items-center gap-x-2"
            >
              <User size={mobile ? 24 : 28} />
              {mobile && <span className="text-sm font-medium">Đăng nhập</span>}
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
