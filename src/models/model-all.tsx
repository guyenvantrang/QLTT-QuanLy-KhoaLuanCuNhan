export interface BaoCaoTienDo {
  mabaocao: string;
  mota?: string;
  chitietbaocao?: ChiTietBaoCao[];
  dangkythuctap?: DangKyThucTap[];
}

export interface ChiTietBaoCao {
  machitiet: string;
  mabaocao: string;
  congviecduocgiao?: string;
  noidunghoanthanh?: string;
  khokhan?: string;
  thoihan?: string; // ISO Date string
  giangviendanhgia?: string;
  trangthai?: number;
  baocaotiendo?: BaoCaoTienDo;
}

export interface ChiTietDotPhanBo {
  madotphanbo: string;
  macongty: string;
  madot: string;
  masv: string;
  ngayphanbo?: string;
  ketquapv?: string;
  fileminhchung?: string;
  trangthai?: number;
  congtythuctap?: CongTyThucTap;
  dangkythuctap?: DangKyThucTap;
  phanbosinhvien?: PhanBoSinhVien;
  tinhtrangphongvan?: TinhTrangPhongVan[];
}

export interface CongTyChamChiem {
  macongtychamdiem: string;
  congviecduocgiao?: string;
  tinhhuuichvoicongty?: string;
  nanglucchuyenmon?: string;
  tinhthan?: string;
  thaido?: string;
  chuyencan?: string;
  nhanxettinhthanthaido?: string;
  nhanxettrachnhiem?: string;
  nhanxettrinhdo?: string;
  nhanxetkhac?: string;
  diemchuyencan?: number;
  diemchuyenmon?: number;
  dangkythuctap?: DangKyThucTap[];
}

export interface CongTyThucTap {
  macongty: string;
  tencongty?: string;
  diachi?: string;
  masothue?: string;
  nguoidaidien?: string;
  email?: string;
  sdt?: string;
  phanloai?: string;
  hoatdong?: string;
  lat: number;
  long: number;
  soluongphanbo: number,
  chitietdotphanbo?: ChiTietDotPhanBo[];
  dangkythuctap?: DangKyThucTap[];
  gioithieucongty?: GioiThieuCongTy[];
}

export interface DangKyThucTap {
  madot: string;
  masv: string;
  macongty?: string;
  magiangvien?: string;
  mabaocao?: string;
  macongtychamdiem?: string;
  maphanhoi?: string;
  madiem?: string;
  matailieu?: string;
  ngaydangky?: string;
  trangthai?: string;
  chitietdotphanbo?: ChiTietDotPhanBo[];
  baocaotiendo?: BaoCaoTienDo;
  congtychamchiem?: CongTyChamChiem;
  congtythuctap?: CongTyThucTap;
  giangvienchamdiem?: GiangVienChamDiem;
  dotthuctap?: DotThucTap;
  giangvien?: GiangVien;
  phanhoi?: PhanHoi;
  sinhvien?: SinhVien;
  tailieubaocao?: TaiLieuBaoCao;
}

export interface DotThucTap {
  madot: string;
  tendot?: string;
  ngaylap?: string;
  thoigiantrienkhai?: string;
  thoigianketthuc?: string;
  thoigianketthucdangky?: string;
  thoigianketthucchinhsua?: string;
  soluongdangky?: number;
  trangthai?: number;
  ghitru?: string;
  dangkythuctap?: DangKyThucTap[];
  phanbosinhvien?: PhanBoSinhVien[];
}

export interface GiangVien {
  magiangvien: string;
  tengiangvien?: string;
  email?: string;
  sdt?: string;
  trangthai?: string;
  matkhau?: string;
  dangkythuctap?: DangKyThucTap[];
  gioithieucongty?: GioiThieuCongTy[];
}

export interface GiangVienChamDiem {
  madiem: string;
  nhanxettrinhbay?: string;
  nhanxetbaocao?: string;
  diemtrinhbay?: number;
  diembaocao?: number;
  dangkythuctap?: DangKyThucTap[];
}

