import type { DangKyThucTap, SinhVien, XetDuyetSinhVien } from "../models/model-all";
import {
    HienThiSinhVienPhanBo, LaySinhVienTheoID, LaySinhVienTheodot, getTotalWithCompany,
    getTotalWithoutCompany,
    getUnreadMessages,
    getInitialInterviews,
    getFailedStudents,
    getNoResult,
    LaySinhVienNull,
    LayDanhSachSinhVienDePhanBoGiangVien , 
    laytatcasinhvien , 
    GetName , laysinhvienxetduyet, locsinhvienxetduyet, xetduyetdau, xetduyet
} from "../api/student";


export async function laysinhvienphanbo(masinhvien: string, madotphanbo: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: SinhVien[] = await HienThiSinhVienPhanBo(masinhvien, madotphanbo);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function laysinhvientheoid(masv: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: SinhVien = await LaySinhVienTheoID(masv);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function laysinhvientheodot(madot: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: DangKyThucTap[] = await LaySinhVienTheodot(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function laysinhviennull(madot: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: DangKyThucTap[] = await LaySinhVienNull(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}


// 2. Lấy tổng số sinh viên đã có công ty
export async function layTongSinhVienCoCongTy(madot: string) {
    try {
        const res :DangKyThucTap[]= await getTotalWithCompany(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy tổng số sinh viên có công ty.");
        return undefined;
    }
}

// 3. Lấy tổng số sinh viên chưa có công ty
export async function layTongSinhVienChuaCoCongTy(madot: string) {
    try {
        const res = await getTotalWithoutCompany(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy tổng số sinh viên chưa có công ty.");
        return undefined;
    }
}

// 4. Lấy tổng tin nhắn chưa đọc
export async function layTongTinNhanChuaDoc(madot: string) {
    try {
        const res = await getUnreadMessages(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy tổng tin nhắn chưa đọc.");
        return undefined;
    }
}

// 5. Lấy tổng phỏng vấn đầu
export async function layTongPhongVanDau(madot: string) {
    try {
        const res = await getInitialInterviews(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy tổng phỏng vấn đầu.");
        return undefined;
    }
}

// 6. Lấy tổng số sinh viên rớt và tổng lần rớt
export async function layTongSinhVienRot(madot: string) {
    try {
        const res = await getFailedStudents(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy số sinh viên rớt.");
        return undefined;
    }
}

// 7. Lấy tổng số sinh viên chưa có kết quả
export async function layTongChuaCoKetQua(madot: string) {
    try {
        const res = await getNoResult(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy số sinh viên chưa có kết quả.");
        return undefined;
    }
}


export async function laydanhsachsinhviendephanbogv(madot: string) {
    try {
        const res = await LayDanhSachSinhVienDePhanBoGiangVien(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy số sinh viên chưa có kết quả.");
        return undefined;
    }
}
export async function LayTatCaSV(page: number, limit: number) {
    try {
        const res : SinhVien[] = await laytatcasinhvien(page,limit);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy số sinh viên chưa có kết quả.");
        return undefined;
    }
}

export async function Timkiem(keyword:string) {
    try {
        const res : SinhVien[] = await GetName(keyword);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi lấy số sinh viên chưa có kết quả.");
        return undefined;
    }
}


// Lấy danh sách sinh viên xét duyệt
export async function LaySinhVienXetDuyet() {
  try {
    const res: XetDuyetSinhVien[] = await laysinhvienxetduyet();
    return res ;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi lấy danh sách sinh viên xét duyệt.");
    return undefined;
  }
}

// Lọc sinh viên theo trạng thái
export async function LocSinhVienXetDuyet(trangthai: string) {
  try {
    const res: XetDuyetSinhVien[] = await locsinhvienxetduyet(trangthai);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi lọc sinh viên xét duyệt.");
    return undefined;
  }
}

// Xét duyệt lần đầu
export async function XetDuyetDau(
  maxd: string,
  masv: string,
  hoten: string,
  email: string,
  ngaysinh: string,
  gioitinh: string,
  sdt: string
) {
  try {
    const res: any = await xetduyetdau(maxd, masv, hoten, email, ngaysinh, gioitinh, sdt);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi xét duyệt sinh viên lần đầu.");
    return undefined;
  }
}

// Xét duyệt theo ý định
export async function XetDuyetTheoYdinh(
  maxd: string,
  thongbao: string,
  trangthai: string
) {
  try {
    const res: any = await xetduyet(maxd, thongbao, trangthai);
    return res;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi xét duyệt sinh viên theo ý định.");
    return undefined;
  }
}
