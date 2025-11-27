import axios from "axios";
const API_URL = "http://localhost:3000";


export async function GetAll(page: number, limit: number) {
    try {
        const res = await axios.get(`${API_URL}/api/company/get-all-data/${page}/${limit}`);
        return res.data.dulieu;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function laycongtyphanbo() {
    try {
        const res = await axios.get(`${API_URL}/api/company/laycongtyphanbo`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}
export async function GetByID(macongty: string) {
    try {
        const res = await axios.get(`${API_URL}/api/company/get-data-by-id/${macongty}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function GetName(keyword: string) {
    try {
        const res = await axios.get(`${API_URL}/api/company/search/${keyword}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}

export async function Filter(phanloai?: string, hoatdong?: string) {
  try {
    const res = await axios.get(`${API_URL}/api/company/filter`, {
      params: {
        phanloai: phanloai || undefined,
        hoatdong: hoatdong || undefined,
      },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
  }
}


export async function AddCompany(tencongty: string, diachi: string, masothue: string,
    nguoidaidien: string, email: string, sdt: string, phanloai: string, hoatdong: string , linhvuc:string
) {
    try {
        const payload = {
            tencongty, diachi, masothue, nguoidaidien, email, sdt, phanloai, hoatdong,linhvuc
        };
        const res = await axios.post(`${API_URL}/api/company/create-company`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Không thể thêm công ty. Vui lòng thử lại.");
    }
}

// 🟥 Xóa công ty theo mã
export async function DeleteCompany(macongty: string) {
    try {
        const res = await axios.delete(`${API_URL}/api/company/delete-company/${macongty}`);
        return res.data?.dulieu;
    } catch (err: any) {
        throw new Error("Không thể xóa công ty này.");
    }
}

// 🟨 Cập nhật thông tin công ty
export async function UpdateCompany(
    macongty: string, tencongty?: string, diachi?: string, masothue?: string, nguoidaidien?: string,
    email?: string, sdt?: string, phanloai?: string, hoatdong?: string , linhvuc?:string
) {
    try {
        const payload = {
            tencongty, diachi, masothue, nguoidaidien, email, sdt, phanloai, hoatdong,linhvuc
        };
        const res = await axios.patch(`${API_URL}/api/company/update-company/${macongty}`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Không thể cập nhật thông tin công ty.");
    }
}

// 🟨 Cập nhật thông tin công ty
export async function ViTriThucTap(macongty: string , lat:number , long:number) {
    try {
       
        const res = await axios.patch(`${API_URL}/api/company/cap-nhat-vi-tri/${macongty}/${lat}/${long}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Không thể cập nhật thông tin công ty.");
    }
}

