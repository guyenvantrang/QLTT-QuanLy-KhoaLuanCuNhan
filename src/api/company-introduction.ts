import axios from "axios";
const API_URL = "http://localhost:3000";

export async function GetAll(page: number, limit: number) {
    try {
        const res = await axios.get(`${API_URL}/api/CompanyIntroduction/get-all-data/${page}/${limit}`);

        return res.data.dulieu;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function GetByIDAndName(madexuat?: string, macongty?: string, magiangvien?: string) {
    try {
        const params: any = {};
        if (madexuat) params.madexuat = madexuat;
        if (macongty) params.macongty = macongty;
        if (magiangvien) params.magiangvien = magiangvien;

        const res = await axios.get(`${API_URL}/api/CompanyIntroduction/get-data-by-id-and-name`, { params });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

export async function GetByStatus(status: string) {
    try {
        const res = await axios.get(`${API_URL}/api/CompanyIntroduction/get-data-by-status/${status}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function xacthucthanhcong(madexuat: string, magiangvien: string, macongty:string) {
    try {
        const res = await axios.put(`${API_URL}/api/CompanyIntroduction/xac-thuc-thanh-cong/${madexuat}/${magiangvien}/${macongty}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function xacthuckhongthanhcong(madexuat: string, magiangvien: string, macongty:string) {
    try {
        const res = await axios.put(`${API_URL}/api/CompanyIntroduction/xac-thuc-khong-thanh-cong/${madexuat}/${magiangvien}/${macongty}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function thongso(magiangvien: string) {
    try {
        const res = await axios.get(`${API_URL}/api/CompanyIntroduction/thong-so/${magiangvien}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}
