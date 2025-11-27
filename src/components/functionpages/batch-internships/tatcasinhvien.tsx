import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaSearch, FaTimes, FaFileExcel, FaEye, FaUserGraduate, FaBuilding, FaChalkboardTeacher, FaClock, FaInfoCircle } from "react-icons/fa";
import type { SinhVien } from "../../../models/model-all";
import { laysinhvientheodot, laysinhvientheoid } from "../../../functions/student";
import * as XLSX from "xlsx-js-style";


const round = (num: number) => Math.round(num * 100) / 100;
const getStudentResult = (sv: SinhVien, madot: string) => {
  const dk = sv.dangkythuctap?.find(d => d.madot === madot);
  const diem = dk?.giangvienchamdiem;
  if (!diem || diem.muctieuthuctap === null || diem.muctieuthuctap === undefined) {
    return {
      status: "pending",
      total: 0,
      label: "Chưa chấm",
      components: { kienthuc: 0, kynang: 0, thaido: 0 },
      raw: null
    };
  }
  const d_thaido = diem.ythuckyluat || 0;      // 2.0
  const d_kienthuc = diem.kienthucthuctien || 0; // 3.0
  const d_kynang = (diem.muctieuthuctap || 0) + (diem.gioithieudonvi || 0) +
    (diem.vitricongviec || 0) + (diem.vandungkienthuc || 0) +
    (diem.phuongphapthuchien || 0) + (diem.yeucaocongviec || 0) +
    (diem.baocaothuctap || 0) + (diem.thuyettrinh || 0) + (diem.traloicauhoi || 0);

  const total = round(d_thaido + d_kienthuc + d_kynang);
  const isPass = total >= 4.0;

  return {
    status: isPass ? "pass" : "fail",
    total: total,
    label: isPass ? "Đạt" : "Không đạt",
    components: {
      thaido: round(d_thaido),
      kienthuc: round(d_kienthuc),
      kynang: round(d_kynang)
    },
    raw: diem
  };
};

const ResultBadge = ({ status, score }: { status: string, score: number }) => {
  if (status === "pending") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 w-fit">
        <FaInfoCircle /> Chưa chấm
      </span>
    );
  }
  const colorClass = status === "pass"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="flex flex-col items-start">
      <span className={`px-3 py-1 rounded-full text-xs font-bold border mb-1 ${colorClass}`}>
        {status === "pass" ? "Đạt yêu cầu" : "Không đạt"}
      </span>
      <span className="text-xs font-bold text-slate-600 ml-1">Điểm: {score}</span>
    </div>
  );
};

