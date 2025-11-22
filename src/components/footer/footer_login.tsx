export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-blue-100 pt-10 pb-4 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Thông tin trường */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-white">
            TRƯỜNG ĐẠI HỌC CÔNG THƯƠNG TP.HCM
          </h3>
          <p className="text-sm leading-relaxed">
            Địa chỉ: 140 Lê Trọng Tấn, Phường Tây Thạnh, Quận Tân Phú, TP. Hồ Chí Minh
          </p>
          <p className="text-sm mt-2">📞 Điện thoại: (028) 3816 3319</p>
          <p className="text-sm">📧 Email: contact@huit.edu.vn</p>
          <p className="text-sm">🌐 Website: www.huit.edu.vn</p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white hover:underline">Giới thiệu</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Tuyển sinh</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Đào tạo</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Tra cứu điểm</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        {/* Phòng - Ban */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Phòng – Ban</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white hover:underline">Phòng Đào tạo</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Phòng Công tác sinh viên</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Phòng Hành chính – Quản trị</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Thư viện</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Trung tâm CNTT</a></li>
          </ul>
        </div>

        {/* Bản đồ vị trí */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-white">Vị trí</h3>
          <div className="w-full h-52 overflow-hidden rounded-md shadow-lg border border-blue-700">
            <iframe
              title="HUIT Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.013532574592!2d106.62267907573244!3d10.811784358521704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ddac0d0632b%3A0x8db7e5b1e2e5c1b7!2zVHLGsOG7nW5nIMSQ4bqhYyBo4buNYyBDw7RuZyBUaMO0bmcgVGjhuqFuaCBQaOG7kSBI4buTIE3hu5lp!5e0!3m2!1sen!2s!4v1730206012345"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Công ty liên kết */}
      <div className="max-w-7xl mx-auto mt-8">
        <h3 className="text-lg font-semibold mb-3 text-white">Đối tác & Công ty liên kết</h3>
        <div className="flex flex-wrap gap-4 text-sm text-blue-200">
          <span>• FPT Software</span>
          <span>• Viettel</span>
          <span>• VNG Corporation</span>
          <span>• TMA Solutions</span>
          <span>• VinGroup</span>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="border-t border-blue-700 mt-8 pt-3 text-center text-sm text-blue-300">
        © {new Date().getFullYear()} Trường Đại học Công Thương TP.HCM – HUIT.  
        <br />Mọi quyền được bảo lưu.
      </div>
    </footer>
  );
}
