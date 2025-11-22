import { login } from "../api/login";
import { type NavigateFunction } from "react-router-dom";
import { useAuth } from "../models/model-all";

export async function submitLoginForm(
  e: React.FormEvent<HTMLFormElement>,
  navigate: NavigateFunction,
  loginContext: ReturnType<typeof useAuth>
) {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  const taikhoan = (formData.get("username") as string)?.trim();
  const matkhau = (formData.get("password") as string)?.trim();

  if (!taikhoan || !matkhau) {
    alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
    return;
  }

  try {
    const res = await login(taikhoan, matkhau);

    if (!res) {
      alert("Tài khoản hoặc mật khẩu không chính xác");
      return;
    }
    alert("Chi tiết nhóm quyền: " + JSON.stringify(res.chitietnhomquyen, null, 2));
    // Chuyển đổi permissions
    alert(res)
    const permissions = {
      pages: res.chitietnhomquyen?.map((c: any) => c.trangweb).filter(Boolean) || [],
      functions: res.chitietnhomquyen?.map((c: any) => c.chucnang).filter(Boolean) || [],
    };

    loginContext.login(res, permissions);

    navigate("/home");
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
  }
}
