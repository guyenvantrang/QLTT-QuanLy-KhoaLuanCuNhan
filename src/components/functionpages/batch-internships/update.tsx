import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiUsers, FiFileText, FiTag, FiSave, FiXCircle, FiInfo, FiCheckCircle } from "react-icons/fi";
import { update, GetByIDFunction } from "../../../functions/batch-internship";
import type { DotThucTap } from "../../../models/model-all";
import React from "react";

// --- COMPONENTS HỖ TRỢ (Tái sử dụng từ AddDotThucTapForm) ---

// Component cho Input cơ bản (Text, Number)
const InputGroup = ({ label, name, type, placeholder, Icon, defaultValue }: { label: string, name: string, type: string, placeholder: string, Icon: React.ElementType, defaultValue?: string | number }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="flex items-center gap-2 font-medium text-gray-700 mb-1 text-sm">
            <Icon className="text-indigo-500 w-4 h-4" /> {label}
        </label>
        <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
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
        
        {/* Container cho input và icon button area */}
        <div className="relative group">
            <input
                id={name}
                type="datetime-local"
                name={name}
                // Đảm bảo dữ liệu ngày tháng đã được slice(0, 16) trước khi truyền vào
                defaultValue={defaultValue?.slice(0, 16)} 
                // Tinh chỉnh padding phải (pr-12) để chừa chỗ cho khu vực icon 
                className="w-full border border-gray-300 rounded-xl pl-4 pr-12 py-2 text-sm text-gray-800 font-medium 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all 
                           cursor-pointer appearance-none bg-white hover:border-indigo-400"
                required
            />
            {/* Custom Icon Area (Tạo hiệu ứng nút bấm tích hợp) */}
            <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center rounded-r-xl 
                          bg-indigo-100 group-hover:bg-indigo-200 border-l border-gray-300 pointer-events-none transition-colors">
                <FiCalendar className="text-indigo-700 w-4 h-4" />
            </div>
        </div>
        
        <p className="text-[10px] text-gray-400 mt-1 pl-1 italic">{description}</p>
    </div>
);

// --- COMPONENT CHÍNH ---

