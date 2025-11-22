import HeaderHome from '../components/header/header_home';
import FooterHome from '../components/footer/footer_home';
import HomePage from '../pages/home';

export default function Homelayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Header */}
      <HeaderHome />

      <HomePage />

      {/* Footer */}
      <FooterHome />
    </div>
  );
}
