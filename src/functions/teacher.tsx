import type { GiangVien } from "../models/model-all";
import { GetByID, getall, laythongtinlienquan, create, update_, delete_ ,LayDanhSachGiangVienDePhanBo} from "../api/teacher";
import type { NavigateFunction } from "react-router-dom";


export async function GetByIDGvFunction(magiangvien: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: GiangVien = await GetByID(magiangvien);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function laytatca() {
    try {
        // Lấy tất cả học phần từ API
        const res: GiangVien = await getall();
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

type AddElements = {
    magiangvien: HTMLInputElement;
    tengiangvien: HTMLInputElement;
    email: HTMLInputElement;
    sdt: HTMLInputElement;
    trangthai: HTMLInputElement;
};


export async function Create(e: React.FormEvent<HTMLFormElement>, navigate: NavigateFunction) {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as unknown as AddElements;

    // Lấy giá trị từ form, đảm bảo luôn là string
    const tengiangvien = elements.tengiangvien?.value.trim();
    const email = elements.email?.value.trim();
    const sdt = elements.sdt?.value.trim();
    const trangthai = elements.trangthai?.value.trim();
    if (!tengiangvien || !email || !sdt || !trangthai) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }
    try {
        // Lấy tất cả học phần từ API
        const ketqua = await create(tengiangvien, email, sdt, trangthai);
        if(ketqua.success ===false){
            alert("Email hoặc số điện thoại đã tồn tại")
            return ;
        }
        alert("Thêm giảng viên thành công");
        navigate("/teacher", { replace: true });
        return;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}
export async function Update(e: React.FormEvent<HTMLFormElement>, navigate: NavigateFunction) {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as unknown as AddElements;

    // Lấy giá trị từ form, đảm bảo luôn là string
    const magiangvien = elements.magiangvien?.value.trim();
    const tengiangvien = elements.tengiangvien?.value.trim();
    const email = elements.email?.value.trim();
    const sdt = elements.sdt?.value.trim();
    const trangthai = elements.trangthai?.value.trim();
    if (!tengiangvien || !email || !sdt || !trangthai) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }
    try {
        // Lấy tất cả học phần từ API
        await update_(magiangvien, tengiangvien, email, sdt, trangthai);
        alert("Cập nhật thành công");
        navigate("/batch-internship", { replace: true });
        return;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}




export async function Delete(magiangvien: string) {
    try {
        // Lấy tất cả học phần từ API
        await delete_(magiangvien);
        alert("Xóa thành công");
        window.location.reload();
        return;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function Laythongtinlienquan(magiangvien: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: GiangVien = await laythongtinlienquan(magiangvien);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}


export async function laygiangviendephanbosv() {
    try {
        // Lấy tất cả học phần từ API
        const res: GiangVien[] = await LayDanhSachGiangVienDePhanBo();
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}