import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { GiangVien, SinhVien } from "../../../models/model-all";
import { laygiangviendephanbosv } from "../../../functions/teacher";
import { laydanhsachsinhviendephanbogv } from "../../../functions/student";
import {
    phanbogiaovienhuongdanthucong,
    phanbogiaovienhuongdantudong,
    phanbogiaovienhuongdantudong_preview // Import hàm preview
} from "../../../functions/internship-allocation";
import {
    FaUserGraduate, FaChalkboardTeacher, FaSearch, FaMagic,
    FaHandPointer, FaBuilding, FaEnvelope,
    FaCheckCircle, FaExclamationCircle, FaExchangeAlt, FaArrowLeft, FaSave, FaRandom
} from "react-icons/fa";

// Component con: Badge hiển thị ID
const IDBadge = ({ id, color = "blue" }: { id: string, color?: "blue" | "purple" | "gray" }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${color === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" :
            color === "purple" ? "bg-purple-50 text-purple-700 border-purple-200" :
                "bg-slate-100 text-slate-600 border-slate-300"
        }`}>
        {id}
    </span>
);

export default function InternshipAllocationManagement() {
    const { madot } = useParams<{ madot: string }>();
    const [mode, setMode] = useState<"manual" | "auto">("manual");
    const [students, setStudents] = useState<SinhVien[]>([]);
    const [lecturers, setLecturers] = useState<GiangVien[]>([]);

    // Selection States (Manual)
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedLecturer, setSelectedLecturer] = useState<string | null>(null);

    // Preview State (Auto)
    const [previewData, setPreviewData] = useState<{
        assignments: Record<string, string[]>;
        quota: Record<string, number>;
    } | null>(null);

    // UI States
    const [loading, setLoading] = useState(false);
    const [studentSearch, setStudentSearch] = useState<string>("");
    const [lecturerSearch, setLecturerSearch] = useState<string>("");
    const [message, setMessage] = useState<{ type: "success" | "error" | "info" | null, text: string }>({ type: null, text: "" });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [svRes, gvRes] = await Promise.all([
                    laydanhsachsinhviendephanbogv(madot!),
                    laygiangviendephanbosv()
                ]);
                setStudents(Array.isArray(svRes) ? svRes : []);
                setLecturers(Array.isArray(gvRes) ? gvRes : []);
            } catch (err) {
                setMessage({ type: "error", text: "Lỗi tải dữ liệu từ máy chủ." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [madot]);

    // --- LOGIC XỬ LÝ DỮ LIỆU ---

    // Map dữ liệu để dùng chung cho cả Preview và Save
    const getMappedData = () => {
        const mappedLecturers = lecturers.map(gv => ({
            magiangvien: gv.magiangvien!,
            listCongTy: gv.gioithieucongty?.map(gt => gt.macongty) || []
        }));

        const mappedStudents = students.map(sv => {
            const dangKy = sv.dangkythuctap?.find(dk => dk.madot === madot);
            return {
                masv: sv.masv!,
                macongty: dangKy?.macongty || ""
            };
        }).filter(s => s.macongty !== "");

        return { mappedLecturers, mappedStudents };
    };

    // Hàm thực hiện xem trước
    const handlePreview = () => {
        try {
            const { mappedLecturers, mappedStudents } = getMappedData();
            
            if (mappedStudents.length === 0 || mappedLecturers.length === 0) {
                 setMessage({ type: "error", text: "Dữ liệu không đủ để phân bổ (thiếu sinh viên có công ty hoặc giảng viên)." });
                 return;
            }

            const result = phanbogiaovienhuongdantudong_preview(madot!, mappedLecturers, mappedStudents);

            if (result.result) {
                setPreviewData({
                    assignments: result.assignments,
                    quota: result.quota || {}
                });
                setMessage({ type: "info", text: "Đang hiển thị bản xem trước. Dữ liệu chưa được lưu." });
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        }
    };

    // Hàm lưu chính thức (Auto)
    const handleSaveAuto = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { mappedLecturers, mappedStudents } = getMappedData();
            await phanbogiaovienhuongdantudong(madot!, mappedLecturers, mappedStudents);
            setMessage({ type: "success", text: "Đã lưu kết quả phân bổ tự động thành công!" });
            setPreviewData(null); // Reset preview
            
            // Reload data
            const svRes = await laydanhsachsinhviendephanbogv(madot!);
            setStudents(Array.isArray(svRes) ? svRes : []);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Lỗi khi lưu phân bổ." });
        } finally {
            setLoading(false);
        }
    };

    // Hàm lưu thủ công
    const handleSaveManual = async () => {
        if (loading || !selectedLecturer || selectedStudents.length === 0) return;
        setLoading(true);
        try {
            await phanbogiaovienhuongdanthucong(selectedStudents.length, madot!, selectedLecturer, selectedStudents);
            setMessage({ type: "success", text: `Đã phân bổ thành công ${selectedStudents.length} sinh viên.` });
            setSelectedStudents([]);
             // Reload data
             const svRes = await laydanhsachsinhviendephanbogv(madot!);
             setStudents(Array.isArray(svRes) ? svRes : []);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    // --- HELPERS ---
    const toggleStudentSelection = (masv: string) => {
        setSelectedStudents((prev) => prev.includes(masv) ? prev.filter((id) => id !== masv) : [...prev, masv]);
    };

    const selectAllStudents = () => {
        if (selectedStudents.length === filteredStudents.length) setSelectedStudents([]);
        else setSelectedStudents(filteredStudents.map(s => s.masv));
    };

    // --- FILTERS ---
    const filteredStudents = useMemo(() => students.filter((sv) => {
        const keyword = studentSearch.toLowerCase();
        return (sv.masv || "").toLowerCase().includes(keyword) || (sv.hoten || "").toLowerCase().includes(keyword);
    }), [students, studentSearch]);

    const filteredLecturers = useMemo(() => lecturers.filter((gv) => {
        const keyword = lecturerSearch.toLowerCase();
        return (gv.magiangvien || "").toLowerCase().includes(keyword) || (gv.tengiangvien || "").toLowerCase().includes(keyword);
    }), [lecturers, lecturerSearch]);


    // --- RENDER SECTIONS ---

    const renderManualMode = () => (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]">
             {/* Giữ nguyên code phần Manual Mode như cũ */}
             {/* Cột Sinh viên */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaUserGraduate className="text-blue-600" />
                        <h3 className="font-bold text-slate-700">Sinh Viên ({filteredStudents.length})</h3>
                    </div>
                    <div className="relative w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sinh viên..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <input
                        type="checkbox"
                        checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                        onChange={selectAllStudents}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="w-20">Mã SV</span>
                    <span className="flex-1">Họ Tên & Liên hệ</span>
                    <span className="w-1/3 hidden xl:block">Thông tin thực tập</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredStudents.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">Không tìm thấy sinh viên</div>
                    ) : (
                        filteredStudents.map((sv) => (
                            <div
                                key={sv.masv}
                                onClick={() => toggleStudentSelection(sv.masv!)}
                                className={`flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedStudents.includes(sv.masv!) ? "bg-blue-50 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(sv.masv!)}
                                    readOnly
                                    className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                />
                                <div className="w-20">
                                    <IDBadge id={sv.masv!} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{sv.hoten}</p>
                                    <p className="text-xs text-slate-500 truncate flex items-center gap-2">
                                        <FaEnvelope className="text-[10px]" /> {sv.email}
                                    </p>
                                </div>
                                <div className="w-1/3 hidden xl:block text-xs text-slate-600">
                                    <div className="flex items-center gap-1" title="Công ty thực tập">
                                        <FaBuilding className="text-slate-400" />
                                        <span className="truncate">{(sv as any).dangkythuctap?.find((d:any) => d.madot === madot)?.macongty || "Chưa ĐK"}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Cột Giảng viên */}
            <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaChalkboardTeacher className="text-purple-600" />
                        <h3 className="font-bold text-slate-700">Giảng Viên ({filteredLecturers.length})</h3>
                    </div>
                </div>
                <div className="p-3 bg-white border-b border-slate-200">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Tìm giảng viên..."
                            value={lecturerSearch}
                            onChange={(e) => setLecturerSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredLecturers.map((gv) => (
                         <div
                            key={gv.magiangvien}
                            onClick={() => setSelectedLecturer(gv.magiangvien!)}
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-all ${selectedLecturer === gv.magiangvien
                                    ? "bg-purple-50 border-l-4 border-l-purple-500 shadow-inner"
                                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-800">{gv.tengiangvien}</span>
                                {selectedLecturer === gv.magiangvien && <FaCheckCircle className="text-purple-600" />}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <IDBadge id={gv.magiangvien!} color="purple" />
                            </div>
                            <div className="text-xs text-slate-500 space-y-1">
                                <p className="flex items-center gap-2"><FaEnvelope /> {gv.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAutoMode = () => {
        // --- VIEW 1: PREVIEW RESULT ---
        if (previewData) {
            return (
                <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-700 text-lg">Xem Trước Kết Quả Phân Bổ</h3>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                Đã phân bổ {Object.values(previewData.assignments).flat().length} sinh viên
                            </span>
                        </div>
                        <div className="flex gap-2 text-xs">
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Đúng công ty</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Ngẫu nhiên/Lấp chỗ</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {lecturers.map(gv => {
                                const assignedSvIds = previewData.assignments[gv.magiangvien!] || [];
                                const quota = previewData.quota[gv.magiangvien!] || 0;
                                const gvCompanies = gv.gioithieucongty?.map(c => c.macongty) || [];
                                
                                if (assignedSvIds.length === 0) return null; // Chỉ hiện GV có SV

                                return (
                                    <div key={gv.magiangvien} className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-full">
                                        <div className="p-3 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{gv.tengiangvien}</div>
                                                <div className="text-xs text-slate-500 mt-1">{gv.email}</div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <IDBadge id={gv.magiangvien!} color="purple" />
                                                <span className="text-[10px] mt-1 font-semibold text-slate-400">
                                                    Slot: {assignedSvIds.length}/{quota}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 flex-1 overflow-y-auto max-h-60 custom-scrollbar">
                                            {assignedSvIds.map(svId => {
                                                const sv = students.find(s => s.masv === svId);
                                                const svCompany = (sv as any)?.dangkythuctap?.find((d:any) => d.madot === madot)?.macongty;
                                                const isMatch = gvCompanies.includes(svCompany);

                                                return (
                                                    <div key={svId} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded mb-1 border border-transparent hover:border-slate-100 transition-all group">
                                                        <div className={`w-1 h-8 rounded-full flex-shrink-0 ${isMatch ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.4)]" : "bg-orange-300"}`} title={isMatch ? "Đúng công ty hướng dẫn" : "Phân bổ lấp chỗ trống"}></div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between">
                                                                <span className="font-semibold text-xs text-slate-700">{sv?.hoten || svId}</span>
                                                                <span className="text-[10px] text-slate-400 font-mono">{svId}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                                                                <FaBuilding className={isMatch ? "text-green-500" : "text-slate-300"} />
                                                                <span className="truncate max-w-[120px]">{svCompany || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                        {isMatch && <FaCheckCircle className="text-green-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        // --- VIEW 2: INTRO & INFO ---
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] bg-white rounded-xl shadow border border-slate-200 p-8">
                <div className="max-w-3xl w-full">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                            <FaMagic className="text-4xl text-white animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Phân Bổ Tự Động Thông Minh</h2>
                        <p className="text-slate-500">Hệ thống sẽ tự động tính toán và hiển thị bản xem trước trước khi lưu.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                            <p className="text-blue-600 font-bold uppercase text-xs mb-2">Sinh viên cần phân bổ</p>
                            <p className="text-4xl font-extrabold text-blue-700">
                                {students.filter(s => s.dangkythuctap?.some(d => d.madot === madot)).length}
                            </p>
                            <p className="text-xs text-blue-400 mt-2">Đã đăng ký đợt này</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                            <p className="text-purple-600 font-bold uppercase text-xs mb-2">Giảng viên tham gia</p>
                            <p className="text-4xl font-extrabold text-purple-700">{lecturers.length}</p>
                            <p className="text-xs text-purple-400 mt-2">Sẵn sàng nhận hướng dẫn</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            {/* Header Area */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
                        Phân Bổ Hướng Dẫn - Đợt {madot}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý và gán sinh viên thực tập cho giảng viên</p>
                </div>

                <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm inline-flex">
                    <button
                        onClick={() => { setMode("manual"); setMessage({ type: null, text: "" }); setPreviewData(null); }}
                        className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold transition-all ${mode === "manual" ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        <FaHandPointer /> Thủ công
                    </button>
                    <button
                        onClick={() => { setMode("auto"); setMessage({ type: null, text: "" }); }}
                        className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold transition-all ${mode === "auto" ? "bg-purple-100 text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        <FaMagic /> Tự động
                    </button>
                </div>
            </div>

            {/* Notification Area */}
            {message.text && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" :
                        message.type === "error" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                    {message.type === "success" ? <FaCheckCircle className="text-xl" /> : <FaExclamationCircle className="text-xl" />}
                    <span className="font-medium">{message.text}</span>
                    <button onClick={() => setMessage({ type: null, text: "" })} className="ml-auto hover:opacity-70">&times;</button>
                </div>
            )}

            {/* Content Body */}
            {loading && !students.length ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {mode === "manual" ? renderManualMode() : renderAutoMode()}
                </>
            )}

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-[1920px] mx-auto flex justify-between items-center px-6">
                    <div className="text-sm text-slate-500 hidden md:block">
                        {mode === "manual" ? (
                            <span>Đang chọn: <b className="text-blue-600">{selectedStudents.length}</b> SV và <b className="text-purple-600">{selectedLecturer ? 1 : 0}</b> GV</span>
                        ) : previewData ? (
                            <span>Xem lại kỹ kết quả trước khi lưu. Nhấn <b>Quay lại</b> để hủy.</span>
                        ) : (
                            <span>Hệ thống sẽ thử phân bổ trước khi lưu vào CSDL.</span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Nút Quay lại khi đang xem Preview */}
                        {mode === "auto" && previewData && (
                            <button
                                onClick={() => { setPreviewData(null); setMessage({ type: null, text: "" }); }}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2"
                            >
                                <FaArrowLeft /> Quay lại
                            </button>
                        )}

                        {/* Nút Hành động chính */}
                        <button
                            onClick={mode === "manual" 
                                ? handleSaveManual 
                                : (previewData ? handleSaveAuto : handlePreview)
                            }
                            disabled={loading || (mode === "manual" && (!selectedLecturer || selectedStudents.length === 0))}
                            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-95 flex items-center gap-2 ${loading ? "bg-slate-400 cursor-wait" :
                                    mode === "manual"
                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        : (previewData 
                                            ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-green-500/30"
                                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30")
                                }`}
                        >
                            {loading ? (
                                <>Đang xử lý...</>
                            ) : mode === "manual" ? (
                                <><FaExchangeAlt /> Xác nhận phân bổ</>
                            ) : previewData ? (
                                <><FaSave /> Lưu kết quả này</>
                            ) : (
                                <><FaRandom /> Xem trước phân bổ</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}