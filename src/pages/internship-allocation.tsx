import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTag,
    FaPlayCircle,
    FaStopCircle,
    FaUsers,
    FaCircle,
    FaCogs,
    FaChartBar, // Thêm icon Thống kê
    FaHandshake,
    FaClock,
    FaInfo, // Icon cho Phân bổ
} from "react-icons/fa";
import type { DotThucTap } from "../models/model-all";
import { GetByStatusFunction } from "../functions/batch-internship";
import { Can } from "../routes/Can";

export default function InternshipAlloactionManagement() {
    const navigate = useNavigate();
    // Lọc chỉ những đợt đang diễn ra (status 1) theo logic gốc của bạn
    const [batchs, setBatchs] = useState<DotThucTap[]>([]);

    // ✅ Gọi API để lấy các đợt đang triển khai (status 1)
    const fetchData = async () => {
        try {
            // Lấy các đợt có trạng thái 1 (Đang diễn ra/Triển khai)
            const res = await GetByStatusFunction(Number(1));
            setBatchs(res || []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Hiển thị badge trạng thái (Đã cải tiến UI)
    function getStatusBadge(status?: number) {
        const baseDot = "w-2.5 h-2.5 rounded-full mr-2";
        switch (status) {
            case 0: // Chuẩn bị
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center">
                        <FaCircle className={`${baseDot} text-yellow-500 animate-pulse`} /> Chuẩn bị
                    </span>
                );
            case 1: // Đang diễn ra
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center">
                        <FaCircle className={`${baseDot} text-green-500`} /> Đang diễn ra
                    </span>
                );
            case 2: // Kết thúc
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 flex items-center">
                        <FaCircle className={`${baseDot} text-gray-500`} /> Kết thúc
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200 flex items-center">
                        <FaCircle className={`${baseDot} text-red-500`} /> Không xác định
                    </span>
                );
        }
    }


    return (
        <Can func="" page="">
            <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen font-sans">

                {/* Header */}
                <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-indigo-700 tracking-tight flex items-center gap-3">
                        <FaHandshake className="text-indigo-500 w-8 h-8" /> Quản Lý Phân Bổ Công Ty
                    </h2>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
                        title="Tải lại danh sách"
                    >
                        <FaCogs /> Tải lại
                    </button>
                </div>

                {/* Table Container */}
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">

                            {/* Table Header */}
                            <thead className="bg-gradient-to-r from-indigo-50 to-blue-100/80">
                                <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-600 font-bold">

                                    {/* Cột gộp thông tin */}
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2"><FaTag className="text-indigo-400" /> Đợt thực tập</div>
                                    </th>

                                    {/* Cột gộp thời gian */}
                                    <th className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center"><FaClock className="text-indigo-400" /> Thời gian</div>
                                    </th>

                                    <th className="px-6 py-4 text-center w-20">
                                        <div className="flex flex-col items-center"><FaUsers className="text-indigo-400" /> SL ĐK</div>
                                    </th>
                                    <th className="px-6 py-4 text-center w-32">
                                        <div className="flex flex-col items-center"><FaCircle className="text-indigo-400" /> Trạng thái</div>
                                    </th>
                                    <th className="px-6 py-4 text-center w-64">
                                        <div className="flex flex-col items-center"><FaCogs className="text-indigo-400" /> Hành động</div>
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                                {batchs.length > 0 ? (
                                    batchs.map((item) => (
                                        <tr key={item.madot} className="hover:bg-gray-50 transition-colors group">

                                            {/* Cột 1: Thông tin đợt (Mã + Tên) */}
                                            <td className="px-6 py-4 max-w-[300px]">
                                                <div className="font-semibold text-gray-800">{item.tendot}</div>
                                                <span className="text-xs text-gray-400 font-mono bg-gray-100 px-1 rounded">{item.madot}</span>
                                            </td>

                                            {/* Cột 2: Thời gian (Bắt đầu + Kết thúc) */}
                                            <td className="px-6 py-4 text-center text-xs">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="text-green-600 font-medium flex items-center gap-1">
                                                        <FaPlayCircle className="w-3 h-3" /> Bắt đầu: {item.thoigiantrienkhai ? new Date(item.thoigiantrienkhai).toLocaleDateString('vi-VN') : '-'}
                                                    </div>
                                                    <div className="text-red-600 font-medium flex items-center gap-1">
                                                        <FaStopCircle className="w-3 h-3" /> Kết thúc: {item.thoigianketthuc ? new Date(item.thoigianketthuc).toLocaleDateString('vi-VN') : '-'}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 3: SL đăng ký */}
                                            <td className="px-6 py-4 text-center font-bold text-lg text-indigo-600">
                                                {item.soluongdangky}
                                            </td>

                                            {/* Cột 4: Trạng thái */}
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.trangthai)}
                                            </td>

                                            {/* Cột 5: Hành động */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-wrap justify-center gap-2">

                                                    {/* Nút Phân bổ (Primary Action) */}
                                                    <button
                                                        onClick={() => navigate(`/internship-allocation/create-allocation/${item.madot}`)}
                                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                                                    >
                                                        <FaHandshake className="w-4 h-4" /> Phân bổ công ty
                                                    </button>

                                                    {/* Nút Thống kê (Secondary Action) */}
                                                    <button
                                                        onClick={() => navigate(`/internship-allocation/thongke/${item.madot}`)}
                                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
                                                    >
                                                        <FaChartBar className="w-4 h-4" /> Thống kê
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-gray-400 italic bg-gray-50/50">
                                            <div className="flex flex-col items-center justify-center">
                                                <FaInfo className="w-6 h-6 mb-2" />
                                                Không tìm thấy đợt thực tập nào đang diễn ra.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Footer thông tin */}
                    <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                        Hiển thị {batchs.length} đợt đang triển khai.
                    </div>
                </div>
            </div>
        </Can>
    );

}