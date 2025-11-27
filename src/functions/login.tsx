import { login } from "../api/login";
import { type NavigateFunction } from "react-router-dom";
import { useAuth } from "../models/model-all";
import type { NguoiDung } from "../models/model-all";

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
    const res = (await login(taikhoan, matkhau)) as NguoiDung;

    if (!res) {
      alert("Tài khoản hoặc mật khẩu không chính xác");
      return;
    }

    // ==== Lưu user và tự động flatten permissions trong context ====
    loginContext.login(res);

    navigate("/home");
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
  }
}
