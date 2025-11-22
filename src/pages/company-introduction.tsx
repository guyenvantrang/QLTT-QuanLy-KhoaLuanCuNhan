import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaEdit, FaPlus, FaSearch, FaFilter, FaList, FaHashtag, FaUser, 
    FaBuilding, FaCircle, FaCogs, FaCalendarAlt 
} from "react-icons/fa";
import type { GioiThieuCongTy } from "../models/model-all";
import { GetAllFunction, GetByIDAndNameFunction, GetByStatusFunction } from "../functions/company-introduction";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import UpdateGioiThieuCongTyForm from "../components/functionpages/company-introduction/update";

// Badge trạng thái
const StatusBadge = ({ status }: { status?: string }) => {
    const baseDot = "inline-block w-3 h-3 rounded-full mr-2";
    switch (status) {
        case "0":
            return (
                <div className="flex items-center justify-center">
                    <span className={`${baseDot} bg-yellow-400 animate-pulse`} />
                    <span className="text-sm text-gray-700">Mới</span>
                </div>
            );
        case "1":
            return (
                <div className="flex items-center justify-center">
                    <span className={`${baseDot} bg-green-500 animate-pulse`} />
                    <span className="text-sm text-gray-700">Đã duyệt</span>
                </div>
            );
        default:
            return null;
    }
};

// Input filter reusable
const FilterInput = ({ icon, placeholder, value, onChange }: any) => (
    <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
        {icon}
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent focus:outline-none"
        />
    </div>
);

// Select filter reusable
const SelectFilter = ({ icon, value, onChange, options }: any) => (
    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
        {icon}
        <select value={value} onChange={onChange} className="bg-transparent focus:outline-none">
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

export default function CompanyIntroductionManagement() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<GioiThieuCongTy[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [updateCourse, setUpdateCourse] = useState<GioiThieuCongTy | null>(null);

    // Bộ lọc
    const [madexuat, setMaDexuat] = useState("");
    const [magiangvien, setMaGiangVien] = useState("");
    const [macongty, setMaCongTy] = useState("");
    const [trangthai, setTrangThai] = useState("");

    // Fetch data chung
    const fetchData = useCallback(async () => {
    try {
        let res: GioiThieuCongTy[] = [];

        if (madexuat || magiangvien || macongty) {
            res = (await GetByIDAndNameFunction(madexuat, magiangvien, macongty)) ?? [];
            setTotalPages(1);
        } else if (trangthai) {
            res = (await GetByStatusFunction(trangthai)) ?? [];
            setTotalPages(1);
        } else {
            res = (await GetAllFunction(page, limit)) ?? [];
            setTotalPages(totalPages || 1);
        }

        setCompanies(res); // luôn là mảng, không còn lỗi TypeScript
    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setCompanies([]); // đảm bảo fallback
    }
}, [madexuat, magiangvien, macongty, trangthai, page, limit, totalPages]);


    useEffect(() => { fetchData(); }, [fetchData]);

    // Tìm kiếm
    const handleSearch = async () => {
        setPage(1);
        await fetchData();
    };

    // Lọc trạng thái
    const handleFilterStatus = async (value: string) => {
        setTrangThai(value);
        setPage(1);
    };

    // Lấy tất cả dữ liệu
    const handleGetAll = async () => {
        setLimit(9999);
        setPage(1);
        setTrangThai("");
        setMaDexuat("");
        setMaGiangVien("");
        setMaCongTy("");
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                    Quản lý giới thiệu công ty
                </h2>
                <div className="flex gap-3">
                    <button onClick={handleGetAll} className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">
                        <FaList /> Tải tất cả
                    </button>
                    <button onClick={() => navigate("/company-introduction/add")} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">
                        <FaPlus /> Thêm mới
                    </button>
                </div>
            </div>

            {/* Bộ lọc & tìm kiếm */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <FilterInput icon={<FaHashtag className="text-gray-400" />} placeholder="Mã đề xuất" value={madexuat} onChange={(e: any) => setMaDexuat(e.target.value)} />
                <FilterInput icon={<FaUser className="text-gray-400" />} placeholder="Mã giảng viên" value={magiangvien} onChange={(e: any) => setMaGiangVien(e.target.value)} />
                <FilterInput icon={<FaBuilding className="text-gray-400" />} placeholder="Mã công ty" value={macongty} onChange={(e: any) => setMaCongTy(e.target.value)} />
                <SelectFilter icon={<FaFilter className="text-gray-400" />} value={trangthai} onChange={(e: any) => handleFilterStatus(e.target.value)} options={[
                    { value: "", label: "Tất cả trạng thái" },
                    { value: "0", label: "Chuẩn bị" },
                    { value: "1", label: "Đã duyệt" },
                ]} />
                <button onClick={handleSearch} className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow hover:scale-105 transition">
                    <FaSearch className="inline mr-2" /> Tìm kiếm
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                        <tr>
                            {["Mã đề xuất", "Mã giảng viên", "Mã công ty", "Trạng thái", "Ngày đề xuất", "Hành động"].map((title, idx) => (
                                <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                    <div className="flex items-center gap-1">
                                        {{
                                            0: <FaHashtag className="text-gray-500" />,
                                            1: <FaUser className="text-gray-500" />,
                                            2: <FaBuilding className="text-gray-500" />,
                                            3: <FaCircle className="text-gray-500" />,
                                            4: <FaCalendarAlt className="text-gray-500" />,
                                            5: <FaCogs className="text-gray-500" />,
                                        }[idx]}
                                        <span>{title}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {companies.length > 0 ? companies.map(item => (
                            <tr key={item.madexuat} className="hover:bg-blue-50 transition-colors">
                                <td className="px-4 py-3 text-gray-400 font-medium truncate max-w-[120px]" title={item.madexuat}>{item.madexuat}</td>
                                <td className="px-4 py-3 text-gray-700 font-medium truncate max-w-[120px]" title={item.magiangvien}>{item.magiangvien}</td>
                                <td className="px-4 py-3 text-gray-700 font-medium truncate max-w-[120px]" title={item.macongty}>{item.macongty}</td>
                                <td className="px-4 py-3 text-center"><StatusBadge status={item.trangthai} /></td>
                                <td className="px-4 py-3 text-gray-600 text-center">{item.ngaydexuat ? new Date(item.ngaydexuat).toLocaleDateString("vi-VN") : "-"}</td>
                                <td className="px-4 py-3 flex gap-2 justify-center">
                                    <button onClick={() => setUpdateCourse(item)} className="flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-600 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all">
                                        <FaEdit className="text-sm" /> Chi tiết
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500 italic">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {limit < 9999 && (
                    <div className="flex justify-center gap-2 mt-5 mb-3">
                        <button className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-blue-100 transition" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button key={idx} className={`px-3 py-1 border rounded-lg transition ${page === idx + 1 ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`} onClick={() => setPage(idx + 1)}>
                                {idx + 1}
                            </button>
                        ))}
                        <button className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-blue-100 transition" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {updateCourse && (
                <Modal show={!!updateCourse} onClose={() => setUpdateCourse(null)} size="5xl" dismissible={false} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <ModalHeader></ModalHeader>
                    <ModalBody className="bg-gray-50 p-1 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <UpdateGioiThieuCongTyForm onClose={() => setUpdateCourse(null)} data={updateCourse} />
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
}
