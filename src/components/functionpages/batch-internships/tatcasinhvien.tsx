import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSearch, FaTimes, FaFileExport } from "react-icons/fa";
import type { SinhVien } from "../../../models/model-all";
import { laysinhvientheodot, laysinhvientheoid } from "../../../functions/student";

export default function StudentBatchManagement() {
  const { madot } = useParams<{ madot: string }>();
  const [students, setStudents] = useState<SinhVien[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!madot) return;
    setLoading(true);
    laysinhvientheodot(madot)
      .then(async (res) => {
        if (!res || res.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }
        // Lấy chi tiết từng sinh viên
        const detailedStudents: SinhVien[] = [];
        for (const sv of res) {
          try {
            const detail = await laysinhvientheoid(sv.masv);
            if (detail) detailedStudents.push(detail);
          } catch (err) {
            console.error("Lỗi tải chi tiết sinh viên:", err);
          }
        }
        setStudents(detailedStudents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách sinh viên:", err);
        setLoading(false);
      });
  }, [madot]);

  // Tìm kiếm theo keyword
  const handleSearch = () => {
    if (!keyword) return;
    const filtered = students.filter(
      (sv) =>
        sv.masv.includes(keyword) ||
        (sv.hoten && sv.hoten.toLowerCase().includes(keyword.toLowerCase()))
    );
    setStudents(filtered);
  };

  // Xuất CSV hỗ trợ tiếng Việt
  const exportCSV = () => {
    if (students.length === 0) return;

    const headers = ["STT", "Mã SV", "Họ tên", "Email", "Ngày sinh", "Giới tính", "SĐT", "Địa chỉ"];
    const rows = students.map((sv, index) => [
      index + 1,
      sv.masv,
      sv.hoten || "",
      sv.email || "",
      sv.ngaysinh || "",
      sv.gioitinh || "",
      sv.sdt || "",
      sv.diachi || "",
    ]);

    const csvContent =
      "\uFEFF" + // BOM để Excel nhận UTF-8
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `danh_sach_sinh_vien.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-yellow-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-800 tracking-tight">Quản lý sinh viên</h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          <FaFileExport /> Xuất file
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center gap-2 mb-6 w-full max-w-md">
        <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Mã SV hoặc Họ tên"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm"
          />
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition text-sm"
        >
          Tìm
        </button>
      </div>

      {/* Bảng sinh viên */}
      {loading ? (
        <div className="text-center py-6 text-gray-500 italic">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
            <thead className="bg-gradient-to-r from-yellow-100 to-yellow-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Mã SV</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Họ tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Ngày sinh</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Giới tính</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">SĐT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Địa chỉ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((sv, index) => (
                  <tr key={sv.masv} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-3 py-4 text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-3 py-4 text-gray-700">{sv.masv}</td>
                    <td className="px-3 py-4 text-gray-700">{sv.hoten || "-"}</td>
                    <td className="px-3 py-4 text-gray-600">{sv.email || "-"}</td>
                    <td className="px-3 py-4 text-gray-600">{sv.ngaysinh || "-"}</td>
                    <td className="px-3 py-4 text-gray-600">{sv.gioitinh || "-"}</td>
                    <td className="px-3 py-4 text-gray-600">{sv.sdt || "-"}</td>
                    <td className="px-3 py-4 text-gray-600">{sv.diachi || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 italic">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
