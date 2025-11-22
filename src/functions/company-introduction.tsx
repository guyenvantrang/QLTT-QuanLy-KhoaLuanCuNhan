import type { GioiThieuCongTy } from "../models/model-all";
import { GetAll, GetByIDAndName, GetByStatus, thongso, xacthuckhongthanhcong, xacthucthanhcong } from "../api/company-introduction";

export async function GetAllFunction(page: number, limit: number) {
    try {
        // Lấy tất cả học phần từ API
        const res: GioiThieuCongTy[] = await GetAll(page, limit);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}


export async function GetByIDAndNameFunction(madexuat?: string, magiangvien?: string, macongty?: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: GioiThieuCongTy[] = await GetByIDAndName(madexuat, macongty, magiangvien);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}
export async function GetByStatusFunction(status: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: GioiThieuCongTy[] = await GetByStatus(status);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function XacThucThanhCong(madexuat: string, magiangvien: string, macongty: string) {
    try {
        // Lấy tất cả học phần từ API
        await xacthucthanhcong(madexuat, magiangvien, macongty);
        alert("Xác thực thành công");
        window.location.reload();
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function XacThucKhongThanhCong(madexuat: string, magiangvien: string, macongty: string) {
    try {
        // Lấy tất cả học phần từ API
        await xacthuckhongthanhcong(madexuat, magiangvien, macongty);
        alert("Xác thực thành công");
        window.location.reload();
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function ThongSo(magiangvien: string) {
    try {
        // Lấy tất cả học phần từ API
        const res = await thongso(magiangvien);
        return res
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}


