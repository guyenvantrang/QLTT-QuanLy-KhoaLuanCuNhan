import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaList,
    FaHashtag,
    FaTag,
    FaCalendarAlt,
    FaPlayCircle,
    FaStopCircle,
    FaUsers,
    FaCircle,
    FaCogs,
    FaChartBar,
    FaChevronRight,
    FaChevronLeft,
} from "react-icons/fa";
import type { DotThucTap } from "../models/model-all";
import { Can } from "../routes/Can"
import {
    GetAllFunction,
    DeleteFunction,
    GetByIDAndNameFunction,
    GetByStatusFunction,
} from "../functions/batch-internship";
import { CustomStatusSelect } from "../components/form/dropdown";

export default function InternshipManagement() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [batchs, setBatchs] = useState<DotThucTap[]>([]);
    const [selectedMadot, setSelectedMadot] = useState<string>("");

    // Bộ lọc
    const [madot, setMaDot] = useState("");
    const [tendot, setTenDot] = useState("");
    const [trangthai, setTrangThai] = useState<string>("");

    // ✅ Gọi API
    const fetchData = async () => {
        try {
            if (madot || tendot || trangthai) {
                const res = await GetByIDAndNameFunction(madot, tendot);
                setBatchs(res || []);
                setTotalPages(1);
                return;
            }
            const res = await GetAllFunction(page, limit);
            setBatchs(res || []);
            setTotalPages(totalPages || 1);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    // ✅ Tìm kiếm
    const handleSearch = async () => {
        setPage(1);
        await fetchData();
    };

    // ✅ Lọc trạng thái
    const handleFilterStatus = async (value: string) => {
        setTrangThai(value);
        if (value === "") {
            await fetchData();
        } else {
            const res = await GetByStatusFunction(Number(value));
            setBatchs(res || []);
        }
    };

    // ✅ Lấy tất cả dữ liệu (bỏ phân trang)
    const handleGetAll = async () => {
        try {
            const res = await GetAllFunction(1, 9999);
            setBatchs(res || []);
            setLimit(9999);
            setTotalPages(1);
        } catch (error) {
            console.error("Lỗi tải tất cả dữ liệu:", error);
        }
    };

    // Hiển thị badge trạng thái
    function getStatusBadge(status?: number) {
        const baseDot = "inline-block w-3 h-3 rounded-full mr-2";

        switch (status) {
            case 0:
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-yellow-400 animate-pulse`}></span>
                        <span className="text-sm text-gray-700">Chuẩn bị</span>
                    </div>
                );
            case 1:
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-green-500 animate-pulse`}></span>
                        <span className="text-sm text-gray-700">Đang diễn ra</span>
                    </div>
                );
            case 2:
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-gray-400`}></span>
                        <span className="text-sm text-gray-700">Kết thúc</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center">
                        <span className={`${baseDot} bg-red-400`}></span>
                        <span className="text-sm text-gray-700">Không xác định</span>
                    </div>
                );
        }
    }


    return (
        <Can func="hienthi" page="/batch-internship">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                        Quản lý đợt thực tập
                    </h2>
                    <div className="flex gap-3">

                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300">
                            <FaHashtag className="text-gray-500" />
                            <span className="font-medium text-gray-700">Mã đợt đã chọn:</span>
                            <span className="text-blue-600 font-semibold">{selectedMadot || "Chưa chọn"}</span>
                        </div>
                        <Can func="quanlydotphanbo" page="/batch-internship">
                            <button
                                onClick={() => selectedMadot ? navigate(`/internship-allocation/create-allocation/${selectedMadot}`) : alert("Vui lòng chọn một đợt trước.")}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                            >
                                <FaUsers /> Quản lý phân bổ công ty
                            </button>
                        </Can>
                        <Can func="thongke" page="/batch-internship">
                            <button
                                onClick={() =>
                                    selectedMadot
                                        ? navigate(`/internship-allocation/thongke/${selectedMadot}`)
                                        : alert("Vui lòng chọn một đợt trước.")
                                }
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                            >
                                <FaChartBar /> Thống kê
                            </button>
                        </Can>

                        <button
                            onClick={handleGetAll}
                            className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                        >
                            <FaList /> Tải tất cả
                        </button>
                        <Can func="them" page="/batch-internship">
                            <button
                                onClick={() => navigate("/batch-internship/add")}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                            >
                                <FaPlus /> Thêm mới
                            </button>
                        </Can>
                    </div>
                </div>

                {/* Hiển thị mã đợt đã chọn */}


                {/* Bộ lọc & tìm kiếm */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                        <FaSearch className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Nhập mã đợt"
                            value={madot}
                            onChange={(e) => setMaDot(e.target.value)}
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                        <FaSearch className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Nhập tên đợt"
                            value={tendot}
                            onChange={(e) => setTenDot(e.target.value)}
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>

                    <CustomStatusSelect value={trangthai} onChange={handleFilterStatus} />

                    <button
                        onClick={handleSearch}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
                    >
                        <FaSearch className="inline mr-2" />
                        Tìm kiếm
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                    {/* Header Cells với Icon */}
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider">
                                        <div className="flex items-center gap-2"><FaHashtag className="text-blue-400" /> Mã đợt</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider">
                                        <div className="flex items-center gap-2"><FaTag className="text-blue-400" /> Tên đợt</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider text-center">
                                        <div className="flex items-center justify-center gap-2"><FaCalendarAlt className="text-blue-400" /> Ngày lập</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider text-center">
                                        <div className="flex items-center justify-center gap-2"><FaPlayCircle className="text-green-400" /> Bắt đầu</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider text-center">
                                        <div className="flex items-center justify-center gap-2"><FaStopCircle className="text-red-400" /> Kết thúc</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider text-center">
                                        <div className="flex items-center justify-center gap-2"><FaUsers className="text-blue-400" /> SL ĐK</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider text-center">
                                        <div className="flex items-center justify-center gap-2"><FaCircle className="text-blue-400" /> Trạng thái</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase tracking-wider text-center w-40">
                                        <div className="flex items-center justify-center gap-2"><FaCogs className="text-blue-400" /> Thao tác</div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 text-sm">
                                {batchs.length > 0 ? (
                                    batchs.map((item) => (
                                        <tr
                                            key={item.madot}
                                            onClick={() => setSelectedMadot(item.madot)}
                                            className={`group transition-colors duration-150 cursor-pointer
                                ${selectedMadot === item.madot ? 'bg-blue-50/60' : 'hover:bg-gray-50'}
                            `}
                                        >
                                            <td className="px-6 py-4 font-mono text-gray-600 font-medium">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">{item.madot}</span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                <div className="truncate max-w-[200px]" title={item.tendot}>{item.tendot}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {item.ngaylap ? new Date(item.ngaylap).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {item.thoigiantrienkhai ? new Date(item.thoigiantrienkhai).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {item.thoigianketthuc ? new Date(item.thoigianketthuc).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                                                    {item.soluongdangky}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.trangthai)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {/* Nút Sửa */}
                                                    <Can func="sua" page="/batch-internship">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/batch-internship/update/${item.madot}`, { state: { data: item } });
                                                            }}
                                                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 hover:text-amber-700 border border-amber-100 transition-all shadow-sm"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <FaEdit className="text-base" />
                                                        </button>
                                                    </Can>

                                                    {/* Nút Xóa */}
                                                    <Can func="xoa" page="/batch-internship">
                                                        <button
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                const confirmDelete = window.confirm("Bạn có chắc muốn xóa đợt này?");
                                                                if (!confirmDelete) return;
                                                                await DeleteFunction(item.madot);
                                                                await fetchData();
                                                            }}
                                                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 hover:text-rose-700 border border-rose-100 transition-all shadow-sm"
                                                            title="Xóa"
                                                        >
                                                            <FaTrash className="text-base" />
                                                        </button>
                                                    </Can>
                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic bg-gray-50/30">
                                            Không tìm thấy dữ liệu phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer của bảng */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                        <span>Hiển thị {batchs.length} bản ghi</span>
                        <span className="italic">Cập nhật lúc: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* 4. PHÂN TRANG (PAGINATION) */}
                {limit < 9999 && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 mb-10">
                        {/* Nút Prev */}
                        <button
                            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            title="Trang trước"
                        >
                            <FaChevronLeft />
                        </button>

                        {/* Các trang số */}
                        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPage(idx + 1)}
                                    className={`w-9 h-9 rounded-md text-sm font-medium transition-all duration-200
                        ${page === idx + 1
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        {/* Nút Next */}
                        <button
                            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            title="Trang sau"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </Can>
    );

}