export interface GioiThieuCongTy {
  madexuat: string;
  magiangvien: string;
  macongty: string;
  trangthai?: string;
  ngaydexuat?: string;
  mota?: string;
  congtythuctap?: CongTyThucTap;
  giangvien?: GiangVien;
}

export interface PhanBoSinhVien {
  madotphanbo: string;
  madot: string;
  ngaytao?: string;
  mota?: string;
  chitietdotphanbo?: ChiTietDotPhanBo[];
  dotthuctap?: DotThucTap;
}

export interface PhanHoi {
  maphanhoi: string;
  tieude?: string;
  noidungph?: string;
  traloiph?: string;
  chitietphanhoi?: ChiTietPhanHoi[];
  dangkythuctap?: DangKyThucTap[];
}

export interface ChiTietPhanHoi {
  mactph: string;
  maphanhoi: string;
  tieude?: string;
  noidungph?: string;
  traloiph?: string;
  phanhoi?: PhanHoi;
}

export interface SinhVien {
  masv: string;
  hoten?: string;
  email?: string;
  ngaysinh?: string;
  gioitinh?: string;
  sdt?: string;
  diachi?: string;
  matkhau?: string;
  lat: number;
  long: number;
  dangkythuctap?: DangKyThucTap[];
}

export interface TaiLieuBaoCao {
  matailieu: string;
  fileminhchung?: string;
  hanbaocao?: string;
  dangkythuctap?: DangKyThucTap[];
}

export interface TinhTrangPhongVan {
  madotphanbo: string;
  macongty: string;
  madot: string;
  masv: string;
  matinhtrang: string;
  vandephatsinh?: string;
  noidungphatsinh?: string;
  huonggiaiquyet?: string;
  chitietdotphanbo?: ChiTietDotPhanBo;
}

export interface XetDuyetSinhVien {
  maxd: string;
  masv: string;
  hoten?: string;
  email?: string;
  ngaysinh?: string;
  gioitinh?: string;
  sdt?: string;
  trangthai?: string;
  thongbao?: string;
}

export interface thongbao {
  mathongbao: string;
  tieude: string;
  noidung: string;
  duongdanfilecongvan?: string;
  duongdanfiletailieu?: string;
  ngaytao: Date;
}

// PhanQuyenModels.ts

export interface ChucVu {
  machucvu: string;
  tenchucvu?: string;
  mota?: string;
  ngaytao?: string;
  ngaycapnhat?: string;
  nguoidung?: NguoiDung[];
}

export interface NguoiDung {
  manguoidung: string;
  machucvu?: string;
  tennguoidung?: string;
  taikhoan?: string;
  matkhau?: string;
  chucvu?: ChucVu;
  chitietnhomquyen?: ChiTietNhomQuyen[];
}

export interface TrangWeb {
  matrang: string;
  tentrang?: string;
  mota?: string;
  diachitruycap?: string;
  ngaytao?: string;
  ngaycapnhat?: string;
  chucnang?: ChucNang[];
  chitietnhomquyen?: ChiTietNhomQuyen[];
}

export interface ChucNang {
  machucnang: string;
  matrang?: string;
  matruycap?: string;
  tenchucnang?: string;
  mota?: string;
  ngaytao?: string;
  ngaycapnhat?: string;
  chitietnhomquyen?: ChiTietNhomQuyen[];
  trangweb?: TrangWeb;
}

export interface NhomQuyen {
  manhomquyen: string;
  tennhom?: string;
  mota?: string;
  ngaytao?: string;
  ngaysua?: string;
  chitietnhomquyen?: ChiTietNhomQuyen[];
}

export interface ChiTietNhomQuyen {
  manguoidung: string;
  manhomquyen: string;
  machucnang: string;
  matrang: string;
  nguoidung?: NguoiDung;
  nhomquyen?: NhomQuyen;
  chucnang?: ChucNang;
  trangweb?: TrangWeb;
}

