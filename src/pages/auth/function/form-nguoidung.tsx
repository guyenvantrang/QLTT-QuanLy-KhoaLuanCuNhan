import React, { useState, useEffect } from "react";
import {
    FaSave, FaTimes, FaTag, FaInfoCircle, FaSpinner,
    FaHashtag, FaUser, FaLock, FaUserTie
} from "react-icons/fa";
import type { NguoiDung, ChucVu } from "../../../models/model-all"; // Import model
import { addNguoiDung, updateNguoiDung, getAllChucVu } from "../../../api/login"; // Import API

interface NguoiDungFormModalProps {
    isEdit: boolean;
    initialData?: NguoiDung | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Component chung cho Form Thêm/Sửa Người Dùng
const NguoiDungFormModal: React.FC<NguoiDungFormModalProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
    // State cho Form Data
    const [formData, setFormData] = useState<Partial<NguoiDung>>({
        taikhoan: '',
        tennguoidung: '',
        machucvu: '', // Mã chức vụ sẽ chọn từ dropdown
        matkhau: ''   // Thêm trường mật khẩu (lưu ý bảo mật ở backend)
    });

    // State cho danh sách chức vụ (để hiển thị trong Select)
    const [chucVuList, setChucVuList] = useState<ChucVu[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch danh sách chức vụ khi Modal mở
    useEffect(() => {
        const fetchChucVu = async () => {
            try {
                const res = await getAllChucVu();
                setChucVuList(res || []);
            } catch (err) {
                console.error("Lỗi tải danh sách chức vụ", err);
            }
        };
        fetchChucVu();
    }, []);

    // Fill dữ liệu khi ở chế độ Sửa
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                ...initialData,
                matkhau: '' // Không hiển thị mật khẩu cũ, để trống nghĩa là không đổi
            });
        }
    }, [isEdit, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!formData.taikhoan || !formData.tennguoidung || !formData.machucvu) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            setLoading(false);
            return;
        }

        if (!isEdit && !formData.matkhau) {
            setError("Vui lòng nhập mật khẩu cho người dùng mới.");
            setLoading(false);
            return;
        }

        try {
            if (isEdit) {
                const dataToSend = { ...formData };
                if (!formData.matkhau) delete dataToSend.matkhau;

                await updateNguoiDung(initialData!.manguoidung,
                    {
                       machucvu: dataToSend.machucvu ,
                       tennguoidung : dataToSend.tennguoidung,
                       taikhoan:dataToSend.taikhoan,
                       matkhau:dataToSend.matkhau
                    });
                alert("Cập nhật người dùng thành công!");
            } else {
                await addNguoiDung(formData);
                alert("Thêm mới người dùng thành công!");
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2 border-indigo-100">
                {isEdit ? `Cập nhật Người dùng: ${formData.tennguoidung}` : "Thêm mới Người dùng"}
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm" role="alert">
                    <FaInfoCircle className="inline mr-2" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Cột 1 */}
                <div className="space-y-4">

                    {/* Tên đăng nhập */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
                            <FaUser className="text-indigo-500" /> Tên đăng nhập <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="taikhoan"
                            value={formData.taikhoan}
                            onChange={handleChange}
                            placeholder="VD: nguyenvana"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
                            <FaLock className="text-indigo-500" /> Mật khẩu {isEdit && <span className="text-gray-400 font-normal text-xs">(Để trống nếu không đổi)</span>}
                        </label>
                        <input
                            type="password"
                            name="matkhau"
                            value={formData.matkhau}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            // Bắt buộc nếu là thêm mới
                            required={!isEdit}
                        />
                    </div>
                </div>

                {/* Cột 2 */}
                <div className="space-y-4">
                    {/* Họ tên */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
                            <FaTag className="text-indigo-500" /> Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="tennguoidung"
                            value={formData.tennguoidung}
                            onChange={handleChange}
                            placeholder="VD: Nguyễn Văn A"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    {/* Chức vụ (Select Box) */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
                            <FaUserTie className="text-indigo-500" /> Chức vụ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="machucvu"
                                value={formData.machucvu}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none appearance-none bg-white"
                                required
                            >
                                <option value="" disabled>-- Chọn chức vụ --</option>
                                {chucVuList.map((cv) => (
                                    <option key={cv.machucvu} value={cv.machucvu}>
                                        {cv.tenchucvu}
                                    </option>
                                ))}
                            </select>
                            {/* Mũi tên custom cho đẹp */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8 border-t pt-4">
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
                    {isEdit ? "Lưu Cập nhật" : "Thêm Người dùng"}
                </button>
            </div>
        </form>
    );
};

export default NguoiDungFormModal;