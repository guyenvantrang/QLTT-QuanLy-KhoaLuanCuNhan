import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaGlobe, FaKey, FaLayerGroup, FaInfoCircle, FaHashtag, FaSpinner } from "react-icons/fa";
import toast from 'react-hot-toast';
import type { ChucNang, TrangWeb } from "../../../models/model-all";
import { addChucNang, updateChucNang , getAllTrangWeb} from "../../../api/login";


interface ChucNangFormModalProps {
    isEdit: boolean;
    initialData?: ChucNang | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ChucNangFormModal: React.FC<ChucNangFormModalProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<ChucNang>>({
        machucnang: '',
        tenchucnang: '',
        matruycap: '', // Mã code dùng để check quyền trong code (VD: USER_VIEW)
        matrang: '',   // Foreign Key
        mota: ''
    });
    
    const [trangWebList, setTrangWebList] = useState<TrangWeb[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch danh sách Trang Web để đưa vào Select Box
    useEffect(() => {
        const fetchTrangWeb = async () => {
            try {
                const data = await getAllTrangWeb();
                setTrangWebList(data || []);
            } catch (error) {
                console.error("Lỗi tải trang web", error);
                toast.error("Không thể tải danh sách trang web");
            }
        };
        fetchTrangWeb();
    }, []);

    // 2. Fill data nếu là Edit
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                ...initialData,
                matrang: initialData.matrang || '', // Đảm bảo không undefined
            });
        }
    }, [isEdit, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.tenchucnang || !formData.matruycap || !formData.matrang) {
            toast.error("Vui lòng điền Tên, Mã truy cập và chọn Trang web!");
            setLoading(false);
            return;
        }

        try {
            // Payload
            const payload = {
                tenchucnang: formData.tenchucnang,
                matruycap: formData.matruycap,
                matrang: formData.matrang,
                mota: formData.mota
                // Không gửi machucnang khi Add vì tự động sinh
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
            // Error handled by toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cột Trái */}
                <div className="space-y-4">
                    {/* Mã chức năng (Chỉ hiện khi Edit) */}
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
                            placeholder="VD: Xem danh sách người dùng"
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
                            placeholder="VD: USER_VIEW, USER_EDIT"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all bg-slate-50"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 italic">Mã này dùng để kiểm tra quyền trong source code.</p>
                    </div>
                </div>

                {/* Cột Phải */}
                <div className="space-y-4">
                    {/* Chọn Trang Web */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FaGlobe className="text-indigo-500"/> Thuộc Trang Web <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="matrang"
                                value={formData.matrang}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            >
                                <option value="">-- Chọn trang web --</option>
                                {trangWebList.map(web => (
                                    <option key={web.matrang} value={web.matrang}>
                                        {web.tentrang} ({web.diachitruycap || web.diachitruycap})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
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