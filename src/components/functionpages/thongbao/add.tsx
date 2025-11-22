import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileUpload, FaFileAlt } from "react-icons/fa";
import { CreateThongBao } from "../../../api/thongbao";

export default function ThemThongBao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tieude: "",
    noidung: "",
  });
  const [fileTailieu, setFileTailieu] = useState<File | null>(null);
  const [fileCongvan, setFileCongvan] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle thêm thông báo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await CreateThongBao(formData.tieude, formData.noidung, fileTailieu || undefined, fileCongvan || undefined);
      alert("Thêm thành công!");
      navigate("/thongbao"); // Quay về trang chính
    } catch (err) {
      console.error("Lỗi lưu:", err);
      alert("Lỗi thêm thông báo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full border border-indigo-100">
        <h3 className="text-3xl font-extrabold text-indigo-800 mb-6 text-center">Thêm Thông Báo Mới</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu Đề</label>
            <input
              type="text"
              placeholder="Nhập tiêu đề thông báo"
              value={formData.tieude}
              onChange={(e) => setFormData({ ...formData, tieude: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội Dung</label>
            <textarea
              placeholder="Nhập nội dung thông báo"
              value={formData.noidung}
              onChange={(e) => setFormData({ ...formData, noidung: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-32 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaFileUpload className="text-indigo-600" /> File Công Văn
              </label>
              <input
                type="file"
                onChange={(e) => setFileCongvan(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition"
              />
              {fileCongvan && <p className="mt-2 text-sm text-gray-600">File đã chọn: {fileCongvan.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaFileAlt className="text-indigo-600" /> File Tài Liệu
              </label>
              <input
                type="file"
                onChange={(e) => setFileTailieu(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition"
              />
              {fileTailieu && <p className="mt-2 text-sm text-gray-600">File đã chọn: {fileTailieu.name}</p>}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-800 disabled:opacity-50 transition flex items-center gap-2"
            >
              {loading ? "Đang Lưu..." : "Lưu Thông Báo"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/thongbao")}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
