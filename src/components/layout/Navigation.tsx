'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive(path)
        ? 'bg-black text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-black'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">💼</span>
            <span className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors">
              Quản Lý Chi Tiêu
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={navLinkClass('/')}>
              📊 Dashboard
            </Link>
            <Link href="/transactions" className={navLinkClass('/transactions')}>
              📋 Giao Dịch
            </Link>
            <Link href="/categories" className={navLinkClass('/categories')}>
              📁 Danh Mục
            </Link>
            <Link href="/transactions/new">
              <Button className="ml-2">✨ Thêm Giao Dịch</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Hidden by default */}
        <div className="md:hidden border-t border-gray-200 py-3 space-y-1">
          <Link
            href="/"
            className={`block px-4 py-2 rounded-lg ${
              isActive('/') ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </Link>
          <Link
            href="/transactions"
            className={`block px-4 py-2 rounded-lg ${
              isActive('/transactions')
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 Giao Dịch
          </Link>
          <Link
            href="/categories"
            className={`block px-4 py-2 rounded-lg ${
              isActive('/categories')
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📁 Danh Mục
          </Link>
          <Link href="/transactions/new" className="block">
            <Button className="w-full">✨ Thêm Giao Dịch</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
