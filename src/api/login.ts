import axios from "axios";
const API_URL = "http://localhost:3000/api/Auth";

// -------------------- Đăng nhập --------------------
export async function login(taikhoan: string, matkhau: string) {
  try {
    const res = await axios.get(`${API_URL}/Login/${taikhoan}/${matkhau}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

// -------------------- Chức vụ --------------------
export async function getAllChucVu() {
  const res = await axios.get(`${API_URL}/ChucVu`);
  return res.data;
}

export async function addChucVu(data: any) {
  const res = await axios.post(`${API_URL}/ChucVu`, data);
  return res.data;
}

export async function updateChucVu(machucvu: string, data: any) {
  const res = await axios.put(`${API_URL}/ChucVu/${machucvu}`, data);
  return res.data;
}

export async function deleteChucVu(machucvu: string) {
  const res = await axios.delete(`${API_URL}/ChucVu/${machucvu}`);
  return res.data;
}

// -------------------- Người dùng --------------------
export async function getAllNguoiDung() {
  const res = await axios.get(`${API_URL}/NguoiDung`);
  return res.data;
}

export async function addNguoiDung(data: any) {
  const res = await axios.post(`${API_URL}/NguoiDung`, data);
  if (res.data.result === "no") throw new Error("Tài khoản đã tồn tại");
  return res.data;
}

export async function updateNguoiDung(manguoidung: string, data: any) {
  const res = await axios.put(`${API_URL}/NguoiDung/${manguoidung}`, data);
  if (res.data.result === "no") throw new Error("Tài khoản đã tồn tại");
  return res.data;
}

export async function deleteNguoiDung(manguoidung: string) {
  const res = await axios.delete(`${API_URL}/NguoiDung/${manguoidung}`);
  return res.data;
}

// -------------------- Trang web --------------------
export async function getAllTrangWeb() {
  const res = await axios.get(`${API_URL}/TrangWeb`);
  return res.data;
}

export async function addTrangWeb(data: any) {
  const res = await axios.post(`${API_URL}/TrangWeb`, data);
  return res.data;
}

export async function updateTrangWeb(matrang: string, data: any) {
  const res = await axios.put(`${API_URL}/TrangWeb/${matrang}`, data);
  return res.data;
}

export async function deleteTrangWeb(matrang: string) {
  const res = await axios.delete(`${API_URL}/TrangWeb/${matrang}`);
  return res.data;
}

// -------------------- Chức năng --------------------
export async function getAllChucNang() {
  const res = await axios.get(`${API_URL}/ChucNang`);
  return res.data;
}

export async function addChucNang(data: any) {
  const res = await axios.post(`${API_URL}/ChucNang`, data);
  return res.data;
}

export async function updateChucNang(machucnang: string, data: any) {
  const res = await axios.put(`${API_URL}/ChucNang/${machucnang}`, data);
  return res.data;
}

export async function deleteChucNang(machucnang: string) {
  const res = await axios.delete(`${API_URL}/ChucNang/${machucnang}`);
  return res.data;
}

// -------------------- Nhóm quyền --------------------
export async function getAllNhomQuyen() {
  const res = await axios.get(`${API_URL}/NhomQuyen`);
  return res.data;
}

export async function addNhomQuyen(data: any) {
  const res = await axios.post(`${API_URL}/NhomQuyen`, data);
  return res.data;
}

export async function updateNhomQuyen(manhomquyen: string, data: any) {
  const res = await axios.put(`${API_URL}/NhomQuyen/${manhomquyen}`, data);
  return res.data;
}

export async function deleteNhomQuyen(manhomquyen: string) {
  const res = await axios.delete(`${API_URL}/NhomQuyen/${manhomquyen}`);
  return res.data;
}

// -------------------- Chi tiết nhóm quyền chức năng --------------------
export async function getAllChiTietNhomQuyenChucNang() {
  const res = await axios.get(`${API_URL}/lay-chi-tiet-nhom-quyen-chuc-nang`);
  return res.data;
}

export async function addChiTietNhomQuyenChucNang(data: any) {
  const res = await axios.post(`${API_URL}/them-chi-tiet-nhom-quyen-chuc-nang`, data);
  return res.data;
}

export async function deleteChiTietNhomQuyenChucNang(machucnang: string, manhomquyen: string) {
  const res = await axios.delete(
    `${API_URL}/xoa-chi-tiet-nhom-quyen-chuc-nang/${machucnang}/${manhomquyen}`
  );
  return res.data;
}

// -------------------- Chi tiết nhóm quyền người dùng --------------------
export async function getAllChiTietNhomQuyenNguoiDung() {
  const res = await axios.get(`${API_URL}/lay-chi-tiet-nhom-quyen-nguoi-dung`);
  return res.data;
}

export async function addChiTietNhomQuyenNguoiDung(data: any) {
  const res = await axios.post(`${API_URL}/them-chi-tiet-nhom-quyen-nguoi-dung`, data);
  return res.data;
}

export async function deleteChiTietNhomQuyenNguoiDung(manguoidung: string, manhomquyen: string) {
  const res = await axios.delete(
    `${API_URL}/xoa-chi-tiet-nhom-quyen-nguoi-dung/${manguoidung}/${manhomquyen}`
  );
  return res.data;
}
