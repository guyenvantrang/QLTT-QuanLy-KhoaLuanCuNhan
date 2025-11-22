import React, { useEffect, useState } from "react";
import { FaPlus, FaCogs, FaSpinner, FaEdit, FaTrash, FaHashtag, FaTag, FaCalendarAlt, FaUserTie, FaTimes, FaInfoCircle, FaEye } from "react-icons/fa";
import type { ChucVu } from "../../../models/model-all"; // Giả định model
import { getAllChucVu, deleteChucVu } from "../../../api/login"; // Giả định có file functions/chucvu-api
import ChucVuFormModal from "../function/form-chucvu";
import ChucVuDetailModal from "../function/form-chitietchucvu"

// Hàm chuyển đổi ngày tháng (ISO string sang DD/MM/YYYY)
const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
        return '-';
    }
};

// --- Custom Modal Wrapper (Để thay thế thư viện Modal) ---
const CustomModal = ({ show, title, onClose, children, sizeClass = "max-w-xl" }: { show: boolean, title: string, onClose: () => void, children: React.ReactNode, sizeClass?: string }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClass} max-h-[95vh] overflow-hidden`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-indigo-50/70">
                    <h3 className="text-xl font-bold text-indigo-700">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:bg-indigo-100 rounded-full transition-colors">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
// --- HẾT Custom Modal Wrapper ---


export default function QuanLyChucVu() {
    const [chucVuList, setChucVuList] = useState<ChucVu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedChucVu, setSelectedChucVu] = useState<ChucVu | null>(null);

    // ✅ Fetch Data
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: ChucVu[] = await getAllChucVu();
            // Lọc ra các thuộc tính không cần thiết (nguoidung, chitietnhomquyen) nếu cần
            setChucVuList(data || []);
        } catch (err: any) {
            setError("Không thể tải dữ liệu chức vụ: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Handle Actions
    const handleAdd = () => {
        setIsEditing(false);
        setSelectedChucVu(null);
        setModalOpen(true);
    };

    const handleEdit = (chucvu: ChucVu) => {
        setIsEditing(true);
        setSelectedChucVu(chucvu);
        setModalOpen(true);
    };
    const handleDetail = (chucvu: ChucVu) => {
        setSelectedChucVu(chucvu);
        setDetailModalOpen(true);
    };
    const handleDelete = async (machucvu: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa chức vụ ${machucvu} không?`)) {
            setLoading(true);
            try {
                await deleteChucVu(machucvu);
                alert(`Xóa chức vụ ${machucvu} thành công.`);
                fetchData();
            } catch (err: any) {
                alert(err.message || "Xảy ra lỗi khi xóa chức vụ.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSuccess = () => {
        fetchData();
    };


    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen font-sans">

            {/* Header và Action */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
                    <FaUserTie className="w-8 h-8 text-indigo-500" /> Quản Lý Chức Vụ
                </h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] font-semibold"
                    disabled={loading}
                >
                    <FaPlus /> Thêm Chức vụ
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">

                        {/* Table Header */}
                        <thead className="bg-gradient-to-r from-indigo-50 to-blue-100/80">
                            <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-600 font-bold">
                                <th className="px-6 py-4 w-[10%] min-w-[100px]">
                                    <div className="flex items-center gap-2"><FaHashtag className="text-indigo-400" /> Mã CV</div>
                                </th>
                                <th className="px-6 py-4 w-[20%] min-w-[150px]">
                                    <div className="flex items-center gap-2"><FaTag className="text-indigo-400" /> Tên chức vụ</div>
                                </th>
                                <th className="px-6 py-4 w-[40%] min-w-[250px]">
                                    <div className="flex items-center gap-2"><FaInfoCircle className="text-indigo-400" /> Mô tả</div>
                                </th>
                                <th className="px-6 py-4 w-[15%] min-w-[100px]">
                                    <div className="flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Ngày tạo</div>
                                </th>
                                <th className="px-6 py-4 text-center w-[15%] min-w-[150px]">
                                    <div className="flex flex-col items-center"><FaCogs className="text-indigo-400" /> Hành động</div>
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-indigo-500 font-medium">
                                        <FaSpinner className="inline animate-spin mr-2" /> Đang tải dữ liệu chức vụ...
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-red-500 font-medium bg-red-50">
                                        Lỗi: {error}
                                    </td>
                                </tr>
                            )}
                            {!loading && chucVuList.length === 0 && !error && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400 italic bg-gray-50/50">
                                        Không có dữ liệu chức vụ nào.
                                    </td>
                                </tr>
                            )}
                            {chucVuList.length > 0 && chucVuList.map((item) => (
                                <tr key={item.machucvu} className="hover:bg-gray-50 transition-colors group">

                                    <td className="px-6 py-4 font-mono text-gray-700 font-semibold">
                                        {item.machucvu}
                                    </td>

                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                        {item.tenchucvu}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600 truncate max-w-lg" title={item.mota}>
                                        {item.mota || <span className="italic text-gray-400">Chưa có mô tả</span>}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {formatDate(item.ngaytao)}
                                    </td>

                                    {/* Hành động */}
                                    {/* Hành động */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-nowrap justify-center items-center gap-2">

                                            {/* Nút Xem Chi tiết (Mới) */}
                                            <button
                                                onClick={() => handleDetail(item)}
                                                className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg shadow-sm hover:bg-blue-100 transition-all border border-blue-200 whitespace-nowrap"
                                                title="Xem chi tiết người dùng và quyền hạn"
                                            >
                                                <FaEye className="w-3 h-3" /> Chi tiết
                                            </button>

                                            {/* Nút Sửa */}
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-amber-50 text-amber-600 rounded-lg shadow-sm hover:bg-amber-100 transition-all border border-amber-200 whitespace-nowrap"
                                                title="Chỉnh sửa chức vụ"
                                            >
                                                <FaEdit className="w-3 h-3" /> Sửa
                                            </button>

                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() => handleDelete(item.machucvu)}
                                                className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-rose-50 text-rose-600 rounded-lg shadow-sm hover:bg-rose-100 transition-all border border-rose-200 whitespace-nowrap"
                                                title="Xóa chức vụ"
                                            >
                                                <FaTrash className="w-3 h-3" /> Xóa
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                {/* Footer thông tin */}
                <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                    Tổng số chức vụ: {chucVuList.length}
                </div>
            </div>

            {/* Modal */}
            <CustomModal
                show={modalOpen}
                title={isEditing ? "Cập nhật Chức vụ" : "Thêm mới Chức vụ"}
                onClose={() => setModalOpen(false)}
                sizeClass="max-w-lg"
            >
                <ChucVuFormModal
                    isEdit={isEditing}
                    initialData={selectedChucVu}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </CustomModal>
            {selectedChucVu && (
                <CustomModal
                    show={detailModalOpen} // Dùng biến Detail Modal
                    title={`Chi Tiết Phân Quyền cho [${selectedChucVu.machucvu}]`}
                    onClose={() => setDetailModalOpen(false)}
                    sizeClass="max-w-7xl" // Chi tiết cần rộng hơn
                >
                    <ChucVuDetailModal data={selectedChucVu} />
                </CustomModal>
            )}
        </div>
    );
}