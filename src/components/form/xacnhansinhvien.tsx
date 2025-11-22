import { useEffect, useState } from "react";
import type { SinhVien, PhanBoSinhVien, ChiTietDotPhanBo } from "../../models/model-all";
import { ChuyenDotMoiFunction, LayDanhSachTheoSinhVien, TraLoiPhanHoiFunction, XacNhanRotFunction, XacNhanDau } from "../../functions/internship-allocation";
import { laysinhvientheoid } from "../../functions/student";
import { FaUser, FaBuilding, FaFilePdf, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaExclamationTriangle, FaTimes, FaSpinner, FaArrowRight, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTie, FaClipboardList, FaVenusMars, FaBirthdayCake, FaThumbsUp, FaClock } from "react-icons/fa";
import PdfViewerModal from "./PdfViewerModal";

interface Props {
    masv: string;
    madot: string;
    onClose: () => void;
}

export default function StudentDetailModal({ onClose, masv, madot }: Props) {
    const [phanBoList, setPhanBoList] = useState<PhanBoSinhVien[]>([]);
    const [selectedPhanBo, setSelectedPhanBo] = useState<PhanBoSinhVien | null>(null);
    const [selectedChiTiet, setSelectedChiTiet] = useState<ChiTietDotPhanBo | null>(null);
    const [huongGiaiQuyetMap, setHuongGiaiQuyetMap] = useState<Record<string, string>>({});
    const [studentInfo, setStudentInfo] = useState<SinhVien | null>(null);
    const [loading, setLoading] = useState(true);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Load danh sách phân bố và chi tiết
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const res = await LayDanhSachTheoSinhVien(masv, madot);
            const sortedRes = res ? res.sort((a, b) => new Date(b.ngaytao || "").getTime() - new Date(a.ngaytao || "").getTime()) : [];
            setPhanBoList(sortedRes);
            if (sortedRes.length > 0) {
                setSelectedPhanBo(sortedRes[0]);
                if (sortedRes[0].chitietdotphanbo && sortedRes[0].chitietdotphanbo.length > 0) {
                    setSelectedChiTiet(sortedRes[0].chitietdotphanbo[0]);
                }
            }

            const sv = await laysinhvientheoid(masv);
            setStudentInfo(sv || null);
            setLoading(false);
        }
        fetchData();
    }, [masv]);

    const handlePhanBoChange = (phanbo: PhanBoSinhVien) => {
        setSelectedPhanBo(phanbo);
        if (phanbo.chitietdotphanbo && phanbo.chitietdotphanbo.length > 0) {
            setSelectedChiTiet(phanbo.chitietdotphanbo[0]);
        } else {
            setSelectedChiTiet(null);
        }
        setHuongGiaiQuyetMap({}); // Reset map khi thay đổi phân bố
    };
    const reloadData = async () => {
        setLoading(true);
        const res = await LayDanhSachTheoSinhVien(masv, madot);
        const sortedRes = res ? res.sort((a, b) => new Date(b.ngaytao || "").getTime() - new Date(a.ngaytao || "").getTime()) : [];
        setPhanBoList(sortedRes);

        if (sortedRes.length > 0) {
            setSelectedPhanBo(sortedRes[0]);
            if (sortedRes[0].chitietdotphanbo && sortedRes[0].chitietdotphanbo.length > 0) {
                setSelectedChiTiet(sortedRes[0].chitietdotphanbo[0]);
            }
        } else {
            setSelectedPhanBo(null);
            setSelectedChiTiet(null);
        }

        const sv = await laysinhvientheoid(masv);
        setStudentInfo(sv || null);
        setLoading(false);
    };

    const handleChiTietChange = (chitiet: ChiTietDotPhanBo) => {
        setSelectedChiTiet(chitiet);
        setHuongGiaiQuyetMap({}); // Reset map khi thay đổi chi tiết
    };

    const handleHuongGiaiQuyetChange = (matinhtrang: string, value: string) => {
        setHuongGiaiQuyetMap((prev) => ({ ...prev, [matinhtrang]: value }));
    };

    const handleAction = async (
        type: "xacnhan" | "xacnhanrot" | "chuyendotmoi" | "traloi"
    ) => {
        if (!selectedChiTiet) return;

        const madot = selectedChiTiet.madot;
        const masv = selectedChiTiet.masv;
        const madotphanbo = selectedChiTiet.madotphanbo;

        try {
            switch (type) {
                case "xacnhanrot":
                    const resRot = await XacNhanRotFunction(madot, masv);
                    if (resRot?.result === "oke") {
                        alert("Xác nhận rớt thành công!");
                        await reloadData(); // Load lại dữ liệu mà không tắt modal
                    }
                    break;

                case "chuyendotmoi":
                    const resChuyen = await ChuyenDotMoiFunction(madot, masv);
                    if (resChuyen?.result === "oke") {
                        alert("Chuyển sang đợt mới thành công!");
                        await reloadData();
                    }
                    break;

                case "traloi":
                    if (selectedChiTiet.tinhtrangphongvan && selectedChiTiet.tinhtrangphongvan.length > 0) {
                        for (const tt of selectedChiTiet.tinhtrangphongvan) {
                            const huongGiaiQuyet = huongGiaiQuyetMap[tt.matinhtrang] || "";
                            if (huongGiaiQuyet.trim() !== "") {
                                await TraLoiPhanHoiFunction(madot, masv, madotphanbo, tt.matinhtrang, huongGiaiQuyet);
                            }
                        }
                        alert("Trả lời phản hồi thành công!");
                        await reloadData();
                    }
                    break;

                default:
                    if (selectedChiTiet.macongty && madot !== null && masv !== null) {
                        await XacNhanDau(madot, masv, selectedChiTiet.macongty);
                        alert("Cập nhật thành công!");
                        await reloadData();
                    } else {
                        alert("Thông tin không đầy đủ !" + selectedChiTiet.macongty +madot +  masv);
                    }
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Đã xảy ra lỗi khi thực hiện hành động.");
        }
    };




    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex relative overflow-hidden border border-gray-100">
                {/* Gradient header bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 transition-all duration-200 z-10 hover:scale-110 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {/* Left Panel */}
                <div className="flex flex-col w-1/2 border-r border-gray-100 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                    {/* Top: Thông tin sinh viên - Fixed height */}
                    <div className="p-6 border-b border-gray-100 min-h-[280px] flex flex-col">
                        <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-gray-800">
                            <FaUser className="text-blue-500 w-6 h-6" />
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Thông tin sinh viên</span>
                        </h3>
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
                                <span className="ml-2 text-sm text-gray-500">Đang tải thông tin...</span>
                            </div>
                        ) : studentInfo ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FaUserTie className="text-gray-400 w-4 h-4 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Mã SV</p>
                                                <p className="font-medium">{studentInfo.masv}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaEnvelope className="text-gray-400 w-4 h-4 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Email</p>
                                                <p className="font-medium text-blue-600 hover:text-blue-700 truncate">{studentInfo.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaPhone className="text-gray-400 w-4 h-4 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">SĐT</p>
                                                <p className="font-medium">{studentInfo.sdt}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FaUser className="text-gray-400 w-4 h-4 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Họ tên</p>
                                                <p className="font-medium">{studentInfo.hoten}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaBirthdayCake className="text-gray-400 w-4 h-4 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Ngày sinh</p>
                                                <p className="font-medium">{studentInfo.ngaysinh}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <FaVenusMars className="text-gray-400 w-4 h-4 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Giới tính</p>
                                                    <p className="font-medium">{studentInfo.gioitinh}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 pt-2">
                                                <FaMapMarkerAlt className="text-gray-400 w-4 h-4 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Địa chỉ</p>
                                                    <p className="font-medium text-gray-500 text-sm">{studentInfo.diachi}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-red-500">
                                <FaExclamationTriangle className="w-5 h-5 mr-2" />
                                <span className="text-sm">Không tìm thấy thông tin sinh viên.</span>
                            </div>
                        )}
                    </div>

                    {/* Bottom: Danh sách đợt phân bố - Scrollable */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <h4 className="text-lg font-bold flex items-center gap-3 mb-6 text-gray-800">
                            <FaCalendarAlt className="text-emerald-500 w-5 h-5" />
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">Danh sách đợt phân bố</span>
                        </h4>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <FaSpinner className="w-5 h-5 text-emerald-500 animate-spin mr-2" />
                                <span className="text-sm text-gray-500">Đang tải...</span>
                            </div>
                        ) : phanBoList.length > 0 ? (
                            <ul className="space-y-3">
                                {phanBoList.map((pb) => (
                                    <li
                                        key={pb.madotphanbo}
                                        className={`p-5 border rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 ${selectedPhanBo?.madotphanbo === pb.madotphanbo
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ring-2 ring-blue-200/50"
                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                            }`}
                                        onClick={() => handlePhanBoChange(pb)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-base leading-tight">{pb.mota}</p>
                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                    <FaArrowRight className="w-3 h-3" />
                                                    Ngày tạo: {pb.ngaytao?.split("T")[0]}
                                                </p>
                                            </div>
                                            {selectedPhanBo?.madotphanbo === pb.madotphanbo && (
                                                <FaCheckCircle className="w-5 h-5 text-blue-500 ml-3 flex-shrink-0 mt-0.5" />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FaClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Không có đợt phân bố nào.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex flex-col w-1/2 overflow-hidden bg-white">
                    {/* Top: Minh chứng & Trạng thái - Fixed height */}
                    <div className="p-6 border-b border-gray-100 min-h-[280px] flex flex-col">
                        <h4 className="text-lg font-bold flex items-center gap-3 mb-6 text-gray-800">
                            <FaFilePdf className="text-red-500 w-5 h-5" />
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Minh chứng & Trạng thái</span>
                        </h4>
                        {selectedPhanBo && selectedPhanBo.chitietdotphanbo && selectedPhanBo.chitietdotphanbo.length > 1 ? (
                            <div className="mb-6">
                                <h5 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                    <FaBuilding className="w-4 h-4" />
                                    Chọn chi tiết phân bố:
                                </h5>
                                <select
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e) => {
                                        const chitiet = selectedPhanBo.chitietdotphanbo?.find((ct) => ct.macongty === e.target.value);
                                        if (chitiet) handleChiTietChange(chitiet);
                                    }}
                                    value={selectedChiTiet?.macongty || ""}
                                >
                                    {selectedPhanBo.chitietdotphanbo.map((ct) => (
                                        <option key={ct.macongty} value={ct.macongty}>
                                            {ct.congtythuctap?.tencongty || ct.macongty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : null}
                        {selectedChiTiet ? (
                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                                    <FaBuilding className="text-indigo-500 w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-800">Công ty:</span>
                                        <p className="font-medium text-indigo-700 mt-1">{selectedChiTiet.congtythuctap?.tencongty || selectedChiTiet.macongty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                                    <span className="font-semibold text-gray-800 min-w-[80px]">Trạng thái:</span>
                                    <div className="flex items-center gap-3">
                                        {selectedChiTiet.ketquapv === "1" ? (
                                            <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm shadow-sm">
                                                <FaCheckCircle className="w-4 h-4" /> Đậu
                                            </span>
                                        ) : selectedChiTiet.ketquapv === "2" ? (
                                            <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold text-sm shadow-sm">
                                                <FaClock className="w-4 h-4" /> Chưa có kết quả
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold text-sm shadow-sm">
                                                <FaTimesCircle className="w-4 h-4" /> Rớt
                                            </span>
                                        )}

                                        {selectedChiTiet.ketquapv === "1" && (
                                            <button
                                                onClick={() => handleAction("xacnhan")}
                                                className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-sm hover:bg-green-700 transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                                            >
                                                <FaThumbsUp className="w-3 h-3" />
                                                Xác nhận
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {selectedChiTiet.fileminhchung && (
                                    <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[70%] flex items-center gap-2">
                                                <FaFilePdf className="w-4 h-4 text-red-500" />
                                                {selectedChiTiet.fileminhchung.split("/").pop()}
                                            </span>
                                            <button
                                                onClick={handleOpenModal}
                                                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors duration-200 text-sm"
                                            >
                                                Xem file
                                                <FaArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <PdfViewerModal
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    pdfUrl={selectedChiTiet.fileminhchung || ""}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <FaClipboardList className="w-8 h-8 mr-3 opacity-50" />
                                <span className="text-sm">Chọn đợt phân bố để xem chi tiết.</span>
                            </div>
                        )}
                    </div>

                    {/* Bottom: Tình trạng sinh viên - Scrollable */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                        <h4 className="text-lg font-bold flex items-center gap-3 mb-6 text-gray-800">
                            <FaExclamationTriangle className="text-amber-500 w-5 h-5" />
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">Tình trạng sinh viên</span>
                        </h4>
                        {selectedChiTiet && selectedChiTiet.tinhtrangphongvan && selectedChiTiet.tinhtrangphongvan.length > 0 ? (
                            <ul className="space-y-4">
                                {selectedChiTiet.tinhtrangphongvan.map((tt) => (
                                    <li key={tt.matinhtrang} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-start gap-4 mb-4">
                                            <FaExclamationTriangle className="text-amber-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-800 mb-1">Vấn đề: {tt.vandephatsinh}</p>
                                                <p className="text-sm text-gray-600">Nội dung: {tt.noidungphatsinh}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FaClipboardList className="w-3 h-3" />
                                                Hướng giải quyết:
                                            </label>
                                          
                                            <input
                                                type="text"
                                                defaultValue={tt.huonggiaiquyet || ""} 
                                                onChange={(e) => handleHuongGiaiQuyetChange(tt.matinhtrang, e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                                placeholder="Nhập hướng giải quyết chi tiết..."
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <FaCheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
                                <p className="text-sm">Không có tình trạng nào.</p>
                            </div>
                        )}

                        {/* Nút hành động - Sticky bottom */}
                        <div className="sticky bottom-0 pb-6 pt-6 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm mt-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction("xacnhanrot")}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    <FaTimesCircle className="w-4 h-4" />
                                    Xác nhận rớt
                                </button>
                                <button
                                    onClick={() => handleAction("chuyendotmoi")}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    <FaArrowRight className="w-4 h-4" />
                                    Chuyển đợt mới
                                </button>
                                <button
                                    onClick={() => handleAction("traloi")}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    <FaCheckCircle className="w-4 h-4" />
                                    Trả lời phản hồi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}