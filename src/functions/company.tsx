import type { CongTyThucTap } from "../models/model-all";
import { GetByID, GetName, Filter, AddCompany, UpdateCompany, DeleteCompany, GetAll, laycongtyphanbo, ViTriThucTap } from "../api/company";
import type { NavigateFunction } from "react-router-dom";


export async function GetAllFunction(page: number, limit: number) {
  try {
    // Lấy tất cả học phần từ API
    const res: CongTyThucTap[] = await GetAll(page, limit);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    return undefined;
  }
}

export async function Laycongtyphanbo() {
  try {
    const res: CongTyThucTap[] = await laycongtyphanbo();
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    return undefined;
  }
}

// 🟦 Lấy công ty theo mã
export async function GetByIDCtyFunction(macongty: string): Promise<CongTyThucTap | undefined> {
  try {
    const res: CongTyThucTap = await GetByID(macongty);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi tải dữ liệu công ty.");
    return undefined;
  }
}

// 🟩 Tìm công ty theo tên hoặc từ khóa
export async function SearchCompanyFunction(keyword: string): Promise<CongTyThucTap[] | undefined> {
  try {
    const res: CongTyThucTap[] = await GetName(keyword);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi tìm kiếm công ty.");
    return undefined;
  }
}

// 🟨 Lọc công ty theo phân loại (ví dụ: 1 = đối tác, 2 = tiềm năng, ...)
export async function FilterCompanyFunction(phanloai?: string, hoatdong?: string) {
  try {
    const res: CongTyThucTap[] = await Filter(phanloai, hoatdong);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Không thể lọc danh sách công ty.");
    return undefined;
  }
}
type AddCompanyElements = {
  macongty: HTMLInputElement;
  tencongty: HTMLInputElement;
  diachi: HTMLInputElement;
  masothue: HTMLInputElement;
  nguoidaidien: HTMLInputElement;
  email: HTMLInputElement;
  sdt: HTMLInputElement;
  phanloai: HTMLInputElement;
  linhvuc: HTMLInputElement;
  hoatdong: HTMLInputElement;
  gioithieucongty: HTMLTextAreaElement; // textarea thay vì input
};

// 🟩 Thêm công ty mới
export async function createCompany(
  e: React.FormEvent<HTMLFormElement>,
  navigate: NavigateFunction
) {
  e.preventDefault();
  const form = e.currentTarget;
  const elements = form.elements as unknown as AddCompanyElements;

  // Lấy giá trị từ form, trim để loại bỏ khoảng trắng
  const tencongty = elements.tencongty?.value.trim() || "";
  const diachi = elements.diachi?.value.trim() || "";
  const masothue = elements.masothue?.value.trim() || "";
  const nguoidaidien = elements.nguoidaidien?.value.trim() || "";
  const email = elements.email?.value.trim() || "";
  const sdt = elements.sdt?.value.trim() || "";
  const phanloai = elements.phanloai?.value.trim() || "";
  const hoatdong = elements.hoatdong?.value.trim() || "";
  const linhvuc = elements.linhvuc?.value.trim() || "";

  // Kiểm tra các trường bắt buộc
  if (!tencongty || !tencongty || !diachi || !masothue || !nguoidaidien || !email || !sdt || !linhvuc) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc (mã công ty, tên công ty)");
    return;
  }
  try {
    await AddCompany(tencongty, diachi, masothue, nguoidaidien, email, sdt, phanloai, hoatdong, linhvuc);
    alert("Thêm công ty thành công");
    navigate("/company", { replace: true });
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

// 🟧 Cập nhật thông tin công ty
export async function UpdateCompanyFunction(
  e: React.FormEvent<HTMLFormElement>,

) {
  e.preventDefault();
  const form = e.currentTarget;
  const elements = form.elements as unknown as AddCompanyElements;

  // Lấy giá trị từ form, trim để loại bỏ khoảng trắng
  const macongty = elements.macongty?.value.trim() || "";
  const tencongty = elements.tencongty?.value.trim() || "";
  const diachi = elements.diachi?.value.trim() || "";
  const masothue = elements.masothue?.value.trim() || "";
  const nguoidaidien = elements.nguoidaidien?.value.trim() || "";
  const email = elements.email?.value.trim() || "";
  const sdt = elements.sdt?.value.trim() || "";
  const phanloai = elements.phanloai?.value.trim() || "";
  const hoatdong = elements.hoatdong?.value.trim() || "";
  const linhvuc = elements.linhvuc?.value.trim() || "";

  // Kiểm tra các trường bắt buộc
  if (!tencongty || !tencongty || !diachi || !masothue || !nguoidaidien || !email || !sdt || !linhvuc) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc (mã công ty, tên công ty)");
    return;
  }
  try {
    const ketqua = await UpdateCompany(macongty, tencongty, diachi, masothue, nguoidaidien, email, sdt, phanloai, hoatdong,linhvuc);
    if (ketqua.result === "no") {
      alert("Công ty của sinh viên không thể sửa" + phanloai);
      return;
    }
    alert("Sửa thành công ty thành công");
    window.location.reload();
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

// 🟥 Xóa công ty theo mã
export async function DeleteCompanyFunction(macongty: string): Promise<boolean> {
  try {
    await DeleteCompany(macongty);
    alert("🗑️ Xóa công ty thành công!");
    window.location.reload();
    return true;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Không thể xóa công ty này.");
    return false;
  }
}


export async function vitrithuctap(macongty: string, lat: number, long: number) {

  try {
    await ViTriThucTap(macongty, lat, long);
    alert("Cập nhật vị trí công ty thành công");
    window.location.reload();
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
  }
}