import type { ReactNode } from "react";
import { useAuth } from "../models/model-all";

interface Props {
  func: string;
  page: string;
  children: ReactNode;
}

export const Can: React.FC<Props> = ({ func, page, children }) => {
  const { hasFunc } = useAuth();
  if (!hasFunc(func, page)) return null;
  return <>{children}</>;
};
