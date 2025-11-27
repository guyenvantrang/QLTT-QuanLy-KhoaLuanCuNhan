import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import {
    FaEdit, FaSearch, FaFilter, FaList, FaHashtag, FaUser,
    FaBuilding, FaCircle, FaCalendarAlt, FaLayerGroup, FaSync
} from "react-icons/fa";
import type { GioiThieuCongTy } from "../models/model-all";
import { GetAllFunction, GetByIDAndNameFunction, GetByStatusFunction } from "../functions/company-introduction";
import { Modal, ModalBody } from "flowbite-react";
import UpdateGioiThieuCongTyForm from "../components/functionpages/company-introduction/update";

// --- Components Con ---

// Badge trạng thái được thiết kế lại dạng Pill
const StatusBadge = ({ status }: { status?: string }) => {
    switch (status) {
        case "0":
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                    Mới
                </span>
            );
        case "1":
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Đã duyệt
                </span>
            );
        default:
            return <span className="text-gray-400 text-xs italic">Chưa xác định</span>;
    }
};

// Input với hiệu ứng viền phát sáng khi focus
const FilterInput = ({ icon, placeholder, value, onChange }: any) => (
    <div className="group flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] focus-within:border-blue-500 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.3)] flex-1">
        <span className="text-blue-300 group-focus-within:text-blue-600 transition-colors text-lg">
            {icon}
        </span>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent border-none p-0 text-sm text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none"
        />
    </div>
);

