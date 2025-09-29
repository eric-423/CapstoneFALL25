import { Home, LucideIcon, UserRound, ShieldCheck, Users } from 'lucide-react';

type MenuItemType = {
  title: string;
  url: string;
  external?: string;
  icon?: LucideIcon;
  items?: MenuItemType[];
};
type MenuType = MenuItemType[];

export const mainMenu: MenuType = [
  {
    title: 'Trang chủ',
    url: '/',
    icon: Home,
  },
  {
    title: 'Hồ sơ',
    url: '/profile',
    icon: UserRound,
  },
  {
    title: 'Admin',
    url: '/admin',
    icon: ShieldCheck,
  },
  {
    title: 'Manager',
    url: '/manager',
    icon: Users,
  },
];
