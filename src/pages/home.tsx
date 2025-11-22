import { useNavigate } from "react-router-dom";
import { FaBook, FaBuilding, FaChalkboardTeacher, FaChartBar, FaUserGraduate, FaBell, FaHandshake, FaCogs } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Quản lý đợt thực tập",
      description: "Quản lý các đợt thực tập",
      icon: <FaBook className="text-blue-600" />,
      stats: [
        { label: "Đang diễn ra", value: 5, color: "#2563EB" },  // đậm hơn
        { label: "Đã kết thúc", value: 7, color: "#1D4ED8" },
      ],
      gradient: "from-blue-100 via-blue-200 to-blue-100", // nền nhạt
      action: () => navigate("/batch-internship"),
    },
    {
      title: "Quản lý công ty thực tập",
      description: "Theo dõi các công ty giới thiệu",
      icon: <FaBuilding className="text-green-600" />,
      stats: [
        { label: "Hoạt động", value: 25, color: "#059669" },
        { label: "Ngưng hoạt động", value: 5, color: "#047857" },
      ],
      gradient: "from-green-100 via-green-200 to-green-100",
      action: () => navigate("/company"),
    },
    {
      title: "Quản lý giảng viên hướng dẫn",
      description: "Theo dõi giảng viên hướng dẫn",
      icon: <FaChalkboardTeacher className="text-yellow-600" />,
      stats: [
        { label: "Hoạt động", value: 45, color: "#D97706" },
        { label: "Ngưng hoạt động", value: 5, color: "#B45309" },
      ],
      gradient: "from-yellow-100 via-yellow-200 to-yellow-100",
      action: () => navigate("/teacher"),
    },
    {
      title: "Quản lý sinh viên",
      description: "Theo dõi và quản lý sinh viên",
      icon: <FaUserGraduate className="text-purple-600" />,
      stats: [
        { label: "Đang theo học", value: 1200, color: "#7C3AED" },
        { label: "Tạm ngưng", value: 30, color: "#6D28D9" },
      ],
      gradient: "from-purple-100 via-purple-200 to-purple-100",
      action: () => navigate("/student"),
    },
    {
      title: "Quản lý thông báo",
      description: "Theo dõi và quản lý tất cả thông báo",
      icon: <FaBell className="text-blue-600" />,
      stats: [
        { label: "Thông báo mới", value: 12, color: "#3B82F6" },  // blue-500
        { label: "Tổng số thông báo", value: 230, color: "#2563EB" }, // blue-600
      ],
      gradient: "from-blue-100 via-blue-200 to-blue-100",
      action: () => navigate("/thongbao"),
    }
    ,
    {
      title: "Thống kê các đợt thực tập",
      description: "Báo cáo tổng quan về thực tập",
      icon: <FaChartBar className="text-pink-600" />,
      stats: [
        { label: "Đang thực tập", value: 80, color: "#DB2777" },
        { label: "Đã hoàn thành", value: 120, color: "#BE185D" },
      ],
      gradient: "from-pink-100 via-pink-200 to-pink-100",
      action: () => navigate("/thongke"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col mb-8 max-w-7xl mx-auto">

          {/* Tiêu đề chính */}
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">Trang quản lý thực tập</h2>

          {/* Thanh điều hướng (Tabs) */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-2">
            {/* Left Side Navigation (Quản lý thực tập - Active/Current) */}
            {/* Giả sử đây là tab đang active */}
            <button className="flex items-center gap-2 text-xl font-bold px-4 py-2 text-indigo-700 border-b-4 border-indigo-700 transition-colors">
              <FaHandshake className="w-6 h-6" /> Quản lý thực tập
            </button>

            {/* Right Side Navigation (Quản lý hệ thống - Inactive) */}
            {/* Thêm hàm onClick để điều hướng sang trang quản lý hệ thống */}
            <button
              className="flex items-center gap-2 text-xl font-medium px-4 py-2 text-gray-500 hover:text-indigo-600 transition-colors"
              onClick={() => { navigate('/phanquyen')/* Thêm logic navigate() tới /system-management hoặc /chuc-vu */ }}
            >
              <FaCogs className="w-6 h-6" /> Quản lý hệ thống
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-xl shadow-md p-6 cursor-pointer transform hover:scale-105 transition bg-gradient-to-br ${feature.gradient} text-gray-900`}
              onClick={feature.action}
            >
              {/* Header: Icon + PieChart */}
              <div className="flex justify-between items-start mb-4">
                <div className="text-5xl">{feature.icon}</div>
                <div style={{ width: 60, height: 60 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feature.stats}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={15}
                        outerRadius={25}
                        paddingAngle={2}
                      >
                        {feature.stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700 mb-4">{feature.description}</p>

              {/* Stats with color circle */}
              <div className="flex flex-col gap-2">
                {feature.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {/* Circle color */}
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      {stat.label}
                    </span>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
          >
            Đăng xuất
          </button>
        </div>
      </main>
    </div>
  );
}