const ScoreBox = ({ label, score, max, color, isBig = false }: { label: string, score: any, max: number, color: string, isBig?: boolean }) => {
  const colors: any = {
    purple: "bg-purple-50 border-purple-100 text-purple-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    orange: "bg-orange-50 border-orange-100 text-orange-700",
    green: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };

  return (
    <div className={`flex flex-col justify-between p-3 rounded-xl border ${colors[color]} ${isBig ? "md:col-span-2 lg:col-span-1 ring-1 ring-emerald-200" : ""}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-[11px] font-bold uppercase opacity-80 leading-tight">{label}</span>
        <span className="text-[9px] bg-white/60 px-1.5 rounded font-mono">/{max}</span>
      </div>
      <div className={`font-black ${isBig ? "text-3xl" : "text-2xl"} text-right tracking-tighter`}>
        {score}
      </div>
    </div>
  );
};

const StudentDetailModal = ({ student, madot, onClose }: { student: SinhVien, madot: string, onClose: () => void }) => {
  if (!student) return null;
  const dk = student.dangkythuctap?.find(d => d.madot === madot);
  const diem = dk?.giangvienchamdiem;
  const result = getStudentResult(student, madot);
  const renderScore = (val?: number | null) => (val !== null && val !== undefined) ? val : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-700 to-blue-600 text-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold border border-white/30 shadow-inner">
              {student.hoten ? student.hoten.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-wide">{student.hoten}</h3>
              <p className="text-blue-100 text-sm font-mono opacity-90 flex items-center gap-2">
                <span className="bg-blue-800/50 px-2 py-0.5 rounded text-xs">MSSV: {student.masv}</span>
                <span className="bg-blue-800/50 px-2 py-0.5 rounded text-xs">{student.chuyennganh}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Thông tin */}
            <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FaUserGraduate className="text-blue-600" /> Thông tin thực tập
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div><span className="text-slate-400 text-xs block mb-1">Email</span><span className="font-semibold text-slate-700">{student.email || "---"}</span></div>
                <div><span className="text-slate-400 text-xs block mb-1">SĐT</span><span className="font-semibold text-slate-700">{student.sdt || "---"}</span></div>
                <div><span className="text-slate-400 text-xs block mb-1">Công ty</span><span className="font-bold text-blue-700 flex items-center gap-2"><FaBuilding /> {dk?.macongty || "Chưa có"}</span></div>
                <div><span className="text-slate-400 text-xs block mb-1">Giảng viên HD</span><span className="font-bold text-blue-700 flex items-center gap-2"><FaChalkboardTeacher /> {dk?.magiangvien || "Chưa phân công"}</span></div>
              </div>
            </div>

            {/* Tổng kết */}
            <div className="md:col-span-1">
              <div className={`h-full p-5 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center ${result.status === "pass" ? "bg-emerald-50 border-emerald-200" : result.status === "fail" ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-60">Kết Quả Chung</h4>
                {result.status === "pending" ? (
                  <div className="text-slate-400 italic flex flex-col items-center gap-2"><FaClock size={24} /><span>Chưa có điểm</span></div>
                ) : (
                  <>
                    <div className={`text-6xl font-black mb-1 tracking-tighter ${result.status === "pass" ? "text-emerald-600" : "text-red-500"}`}>{result.total}</div>
                    <div className="text-xs font-bold text-slate-400 mb-4">THANG ĐIỂM 10</div>
                    <span className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm border ${result.status === "pass" ? "bg-emerald-600 text-white border-emerald-600" : "bg-red-600 text-white border-red-600"}`}>{result.label.toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bảng điểm chi tiết */}
          {diem && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="bg-blue-50/50 px-6 py-3 border-b border-blue-100 flex justify-between items-center">
                <h4 className="font-bold text-blue-800 text-sm uppercase flex items-center gap-2"><FaFileExcel /> Bảng điểm chi tiết</h4>
                <span className="text-xs text-blue-500 italic">* 11 Cột điểm thành phần</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <ScoreBox label="Mục tiêu TT" score={renderScore(diem.muctieuthuctap)} max={0.75} color="purple" />
                  <ScoreBox label="Giới thiệu ĐV" score={renderScore(diem.gioithieudonvi)} max={0.75} color="purple" />
                  <ScoreBox label="Vị trí CV" score={renderScore(diem.vitricongviec)} max={0.5} color="purple" />
                  <ScoreBox label="Vận dụng KT" score={renderScore(diem.vandungkienthuc)} max={0.5} color="blue" />
                  <ScoreBox label="PP Thực hiện" score={renderScore(diem.phuongphapthuchien)} max={0.5} color="blue" />
                  <ScoreBox label="Yêu cầu CV" score={renderScore(diem.yeucaocongviec)} max={0.5} color="orange" />
                  <ScoreBox label="Hình thức BC" score={renderScore(diem.baocaothuctap)} max={0.5} color="orange" />
                  <ScoreBox label="Thuyết trình" score={renderScore(diem.thuyettrinh)} max={0.5} color="orange" />
                  <ScoreBox label="Trả lời câu hỏi" score={renderScore(diem.traloicauhoi)} max={0.5} color="orange" />
                  <ScoreBox label="Ý thức (Cty)" score={renderScore(diem.ythuckyluat)} max={2.0} color="green" isBig={true} />
                  <ScoreBox label="Thực tiễn (Cty)" score={renderScore(diem.kienthucthuctien)} max={3.0} color="green" isBig={true} />
                </div>
              </div>
              <div className="bg-slate-50 p-6 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Nhận xét</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 italic">
                  <div className="bg-white p-3 rounded border border-slate-200">"Trình bày: {diem.nhanxettrinhbay || "..."}"</div>
                  <div className="bg-white p-3 rounded border border-slate-200">"Báo cáo: {diem.nhanxetbaocao || "..."}"</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function StudentBatchManagement() {
  const { madot } = useParams<{ madot: string }>();
  const [students, setStudents] = useState<SinhVien[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SinhVien | null>(null);

  // --- Load Data ---
  useEffect(() => {
    if (!madot) return;
    setLoading(true);
    laysinhvientheodot(madot)
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
  const exportExcel = () => {
    if (filteredStudents.length === 0) return alert("Không có dữ liệu để xuất!");

    const workbook = XLSX.utils.book_new();
    const styleTitle = { font: { bold: true, sz: 11, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center" } };
    const styleHeaderTable = { font: { bold: true, sz: 10, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }, fill: { fgColor: { rgb: "E0E0E0" } } };
    const styleCellCenter = { font: { sz: 11, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } };
    const styleCellLeft = { font: { sz: 11, name: "Times New Roman" }, alignment: { horizontal: "left", vertical: "center", wrapText: true }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } };

    // Header Rows
    const row1 = [{ v: "BỘ GIÁO DỤC VÀ ĐÀO TẠO", s: styleTitle }, null, null, null, null, { v: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", s: styleTitle }];
    const row2 = [{ v: "TRƯỜNG ĐẠI HỌC CÔNG THƯƠNG TP. HỒ CHÍ MINH", s: styleTitle }, null, null, null, null, { v: "Độc lập - Tự do - Hạnh phúc", s: { ...styleTitle, font: { ...styleTitle.font, underline: true } } }];
    const rowTitle = [{ v: "BẢNG TỔNG HỢP KẾT QUẢ THỰC TẬP TỐT NGHIỆP", s: { ...styleTitle, font: { ...styleTitle.font, sz: 16 } } }];
    const rowBatch = [{ v: `Đợt: ${madot}`, s: { ...styleTitle, font: { ...styleTitle.font, italic: true } } }];

    // Table Headers
    const headers = ["STT", "Mã SV", "Họ và Tên", "Ngày sinh", "Chuyên ngành", "Đơn vị thực tập",
      "Mục tiêu\n(0.75)", "GT Đơn vị\n(0.75)", "Vị trí\n(0.5)",
      "Vận dụng\n(0.5)", "Phương pháp\n(0.5)",
      "Yêu cầu\n(0.5)", "Báo cáo\n(0.5)", "Thuyết trình\n(0.5)", "Hỏi đáp\n(0.5)",
      "Ý thức\n(2.0)", "Thực tiễn\n(3.0)",
      "TỔNG\n(10.0)", "KẾT QUẢ", "GHI CHÚ"];
    const headerRow = headers.map(h => ({ v: h, s: styleHeaderTable }));

    // Data Rows
    const dataRows = filteredStudents.map((sv, index) => {
      const dk = sv.dangkythuctap?.find(d => d.madot === madot);
      const r = getStudentResult(sv, madot!);
      const diem = r.raw;
      const v = (val: number | undefined | null) => (val !== null && val !== undefined) ? val : "";

      return [
        { v: index + 1, s: styleCellCenter },
        { v: sv.masv, s: styleCellCenter },
        { v: sv.hoten, s: styleCellLeft },
        { v: sv.ngaysinh ? new Date(sv.ngaysinh).toLocaleDateString('vi-VN') : "", s: styleCellCenter },
        { v: sv.chuyennganh || "", s: styleCellCenter },
        { v: dk?.macongty || "", s: styleCellLeft },
        // 11 Cột điểm
        { v: v(diem?.muctieuthuctap), s: styleCellCenter },
        { v: v(diem?.gioithieudonvi), s: styleCellCenter },
        { v: v(diem?.vitricongviec), s: styleCellCenter },
        { v: v(diem?.vandungkienthuc), s: styleCellCenter },
        { v: v(diem?.phuongphapthuchien), s: styleCellCenter },
        { v: v(diem?.yeucaocongviec), s: styleCellCenter },
        { v: v(diem?.baocaothuctap), s: styleCellCenter },
        { v: v(diem?.thuyettrinh), s: styleCellCenter },
        { v: v(diem?.traloicauhoi), s: styleCellCenter },
        { v: v(diem?.ythuckyluat), s: styleCellCenter },
        { v: v(diem?.kienthucthuctien), s: styleCellCenter },
        // Tổng & KQ
        { v: r.total, s: { ...styleCellCenter, font: { bold: true, color: { rgb: "0000FF" } } } },
        { v: r.label, s: { ...styleCellCenter, font: { bold: true, color: { rgb: r.status === "pass" ? "008000" : "FF0000" } } } },
        { v: "", s: styleCellLeft }
      ];
    });

    // Create Sheet
    const ws = XLSX.utils.aoa_to_sheet([row1, row2, [], rowTitle, rowBatch, [], headerRow, ...dataRows]);

    // Config Sheet
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
      { s: { r: 0, c: 5 }, e: { r: 0, c: 10 } }, { s: { r: 1, c: 5 }, e: { r: 1, c: 10 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 19 } }, { s: { r: 4, c: 0 }, e: { r: 4, c: 19 } }
    ];
    ws['!cols'] = [
      { wch: 5 }, { wch: 14 }, { wch: 22 }, { wch: 11 }, { wch: 15 }, { wch: 20 },
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
      { wch: 10 }, { wch: 12 }, { wch: 15 }
    ];
    ws['!rows'] = [{ hpt: 20 }, { hpt: 20 }, { hpt: 10 }, { hpt: 30 }, { hpt: 20 }, { hpt: 10 }, { hpt: 40 }];

    XLSX.utils.book_append_sheet(workbook, ws, "KetQua");
    XLSX.writeFile(workbook, `BangDiem_${madot}_${new Date().toLocaleDateString('vi-VN').replaceAll('/', '-')}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center gap-2">
            <FaUserGraduate className="text-blue-600" /> Quản Lý Sinh Viên & Điểm
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Đợt: <span className="text-blue-600 bg-blue-50 px-2 rounded border border-blue-100 font-bold">{madot}</span></p>
        </div>
        <button onClick={exportExcel} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 font-bold text-sm">
          <FaFileExcel size={18} /> Xuất Báo Cáo
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3 max-w-xl">
        <FaSearch className="text-slate-400" />
        <input type="text" placeholder="Tìm kiếm sinh viên..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-slate-700" />
        {keyword && <button onClick={() => setKeyword("")}><FaTimes className="text-slate-400 hover:text-red-500" /></button>}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.05)] border border-blue-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50/50 border-b border-blue-100 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase w-16 text-center">STT</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Sinh viên</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Liên hệ</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Kết quả</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((sv, index) => {
                    const result = getStudentResult(sv, madot!);
                    return (
                      <tr key={sv.masv} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 text-center text-slate-500 text-sm font-medium">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                              {sv.hoten ? sv.hoten.charAt(0) : "?"}
                            </div>
                            <div><p className="font-bold text-slate-800 text-sm">{sv.hoten}</p><p className="text-xs text-slate-500 font-mono">{sv.masv}</p></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600"><p>{sv.email}</p><p className="text-xs text-slate-400">{sv.sdt}</p></td>
                        <td className="px-6 py-4"><ResultBadge status={result.status} score={result.total} /></td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => setSelectedStudent(sv)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Xem chi tiết">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-sm">Không tìm thấy dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedStudent && (
        <StudentDetailModal student={selectedStudent} madot={madot!} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}