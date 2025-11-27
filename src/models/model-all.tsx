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
  linhvuc: string;
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

  // --- Các cột điểm mới ---
  muctieuthuctap?: number;      // CLO1.1
  gioithieudonvi?: number;      // CLO1.2
  vitricongviec?: number;       // CLO1.3
  vandungkienthuc?: number;     // CLO2.1
  phuongphapthuchien?: number;  // CLO2.2
  yeucaocongviec?: number;      // CLO3.1
  baocaothuctap?: number;       // CLO3.2
  thuyettrinh?: number;         // CLO3.3
  traloicauhoi?: number;        // CLO3.4
  ythuckyluat?: number;         // CLO4.1
  kienthucthuctien?: number;    // CLO4.2

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
  chuyennganh: string;
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
  chitietnhomquyennguoidung?: ChiTietNhomQuyenNguoiDung[];
}
export interface ChucNang {
  machucnang: string;
  trangtruycap?: string;
  matruycap?: string;
  tenchucnang?: string;
  mota?: string;
  ngaytao?: string;
  ngaycapnhat?: string;

  chitietnhomquyenchucnang?: ChiTietNhomQuyenChucNang[];
}
export interface NhomQuyen {
  manhomquyen: string;
  tennhom?: string;
  mota?: string;
  ngaytao?: string;
  ngaysua?: string;

  chitietnhomquyennguoidung?: ChiTietNhomQuyenNguoiDung[];
  chitietnhomquyenchucnang?: ChiTietNhomQuyenChucNang[];
}
export interface ChiTietNhomQuyenNguoiDung {
  manguoidung: string;
  manhomquyen: string;
  nguoidung?: NguoiDung;
  nhomquyen?: NhomQuyen;
}
export interface ChiTietNhomQuyenChucNang {
  machucnang: string;
  manhomquyen: string;

  chucnang?: ChucNang;
  nhomquyen?: NhomQuyen;
}








import React, { createContext, useContext, useState, useEffect } from "react";
// ======= PERMISSIONS FLATTEN =======
export interface Permissions {
  roles: NhomQuyen[];
  functions: ChucNang[];
}

// ======= CONTEXT =======
interface AuthContextType {
  user: NguoiDung | null;
  permissions: Permissions;
  login: (userData: NguoiDung) => void;
  logout: () => void;
  hasFunc: (trangtruycap: string, matruycap: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ======= PROVIDER =======
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({ roles: [], functions: [] });

  // Restore session khi reload
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedPerms = localStorage.getItem("permissions");
      if (storedUser && storedPerms) {
        setUser(JSON.parse(storedUser));
        setPermissions(JSON.parse(storedPerms));
      }
    } catch (e) {
      console.error("Session restore failed:", e);
      localStorage.clear();
    }
  }, []);

  // Login + flatten permissions
  const login = (userData: NguoiDung) => {
    const roles: NhomQuyen[] = [];
    const functions: ChucNang[] = [];

    userData.chitietnhomquyennguoidung?.forEach(ct => {
      if (!ct.nhomquyen) return;
      roles.push(ct.nhomquyen);

      ct.nhomquyen.chitietnhomquyenchucnang?.forEach(cf => {
        if (cf.chucnang) {
          functions.push(cf.chucnang);
        }
      });
    });

    // Loại trùng chức năng theo machucnang
    const uniqueFunctions = Array.from(new Map(functions.map(f => [f.machucnang, f])).values());

    const perms: Permissions = { roles, functions: uniqueFunctions };

    setUser(userData);
    setPermissions(perms);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("permissions", JSON.stringify(perms));
  };

  const logout = () => {
    setUser(null);
    setPermissions({ roles: [], functions: [] });
    localStorage.clear();
  };

  const hasFunc = (trangtruycap: string, matruycap: string): boolean => {
    if (!user) return false;

    // ADMIN full quyền
    const roleName = user.chucvu?.tenchucvu?.trim().toLowerCase();
    if (roleName === "admin" || roleName === "quản trị viên") return true;

    // Kiểm tra trong flattened functions
    return permissions.functions.some(
      (f) => f.trangtruycap?.startsWith(trangtruycap) && f.matruycap === matruycap
    );

  };

  return (
    <AuthContext.Provider value={{ user, permissions, login, logout, hasFunc }}>
      {children}
    </AuthContext.Provider>
  );
};

// ======= HOOK =======
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};