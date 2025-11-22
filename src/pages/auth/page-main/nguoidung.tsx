import React, { useEffect, useState } from "react";
import { 
    FaPlus, FaCogs, FaSpinner, FaEdit, FaTrash, 
    FaHashtag, FaTag, FaUser, 
    FaTimes, FaEye,
    FaUserTie 
} from "react-icons/fa";
import type { NguoiDung } from "../../../models/model-all";
import { 
    getAllNguoiDung, 
    deleteNguoiDung 
} from "../../../api/login"; 
import NguoiDungFormModal from "../function/form-nguoidung";
import NguoiDungDetailModal from "../function/form-chitiet-nguoidung";

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


export default function QuanLyNguoiDung() {
    const [nguoiDungList, setNguoiDungList] = useState<NguoiDung[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedNguoiDung, setSelectedNguoiDung] = useState<NguoiDung | null>(null);

    // ✅ Fetch Data
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: NguoiDung[] = await getAllNguoiDung();
            setNguoiDungList(data || []); 
        } catch (err: any) {
            setError("Không thể tải dữ liệu người dùng: " + (err.message || 'Lỗi không xác định'));
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
        setSelectedNguoiDung(null);
        setModalOpen(true);
    };

    const handleEdit = (nguoidung: NguoiDung) => {
        setIsEditing(true);
        setSelectedNguoiDung(nguoidung);
        setModalOpen(true);
    };
    
    const handleDetail = (nguoidung: NguoiDung) => {
        setSelectedNguoiDung(nguoidung);
        setDetailModalOpen(true);
    };

    const handleDelete = async (manguoidung: string, tennguoidung: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng [${manguoidung}] - ${tennguoidung} không?`)) {
            setLoading(true);
            try {
                // Sử dụng hàm deleteNguoiDung đã ghi nhớ
                await deleteNguoiDung(manguoidung);
                alert(`Xóa người dùng ${tennguoidung} thành công.`);
                fetchData(); // Tải lại dữ liệu sau khi xóa
            } catch (err: any) {
                alert(err.message || "Xảy ra lỗi khi xóa người dùng.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSuccess = () => {
        // Đóng modal và tải lại dữ liệu khi thêm/sửa thành công
        setModalOpen(false);
        fetchData(); 
    };


    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen font-sans">

            {/* Header và Action */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
                    <FaUser className="w-8 h-8 text-indigo-500" /> Quản Lý Người Dùng
                </h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] font-semibold"
                    disabled={loading}
                >
                    <FaPlus /> Thêm Người Dùng
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">

                        {/* Table Header */}
                        <thead className="bg-gradient-to-r from-indigo-50 to-blue-100/80">
                            <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-600 font-bold">
                                <th className="px-6 py-4 w-[8%] min-w-[80px]">
                                    <div className="flex items-center gap-2"><FaHashtag className="text-indigo-400" /> Mã ND</div>
                                </th>
                                <th className="px-6 py-4 w-[15%] min-w-[150px]">
                                    <div className="flex items-center gap-2"><FaTag className="text-indigo-400" /> Tên đăng nhập</div>
                                </th>
                                <th className="px-6 py-4 w-[20%] min-w-[180px]">
                                    <div className="flex items-center gap-2"><FaUser className="text-indigo-400" /> Họ tên</div>
                                </th>
                            
                                <th className="px-6 py-4 w-[15%] min-w-[100px]">
                                    <div className="flex items-center gap-2"><FaUserTie className="text-indigo-400" /> Chức vụ</div>
                                </th>
                               
                                <th className="px-6 py-4 text-center w-[10%] min-w-[140px]">
                                    <div className="flex flex-col items-center"><FaCogs className="text-indigo-400" /> Hành động</div>
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-indigo-500 font-medium">
                                        <FaSpinner className="inline animate-spin mr-2" /> Đang tải dữ liệu người dùng...
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-red-500 font-medium bg-red-50">
                                        Lỗi: {error}
                                    </td>
                                </tr>
                            )}
                            {!loading && nguoiDungList.length === 0 && !error && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-400 italic bg-gray-50/50">
                                        Không có dữ liệu người dùng nào.
                                    </td>
                                </tr>
                            )}
                            {nguoiDungList.length > 0 && nguoiDungList.map((item) => (
                                <tr key={item.manguoidung} className="hover:bg-gray-50 transition-colors group">

                                    <td className="px-6 py-4 font-mono text-gray-700 font-semibold">
                                        {item.manguoidung}
                                    </td>

                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                        {item.taikhoan}
                                    </td>

                                    <td className="px-6 py-4 text-gray-800">
                                        {item.tennguoidung}
                                    </td>
                                    
                                  
                                    
                                    {/* Giả định: model NguoiDung có thuộc tính 'chucvu' là object hoặc có 'tenchucvu' */}
                                    <td className="px-6 py-4 text-gray-600">
                                        {/* Bạn có thể cần điều chỉnh cách hiển thị chức vụ tùy theo cấu trúc model */}
                                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {item.chucvu?.tenchucvu || item.machucvu || 'N/A'}
                                        </span>
                                    </td>

                                  

                                    {/* Hành động */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-nowrap justify-center items-center gap-2">

                                            {/* Nút Xem Chi tiết */}
                                            <button
                                                onClick={() => handleDetail(item)}
                                                className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                                                title="Xem chi tiết người dùng và chức vụ"
                                            >
                                                <FaEye className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Nút Sửa */}
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex items-center justify-center w-8 h-8 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors shadow-sm"
                                                title="Chỉnh sửa người dùng"
                                            >
                                                <FaEdit className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() => handleDelete(item.manguoidung, item.tennguoidung||"")}
                                                className="flex items-center justify-center w-8 h-8 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors shadow-sm"
                                                title="Xóa người dùng"
                                            >
                                                <FaTrash className="w-3.5 h-3.5" />
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
                    Tổng số người dùng: **{nguoiDungList.length}**
                </div>
            </div>

            {/* Modal Thêm/Sửa Người Dùng */}
            <CustomModal
                show={modalOpen}
                title={isEditing ? "Cập nhật Người Dùng" : "Thêm mới Người Dùng"}
                onClose={() => setModalOpen(false)}
                sizeClass="max-w-xl"
            >
                {/* Component Modal Form (sẽ được bạn cung cấp) */}
                <NguoiDungFormModal
                    isEdit={isEditing}
                    initialData={selectedNguoiDung}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </CustomModal>
            
            {/* Modal Chi Tiết Người Dùng */}
            {selectedNguoiDung && (
                <CustomModal
                    show={detailModalOpen}
                    title={`Chi Tiết Người Dùng [${selectedNguoiDung.manguoidung}]`}
                    onClose={() => setDetailModalOpen(false)}
                    sizeClass="max-w-4xl" // Cho phép modal chi tiết rộng hơn nếu cần
                >
                    {/* Component Modal Chi Tiết (sẽ được bạn cung cấp) */}
                    <NguoiDungDetailModal data={selectedNguoiDung} />
                </CustomModal>
            )}
        </div>
    );
}