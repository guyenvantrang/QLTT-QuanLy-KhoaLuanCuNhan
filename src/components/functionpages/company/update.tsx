import { useNavigate, useParams } from "react-router-dom";
import { FiUser, FiHome, FiMail, FiPhone, FiFileText, FiTag } from "react-icons/fi";
import { GetByIDCtyFunction, UpdateCompanyFunction } from "../../../functions/company";
import type { CongTyThucTap } from "../../../models/model-all";
import { useEffect, useState } from "react";
import { Modal, ModalBody } from "flowbite-react";
import CompanyMapModal from "./mapcongty";
import { FaMapMarkerAlt } from "react-icons/fa";




export default function UpdateCongTyForm() {
    const navigate = useNavigate();
    const { macongty } = useParams<{ macongty: string }>();
    const [updatecongty, setUpdatecongty] = useState<CongTyThucTap | null>(null);
    const [selectedAllocation, setSelectedAllocation] = useState<CongTyThucTap | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    // Load dữ liệu công ty theo macongty
    useEffect(() => {
        if (!macongty) return;
        GetByIDCtyFunction(macongty)
            .then((res) => setUpdatecongty(Array.isArray(res) ? res[0] : res || null))
            .catch((err) => console.error("Lỗi tải dữ liệu:", err));
    }, [macongty]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            await UpdateCompanyFunction(e);
        } catch (error) {
            console.error(error);
        }
    };
    if (!updatecongty) return <div>Đang tải dữ liệu...</div>;
    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center items-start py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-lg space-y-6"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Cập nhật công ty thực tập</h2>

                {/* Grid thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Mã công ty */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiTag /> Mã công ty
                        </label>
                        <input
                            type="text"
                            name="macongty"
                            defaultValue={updatecongty?.macongty}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Tên công ty */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiUser /> Tên công ty
                        </label>
                        <input
                            type="text"
                            name="tencongty"
                            defaultValue={updatecongty?.tencongty}
                            placeholder="Nhập tên công ty"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiHome /> Địa chỉ
                        </label>
                        <input
                            type="text"
                            name="diachi"
                            defaultValue={updatecongty?.diachi}
                            placeholder="Nhập địa chỉ"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Mã số thuế */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiTag /> Mã số thuế
                        </label>
                        <input
                            type="text"
                            name="masothue"
                            defaultValue={updatecongty?.masothue}
                            placeholder="Nhập mã số thuế"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Người đại diện */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiUser /> Người đại diện
                        </label>
                        <input
                            type="text"
                            name="nguoidaidien"
                            defaultValue={updatecongty?.nguoidaidien}
                            placeholder="Nhập tên người đại diện"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiMail /> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={updatecongty?.email}
                            placeholder="Nhập email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiPhone /> Số điện thoại
                        </label>
                        <input
                            type="text"
                            name="sdt"
                            defaultValue={updatecongty?.sdt}
                            placeholder="Nhập số điện thoại"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Phân loại */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                            <FiTag /> Phân loại
                        </label>
                        <div className="flex gap-4">
                            {[
                                { value: "0", label: "Sinh viên" },
                                { value: "1", label: "Trường học" },
                                { value: "2", label: "Giới thiệu" },
                            ].map((option) => (
                                <label key={option.value} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="phanloai"
                                        value={option.value}
                                        defaultChecked={updatecongty?.phanloai?.toString().trim() === option.value}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Hoạt động */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                            <FiTag /> Hoạt động
                        </label>
                        <div className="flex gap-4">
                            {[
                                { value: "0", label: "Không hoạt động" },
                                { value: "1", label: "Có hoạt động" },
                            ].map((option) => (
                                <label key={option.value} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="hoatdong"
                                        value={option.value}
                                        defaultChecked={updatecongty?.hoatdong?.toString().trim() === option.value}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Lat and Long in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-2">
                        {/* Lat */}
                        <div className="flex flex-col">
                            <label className="flex items-center gap-1 font-medium text-gray-700 mb-1 text-sm">
                                <FaMapMarkerAlt className="w-3 h-3" /> Vĩ độ (Lat)
                            </label>
                            <input
                                type="number"
                                name="lat"
                                value={updatecongty?.lat || ""}
                                readOnly
                                step="any"
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 text-sm"
                            />
                        </div>

                        {/* Long */}
                        <div className="flex flex-col">
                            <label className="flex items-center gap-1 font-medium text-gray-700 mb-1 text-sm">
                                <FaMapMarkerAlt className="w-3 h-3" /> Kinh độ (Long)
                            </label>
                            <input
                                type="number"
                                name="long"
                                value={updatecongty?.long || ""}
                                readOnly
                                step="any"
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 text-sm"
                            />
                        </div>
                    </div>

                </div>

                {/* Giới thiệu / Ghi chú */}
                <section className="bg-gray-50 p-6 rounded-xl shadow-inner">
                    <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                        <FiFileText /> Giới thiệu công ty / Ghi chú
                    </label>
                    <textarea
                        name="gioithieucongty"
                        rows={5}
                        defaultValue={updatecongty?.gioithieucongty ? JSON.stringify(updatecongty.gioithieucongty) : ""}
                        placeholder="Nhập thông tin giới thiệu hoặc ghi chú"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    ></textarea>
                </section>
                {selectedAllocation && (
                    <Modal
                        show={updateModalOpen}
                        onClose={() => setUpdateModalOpen(false)}
                        size="5xl"
                        dismissible={false}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    >

                        <ModalBody className="bg-gray-50 p-1 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                            <CompanyMapModal
                                onClose={() => setUpdateModalOpen(false)}
                                company={selectedAllocation}
                            />
                        </ModalBody>
                    </Modal>
                )}

                {/* Footer buttons */}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedAllocation(updatecongty);
                            setUpdateModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-colors"
                    >
                        <FaMapMarkerAlt className="w-4 h-4" /> Vị trí
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/company")}
                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
}