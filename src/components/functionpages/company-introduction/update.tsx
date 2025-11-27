import { useEffect, useState } from "react";
import { 
     FiUser, FiFileText, FiPhone, FiMail, FiMapPin, 
    FiCheckCircle, FiXCircle, FiAward, FiInfo 
} from "react-icons/fi";
import { GiTeacher } from "react-icons/gi";
import { MdBusiness, MdOutlineBadge, MdVerified } from "react-icons/md";
import type { GioiThieuCongTy, CongTyThucTap, GiangVien } from "../../../models/model-all";
import { GetByIDCtyFunction } from "../../../functions/company";
import { GetByIDGvFunction } from "../../../functions/teacher";
import { XacThucKhongThanhCong, XacThucThanhCong, ThongSo } from "../../../functions/company-introduction";

interface DetailCompanyProps {
    onClose: () => void;
    data: GioiThieuCongTy;
}

interface ThongSo {
    tonglangioithieu: number;
    tonglangioithieuthanhcong: number;
}

export default function DetailGioiThieuCongTyCard({ onClose, data }: DetailCompanyProps) {
    const [companyDetails, setCompanyDetails] = useState<CongTyThucTap>();
    const [teacherDetails, setTeacherDetails] = useState<GiangVien>();
    const [thongso, setthongso] = useState<ThongSo | null>(null);

    useEffect(() => {
        if (data.macongty) {
            GetByIDCtyFunction(data.macongty)
                .then((res) => setCompanyDetails(res))
                .catch((err) => console.error("Lỗi tải dữ liệu công ty:", err));
        }

        if (data.magiangvien) {
            GetByIDGvFunction(data.magiangvien)
                .then((res) => setTeacherDetails(res))
                .catch((err) => console.error("Lỗi tải dữ liệu giảng viên:", err));

            ThongSo(data.magiangvien)
                .then((res) => setthongso(res))
                .catch((err) => console.error("Lỗi tải thông số:", err));
        }
    }, [data]);

    // --- Helper Components cho Badge ---
    const LabelItem = ({ icon: Icon, label, value, highlight = false }: any) => (
        <div className="flex flex-col mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                <Icon className="text-blue-500" /> {label}
            </span>
            <span className={`text-sm font-medium break-words ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>
                {value || <span className="text-slate-400 italic">Chưa cập nhật</span>}
            </span>
        </div>
    );

    function getStatusBadge(status?: string) {
        switch (status) {
            case "0":
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Phạm vi sinh viên</span>;
            case "1":
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Phạm vi trường học</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Phạm vi giới thiệu</span>;
        }
    }

    function getStatusActive(status?: string) {
        return status === "0" 
            ? <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Ngưng hoạt động</span>
            : <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Đang hoạt động</span>;
    }

    function getRequestStatus(status?: string) {
        switch (status) {
            case "0":
                return <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 font-bold"><FiInfo/> Mới đề xuất</div>;
            case "1":
                return <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-bold"><FiCheckCircle/> Đã xác nhận</div>;
            default:
                return <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 font-bold"><FiXCircle/> Đã từ chối</div>;
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.15)] border border-blue-100 overflow-hidden font-sans">
            
            {/* --- HEADER --- */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-5 flex justify-between items-center text-white">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <MdVerified className="text-blue-300 text-2xl" /> 
                        Chi Tiết Giới Thiệu Doanh Nghiệp
                    </h2>
                    <p className="text-blue-200 text-sm mt-1 opacity-80 pl-9">
                        Mã đề xuất: <span className="font-mono font-bold text-white">{data.madexuat}</span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-200 uppercase font-bold">Ngày đề xuất</span>
                    <span className="text-lg font-bold">
                        {data.ngaydexuat ? new Date(data.ngaydexuat).toLocaleDateString("vi-VN") : "N/A"}
                    </span>
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="p-8 bg-slate-50 min-h-[500px]">
                
                {/* Top Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Status Box */}
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500 uppercase">Trạng thái</span>
                        {getRequestStatus(data?.trangthai)}
                    </div>
                    {/* Stats Teacher Box */}
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MdOutlineBadge size={20}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Tổng giới thiệu</p>
                                <p className="text-lg font-bold text-slate-800">{thongso?.tonglangioithieu ?? 0}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FiAward size={20}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Thành công</p>
                                <p className="text-lg font-bold text-emerald-600">{thongso?.tonglangioithieuthanhcong ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* LEFT COL: GIẢNG VIÊN (30%) */}
                    <div className="lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-white rounded-xl border border-blue-200 shadow-[0_4px_20px_rgba(59,130,246,0.05)] overflow-hidden h-full">
                            <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex items-center gap-2">
                                <GiTeacher className="text-blue-600 text-lg" />
                                <h3 className="font-bold text-blue-900">Thông tin Giảng viên</h3>
                            </div>
                            <div className="p-5">
                                <div className="mb-6 text-center">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 text-2xl font-bold mb-3 border-4 border-white shadow-lg">
                                        {teacherDetails?.tengiangvien?.charAt(0) || "GV"}
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800">{teacherDetails?.tengiangvien}</h4>
                                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{data.magiangvien}</span>
                                </div>
                                <div className="space-y-1">
                                    <LabelItem icon={FiMail} label="Email" value={teacherDetails?.email} />
                                    <LabelItem icon={FiPhone} label="Số điện thoại" value={teacherDetails?.sdt} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: CÔNG TY (70%) */}
                    <div className="lg:w-2/3 flex flex-col gap-6">
                        <div className="bg-white rounded-xl border border-blue-200 shadow-[0_4px_20px_rgba(59,130,246,0.05)] overflow-hidden">
                            <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MdBusiness className="text-blue-600 text-lg" />
                                    <h3 className="font-bold text-blue-900">Thông tin Doanh nghiệp</h3>
                                </div>
                                <div className="flex gap-2">
                                    {getStatusActive(companyDetails?.hoatdong)} 
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-blue-800 mb-1">{companyDetails?.tencongty || "Đang tải..."}</h2>
                                        <div className="flex gap-2 mt-2">
                                            {getStatusBadge(companyDetails?.phanloai)}
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                {companyDetails?.linhvuc || "Chưa rõ lĩnh vực"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Mã Công Ty</span>
                                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{data.macongty}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <LabelItem icon={FiMapPin} label="Địa chỉ" value={companyDetails?.diachi} />
                                    <LabelItem icon={MdVerified} label="Mã số thuế" value={companyDetails?.masothue} />
                                    <LabelItem icon={FiUser} label="Người đại diện" value={companyDetails?.nguoidaidien} />
                                    <LabelItem icon={FiMail} label="Email liên hệ" value={companyDetails?.email} />
                                    <LabelItem icon={FiPhone} label="Điện thoại" value={companyDetails?.sdt} />
                                </div>
                            </div>
                        </div>

                        {/* Note Section */}
                        <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden flex-1">
                            <div className="bg-amber-50 px-5 py-2 border-b border-amber-100 flex items-center gap-2">
                                <FiFileText className="text-amber-600" />
                                <h3 className="font-bold text-amber-800 text-sm">Ghi chú / Mô tả</h3>
                            </div>
                            <div className="p-5 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                {data.mota || "Không có mô tả chi tiết cho đề xuất này."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-8 py-5 bg-white border-t border-blue-100 flex justify-end items-center gap-3">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-all duration-200"
                >
                    Đóng
                </button>
                
                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                <button 
                    onClick={async () => {
                        if(window.confirm("Bạn có chắc chắn muốn TỪ CHỐI đề xuất này?")) {
                           await XacThucKhongThanhCong(data.madexuat, data.magiangvien, data.macongty);
                        }
                    }} 
                    className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 flex items-center gap-2"
                >
                    <FiXCircle className="text-lg"/> Từ chối
                </button>

                <button 
                    onClick={async () => {
                        if(window.confirm("Xác nhận CHẤP THUẬN đề xuất hợp tác này?")) {
                            await XacThucThanhCong(data.madexuat, data.magiangvien, data.macongty);
                        }
                    }} 
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center gap-2"
                >
                    <FiCheckCircle className="text-lg"/> Xác nhận hợp tác
                </button>
            </div>
        </div>
    );
}