// Trang chính: QuanLyThongBao.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTimes,
    FaFilter,
} from "react-icons/fa";

import { GetAllThongBao, DeleteThongBao, SearchThongBao, FilterThongBaoByNgay } from "../api/thongbao";

// Interface cho ThongBao từ model
interface ThongBao {
    mathongbao: string;
    tieude?: string;
    noidung?: string;
    duongdanfilecongvan?: string;
    duongdanfiletailieu?: string;
    ngaytao?: string; // ISO Date string
}

export default function QuanLyThongBao() {
    const navigate = useNavigate();
    const [thongbaos, setThongBaos] = useState<ThongBao[]>([]);
    const [keyword, setKeyword] = useState("");
    const [filterNgay, setFilterNgay] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch danh sách thông báo
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await GetAllThongBao();
            setThongBaos(data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle tìm kiếm
    const handleSearch = async () => {
        try {
            const data = await SearchThongBao(keyword);
            setThongBaos(data);
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
        }
    };

    // Handle lọc theo ngày
    const handleFilter = async () => {
        try {
            const data = await FilterThongBaoByNgay(filterNgay);
            setThongBaos(data);
        } catch (err) {
            console.error("Lỗi lọc:", err);
        }
    };

    // Handle xóa
    const handleDelete = async (mathongbao: string) => {
        if (window.confirm("Xác nhận xóa?")) {
            try {
                await DeleteThongBao(mathongbao);
                alert("Xóa thành công!");
                fetchData();
            } catch (err) {
                console.error("Lỗi xóa:", err);
            }
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-indigo-800 tracking-tight">
                    Quản Lý Thông Báo
                </h2>
                <button
                    onClick={() => navigate("/thongbao/add")}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                >
                    <FaPlus /> Thêm Thông Báo
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề hoặc nội dung"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                    />
                    {keyword && <FaTimes onClick={() => setKeyword("")} className="text-gray-400 cursor-pointer" />}
                </div>
                <button onClick={handleSearch} className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:scale-105 transition">
                    Tìm Kiếm
                </button>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaFilter className="text-gray-400" />
                    <input
                        type="date"
                        value={filterNgay}
                        onChange={(e) => setFilterNgay(e.target.value)}
                        className="bg-transparent focus:outline-none"
                    />
                </div>
                <button onClick={handleFilter} className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow hover:scale-105 transition">
                    Lọc Theo Ngày
                </button>
            </div>

            {/* Table Danh Sách */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-100 to-blue-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Mã</th>
                            <th className="px-4 py-3 text-left">Tiêu Đề</th>
                            <th className="px-4 py-3 text-left">Nội Dung</th>
                            <th className="px-4 py-3 text-left">File Công Văn</th>
                            <th className="px-4 py-3 text-left">File Tài Liệu</th>
                            <th className="px-4 py-3 text-left">Ngày Tạo</th>
                            <th className="px-4 py-3 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-4">Đang tải...</td></tr>
                        ) : thongbaos.length > 0 ? (
                            thongbaos.map((item) => (
                                <tr key={item.mathongbao} className="hover:bg-indigo-50">
                                    <td className="px-4 py-4">{item.mathongbao}</td>
                                    <td className="px-4 py-4">{item.tieude || "-"}</td>
                                    <td className="px-4 py-4">{item.noidung?.slice(0, 50) || "-"}...</td>
                                    <td className="px-4 py-4">{item.duongdanfilecongvan ? <a href={item.duongdanfilecongvan} className="text-blue-500">Tải</a> : "-"}</td>
                                    <td className="px-4 py-4">{item.duongdanfiletailieu ? <a href={item.duongdanfiletailieu} className="text-blue-500">Tải</a> : "-"}</td>
                                    <td className="px-4 py-4">{item.ngaytao?.split("T")[0] || "-"}</td>
                                    <td className="px-4 py-4 flex gap-2 justify-center">
                                        <FaEdit onClick={() => navigate(`/thongbao/update/${item.mathongbao}`)} className="text-blue-500 cursor-pointer" />
                                        <FaTrash onClick={() => handleDelete(item.mathongbao)} className="text-red-500 cursor-pointer" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="text-center py-4">Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}