// import React, { createContext, useContext, useState, useEffect } from "react";
// interface AuthContextType {
//   user: NguoiDung | null;
//   permissions: {
//     pages: TrangWeb[];
//     functions: ChucNang[];
//   };
//   login: (user: NguoiDung, permissions: any) => void;
//   logout: () => void;
//   hasPage: (matruycap: string) => boolean;
//   hasFunc: (machucnang: string, matrang: string) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<NguoiDung | null>(null);
//   const [permissions, setPermissions] = useState<{ pages: TrangWeb[]; functions: ChucNang[] }>({ pages: [], functions: [] });

//   // Khôi phục từ localStorage khi reload
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedPerms = localStorage.getItem("permissions");
//     if (storedUser && storedPerms) {
//       setUser(JSON.parse(storedUser));
//       setPermissions(JSON.parse(storedPerms));
//     }
//   }, []);

//   const login = (userData: NguoiDung, perms: any) => {
//     setUser(userData);
//     setPermissions(perms);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("permissions", JSON.stringify(perms));
//   };

//   const logout = () => {
//     setUser(null);
//     setPermissions({ pages: [], functions: [] });
//     localStorage.removeItem("user");
//     localStorage.removeItem("permissions");
//   };

//   const hasPage = (diachitruycap: string) => {
//     if (!user)  return false;
//     // Nếu người dùng thuộc chức vụ admin → full quyền
//     if (user?.chucvu?.tenchucvu?.toLowerCase() === "admin") return true;
//     alert(user?.chucvu?.tenchucvu)
//     return permissions.pages.some(p => p.diachitruycap === diachitruycap);
//   };

//   const hasFunc = (machucnang: string, matrang: string) => {
//     // Nếu người dùng thuộc chức vụ admin → full quyền
//     if (user?.chucvu?.tenchucvu?.toLowerCase() === "admin ") return true;

//     return permissions.functions.some(f => f.machucnang === machucnang && f.matrang === matrang);
//   };


//   return (
//     <AuthContext.Provider value={{ user, permissions, login, logout, hasPage, hasFunc }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from "react";
interface AuthContextType {
  user: NguoiDung | null;
  permissions: {
    pages: TrangWeb[];
    functions: ChucNang[];
  };
  login: (user: NguoiDung, permissions: { pages: TrangWeb[]; functions: ChucNang[] }) => void;
  logout: () => void;
  hasPage: (diachitruycap: string) => boolean;
  hasFunc: (matruycap: string, matrang: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [permissions, setPermissions] = useState<{ pages: TrangWeb[]; functions: ChucNang[] }>({
    pages: [],
    functions: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPerms = localStorage.getItem("permissions");
    if (storedUser && storedPerms) {
      setUser(JSON.parse(storedUser));
      setPermissions(JSON.parse(storedPerms));
    }
  }, []);

  const login = (userData: NguoiDung, perms: { pages: TrangWeb[]; functions: ChucNang[] }) => {
    setUser(userData);
    setPermissions(perms);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("permissions", JSON.stringify(perms));
  };

  const logout = () => {
    setUser(null);
    setPermissions({ pages: [], functions: [] });
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
  };

  const hasPage = (diachitruycap: string) => {
    if (!user) return false;
    if (user.chucvu?.tenchucvu?.toLowerCase() === "admin") return true;
    return permissions.pages.some((p) => p.diachitruycap === diachitruycap);
  };

  const hasFunc = (machucnang: string, matruycap: string) => {
    if (!user) return false;
    if (user.chucvu?.tenchucvu?.toLowerCase() === "admin") return true;
    // alert("matrang"+ machucnang +"---" +"matruycap" + matruycap)
    
    // Tìm trang theo đường dẫn
    const pageObj = permissions.pages.find(p => p.diachitruycap === matruycap);
    if (!pageObj) {
      console.warn("Không tìm thấy trang:", matruycap);
      return false;
    }

    const matrang = pageObj.matrang;
    // alert("mã trang :" + matrang);

    const hasPermission = permissions.functions.some(f => f.matruycap === machucnang && f.matrang === matrang);

    if (!hasPermission) {
      console.warn(`Người dùng không có quyền: chức năng=${machucnang}, trang=${matrang}`);
    }

    return hasPermission;
  };



  return (
    <AuthContext.Provider value={{ user, permissions, login, logout, hasPage, hasFunc }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
