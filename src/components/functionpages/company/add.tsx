import { useNavigate } from "react-router-dom";
import { FiUser, FiHome, FiMail, FiPhone, FiFileText, FiTag } from "react-icons/fi";
import { createCompany } from "../../../functions/company"; // giả sử có hàm createCompany

export default function AddCongTyForm() {
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            await createCompany(e, navigate);
        } catch (error) {
            console.error(error);
        }
    };

    // Options cho dropdown
    const phanloaiOptions = [
        { value: "0", label: "Sinh viên" },
        { value: "1", label: "Trường học" },
        { value: "2", label: "Giới thiệu" },
    ];

    const hoatdongOptions = [
        { value: "0", label: "Không hoạt động" },
        { value: "1", label: "Có hoạt động" },
    ];

    return (
        <div className="w-full  bg-gray-50 flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full bg-white   p-8 space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thêm công ty thực tập</h2>

                {/* Grid thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Tên công ty */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiUser /> Tên công ty
                        </label>
                        <input
                            type="text"
                            name="tencongty"
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
                            placeholder="Nhập số điện thoại"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiPhone /> Lĩnh vực
                        </label>
                        <input
                            type="text"
                            name="linhvuc"
                            placeholder="Nhập lĩnh vực"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Phân loại */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiTag /> Phân loại
                        </label>
                        <select
                            name="phanloai"
                            defaultValue="1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            {phanloaiOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hoạt động */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                            <FiTag /> Hoạt động
                        </label>
                        <select
                            name="hoatdong"
                            defaultValue="1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            {hoatdongOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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
                        placeholder="Nhập thông tin giới thiệu hoặc ghi chú"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    ></textarea>
                </section>

                {/* Footer buttons */}
                <div className="flex justify-end gap-4 mt-4">
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
