import { useEffect, useState } from "react";
import { FiCalendar, FiUser, FiFileText, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { GiTeacher } from "react-icons/gi";
import { MdBusiness, MdCategory, MdOutlineBadge } from "react-icons/md";
import type { GioiThieuCongTy, CongTyThucTap, GiangVien } from "../../../models/model-all";
import { GetByIDCtyFunction } from "../../../functions/company";
import { GetByIDGvFunction } from "../../../functions/teacher";
import { XacThucKhongThanhCong, XacThucThanhCong, ThongSo } from "../../../functions/company-introduction"
interface DetailCompanyProps {
    onClose: () => void;
    data: GioiThieuCongTy;
}
interface ThongSo {
  tonglangioithieu: number;
  tonglangioithieuthanhcong:number
}

export default function DetailGioiThieuCongTyCard({ onClose, data }: DetailCompanyProps) {
    const [companyDetails, setCompanyDetails] = useState<CongTyThucTap>();
    const [teacherDetails, setTeacherDetails] = useState<GiangVien>();
    const [thongso, setthongso] = useState< ThongSo | null>(null);

    useEffect(() => {
        GetByIDCtyFunction(data.macongty)
            .then((res) => setCompanyDetails(res))
            .catch((err) => console.error("Lỗi tải dữ liệu công ty:", err));

        GetByIDGvFunction(data.magiangvien)
            .then((res) => setTeacherDetails(res))
            .catch((err) => console.error("Lỗi tải dữ liệu giảng viên:", err));

        ThongSo(data.magiangvien)
            .then((res) => setthongso(res))
            .catch((err) => console.error("Lỗi tải dữ liệu giảng viên:", err));
    }, [data]);
    function getStatusBadge(status?: string) {
        const baseDot = "inline-block w-2.5 h-2.5 rounded-full mr-1.5";

        switch (status) {
            case "0":
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-yellow-400`}></span>
                        <span className="text-sm text-gray-600">Phạm vi sinh viên</span>
                    </div>
                );
            case "1":
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-green-500`}></span>
                        <span className="text-sm text-gray-600">Phạm vi trường học</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-blue-500`}></span>
                        <span className="text-sm text-gray-600">Phạm vi giới thiệu</span>
                    </div>
                );
        }
    }

    function getStatusActive(status?: string) {
        const baseDot = "inline-block w-2.5 h-2.5 rounded-full mr-1.5";

        switch (status) {
            case "0":
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-gray-400`}></span>
                        <span className="text-sm text-gray-600">Không hoạt động</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-green-500`}></span>
                        <span className="text-sm text-gray-600">Hoạt động</span>
                    </div>
                );
        }
    }

    function getStatus(status?: string) {
        const baseDot = "inline-block w-2.5 h-2.5 rounded-full mr-1.5";

        switch (status) {
            case "0":
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-yellow-400`}></span>
                        <span className="text-sm text-gray-600">Mới đề xuất</span>
                    </div>
                );
            case "1":
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-green-500`}></span>
                        <span className="text-sm text-gray-600">Xác nhận thành công</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center">
                        <span className={`${baseDot} bg-red-500`}></span>
                        <span className="text-sm text-gray-600">Không hợp tác</span>
                    </div>
                );
        }
    }


    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-6 text-gray-800">

            {/* Card Giảng viên */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <GiTeacher className="text-blue-700" /> Giảng viên
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-sm flex items-center gap-1"><FiUser /> Mã giảng viên</span>
                        <span className="">{data.magiangvien}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><GiTeacher /> Tên giảng viên</span>
                        <span className="text-gray-500">{teacherDetails?.tengiangvien || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1 "><FiMail /> Email</span>
                        <span className="text-gray-500">{teacherDetails?.email || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><FiPhone /> SĐT</span>
                        <span className="text-gray-500">{teacherDetails?.sdt || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><MdOutlineBadge /> Tổng lần giới thiệu</span>
                        <span className="text-gray-500">{thongso?.tonglangioithieu}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><MdOutlineBadge /> Tổng lần giới thiệu thành công</span>
                        <span className="text-gray-500">{thongso?.tonglangioithieuthanhcong}</span>
                    </div>
                </div>
            </div>

            {/* Card Công ty */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <MdBusiness className="text-green-700" /> Công ty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><MdBusiness /> Mã công ty</span>
                        <span className="font-semibold">{data.macongty}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><MdBusiness /> Tên công ty</span>
                        <span className="text-gray-500">{companyDetails?.tencongty || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><FiMapPin /> Địa chỉ</span>
                        <span className="text-gray-500">{companyDetails?.diachi || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1">Mã số thuế</span>
                        <span className="text-gray-500">{companyDetails?.masothue || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1">Người đại diện</span>
                        <span className="text-gray-500">{companyDetails?.nguoidaidien || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><FiMail /> Email</span>
                        <span className="text-gray-500">{companyDetails?.email || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><FiPhone /> SĐT</span>
                        <span className="text-gray-500">{companyDetails?.sdt || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1"><MdCategory /> Phân loại</span>
                        <span className="text-gray-500">{getStatusBadge(companyDetails?.phanloai)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1">Hoạt động</span>
                        <span className="text-gray-500">{getStatusActive(companyDetails?.phanloai)}</span>
                    </div>
                </div>

                {/* Mô tả / ghi chú */}
                <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2"><FiFileText /> Mô tả / Ghi chú</h4>
                    <p className="text-gray-500 mt-2">{data.mota || "Không có ghi chú"}</p>
                </div>
            </div>

            {/* Thông tin đề xuất */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <FiCalendar className="text-purple-700" /> Giới thiệu công ty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1">Mã đề xuất</span>
                        <span className="font-semibold">{data.madexuat}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1">Ngày đề xuất</span>
                        <span className="text-gray-500">{data.ngaydexuat ? new Date(data.ngaydexuat).toLocaleDateString("vi-VN") : "-"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm flex items-center gap-1">Trạng thái</span>
                        <span className="text-gray-500">{getStatus(data?.trangthai)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                    Thoát
                </button>
                <button onClick={async () => {
                    const confirmDelete = window.confirm(
                        "Bạn có chắc muốn xác nhận không?"
                    );
                    if (!confirmDelete) return;
                    await XacThucThanhCong(data.madexuat, data.magiangvien, data.macongty);
                }} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                    Hợp tác thành công
                </button>
                <button onClick={async () => {
                    const confirmDelete = window.confirm(
                        "Bạn có chắc muốn xác nhận không?"
                    );
                    if (!confirmDelete) return;
                    await XacThucKhongThanhCong(data.madexuat, data.magiangvien, data.macongty);
                }} className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                    Từ chối hợp tác
                </button>
            </div>
        </div>
    );
}
