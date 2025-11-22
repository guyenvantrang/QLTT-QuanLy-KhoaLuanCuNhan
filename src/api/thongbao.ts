import axios from "axios";
const API_URL = "http://localhost:3000";


// Lấy tất cả thông báo
export async function GetAllThongBao() {
  try {
    const res = await axios.get(`${API_URL}/api/ReportDocuments/lay-tat-ca-thong-bao`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

// Lấy thông báo theo ID
export async function GetThongBaoById(id: string) {
  try {
    const res = await axios.get(`${API_URL}/api/ReportDocuments/lay-thong-bao-theo-id/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

export async function CreateThongBao(
  tieude: string,
  noidung: string,
  filetailieu?: File,
  filecongvan?: File,
) {
  try {
    const formData = new FormData();

    // Gửi trực tiếp các trường tieude và noidung
    formData.append('tieude', tieude);
    formData.append('noidung', noidung);

    // Thêm file nếu có
    if (filetailieu) formData.append('filetailieu', filetailieu);
    if (filecongvan) formData.append('filecongvan', filecongvan);

    const res = await axios.post(`${API_URL}/api/ReportDocuments/create`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
  }
}


// // Cập nhật thông báo
// export async function UpdateThongBao(mathongbao: string, data: UpdateThongBaoDto) {
//   try {
//     const res = await axios.put(`${API_URL}/api/thongbao/${mathongbao}`, data);
//     return res.data;
//   } catch (err: any) {
//     if (err.response?.data?.message) throw new Error(err.response.data.message);
//     throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
//   }
// }

// Xóa thông báo
export async function DeleteThongBao(mathongbao: string) {
  try {
    const res = await axios.delete(`${API_URL}/api/ReportDocuments/xoa-thong-bao/${mathongbao}`);
    window.location.reload();
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

// Tìm kiếm thông báo theo keyword (tiêu đề hoặc nội dung)
export async function SearchThongBao(keyword: string) {
  try {
    const res = await axios.get(`${API_URL}/api/thongbao/search?keyword=${keyword}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}

// Lọc thông báo theo ngày tạo (ngaytao: ISO date string, ví dụ '2023-01-01')
export async function FilterThongBaoByNgay(ngaytao: string) {
  try {
    const res = await axios.get(`${API_URL}/api/thongbao/filter?ngaytao=${ngaytao}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}