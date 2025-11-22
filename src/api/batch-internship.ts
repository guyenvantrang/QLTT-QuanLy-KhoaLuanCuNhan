import axios from "axios";
const API_URL = "http://localhost:3000";

export async function GetAll(page: number, limit: number) {
    try {
        const res = await axios.get(`${API_URL}/api/batchsinternship/get-all-data/${page}/${limit}`);

        return res.data.dulieu;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}
export async function GetByID(madot: string) {
    try {
        const res = await axios.get(`${API_URL}/api/batchsinternship/get-data-by-id/${madot}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}
export async function ThongKe(madot: string) {
    try {
        const res = await axios.get(`${API_URL}/api/batchsinternship/thongke/${madot}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}
export async function GetByIDAndName(madot?: string, tendot?: string) {
    try {
        const params: any = {};
        if (madot) params.madot = madot;
        if (tendot) params.tendot = tendot;

        const res = await axios.get(`${API_URL}/api/batchsinternship/get-data-by-id-and-name`, { params });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

export async function GetByStatus(status: number) {
    try {
        const res = await axios.get(`${API_URL}/api/batchsinternship/get-data-by-status/${status}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");

    }
}
export async function AddBatchInternship(tendot: string, ngaylap: string, thoigiantrienkhai: string,
    thoigianketthuc: string, thoigianketthucdangky: string, thoigianketthucchinhsua: string,
    soluongdangky: number, trangthai: number, ghitru: string
) {
    try {
        const payload = {
            tendot, ngaylap, thoigiantrienkhai, thoigianketthuc, thoigianketthucdangky,
            thoigianketthucchinhsua, soluongdangky, trangthai, ghitru
        };

        const res = await axios.post(`${API_URL}/api/batchsinternship/create-new-data`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res.data; // trả về dữ liệu từ server
    } catch (err: any) {
        if (err.response?.data?.message) throw new Error(err.response.data.message);
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
}

export async function Delete(madot: string) {
    try {
        const res = await axios.delete(`${API_URL}/api/batchsinternship/delete-data/${madot}`);
        return res.data.dulieu;
    } catch (err: any) {
        alert("Không thể xóa đợt này");
    }
}
export async function UpdateBatchInternship(madot: string, tendot: string, ngaylap: string, thoigiantrienkhai: string,
    thoigianketthuc: string, thoigianketthucdangky: string, thoigianketthucchinhsua: string,
    soluongdangky: number, trangthai: number, ghitru: string) {
    try {
        const payload = {
            tendot, ngaylap, thoigiantrienkhai, thoigianketthuc, thoigianketthucdangky,
            thoigianketthucchinhsua, soluongdangky, trangthai, ghitru
        };

        const res = await axios.patch(`${API_URL}/api/batchsinternship/update-data/${madot}`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (err: any) {
        alert("Không thể xóa đợt này");
    }
}