import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaUsers,
    FaCogs,
    FaIdBadge,
    FaEnvelope,
    FaPhone,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";
import type { DotThucTap, GiangVien } from "../models/model-all";
import { laytatca } from "../functions/teacher";
import { Modal, ModalBody } from "flowbite-react";
import LecturerModal from "../components/functionpages/teacher/detail-teacher";
import { Delete } from "../functions/teacher"
import { GetByStatusFunction, } from "../functions/batch-internship";
export default function LecturerManagement() {
    const navigate = useNavigate();

    const [lecturers, setLecturers] = useState<GiangVien[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedAllocation, setSelectedAllocation] = useState<GiangVien | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [batchs, setBatchs] = useState<DotThucTap[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<DotThucTap | null>(null);
    const fetchData = async () => {
        try {
            const res = await GetByStatusFunction(Number(1));
            setBatchs(res || []);
            return;
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        }
    };


    // ✅ Gọi API lấy tất cả giảng viên
    const fetchLecturers = async () => {
        try {
            const res = await laytatca();
            console.log("API giảng viên:", res);

            // Kiểm tra dữ liệu trả về
            if (Array.isArray(res)) {
                setLecturers(res);
            } else if (res && Array.isArray(res)) {
                setLecturers(res);
            } else {
                setLecturers([]);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu giảng viên:", err);
            setLecturers([]);
        }
    };

    useEffect(() => {
        fetchLecturers();
        fetchData();
    }, []);

    // ✅ Tìm kiếm realtime
    const filteredLecturers = searchText.trim() === ""
        ? lecturers
        : lecturers.filter((gv) => {
            const keyword = searchText.toLowerCase();
            return (
                (gv.magiangvien || "").toLowerCase().includes(keyword) ||
                (gv.tengiangvien || "").toLowerCase().includes(keyword) ||
                (gv.email || "").toLowerCase().includes(keyword) ||
                (gv.sdt || "").toLowerCase().includes(keyword)
            );
        });

    // ✅ Xóa giảng viên
    const handleDelete = async (magiangvien: string) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa giảng viên này?");
        if (!confirmDelete) return;

        try {
            // Gọi API xóa giảng viên (bạn cần implement deleteLecturer)
            await Delete(magiangvien);
            console.log("Xóa giảng viên:", magiangvien);

            // Sau khi xóa, reload lại danh sách
            fetchLecturers();
        } catch (err) {
            console.error("Lỗi xóa giảng viên:", err);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                    Quản lý giảng viên
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={fetchLecturers}
                        className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaUsers /> Tải lại
                    </button>


                    <div className="relative inline-block">
                        <select
                            onChange={(e) => setSelectedBatch(batchs.find((batch) => batch.madot === e.target.value) || null)}
                            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all cursor-pointer w-64"
                        >
                            <option value="">Chọn đợt</option>
                            {batchs.map((batch) => (
                                <option key={batch.madot} value={batch.madot}>
                                    {batch.madot} - {batch.tendot}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (selectedBatch) {
                                navigate(`/teacher/allocation/${selectedBatch.madot}`);
                            } else {
                                alert("Vui lòng chọn đợt trước khi phân bổ.");
                            }
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaPlus /> Phân bổ giảng viên
                    </button>
                    <button
                        onClick={() => navigate("/teacher/add")}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaPlus /> Thêm mới
                    </button>
                </div>
            </div>

            {/* Tìm kiếm */}
            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, tên, email"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <div className="flex items-center gap-1">
                                    <FaIdBadge className="text-gray-500" />
                                    Mã GV
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <div className="flex items-center gap-1">
                                    <FaUsers className="text-gray-500" />
                                    Tên GV
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <div className="flex items-center gap-1">
                                    <FaEnvelope className="text-gray-500" />
                                    Email
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <div className="flex items-center gap-1">
                                    <FaPhone className="text-gray-500" />
                                    SĐT
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <div className="flex items-center gap-1">
                                    <FaCheckCircle className="text-gray-500" />
                                    Trạng thái
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <div className="flex items-center gap-1">
                                    <FaCogs className="text-gray-500" />
                                    Hành động
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredLecturers.length > 0 ? (
                            filteredLecturers.map((gv) => {
                                // Giả sử gv có trường trangthai là 0 hoặc 1, nếu không có thì mặc định 0 (không hoạt động)
                                const trangthaiValue = gv.trangthai ?? '0';
                                const isActive = trangthaiValue === '1';
                                const trangthaiText = isActive ? 'Đang hoạt động' : 'Không hoạt động';
                                return (
                                    <tr key={gv.magiangvien} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-600">{gv.magiangvien}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-800">{gv.tengiangvien}</td>
                                        <td className="px-4 py-3 text-gray-600">{gv.email || "-"}</td>
                                        <td className="px-4 py-3 text-gray-600">{gv.sdt || "-"}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                                                {trangthaiText}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedAllocation(gv);
                                                    setUpdateModalOpen(true);
                                                }}
                                                className="flex items-center gap-1 px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all"
                                            >
                                                <FaTrash className="text-sm" /> Quản lý
                                            </button>
                                            <button
                                                onClick={() =>
                                                    navigate(`/teacher/update/${gv.magiangvien}`, {
                                                        state: { data: gv },
                                                    })
                                                }
                                                className="flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-600 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all"
                                            >
                                                <FaEdit className="text-sm" /> Sửa
                                            </button>

                                            <button
                                                onClick={() => handleDelete(gv.magiangvien!)}
                                                className="flex items-center gap-1 px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all"
                                            >
                                                <FaTrash className="text-sm" /> Xóa
                                            </button>

                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Modal
                    show={updateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}

                    dismissible={false}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                >
                    <ModalBody className="bg-gray-50 p-1 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <LecturerModal
                            onClose={() => setUpdateModalOpen(false)}
                            magiangvien={selectedAllocation?.magiangvien || ""}
                        />
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}