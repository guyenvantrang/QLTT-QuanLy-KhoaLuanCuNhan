export async function login(taikhoan: string, matkhau: string) {
  const res = await fetch("http://localhost:8000/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taikhoan, matkhau }),
  });

  if (!res.ok) throw new Error("Đăng nhập thất bại");

  return res.json();
}
