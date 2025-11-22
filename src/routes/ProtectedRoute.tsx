import { useAuth } from "../models/model-all";
import { useState } from "react";
import type { JSX } from "react";
import toast from "react-hot-toast";

interface Props {
  accessCode: string; // mã trang (diachitruycap)
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ accessCode, children }) => {
  const { user, hasPage } = useAuth();
  const [alerted, setAlerted] = useState(false);

  // Nếu chưa login, không hiển thị gì
  if (!user) return null;

  // Nếu không có quyền
  if (!hasPage(accessCode)) {
    if (!alerted) {
      toast.error("Bạn không có quyền truy cập trang này!");
      setAlerted(true);
    }
    return null; // không render children
  }

  return children; // render nếu có quyền
};

export default ProtectedRoute;
