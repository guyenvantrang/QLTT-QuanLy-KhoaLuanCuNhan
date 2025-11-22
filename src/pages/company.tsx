import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaFilter,
    FaList,
    FaMapMarkerAlt,
    FaUserTie,
    FaBuilding,
    FaPhone,
    FaCogs,
    FaCircle,
    FaHashtag,
    FaTimes,
    FaCity,
} from "react-icons/fa";
import type { CongTyThucTap } from "../models/model-all";
import {
    GetAllFunction,
    SearchCompanyFunction,
    FilterCompanyFunction,
    DeleteCompanyFunction,
} from "../functions/company";

export default function CompanyManagement() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [companies, setCompanies] = useState<CongTyThucTap[]>([]);


    const [keyword, setKeyword] = useState("");
    const [hoatdong, setHoatDong] = useState("");
    const [phanloai, setPhanloai] = useState("");


    // ✅ Lấy dữ liệu phân trang
    const fetchData = async () => {
        try {
            if (keyword) {
                const res = await SearchCompanyFunction(keyword); // trả về mảng
                setCompanies(res || [])
                setTotalPages(1);
                return;
            }
            const res = await GetAllFunction(page, limit); // trả về mảng
            const data = res || [];
            setCompanies(data);
            setTotalPages(totalPages || 1);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setCompanies([]);
            setTotalPages(1);
        }
    };

    // ✅ Tìm kiếm theo keyword
    const handleSearch = async () => {
        setPage(1);
        await fetchData();
    };

    // ✅ Lọc trạng thái
    const handleFilterStatus = async (hoatdong?: string, phanloai?: string) => {
        setHoatDong(hoatdong || "");
        setPhanloai(phanloai || "");
        if (!hoatdong && !phanloai) {
            await fetchData();
        } else {
            const res = await FilterCompanyFunction(phanloai, hoatdong);
            setCompanies(res || []);
        }
    };

    // ✅ Tải tất cả dữ liệu (bỏ phân trang)
    const handleGetAll = async () => {
        try {
            const res = await GetAllFunction(1, 9999);
            setCompanies(res || []);
            setLimit(9999);
            setPage(1);
            setTotalPages(1);
        } catch (err) {
            console.error("Lỗi tải tất cả dữ liệu:", err);
            setCompanies([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    // ✅ Hiển thị badge trạng thái
    const getStatusBadge = (status?: string) => {
        const baseDot = "inline-block w-3 h-3 rounded-full mr-2";
        switch (status) {
            case "1":
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-green-500 animate-pulse`} />
                    </div>
                );
            case "0":
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-red-400`} />
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-gray-400`} />
                    </div>
                );
        }
    };
    const getStatusphanloai = (status?: string) => {
        switch (status) {
            case "1":
                return (
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-700">Trường học</span>
                    </div>
                );
            case "2":
                return (
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-700">Giới thiệu</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-700">Sinh viên</span>
                    </div>
                );
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-yellow-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-yellow-800 tracking-tight">
                    Quản lý công ty thực tập
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/company-introduction")}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaCity /> Quản lý công ty giới thiệu
                    </button>

                    <button
                        onClick={handleGetAll}
                        className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaList /> Tải tất cả
                    </button>
                    <button
                        onClick={() => navigate("/company/add")}
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                    >
                        <FaPlus /> Thêm mới
                    </button>
                </div>
            </div>

            {/* Bộ lọc & tìm kiếm */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaSearch className="text-gray-400" />

                    <input
                        type="text"
                        placeholder="Nhập từ khóa (mã hoặc tên công ty)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                    />

                    {/* Nút xóa chỉ hiện khi có keyword */}
                    {keyword && (
                        <button
                            onClick={() => setKeyword("")}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>


                {/* Lọc trạng thái */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaFilter className="text-gray-400" />
                    <select
                        value={hoatdong}
                        onChange={(e) => handleFilterStatus(e.target.value, phanloai)}
                        className="bg-transparent focus:outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Ngưng hoạt động</option>
                    </select>
                </div>

                {/* Lọc phạm vi */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaFilter className="text-gray-400" />
                    <select
                        value={phanloai}
                        onChange={(e) => handleFilterStatus(hoatdong, e.target.value)}
                        className="bg-transparent focus:outline-none"
                    >
                        <option value="">Tất cả phạm vi</option>
                        <option value="1">Phạm vi trường học</option>
                        <option value="0">Phạm vi sinh viên</option>
                        <option value="2">Phạm vi giới thiệu</option>
                    </select>
                </div>

                <button
                    onClick={handleSearch}
                    className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
                >
                    <FaSearch className="inline mr-2" />
                    Tìm kiếm
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">

                    {/* Header */}
                    <thead className="bg-gradient-to-r from-yellow-100 to-yellow-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaHashtag className="inline mr-1" /> Mã công ty
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaBuilding className="inline mr-1" /> Tên công ty
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaMapMarkerAlt className="inline mr-1" /> Địa chỉ
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaUserTie className="inline mr-1" /> Đại diện
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaPhone className="inline mr-1" /> Liên hệ
                            </th>
                            <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                                <FaCircle className="inline mr-1" /> Trạng thái(Phạm vi)
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase">
                                <FaCogs className="inline mr-1" /> Hành động
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-gray-100">
                        {companies.length > 0 ? (
                            companies.map((item) => (
                                <tr key={item.macongty} className="hover:bg-yellow-50 transition-colors">

                                    {/* Mã công ty */}
                                    <td className="px-3 py-4 text-gray-500 font-medium whitespace-nowrap align-top">
                                        {item.macongty}
                                    </td>

                                    {/* Tên công ty */}
                                    <td
                                        className="px-3 py-4 font-semibold text-gray-800 max-w-[180px] truncate align-top leading-6"
                                        title={item.tencongty}
                                    >
                                        {item.tencongty}
                                    </td>

                                    {/* Địa chỉ */}
                                    <td
                                        className="px-3 py-4 text-gray-600 max-w-[220px] truncate align-top leading-6"
                                        title={item.diachi || "-"}
                                    >
                                        {item.diachi || "-"}
                                    </td>

                                    {/* Đại diện */}
                                    <td
                                        className="px-3 py-4 text-gray-600 max-w-[150px] truncate align-top leading-6"
                                        title={item.nguoidaidien || "-"}
                                    >
                                        {item.nguoidaidien || "-"}
                                    </td>

                                    {/* Liên hệ */}
                                    <td
                                        className="px-3 py-4 text-gray-600 max-w-[150px] truncate align-top leading-6"
                                        title={item.sdt || item.email || "-"}
                                    >
                                        {item.sdt || item.email || "-"}
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="px-3 py-4 text-left align-top">
                                        <div className="flex flex-row items-start gap-2 leading-6">
                                            {getStatusBadge(item.hoatdong)}
                                            <span className="text-gray-700 font-medium">{getStatusphanloai(item.phanloai)}</span>
                                        </div>
                                    </td>

                                    {/* Hành động */}
                                    <td className="px-3 py-3 flex flex-row gap-2 align-top">
                                        <button
                                            onClick={() =>
                                                navigate(`/company/update/${item.macongty}`, { state: { data: item } })
                                            }
                                            className="flex items-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 hover:text-white transition-all"
                                        >
                                            <FaEdit className="text-sm" /> Sửa
                                        </button>
                                        <button
                                            onClick={() => {
                                                const confirmed = window.confirm(
                                                    `Bạn có chắc chắn muốn xóa công ty ${item.tencongty || item.macongty}?`
                                                );
                                                if (confirmed) {
                                                    DeleteCompanyFunction(item.macongty);
                                                }
                                            }}
                                            className="flex items-center gap-1 px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all"
                                        >
                                            <FaTrash className="text-sm" /> Xóa
                                        </button>

                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500 italic align-top">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>


                </table>
            </div>

            {/* Pagination */}
            {limit < 9999 && (
                <div className="flex justify-center gap-2 mt-5 mb-3">
                    <button
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-blue-100 transition"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 border rounded-lg transition ${page === idx + 1
                                ? "bg-blue-600 text-white"
                                : "hover:bg-blue-100"
                                }`}
                            onClick={() => setPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-blue-100 transition"
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
