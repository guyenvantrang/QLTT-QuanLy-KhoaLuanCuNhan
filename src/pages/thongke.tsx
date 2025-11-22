import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUsers, FaBuilding, FaCalendarAlt, FaChartBar, FaMapMarkedAlt, FaStar, FaUsersCog, FaBriefcase } from "react-icons/fa";

// Dữ liệu mẫu: Có thể thay thế bằng fetch từ backend
const mockData = {
  totalDots: 5, // Tổng đợt thực tập
  totalSinhViens: 150, // Tổng sinh viên đăng ký
  totalCongTys: 20, // Tổng công ty
  totalGiangViens: 15, // Tổng giảng viên (bổ sung)
  dangKyByDot: [ // Phân bố đăng ký theo đợt
    { name: "Đợt 1", value: 30 },
    { name: "Đợt 2", value: 50 },
    { name: "Đợt 3", value: 40 },
    { name: "Đợt 4", value: 20 },
    { name: "Đợt 5", value: 10 },
  ],
  trangThaiDangKy: [ // Trạng thái đăng ký (Pie chart)
    { name: "Đang thực tập", value: 80 },
    { name: "Hoàn thành", value: 50 },
    { name: "Chưa bắt đầu", value: 20 },
  ],
  topCongTys: [ // Thay thế tiến độ báo cáo bằng Top công ty (Bar chart)
    { name: "Công ty A", sinhvien: 25 },
    { name: "Công ty B", sinhvien: 20 },
    { name: "Công ty C", sinhvien: 15 },
    { name: "Công ty D", sinhvien: 10 },
    { name: "Công ty E", sinhvien: 8 },
  ],
  diemChamTrungBinh: [ // Bổ sung: Phân bố điểm chấm (Pie chart)
    { name: "Xuất sắc (>9)", value: 30 },
    { name: "Tốt (7-9)", value: 70 },
    { name: "Trung bình (5-7)", value: 40 },
    { name: "Yếu (<5)", value: 10 },
  ],
  diemSoSanh: [ // Bổ sung: So sánh điểm trung bình công ty vs giảng viên (Bar chart grouped)
    { category: "Chuyên cần/Trình bày", congTy: 8.2, giangVien: 7.5 },
    { category: "Chuyên môn/Báo cáo", congTy: 8.8, giangVien: 8.0 },
    { category: "Tổng trung bình", congTy: 8.5, giangVien: 7.8 },
  ],
  diaDiemData: [ // Dữ liệu bản đồ
    { ten: "Công ty A - Hà Nội", lat: 21.0285, long: 105.8542, soluong: 15 },
    { ten: "Công ty B - TP.HCM", lat: 10.8231, long: 106.6297, soluong: 20 },
    { ten: "Công ty C - Đà Nẵng", lat: 16.0471, long: 108.2062, soluong: 10 },
    // Thêm dữ liệu động từ API
  ],
};

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#a855f7"]; // Màu tươi sáng: green, blue, yellow, red, purple

