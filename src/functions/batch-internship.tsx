import type { DotThucTap } from "../models/model-all";
import { GetAll, AddBatchInternship, Delete, UpdateBatchInternship, 
    GetByID, GetByIDAndName, GetByStatus , ThongKe } from "../api/batch-internship";
import { type NavigateFunction } from "react-router-dom";

export async function GetAllFunction(page: number, limit: number) {
    try {
        // Lấy tất cả học phần từ API
        const res: DotThucTap[] = await GetAll(page, limit);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function GetByIDFunction(madot: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: DotThucTap = await GetByID(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function thongke(madot: string) {
    try {
        // Lấy tất cả học phần từ API
        const res = await ThongKe(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function GetByIDAndNameFunction(madot: string , tendot:string) {
    try {
        // Lấy tất cả học phần từ API
        const res: DotThucTap[] = await GetByIDAndName(madot,tendot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}
export async function GetByStatusFunction(status:number) {
    try {
        // Lấy tất cả học phần từ API
        const res: DotThucTap[] = await GetByStatus(status);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function DeleteFunction(madot: string) {
    try {
        await Delete(madot);
        window.location.reload();
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}


type AddElements = {
    madot: HTMLInputElement;
    tendot: HTMLInputElement;
    ngaylap: HTMLInputElement;
    thoigiantrienkhai: HTMLInputElement;
    thoigianketthuc: HTMLInputElement;
    thoigianketthucdangky: HTMLInputElement;
    thoigianketthucchinhsua: HTMLInputElement;
    soluongdangky: HTMLInputElement;
    trangthai: HTMLInputElement;
    ghitru: HTMLInputElement;
};



export async function create(e: React.FormEvent<HTMLFormElement>, navigate: NavigateFunction) {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as unknown as AddElements;

    // Lấy giá trị từ form, đảm bảo luôn là string
    const tendot = elements.tendot?.value.trim();
    const ngaylap = new Date(elements.ngaylap?.value || "").toISOString();
    const thoigiantrienkhai = new Date(elements.thoigiantrienkhai?.value.trim() || "").toISOString();
    const thoigianketthuc = new Date(elements.thoigianketthuc?.value || "").toISOString();
    const thoigianketthucdangky = new Date(elements.thoigianketthucdangky?.value || "").toISOString();
    const thoigianketthucchinhsua = new Date(elements.thoigianketthucchinhsua?.value || "").toISOString();
    const soluongdangkyStr = elements.soluongdangky?.value.trim();
    const trangthaistr = elements.trangthai?.value ?? "0";
    const ghitru = elements.ghitru?.value.trim() || "";

    // Convert số lượng đăng ký sang number
    const soluongdangky = Number(soluongdangkyStr);
    const trangthai = Number(trangthaistr);

    // Kiểm tra các trường bắt buộc
    if (!tendot || !ngaylap || !thoigiantrienkhai || !thoigianketthuc) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }

    try {
        await AddBatchInternship(
            tendot,
            ngaylap,
            thoigiantrienkhai,
            thoigianketthuc,
            thoigianketthucdangky,
            thoigianketthucchinhsua,
            soluongdangky, // giữ kiểu string nếu API yêu cầu
            trangthai,
            ghitru
        );
        alert("Thêm đợt thành công");
        navigate("/batch-internship", { replace: true });

    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
}
export async function update(e: React.FormEvent<HTMLFormElement>, navigate: NavigateFunction) {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as unknown as AddElements;

    // Lấy giá trị từ form, đảm bảo luôn là string
    const madot = elements.madot?.value.trim();
    const tendot = elements.tendot?.value.trim();
    const ngaylap = new Date(elements.ngaylap?.value || "").toISOString();
    const thoigiantrienkhai = new Date(elements.thoigiantrienkhai?.value.trim() || "").toISOString();
    const thoigianketthuc = new Date(elements.thoigianketthuc?.value || "").toISOString();
    const thoigianketthucdangky = new Date(elements.thoigianketthucdangky?.value || "").toISOString();
    const thoigianketthucchinhsua = new Date(elements.thoigianketthucchinhsua?.value || "").toISOString();
    const soluongdangkyStr = elements.soluongdangky?.value.trim();
    const trangthaistr = elements.trangthai?.value;
    const ghitru = elements.ghitru?.value.trim() || "";

    // Convert số lượng đăng ký sang number
    const soluongdangky = Number(soluongdangkyStr);
    const trangthai = Number(trangthaistr);

    // Kiểm tra các trường bắt buộc
    if (!tendot || !ngaylap || !thoigiantrienkhai || !thoigianketthuc) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }

    try {
        await UpdateBatchInternship(madot,
            tendot,
            ngaylap,
            thoigiantrienkhai,
            thoigianketthuc,
            thoigianketthucdangky,
            thoigianketthucchinhsua,
            soluongdangky, // giữ kiểu string nếu API yêu cầu
            trangthai,
            ghitru
        );
        alert("Cập nhật đợt thành công");
        navigate("/batch-internship", { replace: true });

    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

