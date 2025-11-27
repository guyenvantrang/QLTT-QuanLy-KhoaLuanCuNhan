import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { 
    FaSearch, FaTimes, FaFileExcel, 
    FaUserTimes, FaEnvelope, FaPhone, FaMapMarkerAlt 
} from "react-icons/fa";
import type { SinhVien } from "../../../models/model-all";
import { layTongSinhVienChuaCoCongTy, laysinhvientheoid } from "../../../functions/student";
import * as XLSX from "xlsx-js-style";

export default function StudentHaveNotCompanyManagement() {
    const { madot } = useParams<{ madot: string }>();
    const [students, setStudents] = useState<SinhVien[]>([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Load Data ---
    useEffect(() => {
        if (!madot) return;
        setLoading(true);
        layTongSinhVienChuaCoCongTy(madot)
            .then(async (res) => {
                if (!res || res.length === 0) { setStudents([]); return; }
                const detailedStudents: SinhVien[] = [];
                for (const sv of res) {
                    try {
                        const detail = await laysinhvientheoid(sv.masv);
                        if (detail) detailedStudents.push(detail);
                    } catch (err) { console.error(err); }
                }
                setStudents(detailedStudents);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [madot]);

    const filteredStudents = useMemo(() => {
        if (!keyword) return students;
        const k = keyword.toLowerCase();
        return students.filter(sv => sv.masv.toLowerCase().includes(k) || (sv.hoten && sv.hoten.toLowerCase().includes(k)));
    }, [students, keyword]);

    // --- EXPORT EXCEL SIMPLE ---
    const exportExcel = () => {
        if (filteredStudents.length === 0) return alert("Không có dữ liệu để xuất!");

        const workbook = XLSX.utils.book_new();

        // Styles
        const styleTitle = { font: { bold: true, sz: 14, name: "Times New Roman" }, alignment: { horizontal: "center" } };
        const styleHeader = { font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "C0504D" } }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } };
        const styleCellCenter = { alignment: { horizontal: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } };
        const styleCellLeft = { alignment: { horizontal: "left" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } };

        // Rows
        const rowTitle = [{ v: `DANH SÁCH SINH VIÊN CHƯA CÓ CÔNG TY THỰC TẬP (Đợt ${madot})`, s: styleTitle }];
        const headers = ["STT", "Mã SV", "Họ và Tên", "Ngày sinh", "Giới tính", "Lớp/Ngành", "Email", "Số điện thoại", "Địa chỉ"];
        const headerRow = headers.map(h => ({ v: h, s: styleHeader }));

        const dataRows = filteredStudents.map((sv, index) => [
            { v: index + 1, s: styleCellCenter },
            { v: sv.masv, s: styleCellCenter },
            { v: sv.hoten, s: styleCellLeft },
            { v: sv.ngaysinh ? new Date(sv.ngaysinh).toLocaleDateString('vi-VN') : "", s: styleCellCenter },
            { v: sv.gioitinh, s: styleCellCenter },
            { v: sv.chuyennganh, s: styleCellCenter },
            { v: sv.email, s: styleCellLeft },
            { v: sv.sdt, s: styleCellCenter },
            { v: sv.diachi, s: styleCellLeft },
        ]);

        const ws = XLSX.utils.aoa_to_sheet([rowTitle, [], headerRow, ...dataRows]);
        
        // Merge Title
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
        
        // Col Widths
        ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 8 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 40 }];

        XLSX.utils.book_append_sheet(workbook, ws, "ChuaCoCongTy");
        XLSX.writeFile(workbook, `DS_ChuaCoCongTy_${madot}.xlsx`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
            {/* Header Page */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 flex items-center gap-2">
                        <FaUserTimes className="text-red-500" /> Sinh Viên Chưa Có Công Ty
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Đợt: <span className="text-red-600 bg-red-50 px-2 rounded border border-red-100 font-bold">{madot}</span></p>
                </div>
                
                <button onClick={exportExcel} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 font-bold text-sm">
                    <FaFileExcel size={18} /> Xuất Danh Sách
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3 max-w-xl">
                <FaSearch className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm sinh viên..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-700"
                />
                {keyword && <button onClick={() => setKeyword("")}><FaTimes className="text-slate-400 hover:text-red-500" /></button>}
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.05)] border border-red-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-red-50/50 border-b border-red-100 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-red-800 uppercase w-16 text-center">STT</th>
                                    <th className="px-6 py-4 text-xs font-bold text-red-800 uppercase">Thông tin Sinh viên</th>
                                    <th className="px-6 py-4 text-xs font-bold text-red-800 uppercase">Liên hệ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-red-800 uppercase">Thông tin khác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((sv, index) => (
                                        <tr key={sv.masv} className="hover:bg-red-50/20 transition-colors">
                                            <td className="px-6 py-4 text-center text-slate-500 text-sm font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                                                        {sv.hoten ? sv.hoten.charAt(0) : "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{sv.hoten}</p>
                                                        <p className="text-xs text-slate-500 font-mono">{sv.masv}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 space-y-1">
                                                <div className="flex items-center gap-2"><FaEnvelope className="text-slate-400 text-xs" /> {sv.email}</div>
                                                <div className="flex items-center gap-2"><FaPhone className="text-slate-400 text-xs" /> {sv.sdt}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 space-y-1">
                                                <div className="flex items-center gap-2"><span className="text-slate-400 text-xs">Lớp:</span> <span className="font-medium">{sv.chuyennganh}</span></div>
                                                <div className="flex items-center gap-2" title={sv.diachi}><FaMapMarkerAlt className="text-slate-400 text-xs" /> <span className="truncate max-w-[200px]">{sv.diachi}</span></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="py-8 text-center text-slate-400 text-sm">Không tìm thấy dữ liệu</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}