export default function InternshipDashboard() {
  const [data, ] = useState(mockData);

  useEffect(() => {
    // Fetch dữ liệu thực từ API (thay thế mockData)
    // Ví dụ: fetch('/api/thongke').then(res => res.json()).then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaChartBar className="text-yellow-300" /> Thống Kê Tổng Quan Tình Hình Thực Tập
        </h1>
        <p className="text-indigo-100 mt-2">Bảng điều khiển cung cấp cái nhìn tổng quan về các đợt thực tập, sinh viên, công ty và phân bố địa lý với dữ liệu động.</p>
      </header>

      {/* Overview Cards - Gradient tươi sáng, icon chuyên nghiệp */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-xl rounded-xl p-6 flex items-center gap-4 transform hover:scale-105 transition">
          <FaCalendarAlt className="text-4xl text-yellow-300" />
          <div>
            <h2 className="text-xl font-semibold">Tổng Đợt Thực Tập</h2>
            <p className="text-3xl font-bold"><span className="text-yellow-300">{data.totalDots}</span></p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-teal-600 text-white shadow-xl rounded-xl p-6 flex items-center gap-4 transform hover:scale-105 transition">
          <FaUsers className="text-4xl text-yellow-300" />
          <div>
            <h2 className="text-xl font-semibold">Tổng Sinh Viên Đăng Ký</h2>
            <p className="text-3xl font-bold"><span className="text-yellow-300">{data.totalSinhViens}</span></p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-xl rounded-xl p-6 flex items-center gap-4 transform hover:scale-105 transition">
          <FaBuilding className="text-4xl text-yellow-300" />
          <div>
            <h2 className="text-xl font-semibold">Tổng Công Ty Thực Tập</h2>
            <p className="text-3xl font-bold"><span className="text-yellow-300">{data.totalCongTys}</span></p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-xl rounded-xl p-6 flex items-center gap-4 transform hover:scale-105 transition">
          <FaUsersCog className="text-4xl text-yellow-300" />
          <div>
            <h2 className="text-xl font-semibold">Tổng Giảng Viên Hướng Dẫn</h2>
            <p className="text-3xl font-bold"><span className="text-yellow-300">{data.totalGiangViens}</span></p>
          </div>
        </div>
      </section>

      {/* Charts Section - Gradient background, icon, màu tươi sáng */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart: Phân bố đăng ký theo đợt */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-500" /> Phân Bố Đăng Ký Theo Đợt
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.dangKyByDot}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" /> {/* Blue tươi */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Trạng thái đăng ký */}
        <div className="bg-gradient-to-br from-green-50 to-teal-100 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold text-teal-800 mb-4 flex items-center gap-2">
            <FaBriefcase className="text-green-500" /> Trạng Thái Đăng Ký Thực Tập
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.trangThaiDangKy} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#22c55e" label> {/* Green tươi */}
                {data.trangThaiDangKy.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Thay thế Line Chart bằng Bar Chart: Top Công Ty */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
            <FaBuilding className="text-yellow-500" /> Top Công Ty Có Nhiều Sinh Viên Nhất
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topCongTys}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sinhvien" fill="#eab308" /> {/* Yellow tươi */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bổ sung: Pie Chart Phân bố Điểm Chấm */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold text-pink-800 mb-4 flex items-center gap-2">
            <FaStar className="text-purple-500" /> Phân Bố Điểm Chấm Trung Bình
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.diemChamTrungBinh} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#a855f7" label> {/* Purple tươi */}
                {data.diemChamTrungBinh.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bổ sung mới: Bar Chart so sánh điểm trung bình Công ty vs Giảng viên */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-100 shadow-xl rounded-xl p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-cyan-800 mb-4 flex items-center gap-2">
            <FaStar className="text-cyan-500" /> So Sánh Điểm Trung Bình (Công Ty vs Giảng Viên)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.diemSoSanh}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="congTy" fill="#3b82f6" name="Điểm Công Ty" /> {/* Blue cho Công ty */}
              <Bar dataKey="giangVien" fill="#a855f7" name="Điểm Giảng Viên" /> {/* Purple cho Giảng viên */}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 mt-2">Biểu đồ so sánh điểm trung bình từ công ty (diemchuyencan, diemchuyenmon) và giảng viên (diemtrinhbay, diembaocao) để nhận biết sự khác biệt.</p>
        </div>
      </section>

      {/* Map Section - Gradient background */}
      <section className="bg-gradient-to-br from-red-50 to-orange-100 shadow-xl rounded-xl p-6">
        <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
          <FaMapMarkedAlt className="text-red-500" /> Phân Bố Địa Lý Theo Tỉnh/Thành Phố
        </h2>
        <div className="h-[500px] rounded-lg overflow-hidden shadow-inner">
          <MapContainer center={[16.0471, 108.2062]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {data.diaDiemData.map((item, index) => (
              <Marker key={index} position={[item.lat, item.long]}>
                <Popup>
                  <strong className="text-indigo-800">{item.ten}</strong><br />
                  Số lượng sinh viên: <span className="font-bold text-green-600">{item.soluong}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <p className="text-gray-700 mt-2">Bản đồ hiển thị vị trí công ty thực tập và số lượng sinh viên phân bổ (dữ liệu động từ lat/long trong model).</p>
      </section>
    </div>
  );
}