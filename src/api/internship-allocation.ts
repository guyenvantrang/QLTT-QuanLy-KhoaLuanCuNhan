import axios from "axios";
const API_URL = "http://localhost:3000";
import type { CompanychuyennganhPayload, CompanyPayload, StudentchuyennganhPayload, StudentPayload } from "../models/allocation/add";
export async function GetAll(madot: string) {
    try {
        const res = await axios.get(`${API_URL}/api/internship-allocation/get-all/${madot}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function xacNhanRot(madot: string, masv: string) {
    try {
        const res = await axios.post(`${API_URL}/api/internship-allocation/xac-nhan-rot/${madot}/${masv}`);
        window.location.reload();
        return res.data;
    } catch (err: any) {
        console.error(err);
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi khi xác nhận rớt.");
    }
}

/**
 * Chuyển sinh viên sang đợt phân bổ mới
 */
export async function chuyenDotMoi(madot: string, masv: string) {
    try {
        const res = await axios.post(`${API_URL}/api/internship-allocation/chuyen-dot-moi/${madot}/${masv}`);
        window.location.reload();
        return res.data;
    } catch (err: any) {
        console.error(err);
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi khi chuyển đợt mới.");
    }
}

/**
 * Trả lời phản hồi tình trạng sinh viên
 */
export async function traLoiPhanHoi(
    madot: string,
    masv: string,
    madotphanbo: string,
    matinhtrang: string,
    huonggiaiquyet: string
) {
    try {
        const res = await axios.patch(
            `${API_URL}/api/internship-allocation/tra-loi-phan-hoi/${madot}/${masv}/${madotphanbo}/${matinhtrang}`,
            { huonggiaiquyet }, // gửi object JSON
            {
                headers: { 'Content-Type': 'application/json' } // bắt buộc để NestJS nhận JSON
            }
        );
        return res.data; // { result: 'oke' }
    } catch (err: any) {
        console.error(err);
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi khi trả lời phản hồi.");
    }
}



export async function GetAllocationByStudent(masv: string, madot: string) {
    try {
        const res = await axios.get(`${API_URL}/api/internship-allocation/lay-danh-sach-theo-sinh-vien/${masv}/${madot}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

export async function Create(madot: string, mota: string) {
    try {
        const payload = {
            madot, mota
        };
        const res = await axios.post(`${API_URL}/api/internship-allocation/create`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function update(madotphanbo: string, madot: string, mota: string) {
    try {
        const payload = {
            madotphanbo, madot, mota
        };
        const res = await axios.patch(`${API_URL}/api/internship-allocation/update`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}


export async function deletes(madotphanbo: string) {
    try {
        const res = await axios.delete(`${API_URL}/api/internship-allocation/delete/${madotphanbo}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}


export async function getPdf(fileName: string): Promise<Blob> {
    try {
        const res = await axios.get(`${API_URL}/api/internship-allocation/view`, {
            params: { path: fileName },
            responseType: "blob", // trả về Blob
        });
        return res.data; // chỉ trả Blob, không tạo ObjectURL ở đây
    } catch (err: any) {
        if (err.response?.data) throw new Error(err.response.data);
        throw new Error("Đã xảy ra lỗi khi lấy file PDF.");
    }
}

export async function phanBoSinhVien(madot: string, madotphanbo: string, macongty: string, masv: string[]) {
    try {
        const PhanBoPayload = {
            madot,
            madotphanbo,
            macongty,
            masv
        }
        alert(JSON.stringify({ madot, madotphanbo, macongty, masv }, null, 2));
        const res = await axios.post(`${API_URL}/api/AllocationDetails/phan-bosinh-vien`, PhanBoPayload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}



export async function phanBoSinhVienTheoDiaChi(students: StudentPayload[], companies: CompanyPayload[]) {
    try {
        const payload = {
            students,
            companies
        };
        const res = await axios.post(`${API_URL}/api/internship-allocation/allocate`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}


export async function phanBoSinhVienTheochuyennganh(students: StudentchuyennganhPayload[], companies: CompanychuyennganhPayload[]) {
    try {
        const payload = {
            students,
            companies
        };
        const res = await axios.post(`http://localhost:8080/allocate`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

export async function xacnhandau(madot: string, masv: string, macongty: string) {
    try {

        const res = await axios.put(`${API_URL}/api/RegisterInternship/Official-Confirmation/${madot}/${masv}/${macongty}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

export async function phanbogiaovien(soluongsv: number, madot: string, magiangvien: string, masv: string[]) {
    try {
        const payload = { soluongsv, madot, magiangvien, masv }
        const res = await axios.put(`${API_URL}/api/RegisterInternship/Assign-Instructors`,payload);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}




