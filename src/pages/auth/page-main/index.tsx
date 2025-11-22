import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUserTie, FaUsers, FaTag, FaTools, FaSitemap, FaHandshake, FaArrowRight, FaCogs,
    FaCheckCircle
} from 'react-icons/fa';
import { FiLayers } from 'react-icons/fi';

// Danh sách các tab/thực thể quản lý
const managementTabs = [
    { name: "Chức vụ (Roles)", path: "/phanquyen/chucvu", icon: FaUserTie, description: "Định nghĩa các vị trí chính thức trong hệ thống." },
    { name: "Người dùng (Users)", path: "/phanquyen/nguoidung", icon: FaUsers, description: "Quản lý tài khoản, mật khẩu và vai trò người dùng." },
    { name: "Trang Web (Pages)", path: "/phanquyen/trangweb", icon: FaSitemap, description: "Quản lý các trang/đường dẫn truy cập trong ứng dụng." },
    { name: "Chức năng (Features)", path: "/phanquyen/chucnang", icon: FaTools, description: "Khai báo các hành động chi tiết (Thêm, Xóa, Sửa, Xem)." },
    { name: "Nhóm quyền (Groups)", path: "/phanquyen/nhomquyen", icon: FaTag, description: "Tập hợp các quyền hạn chung để gán cho người dùng." },
];

export default function PhanQuyenIndex() {
    const navigate = useNavigate();
    // State giả lập cho khu vực thống kê
    const [stats] = useState({
        roles: 5,
        users: 120,
        features: 55,
        groups: 10,
    });

    // Hàm chuyển đổi tab
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen font-sans">
            
            {/* Header Chính */}
            <header className="mb-10 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3 border-b border-indigo-200 pb-3">
                    <FaCogs className="w-8 h-8 text-indigo-500" /> Trung Tâm Quản Lý Phân Quyền
                </h1>
                <p className="text-slate-600 mt-2 flex items-center gap-2">
                    <FiLayers className='w-4 h-4 text-blue-500' /> Quản lý các thành phần cốt lõi của hệ thống phân quyền (RBAC + Fine-Grained Permissions).
                </p>
            </header>

            {/* 1. KHU VỰC THỐNG KÊ TỔNG QUAN */}
            <section className="mb-10 max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
                    Tổng quan Hệ thống
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard 
                        title="Chức vụ đã định nghĩa" 
                        value={stats.roles} 
                        Icon={FaUserTie} 
                        color="indigo" 
                    />
                    <StatCard 
                        title="Người dùng hoạt động" 
                        value={stats.users} 
                        Icon={FaUsers} 
                        color="blue" 
                    />
                    <StatCard 
                        title="Chức năng chi tiết" 
                        value={stats.features} 
                        Icon={FaTools} 
                        color="green" 
                    />
                    <StatCard 
                        title="Nhóm quyền cơ sở" 
                        value={stats.groups} 
                        Icon={FaTag} 
                        color="red" 
                    />
                </div>
            </section>
            
            {/* 2. TAB ĐIỀU HƯỚNG QUẢN LÝ THỰC THỂ */}
            <section className="mb-10 max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
                    Các Thực thể Quản lý
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {managementTabs.map((tab) => (
                        <TabButton 
                            key={tab.path}
                            name={tab.name}
                            path={tab.path}
                            Icon={tab.icon}
                            description={tab.description}
                            onClick={handleNavigation}
                        />
                    ))}
                </div>
            </section>

            {/* 3. KHU VỰC CHÍNH: PHÂN QUYỀN TRỰC TIẾP */}
            <section className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2 border-b pb-2 border-indigo-200">
                    <FaHandshake className='w-5 h-5'/> Quản lý & Gán Quyền (Permission Assignment)
                </h2>
                <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                    
                    <div className="md:w-1/2 p-4 border-r border-indigo-100 pr-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Phân quyền theo Nhóm</h3>
                        <p className="text-slate-600 mb-4">Gán các nhóm quyền đã định nghĩa cho Người dùng cụ thể.</p>
                        <button 
                             // Giả định trang này sẽ mở Modal hoặc trang gán quyền chi tiết
                            onClick={() => navigate('/phanquyen/phanquyen')}
                            className="w-full flex items-center justify-center gap-3 px-5 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all"
                        >
                            <FaCheckCircle className='w-4 h-4'/> Gán Nhóm Quyền
                        </button>
                    </div>

                     <div className="md:w-1/2 p-4 pl-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Xem Ma trận Quyền</h3>
                        <p className="text-slate-600 mb-4">Xem tổng quan mối liên kết giữa Chức vụ, Nhóm quyền và Chức năng.</p>
                        <button 
                            onClick={() => navigate('/phanquyen/sodo')}
                            className="w-full flex items-center justify-center gap-3 px-5 py-3 text-sm font-bold bg-white text-indigo-600 border border-indigo-300 rounded-xl shadow-md hover:bg-indigo-50 transition-all"
                        >
                            <FaSitemap className='w-4 h-4'/> Xem Ma trận Chi tiết
                        </button>
                    </div>

                </div>
            </section>

        </div>
    );
}

// --- COMPONENTS CON CHO GIAO DIỆN ---

// Card Thống kê
const StatCard = ({ title, value, Icon, color }: { title: string, value: number, Icon: React.ElementType, color: 'indigo' | 'blue' | 'green' | 'red' }) => {
    
    const colorClass = {
        indigo: 'bg-indigo-100 text-indigo-700',
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-700',
    }[color];

    return (
        <div className={`p-5 rounded-xl shadow-lg border border-gray-100 transition-shadow duration-300 hover:shadow-xl ${colorClass}`}>
            <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 opacity-70`} />
                <span className="text-3xl font-extrabold">{value}</span>
            </div>
            <p className="mt-3 text-sm font-semibold">{title}</p>
        </div>
    );
};

// Nút Tab Điều hướng
const TabButton = ({ name, path, Icon, description, onClick }: { name: string, path: string, Icon: React.ElementType, description: string, onClick: (path: string) => void }) => (
    <div
        onClick={() => onClick(path)}
        className="bg-white p-5 rounded-xl shadow-md border border-gray-200 cursor-pointer 
                   hover:shadow-lg hover:border-indigo-300 transition-all duration-200 group"
    >
        <div className="flex justify-between items-center mb-3">
            <div className={`p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors`}>
                <Icon className="w-5 h-5" />
            </div>
            <FaArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{name}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
);