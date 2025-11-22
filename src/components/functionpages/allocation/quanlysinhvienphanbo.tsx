import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import type { DangKyThucTap, SinhVien } from "../../../models/model-all";
import { laysinhvientheoid, laysinhviennull } from "../../../functions/student";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import StudentDetailModal from "../../form/xacnhansinhvien";

export default function InternshipRegistrationList() {
  const { madot } = useParams<{ madot: string }>();

  const [, setRegistrations] = useState<DangKyThucTap[]>([]);
  const [allStudents, setAllStudents] = useState<(SinhVien & { trangthai?: string })[]>([]);
  const [students, setStudents] = useState<(SinhVien & { trangthai?: string })[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  // Load dữ liệu đăng ký và thông tin sinh viên
  useEffect(() => {
    if (!madot) return;

    const fetchData = async () => {
      try {
        const res: DangKyThucTap[] | undefined = await laysinhviennull(madot);
        const registrations = res || [];
        setRegistrations(registrations);

        const fullData: (SinhVien & { trangthai?: string })[] = [];
        for (const reg of registrations) {
          const sv = await laysinhvientheoid(reg.masv);
          if (sv) fullData.push({ ...sv, trangthai: reg.trangthai });
        }

        setAllStudents(fullData);
        setStudents(fullData);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, [madot]);

  // Lọc và tìm kiếm tự động
  useEffect(() => {
    const filtered = allStudents.filter((s) => {
      const matchesSearch =
        !searchText ||
        s.masv.toLowerCase().includes(searchText.toLowerCase()) ||
        (s.hoten?.toLowerCase().includes(searchText.toLowerCase()) ?? false);
      const matchesStatus = !statusFilter || s.trangthai === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setStudents(filtered);
  }, [searchText, statusFilter, allStudents]);

  const getStatusBadge = (status?: string) => {
    const baseDot = "inline-block w-3 h-3 rounded-full mr-2";

    const mapping: Record<string, { label: string; color: string; pulse?: boolean }> = {
      "0": { label: "Mới phân bố", color: "bg-yellow-400", pulse: true },
      "1": { label: "Đậu", color: "bg-green-500", pulse: true },
      "2": { label: "Rớt", color: "bg-red-500" },
      "3": { label: "Phân bố lại", color: "bg-blue-400" },
      "4": { label: "Loại", color: "bg-gray-600" },
      "5": { label: "Chờ xác nhận", color: "bg-purple-500" },
    };

    const data = mapping[status ?? ""] || { label: "Không xác định", color: "bg-red-400" };

    return (
      <div className="flex items-center justify-center">
        <span className={`${baseDot} ${data.color} ${data.pulse ? "animate-pulse" : ""}`}></span>
        <span className="text-sm text-gray-700">{data.label}</span>
      </div>
    );
  };

  const handleQuickConfirm = () => {
    if (!window.confirm("Bạn có chắc muốn xác nhận nhanh tất cả sinh viên không?")) return;
    alert("Xác nhận nhanh thành công!");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
          Danh sách sinh viên đợt {madot}
        </h2>
        <button
          onClick={handleQuickConfirm}
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          Xác nhận nhanh
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 bg-white px-3 py-2 rounded-lg shadow-sm">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc họ tên"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
          <FaFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Mới phân bố</option>
            <option value="1">Đậu</option>
            <option value="2">Rớt</option>
            <option value="3">Phân bố lại</option>
            <option value="4">Loại</option>
            <option value="5">Đã phân bổ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
            <tr>
              {["Mã sinh viên", "Họ tên", "Email", "Giới tính", "Trạng thái đăng ký", "Hành động"].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length ? (
              students.map((s) => (
                <tr key={s.masv} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{s.masv}</td>
                  <td className="px-4 py-3 text-gray-800 font-semibold">{s.hoten}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.gioitinh}</td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(s.trangthai)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedStudent(s.masv);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-600 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedStudent && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          size="5xl"
          dismissible={false}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <ModalHeader>
            <h3 className="text-lg font-semibold">Chi tiết sinh viên</h3>
          </ModalHeader>
          <ModalBody className="bg-gray-50 p-4 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <StudentDetailModal onClose={() => setShowModal(false)} masv={selectedStudent} madot= {madot||""} />
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
