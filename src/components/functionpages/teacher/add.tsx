import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiFileText } from "react-icons/fi";
import { Create } from "../../../functions/teacher";

export default function AddGiangVienForm() {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        try { 
            await Create(e, navigate); 
        } catch (error) { 
            console.error(error); 
        } 
    };

    return (
        <div className="w-full bg-gray-100 flex flex-col min-h-screen">

            {/* Main content */}
            <form onSubmit={handleSubmit}>
                <main className="flex-1 overflow-auto">
                    <div className="mx-auto space-y-2 max-w-1xl p-4 md:p-6">

                        {/* Phần 1: Thông tin cơ bản */}
                        <section className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">Thêm giảng viên</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                

                                <div className="flex flex-col">
                                    <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                                        <FiUser /> Tên giảng viên
                                    </label>
                                    <input
                                        type="text"
                                        name="tengiangvien"
                                        placeholder="Nhập tên giảng viên"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                                        <FiMail /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Nhập email"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                                        <FiPhone /> Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        name="sdt"
                                        placeholder="Nhập số điện thoại"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Phần 2: Trạng thái */}
                        <section className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">Trạng thái</h3>
                            <div className="flex gap-8">
                                {[
                                    { value: "1", label: "Hoạt động" },
                                    { value: "2", label: "Ngưng hoạt động" },
                                ].map((option) => (
                                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="trangthai"
                                            value={option.value}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="font-medium text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Phần 3: Ghi chú */}
                        <section className="bg-white rounded-xl shadow p-6">
                            <div className="flex flex-col">
                                <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                                    <FiFileText /> Nội dung ghi chú
                                </label>
                                <textarea
                                    name="ghichu"
                                    rows={5}
                                    placeholder="Nhập ghi chú (nếu có)"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                ></textarea>
                            </div>
                        </section>

                        {/* Footer buttons */}
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/teacher")}
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

                    </div>
                </main>
            </form>
        </div>
    );
}