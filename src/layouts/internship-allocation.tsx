import HeaderHome from '../components/header/header_home';
import FooterHome from '../components/footer/footer_home';
import Sidebar from "../components/drawer/index";
import { Outlet } from 'react-router-dom';

export default function InternshipAllocationLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">

            {/* Header */}
            <HeaderHome />

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-1/5   p-6">
                    <Sidebar />
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 p-6">
                    <Outlet /> {/* Nội dung con sẽ render ở đây */}
                </div>
            </div>

            {/* Footer */}
            <FooterHome />
        </div>
    );
}
