import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaTimes,
    FaHashtag,
    FaUserGraduate,
    FaPhone,
    FaEnvelope,
    FaTransgender,
    FaCalendar,
    FaCheck,
} from "react-icons/fa";

import type { SinhVien } from "../models/model-all";
import { LayTatCaSV, Timkiem } from "../functions/student";

export default function StudentManagement() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit,] = useState(5); // số sinh viên mỗi trang
    const [totalPages, setTotalPages] = useState(1);
    const [students, setStudents] = useState<SinhVien[]>([]);
    const [keyword, setKeyword] = useState("");

    // 🔄 Lấy dữ liệu
    const fetchData = async () => {
        try {
            // Nếu có từ khóa → tìm kiếm, không phân trang
            if (keyword.trim()) {
                const res: any = await Timkiem(keyword);
                setStudents(res || []);
                setTotalPages(1);
                return;
            }

            // Gọi API danh sách có phân trang
            const res: any = await LayTatCaSV(page, limit); // res = { dulieu, totalPages }
            if (!res) return;

            setStudents(res.dulieu || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setStudents([]);
            setTotalPages(1);
        }
    };

    const handleSearch = async () => {
        setPage(1);
        await fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-indigo-800 tracking-tight">
                    Quản lý sinh viên
                </h2>

                <div className="flex gap-3">
                    {/* Nút Xét duyệt */}
                    <button
                        onClick={() => navigate("/student/xet-duyet")}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaCheck /> Xét duyệt
                    </button>

                    {/* Nút Thêm sinh viên */}
                    <button
                        onClick={() => navigate("/student/add")}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaPlus /> Thêm sinh viên
                    </button>
                </div>
            </div>


            {/* Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Nhập mã hoặc tên sinh viên"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
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
                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
                >
                    <FaSearch className="inline mr-2" />
                    Tìm kiếm
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                    <thead className="bg-gradient-to-r from-indigo-100 to-indigo-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                STT
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaHashtag className="inline mr-1" /> Mã SV
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaUserGraduate className="inline mr-1" /> Họ tên
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaEnvelope className="inline mr-1" /> Email
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaTransgender className="inline mr-1" /> Giới tính
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaCalendar className="inline mr-1" /> Ngày sinh
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaPhone className="inline mr-1" /> SĐT
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {students.length > 0 ? (
                            students.map((item, index) => (
                                <tr key={item.masv} className="hover:bg-indigo-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-700">
                                        {(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-4 py-4 text-gray-700 font-medium">{item.masv}</td>
                                    <td className="px-4 py-4 text-gray-800 font-semibold">{item.hoten}</td>
                                    <td className="px-4 py-4 text-gray-600">{item.email || "-"}</td>
                                    <td className="px-4 py-4 text-gray-600 capitalize">{item.gioitinh || "-"}</td>
                                    <td className="px-4 py-4 text-gray-600">{item.ngaysinh?.split("T")[0] || "-"}</td>
                                    <td className="px-4 py-4 text-gray-600">{item.sdt || "-"}</td>
                                    <td className="px-4 py-4 flex gap-2 justify-center">
                                        <button
                                            onClick={() =>
                                                navigate(`/student/update/${item.masv}`, { state: { data: item } })
                                            }
                                            className="px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-500 hover:text-white transition"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const confirmed = window.confirm(`Xóa sinh viên ${item.hoten}?`);
                                                if (confirmed) {
                                                    // DeleteStudentFunction(item.masv);
                                                }
                                            }}
                                            className="px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-5 mb-3">
                    <button
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-indigo-100 transition"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 border rounded-lg transition ${page === idx + 1 ? "bg-indigo-600 text-white" : "hover:bg-indigo-100"
                                }`}
                            onClick={() => setPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-indigo-100 transition"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
