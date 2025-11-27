import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginLayout from "../layouts/login";
import Homelayout from "../layouts/home";
import BatchInternshipLayout from "../layouts/batchs-internship";
import CompanyIntroductionLayout from "../layouts/company-introduction";
import CompanyIntroductionManagement from "../pages/company-introduction";
import BatchInternship from "../pages/batchs-internship";
import AddDotThucTapForm from "../components/functionpages/batch-internships/add";
import UpdateDotThucTapForm from "../components/functionpages/batch-internships/update";
import InternshipAllocationLayout from "../layouts/internship-allocation";
import InternshipAlloactionManagement from "../pages/internship-allocation";
import CompanyLayout from "../layouts/company";
import CompanyManagement from "../pages/company";
import AddCongTyForm from "../components/functionpages/company/add";
import UpdateCongTyForm from "../components/functionpages/company/update";
import AllocationManagement from "../pages/allocation";
import AllocationPage from "../components/functionpages/allocation/allocation";
import DashboardThucTap from "../components/functionpages/allocation/thongke";
import StudentHaveCompanyManagement from "../components/functionpages/batch-internships/sinhviendacocongty";
import StudentHaveNotCompanyManagement from "../components/functionpages/batch-internships/sinhvienchuacocongty";
import InternshipRegistrationList from "../components/functionpages/allocation/quanlysinhvienphanbo";
import TeacherLayout from "../layouts/teacher";
import LecturerManagement from "../pages/teacher";
import AddGiangVienForm from "../components/functionpages/teacher/add";
import UpdateGiangVienForm from "../components/functionpages/teacher/update";
import InternshipAllocationManagement from "../components/functionpages/allocation-teacher/allocation";
import StudentLayout from "../layouts/student";
import StudentBatchManagement from "../components/functionpages/batch-internships/tatcasinhvien";
import StudentManagement from "../pages/student";
import ApproveStudentManagement from "../pages/xetduyetsinhvien";
import ThongKeLayout from "../layouts/thongke";
import InternshipDashboard from "../pages/thongke";
import ThongbaoLayout from "../layouts/thongbao";
import QuanLyThongBao from "../pages/thongbao";
import ThemThongBao from "../components/functionpages/thongbao/add";
import ChiTietThongBao from "../components/functionpages/thongbao/update";
import PhanQuyenLayout from "../layouts/phanquyen";
import PhanQuyenIndex from "../pages/auth/page-main";
import QuanLyChucVu from "../pages/auth/page-main/chucvu";
import QuanLyNguoiDung from "../pages/auth/page-main/nguoidung";
import QuanLyChucNang from "../pages/auth/page-main/chucnang";
import QuanLyNhomQuyen from "../pages/auth/page-main/nhomquyeb";
import QuanLyPhanQuyen from "../pages/auth/page-main/phanquyen";
// import HeThong3D from "../pages/auth/page-main/sodo";
import LecturerAllocationStatistics from "../components/functionpages/batch-internships/phanbogiangvien";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginLayout />} />

      <Route path="/home" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_home">
          <Homelayout />
        </ProtectedRoute>
      } />

      {/* Batch Internship */}
      <Route path="/batch-internship" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_batch">
          <BatchInternshipLayout />
        </ProtectedRoute>
      }>
        <Route index element={<BatchInternship />} />
        <Route path="add" element={<AddDotThucTapForm />} />
        <Route path="update/:madot" element={<UpdateDotThucTapForm />} />
      </Route>

      {/* Company Introduction */}
      <Route path="/company-introduction" element={
        <ProtectedRoute trangtruycap="/company" matruycap="hienthi_company_introduction">
          <CompanyIntroductionLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CompanyIntroductionManagement />} />
      </Route>

      <Route path="/internship-allocation" element={
        <ProtectedRoute trangtruycap="/batch-internship" matruycap="hienthi_internship_allocation">
          <InternshipAllocationLayout />
        </ProtectedRoute>
      }>
        <Route index element={<InternshipAlloactionManagement />} />
        <Route path="create-allocation/:madot" element={<AllocationManagement />} />
        <Route path="allocation/:madot/:madotphanbo" element={<AllocationPage />} />
        <Route path="thongke/:madot" element={<DashboardThucTap />} />
        <Route path="danh-sach-sinh-vien-dang-ky/:madot" element={<StudentBatchManagement />} />
        <Route path="danh-sach-phan-bo-giang-vien/:madot" element={<LecturerAllocationStatistics />} />
        <Route path="danh-sach-sinh-vien-da-co-cong-ty/:madot" element={<StudentHaveCompanyManagement />} />
        <Route path="danh-sach-sinh-vien-chua-co-cong-ty/:madot" element={<StudentHaveNotCompanyManagement />} />
        <Route path="danh-sach-xac-nhan/:madot" element={<InternshipRegistrationList />} />
      </Route>

      {/* Company */}
      <Route path="/company" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_company">
          <CompanyLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CompanyManagement />} />
        <Route path="add" element={<AddCongTyForm />} />
        <Route path="update/:macongty" element={<UpdateCongTyForm />} />
      </Route>

      {/* Teacher */}
      <Route path="/teacher" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_teacher">
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route index element={<LecturerManagement />} />
        <Route path="add" element={<AddGiangVienForm />} />
        <Route path="update/:magiangvien" element={<UpdateGiangVienForm />} />
        <Route path="allocation/:madot" element={<InternshipAllocationManagement />} />
      </Route>

      {/* Student */}
      <Route path="/student" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_student">
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentManagement />} />
        <Route path="xet-duyet" element={<ApproveStudentManagement />} />
      </Route>

      {/* ThongKe */}
      <Route path="/thongke" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_thongke">
          <ThongKeLayout />
        </ProtectedRoute>
      }>
        <Route index element={<InternshipDashboard />} />
      </Route>

      {/* ThongBao */}
      <Route path="/thongbao" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_thongbao">
          <ThongbaoLayout />
        </ProtectedRoute>
      }>
        <Route index element={<QuanLyThongBao />} />
        <Route path="add" element={<ThemThongBao />} />
        <Route path="update/:id" element={<ChiTietThongBao />} />
      </Route>

      {/* Phan Quyen */}
      <Route path="/phanquyen" element={
        <ProtectedRoute trangtruycap="/home" matruycap="hienthi_phanquyen">
          <PhanQuyenLayout />
        </ProtectedRoute>
      }>
        <Route index element={<PhanQuyenIndex />} />
        <Route path="chucvu" element={<QuanLyChucVu />} />
        <Route path="nguoidung" element={<QuanLyNguoiDung />} />
        <Route path="chucnang" element={<QuanLyChucNang />} />
        <Route path="nhomquyen" element={<QuanLyNhomQuyen />} />
        <Route path="phanquyen" element={<QuanLyPhanQuyen />} />
        {/* <Route path="sodo" element={<HeThong3D />} /> */}

      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
