import { useEffect, useState } from "react";
import { FiCalendar, FiFileText, FiHash, FiUsers, FiFlag, FiClock, FiCheckCircle, FiInfo } from "react-icons/fi";
import { MdOutlineBadge } from "react-icons/md";
import { GetByIDFunction } from "../../../functions/batch-internship";
import { createPhanBo } from "../../../functions/internship-allocation";
import type { DotThucTap } from "../../../models/model-all";

interface CreateAllocationProps {
    onClose: () => void;
    data: string; // mã đợt thực tập
}

export default function CreateDotPhanBoCard({ onClose, data }: CreateAllocationProps) {
    const [course, setCourse] = useState<DotThucTap>();

    useEffect(() => {
        GetByIDFunction(data)
            .then((res) => setCourse(res))
            .catch((err) => console.error("Lỗi tải dữ liệu:", err));
    }, [data]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await createPhanBo(e)
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl mx-auto p-8 space-y-10 text-gray-800"
        >
            {/* 1️⃣ Thông tin đợt thực tập */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <MdOutlineBadge className="text-blue-600 text-3xl" />
                    <h3 className="text-2xl font-bold text-blue-700">Thông tin đợt thực tập</h3>
                </div>

                {course ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Card 1 - Thông tin chung */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
                            <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                                <FiInfo /> Thông tin chung
                            </h4>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <FiHash className="text-blue-500" />
                                    <span><strong>Mã đợt:</strong> {course.madot}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiFlag className="text-blue-500" />
                                    <span><strong>Tên đợt:</strong> {course.tendot || "-"}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiUsers className="text-blue-500" />
                                    <span><strong>Số lượng đăng ký:</strong> {course.soluongdangky ?? 0}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiCheckCircle className="text-blue-500" />
                                    <span>
                                        <strong>Trạng thái:</strong>{" "}
                                        {course.trangthai === 0
                                            ? "Đăng ký"
                                            : course.trangthai === 1
                                                ? "Đang triển khai"
                                                : "Đã kết thúc"}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Card 2 - Thời gian */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
                            <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                                <FiCalendar /> Thông tin thời gian
                            </h4>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <FiClock className="text-blue-500" />
                                    <span>
                                        <strong>Ngày lập:</strong>{" "}
                                        <em className="text-gray-600">
                                            {course.ngaylap
                                                ? new Date(course.ngaylap).toLocaleDateString("vi-VN")
                                                : "-"}
                                        </em>
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiClock className="text-blue-500" />
                                    <span>
                                        <strong>Triển khai:</strong>{" "}
                                        <em className="text-gray-600">
                                            {course.thoigiantrienkhai
                                                ? new Date(course.thoigiantrienkhai).toLocaleDateString("vi-VN")
                                                : "-"}
                                        </em>
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiClock className="text-blue-500" />
                                    <span>
                                        <strong>Kết thúc:</strong>{" "}
                                        <em className="text-gray-600">
                                            {course.thoigianketthuc
                                                ? new Date(course.thoigianketthuc).toLocaleDateString("vi-VN")
                                                : "-"}
                                        </em>
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiClock className="text-blue-500" />
                                    <span>
                                        <strong>Kết thúc đăng ký:</strong>{" "}
                                        <em className="text-gray-600">
                                            {course.thoigianketthucdangky
                                                ? new Date(course.thoigianketthucdangky).toLocaleDateString("vi-VN")
                                                : "-"}
                                        </em>
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiClock className="text-blue-500" />
                                    <span>
                                        <strong>Kết thúc chỉnh sửa:</strong>{" "}
                                        <em className="text-gray-600">
                                            {course.thoigianketthucchinhsua
                                                ? new Date(course.thoigianketthucchinhsua).toLocaleDateString("vi-VN")
                                                : "-"}
                                        </em>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Card 3 - Ghi chú */}
                        <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
                            <h4 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                <FiFileText /> Ghi chú
                            </h4>
                            <p className="text-gray-700 italic">
                                {course.ghitru || "Không có ghi chú"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Đang tải dữ liệu...</p>
                )}
            </div>

            {/* 2️⃣ Mô tả đợt phân bố */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <FiFileText className="text-green-600 text-3xl" />
                    <h3 className="text-2xl font-bold text-green-700">Mô tả đợt phân bố</h3>
                </div>
                <input name="madot" type="hidden" value={data}/>
                <textarea
                    name="mota"
                    placeholder="Nhập mô tả hoặc ghi chú cho đợt phân bố..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
                    rows={5}
                />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                    Thoát
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                    Tạo mới
                </button>
            </div>
        </form>
    );
}
