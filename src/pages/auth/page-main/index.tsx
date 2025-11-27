import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUserTie, FaUsers, FaTag, FaTools, FaSitemap, FaHandshake, FaArrowRight, FaCogs,
    FaCheckCircle, FaSpinner,
    FaRobot
} from 'react-icons/fa';
import { FiLayers } from 'react-icons/fi';

// Import API (Đã loại bỏ getAllTrangWeb)
import { 
    getAllNguoiDung, 
    getAllChucVu, 
    getAllChucNang, 
    getAllNhomQuyen
} from '../../../api/login'; 

// Danh sách các tab quản lý (Đã xóa Trang Web)
const managementTabs = [
    { name: "Chức vụ (Roles)", path: "/phanquyen/chucvu", icon: FaUserTie, description: "Định nghĩa các vị trí và cấp bậc trong hệ thống." },
    { name: "Người dùng (Users)", path: "/phanquyen/nguoidung", icon: FaUsers, description: "Quản lý tài khoản, mật khẩu và gán chức vụ." },
    { name: "Chức năng (Features)", path: "/phanquyen/chucnang", icon: FaTools, description: "Quản lý mã quyền (Code) và URL truy cập (Trang web)." }, // Cập nhật mô tả
    { name: "Nhóm quyền (Groups)", path: "/phanquyen/nhomquyen", icon: FaTag, description: "Gom nhóm các chức năng để cấp quyền nhanh." },
    { name: "Chatbot (AI)", path: "/phanquyen/chatbot", icon: FaRobot, description: "Quản lý nội dung và dữ liệu giúp Chatbot AI hoạt động hiệu quả." },
];

export default function PhanQuyenIndex() {
    const navigate = useNavigate();
    
    // State thống kê
    const [stats, setStats] = useState({
        roles: 0,
        users: 0,
        features: 0,
        groups: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu thực tế
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Gọi song song 4 API
                const [users, roles, features, groups] = await Promise.all([
                    getAllNguoiDung(),
                    getAllChucVu(),
                    getAllChucNang(),
                    getAllNhomQuyen()
                ]);

                setStats({
                    roles: roles?.length || 0,
                    users: users?.length || 0,
                    features: features?.length || 0,
                    groups: groups?.length || 0,
                });
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                    <FiLayers className='w-4 h-4 text-blue-500' /> Hệ thống quản trị quyền truy cập tập trung (RBAC).
                </p>
            </header>

            {/* 1. KHU VỰC THỐNG KÊ TỔNG QUAN */}
            <section className="mb-10 max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
                    Tổng quan Hệ thống
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard 
                        title="Chức vụ" 
                        value={stats.roles} 
                        Icon={FaUserTie} 
                        color="indigo" 
                        loading={loading}
                    />
                    <StatCard 
                        title="Người dùng" 
                        value={stats.users} 
                        Icon={FaUsers} 
                        color="blue" 
                        loading={loading}
                    />
                    <StatCard 
                        title="Chức năng / API" 
                        value={stats.features} 
                        Icon={FaTools} 
                        color="green" 
                        loading={loading}
                    />
                    <StatCard 
                        title="Nhóm quyền" 
                        value={stats.groups} 
                        Icon={FaTag} 
                        color="red" 
                        loading={loading}
                    />
                </div>
            </section>
            
            {/* 2. TAB ĐIỀU HƯỚNG QUẢN LÝ THỰC THỂ */}
            <section className="mb-10 max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
                    Danh mục Quản lý
                </h2>
                {/* Điều chỉnh Grid thành 2 cột cho cân đối với 4 item */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            {/* 3. KHU VỰC CHÍNH: TÁC VỤ NÂNG CAO */}
            <section className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2 border-b pb-2 border-indigo-200">
                    <FaHandshake className='w-5 h-5'/> Tác vụ Nâng cao
                </h2>
                <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                    
                    {/* Gán quyền */}
                    <div className="md:w-1/2 p-4 border-r border-indigo-100 pr-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Phân quyền Người dùng</h3>
                        <p className="text-slate-600 mb-4 text-sm">Thiết lập chi tiết quyền hạn: Chọn người dùng và gán các nhóm quyền tương ứng.</p>
                        <button 
                            onClick={() => navigate('/phanquyen/phanquyen')}
                            className="w-full flex items-center justify-center gap-3 px-5 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                        >
                            <FaCheckCircle className='w-4 h-4'/> Gán Nhóm Quyền
                        </button>
                    </div>

                    {/* Sơ đồ 3D */}
                    <div className="md:w-1/2 p-4 pl-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Sơ đồ Quan hệ (Visual Graph)</h3>
                        <p className="text-slate-600 mb-4 text-sm">Xem trực quan mối liên kết giữa User - Role - URL - Function dưới dạng đồ thị 3D.</p>
                        <button 
                            onClick={() => navigate('/phanquyen/sodo')}
                            className="w-full flex items-center justify-center gap-3 px-5 py-3 text-sm font-bold bg-white text-indigo-600 border border-indigo-300 rounded-xl shadow-md hover:bg-indigo-50 transition-all hover:-translate-y-0.5"
                        >
                            <FaSitemap className='w-4 h-4'/> Mở Sơ đồ 3D
                        </button>
                    </div>

                </div>
            </section>
        </div>
    );
}

// --- COMPONENTS CON ---

const StatCard = ({ title, value, Icon, color, loading }: { title: string, value: number, Icon: React.ElementType, color: 'indigo' | 'blue' | 'green' | 'red', loading: boolean }) => {
    const colorClass = {
        indigo: 'bg-indigo-100 text-indigo-700',
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-700',
    }[color];

    return (
        <div className={`p-5 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClass}`}>
            <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 opacity-70`} />
                {loading ? (
                    <FaSpinner className="animate-spin text-2xl opacity-50" />
                ) : (
                    <span className="text-3xl font-extrabold">{value}</span>
                )}
            </div>
            <p className="mt-3 text-sm font-semibold opacity-90">{title}</p>
        </div>
    );
};

const TabButton = ({ name, path, Icon, description, onClick }: { name: string, path: string, Icon: React.ElementType, description: string, onClick: (path: string) => void }) => (
    <div
        onClick={() => onClick(path)}
        className="bg-white p-5 rounded-xl shadow-md border border-gray-200 cursor-pointer 
                   hover:shadow-lg hover:border-indigo-300 transition-all duration-200 group flex flex-col justify-between h-full"
    >
        <div>
            <div className="flex justify-between items-center mb-3">
                <div className={`p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors`}>
                    <Icon className="w-6 h-6" />
                </div>
                <FaArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{name}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
    </div>
);