export default function UpdateDotThucTapForm() {
    const navigate = useNavigate();
    const { madot } = useParams<{ madot: string }>();
    const [updatedotthuctap, setUpdatedotthuctap] = useState<DotThucTap | null>(null);

    // Load dữ liệu khi component mount
    useEffect(() => {
        if (!madot) return;
        
        // Hàm chuyển đổi JSON date string sang ISO string (YYYY-MM-DDTHH:MM:SSZ)
        // và trích xuất phần cần thiết cho input datetime-local.
        const formatDotThucTapDates = (data: DotThucTap) => {
             // Hàm helper để định dạng ngày tháng
            const formatIfValid = (dateString?: string): string | undefined => {
                if (!dateString) return undefined;
                // Nếu dữ liệu trả về là chuỗi ISO 8601 (có thể có Z), lấy 16 ký tự đầu
                try {
                    return dateString.slice(0, 16);
                } catch (e) {
                    console.error("Lỗi định dạng ngày:", dateString, e);
                    return undefined;
                }
            };

            return {
                ...data,
                ngaylap: formatIfValid(data.ngaylap),
                thoigiantrienkhai: formatIfValid(data.thoigiantrienkhai),
                thoigianketthuc: formatIfValid(data.thoigianketthuc),
                thoigianketthucdangky: formatIfValid(data.thoigianketthucdangky),
                thoigianketthucchinhsua: formatIfValid(data.thoigianketthucchinhsua),
            } as DotThucTap;
        };

        GetByIDFunction(madot)
            .then((res) => {
                const data = Array.isArray(res) ? res[0] : res;
                if (data) {
                    setUpdatedotthuctap(formatDotThucTapDates(data));
                } else {
                    setUpdatedotthuctap(null);
                }
            })
            .catch((err) => console.error("Lỗi tải dữ liệu:", err));
    }, [madot]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            await update(e, navigate);
        } catch (error) {
            console.error(error);
        }
    };

    // Nếu dữ liệu chưa load xong
    if (!updatedotthuctap) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-xl text-indigo-600 flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải dữ liệu đợt thực tập...
            </div>
        </div>
    );
    
    // Hàm chuyển trạng thái số sang chữ để dễ đọc
    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return "Chuẩn bị / Đang Đăng ký";
            case 1: return "Đang diễn ra / Triển khai";
            case 2: return "Đã kết thúc";
            default: return "Không xác định";
        }
    };

    return (
        // Container chính: Tối ưu cho hiển thị, full-width, gradient nền nhẹ
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 font-sans">

            {/* Header Form */}
            <header className="mb-6  mx-auto"> 
                <h2 className="text-2xl font-extrabold text-indigo-700 border-b border-indigo-200 pb-2 flex items-center gap-2">
                    <FiTag className="text-indigo-500 w-6 h-6" /> Sửa Đợt Thực Tập: 
                    <span className="font-mono text-xl font-bold ml-2 text-purple-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">{updatedotthuctap.madot}</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                    <FiInfo size={14} className="text-blue-400" /> Cập nhật thông tin chi tiết cho đợt thực tập này.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="w-full">
                <div className="max-w-8xl mx-auto space-y-4"> 

                    <input type="hidden" name="madot" value={updatedotthuctap.madot} />
                
                    {/* 1. THÔNG TIN CƠ BẢN (CARD 1) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"> 
                        <h3 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2 border-b pb-2 border-indigo-100">
                            <FiFileText className="text-indigo-500 w-5 h-5" /> Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> 
                            
                            <InputGroup 
                                label="Tên đợt" 
                                name="tendot" 
                                type="text" 
                                placeholder="Nhập tên đợt thực tập" 
                                Icon={FiTag}
                                defaultValue={updatedotthuctap.tendot} 
                            />

                            <InputGroup 
                                label="Số lượng đăng ký tối đa" 
                                name="soluongdangky" 
                                type="number" 
                                placeholder="Nhập số lượng tối đa sinh viên" 
                                Icon={FiUsers} 
                                defaultValue={updatedotthuctap.soluongdangky}
                            />
                            
                        </div>
                    </section>

                    {/* 2. TRẠNG THÁI (CARD 2) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2 border-b pb-2 border-indigo-100">
                            <FiCheckCircle className="text-indigo-500 w-5 h-5" /> Trạng thái hiện tại
                        </h3>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-3 text-sm">
                                Cập nhật trạng thái đợt thực tập: 
                                <span className="font-semibold text-indigo-600 ml-2">{getStatusText(updatedotthuctap.trangthai||0)}</span>
                            </label>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                                <RadioGroup label="0 - Đăng ký" value="0" name="trangthai" defaultChecked={updatedotthuctap.trangthai === 0} color="yellow" />
                                <RadioGroup label="1 - Đang triển khai" value="1" name="trangthai" defaultChecked={updatedotthuctap.trangthai === 1} color="green" />
                                <RadioGroup label="2 - Đã kết thúc" value="2" name="trangthai" defaultChecked={updatedotthuctap.trangthai === 2} color="gray" />
                            </div>
                        </div>
                    </section>


                    {/* 3. THỜI GIAN TRIỂN KHAI (CARD 3) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"> 
                        <h3 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2 border-b pb-2 border-indigo-100">
                            <FiClock className="text-indigo-500 w-5 h-5" /> Quản lý Thời gian
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"> 

                            {/* Ngày lập */}
                            <DateTimeInput 
                                label="Ngày lập hồ sơ" 
                                name="ngaylap" 
                                Icon={FiCalendar}
                                defaultValue={updatedotthuctap.ngaylap} 
                                description="Thời điểm tạo hồ sơ đợt thực tập"
                            />

                            {/* Thời gian triển khai (Bắt đầu) */}
                            <DateTimeInput 
                                label="Bắt đầu thực tập" 
                                name="thoigiantrienkhai" 
                                Icon={FiClock}
                                defaultValue={updatedotthuctap.thoigiantrienkhai}
                                description="Thời điểm sinh viên chính thức thực tập"
                            />

                            {/* Thời gian kết thúc */}
                            <DateTimeInput 
                                label="Kết thúc thực tập" 
                                name="thoigianketthuc" 
                                Icon={FiCalendar}
                                defaultValue={updatedotthuctap.thoigianketthuc}
                                description="Thời điểm kết thúc đợt thực tập"
                            />

                            {/* Kết thúc đăng ký */}
                            <DateTimeInput 
                                label="Hạn chót đăng ký" 
                                name="thoigianketthucdangky" 
                                Icon={FiCalendar}
                                defaultValue={updatedotthuctap.thoigianketthucdangky}
                                description="Thời điểm đóng cổng đăng ký"
                            />

                            {/* Kết thúc chỉnh sửa */}
                            <DateTimeInput 
                                label="Hạn chót chỉnh sửa" 
                                name="thoigianketthucchinhsua" 
                                Icon={FiCalendar}
                                defaultValue={updatedotthuctap.thoigianketthucchinhsua}
                                description="Thời điểm đóng cổng chỉnh sửa hồ sơ"
                            />
                            
                        </div>
                    </section>

                    {/* 4. GHI CHÚ (CARD 4) */}
                    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"> 
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
                                rows={3} 
                                placeholder="Nhập các thông tin ghi chú cần thiết..."
                                defaultValue={updatedotthuctap.ghitru}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none hover:border-blue-400"
                            ></textarea>
                        </div>
                    </section>

                    {/* Footer buttons */}
                    <div className="flex justify-end gap-4 pb-4"> 
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
                            <FiSave className="w-5 h-5" /> Lưu thay đổi
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

// Component cho Radio Button tùy chỉnh
const RadioGroup = ({ label, value, name, defaultChecked, color }: { label: string, value: string, name: string, defaultChecked: boolean, color: 'yellow' | 'green' | 'gray' }) => {
    
    let accentClass = '';
    let dotClass = '';
    switch (color) {
        case 'yellow':
            accentClass = 'accent-yellow-500';
            dotClass = 'bg-yellow-500';
            break;
        case 'green':
            accentClass = 'accent-green-500';
            dotClass = 'bg-green-500';
            break;
        case 'gray':
            accentClass = 'accent-gray-500';
            dotClass = 'bg-gray-500';
            break;
    }

    return (
        <label className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors 
                           ${defaultChecked ? `bg-${color}-50 border border-${color}-200` : 'hover:bg-gray-50'}`}>
            <input
                type="radio"
                name={name}
                value={value}
                defaultChecked={defaultChecked}
                className={`w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 ${accentClass}`}
            />
            <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`}></span>
                {label}
            </span>
        </label>
    );
};