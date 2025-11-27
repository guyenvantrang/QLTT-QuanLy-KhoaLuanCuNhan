"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
    Users, Building2, MapPin, Activity, Award, Briefcase, 
    TrendingUp, UserCheck 
} from "lucide-react";
import { motion } from "framer-motion";

// Import API (Đảm bảo đường dẫn import đúng)
import { 
    ThongKeCompany, 
    ThongKeSoDoDot, 
    Top5Company, 
    DSCompanyPhanLoai1 
} from "../api/batch-internship"; // Kiểm tra lại đường dẫn import này!

// --- FIX LEAFLET ICON ISSUE ---
// (Quan trọng: Cần import icon từ assets hoặc CDN để tránh lỗi 404 ảnh marker)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

// --- COLORS PALETTE ---
const COLORS = {
    primary: "#2563EB",   // Blue-600
    success: "#10B981",   // Emerald-500
    warning: "#F59E0B",   // Amber-500
    danger: "#EF4444",    // Red-500
    purple: "#8B5CF6",    // Violet-500
    chart: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]
};

// --- COMPONENTS ---

const StatCard = ({ title, value, icon, colorClass, subText }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150 ${colorClass.replace('text-', 'text-')}`}>
            {icon}
        </div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
                {icon}
            </div>
        </div>
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        {subText && <p className="text-xs text-slate-400 mt-2">{subText}</p>}
    </motion.div>
);

const ChartContainer = ({ title, children, icon }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            {icon} {title}
        </h3>
        <div className="flex-1 min-h-[300px] w-full">
            {children}
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function CompanyStatisticsDashboard() {
    // Khởi tạo state với giá trị mặc định an toàn
    const [stats, setStats] = useState<any>({
        tongdot: 0,
        tongsinhvien: 0,
        congty: { tongcongtycuasinhvien: 0, tongcongtycuakhoa: 0, tongcongtygioithieu: 0 },
        giangvien: { tonggiangvienhoatdong: 0, tonggiangvienkhonghoatdong: 0 }
    });
    const [chartDataDot, setChartDataDot] = useState<any[]>([]);
    const [topCompanies, setTopCompanies] = useState<any[]>([]);
    const [mapData, setMapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Gọi song song các API
                const [resStats, resDot, resTop, resMap] = await Promise.all([
                    ThongKeCompany(),
                    ThongKeSoDoDot(),
                    Top5Company(),
                    DSCompanyPhanLoai1()
                ]);

                // Cập nhật state nếu có dữ liệu
                if (resStats) setStats(resStats);
                if (Array.isArray(resDot)) setChartDataDot(resDot);
                if (Array.isArray(resTop)) setTopCompanies(resTop);
                
                // Xử lý dữ liệu bản đồ: Lọc các công ty có tọa độ hợp lệ
                if (Array.isArray(resMap)) {
                    const validMapData = resMap.filter((c: any) => 
                        c.lat && c.long && !isNaN(parseFloat(c.lat)) && !isNaN(parseFloat(c.long))
                    );
                    setMapData(validMapData);
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-slate-500 font-medium">Đang tổng hợp dữ liệu...</span>
                </div>
            </div>
        );
    }

    // Dữ liệu Pie Chart (Phân loại công ty)
    const pieData = [
        { name: "Sinh viên tự tìm", value: stats.congty?.tongcongtycuasinhvien || 0 },
        { name: "Khoa phân bổ", value: stats.congty?.tongcongtycuakhoa || 0 },
        { name: "Được giới thiệu", value: stats.congty?.tongcongtygioithieu || 0 },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
            <div className="max-w-[1920px] mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30 text-white">
                        <Activity size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Thống Kê Doanh Nghiệp & Thực Tập</h1>
                        <p className="text-slate-500 text-sm">Tổng quan số liệu về công ty, sinh viên và phân bố địa lý.</p>
                    </div>
                </div>

                {/* 1. Stat Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Tổng đợt thực tập" 
                        value={stats?.tongdot || 0} 
                        icon={<Briefcase size={24} />} 
                        colorClass="text-blue-600" 
                    />
                    <StatCard 
                        title="Tổng sinh viên" 
                        value={stats?.tongsinhvien || 0} 
                        icon={<Users size={24} />} 
                        colorClass="text-emerald-500" 
                    />
                    <StatCard 
                        title="Giảng viên hoạt động" 
                        value={stats?.giangvien?.tonggiangvienhoatdong || 0} 
                        subText={`Không hoạt động: ${stats?.giangvien?.tonggiangvienkhonghoatdong || 0}`}
                        icon={<UserCheck size={24} />} 
                        colorClass="text-purple-500" 
                    />
                    <StatCard 
                        title="Tổng công ty" 
                        value={(stats?.congty?.tongcongtycuasinhvien || 0) + (stats?.congty?.tongcongtycuakhoa || 0) + (stats?.congty?.tongcongtygioithieu || 0)} 
                        icon={<Building2 size={24} />} 
                        colorClass="text-orange-500" 
                    />
                </div>

                {/* 2. Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Cột 1: Biểu đồ cột chồng (Đợt thực tập) */}
                    <div className="xl:col-span-2">
                        <ChartContainer title="Tình hình đăng ký theo Đợt" icon={<TrendingUp className="text-blue-500" />}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartDataDot} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="madot" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ fill: '#F1F5F9' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="tutim" name="Tự tìm" stackId="a" fill={COLORS.primary} radius={[0, 0, 4, 4]} barSize={40} />
                                    <Bar dataKey="khoaphanbo" name="Khoa phân bổ" stackId="a" fill={COLORS.success} radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>

                    {/* Cột 2: Biểu đồ tròn (Nguồn công ty) */}
                    <div className="xl:col-span-1">
                        <ChartContainer title="Cơ cấu nguồn Công ty" icon={<Activity className="text-emerald-500" />}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>

                {/* 3. Top Companies & Map Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* Top 5 Công ty */}
                    <div className="xl:col-span-1">
                        <ChartContainer title="Top 5 Doanh nghiệp tiêu biểu" icon={<Award className="text-yellow-500" />}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topCompanies} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="tencongty" 
                                        type="category" 
                                        width={150} 
                                        tick={{ fontSize: 11, fill: '#475569' }} 
                                        interval={0}
                                    />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="soluong_sinhvien" name="Số lượng SV" fill={COLORS.purple} radius={[0, 4, 4, 0]} barSize={30}>
                                        {topCompanies.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>

                    {/* Bản đồ */}
                    <div className="xl:col-span-2">
                        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 h-[500px] relative overflow-hidden">
                            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-slate-200">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin className="text-red-500" size={18} /> Bản đồ Doanh nghiệp (Phân loại 1)
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Hiển thị {mapData.length} địa điểm đã xác thực</p>
                            </div>
                            
                            {/* Kiểm tra có dữ liệu bản đồ không trước khi render MapContainer */}
                            {mapData.length > 0 ? (
                                <MapContainer 
                                    center={[10.762622, 106.660172]} // Mặc định HCM
                                    zoom={10} 
                                    scrollWheelZoom={false}
                                    style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {mapData.map((company, index) => (
                                        <Marker 
                                            key={index} 
                                            position={[parseFloat(company.lat), parseFloat(company.long)]}
                                        >
                                            <Popup>
                                                <div className="p-1 min-w-[200px]">
                                                    <h4 className="font-bold text-blue-700 text-sm mb-1">{company.tencongty}</h4>
                                                    <p className="text-xs text-slate-600 mb-1 flex items-start gap-1">
                                                        <MapPin size={10} className="mt-0.5" /> {company.diachi}
                                                    </p>
                                                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                                                            Đang hoạt động
                                                        </span>
                                                        {company.linhvuc && (
                                                            <span className="text-[10px] text-slate-400 italic truncate max-w-[100px]">
                                                                {company.linhvuc}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                    Không có dữ liệu bản đồ
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}