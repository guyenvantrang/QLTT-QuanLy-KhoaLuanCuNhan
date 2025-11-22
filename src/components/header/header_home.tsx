import { useState } from "react";

export default function HeaderHome() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-3 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo + Tên trường */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-white/40 overflow-hidden">
            <img
              src="assets/image/logo/Logo-HUIT-01.png"
              alt="University Logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-semibold uppercase drop-shadow-sm">
              Trường Đại Học Công Thương TP. Hồ Chí Minh
            </h1>
            <p className="text-xs opacity-90 tracking-wide">
              Hệ thống quản lý sinh viên
            </p>
          </div>
        </div>

        {/* Nav chính */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium relative">

          <a
            href="/dashboard"
            className="transition duration-200 hover:text-yellow-300 hover:underline underline-offset-4"
          >
            Dashboard
          </a>

          {/* Hồ sơ Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-1 transition duration-200 hover:text-yellow-300"
            >
              Hồ sơ
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {openProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
                <a href="/profile/view" className="block px-4 py-2 hover:bg-gray-100">Xem hồ sơ</a>
                <a href="/profile/edit" className="block px-4 py-2 hover:bg-gray-100">Chỉnh sửa hồ sơ</a>
                <a href="/profile/grades" className="block px-4 py-2 hover:bg-gray-100">Điểm học tập</a>
              </div>
            )}
          </div>

          {/* Cài đặt Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenSettings(!openSettings)}
              className="flex items-center gap-1 transition duration-200 hover:text-yellow-300"
            >
              Cài đặt
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {openSettings && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
                <a href="/settings/account" className="block px-4 py-2 hover:bg-gray-100">Tài khoản</a>
                <a href="/settings/password" className="block px-4 py-2 hover:bg-gray-100">Đổi mật khẩu</a>
                <a href="/logout" className="block px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold">Đăng xuất</a>
              </div>
            )}
          </div>

          <a
            href="/notifications"
            className="transition duration-200 hover:text-yellow-300 hover:underline underline-offset-4"
          >
            Thông báo
          </a>

        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
            className="text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {openMobileMenu && (
        <div className="md:hidden bg-blue-500 mt-2 rounded-md shadow-md">
          <a href="/dashboard" className="block px-4 py-2 text-white hover:bg-blue-600">Dashboard</a>
          <a href="/profile/view" className="block px-4 py-2 text-white hover:bg-blue-600">Hồ sơ</a>
          <a href="/settings/account" className="block px-4 py-2 text-white hover:bg-blue-600">Cài đặt</a>
          <a href="/notifications" className="block px-4 py-2 text-white hover:bg-blue-600">Thông báo</a>
          <a href="/logout" className="block px-4 py-2 text-red-300 hover:bg-red-600 font-semibold">Đăng xuất</a>
        </div>
      )}
    </header>
  );
}
