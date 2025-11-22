import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  AcademicCapIcon, // Sinh viên
  BuildingOffice2Icon, // Công ty
  UserGroupIcon, // Giảng viên
  ClipboardDocumentListIcon, // Đợt thực tập
  ArrowsRightLeftIcon, // Phân bổ
  ChartBarIcon, // Thống kê
  MegaphoneIcon, // Thông báo
  PowerIcon,
  BriefcaseIcon, // Giới thiệu việc làm
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Cấu trúc menu dựa trên AppRoutes của bạn
const menuGroups = [
  {
    title: "TỔNG QUAN",
    items: [
      { name: "Trang chủ", path: "/home", icon: <HomeIcon className="w-5 h-5" /> },
      { name: "Thống kê & Báo cáo", path: "/thongke", icon: <ChartBarIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: "QUẢN LÝ THỰC TẬP",
    items: [
      { name: "Đợt thực tập", path: "/batch-internship", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
      { name: "Phân bổ thực tập", path: "/internship-allocation", icon: <ArrowsRightLeftIcon className="w-5 h-5" /> },
      { name: "Giới thiệu việc làm", path: "/company-introduction", icon: <BriefcaseIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: "DỮ LIỆU NỀN TẢNG",
    items: [
      { name: "Sinh viên", path: "/student", icon: <AcademicCapIcon className="w-5 h-5" /> },
      { name: "Giảng viên", path: "/teacher", icon: <UserGroupIcon className="w-5 h-5" /> },
      { name: "Doanh nghiệp", path: "/company", icon: <BuildingOffice2Icon className="w-5 h-5" /> },
    ],
  },
  {
    title: "HỆ THỐNG",
    items: [
      { name: "Thông báo", path: "/thongbao", icon: <MegaphoneIcon className="w-5 h-5" /> },
    ],
  },
];

export default function Sidebar() {
  return (
    // Thêm rounded-2xl cho toàn bộ sidebar, xóa shadow khỏi aside để shadow được kiểm soát bởi container của sidebar (nếu có)
    <aside className="h-screen w-72 bg-white border-r border-gray-200 flex flex-col font-sans text-gray-600 rounded-2xl overflow-hidden sticky top-0 z-50">
      
      {/* 1. Header / Logo Area */}
      {/* Rounded top corners và gradient nhẹ hơn */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
             <AcademicCapIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight uppercase tracking-wide">Portal Thực Tập</h1>
            <p className="text-[10px] text-blue-100 opacity-90 tracking-wider">UNIVERSITY ADMIN</p>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Navigation Area */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {menuGroups.map((group, index) => (
          <div key={index}>
            {/* Group Title */}
            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            
            {/* Group Items */}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ease-in-out border border-transparent
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold border-blue-100 shadow-sm"
                        : "hover:bg-gray-50 hover:text-gray-900 text-gray-500"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span className={`transition-colors duration-200 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {isActive && <ChevronRightIcon className="w-4 h-4 text-blue-500" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Footer / User Profile & Logout */}
      {/* Rounded bottom corners và màu nền nhẹ */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 shadow-inner">
        <div className="flex items-center justify-between gap-3 mb-4 px-2">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {/* Sử dụng ảnh mặc định của UI Avatars hoặc ảnh thật nếu có */}
                  <img src="https://ui-avatars.com/api/?name=Admin&background=1f2937&color=fff&size=128" alt="Admin" className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">Quản trị viên</span>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                    </span>
                </div>
             </div>
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 hover:shadow-sm transition-all duration-200 group">
          <PowerIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  );
}