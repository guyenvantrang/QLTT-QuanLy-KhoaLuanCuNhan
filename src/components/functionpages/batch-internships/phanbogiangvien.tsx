import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    FaSearch, FaTimes, FaFileExcel, FaUserTie,
    FaUserGraduate, FaChalkboardTeacher, FaUserSlash, FaCheckCircle
} from "react-icons/fa";
import type { SinhVien } from "../../../models/model-all";
import { laysinhvientheodot, laysinhvientheoid } from "../../../functions/student";
import * as XLSX from "xlsx-js-style"; // Nhớ cài: npm install xlsx-js-style

// --- INTERFACE MỞ RỘNG CHO UI ---
interface StudentAllocation extends SinhVien {
    gvName?: string;
    gvEmail?: string;
    gvPhone?: string;
    hasLecturer: boolean;
}

// --- HELPER: STYLE EXCEL ---
const styles = {
    title: { font: { bold: true, sz: 11, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center" } },
    header: { font: { bold: true, sz: 10, name: "Times New Roman", color: { rgb: "000000" } }, fill: { fgColor: { rgb: "E0E0E0" } }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
    cellCenter: { font: { sz: 11, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
    cellLeft: { font: { sz: 11, name: "Times New Roman" }, alignment: { horizontal: "left", vertical: "center", wrapText: true }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } }
};

export default function LecturerAllocationStatistics() {
    const { madot } = useParams<{ madot: string }>();
    const [students, setStudents] = useState<StudentAllocation[]>([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    // --- 1. LOAD DATA & PROCESS ---
    // --- 1. LOAD DATA & PROCESS ---
    useEffect(() => {
        if (!madot) return;
        setLoading(true);
        laysinhvientheodot(madot)
            .then(async (res) => {
                if (!res || res.length === 0) { setStudents([]); return; }

                const processedData: StudentAllocation[] = [];

                for (const sv of res) {
                    try {
                        // Lấy chi tiết để có thông tin giảng viên lồng bên trong
                        const detail = await laysinhvientheoid(sv.masv);

                        // Nếu không lấy được detail thì bỏ qua hoặc dùng data cơ bản
                        if (!detail) continue;

                        const registration = detail.dangkythuctap?.find(d => d.madot === madot);
                        const lecturer = registration?.giangvien;

                        processedData.push({
                            ...detail,
                            masv: detail.masv || sv.masv,

                            gvName: lecturer?.tengiangvien,
                            gvEmail: lecturer?.email,
                            gvPhone: lecturer?.sdt,
                            hasLecturer: !!lecturer?.magiangvien
                        });
                    } catch (err) { console.error(err); }
                }
                setStudents(processedData);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [madot]);

    // --- 2. FILTER & STATS ---
    const filteredList = useMemo(() => {
        if (!keyword) return students;
        const k = keyword.toLowerCase();
        return students.filter(s => s.masv.toLowerCase().includes(k) || (s.hoten && s.hoten.toLowerCase().includes(k)));
    }, [students, keyword]);

    const stats = useMemo(() => ({
        total: students.length,
        assigned: students.filter(s => s.hasLecturer).length,
        unassigned: students.filter(s => !s.hasLecturer).length
    }), [students]);

    // --- 3. EXPORT EXCEL FUNCTION ---
    const handleExport = (type: 'assigned' | 'unassigned') => {
        const dataToExport = students.filter(s => type === 'assigned' ? s.hasLecturer : !s.hasLecturer);

        if (dataToExport.length === 0) return alert("Không có dữ liệu để xuất!");

        const wb = XLSX.utils.book_new();
        const titleText = type === 'assigned'
            ? "DANH SÁCH SINH VIÊN ĐÃ CÓ GIẢNG VIÊN HƯỚNG DẪN"
            : "DANH SÁCH SINH VIÊN CHƯA CÓ GIẢNG VIÊN HƯỚNG DẪN";

        // Header Rows (Biểu mẫu chuẩn)
        const rows = [
            [{ v: "BỘ GIÁO DỤC VÀ ĐÀO TẠO", s: styles.title }, null, null, null, null, { v: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", s: styles.title }],
            [{ v: "TRƯỜNG ĐẠI HỌC...", s: styles.title }, null, null, null, null, { v: "Độc lập - Tự do - Hạnh phúc", s: { ...styles.title, font: { ...styles.title.font, underline: true } } }],
            [],
            [{ v: titleText, s: { ...styles.title, font: { sz: 14, bold: true } } }],
            [{ v: `Đợt: ${madot}`, s: { ...styles.title, font: { italic: true } } }],
            []
        ];

        // Table Header
        const headers = ["STT", "Mã SV", "Họ và Tên", "Ngày sinh", "Lớp/Ngành", "SĐT Sinh Viên", "Email Sinh Viên"];
        if (type === 'assigned') {
            headers.push("Giảng Viên Hướng Dẫn", "Email Giảng Viên", "SĐT Giảng Viên");
        }

        const headerRow = headers.map(h => ({ v: h, s: styles.header }));
        rows.push(headerRow); // Thêm dòng header vào rows nhưng typescript strict có thể báo lỗi type, nên dùng aoa_to_sheet sau

        // Data Rows
        const dataRows = dataToExport.map((s, idx) => {
            const baseRow = [
                { v: idx + 1, s: styles.cellCenter },
                { v: s.masv, s: styles.cellCenter },
                { v: s.hoten, s: styles.cellLeft },
                { v: s.ngaysinh ? new Date(s.ngaysinh).toLocaleDateString('vi-VN') : "", s: styles.cellCenter },
                { v: s.chuyennganh, s: styles.cellCenter },
                { v: s.sdt, s: styles.cellCenter },
                { v: s.email, s: styles.cellLeft },
            ];

            if (type === 'assigned') {
                baseRow.push(
                    { v: s.gvName || "", s: styles.cellLeft },
                    { v: s.gvEmail || "", s: styles.cellLeft },
                    { v: s.gvPhone || "", s: styles.cellCenter }
                );
            }
            return baseRow;
        });

        // Build Sheet
        // Note: rows đang là mảng hỗn hợp, ta cần cấu trúc lại chút để pass vào aoa_to_sheet an toàn hoặc dùng logic push
        const finalData = [...rows, ...dataRows];
        const ws = XLSX.utils.aoa_to_sheet([]);

        // Add data manually to support styling better
        XLSX.utils.sheet_add_aoa(ws, finalData, { origin: "A1" });

        // Merge Cells
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Left Header
            { s: { r: 0, c: 5 }, e: { r: 0, c: type === 'assigned' ? 9 : 6 } }, // Right Header
            { s: { r: 1, c: 5 }, e: { r: 1, c: type === 'assigned' ? 9 : 6 } },
            { s: { r: 3, c: 0 }, e: { r: 3, c: type === 'assigned' ? 9 : 6 } }, // Title
            { s: { r: 4, c: 0 }, e: { r: 4, c: type === 'assigned' ? 9 : 6 } }  // Batch
        ];

        // Column Widths
        const wscols = [
            { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 25 }
        ];
        if (type === 'assigned') wscols.push({ wch: 25 }, { wch: 25 }, { wch: 15 });
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, "DanhSach");
        XLSX.writeFile(wb, `PhanBoGV_${type}_${madot}.xlsx`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center gap-3">
                        <FaUserTie className="text-blue-600" /> Thống Kê Phân Bổ Giảng Viên
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium ml-9">
                        Đợt thực tập: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold">{madot}</span>
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm flex items-center gap-3 min-w-[140px]">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaUserGraduate /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Tổng SV</p>
                            <p className="text-xl font-black text-slate-800">{stats.total}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-3 min-w-[140px]">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FaCheckCircle /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Đã phân công</p>
                            <p className="text-xl font-black text-emerald-600">{stats.assigned}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3 min-w-[140px]">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><FaUserSlash /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Chưa có GV</p>
                            <p className="text-xl font-black text-orange-600">{stats.unassigned}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ACTION BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sinh viên..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                    />
                    {keyword && <button onClick={() => setKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"><FaTimes /></button>}
                </div>

                {/* Export Buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => handleExport('unassigned')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95 transition-all text-sm font-bold"
                    >
                        <FaFileExcel /> Xuất DS Chưa có GV
                    </button>
                    <button
                        onClick={() => handleExport('assigned')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-95 transition-all text-sm font-bold"
                    >
                        <FaFileExcel /> Xuất DS Đã có GV
                    </button>
                </div>
            </div>

            {/* --- MAIN TABLE --- */}
            <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.05)] border border-blue-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm italic">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-blue-50/50 border-b border-blue-100 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase w-16 text-center">STT</th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Thông tin Sinh viên</th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Liên hệ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Giảng viên hướng dẫn</th>
                                    <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredList.length > 0 ? (
                                    filteredList.map((sv, index) => (
                                        <tr key={sv.masv} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-6 py-4 text-center text-slate-500 text-sm font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 transition-colors">
                                                        {sv.hoten ? sv.hoten.charAt(0) : "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{sv.hoten}</p>
                                                        <p className="text-xs text-slate-500 font-mono">{sv.masv}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <p className="mb-1">{sv.email}</p>
                                                <p className="text-xs text-slate-400">{sv.sdt}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sv.hasLecturer ? (
                                                    <div className="flex items-start gap-2">
                                                        <FaChalkboardTeacher className="text-blue-500 mt-1 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-bold text-slate-700 text-sm">{sv.gvName}</p>
                                                            <p className="text-xs text-slate-500">{sv.gvEmail}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic pl-6">---</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {sv.hasLecturer ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1">
                                                        <FaCheckCircle /> Đã có GV
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 inline-flex items-center gap-1">
                                                        <FaUserSlash /> Chưa có
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            Không tìm thấy dữ liệu phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}