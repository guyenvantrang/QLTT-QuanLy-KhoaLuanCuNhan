import axios from "axios";
const API_URL = "http://localhost:3000";
import type { SinhVien } from "../models/model-all";

export async function HienThiSinhVienPhanBo(madot: string, madotphanbo: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/lay-sinh-vien-phan-bo/${madot}/${madotphanbo}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}

export async function LaySinhVienTheoID(masv: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/get-by-id/${masv}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}

export async function Laytatcarsinhvien(masv: string) {
  try {
    const res :SinhVien[]= await axios.get(`${API_URL}/api/student/layhet/${masv}`);
    return res;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}


export async function LaySinhVienTheodot(masv: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/lay-sinh-vien-theo-dot-dang-ki/${masv}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}
export async function LaySinhVienNull(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/sinh-vien-rong/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tổng số sinh viên có công ty.");
  }
}

// 2. Tổng số sinh viên đã có công ty
export async function getTotalWithCompany(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tong-sinh-vien-co-cong-ty/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tổng số sinh viên có công ty.");
  }
}

// 3. Tổng số sinh viên chưa có công ty
export async function getTotalWithoutCompany(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tong-sinh-vien-chua-co-cong-ty/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tổng số sinh viên chưa có công ty.");
  }
}

// 4. Tổng tin nhắn chưa đọc
export async function getUnreadMessages(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tong-tin-nhan-chua-doc/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tổng tin nhắn chưa đọc.");
  }
}

// 5. Tổng phỏng vấn đầu
export async function getInitialInterviews(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tong-phong-van-dau/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tổng phỏng vấn đầu.");
  }
}

// 6. Tổng số sinh viên rớt và tổng lần rớt
export async function getFailedStudents(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tong-sinh-vien-rot/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy số sinh viên rớt.");
  }
}

// 7. Tổng số sinh viên chưa có kết quả
export async function getNoResult(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tong-chua-co-ket-qua/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy số sinh viên chưa có kết quả.");
  }
}

// 8. Lấy tất cả thống kê cùng lúc
export async function getAllStats(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/tat-ca/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tất cả thống kê.");
  }
}

export async function LayDanhSachSinhVienDePhanBoGiangVien(madot: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/lay-sinh-vien-phan-bo-gv/${madot}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tất cả thống kê.");
  }
}

export async function laytatcasinhvien(page: number, limit: number) {
  try {
    const res = await axios.get(`${API_URL}/api/student/get-data-all/${page}/${limit}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi khi lấy tất cả thống kê.");
  }
}

export async function GetName(keyword: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/search/${keyword}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}


export async function laysinhvienxetduyet() {
  try {
    const res = await axios.get(`${API_URL}/api/student/danh-sach`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}

export async function locsinhvienxetduyet(trangthai: string) {
  try {
    const res = await axios.get(`${API_URL}/api/student/loc/${trangthai}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}

export async function xetduyetdau(maxd: string, masv: string, hoten: string, email: string, ngaysinh: string, gioitinh: string, sdt: string) {
  try {
    const payload = { masv, hoten, email, ngaysinh, gioitinh, sdt }
    const res = await axios.patch(`${API_URL}/api/student/xet-duyet-dau/${maxd}`, payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

  }
}

export async function xetduyet(maxd: string, thongbao: string, trangthai: string) {
  try {
    const payload = { thongbao, trangthai }
    const res = await axios.patch(`${API_URL}/api/student/xet-duyet/${maxd}`, payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}
