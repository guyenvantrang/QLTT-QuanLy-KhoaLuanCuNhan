"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FaBuilding, FaUserGraduate, FaCopy, FaCheck, FaExchangeAlt, FaChartBar, FaMapMarkerAlt } from "react-icons/fa"
import type { SinhVien, CongTyThucTap } from "../../../models/model-all"
import { Laycongtyphanbo } from "../../../functions/company"
import { laysinhvienphanbo, laysinhvientheoid } from "../../../functions/student"
import type { CompanyPayload, StudentPayload } from "../../../models/allocation/add"
import { phanbosinhvien } from "../../../functions/internship-allocation"
import { useParams } from "react-router-dom"
import { Modal, ModalBody, ModalHeader } from "flowbite-react"
import XacthucPhanBoTuDongCard from "./show-allow-by-address"

export default function AllocationPage() {
    const { madot } = useParams<{ madot: string }>();
    const { madotphanbo } = useParams<{ madotphanbo: string }>();
    const [mode, setMode] = useState<"manual" | "auto">("manual")
    const [selectedCompany, setSelectedCompany] = useState<CongTyThucTap | null>(null)
    const [selectedCompanies, setSelectedCompanies] = useState<Record<string, number>>({})
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [lastCheckedIndex, setLastCheckedIndex] = useState<number | null>(null)
    const [sinhvien, setSinhvien] = useState<SinhVien[]>([])
    const [congty, setCongty] = useState<CongTyThucTap[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [allocationData, setAllocationData] = useState<any>(null)
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [modalPayload, setModalPayload] = useState<{
        studentsPayload: StudentPayload[];
        companiesPayload: CompanyPayload[];
    } | null>(null);

    // Load công ty
    useEffect(() => {
        Laycongtyphanbo()
            .then((res) => setCongty(res || []))
            .catch((err) => console.error("Lỗi tải dữ liệu công ty:", err))
    }, [])

    // Load sinh viên
    useEffect(() => {
        laysinhvienphanbo(madot || "", madotphanbo || "")
            .then((res) => setSinhvien(res || []))
            .catch((err) => console.error("Lỗi tải dữ liệu sinh viên:", err))
    }, [])

    // Cập nhật allocationData khi chọn sinh viên/công ty
    useEffect(() => {
        if (mode === "manual" && selectedCompany && selectedStudents.length > 0) {
            const data = {
                mode: "manual",
                company: selectedCompany,
                students: selectedStudents.map((masv) => sinhvien.find((s) => s.masv === masv)),
                timestamp: new Date().toISOString(),
            }
            setAllocationData(data)
        } else if (mode === "auto" && Object.keys(selectedCompanies).length > 0) {
            const companies = Object.entries(selectedCompanies).map(([macongty, quantity]) => ({
                company: congty.find((c) => c.macongty === macongty),
                quantity,
            }))

            const data = {
                mode: "auto",
                allocationType: null,
                companies,
                totalStudents: Object.values(selectedCompanies).reduce((a, b) => a + b, 0),
                timestamp: new Date().toISOString(),
            }
            setAllocationData(data)
        } else {
            setAllocationData(null)
        }
    }, [mode, selectedCompany, selectedCompanies, selectedStudents, sinhvien, congty])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const toggleStudent = (index: number, masv: string, event: React.MouseEvent<HTMLInputElement>) => {
        if (event.nativeEvent.shiftKey && lastCheckedIndex !== null) {
            const start = Math.min(lastCheckedIndex, index)
            const end = Math.max(lastCheckedIndex, index)
            const newSelected = [...selectedStudents]
            for (let i = start; i <= end; i++) {
                const id = sinhvien[i].masv
                if (!newSelected.includes(id)) newSelected.push(id)
            }
            setSelectedStudents(newSelected)
        } else {
            setSelectedStudents((prev) => (prev.includes(masv) ? prev.filter((s) => s !== masv) : [...prev, masv]))
        }
        setLastCheckedIndex(index)
    }

    const selectAllStudents = () => {
        setSelectedStudents(sinhvien.map((s) => s.masv))
    }

    const deselectAllStudents = () => {
        setSelectedStudents([])
    }

    const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            selectAllStudents()
        } else {
            deselectAllStudents()
        }
    }

    const handleManualAllocate = () => {
        if (!selectedCompany || selectedStudents.length === 0) return
        // Preview tự động cập nhật thông qua useEffect
    }

    const handleAutoAllocate = (type: "address" | "score") => {
        if (allocationData) {
            const updatedData = {
                ...allocationData,
                allocationType: type,
            }
            setAllocationData(updatedData)
        }
    }

    const isAllStudentsSelected = selectedStudents.length === sinhvien.length && sinhvien.length > 0

    const handleSubmitAllocation = async () => {
        if (mode === "manual") {
            // Gửi thủ công
            phanbosinhvien(
                madot || "",
                madotphanbo || "",
                allocationData.company.macongty,
                allocationData.students.map((s: SinhVien) => s.masv)
            )
        } else if (mode === "auto" && allocationData.allocationType === "address") {
            // Lấy thông tin đầy đủ sinh viên trước khi gửi modal
            const fullStudents: SinhVien[] = await Promise.all(
                selectedStudents.map(async (masv) => {
                    const sv = await laysinhvientheoid(masv);
                    return sv!; // loại bỏ undefined
                })
            );


            const studentsPayload: StudentPayload[] = fullStudents.map((s) => ({
                masv: s.masv,
                diachi: s.diachi || "",
                lat:s.lat,
                long:s.long
            }));

            const companiesPayload: CompanyPayload[] = Object.entries(selectedCompanies)
                .map(([macongty, quantity]) => {
                    const company = congty.find(c => c.macongty === macongty);
                    if (!company) return undefined;
                    return {
                        macongty: company.macongty,
                        diachi: company.diachi || "",
                        soluong: quantity,
                        lat:company.lat,
                        long:company.long
                    };
                })
                .filter((c): c is CompanyPayload => !!c);

            setUpdateModalOpen(true);
            setModalPayload({ studentsPayload, companiesPayload });
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Phân bổ sinh viên thực tập</h1>
                            <p className="text-slate-600 mt-1">Quản lý và phân công sinh viên đến các công ty</p>
                        </div>

                        <div className="flex gap-3 bg-slate-100 p-1.5 rounded-lg shadow-sm">
                            <button
                                className={`px-6 py-2.5 rounded-md font-semibold transition-all duration-200 ${mode === "manual"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                                    }`}
                                onClick={() => {
                                    setMode("manual")
                                    setSelectedStudents([])
                                }}
                            >
                                Phân bổ thủ công
                            </button>
                            <button
                                className={`px-6 py-2.5 rounded-md font-semibold transition-all duration-200 ${mode === "auto"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                                    }`}
                                onClick={() => {
                                    setMode("auto")
                                    setSelectedStudents([])
                                }}
                            >
                                Phân bổ tự động
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-6 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={selectAllStudents}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                            >
                                ✓ Chọn tất cả
                            </button>
                            <button
                                onClick={deselectAllStudents}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                            >
                                ✗ Bỏ chọn tất cả
                            </button>
                        </div>

                        <div className="flex-1" />

                        {mode === "manual" ? (
                            <button
                                onClick={handleManualAllocate}
                                disabled={!selectedCompany || selectedStudents.length === 0}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${selectedCompany && selectedStudents.length > 0
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    }`}
                            >
                                <FaExchangeAlt className="text-sm" />
                                Phân bổ ({selectedStudents.length} SV)
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAutoAllocate("address")}
                                    disabled={Object.keys(selectedCompanies).length === 0}
                                    className={`px-5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${Object.keys(selectedCompanies).length > 0
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        }`}
                                >
                                    <FaMapMarkerAlt />
                                    Phân theo địa chỉ
                                </button>
                                <button
                                    onClick={() => handleAutoAllocate("score")}
                                    disabled={Object.keys(selectedCompanies).length === 0}
                                    className={`px-5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${Object.keys(selectedCompanies).length > 0
                                        ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        }`}
                                >
                                    <FaChartBar />
                                    Phân theo điểm số
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Left Panel - Companies */}
                    <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-3">
                                <FaBuilding className="text-blue-200 text-lg" />
                                Danh sách công ty
                            </h2>
                            <p className="text-blue-100 text-sm mt-2">
                                {mode === "auto" ? "Chọn công ty và nhập số lượng SV" : "Click để chọn công ty"}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {congty.map((c) => (
                                <div
                                    key={c.macongty}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${mode === "manual" && selectedCompany?.macongty === c.macongty
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                                        }`}
                                    onClick={() => mode === "manual" && setSelectedCompany(c)}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{c.tencongty}</h3>

                                            {mode === "manual" && selectedCompany?.macongty === c.macongty && (
                                                <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-300 flex items-center justify-between group">
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-medium">Mã công ty</p>
                                                        <p className="font-mono font-bold text-blue-700 text-sm">{c.macongty}</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            copyToClipboard(c.macongty, c.macongty)
                                                        }}
                                                        className="text-slate-400 hover:text-blue-600 transition-colors p-2"
                                                        title="Copy mã công ty"
                                                    >
                                                        {copiedId === c.macongty ? <FaCheck className="text-green-600" /> : <FaCopy />}
                                                    </button>
                                                </div>
                                            )}

                                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.diachi}</p>
                                            <div className="flex gap-2 mt-2 flex-wrap text-xs">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                                                    {c.phanloai}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">{c.hoatdong}</span>
                                            </div>
                                        </div>

                                        {mode === "auto" && (
                                            <div className="flex flex-col items-center gap-2 pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCompanies[c.macongty] > 0}
                                                    onChange={(e) => {
                                                        e.stopPropagation()
                                                        const checked = e.target.checked
                                                        setSelectedCompanies((prev) => {
                                                            const copy = { ...prev }
                                                            if (checked) copy[c.macongty] = copy[c.macongty] || 1
                                                            else delete copy[c.macongty]
                                                            return copy
                                                        })
                                                    }}
                                                    className="w-5 h-5 cursor-pointer accent-emerald-600"
                                                />
                                                {selectedCompanies[c.macongty] > 0 && (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={999}
                                                        value={selectedCompanies[c.macongty]}
                                                        onChange={(e) => {
                                                            e.stopPropagation()
                                                            const val = Number.parseInt(e.target.value) || 0
                                                            if (val > 0) {
                                                                setSelectedCompanies((prev) => ({
                                                                    ...prev,
                                                                    [c.macongty]: val,
                                                                }))
                                                            }
                                                        }}
                                                        className="w-14 px-2 py-1 border border-emerald-400 rounded text-sm text-center font-bold bg-emerald-50 text-emerald-700"
                                                        placeholder="SL"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Company Stats */}
                        {mode === "auto" && Object.keys(selectedCompanies).length > 0 && (
                            <div className="border-t border-slate-200 bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-600 font-medium">Công ty chọn</p>
                                        <p className="text-xl font-bold text-emerald-700">{Object.keys(selectedCompanies).length}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-600 font-medium">Tổng SV</p>
                                        <p className="text-xl font-bold text-emerald-700">
                                            {Object.values(selectedCompanies).reduce((a, b) => a + b, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle Panel - Students */}
                    <div className="w-2/5 flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-3">
                                <FaUserGraduate className="text-emerald-100 text-lg" />
                                Danh sách sinh viên
                            </h2>
                            <p className="text-emerald-100 text-sm mt-2">
                                Đã chọn:{" "}
                                <span className="font-bold">
                                    {selectedStudents.length}/{sinhvien.length}
                                </span>
                            </p>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-100 border-b border-slate-200 sticky top-0">
                                    <tr className="hover:bg-slate-100">
                                        <th className="px-3 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={isAllStudentsSelected}
                                                onChange={handleToggleAll}
                                                className="w-4 h-4 accent-emerald-600"
                                            />
                                        </th>
                                        <th className="px-3 py-3 text-left font-bold text-slate-700">Mã SV</th>
                                        <th className="px-3 py-3 text-left font-bold text-slate-700">Họ tên</th>
                                        <th className="px-3 py-3 text-left font-bold text-slate-700">Email</th>
                                        <th className="px-3 py-3 text-left font-bold text-slate-700">Ngày sinh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sinhvien.map((s, i) => (
                                        <tr
                                            key={s.masv}
                                            className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${selectedStudents.includes(s.masv) ? "bg-blue-50" : ""
                                                }`}
                                        >
                                            <td className="px-3 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(s.masv)}
                                                    onClick={(e) => toggleStudent(i, s.masv, e)}
                                                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-3 py-3 font-mono font-semibold text-blue-700 text-xs">{s.masv}</td>
                                            <td className="px-3 py-3 font-medium text-slate-900">{s.hoten}</td>
                                            <td className="px-3 py-3 text-slate-600 truncate">{s.email}</td>
                                            <td className="px-3 py-3 text-slate-600">{s.ngaysinh}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Panel - Data Preview */}
                    <div className="w-1/4 flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white">Dữ liệu đang thực hiện</h2>
                            <p className="text-purple-100 text-xs mt-1">Xem trước dữ liệu trước khi gửi API</p>
                        </div>

                        {allocationData ? (
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Mode Info */}
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <p className="text-xs font-bold text-slate-600 mb-1">Chế độ</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {allocationData.mode === "manual" ? "Phân bổ thủ công" : "Phân bổ tự động"}
                                    </p>
                                </div>

                                {/* Manual Mode */}
                                {allocationData.mode === "manual" && (
                                    <>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <p className="text-xs font-bold text-blue-700 mb-1">Công ty</p>
                                            <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                                                {allocationData.company.tencongty}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1 font-mono">{allocationData.company.macongty}</p>
                                        </div>

                                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                            <p className="text-xs font-bold text-emerald-700 mb-2">
                                                Sinh viên ({allocationData.students.length})
                                            </p>
                                            <div className="space-y-1">
                                                {allocationData.students.slice(0, 5).map((s: SinhVien) => (
                                                    <div key={s.masv} className="text-xs text-slate-700 p-1 bg-white rounded">
                                                        <span className="font-mono font-bold text-blue-700">{s.masv}</span> - {s.hoten}
                                                    </div>
                                                ))}
                                                {allocationData.students.length > 5 && (
                                                    <p className="text-xs text-slate-500 italic pt-1">
                                                        ... và {allocationData.students.length - 5} sinh viên khác
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Auto Mode */}
                                {allocationData.mode === "auto" && (
                                    <>
                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                            <p className="text-xs font-bold text-purple-700 mb-1">Kiểu phân bổ</p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {allocationData.allocationType === "address" ? "Phân theo địa chỉ" : "Phân theo điểm số"}
                                            </p>
                                        </div>

                                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                            <p className="text-xs font-bold text-amber-700 mb-2">
                                                Công ty ({allocationData.companies.length})
                                            </p>
                                            <div className="space-y-2">
                                                {allocationData.companies.map((item: any) => (
                                                    <div
                                                        key={item.company.macongty}
                                                        className="text-xs bg-white p-2 rounded border border-amber-100"
                                                    >
                                                        <p className="font-mono font-bold text-blue-700">{item.company.macongty}</p>
                                                        <p className="text-slate-700">{item.company.tencongty}</p>
                                                        <p className="text-amber-700 font-bold mt-1">SV: {item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-slate-100 p-3 rounded-lg">
                                            <p className="text-xs font-bold text-slate-600">Tổng SV</p>
                                            <p className="text-2xl font-bold text-slate-900">{allocationData.totalStudents}</p>
                                        </div>
                                    </>
                                )}

                                {/* Timestamp */}
                                <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
                                    <p>Cập nhật: {new Date(allocationData.timestamp).toLocaleString("vi-VN")}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-slate-200">
                                    <button
                                        onClick={handleSubmitAllocation}
                                        className="flex-1 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors">
                                        Gửi API
                                    </button>
                                    <Modal
                                        show={updateModalOpen}
                                        onClose={() => setUpdateModalOpen(false)}
                                        size="5xl"
                                        dismissible={false}
                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                                    >
                                        <ModalHeader>Cập nhật phân bố</ModalHeader>
                                        <ModalBody className="bg-gray-50 p-1 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                                            {modalPayload && (
                                                <XacthucPhanBoTuDongCard
                                                    onClose={() => setUpdateModalOpen(false)}
                                                    students={modalPayload.studentsPayload}
                                                    companies={modalPayload.companiesPayload}
                                                    madot={madot || ""}
                                                    madotphanbo={madotphanbo || ""}
                                                />
                                            )}
                                        </ModalBody>
                                    </Modal>

                                    <button
                                        onClick={() => setAllocationData(null)}
                                        className="flex-1 px-3 py-2 bg-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-400 transition-colors"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-4">
                                <div className="text-center">
                                    <p className="text-slate-400 text-sm">Chưa có dữ liệu</p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Chọn công ty và sinh viên,
                                        <br />
                                        sau đó nhấn nút phân bổ
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
