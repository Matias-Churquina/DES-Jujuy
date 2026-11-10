import React from 'react';
import {
  Home, Route, CalendarDays, Package, Users, CarFront, BarChart3, Settings,
  Moon, Sun, Bell, ChevronRight, ArrowRightLeft, MapPin, Clock, Armchair,
  Phone, Share2, MessageSquare, Send, TrendingUp, SlidersHorizontal,
  MoreHorizontal, Plus, ArrowRight, Wallet, Search, LogOut, CheckCircle2,
  CircleDot, Flag, X, Star, RefreshCw, Navigation,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  home: Home,
  route: Route,
  calendar: CalendarDays,
  package: Package,
  users: Users,
  car: CarFront,
  chart: BarChart3,
  settings: Settings,
  moon: Moon,
  sun: Sun,
  bell: Bell,
  chevron: ChevronRight,
  swap: ArrowRightLeft,
  pin: MapPin,
  clock: Clock,
  seat: Armchair,
  phone: Phone,
  share: Share2,
  message: MessageSquare,
  send: Send,
  trend: TrendingUp,
  filter: SlidersHorizontal,
  more: MoreHorizontal,
  plus: Plus,
  arrow: ArrowRight,
  wallet: Wallet,
  search: Search,
  logout: LogOut,
  check: CheckCircle2,
  dot: CircleDot,
  flag: Flag,
  close: X,
  star: Star,
  refresh: RefreshCw,
  navigation: Navigation,
};

export default function Icon({
  name,
  size = 20,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = icons[name] || CircleDot;
  return <Cmp className={`icon ${className}`} size={size} strokeWidth={1.8} />;
}
