import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiUsers, FiFileText, FiTag, FiSave, FiXCircle, FiInfo } from "react-icons/fi";
import { create } from "../../../functions/batch-internship"

// Hàm lấy ngày giờ hiện tại ở định dạng datetime-local (YYYY-MM-DDTHH:MM)
const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
};

export default function AddDotThucTapForm() {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            await create(e, navigate);
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        // Container chính: Tối ưu cho hiển thị, giảm padding tổng thể
        <div className=" bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 font-sans">

            {/* Header Form */}
            <header className="mb-6  mx-auto">
                <h2 className="text-2xl font-extrabold text-indigo-700 border-b border-indigo-200 pb-2 flex items-center gap-2">
                    <FiTag className="text-indigo-500 w-6 h-6" /> Thêm Đợt Thực Tập Mới
                </h2>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                    <FiInfo size={14} className="text-blue-400" /> Vui lòng điền đầy đủ thông tin để tạo đợt thực tập.
                </p>
            </header>

            {/* Main content - Loại bỏ khoảng cách thừa, tối ưu chiều dọc */}
            <form onSubmit={handleSubmit} className="w-full">

                {/* Container cho các Card, giữ giới hạn chiều rộng nội dung */}
                <div className=" mx-auto space-y-4"> {/* Giảm space-y từ 8 xuống 4 */}

                    {/* 1. THÔNG TIN CƠ BẢN (CARD 1) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"> {/* Giảm padding từ 8/10 xuống 6 */}
                        <h3 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2 border-b pb-2 border-indigo-100">
                            <FiFileText className="text-indigo-500 w-5 h-5" /> Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> {/* Giảm gap từ 8 xuống 5 */}

                            <InputGroup
                                label="Tên đợt"
                                name="tendot"
                                type="text"
                                placeholder="Ví dụ: Đợt Thực tập Hè 2025"
                                Icon={FiTag}
                            />

                            <InputGroup
                                label="Số lượng đăng ký tối đa"
                                name="soluongdangky"
                                type="number"
                                placeholder="Nhập số lượng tối đa sinh viên"
                                Icon={FiUsers}
                            />

                        </div>
                    </section>

                    {/* 2. THỜI GIAN TRIỂN KHAI (CARD 2) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"> {/* Giảm padding từ 8/10 xuống 6 */}
                        <h3 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2 border-b pb-2 border-indigo-100">
                            <FiClock className="text-indigo-500 w-5 h-5" /> Quản lý Thời gian
                        </h3>
                        {/* Thay đổi layout thành grid 2 cột cho desktop để tối ưu không gian chiều dọc */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                            {/* Ngày lập */}
                            <DateTimeInput
                                label="Ngày lập hồ sơ"
                                name="ngaylap"
                                Icon={FiCalendar}
                                defaultValue={getCurrentDateTimeLocal()} // Đặt giá trị mặc định là hiện tại
                                description="Thời điểm tạo hồ sơ đợt thực tập"
                            />

                            {/* Thời gian triển khai (Bắt đầu) */}
                            <DateTimeInput
                                label="Bắt đầu thực tập"
                                name="thoigiantrienkhai"
                                Icon={FiClock}
                                description="Thời điểm sinh viên chính thức thực tập"
                            />

                            {/* Thời gian kết thúc */}
                            <DateTimeInput
                                label="Kết thúc thực tập"
                                name="thoigianketthuc"
                                Icon={FiCalendar}
                                description="Thời điểm kết thúc đợt thực tập"
                            />

                            {/* Kết thúc đăng ký */}
                            <DateTimeInput
                                label="Hạn chót đăng ký"
                                name="thoigianketthucdangky"
                                Icon={FiCalendar}
                                description="Thời điểm đóng cổng đăng ký"
                            />

                            {/* Kết thúc chỉnh sửa */}
                            <DateTimeInput
                                label="Hạn chót chỉnh sửa"
                                name="thoigianketthucchinhsua"
                                Icon={FiCalendar}
                                description="Thời điểm đóng cổng chỉnh sửa hồ sơ"
                            />

                            {/* Ô trống để căn chỉnh grid 2 cột */}
                            <div className="hidden md:block"></div>
                        </div>
                    </section>

                    {/* 3. GHI CHÚ (CARD 3) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"> {/* Giảm padding từ 8/10 xuống 6 */}
                        <h3 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2 border-b pb-2 border-indigo-100">
                            <FiFileText className="text-indigo-500 w-5 h-5" /> Ghi chú
                        </h3>
                        <div className="flex flex-col">
                            <label htmlFor="ghitru" className="font-medium text-gray-700 mb-2 text-sm">
                                Nội dung ghi chú
                            </label>
                            <textarea
                                id="ghitru"
                                name="ghitru"
                                rows={3} // Giảm rows từ 5 xuống 3 để tiết kiệm không gian
                                placeholder="Nhập các thông tin ghi chú cần thiết..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none hover:border-blue-400"
                            ></textarea>
                        </div>
                    </section>

                    {/* Footer buttons */}
                    <div className="flex justify-end gap-4 pb-4"> {/* Giảm padding bottom */}
                        <button
                            type="button"
                            onClick={() => navigate("/batch-internship")}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 text-red-600 font-semibold bg-white hover:bg-red-50 transition-all shadow-md text-sm"
                        >
                            <FiXCircle className="w-5 h-5" /> Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.01] text-sm"
                        >
                            <FiSave className="w-5 h-5" /> Lưu & Tạo đợt
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

// === CÁC COMPONENTS HỖ TRỢ GIAO DIỆN ĐÃ TỐI ƯU ===

// Component cho Input cơ bản (Text, Number)
const InputGroup = ({ label, name, type, placeholder, Icon }: { label: string, name: string, type: string, placeholder: string, Icon: React.ElementType }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
            <Icon className="text-indigo-500 w-4 h-4" /> {label}
        </label>
        <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm hover:border-blue-400"
            required
        />
    </div>
);

// Component cho Input Date/Time (Cải tiến định dạng và mặc định giá trị)
const DateTimeInput = ({ label, name, Icon, description, defaultValue }: { label: string, name: string, Icon: React.ElementType, description: string, defaultValue?: string }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="flex items-center justify-between font-medium text-gray-700 mb-1 text-sm">
            <span className="flex items-center gap-2">
                <Icon className="text-indigo-500 w-4 h-4" /> {label}
            </span>
        </label>
        <input
            id={name}
            type="datetime-local"
            name={name}
            defaultValue={defaultValue} // Thêm giá trị mặc định nếu có
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm cursor-pointer hover:border-indigo-400 appearance-none bg-white font-mono text-gray-800"
            required
        />
        <p className="text-[10px] text-gray-400 mt-1 pl-1 italic">{description}</p> {/* Giảm cỡ chữ mô tả */}
    </div>
);