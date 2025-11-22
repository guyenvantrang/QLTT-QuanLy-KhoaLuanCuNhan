import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaTag, FaInfoCircle, FaSpinner } from "react-icons/fa";
import type { ChucVu } from "../../../models/model-all"; // Import model ChucVu
import { addChucVu, updateChucVu } from "../../../api/login"; // Giả định có file functions/chucvu-api

interface ChucVuFormModalProps {
    isEdit: boolean;
    initialData?: ChucVu | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Component chung cho Form Thêm/Sửa Chức Vụ
const ChucVuFormModal: React.FC<ChucVuFormModalProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<ChucVu>(initialData || { machucvu: '', tenchucvu: '', mota: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData(initialData);
        }
    }, [isEdit, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEdit) {
                await updateChucVu(initialData!.machucvu, {
                    tenchucvu: formData.tenchucvu,
                    mota: formData.mota
                });
                alert("Cập nhật chức vụ thành công!");
            } else {
                await addChucVu({
                    tenchucvu: formData.tenchucvu,
                    mota: formData.mota
                });
                alert("Thêm mới chức vụ thành công!");
            }

            onSuccess();
            onClose();

        } catch (err: any) {
            setError(err.response?.data?.message || "Xảy ra lỗi khi xử lý.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2 border-indigo-100">
                {isEdit ? `Cập nhật Chức vụ: ${formData.machucvu}` : "Thêm mới Chức vụ"}
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4" role="alert">
                    {error}
                </div>
            )}

            <div className="space-y-4">



                {/* Tên chức vụ */}
                <div className="flex flex-col">
                    <label htmlFor="tenchucvu" className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
                        <FaTag className="text-indigo-500 w-4 h-4" /> Tên chức vụ
                    </label>
                    <input
                        id="tenchucvu"
                        type="text"
                        name="tenchucvu"
                        value={formData.tenchucvu}
                        onChange={handleChange}
                        placeholder="VD: GIẢNG VIÊN"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Mô tả */}
                <div className="flex flex-col">
                    <label htmlFor="mota" className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
                        <FaInfoCircle className="text-indigo-500 w-4 h-4" /> Mô tả
                    </label>
                    <textarea
                        id="mota"
                        name="mota"
                        rows={3}
                        value={formData.mota}
                        onChange={handleChange}
                        placeholder="Mô tả chức năng và trách nhiệm của chức vụ này..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    disabled={loading}
                >
                    <FaTimes className="w-4 h-4" /> Hủy
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
                    disabled={loading}
                >
                    {loading ? (
                        <FaSpinner className="animate-spin w-4 h-4" />
                    ) : (
                        <FaSave className="w-4 h-4" />
                    )}
                    {isEdit ? "Lưu Cập nhật" : "Thêm Chức vụ"}
                </button>
            </div>
        </form>
    );
};

export default ChucVuFormModal;