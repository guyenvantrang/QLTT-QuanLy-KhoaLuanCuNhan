import axios from "axios";
const API_URL = "http://localhost:3000";


export async function GetByID(magiangvien: string) {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/get-by-id/${magiangvien}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}


export async function laythongtinlienquan(magiangvien: string) {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/full/${magiangvien}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function getall() {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/get-data-all`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function create(tengiangvien: string, email: string, sdt: string, trangthai: string) {
    try {
        const payload = { tengiangvien, email, sdt, trangthai }
        const res = await axios.post(`${API_URL}/api/teacher/create-new-teacher`, payload);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function update_(magiangvien: string, tengiangvien: string, email: string, sdt: string, trangthai: string) {
    try {
        const payload = { tengiangvien, email, sdt, trangthai }
        const res = await axios.patch(`${API_URL}/api/teacher/update-teacher/${magiangvien}`, payload);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function delete_(magiangvien: string) {
    try {

        const res = await axios.delete(`${API_URL}/api/teacher/delete-teacher/${magiangvien}`);
        alert("Xóa Thành Công")
        return res.data;
    } catch (err: any) {
        alert("Không thể xóa !")

    }
}


export async function LayDanhSachGiangVienDePhanBo() {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/lay-giang-vien-phan-bo`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

//lay-giang-vien-phan-bo