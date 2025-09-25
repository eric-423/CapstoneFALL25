import { Home, LucideIcon, MessageCircle, UserRound } from 'lucide-react';

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
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'My Network',
    url: '/my-network',
    icon: UserRound,
  },
  {
    title: 'Message',
    url: '/chat',
    icon: MessageCircle,
  },
];
