import { useAuth } from "../models/model-all";
import type { ReactNode } from "react";

interface Props {
  trangtruycap: string;
  matruycap: string;
  children: ReactNode;
}

export const Can: React.FC<Props> = ({ trangtruycap, matruycap, children }) => {
  const { user, hasFunc } = useAuth();

  // Chưa login → không hiển thị
  if (!user) return null;

  // Admin hoặc "quản trị viên" → full quyền
  const roleName = user.chucvu?.tenchucvu?.trim().toLowerCase();
  if (roleName === "admin" || roleName === "quản trị viên") {
    return <>{children}</>;
  }

  // Kiểm tra quyền bình thường
  if (!hasFunc(trangtruycap, matruycap)) return null;

  return <>{children}</>;
};
