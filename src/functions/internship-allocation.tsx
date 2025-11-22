import type { PhanBoSinhVien } from "../models/model-all";
import {
    GetAll, Create, update, deletes, phanBoSinhVien, phanBoSinhVienTheoDiaChi,
    GetAllocationByStudent, xacNhanRot, chuyenDotMoi, traLoiPhanHoi,
    xacnhandau , phanbogiaovien
} from "../api/internship-allocation";
import type { CompanyPayload, StudentPayload } from "../models/allocation/add";

interface AllocationCompanyWithStudents extends CompanyPayload {
    students: StudentPayload[];
}


export async function GetAllFunction(madot: string) {
    try {
        // Lấy tất cả học phần từ API
        const res: PhanBoSinhVien[] = await GetAll(madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function XacNhanRotFunction(madot: string, masv: string) {
    try {
        const res = await xacNhanRot(madot, masv);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi xác nhận rớt sinh viên.");
        return undefined;
    }
}

export async function XacNhanDau(madot: string, masv: string, macongty: string) {
    try {
        const res = await xacnhandau(madot, masv, macongty);
        window.location.reload();
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi xác nhận rớt sinh viên.");
        return undefined;
    }
}

/**
 * Gọi API chuyển sinh viên sang đợt phân bổ mới
 */
export async function ChuyenDotMoiFunction(madot: string, masv: string) {
    try {
        const res = await chuyenDotMoi(madot, masv);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi chuyển đợt mới.");
        return undefined;
    }
}

/**
 * Gọi API trả lời phản hồi tình trạng sinh viên
 */
export async function TraLoiPhanHoiFunction(
    madot: string,
    masv: string,
    madotphanbo: string,
    matinhtrang: string,
    huonggiaiquyet: string
) {
    try {
        const res = await traLoiPhanHoi(madot, masv, madotphanbo, matinhtrang, huonggiaiquyet);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi trả lời phản hồi.");
        return undefined;
    }
}

export async function LayDanhSachTheoSinhVien(masv: string, madot: string) {
    try {
        // Lấy tất cả đợt phân bố liên quan sinh viên từ API
        const res: PhanBoSinhVien[] = await GetAllocationByStudent(masv, madot);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}
export async function phanBoTuDong(
    madot: string,
    madotphanbo: string,
    companies: AllocationCompanyWithStudents[]
) {
    try {
        if (companies.length === 0) {
            alert("Danh sách công ty trống!");
            return;
        }

        // Tạo bản sao danh sách sinh viên chưa phân bổ
        let remainingStudents = companies.flatMap((c) => c.students);

        if (remainingStudents.length === 0) {
            alert("Danh sách sinh viên trống!");
            return;
        }

        // Duyệt từng công ty theo thứ tự ưu tiên
        for (const comp of companies) {
            if (remainingStudents.length === 0) break; // hết sinh viên thì dừng

            // Lấy số lượng sinh viên cần phân bổ cho công ty
            const numToAllocate = Math.min(comp.soluong, remainingStudents.length);

            // Lấy danh sách sinh viên tương ứng
            const studentsForCompany = remainingStudents.slice(0, numToAllocate);

            // Gọi API backend phân bổ
            const res = await phanBoSinhVien(
                madot,
                madotphanbo,
                comp.macongty,
                studentsForCompany.map((s) => s.masv)
            );

            if (res.result !== "oke") {
                alert(`Phân bổ công ty ${comp.macongty} thất bại!`);
            } else {
                console.log(`Đã phân bổ ${studentsForCompany.length} sinh viên cho công ty ${comp.macongty}`);
            }

            // Loại bỏ sinh viên đã phân bổ khỏi danh sách còn lại
            remainingStudents = remainingStudents.slice(numToAllocate);
        }

        alert("Phân bổ tất cả sinh viên thành công!");
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
}


export async function phanbosinhvien(madot: string, madotphanbo: string, macongty: string, masv: string[]) {
    try {
        // const payload = { madot, madotphanbo, macongty, masv };
        // alert("Dữ liệu kiểm tra: " + JSON.stringify(payload, null, 2));

        const res = await phanBoSinhVien(madot, madotphanbo, macongty, masv);
        if (res.result === "oke") {
            alert('Phân bổ thành công' + madot + "-" + madotphanbo + "-" + macongty + "-" + masv);
            return res
        }
        else {
            alert('Phân bổ không thành công');
        }
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}

export async function phanbosinhvientheodiachi(students: StudentPayload[], companies: CompanyPayload[]) {
    try {
        const res = await phanBoSinhVienTheoDiaChi(students, companies);
        if (res && Array.isArray(res)) {
            return res;
        } else {
            return undefined;
        }
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        return undefined;
    }
}


type PhanBoElements = {
    madot: HTMLInputElement;
    madotphanbo: HTMLInputElement;
    mota: HTMLInputElement;
};

// 🟩 Thêm đợt phân bố sinh viên
export async function createPhanBo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as unknown as PhanBoElements;

    const madot = elements.madot.value.trim();
    const mota = elements.mota.value.trim();

    if (!madot || !mota) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
        return;
    }

    try {
        await Create(madot, mota);
        alert("Thêm phân bố sinh viên thành công!");
        window.location.reload();

    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

// 🟧 Cập nhật thông tin phân bố sinh viên
export async function updatePhanBoFunction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as unknown as PhanBoElements;
    const madot = elements.madot.value.trim();
    const madotphanbo = elements.madotphanbo.value.trim();
    const mota = elements.mota.value.trim();
    if (!mota || !madot || !madotphanbo) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
        return;
    }

    try {
        const result = await update(madotphanbo, madot, mota);
        if (result?.result === "no") {
            alert("Sinh viên này không thể cập nhật phân bố.");
            return;
        }
        alert("Cập nhật phân bố sinh viên thành công!" + madot + madotphanbo + mota + "zssssss");
        window.location.reload();
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

// 🟥 Xóa phân bố sinh viên
export async function deletePhanBoFunction(madotphanbo: string) {
    try {
        const res = await deletes(madotphanbo);
        if (res.result === "no") {
            alert("🗑️ Không thể xóa đợt phân bố này ");
            return;
        }
        alert("🗑️ Xóa phân bố sinh viên thành công!");
        window.location.reload();
        return true;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Không thể xóa phân bố sinh viên này.");
        return false;
    }
}

//soluong: number, madot: string, magiangvien: string, masv: string[]
export async function phanbogiaovienhuongdanthucong(soluong: number, madot: string, magiangvien: string, masv: string[]) {
    try {
        const res = await phanbogiaovien(soluong , madot,magiangvien, masv);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi trả lời phản hồi.");
        return undefined;
    }
}

export async function phanbogiaovienhuongdantudong(
  madot: string,
  magiangvien: string[],
  masinhvien: string[]
) {
  try {
    if (!masinhvien.length || !magiangvien.length) {
      throw new Error("Danh sách sinh viên hoặc giảng viên rỗng.");
    }

    const totalSv = masinhvien.length;
    const totalGv = magiangvien.length;

    // Tính số lượng sinh viên cho từng giảng viên
    // Chia đều, giảng viên đầu tiên có thể nhiều hơn 1 nếu không chia hết
    const baseCount = Math.floor(totalSv / totalGv);
    let remainder = totalSv % totalGv;

    let startIndex = 0;

    for (const gv of magiangvien) {
      let count = baseCount;
      if (remainder > 0) {
        count += 1;
        remainder -= 1;
      }

      const svSlice = masinhvien.slice(startIndex, startIndex + count);
      startIndex += count;

      if (svSlice.length > 0) {
        // Gọi hàm đã kết nối server
        await phanbogiaovien(count, madot, gv, svSlice);
      }
    }

    return true;
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi khi phân bổ giảng viên.");
    return false;
  }
}
