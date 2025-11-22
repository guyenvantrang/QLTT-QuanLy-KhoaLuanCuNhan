import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaLayerGroup, FaInfoCircle, FaSpinner } from "react-icons/fa";
import toast from 'react-hot-toast';
import type { NhomQuyen } from "../../../models/model-all";
import { addNhomQuyen, updateNhomQuyen } from "../../../api/login";

interface NhomQuyenFormModalProps {
    isEdit: boolean;
    initialData?: NhomQuyen | null;
    onClose: () => void;
    onSuccess: () => void;
}

const NhomQuyenFormModal: React.FC<NhomQuyenFormModalProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<NhomQuyen>>({
        manhomquyen:'',
        tennhom: '',
        mota: ''
    });

    const [loading, setLoading] = useState(false);

    // Fill data nếu là Edit
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
        setLoading(true);

        // Validation
        if (!formData.tennhom) {
            toast.error("Vui lòng nhập Mã nhóm và Tên nhóm!");
            setLoading(false);
            return;
        }

        try {
            const promise = isEdit
                ? updateNhomQuyen(formData.manhomquyen ||"", {
                    tennhom: formData.tennhom,
                    mota: formData.mota
                })
                : addNhomQuyen({
                    tennhom: formData.tennhom,
                    mota: formData.mota
                });

            await toast.promise(promise, {
                loading: 'Đang lưu dữ liệu...',
                success: isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
                error: (err) => `Lỗi: ${err.message}`
            });

            onSuccess();
        } catch (err) {
            // Toast đã xử lý
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Tên Nhóm */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FaLayerGroup className="text-blue-500" /> Tên nhóm quyền <span className="text-red-500">*</span>
                </label>
                <input
                    name="tennhom"
                    value={formData.tennhom}
                    onChange={handleChange}
                    placeholder="VD: Quản trị viên, Nhân viên nhập liệu"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
            </div>

            {/* Mô tả */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FaInfoCircle className="text-blue-500" /> Mô tả
                </label>
                <textarea
                    name="mota"
                    rows={4}
                    value={formData.mota || ''}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết về quyền hạn của nhóm này..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none transition-all"
                />
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                    <FaTimes /> Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-medium shadow-md transition-all flex items-center gap-2"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {isEdit ? 'Lưu Thay Đổi' : 'Tạo Nhóm Mới'}
                </button>
            </div>
        </form>
    );
};

export default NhomQuyenFormModal;