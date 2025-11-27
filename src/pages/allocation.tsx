import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaEdit,
    FaHashtag,
    FaCalendarAlt,
    FaInfoCircle,
    FaCogs,
    FaTrash,
    FaSpinner,
    FaHandshake,
} from "react-icons/fa";
import type { PhanBoSinhVien } from "../models/model-all";
import {
    GetAllFunction,
    deletePhanBoFunction,
} from "../functions/internship-allocation";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import DetailDotPhanBoCard from "../components/functionpages/allocation/create";
import UpdateDotPhanBoCard from "../components/functionpages/allocation/update";
import { Can } from "../routes/Can";

export default function AllocationManagement() {
    const navigate = useNavigate();
    const { madot } = useParams<{ madot: string }>();
    const [allocations, setAllocations] = useState<PhanBoSinhVien[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedAllocation, setSelectedAllocation] = useState<PhanBoSinhVien | null>(null);

    // Fetch data
    const fetchData = async () => {
        if (!madot) return;
        setLoading(true);
        try {
            const res = await GetAllFunction(madot);
            setAllocations(res || []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [madot]);

    // Handle delete
    const handleDelete = async (madotphanbo: string) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa phân bố ${madotphanbo}?`
        );
        if (!confirmed) return;
        try {
            await deletePhanBoFunction(madotphanbo);
            alert("Xóa phân bố thành công!");
            fetchData(); // reload data
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Xảy ra lỗi khi xóa phân bố");
        }
    };

    if (!madot) return <p className="p-6 text-red-500">Không tìm thấy mã đợt!</p>;

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                    Quản lý đợt phân bố
                </h2>
                {/* Nút Thêm mới phân bố */}
                <Can
                    trangtruycap="/internship-allocation/create-allocation/:madot"
                    matruycap="hienthi_dotthuctap_dotphanbocongty_them"
                >
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaEdit /> Thêm mới phân bố
                    </button>
                </Can>


                {/* Modal Tạo mới */}
                <Modal
                    show={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    size="5xl"
                    dismissible={false}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                >
                    <ModalHeader>Thêm mới phân bố</ModalHeader>
                    <ModalBody className="bg-gray-50 p-1 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DetailDotPhanBoCard
                            onClose={() => setCreateModalOpen(false)}
                            data={madot}
                        />
                    </ModalBody>
                </Modal>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">

                    {/* Table Header */}
                    <thead className="bg-gradient-to-r from-indigo-50 to-blue-100/80">
                        <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-600 font-bold">

                            <th className="px-6 py-4 w-[15%]">
                                <div className="flex items-center gap-2 text-indigo-700">
                                    <FaHashtag className="text-indigo-400 w-4 h-4" /> Mã phân bố
                                </div>
                            </th>
                            <th className="px-6 py-4 w-[15%]">
                                <div className="flex items-center gap-2 text-indigo-700">
                                    <FaCalendarAlt className="text-indigo-400 w-4 h-4" /> Mã đợt
                                </div>
                            </th>
                            <th className="px-6 py-4 w-[15%]">
                                <div className="flex items-center gap-2 text-indigo-700">
                                    <FaCalendarAlt className="text-indigo-400 w-4 h-4" /> Ngày tạo
                                </div>
                            </th>
                            <th className="px-6 py-4 w-[30%]">
                                <div className="flex items-center gap-2 text-indigo-700">
                                    <FaInfoCircle className="text-indigo-400 w-4 h-4" /> Mô tả
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center w-[25%] min-w-[280px]">
                                <div className="flex flex-col items-center text-indigo-700">
                                    <FaCogs className="text-indigo-400 w-4 h-4" /> Hành động
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-indigo-500 font-medium">
                                    <FaSpinner className="inline animate-spin mr-2" /> Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : allocations.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400 italic bg-gray-50/50">
                                    Không tìm thấy đợt phân bổ nào cho Mã đợt **{madot}**.
                                </td>
                            </tr>
                        ) : (
                            allocations.map((item) => (
                                <tr key={item.madotphanbo} className="hover:bg-gray-50 transition-colors group">

                                    {/* Mã phân bố */}
                                    <td className="px-6 py-4 font-mono text-gray-700 font-semibold">
                                        {item.madotphanbo}
                                    </td>

                                    {/* Mã đợt (Cột mới thêm vào) */}
                                    <td className="px-6 py-4 text-gray-600 font-mono">
                                        {item.madot}
                                    </td>

                                    {/* Ngày tạo */}
                                    <td className="px-6 py-4 text-gray-600">
                                        {item.ngaytao ? new Date(item.ngaytao).toLocaleDateString("vi-VN") : "-"}
                                    </td>

                                    {/* Mô tả */}
                                    <td className="px-6 py-4 text-gray-700 truncate max-w-md" title={item.mota}>
                                        {item.mota || <span className="italic text-gray-400">Không có mô tả</span>}
                                    </td>

                                    {/* Hành động */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-nowrap justify-center items-center gap-2">

                                            {/* Nút Sửa (Secondary Action) */}
                                            <Can
                                                trangtruycap="/internship-allocation/create-allocation/:madot"
                                                matruycap="hienthi_dotthuctap_dotphanbocongty_sua"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSelectedAllocation(item);
                                                        setUpdateModalOpen(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-amber-50 text-amber-600 rounded-lg shadow-sm hover:bg-amber-100 transition-all border border-amber-200 whitespace-nowrap"
                                                    title="Sửa thông tin đợt phân bổ"
                                                >
                                                    <FaEdit className="w-3 h-3" /> Sửa
                                                </button>
                                            </Can>

                                            {/* Nút Phân bổ chi tiết (Primary Action) */}
                                            <Can
                                                trangtruycap="/internship-allocation/create-allocation/:madot"
                                                matruycap="hienthi_dotthuctap_dotphanbocongty_chitiet"
                                            >
                                                <button
                                                    onClick={() => navigate(`/internship-allocation/allocation/${item.madot}/${item.madotphanbo}`)}
                                                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] whitespace-nowrap"
                                                    title="Phân bổ sinh viên vào công ty"
                                                >
                                                    <FaHandshake className="w-3 h-3" /> Chi tiết
                                                </button>
                                            </Can>

                                            {/* Nút Xóa (Danger Action) */}
                                            <Can
                                                trangtruycap="/internship-allocation/create-allocation/:madot"
                                                matruycap="hienthi_dotthuctap_dotphanbocongty_xoa"
                                            >
                                                <button
                                                    onClick={() => handleDelete(item.madotphanbo)}
                                                    className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-rose-50 text-rose-600 rounded-lg shadow-sm hover:bg-rose-100 transition-all border border-rose-200 whitespace-nowrap"
                                                    title="Xóa đợt phân bổ này"
                                                >
                                                    <FaTrash className="w-3 h-3" /> Xóa
                                                </button>
                                            </Can>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Modal Cập nhật */}
            {selectedAllocation && (
                <Modal
                    show={updateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    size="5xl"
                    dismissible={false}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                >
                    <ModalHeader>Cập nhật phân bố</ModalHeader>
                    <ModalBody className="bg-gray-50 p-1 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <UpdateDotPhanBoCard
                            onClose={() => setUpdateModalOpen(false)}
                            madot={madot}
                            PBSV={selectedAllocation}
                        />
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
}
