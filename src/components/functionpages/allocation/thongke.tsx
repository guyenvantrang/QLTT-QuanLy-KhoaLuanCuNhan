"use client";
import { motion } from "framer-motion";
import { Users, Building2, XCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, } from "recharts";
import { thongke } from "../../../functions/batch-internship"
import { useNavigate, useParams } from "react-router-dom";
/* ==========================
      ⭐ DATA
========================== */


/* ==========================
      ⭐ STAT CARD COMPONENT
========================== */
/* ==========================
      ⭐ STAT CARD COMPONENT
========================== */
const StatCard = ({ title, value, icon, color = "bg-indigo-500", onDetail, }: {
    title: string; value: number | string; icon: React.ReactNode; color?: string; onDetail?: () => void;
}) => {
    return (
        <div className="p-6 rounded-xl shadow-lg flex flex-col justify-between bg-white">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${color}`}>
                    {icon}
                </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
            {onDetail && (
                <button
                    onClick={onDetail}
                    className="
            mt-4
            px-5 py-2
            text-sm font-medium
            rounded-lg
            bg-gradient-to-r from-green-200 via-green-300 to-green-200
            text-green-800
            shadow-sm
            hover:shadow-md
            hover:scale-105
            transition duration-300 ease-in-out
            flex items-center gap-2
            focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1
          "
                >
                    Chi tiết
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 19l14-14M5 5h14v14" />
                    </svg>
                </button>
            )}
        </div>
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
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onDetail?: () => void;
}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
                {onDetail && (
                    <button
                        onClick={onDetail}
                        className="
              px-3 py-1
              text-sm font-medium
              rounded-lg
              bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200
              text-indigo-800
              shadow-sm
              hover:shadow-md
              hover:scale-105
              transition duration-300 ease-in-out
              flex items-center gap-1
            "
                    >
                        Chi tiết
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19l14-14M5 5h14v14" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
};
interface ThongKeResult {
    tongsosinhviendangky: number;
    tongsinhviendacocongty: number;
    tongsinhvienchuacongty: number;
    tongtinnhanchuadoc: number;
    tongphongvandau: number;
    tongLanRot: number;
    chuacoketqua: number;
}

/* ==========================
      ⭐ DASHBOARD COMPONENT
========================== */
export default function Dashboard() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<ThongKeResult>();
    const { madot } = useParams<{ madot: string }>();
    useEffect(() => { thongke(madot || "").then((res) => setCourses(res)).catch((err) => console.error("Lỗi tải dữ liệu:", err)); }, []);
    const DASHBOARD_STATS = {
        totalRegister: courses?.tongsosinhviendangky,
        hasCompany: courses?.tongsinhviendacocongty,
        noCompany: courses?.tongsinhvienchuacongty,
        noInterview: courses?.chuacoketqua,
        pass: courses?.tongphongvandau,
        fail: courses?.tongLanRot,
        allocationRounds: 3,
        unreadMessages: 12,
    };
    const stats = DASHBOARD_STATS;
    const showDetail = (title: string) => alert(`Chi tiết: ${title}`);

    const companyStatusData = [
        { name: "Đã có công ty", value: stats.hasCompany, color: "#10B981" },
        { name: "Chưa có công ty", value: stats.noCompany, color: "#EF4444" },
    ];

    const interviewResultData = [
        { name: "Đậu", value: stats.pass, color: "#10B981" },
        { name: "Rớt", value: stats.fail, color: "#EF4444" },
        { name: "Chưa có KQ", value: stats.noInterview, color: "#F59E0B" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Stats Row */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <StatCard
                        title="Tổng số sinh viên"
                        value={stats.totalRegister || ""}
                        icon={<Users className="w-6 h-6" />}
                        color="bg-indigo-500"
                        onDetail={() => navigate(`/internship-allocation/danh-sach-sinh-vien-dang-ky/${madot}`)}
                    />
                    <StatCard
                        title="Đã có công ty"
                        value={stats.hasCompany || ""}
                        icon={<Building2 className="w-6 h-6" />}
                        color="bg-green-500"
                         onDetail={() => navigate(`/internship-allocation/danh-sach-sinh-vien-da-co-cong-ty/${madot}`)}
                    />
                    <StatCard
                        title="Chưa có công ty"
                        value={stats.noCompany || ""}
                        icon={<XCircle className="w-6 h-6" />}
                        color="bg-red-500"
                        onDetail={() => navigate(`/internship-allocation/danh-sach-sinh-vien-chua-co-cong-ty/${madot}`)}
                    />
                    <StatCard
                        title="Tin nhắn chưa đọc"
                        value={stats.unreadMessages}
                        icon={<MessageSquare className="w-6 h-6" />}
                        color="bg-yellow-500"
                        onDetail={() => showDetail("Tin nhắn chưa phản hồi")}
                    />

                </motion.div>

                {/* Charts Row */}
                <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <ChartCard
                        title="Tình trạng công ty"
                        subtitle="Tỷ lệ sinh viên có/chưa có công ty"
                       onDetail={() => navigate(`/internship-allocation/danh-sach-xac-nhan/${madot}`)}
                    >
                       
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={companyStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                    {companyStatusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard
                        title="Kết quả phỏng vấn"
                        subtitle="Thống kê kết quả phỏng vấn"
                        onDetail={() => showDetail("Kết quả phỏng vấn")}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={interviewResultData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {interviewResultData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>
            </div>
        </div>
    );
}
