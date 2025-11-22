import { useEffect, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { FaTimes, FaChevronDown, FaChevronUp, FaBuilding, FaCalendarAlt, FaUserGraduate, FaInfoCircle, FaFileAlt, FaComments, FaStar, FaBriefcase, FaUsers, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import type { GiangVien, DangKyThucTap, GioiThieuCongTy } from "../../../models/model-all";
import { Laythongtinlienquan } from "../../../functions/teacher";

interface LecturerModalProps {
  magiangvien: string;
  onClose: () => void;
}

export default function LecturerModalFull({ magiangvien, onClose }: LecturerModalProps) {
  const [lecturer, setLecturer] = useState<GiangVien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'batches'>('suggestions');
  const [selectedSuggestion, setSelectedSuggestion] = useState<GioiThieuCongTy | null>(null);
  const [selectedDot, setSelectedDot] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<DangKyThucTap | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Laythongtinlienquan(magiangvien);
        setLecturer(data || null);
      } catch (err) {
        setError("Failed to load lecturer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [magiangvien]);

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-7xl h-full max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="flex justify-center items-center h-full">Loading...</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  if (error || !lecturer) {
    return (
      <Dialog open={true} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-7xl h-full max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="flex justify-center items-center h-full">{error || "No data found."}</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  // Extract unique dots from dangkythuctap
  const uniqueDots = Array.from(
    new Set((lecturer.dangkythuctap ?? []).map((reg) => reg.madot))
  );

  // Filter registrations by selected dot
  const registrationsInDot = selectedDot
    ? (lecturer.dangkythuctap ?? []).filter((reg) => reg.madot === selectedDot)
    : [];

  const handleSuggestionClick = (suggestion: GioiThieuCongTy) => {
    setSelectedSuggestion(suggestion);
  };

  const handleBatchClick = (dot: string) => {
    setSelectedDot(dot);
    setSelectedRegistration(null); // Reset selection
  };

  const handleStudentClick = (reg: DangKyThucTap) => {
    setSelectedRegistration(reg);
  };

  const SuggestionDetail = ({ suggestion }: { suggestion: GioiThieuCongTy }) => (
    <div className="space-y-4">
      <section className="p-4 bg-white rounded-lg border border-gray-200 shadow-md">
        <h3 className="font-semibold text-lg mb-3 flex items-center"><FaBuilding className="mr-2 text-blue-500" /> Chi Tiết Đề Xuất</h3>
        <p className="text-sm mb-1"><strong>Mã Đề Xuất:</strong> {suggestion.madexuat}</p>
        <p className="text-sm mb-1"><strong>Công Ty:</strong> {suggestion.congtythuctap?.tencongty}</p>
        <p className="text-sm mb-1"><strong>Trạng Thái:</strong> {suggestion.trangthai}</p>
        <p className="text-sm mb-1"><strong>Ngày:</strong> {suggestion.ngaydexuat}</p>
        <p className="text-sm"><strong>Mô Tả:</strong> {suggestion.mota}</p>
      </section>
      {/* Add more sections for suggestion details if available */}
    </div>
  );

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <Transition.Child
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      </Transition.Child>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full  h-full max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col shadow-2xl">
            {/* Fixed Header: Lecturer Basic Info with Gradient */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
              <div className="flex items-center space-x-6">
                <Dialog.Title className="text-2xl font-bold flex items-center">
                  <FaUserGraduate className="mr-2 h-6 w-6" />
                  {lecturer.tengiangvien} ({lecturer.magiangvien})
                </Dialog.Title>
                <div className="text-sm flex items-center space-x-4">
                  <p className="flex items-center"><FaEnvelope className="mr-2 text-gray-300" /> {lecturer.email}</p>
                  <p className="flex items-center"><FaPhoneAlt className="mr-2 text-gray-300" /> {lecturer.sdt}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setActiveTab('suggestions');
                    setSelectedSuggestion(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'suggestions'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  Đề Xuất Công Ty ({(lecturer.gioithieucongty || []).length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('batches');
                    setSelectedDot(null);
                    setSelectedRegistration(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'batches'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  Đợt Thực Tập ({uniqueDots.length})
                </button>
              </div>
              <button onClick={onClose} className="hover:opacity-75 transition-opacity">
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Main Body: Flexible layout to fill space */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar: Dynamic based on tab */}
              <div className="w-1/4 bg-gradient-to-b from-gray-100 to-gray-50 p-6 overflow-y-auto border-r border-gray-300 shadow-inner">
                {activeTab === 'suggestions' ? (
                  /* Suggestions List */
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center"><FaBuilding className="mr-2 text-blue-500" /> Danh Sách Đề Xuất</h3>
                    <ul className="space-y-3 overflow-y-auto max-h-96">
                      {(lecturer.gioithieucongty || []).map((suggestion) => (
                        <li
                          key={suggestion.madexuat}
                          className={`p-3 cursor-pointer rounded-lg border border-gray-200 shadow-sm transition-all ${selectedSuggestion?.madexuat === suggestion.madexuat
                              ? 'bg-gradient-to-r from-blue-200 to-blue-100'
                              : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100'
                            }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="font-medium text-sm">{suggestion.congtythuctap?.tencongty || suggestion.madexuat}</div>
                          <div className="text-xs text-gray-500">{suggestion.trangthai}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  /* Batches and Students List */
                  <div>
                    {/* Dots List */}
                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-3 flex items-center"><FaCalendarAlt className="mr-2 text-indigo-500" /> Danh Sách Đợt</h3>
                      <ul className="space-y-3 overflow-y-auto max-h-48">
                        {uniqueDots.map((dot) => (
                          <li
                            key={dot}
                            className={`p-3 cursor-pointer rounded-lg border border-gray-200 shadow-sm transition-all ${selectedDot === dot
                                ? 'bg-gradient-to-r from-indigo-200 to-indigo-100'
                                : 'bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100'
                              }`}
                            onClick={() => handleBatchClick(dot)}
                          >
                            {dot}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Students List if dot selected */}
                    {selectedDot && (
                      <div>
                        <h3 className="font-bold text-lg mb-3 flex items-center"><FaUsers className="mr-2 text-green-500" /> Sinh Viên ({registrationsInDot.length})</h3>
                        <ul className="space-y-3 overflow-y-auto max-h-96">
                          {registrationsInDot.map((reg: DangKyThucTap) => (
                            <li
                              key={reg.masv}
                              className={`p-3 cursor-pointer rounded-lg border border-gray-200 shadow-sm transition-all ${selectedRegistration?.masv === reg.masv
                                  ? 'bg-gradient-to-r from-green-200 to-green-100'
                                  : 'bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100'
                                }`}
                              onClick={() => handleStudentClick(reg)}
                            >
                              <div className="font-medium text-sm">{reg.sinhvien?.hoten} ({reg.masv})</div>
                              <div className="text-xs text-gray-500">{reg.trangthai}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Main Content: Dynamic Details */}
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
                {activeTab === 'suggestions' ? (
                  selectedSuggestion ? (
                    <SuggestionDetail suggestion={selectedSuggestion} />
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500 text-lg">
                      Chọn một đề xuất từ danh sách bên trái để xem chi tiết.
                    </div>
                  )
                ) : selectedRegistration ? (
                  /* Existing Student Details Code - Keep as is */
                  <div>
                    <h2 className="font-bold text-2xl mb-6 flex items-center"><FaUserGraduate className="mr-2 text-purple-500" /> Chi Tiết Sinh Viên: {selectedRegistration.sinhvien?.hoten}</h2>

                    {/* Student Basic Info */}
                    <section className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                      <h3 className="font-semibold text-lg mb-3 flex items-center"><FaInfoCircle className="mr-2 text-blue-500" /> Thông Tin Sinh Viên</h3>
                      <p className="text-sm mb-1 flex items-center"><FaUserGraduate className="mr-2 text-gray-500" /> Mã SV: {selectedRegistration.sinhvien?.masv}</p>
                      <p className="text-sm mb-1 flex items-center"><FaEnvelope className="mr-2 text-gray-500" /> Email: {selectedRegistration.sinhvien?.email}</p>
                      <p className="text-sm mb-1 flex items-center"><FaCalendarAlt className="mr-2 text-gray-500" /> Ngày Sinh: {selectedRegistration.sinhvien?.ngaysinh}</p>
                      <p className="text-sm mb-1 flex items-center"><FaUserGraduate className="mr-2 text-gray-500" /> Giới Tính: {selectedRegistration.sinhvien?.gioitinh}</p>
                      <p className="text-sm mb-1 flex items-center"><FaPhoneAlt className="mr-2 text-gray-500" /> SDT: {selectedRegistration.sinhvien?.sdt}</p>
                      <p className="text-sm mb-1 flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> Địa Chỉ: {selectedRegistration.sinhvien?.diachi}</p>
                      <p className="text-sm flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> Vị Trí: Lat {selectedRegistration.sinhvien?.lat}, Long {selectedRegistration.sinhvien?.long}</p>
                    </section>

                    {/* Registration Details */}
                    <section className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                      <h3 className="font-semibold text-lg mb-3 flex items-center"><FaFileAlt className="mr-2 text-indigo-500" /> Thông Tin Đăng Ký</h3>
                      <p className="text-sm mb-1">Mã Đợt: {selectedRegistration.madot}</p>
                      <p className="text-sm mb-1">Mã Công Ty: {selectedRegistration.macongty}</p>
                      <p className="text-sm mb-1">Ngày Đăng Ký: {selectedRegistration.ngaydangky}</p>
                      <p className="text-sm">Trạng Thái: {selectedRegistration.trangthai}</p>
                    </section>

                    {/* Company Info */}
                    <section className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                      <h3 className="font-semibold text-lg mb-3 flex items-center"><FaBuilding className="mr-2 text-green-500" /> Công Ty Thực Tập</h3>
                      {selectedRegistration.congtythuctap && (
                        <>
                          <p className="text-sm mb-1">Tên: {selectedRegistration.congtythuctap.tencongty}</p>
                          <p className="text-sm mb-1 flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> Địa Chỉ: {selectedRegistration.congtythuctap.diachi}</p>
                          <p className="text-sm mb-1">Mã Số Thuế: {selectedRegistration.congtythuctap.masothue}</p>
                          <p className="text-sm mb-1">Người Đại Diện: {selectedRegistration.congtythuctap.nguoidaidien}</p>
                          <p className="text-sm mb-1 flex items-center"><FaEnvelope className="mr-2 text-gray-500" /> Email: {selectedRegistration.congtythuctap.email}</p>
                          <p className="text-sm mb-1 flex items-center"><FaPhoneAlt className="mr-2 text-gray-500" /> SDT: {selectedRegistration.congtythuctap.sdt}</p>
                          <p className="text-sm mb-1">Phân Loại: {selectedRegistration.congtythuctap.phanloai}</p>
                          <p className="text-sm mb-1">Hoạt Động: {selectedRegistration.congtythuctap.hoatdong}</p>
                          <p className="text-sm flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> Vị Trí: Lat {selectedRegistration.congtythuctap.lat}, Long {selectedRegistration.congtythuctap.long}</p>
                        </>
                      )}
                    </section>

                    {/* Progress Report */}
                    <Disclosure defaultOpen>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full py-3 px-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-200 transition-all">
                            <span className="flex items-center font-semibold text-lg"><FaFileAlt className="mr-2 text-purple-500" /> Báo Cáo Tiến Độ</span>
                            {open ? <FaChevronUp className="text-purple-500" /> : <FaChevronDown className="text-purple-500" />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                            {selectedRegistration.baocaotiendo && (
                              <>
                                <p className="text-sm mb-2">Mô Tả: {selectedRegistration.baocaotiendo.mota}</p>
                                <h4 className="font-medium text-base mt-2 mb-2">Chi Tiết Báo Cáo</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left">Mã Chi Tiết</th>
                                        <th className="px-4 py-2 text-left">Công Việc</th>
                                        <th className="px-4 py-2 text-left">Nội Dung Hoàn Thành</th>
                                        <th className="px-4 py-2 text-left">Khó Khăn</th>
                                        <th className="px-4 py-2 text-left">Thời Hạn</th>
                                        <th className="px-4 py-2 text-left">Đánh Giá GV</th>
                                        <th className="px-4 py-2 text-left">Trạng Thái</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {(selectedRegistration.baocaotiendo.chitietbaocao || []).map((detail) => (
                                        <tr key={detail.machitiet} className="hover:bg-gray-50">
                                          <td className="px-4 py-2">{detail.machitiet}</td>
                                          <td className="px-4 py-2">{detail.congviecduocgiao}</td>
                                          <td className="px-4 py-2">{detail.noidunghoanthanh}</td>
                                          <td className="px-4 py-2">{detail.khokhan}</td>
                                          <td className="px-4 py-2">{detail.thoihan}</td>
                                          <td className="px-4 py-2">{detail.giangviendanhgia}</td>
                                          <td className="px-4 py-2">{detail.trangthai}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    {/* Feedback */}
                    <Disclosure defaultOpen>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full py-3 px-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-200 transition-all">
                            <span className="flex items-center font-semibold text-lg"><FaComments className="mr-2 text-orange-500" /> Phản Hồi</span>
                            {open ? <FaChevronUp className="text-orange-500" /> : <FaChevronDown className="text-orange-500" />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                            {selectedRegistration.phanhoi && (
                              <>
                                <p className="text-sm mb-1">Tiêu Đề: {selectedRegistration.phanhoi.tieude}</p>
                                <p className="text-sm mb-1">Nội Dung: {selectedRegistration.phanhoi.noidungph}</p>
                                <p className="text-sm mb-2">Trả Lời: {selectedRegistration.phanhoi.traloiph}</p>
                                <h4 className="font-medium text-base mt-2 mb-2">Chi Tiết Phản Hồi</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left">Mã CT</th>
                                        <th className="px-4 py-2 text-left">Tiêu Đề</th>
                                        <th className="px-4 py-2 text-left">Nội Dung</th>
                                        <th className="px-4 py-2 text-left">Trả Lời</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {(selectedRegistration.phanhoi.chitietphanhoi || []).map((detail) => (
                                        <tr key={detail.mactph} className="hover:bg-gray-50">
                                          <td className="px-4 py-2">{detail.mactph}</td>
                                          <td className="px-4 py-2">{detail.tieude}</td>
                                          <td className="px-4 py-2">{detail.noidungph}</td>
                                          <td className="px-4 py-2">{detail.traloiph}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    {/* Lecturer Grading */}
                    <section className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                      <h3 className="font-semibold text-lg mb-3 flex items-center"><FaStar className="mr-2 text-yellow-500" /> Chấm Điểm Giảng Viên</h3>
                      {selectedRegistration.giangvienchamdiem && (
                        <>
                          <p className="text-sm mb-1">Nhận Xét Trình Bày: {selectedRegistration.giangvienchamdiem.nhanxettrinhbay}</p>
                          <p className="text-sm mb-1">Nhận Xét Báo Cáo: {selectedRegistration.giangvienchamdiem.nhanxetbaocao}</p>
                          <p className="text-sm mb-1">Điểm Trình Bày: {selectedRegistration.giangvienchamdiem.diemtrinhbay}</p>
                          <p className="text-sm">Điểm Báo Cáo: {selectedRegistration.giangvienchamdiem.diembaocao}</p>
                        </>
                      )}
                    </section>

                    {/* Report Documents */}
                    <section className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                      <h3 className="font-semibold text-lg mb-3 flex items-center"><FaFileAlt className="mr-2 text-red-500" /> Tài Liệu Báo Cáo</h3>
                      {selectedRegistration.tailieubaocao && (
                        <>
                          <p className="text-sm mb-1">File Minh Chứng: {selectedRegistration.tailieubaocao.fileminhchung}</p>
                          <p className="text-sm">Hạn Báo Cáo: {selectedRegistration.tailieubaocao.hanbaocao}</p>
                        </>
                      )}
                    </section>

                    {/* Company Grading */}
                    <section className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                      <h3 className="font-semibold text-lg mb-3 flex items-center"><FaBriefcase className="mr-2 text-teal-500" /> Chấm Điểm Công Ty</h3>
                      {selectedRegistration.congtychamchiem && (
                        <>
                          <p className="text-sm mb-1">Công Việc: {selectedRegistration.congtychamchiem.congviecduocgiao}</p>
                          <p className="text-sm mb-1">Tính Hữu Ích: {selectedRegistration.congtychamchiem.tinhhuuichvoicongty}</p>
                          <p className="text-sm mb-1">Năng Lực Chuyên Môn: {selectedRegistration.congtychamchiem.nanglucchuyenmon}</p>
                          <p className="text-sm mb-1">Tinh Thần: {selectedRegistration.congtychamchiem.tinhthan}</p>
                          <p className="text-sm mb-1">Thái Độ: {selectedRegistration.congtychamchiem.thaido}</p>
                          <p className="text-sm mb-1">Chuyên Cần: {selectedRegistration.congtychamchiem.chuyencan}</p>
                          <p className="text-sm mb-1">Nhận Xét Tinh Thần Thái Độ: {selectedRegistration.congtychamchiem.nhanxettinhthanthaido}</p>
                          <p className="text-sm mb-1">Nhận Xét Trách Nhiệm: {selectedRegistration.congtychamchiem.nhanxettrachnhiem}</p>
                          <p className="text-sm mb-1">Nhận Xét Trình Độ: {selectedRegistration.congtychamchiem.nhanxettrinhdo}</p>
                          <p className="text-sm mb-1">Nhận Xét Khác: {selectedRegistration.congtychamchiem.nhanxetkhac}</p>
                          <p className="text-sm mb-1">Điểm Chuyên Cần: {selectedRegistration.congtychamchiem.diemchuyencan}</p>
                          <p className="text-sm">Điểm Chuyên Môn: {selectedRegistration.congtychamchiem.diemchuyenmon}</p>
                        </>
                      )}
                    </section>

                    {/* Allocation Details */}
                    <Disclosure defaultOpen>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full py-3 px-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-200 transition-all">
                            <span className="flex items-center font-semibold text-lg"><FaUsers className="mr-2 text-cyan-500" /> Chi Tiết Phân Bổ ({(selectedRegistration.chitietdotphanbo || []).length})</span>
                            {open ? <FaChevronUp className="text-cyan-500" /> : <FaChevronDown className="text-cyan-500" />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-4">
                            {(selectedRegistration.chitietdotphanbo || []).map((alloc) => (
                              <div key={alloc.madotphanbo} className="p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                                <p className="text-sm mb-1">Mã Phân Bổ: {alloc.madotphanbo}</p>
                                <p className="text-sm mb-1">Ngày Phân Bổ: {alloc.ngayphanbo}</p>
                                <p className="text-sm mb-1">Kết Quả PV: {alloc.ketquapv}</p>
                                <p className="text-sm mb-1">File Minh Chứng: {alloc.fileminhchung}</p>
                                <p className="text-sm mb-2">Trạng Thái: {alloc.trangthai}</p>
                                <h4 className="font-medium text-base mt-2 mb-2">Tình Trạng Phỏng Vấn</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left">Mã Tình Trạng</th>
                                        <th className="px-4 py-2 text-left">Vấn Đề</th>
                                        <th className="px-4 py-2 text-left">Nội Dung</th>
                                        <th className="px-4 py-2 text-left">Hướng Giải Quyết</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {(alloc.tinhtrangphongvan || []).map((status) => (
                                        <tr key={status.matinhtrang} className="hover:bg-gray-50">
                                          <td className="px-4 py-2">{status.matinhtrang}</td>
                                          <td className="px-4 py-2">{status.vandephatsinh}</td>
                                          <td className="px-4 py-2">{status.noidungphatsinh}</td>
                                          <td className="px-4 py-2">{status.huonggiaiquyet}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                ) : selectedDot ? (
                  <div className="flex justify-center items-center h-full text-gray-500 text-lg">Chọn một sinh viên để xem chi tiết.</div>
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500 text-lg">Chọn một đợt thực tập để bắt đầu.</div>
                )
                }
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  );
}