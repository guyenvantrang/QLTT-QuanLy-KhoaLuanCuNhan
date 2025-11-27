"use client";
import { motion } from "framer-motion";
import { 
    Users, Building2, XCircle, MessageSquare, 
    ChevronRight, TrendingUp, Activity,  
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, 
    ResponsiveContainer, CartesianGrid 
} from "recharts";
import { thongke } from "../../../functions/batch-internship";
import { useNavigate, useParams } from "react-router-dom";

/* ==========================
     ⭐ INTERFACES & UTILS
========================== */
interface ThongKeResult {
    tongsosinhviendangky: number;
    tongsinhviendacocongty: number;
    tongsinhvienchuacongty: number;
    tongtinnhanchuadoc: number;
    tongphongvandau: number;
    tongLanRot: number;
    chuacoketqua: number;
}

// Bảng màu chủ đạo
const COLORS = {
    primary: "#2563EB",   // Blue-600 (Chủ đạo)
    success: "#10B981",   // Emerald-500 (Tích cực)
    danger: "#F43F5E",    // Rose-500 (Tiêu cực/Cảnh báo)
    warning: "#F59E0B",   // Amber-500 (Chờ đợi)
    bgIcon: "rgba(59, 130, 246, 0.1)", // Nền icon mờ
};

/* ==========================
     ⭐ CUSTOM TOOLTIP (RECHARTS)
========================== */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-3 border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-xl">
                <p className="font-bold text-slate-700 mb-1 text-sm">{label}</p>
                <div className="flex items-center gap-2">
                    <span 
                        className="w-2.5 h-2.5 rounded-full shadow-sm" 
                        style={{ backgroundColor: payload[0].color }}
                    ></span>
                    <span className="text-xs text-slate-600 font-medium">
                        Số lượng: <span className="font-bold text-blue-700 text-sm ml-1">{payload[0].value}</span>
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

