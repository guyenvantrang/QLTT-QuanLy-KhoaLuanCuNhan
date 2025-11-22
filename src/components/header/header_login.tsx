export default function Header() {
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

        {/* Nav bên phải */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a
            href="#"
            className="transition duration-200 hover:text-yellow-300 hover:underline underline-offset-4"
          >
            Giới thiệu
          </a>
          <a
            href="#"
            className="transition duration-200 hover:text-yellow-300 hover:underline underline-offset-4"
          >
            Tuyển sinh
          </a>
          <a
            href="#"
            className="transition duration-200 hover:text-yellow-300 hover:underline underline-offset-4"
          >
            Liên hệ
          </a>
        </nav>
      </div>
    </header>
  );
}
