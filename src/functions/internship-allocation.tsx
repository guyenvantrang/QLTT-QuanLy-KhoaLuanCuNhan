import type { PhanBoSinhVien } from "../models/model-all";
import {
    GetAll, Create, update, deletes, phanBoSinhVien, phanBoSinhVienTheoDiaChi,
    GetAllocationByStudent, xacNhanRot, chuyenDotMoi, traLoiPhanHoi,
    xacnhandau, phanbogiaovien, phanBoSinhVienTheochuyennganh
} from "../api/internship-allocation";
import type { CompanyPayload, StudentPayload, CompanychuyennganhPayload, StudentchuyennganhPayload } from "../models/allocation/add";

interface AllocationCompanyWithStudents extends CompanyPayload {
    students: StudentPayload[];
}

interface AllocationChuyenNganhCompanyWithStudents extends CompanychuyennganhPayload {
    students: StudentchuyennganhPayload[];
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

export async function phanBoTuDongchuyennganh(
    madot: string,
    madotphanbo: string,
    companies: AllocationChuyenNganhCompanyWithStudents[]
) {
    try {
        if (companies.length === 0) {
            alert("Danh sách công ty trống!");
            return;
        }
        let remainingStudents = companies.flatMap((c) => c.students);
        if (remainingStudents.length === 0) {
            alert("Danh sách sinh viên trống!");
            return;
        }
        for (const comp of companies) {
            if (remainingStudents.length === 0) break; // hết sinh viên thì dừng

            // Lấy số lượng sinh viên cần phân bổ cho công ty
            const numToAllocate = Math.min(comp.soluong, remainingStudents.length);
            alert(JSON.stringify(comp, null, 2));
            alert(`soluong = ${comp.soluong}`);

            alert(`remainingStudents.length = ${remainingStudents.length}`);



            // Lấy danh sách sinh viên tương ứng
            const studentsForCompany = remainingStudents.slice(0, numToAllocate);
            alert(JSON.stringify({ studentsForCompany }, null, 2));
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

export async function phanbosinhvientheochuyennganh(students: StudentchuyennganhPayload[], companies: CompanychuyennganhPayload[]) {
    try {
        const res = await phanBoSinhVienTheochuyennganh(students, companies);
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
        const res = await phanbogiaovien(soluong, madot, magiangvien, masv);
        return res;
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi trả lời phản hồi.");
        return undefined;
    }
}

export async function phanbogiaovienhuongdantudong(
    madot: string,
    lecturers: { magiangvien: string; listCongTy: string[] }[],
    students: { masv: string; macongty: string }[]
) {
    try {
        if (!students.length || !lecturers.length) {
            throw new Error("Danh sách sinh viên hoặc giảng viên rỗng.");
        }

        const totalSv = students.length;
        const totalGv = lecturers.length;

        // quota chia đều
        const baseQuota = Math.floor(totalSv / totalGv);
        let remainder = totalSv % totalGv;

        const gvQuota: Record<string, number> = {};
        const gvAssignments: Record<string, string[]> = {};
        const usedStudents = new Set<string>();

        for (const gv of lecturers) {
            gvQuota[gv.magiangvien] = baseQuota + (remainder > 0 ? 1 : 0);
            gvAssignments[gv.magiangvien] = [];
            if (remainder > 0) remainder--;
        }

        // Danh sách công ty
        const companies = Array.from(new Set(students.map(s => s.macongty)));

        // -------------------------
        // VÒNG 1 – GHÉP THEO CÔNG TY
        // -------------------------
        for (const company of companies) {
            const svInCompany = students.filter(s => s.macongty === company);

            for (const sv of svInCompany) {
                // Những giảng viên có công ty trùng + còn slot
                const matchingGVs = lecturers.filter(gv =>
                    gv.listCongTy.includes(company) &&
                    gvAssignments[gv.magiangvien].length < gvQuota[gv.magiangvien]
                );

                if (matchingGVs.length === 0) continue; // bỏ qua nếu không có GV trùng

                // chọn giảng viên có ít SV nhất
                const selected = matchingGVs.reduce((a, b) =>
                    gvAssignments[a.magiangvien].length <= gvAssignments[b.magiangvien].length ? a : b
                );

                gvAssignments[selected.magiangvien].push(sv.masv);
                usedStudents.add(sv.masv);
            }
        }

        // -------------------------
        // VÒNG 2 – BÙ SLOT CÒN THIẾU
        // -------------------------
        const remainingStudents = students.filter(s => !usedStudents.has(s.masv));

        for (const sv of remainingStudents) {
            // lấy GV còn slot
            const gvWithSlot = lecturers.filter(
                gv => gvAssignments[gv.magiangvien].length < gvQuota[gv.magiangvien]
            );

            if (gvWithSlot.length === 0) break;

            // chọn giảng viên ít SV nhất
            const selected = gvWithSlot.reduce((a, b) =>
                gvAssignments[a.magiangvien].length <= gvAssignments[b.magiangvien].length ? a : b
            );

            gvAssignments[selected.magiangvien].push(sv.masv);
            usedStudents.add(sv.masv);
        }

        // -------------------------
        // GỬI LÊN SERVER (GIỮ NGUYÊN)
        // -------------------------
        for (const gv of lecturers) {
            const listSv = gvAssignments[gv.magiangvien];
            if (listSv.length > 0) {
                await phanbogiaovien(
                    listSv.length,
                    madot,
                    gv.magiangvien,
                    listSv
                );
            }
        }

        return {
            result: true,
            message: "Phân bổ giảng viên thành công (ưu tiên trùng công ty + chia đều)",
            assignments: gvAssignments
        };

    } catch (err: any) {
        console.error(err);
        alert(err.message || "Đã xảy ra lỗi khi phân bổ giảng viên.");
        return false;
    }
}


export function phanbogiaovienhuongdantudong_preview(
    madot: string,
    lecturers: { magiangvien: string; listCongTy: string[] }[],
    students: { masv: string; macongty: string }[]
) {
    try {
        if (!students.length || !lecturers.length) {
            throw new Error("Danh sách sinh viên hoặc giảng viên rỗng.");
        }

        const totalSv = students.length;
        const totalGv = lecturers.length;

        // quota chia đều
        const baseQuota = Math.floor(totalSv / totalGv);
        let remainder = totalSv % totalGv;

        const gvQuota: Record<string, number> = {};
        const gvAssignments: Record<string, string[]> = {};
        const usedStudents = new Set<string>();

        // khởi tạo quota + danh sách phân công rỗng
        for (const gv of lecturers) {
            gvQuota[gv.magiangvien] = baseQuota + (remainder > 0 ? 1 : 0);
            gvAssignments[gv.magiangvien] = [];
            if (remainder > 0) remainder--;
        }

        // Danh sách công ty
        const companies = Array.from(new Set(students.map(s => s.macongty)));

        // -------------------------
        // GIAI ĐOẠN 1 – GHÉP THEO CÔNG TY
        // -------------------------
        for (const company of companies) {
            const svInCompany = students.filter(s => s.macongty === company);

            for (const sv of svInCompany) {
                // Giảng viên có công ty trùng + còn slot
                const matchingGVs = lecturers.filter(
                    gv =>
                        gv.listCongTy.includes(company) &&
                        gvAssignments[gv.magiangvien].length < gvQuota[gv.magiangvien]
                );

                if (matchingGVs.length === 0) continue;

                // giảng viên hiện đang có ít SV nhất
                const selected = matchingGVs.reduce((a, b) =>
                    gvAssignments[a.magiangvien].length <= gvAssignments[b.magiangvien].length
                        ? a
                        : b
                );

                gvAssignments[selected.magiangvien].push(sv.masv);
                usedStudents.add(sv.masv);
            }
        }

        // -------------------------
        // GIAI ĐOẠN 2 – BÙ SLOT CÒN THIẾU
        // -------------------------
        const remainingStudents = students.filter(s => !usedStudents.has(s.masv));

        for (const sv of remainingStudents) {
            const gvWithSlot = lecturers.filter(
                gv => gvAssignments[gv.magiangvien].length < gvQuota[gv.magiangvien]
            );

            if (gvWithSlot.length === 0) break;

            const selected = gvWithSlot.reduce((a, b) =>
                gvAssignments[a.magiangvien].length <= gvAssignments[b.magiangvien].length
                    ? a
                    : b
            );

            gvAssignments[selected.magiangvien].push(sv.masv);
            usedStudents.add(sv.masv);
        }

        // -------------------------
        // TRẢ VỀ ĐỂ HIỂN THỊ (KHÔNG GỬI SERVER)
        // -------------------------
        return {
            result: true,
            message: "Phân bổ xem trước (ưu tiên trùng công ty + chia đều, không gửi server).",
            assignments: gvAssignments,
            quota: gvQuota
        };

    } catch (err: any) {
        console.error(err);
        return {
            result: false,
            message: err.message || "Đã xảy ra lỗi khi phân bổ.",
            assignments: {}
        };
    }
}
