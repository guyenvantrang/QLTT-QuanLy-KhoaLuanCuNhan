import React, { useEffect, useState } from "react";
import { 
    FaPlus, FaSpinner, FaEdit, FaTrash, FaEye, 
    FaUserShield, FaLayerGroup 
} from "react-icons/fa";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import type { NhomQuyen } from "../../../models/model-all"; 
import { getAllNhomQuyen, deleteNhomQuyen } from "../../../api/login"; // Giả định đường dẫn

// Import Modal
import NhomQuyenFormModal from "../function/form-nhomquyen";
import NhomQuyenDetailModal from "../function/form-chitietnhomquyen";

// --- Custom Modal Wrapper (Tái sử dụng) ---
const CustomModal = ({ show, title, onClose, children, sizeClass = "max-w-xl" }: { show: boolean, title: string, onClose: () => void, children: React.ReactNode, sizeClass?: string }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
                    <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        {title}
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function QuanLyNhomQuyen() {
    const [listNhomQuyen, setListNhomQuyen] = useState<NhomQuyen[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<NhomQuyen | null>(null);

    // ✅ Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllNhomQuyen();
            setListNhomQuyen(res || []);
        } catch (err: any) {
            toast.error("Lỗi tải dữ liệu: " + (err.message || "Không xác định"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Handlers
    const handleAdd = () => {
        setIsEditing(false);
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleEdit = (item: NhomQuyen) => {
        setIsEditing(true);
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleDetail = (item: NhomQuyen) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    // Xóa với SweetAlert2 Custom Gradient
    const handleDelete = async (manhomquyen: string, tennhom: string) => {
        const result = await Swal.fire({
            title: '<span class="text-xl font-bold text-gray-700">Xác nhận xóa?</span>',
            html: `Bạn có muốn xóa nhóm quyền: <br/><strong class="text-blue-600 text-lg">"${tennhom}"</strong>?<br/><span class="text-xs text-gray-400">Việc này sẽ xóa các phân quyền liên quan!</span>`,
            icon: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            focusCancel: true,
            buttonsStyling: false,
            customClass: {
                popup: 'rounded-xl shadow-2xl border border-gray-100 font-sans',
                confirmButton: 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md ml-3 transition-transform hover:scale-105',
                cancelButton: 'bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium py-2.5 px-6 rounded-lg transition-colors',
            }
        });

        if (result.isConfirmed) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await deleteNhomQuyen(manhomquyen);
                toast.success('Đã xóa thành công!', { id: toastId });
                fetchData();
            } catch (err: any) {
                toast.error('Không thể xóa: ' + err.message, { id: toastId });
            }
        }
    };

    const handleSuccess = () => {
        setModalOpen(false);
        fetchData();
    };

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 min-h-screen font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3">
                        <FaUserShield className="w-9 h-9 text-blue-600 drop-shadow-sm" /> 
                        Quản Lý Nhóm Quyền
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 ml-12">Phân nhóm và quản lý quyền hạn truy cập hệ thống</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 font-semibold"
                >
                    <FaPlus className="text-sm"/> Thêm Nhóm Quyền
                </button>
            </div>

            {/* Table Container */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4 w-[15%]">Mã Nhóm</th>
                                <th className="px-6 py-4 w-[25%]">Tên Nhóm Quyền</th>
                                <th className="px-6 py-4 w-[30%]">Mô tả</th>
                                <th className="px-6 py-4 w-[15%]">Ngày tạo</th>
                                <th className="px-6 py-4 text-center w-[15%]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-12 text-blue-500"><FaSpinner className="inline animate-spin mr-2"/> Đang tải dữ liệu...</td></tr>
                            ) : listNhomQuyen.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-gray-400 italic">Chưa có nhóm quyền nào.</td></tr>
                            ) : listNhomQuyen.map((item) => (
                                <tr key={item.manhomquyen} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                                        <FaLayerGroup className="inline mr-2 opacity-50"/>
                                        {item.manhomquyen}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{item.tennhom}</td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs text-xs">{item.mota || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {item.ngaytao ? new Date(item.ngaytao).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDetail(item)} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Chi tiết phân quyền"><FaEye/></button>
                                            <button onClick={() => handleEdit(item)} className="p-2 text-amber-500 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors" title="Sửa thông tin"><FaEdit/></button>
                                            <button onClick={() => handleDelete(item.manhomquyen, item.tennhom || '')} className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Xóa nhóm"><FaTrash/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
                    Tổng số: <strong>{listNhomQuyen.length}</strong> nhóm quyền
                </div>
            </div>

            {/* Modals */}
            <CustomModal show={modalOpen} title={isEditing ? "Cập nhật Nhóm Quyền" : "Thêm Nhóm Quyền Mới"} onClose={() => setModalOpen(false)}>
                <NhomQuyenFormModal isEdit={isEditing} initialData={selectedItem} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} />
            </CustomModal>

            {selectedItem && (
                <CustomModal show={detailModalOpen} title={`Chi Tiết: ${selectedItem.tennhom}`} onClose={() => setDetailModalOpen(false)} sizeClass="max-w-3xl">
                    <NhomQuyenDetailModal data={selectedItem} />
                </CustomModal>
            )}
        </div>
    );
}