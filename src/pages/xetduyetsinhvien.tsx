import { useEffect, useState } from "react";
import {
    FaSearch,
    FaTimes,
    FaHashtag,
    FaUserGraduate,
    FaPhone,
    FaEnvelope,
    FaTransgender,
    FaCalendar,
    FaCheck,
    FaTimesCircle,
} from "react-icons/fa";

import type { XetDuyetSinhVien } from "../models/model-all";
import { LaySinhVienXetDuyet, LocSinhVienXetDuyet, XetDuyetTheoYdinh, XetDuyetDau, laysinhvientheoid } from "../functions/student";

export default function ApproveStudentManagement() {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [students, setStudents] = useState<XetDuyetSinhVien[]>([]);
    const [keyword, setKeyword] = useState("");
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<{ [key: string]: string }>({});
    const [isExistingMap, setIsExistingMap] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res: XetDuyetSinhVien[] = [];

            // Lấy dữ liệu cơ bản dựa trên filterStatus
            if (filterStatus !== null) {
                res = (await LocSinhVienXetDuyet(filterStatus)) ?? [];
            } else {
                res = (await LaySinhVienXetDuyet()) ?? [];
            }

            // Áp dụng tìm kiếm nếu có keyword
            if (keyword.trim()) {
                res = res.filter(student =>
                    student.masv.toLowerCase().includes(keyword.toLowerCase()) ||
                    student.hoten?.toLowerCase().includes(keyword.toLowerCase())
                );
            }

            // Phân trang
            const start = (page - 1) * limit;
            const paginated = res.slice(start, start + limit);
            setStudents(paginated);
            setTotalPages(Math.ceil(res.length / limit) || 1);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setStudents([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Fetch isExisting cho tất cả students hiện tại (batch)
    useEffect(() => {
        const fetchExistingStatus = async () => {
            const promises = students.map(async (item) => {
                const exists = await laysinhvientheoid(item.masv);
                return { masv: item.masv, exists: !!exists };
            });
            const results = await Promise.all(promises);
            const map = results.reduce((acc, { masv, exists }) => {
                acc[masv] = exists;
                return acc;
            }, {} as { [key: string]: boolean });
            setIsExistingMap(map);
        };

        if (students.length > 0) {
            fetchExistingStatus();
        }
    }, [students]);

    const handleSearch = async () => {
        setPage(1);
        await fetchData();
    };

    const handleFilter = (status: string | null) => {
        setFilterStatus(status);
        setPage(1);
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, filterStatus]);

    const handleConfirmTransfer = async (student: XetDuyetSinhVien) => {
        try {
            const exists = await laysinhvientheoid(student.masv);
            if (!exists) {
                await XetDuyetDau(
                    student.maxd,
                    student.masv,
                    student.hoten || "",
                    student.email || "",
                    student.ngaysinh || "",
                    student.gioitinh || "",
                    student.sdt || ""
                );
                alert("Đã thêm sinh viên vào danh sách chính thức!");
                fetchData();
            } else {
                alert("Sinh viên đã tồn tại!");
            }
        } catch (err) {
            console.error("Lỗi xác nhận chuyển:", err);
        }
    };

    const handleReject = async (maxd: string) => {
        try {
            const thongbao = notifications[maxd] || "Đơn bị từ chối do thông tin trùng lặp.";
            await XetDuyetTheoYdinh(maxd, thongbao, "1");
            alert("Đã cập nhật trạng thái xét duyệt!");
            fetchData();
            setNotifications(prev => ({ ...prev, [maxd]: "" }));
        } catch (err) {
            console.error("Lỗi từ chối:", err);
        }
    };

    const handleNotificationChange = (maxd: string, value: string) => {
        setNotifications(prev => ({ ...prev, [maxd]: value }));
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-indigo-800 tracking-tight">
                    Quản lý xét duyệt sinh viên
                </h2>
            </div>

            {/* Search & Filter */}
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

                {/* Filter buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleFilter(null)}
                        className={`px-4 py-2 rounded-lg shadow ${filterStatus === null ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500 border border-indigo-500'}`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => handleFilter("0")}
                        className={`px-4 py-2 rounded-lg shadow ${filterStatus === "0" ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500 border border-indigo-500'}`}
                    >
                        Chưa duyệt
                    </button>
                    <button
                        onClick={() => handleFilter("1")}
                        className={`px-4 py-2 rounded-lg shadow ${filterStatus === "1" ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500 border border-indigo-500'}`}
                    >
                        Đã duyệt
                    </button>
                </div>
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
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                Trạng thái
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                Thông báo
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-6 text-gray-500 italic">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : students.length > 0 ? (
                            students.map((item, index) => {
                                const isExisting = isExistingMap[item.masv] ?? false;
                                return (
                                    <tr key={item.maxd} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-700">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 font-medium">{item.masv}</td>
                                        <td className="px-4 py-4 text-gray-800 font-semibold">{item.hoten || "-"}</td>
                                        <td className="px-4 py-4 text-gray-600">{item.email || "-"}</td>
                                        <td className="px-4 py-4 text-gray-600 capitalize">{item.gioitinh || "-"}</td>
                                        <td className="px-4 py-4 text-gray-600">{item.ngaysinh?.split("T")[0] || "-"}</td>
                                        <td className="px-4 py-4 text-gray-600">{item.sdt || "-"}</td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {item.trangthai === "1" ? "Đã duyệt" : "Chưa duyệt"}
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {item.trangthai !== "1" && isExisting ? (
                                                <input
                                                    type="text"
                                                    placeholder="Nhập thông báo..."
                                                    value={notifications[item.maxd] || ""}
                                                    onChange={(e) => handleNotificationChange(item.maxd, e.target.value)}
                                                    className="w-full bg-gray-100 px-2 py-1 rounded focus:outline-indigo-500"
                                                />
                                            ) : (
                                                item.thongbao || "-"
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.trangthai !== "1" && (
                                                <div className="flex gap-2 justify-center items-center">
                                                    {!isExisting ? (
                                                        <button
                                                            onClick={() => handleConfirmTransfer(item)}
                                                            className="inline-flex items-center px-3 py-1 min-h-[32px] bg-green-500 text-white rounded-md hover:bg-green-600 transition gap-1"
                                                        >
                                                            <FaCheck /> Xác nhận
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleReject(item.maxd)}
                                                            className="inline-flex items-center px-3 py-1 min-h-[32px] bg-red-500 text-white rounded-md hover:bg-red-600 transition gap-1"
                                                        >
                                                            <FaTimesCircle /> Từ chối
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center py-6 text-gray-500 italic">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="px-4 py-2">Trang {page} / {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}