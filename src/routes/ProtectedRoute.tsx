import { useAuth } from "../models/model-all";
import { useState } from "react";
import type { JSX } from "react";
import toast from "react-hot-toast";
interface Props {
  trangtruycap: string;   // ví dụ: "/home"
  matruycap: string;      // ví dụ: "hienthi_home"
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ trangtruycap, matruycap, children }) => {
  const { user, hasFunc } = useAuth();
  const [alerted, setAlerted] = useState(false);

  if (!user) return null;

  if (!hasFunc(trangtruycap, matruycap)) {
    if (!alerted) {
      toast.error("Bạn không có quyền truy cập trang này!");
      setAlerted(true);
    }
    return null;
  }

  return children;
};

export default ProtectedRoute; 