// Select với hiệu ứng tương tự
const SelectFilter = ({ icon, value, onChange, options }: any) => (
    <div className="group flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] focus-within:border-blue-500 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <span className="text-blue-300 group-focus-within:text-blue-600 transition-colors text-lg">
            {icon}
        </span>
        <select
            value={value}
            onChange={onChange}
            className="bg-transparent border-none p-0 text-sm text-gray-700 focus:ring-0 focus:outline-none cursor-pointer w-full min-w-[150px]"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// --- Main Component ---

export default function CompanyIntroductionManagement() {
    // const navigate = useNavigate();
    const [companies, setCompanies] = useState<GioiThieuCongTy[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [updateCourse, setUpdateCourse] = useState<GioiThieuCongTy | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter states
    const [madexuat, setMaDexuat] = useState("");
    const [magiangvien, setMaGiangVien] = useState("");
    const [macongty, setMaCongTy] = useState("");
    const [trangthai, setTrangThai] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            let res: GioiThieuCongTy[] = [];
            // Giữ logic fetch cũ
            if (madexuat || magiangvien || macongty) {
                res = (await GetByIDAndNameFunction(madexuat, magiangvien, macongty)) ?? [];
                setTotalPages(1);
            } else if (trangthai) {
                res = (await GetByStatusFunction(trangthai)) ?? [];
                setTotalPages(1);
            } else {
                res = (await GetAllFunction(page, limit)) ?? [];
                setTotalPages(totalPages || 1); // Note: API nên trả về totalPages thực tế
            }
            setCompanies(res);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setCompanies([]);
        } finally {
            setIsLoading(false);
        }
    }, [madexuat, magiangvien, macongty, trangthai, page, limit]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSearch = async () => {
        setPage(1);
        await fetchData();
    };

    const handleGetAll = async () => {
        setLimit(9999);
        setPage(1);
        setTrangThai("");
        setMaDexuat("");
        setMaGiangVien("");
        setMaCongTy("");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center gap-3">
                        <FaLayerGroup className="text-blue-600" />
                        Quản lý Giới thiệu
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 ml-10">Quản lý các đề xuất thực tập doanh nghiệp</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleGetAll}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-xl font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border-blue-400 transition-all duration-300"
                    >
                        <FaSync className={isLoading ? "animate-spin" : ""} /> Tải tất cả
                    </button>
                </div>
            </div>

            {/* 2. Filter Section Container - Hiệu ứng Glow Viền */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.1)] border border-blue-100 mb-8 relative overflow-hidden">
                {/* Decorative glow background */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <FilterInput
                        icon={<FaHashtag />}
                        placeholder="Mã đề xuất..."
                        value={madexuat}
                        onChange={(e: any) => setMaDexuat(e.target.value)}
                    />
                    <FilterInput
                        icon={<FaUser />}
                        placeholder="Mã giảng viên..."
                        value={magiangvien}
                        onChange={(e: any) => setMaGiangVien(e.target.value)}
                    />
                    <FilterInput
                        icon={<FaBuilding />}
                        placeholder="Mã công ty..."
                        value={macongty}
                        onChange={(e: any) => setMaCongTy(e.target.value)}
                    />
                    <SelectFilter
                        icon={<FaFilter />}
                        value={trangthai}
                        onChange={(e: any) => { setTrangThai(e.target.value); setPage(1); }}
                        options={[
                            { value: "", label: "Tất cả trạng thái" },
                            { value: "0", label: "Mới (Chuẩn bị)" },
                            { value: "1", label: "Đã duyệt" },
                        ]}
                    />

                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FaSearch /> Tìm kiếm
                    </button>
                </div>
            </div>

            {/* 3. Table Section - Hiệu ứng Glow Viền Chính */}
            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.15)] border border-blue-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm uppercase tracking-wider">
                                {[
                                    { icon: FaHashtag, label: "Mã ĐX" },
                                    { icon: FaUser, label: "Giảng viên" },
                                    { icon: FaBuilding, label: "Công ty" },
                                    { icon: FaCircle, label: "Trạng thái" },
                                    { icon: FaCalendarAlt, label: "Ngày tạo" },
                                    { icon: FaList, label: "Thao tác", align: "center" }
                                ].map((h, idx) => (
                                    <th key={idx} className={`px-6 py-4 font-bold whitespace-nowrap ${h.align === 'center' ? 'text-center' : 'text-left'}`}>
                                        <div className={`flex items-center gap-2 ${h.align === 'center' ? 'justify-center' : ''}`}>
                                            <h.icon className="opacity-70" /> {h.label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                                        <p className="mt-2 text-blue-500 text-sm">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : companies.length > 0 ? (
                                companies.map((item, idx) => (
                                    <tr
                                        key={item.madexuat || idx}
                                        className="group hover:bg-blue-50/50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100 group-hover:border-blue-300 transition-colors">
                                                {item.madexuat}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{item.magiangvien}</td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{item.macongty}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.trangthai} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {item.ngaydexuat ? new Date(item.ngaydexuat).toLocaleDateString("vi-VN") : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setUpdateCourse(item)}
                                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                                            >
                                                <FaEdit /> Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 flex flex-col items-center justify-center text-slate-400">
                                        <FaLayerGroup className="text-4xl mb-3 opacity-20" />
                                        <p>Không tìm thấy dữ liệu phù hợp</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                {limit < 9999 && companies.length > 0 && (
                    <div className="bg-slate-50 px-6 py-4 border-t border-blue-100 flex justify-center items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-slate-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPage(idx + 1)}
                                className={`w-10 h-10 rounded-lg font-bold border transition-all duration-300 ${page === idx + 1
                                        ? "bg-blue-600 text-white border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        : "bg-white text-slate-600 border-blue-200 hover:bg-blue-50"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-slate-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            {/* 4. Modal Component */}
            {updateCourse && (
                <Modal
                    show={!!updateCourse}
                    onClose={() => setUpdateCourse(null)}
                    size="7xl"
                    dismissible={false}
                    // Thêm backdrop-blur mạnh hơn chút để modal nổi bật
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
                >
                    <div className="relative w-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-40"></div>
                        <ModalBody className="relative bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto p-0 custom-scrollbar pr-1">
                            {/* Content */}
                            <div className="p-4">
                                <UpdateGioiThieuCongTyForm onClose={() => setUpdateCourse(null)} data={updateCourse} />
                            </div>
                        </ModalBody>
                    </div>
                </Modal>
            )}
        </div>
    );
}