/* ==========================
     ⭐ STAT CARD COMPONENT (GLOWING EFFECT)
========================== */
const StatCard = ({ 
    title, 
    value, 
    icon, 
    iconColor, 
    onDetail, 
}: {
    title: string; 
    value: number | string; 
    icon: React.ReactNode; 
    iconColor: string; // Class text color (vd: text-blue-600)
    onDetail?: () => void;
}) => {
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // --- GLOWING BORDER EFFECT ---
            className="group relative p-6 rounded-2xl bg-white border border-blue-100 shadow-sm transition-all duration-300 
                       hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex flex-col justify-between overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 opacity-50 rounded-bl-full pointer-events-none" />

            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
                        <p className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors">
                            {value}
                        </p>
                    </div>
                    {/* Icon Box */}
                    <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10 bg-current shadow-inner ring-1 ring-black/5`}>
                        {icon}
                    </div>
                </div>
            </div>

            {onDetail && (
                <button
                    onClick={onDetail}
                    className="
                        mt-2 w-full py-2 px-4
                        text-xs font-bold uppercase tracking-wide
                        rounded-lg
                        text-blue-600 bg-blue-50
                        border border-blue-100
                        group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600
                        group-hover:shadow-md
                        transition-all duration-300 ease-out
                        flex items-center justify-center gap-2
                    "
                >
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            )}
        </motion.div>
    );
};

/* ==========================
     ⭐ CHART CARD COMPONENT
========================== */
const ChartCard = ({
    title,
    subtitle,
    children,
    onDetail,
    icon
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onDetail?: () => void;
    icon?: React.ReactNode;
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            // --- GLOWING BORDER EFFECT ---
            className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col h-full transition-all duration-300
                       hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3">
                    {icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit border border-blue-100">{icon}</div>}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{title}</h3>
                        {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {onDetail && (
                    <button
                        onClick={onDetail}
                        className="
                            px-3 py-1.5
                            text-xs font-bold rounded-full
                            text-slate-500 bg-slate-100
                            hover:bg-blue-600 hover:text-white
                            transition-all duration-300
                            flex items-center gap-1
                        "
                    >
                        Chi tiết <ChevronRight className="w-3 h-3" />
                    </button>
                )}
            </div>
            <div className="flex-1 w-full min-h-[300px] relative">
                {children}
            </div>
        </motion.div>
    );
};

/* ==========================
     ⭐ DASHBOARD COMPONENT
========================== */
export default function Dashboard() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<ThongKeResult>();
    const { madot } = useParams<{ madot: string }>();

    useEffect(() => { 
        thongke(madot || "")
            .then((res) => setCourses(res))
            .catch((err) => console.error("Lỗi tải dữ liệu:", err)); 
    }, [madot]);

    // Xử lý dữ liệu an toàn (tránh undefined)
    const stats = {
        totalRegister: courses?.tongsosinhviendangky ?? 0,
        hasCompany: courses?.tongsinhviendacocongty ?? 0,
        noCompany: courses?.tongsinhvienchuacongty ?? 0,
        noInterview: courses?.chuacoketqua ?? 0,
        pass: courses?.tongphongvandau ?? 0,
        fail: courses?.tongLanRot ?? 0,
        unreadMessages: courses?.tongtinnhanchuadoc ?? 0,
    };

    const showDetail = (title: string) => alert(`Chức năng đang cập nhật: ${title}`);

    // Dữ liệu biểu đồ
    const companyStatusData = [
        { name: "Đã có công ty", value: stats.hasCompany, color: COLORS.success }, // Xanh lá
        { name: "Chưa có công ty", value: stats.noCompany, color: COLORS.danger }, // Đỏ
    ];

    const interviewResultData = [
        { name: "Đậu", value: stats.pass, color: COLORS.success },
        { name: "Rớt", value: stats.fail, color: COLORS.danger },
        { name: "Chưa có KQ", value: stats.noInterview, color: COLORS.warning }, // Vàng cam
    ];

    return (
        <div className="min-h-screen bg-slate-50/80 p-6 font-sans text-slate-900 selection:bg-blue-100">
            <div className="max-w-[1600px] mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center gap-3">
                            <Activity className="text-blue-600" />
                            Tổng Quan Đợt Thực Tập
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-1 ml-9">
                            Mã đợt: <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-bold">{madot}</span>
                        </p>
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden" animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    <StatCard
                        title="Tổng sinh viên đăng ký"
                        value={stats.totalRegister}
                        icon={<Users size={24} />}
                        iconColor="text-blue-600"
                        onDetail={() => navigate(`/internship-allocation/danh-sach-sinh-vien-dang-ky/${madot}`)}
                    />
                    <StatCard
                        title="Đã có nơi thực tập"
                        value={stats.hasCompany}
                        icon={<Building2 size={24} />}
                        iconColor="text-emerald-500" // Màu xanh lá biểu thị thành công
                        onDetail={() => navigate(`/internship-allocation/danh-sach-sinh-vien-da-co-cong-ty/${madot}`)}
                    />
                    <StatCard
                        title="Chưa có nơi thực tập"
                        value={stats.noCompany}
                        icon={<XCircle size={24} />}
                        iconColor="text-rose-500" // Màu đỏ biểu thị cảnh báo
                        onDetail={() => navigate(`/internship-allocation/danh-sach-sinh-vien-chua-co-cong-ty/${madot}`)}
                    />
                    <StatCard
                        title="Phân công giảng viên"
                        value={stats.unreadMessages}
                        icon={<MessageSquare size={24} />}
                        iconColor="text-amber-500" // Màu vàng biểu thị chú ý
                        onDetail={() => navigate(`/internship-allocation/danh-sach-phan-bo-giang-vien/${madot}`)}
                    />
                </motion.div>

                {/* --- CHARTS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Biểu đồ tròn: Tình trạng phân bổ */}
                    <ChartCard
                        title="Tình Trạng Phân Bổ"
                        subtitle="Tỷ lệ sinh viên đã có và chưa có công ty"
                        icon={<Activity size={20} />}
                        onDetail={() => navigate(`/internship-allocation/danh-sach-xac-nhan/${madot}`)}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={companyStatusData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={70} // Biểu đồ dạng Doughnut hiện đại
                                    outerRadius={100} 
                                    paddingAngle={5}
                                >
                                    {companyStatusData.map((entry, index) => (
                                        <Cell 
                                            key={index} 
                                            fill={entry.color} 
                                            stroke="rgba(255,255,255,0.2)" 
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-600 text-xs font-bold ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Biểu đồ cột: Kết quả phỏng vấn */}
                    <ChartCard
                        title="Kết Quả Phỏng Vấn"
                        subtitle="Thống kê chi tiết kết quả từ doanh nghiệp"
                        icon={<TrendingUp size={20} />}
                        onDetail={() => showDetail("Kết quả phỏng vấn")}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={interviewResultData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748B', fontSize: 12 }} 
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50} animationDuration={1500}>
                                    {interviewResultData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
}