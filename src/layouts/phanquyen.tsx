import HeaderHome from '../components/header/header_home';
import FooterHome from '../components/footer/footer_home';
import { Outlet } from 'react-router-dom';

export default function PhanQuyenLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <HeaderHome />
            <Outlet /> 
            <FooterHome />
        </div>
    );
}
