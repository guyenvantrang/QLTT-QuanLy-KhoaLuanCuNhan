import React, { useEffect, useState } from "react";
import {
    FaPlus, FaSpinner, FaEdit, FaTrash,
    FaGlobe, FaTimes, FaEye
} from "react-icons/fa";
import type { TrangWeb } from "../../../models/model-all"; // Giả định model
import { getAllTrangWeb, deleteTrangWeb } from "../../../api/login"; // Import API bạn vừa cung cấp
import Swal from 'sweetalert2'; // Import SweetAlert2
import toast from 'react-hot-toast'; // Import Toast

// Import các Modal con
import TrangWebFormModal from "../function/form-trangweb";
import TrangWebDetailModal from "../function/form-chitiettrangweb";


// --- Custom Modal Wrapper (Tái sử dụng) ---
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

export default function QuanLyTrangWeb() {
    const [trangWebList, setTrangWebList] = useState<TrangWeb[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTrangWeb, setSelectedTrangWeb] = useState<TrangWeb | null>(null);

    // ✅ Fetch Data
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: TrangWeb[] = await getAllTrangWeb();
            setTrangWebList(data || []);
        } catch (err: any) {
            setError("Không thể tải dữ liệu trang web: " + (err.message || "Lỗi không xác định"));
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
        setSelectedTrangWeb(null);
        setModalOpen(true);
    };

    const handleEdit = (item: TrangWeb) => {
        setIsEditing(true);
        setSelectedTrangWeb(item);
        setModalOpen(true);
    };

    const handleDetail = (item: TrangWeb) => {
        setSelectedTrangWeb(item);
        setDetailModalOpen(true);
    };

    // 1. Import

    const handleDelete = async (matrang: string, tentrang: string) => {
        const result = await Swal.fire({
            // Không dùng title mặc định, tự build trong HTML
            title: '',
            html: `
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-red-500"></div>
            
            <div class="pt-4">
                <h2 class="text-2xl font-extrabold text-gray-800 mb-2">Xóa Dữ Liệu?</h2>
                <p class="text-gray-500 text-sm mb-6 px-4">
                    Bạn chắc chắn muốn xóa trang web <strong class="text-indigo-600">"${tentrang}"</strong>?
                    <br/>Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
            </div>
        `,

            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<span class="flex items-center gap-2">Xóa vĩnh viễn</span>',
            cancelButtonText: 'Hủy bỏ',
            reverseButtons: true, // Đảo nút
            buttonsStyling: false,

            customClass: {
                // Popup vuông vắn hơn chút (rounded-lg)
                popup: 'rounded-lg shadow-[0_2px_5px_rgba(8,_112,_184,_0.7)] border-0 font-sans overflow-hidden',

                // Chỉnh icon to hơn chút
                icon: '!mt-6 !border-orange-200 !text-orange-500',

                // Nút Xóa: Màu Gradient mạnh mẽ
                confirmButton: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2.5 px-6 rounded shadow-md transition-all ml-2',

                // Nút Hủy
                cancelButton: 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-2.5 px-6 rounded transition-all',

                actions: 'pb-6'
            },
            // Backdrop tối hơn chút
            backdrop: `rgba(248, 248, 248, 0.6) backdrop-blur-[3px]`
        });

        // 2. Nếu người dùng nhấn nút Xóa
        if (result.isConfirmed) {
            const toastId = toast.loading('Đang tiến hành xóa...');
            setLoading(true);

            try {
                await deleteTrangWeb(matrang);

                // Thông báo thành công
                toast.success(`Đã xóa trang web: ${tentrang}`, { id: toastId });
                fetchData();
            } catch (err: any) {
                // Thông báo lỗi
                toast.error(err.message || "Lỗi khi xóa trang web.", { id: toastId });
            } finally {
                setLoading(false);
            }
        }
    };
    const handleSuccess = () => {
        setModalOpen(false);
        fetchData();
    };

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen font-sans">

            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
                    <FaGlobe className="w-8 h-8 text-indigo-500" /> Quản Lý Trang Web
                </h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] font-semibold"
                    disabled={loading}
                >
                    <FaPlus /> Thêm Trang Web
                </button>
            </div>

            {/* Table */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gradient-to-r from-indigo-50 to-blue-100/80">
                            <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-600 font-bold">
                                <th className="px-6 py-4 w-[10%]">Mã trang</th>
                                <th className="px-6 py-4 w-[25%]">Tên trang</th>
                                <th className="px-6 py-4 w-[25%]">Đường dẫn (URL)</th>
                                <th className="px-6 py-4 w-[25%]">Mô tả</th>
                                <th className="px-6 py-4 text-center w-[15%]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                            {loading && (
                                <tr><td colSpan={5} className="text-center py-8 text-indigo-500"><FaSpinner className="inline animate-spin mr-2" /> Đang tải...</td></tr>
                            )}
                            {!loading && trangWebList.length === 0 && !error && (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-400 italic">Chưa có dữ liệu trang web.</td></tr>
                            )}
                            {trangWebList.map((item) => (
                                <tr key={item.matrang} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-semibold text-gray-700">{item.matrang}</td>
                                    <td className="px-6 py-4 font-medium text-indigo-700">{item.tentrang}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs bg-gray-50 rounded px-2 py-1 w-fit inline-block mt-2 md:mt-0">
                                        {item.diachitruycap}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{item.mota || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleDetail(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Chi tiết"><FaEye /></button>
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100" title="Sửa"><FaEdit /></button>
                                            <button onClick={() => handleDelete(item.matrang, item.tentrang || "")} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100" title="Xóa"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                    Tổng số trang web: {trangWebList.length}
                </div>
            </div>

            {/* Modal Form */}
            <CustomModal show={modalOpen} title={isEditing ? "Cập nhật Trang Web" : "Thêm mới Trang Web"} onClose={() => setModalOpen(false)}>
                <TrangWebFormModal isEdit={isEditing} initialData={selectedTrangWeb} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} />
            </CustomModal>

            {/* Modal Detail */}
            {selectedTrangWeb && (
                <CustomModal show={detailModalOpen} title={`Chi tiết Trang: ${selectedTrangWeb.tentrang}`} onClose={() => setDetailModalOpen(false)}>
                    <TrangWebDetailModal data={selectedTrangWeb} />
                </CustomModal>
            )}
        </div>
    );
}