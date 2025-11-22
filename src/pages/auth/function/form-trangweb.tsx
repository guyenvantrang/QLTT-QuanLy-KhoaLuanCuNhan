import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaGlobe, FaLink, FaInfoCircle, FaSpinner } from "react-icons/fa";
import type { TrangWeb } from "../../../models/model-all";
import { addTrangWeb, updateTrangWeb } from "../../../api/login";
import toast from 'react-hot-toast';

interface TrangWebFormModalProps {
    isEdit: boolean;
    initialData?: TrangWeb | null;
    onClose: () => void;
    onSuccess: () => void;
}

const TrangWebFormModal: React.FC<TrangWebFormModalProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<TrangWeb>>({
        tentrang: '',
        diachitruycap: '',
        mota: ''
    });
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
        // setError(null); // Có thể bỏ hoặc giữ tùy logic hiển thị lỗi inline
        setLoading(true);

        // Validation
        if (!formData.tentrang || !formData.diachitruycap) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc!"); // Thay đổi thông báo lỗi
            setLoading(false);
            return;
        }

        try {
            // Giả lập gọi API
            const promise = isEdit
                ? updateTrangWeb(formData.matrang!, {
                    tentrang: formData.tentrang,
                    mota: formData.mota,
                    diachitruycap: formData.diachitruycap
                })
                : addTrangWeb(formData);

            // 🔥 Kỹ thuật Toast Promise: Tự động hiện Loading -> Success/Error
            await toast.promise(promise, {
                loading: 'Đang xử lý dữ liệu...',
                success: isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
                error: (err) => `Lỗi: ${err.message || 'Không thể lưu dữ liệu'}`
            });

            // Sau khi thành công
            onSuccess();

        } catch (err: any) {
            // Không cần toast.error ở đây nữa nếu dùng toast.promise
            // Nhưng nếu muốn giữ setError cũ:
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2 border border-red-200">
                    <FaInfoCircle /> {error}
                </div>
            )}

            <div className="space-y-4">

                {/* Tên trang */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaGlobe className="text-indigo-500" /> Tên trang <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="tentrang"
                        value={formData.tentrang}
                        onChange={handleChange}
                        placeholder="VD: Trang chủ, Quản lý người dùng"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                </div>

                {/* Đường dẫn */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaLink className="text-indigo-500" /> Đường dẫn (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="diachitruycap"
                        value={formData.diachitruycap}
                        onChange={handleChange}
                        placeholder="VD: /home, /users/manage"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaInfoCircle className="text-indigo-500" /> Mô tả
                    </label>
                    <textarea
                        name="mota"
                        rows={3}
                        value={formData.mota || ''}
                        onChange={handleChange}
                        placeholder="Mô tả chức năng của trang này..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2">
                    <FaTimes /> Hủy
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 shadow-md transition-all">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {isEdit ? "Lưu thay đổi" : "Thêm mới"}
                </button>
            </div>
        </form>
    );
};

export default TrangWebFormModal;