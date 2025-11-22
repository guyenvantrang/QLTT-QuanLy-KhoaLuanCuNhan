
import Header from "../components/header/header_login";
import Footer from "../components/footer/footer_login";
import LoginForm from "../components/form/form_login";
import { BellIcon } from "@heroicons/react/24/outline";
import NotificationPage from "../components/Notification/notificationpage_login";

export default function LoginLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            
            {/* Header */}
            <Header />

            {/* Body Layout */}
            <div className="flex flex-1 flex-col md:flex-row">

                {/* LEFT – Banner + Notification */}
                <div className="md:w-[75%] w-full bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-10 flex flex-col justify-between">

                    {/* Title */}
                    <div>
                        <h1 className="text-4xl font-bold leading-snug drop-shadow">
                            Hệ thống Quản lý Sinh viên
                        </h1>
                    </div>

                    {/* Notification (Glass UI) */}
                    <div className="mt-10 bg-white/20 backdrop-blur-md rounded-xl p-5 h-[70vh]  shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <BellIcon className="w-6 h-6 text-yellow-300" />
                            <h2 className="text-lg font-semibold text-white/90">
                                Thông báo mới
                            </h2>
                        </div>
                        <NotificationPage />
                    </div>

                    <p className="text-xs text-blue-200 mt-6 opacity-80 text-right italic">
                        * Cập nhật liên tục từ Phòng Đào tạo và các Khoa
                    </p>
                </div>

                {/* RIGHT – Login Form */}
                <div className="md:w-[25%] w-full  items-center p-8">
                    <div className="w-full max-w-md">
                        <LoginForm  />
                    </div>
                </div>
            </div>
            

            {/* Footer */}
            <Footer />
        </div>
    );
}
