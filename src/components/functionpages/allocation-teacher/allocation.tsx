import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {  GiangVien, SinhVien } from "../../../models/model-all";
import { laygiangviendephanbosv } from "../../../functions/teacher";
import { laydanhsachsinhviendephanbogv } from "../../../functions/student";
import { phanbogiaovienhuongdanthucong, phanbogiaovienhuongdantudong } from "../../../functions/internship-allocation";
import { FaUserGraduate, FaUsers, FaCheckSquare, FaSquare, FaArrowRight, FaSyncAlt, FaInfoCircle, FaSearch } from "react-icons/fa";

export default function InternshipAllocationManagement() {
    const { madot } = useParams<{ madot: string }>();
    const [mode, setMode] = useState<"manual" | "auto">("manual");
    const [students, setStudents] = useState<SinhVien[]>([]);
    const [lecturers, setLecturers] = useState<GiangVien[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedLecturer, setSelectedLecturer] = useState<string | null>(null);
    const [operationInfo, setOperationInfo] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [studentSearch, setStudentSearch] = useState<string>("");
    const [lecturerSearch, setLecturerSearch] = useState<string>("");
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const svRes = await laydanhsachsinhviendephanbogv(madot!);
                setStudents(Array.isArray(svRes) ? svRes : []);
                const gvRes = await laygiangviendephanbosv();
                setLecturers(Array.isArray(gvRes) ? gvRes : []);
            } catch (err) {
                setOperationInfo("Lỗi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [madot]);

    const toggleStudentSelection = (masv: string) => {
        setSelectedStudents((prev) =>
            prev.includes(masv) ? prev.filter((id) => id !== masv) : [...prev, masv]
        );
    };

    const handleAllocate = async () => {
        if (loading) return;
        setLoading(true);
        setOperationInfo("");
        try {
            if (mode === "manual") {
                if (!selectedLecturer || selectedStudents.length === 0) {
                    setOperationInfo("Vui lòng chọn giảng viên và sinh viên.");
                    setLoading(false);
                    return;
                }
                await phanbogiaovienhuongdanthucong(selectedStudents.length, madot!, selectedLecturer, selectedStudents);
                setOperationInfo("Phân bổ thủ công thành công.");
            } else {
                const allStudentIds = students.map((sv) => sv.masv!);
                const allLecturerIds = lecturers.map((gv) => gv.magiangvien!);
                //alert(madot!+ allStudentIds+ allLecturerIds)
                await phanbogiaovienhuongdantudong(madot!, allLecturerIds,allStudentIds);
                setOperationInfo("Phân bổ tự động thành công.");
            }
            // Reset selections
            setSelectedStudents([]);
            setSelectedLecturer(null);
        } catch (err) {
            setOperationInfo("Lỗi phân bổ.");
        } finally {
            setLoading(false);
        }
    };

    // Filter students based on search
    const filteredStudents = students.filter((sv) => {
        const keyword = studentSearch.toLowerCase();
        return (
            (sv.masv || "").toLowerCase().includes(keyword) ||
            (sv.hoten || "").toLowerCase().includes(keyword)
        );
    });

    // Filter lecturers based on search
    const filteredLecturers = lecturers.filter((gv) => {
        const keyword = lecturerSearch.toLowerCase();
        return (
            (gv.magiangvien || "").toLowerCase().includes(keyword) ||
            (gv.tengiangvien || "").toLowerCase().includes(keyword)
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            {/* Top: Mode Selection */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                        <FaArrowRight /> Quản Lý Phân Bổ Giảng Viên Hướng Dẫn - Đợt {madot}
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode("manual")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${mode === "manual"
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Thủ Công
                        </button>
                        <button
                            onClick={() => setMode("auto")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${mode === "auto"
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Tự Động
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content: Students Left (Wider), Lecturers Right (Narrower) */}
            <div className="flex gap-6 flex-1">
                {/* Left: Student List (70% width) */}
                <div className="w-3/4 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 flex items-center gap-2">
                        <FaUsers className="text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-800">Danh Sách Sinh Viên ({filteredStudents.length})</h3>
                        {mode === "manual" && <span className="text-sm text-gray-600 ml-auto">Đã chọn: {selectedStudents.length}</span>}
                    </div>
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo mã hoặc tên sinh viên"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="w-full bg-transparent focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[70vh]">
                        {filteredStudents.map((sv) => (
                            <div
                                key={sv.masv}
                                className={`p-3 border-b border-gray-200 flex items-center gap-2 cursor-pointer transition-colors ${selectedStudents.includes(sv.masv!) ? "bg-blue-50" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => mode === "manual" && toggleStudentSelection(sv.masv!)}
                            >
                                {mode === "manual" && (
                                    selectedStudents.includes(sv.masv!) ? <FaCheckSquare className="text-blue-500" /> : <FaSquare className="text-gray-300" />
                                )}
                                <span className="font-medium">{sv.hoten}</span>
                                <span className="text-sm text-gray-500">({sv.masv})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Lecturer List (30% width) */}
                <div className="w-1/4 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 flex items-center gap-2">
                        <FaUserGraduate className="text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-800">Danh Sách Giảng Viên ({filteredLecturers.length})</h3>
                    </div>
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo mã hoặc tên giảng viên"
                                value={lecturerSearch}
                                onChange={(e) => setLecturerSearch(e.target.value)}
                                className="w-full bg-transparent focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[70vh]">
                        {filteredLecturers.map((gv) => (
                            <div
                                key={gv.magiangvien}
                                className={`p-3 border-b border-gray-200 flex items-center gap-2 cursor-pointer transition-colors ${selectedLecturer === gv.magiangvien ? "bg-blue-50" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => mode === "manual" && setSelectedLecturer(gv.magiangvien!)}
                            >
                                {mode === "manual" && (
                                    selectedLecturer === gv.magiangvien ? <FaCheckSquare className="text-blue-500" /> : <FaSquare className="text-gray-300" />
                                )}
                                <span className="font-medium">{gv.tengiangvien}</span>
                                <span className="text-sm text-gray-500">({gv.magiangvien})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom: Operation Info and Allocate Button */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <FaInfoCircle className="text-blue-500" />
                    <span>{operationInfo || (mode === "manual" ? "Chọn giảng viên và sinh viên để phân bổ." : "Nhấn phân bổ để tự động.")}</span>
                </div>
                <button
                    onClick={handleAllocate}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                    <FaSyncAlt /> Phân Bổ {mode === "manual" ? "Thủ Công" : "Tự Động"}
                </button>
            </div>
        </div>
    );
}