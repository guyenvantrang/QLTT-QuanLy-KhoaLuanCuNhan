import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaGlobe, FaKey, FaLayerGroup, FaInfoCircle, FaHashtag, FaSpinner, FaLink } from "react-icons/fa";
import toast from 'react-hot-toast';
import type { ChucNang } from "../../../models/model-all"; // Đảm bảo model đã có trangtruycap?: string
import { addChucNang, updateChucNang } from "../../../api/login";

interface ChucNangFormModalProps {
    isEdit: boolean;
    initialData?: ChucNang | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ChucNangFormModal: React.FC<ChucNangFormModalProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
    
    // ✅ State form theo cấu trúc mới
    const [formData, setFormData] = useState<Partial<ChucNang>>({
        machucnang: '',
        tenchucnang: '',
        matruycap: '',   // Mã code check quyền (VD: USER_VIEW)
        trangtruycap: '', // ✅ Thay thế matrang: Chuỗi đường dẫn (VD: /admin/users)
        mota: ''
    });
    
    const [loading, setLoading] = useState(false);

    // 1. Fill data nếu là Edit
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                machucnang: initialData.machucnang,
                tenchucnang: initialData.tenchucnang || '',
                matruycap: initialData.matruycap || '',
                trangtruycap: initialData.trangtruycap || '', // ✅ Map dữ liệu trangtruycap
                mota: initialData.mota || ''
            });
        }
    }, [isEdit, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.tenchucnang || !formData.matruycap) {
            toast.error("Vui lòng điền Tên chức năng và Mã truy cập!");
            setLoading(false);
            return;
        }

        try {
            // Payload
            const payload = {
                tenchucnang: formData.tenchucnang,
                matruycap: formData.matruycap,
                trangtruycap: formData.trangtruycap, // ✅ Gửi chuỗi trangtruycap
                mota: formData.mota
            };

            const promise = isEdit 
                ? updateChucNang(formData.machucnang!, payload)
                : addChucNang(payload);

            await toast.promise(promise, {
                loading: 'Đang xử lý...',
                success: isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
                error: (err) => `Lỗi: ${err.message}`
            });

            onSuccess();
        } catch (err) {
            // Error handled by toast promise
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cột Trái */}
                <div className="space-y-4">
                    {/* Mã chức năng (Read-only) */}
                    {isEdit && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                <FaHashtag className="text-gray-400"/> Mã chức năng
                            </label>
                            <input 
                                value={formData.machucnang} 
                                readOnly 
                                className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
                            />
                        </div>
                    )}

                    {/* Tên chức năng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FaLayerGroup className="text-indigo-500"/> Tên chức năng <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="tenchucnang"
                            value={formData.tenchucnang}
                            onChange={handleChange}
                            placeholder="VD: Quản lý người dùng"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        />
                    </div>

                    {/* Mã truy cập */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FaKey className="text-indigo-500"/> Mã truy cập (Code) <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="matruycap"
                            value={formData.matruycap}
                            onChange={handleChange}
                            placeholder="VD: USER_VIEW"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all bg-slate-50"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 italic">Dùng để phân quyền trong code (Unique).</p>
                    </div>
                </div>

                {/* Cột Phải */}
                <div className="space-y-4">
                    {/* Trang Truy Cập (Input Text thay vì Select) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FaGlobe className="text-indigo-500"/> Trang Truy Cập / URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLink className="text-gray-400" />
                            </div>
                            <input
                                name="trangtruycap"
                                value={formData.trangtruycap}
                                onChange={handleChange}
                                placeholder="VD: /admin/users hoặc https://..."
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Đường dẫn trang web liên quan (nếu có).</p>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FaInfoCircle className="text-indigo-500"/> Mô tả
                        </label>
                        <textarea
                            name="mota"
                            rows={4}
                            value={formData.mota || ''}
                            onChange={handleChange}
                            placeholder="Mô tả chi tiết về chức năng này..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
                    className="px-5 py-2 text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl font-medium shadow-md transition-all flex items-center gap-2"
                >
                    {loading ? <FaSpinner className="animate-spin"/> : <FaSave />}
                    {isEdit ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
            </div>
        </form>
    );
};

export default ChucNangFormModal;