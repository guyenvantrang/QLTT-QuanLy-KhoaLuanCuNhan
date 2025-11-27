"use client";

import React, { useEffect, useState } from "react";
import { 
    FaBuilding, FaUserGraduate, FaCopy, FaCheck, FaExchangeAlt, 
    FaMapMarkerAlt, FaBookOpen, FaLayerGroup, FaSearch 
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";

// --- Models ---
import type { SinhVien, CongTyThucTap } from "../../../models/model-all";
import type { CompanyPayload, StudentPayload, CompanychuyennganhPayload, StudentchuyennganhPayload } from "../../../models/allocation/add";

// --- Functions ---
import { Laycongtyphanbo } from "../../../functions/company";
import { laysinhvienphanbo, laysinhvientheoid } from "../../../functions/student";
import { phanbosinhvien } from "../../../functions/internship-allocation";

// --- Components ---
import XacthucPhanBoTuDongCard from "./show-allow-by-address";
import XacthucPhanBoTuDongChuyenNganhCard from "./show-allow-by-chuyennganh";

export default function AllocationPage() {
    // --- Params & State ---
    const { madot } = useParams<{ madot: string }>();
    const { madotphanbo } = useParams<{ madotphanbo: string }>();

    // Modes: manual (thủ công), auto (tự động)
    const [mode, setMode] = useState<"manual" | "auto">("manual");
    
    // Auto Sub-modes: address (địa chỉ), specialty (chuyên ngành)
    const [autoType, setAutoType] = useState<"address" | "specialty" | null>(null);

    // Data State
    const [sinhvien, setSinhvien] = useState<SinhVien[]>([]);
    const [congty, setCongty] = useState<CongTyThucTap[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Selection State
    const [selectedCompany, setSelectedCompany] = useState<CongTyThucTap | null>(null);
    const [selectedCompanies, setSelectedCompanies] = useState<Record<string, number>>({});
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [lastCheckedIndex, setLastCheckedIndex] = useState<number | null>(null);

    // UI State
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    // Payload cho Modal Address
    const [addressPayload, setAddressPayload] = useState<{
        students: StudentPayload[];
        companies: CompanyPayload[];
    } | null>(null);
    // Payload cho Modal Specialty
    const [specialtyPayload, setSpecialtyPayload] = useState<{
        students: StudentchuyennganhPayload[];
        companies: CompanychuyennganhPayload[];
    } | null>(null);

    // --- Effects ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resCompanies, resStudents] = await Promise.all([
                    Laycongtyphanbo(),
                    laysinhvienphanbo(madot || "", madotphanbo || "")
                ]);
                setCongty(resCompanies || []);
                setSinhvien(resStudents || []);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [madot, madotphanbo]);

    // --- Helper Functions ---
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleStudent = (index: number, masv: string, event: React.MouseEvent<HTMLInputElement>) => {
        if (event.nativeEvent.shiftKey && lastCheckedIndex !== null) {
            const start = Math.min(lastCheckedIndex, index);
            const end = Math.max(lastCheckedIndex, index);
            const newSelected = new Set(selectedStudents);
            
            // Filtered list to respect current view
            const visibleStudents = filteredStudents();
            
            for (let i = start; i <= end; i++) {
                 // Note: Logic này đúng nếu không filter. Nếu filter cần map qua filtered list.
                 // Để đơn giản, ta lấy theo index của full list nếu không search, hoặc cải tiến sau.
                 if(sinhvien[i]) newSelected.add(sinhvien[i].masv);
            }
            setSelectedStudents(Array.from(newSelected));
        } else {
            setSelectedStudents((prev) => 
                prev.includes(masv) ? prev.filter((s) => s !== masv) : [...prev, masv]
            );
        }
        setLastCheckedIndex(index);
    };

    const handleSelectAll = () => setSelectedStudents(sinhvien.map(s => s.masv));
    const handleDeselectAll = () => setSelectedStudents([]);

    const handleCompanyQuantityChange = (macongty: string, val: number) => {
        if (val > 0) {
            setSelectedCompanies(prev => ({ ...prev, [macongty]: val }));
        } else {
            const newState = { ...selectedCompanies };
            delete newState[macongty];
            setSelectedCompanies(newState);
        }
    };

    const filteredStudents = () => {
        return sinhvien.filter(s => 
            s.hoten?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.masv.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // --- Action Handlers ---

    // 1. Phân bổ thủ công
    const handleSubmitManual = async () => {
        if (!selectedCompany || selectedStudents.length === 0) return;
        try {
            await phanbosinhvien(
                madot || "",
                madotphanbo || "",
                selectedCompany.macongty,
                selectedStudents
            );
            alert("Phân bổ thủ công thành công!");
            // Reset selection after success
            setSelectedStudents([]);
        } catch (error: any) {
            alert(error.message || "Có lỗi xảy ra");
        }
    };

    // 2. Chuẩn bị dữ liệu và mở Modal (Cho cả Address và Specialty)
    const handlePrepareAutoAllocation = async (type: "address" | "specialty") => {
        setAutoType(type);

        // Validation chung
        const selectedCompanyIds = Object.keys(selectedCompanies);
        if (selectedCompanyIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 công ty và nhập số lượng!");
            return;
        }
        if (selectedStudents.length === 0) {
            alert("Vui lòng chọn danh sách sinh viên cần phân bổ!");
            return;
        }

        // Lấy full data sinh viên đã chọn
        const fullStudents = sinhvien.filter(s => selectedStudents.includes(s.masv));
        
        // Lấy full data công ty đã chọn
        const targetCompanies = congty.filter(c => selectedCompanyIds.includes(c.macongty));

        if (type === "address") {
            // Mapping Address Payload
            const studentsPL: StudentPayload[] = await Promise.all(
                fullStudents.map(async (s) => {
                    // Nếu cần gọi API chi tiết thì gọi, ở đây dùng data có sẵn để nhanh
                    // const detail = await laysinhvientheoid(s.masv); 
                    return {
                        masv: s.masv,
                        diachi: s.diachi || "",
                        lat: s.lat,
                        long: s.long
                    };
                })
            );

            const companiesPL: CompanyPayload[] = targetCompanies.map(c => ({
                macongty: c.macongty,
                diachi: c.diachi || "",
                lat: c.lat,
                long: c.long,
                soluong: selectedCompanies[c.macongty]
            }));

            setAddressPayload({ students: studentsPL, companies: companiesPL });
            setModalOpen(true);

        } else if (type === "specialty") {
            // Mapping Specialty Payload
            const studentsPL: StudentchuyennganhPayload[] = fullStudents.map(s => ({
                masv: s.masv,
                // Giả sử model SinhVien có trường chuyennganh. Nếu không, phải gọi API detail.
                chuyennganh: (s as any).chuyennganh || "Chưa xác định" 
            }));

            const companiesPL: CompanychuyennganhPayload[] = targetCompanies.map(c => ({
                macongty: c.macongty,
                // Map linhvuc của công ty sang chuyennganh
                chuyennganh: c.linhvuc || "Chưa xác định",
                soluong: selectedCompanies[c.macongty]
            }));

            setSpecialtyPayload({ students: studentsPL, companies: companiesPL });
            setModalOpen(true);
        }
    };

    // --- Render Components ---

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <header className="bg-white border-b border-blue-200 shadow-sm z-20 sticky top-0">
                <div className="max-w-[1920px] mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <FaLayerGroup size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Phân Bổ Thực Tập</h1>
                            <p className="text-sm text-slate-500">Quản lý đợt: <span className="font-mono font-medium text-blue-600">{madot}</span></p>
                        </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
                        <button
                            onClick={() => { setMode("manual"); setSelectedStudents([]); }}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                mode === "manual" 
                                ? "bg-white text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.15)] border border-blue-100" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <FaExchangeAlt /> Thủ Công
                        </button>
                        <button
                            onClick={() => { setMode("auto"); setSelectedStudents([]); }}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                mode === "auto" 
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <FaCheck /> Tự Động
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden p-6 max-w-[1920px] mx-auto w-full flex gap-6">
                
                {/* COL 1: COMPANIES LIST */}
                <section className={`w-1/4 flex flex-col bg-white rounded-2xl border transition-all duration-300 shadow-lg overflow-hidden
                    ${mode === 'auto' ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-200'}`}>
                    
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <FaBuilding className="text-blue-500" />
                            {mode === 'manual' ? "Chọn 1 Công ty" : "Chọn Công ty & Chỉ tiêu"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {mode === 'manual' ? "Click để chọn công ty đích" : "Tích chọn và nhập số lượng SV"}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? <div className="text-center py-10">Đang tải...</div> : congty.map((c) => {
                            const isSelected = mode === 'manual' 
                                ? selectedCompany?.macongty === c.macongty
                                : !!selectedCompanies[c.macongty];
                            
                            return (
                                <div 
                                    key={c.macongty}
                                    onClick={() => mode === 'manual' && setSelectedCompany(c)}
                                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group
                                        ${isSelected 
                                            ? "bg-blue-50/80 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                                            : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
                                        }`}
                                >
                                    {/* Auto Mode Checkbox */}
                                    {mode === 'auto' && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <input 
                                                type="checkbox"
                                                checked={!!selectedCompanies[c.macongty]}
                                                onChange={(e) => handleCompanyQuantityChange(c.macongty, e.target.checked ? 1 : 0)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    <div className="pr-8">
                                        <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>
                                            {c.tencongty}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{c.macongty}</span>
                                            <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.macongty, c.macongty); }} 
                                                className="hover:text-blue-600 transition-colors">
                                                {copiedId === c.macongty ? <FaCheck className="text-emerald-500"/> : <FaCopy />}
                                            </button>
                                        </div>
                                        
                                        {/* Hiển thị lĩnh vực cho chế độ chuyên ngành */}
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                                            <span className="font-semibold text-slate-700">Lĩnh vực:</span> {c.linhvuc || "Chưa cập nhật"}
                                        </p>
                                        <p className="text-xs text-slate-400 line-clamp-1 flex items-center gap-1">
                                            <FaMapMarkerAlt size={10}/> {c.diachi}
                                        </p>
                                    </div>

                                    {/* Auto Mode Quantity Input */}
                                    {mode === 'auto' && selectedCompanies[c.macongty] && (
                                        <div className="mt-3 pt-3 border-t border-blue-200/50 flex items-center justify-between animate-fadeIn">
                                            <span className="text-xs font-bold text-blue-600">Chỉ tiêu:</span>
                                            <input 
                                                type="number" 
                                                min="1" max="100"
                                                value={selectedCompanies[c.macongty]}
                                                onChange={(e) => handleCompanyQuantityChange(c.macongty, parseInt(e.target.value) || 0)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-20 px-2 py-1 text-sm text-right font-bold text-blue-700 bg-white border border-blue-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* COL 2: STUDENTS LIST */}
                <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <FaUserGraduate className="text-emerald-500" />
                                Danh sách Sinh viên
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Đã chọn: <span className="font-bold text-blue-600 text-sm">{selectedStudents.length}</span> / {sinhvien.length}
                            </p>
                        </div>
                        
                        {/* Search & Tools */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm sinh viên..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-4 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-1 bg-slate-200 p-1 rounded-lg">
                                <button onClick={handleSelectAll} className="px-3 py-1 text-xs font-medium bg-white rounded shadow-sm hover:text-blue-600">All</button>
                                <button onClick={handleDeselectAll} className="px-3 py-1 text-xs font-medium hover:bg-white hover:rounded hover:shadow-sm hover:text-red-600 transition-all">None</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 font-bold uppercase text-xs">
                                <tr>
                                    <th className="w-10 px-4 py-3 text-center">#</th>
                                    <th className="px-4 py-3">Mã SV</th>
                                    <th className="px-4 py-3">Họ Tên</th>
                                    <th className="px-4 py-3">Chuyên Ngành</th>
                                    <th className="px-4 py-3">Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents().map((s, idx) => {
                                    const isChecked = selectedStudents.includes(s.masv);
                                    return (
                                        <tr 
                                            key={s.masv} 
                                            onClick={(e) => toggleStudent(idx, s.masv, e as any)}
                                            className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${isChecked ? 'bg-blue-50' : ''}`}
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isChecked}
                                                    onChange={() => {}} // Handle by TR click
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-mono text-blue-600 font-medium">{s.masv}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">{s.hoten}</td>
                                            <td className="px-4 py-3 text-slate-500">
                                                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">
                                                    {(s as any).chuyennganh || "CNTT"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{s.ngaysinh?.split('T')[0]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredStudents().length === 0 && (
                            <div className="p-8 text-center text-slate-400">Không tìm thấy sinh viên nào.</div>
                        )}
                    </div>
                </section>

                {/* COL 3: ACTION PANEL */}
                <section className="w-1/4 flex flex-col gap-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h2 className="text-white font-bold text-lg">Bảng Điều Khiển</h2>
                            <p className="text-blue-100 text-xs mt-1">Chế độ: {mode === 'manual' ? 'Thủ công' : 'Tự động'}</p>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            {/* Manual Info */}
                            {mode === 'manual' && (
                                <div className="space-y-3">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <p className="text-xs text-blue-500 font-bold uppercase mb-1">Công ty đích</p>
                                        {selectedCompany ? (
                                            <div className="font-bold text-slate-800 text-sm">{selectedCompany.tencongty}</div>
                                        ) : (
                                            <div className="text-slate-400 text-sm italic">Chưa chọn công ty</div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={handleSubmitManual}
                                        disabled={!selectedCompany || selectedStudents.length === 0}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2"
                                    >
                                        <FaExchangeAlt /> Xác Nhận Phân Bổ
                                    </button>
                                </div>
                            )}

                            {/* Auto Info & Actions */}
                            {mode === 'auto' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center">
                                            <div className="text-xl font-bold text-emerald-600">{Object.keys(selectedCompanies).length}</div>
                                            <div className="text-xs text-emerald-500 font-bold uppercase">Công ty</div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-center">
                                            <div className="text-xl font-bold text-purple-600">
                                                {Object.values(selectedCompanies).reduce((a,b)=>a+b, 0)}
                                            </div>
                                            <div className="text-xs text-purple-500 font-bold uppercase">Tổng Chỉ tiêu</div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 my-2"></div>

                                    <p className="text-xs text-slate-400 text-center mb-2">Chọn phương thức phân bổ tự động</p>
                                    
                                    <button 
                                        onClick={() => handlePrepareAutoAllocation("address")}
                                        className="w-full py-3 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <FaMapMarkerAlt /> Theo Địa Chỉ
                                    </button>
                                    
                                    <button 
                                        onClick={() => handlePrepareAutoAllocation("specialty")}
                                        className="w-full py-3 bg-white border border-indigo-500 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <FaBookOpen /> Theo Chuyên Ngành
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary / Hint */}
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-slate-500 text-xs leading-relaxed">
                        <p className="font-bold mb-1 text-slate-700">Lưu ý:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Chế độ <strong>Tự động</strong> sẽ mở bảng xem trước (Preview) trước khi lưu.</li>
                            <li><strong>Theo chuyên ngành</strong> sẽ ưu tiên khớp <em>Lĩnh vực công ty</em> với <em>Chuyên ngành sinh viên</em>.</li>
                            <li>Đảm bảo dữ liệu Tọa độ (Lat/Long) đầy đủ cho chế độ Địa chỉ.</li>
                        </ul>
                    </div>
                </section>
            </main>

            {/* --- MODALS --- */}
            <Modal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                size="7xl"
                dismissible={false}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                    <ModalHeader className="border-b border-slate-100 px-6 py-4">
                        <span className="text-xl font-bold text-slate-800 flex items-center gap-2">
                           {autoType === 'address' && <FaMapMarkerAlt className="text-emerald-500"/>}
                           {autoType === 'specialty' && <FaBookOpen className="text-indigo-500"/>}
                           Xác nhận Phân bổ Tự động: {autoType === 'address' ? "Theo Địa Chỉ" : "Theo Chuyên Ngành"}
                        </span>
                    </ModalHeader>
                    
                    <ModalBody className="p-0 bg-slate-50 overflow-y-auto custom-scrollbar">
                        <div className="p-6">
                            {autoType === 'address' && addressPayload && (
                                <XacthucPhanBoTuDongCard
                                    onClose={() => setModalOpen(false)}
                                    students={addressPayload.students}
                                    companies={addressPayload.companies}
                                    madot={madot || ""}
                                    madotphanbo={madotphanbo || ""}
                                />
                            )}

                            {autoType === 'specialty' && specialtyPayload && (
                                <XacthucPhanBoTuDongChuyenNganhCard
                                    onClose={() => setModalOpen(false)}
                                    students={specialtyPayload.students}
                                    companies={specialtyPayload.companies}
                                    madot={madot || ""}
                                    madotphanbo={madotphanbo || ""}
                                />
                            )}
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </div>
    );
}