import { useEffect, useState, useMemo } from "react";
import { 
    FaUserCog, FaSearch, FaSpinner, FaGlobe, FaLayerGroup, FaHistory, FaFilter, FaCheckCircle, FaUser
} from "react-icons/fa";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Import API
import { 
    getAllNguoiDung, getAllNhomQuyen, getAllTrangWeb, 
    getAllChucNang, getAllChiTietNhomQuyen,
    addChiTietNhomQuyen, deleteChiTietNhomQuyen
} from "../../../api/login"; // Giả định bạn gộp export vào 1 file hoặc import lẻ từng file

import type { 
    NguoiDung, NhomQuyen, TrangWeb, ChucNang, ChiTietNhomQuyen 
} from "../../../models/model-all";

export default function QuanLyPhanQuyen() {
    // --- STATE DỮ LIỆU GỐC ---
    const [users, setUsers] = useState<NguoiDung[]>([]);
    const [groups, setGroups] = useState<NhomQuyen[]>([]);
    const [pages, setPages] = useState<TrangWeb[]>([]);
    const [functions, setFunctions] = useState<ChucNang[]>([]);
    const [permissions, setPermissions] = useState<ChiTietNhomQuyen[]>([]);

    // --- STATE UI ---
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPage, setFilterPage] = useState<string>("ALL");
    const [processing, setProcessing] = useState(false);

    // ✅ 1. LOAD ALL DATA (Promise.all để tối ưu)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resUsers, resGroups, resPages, resFuncs, resPerms] = await Promise.all([
                getAllNguoiDung(),
                getAllNhomQuyen(),
                getAllTrangWeb(),
                getAllChucNang(),
                getAllChiTietNhomQuyen()
            ]);

            setUsers(resUsers || []);
            // Lưu ý: getAllNhomQuyen và getAllChiTietNhomQuyen trong api bạn gửi trả về 'res', nên cần lấy .data nếu cần
            setGroups(resGroups.data || resGroups || []); 
            setPages(resPages || []);
            setFunctions(resFuncs || []);
            setPermissions(resPerms.data || resPerms || []);

        } catch (error: any) {
            toast.error("Lỗi tải dữ liệu hệ thống: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ 2. FILTER USERS
    const filteredUsers = useMemo(() => {
        return users.filter(u => 
            (u.tennguoidung?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             u.taikhoan?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    // ✅ 3. LOGIC XỬ LÝ PHÂN QUYỀN
    
    // Helper: Tìm quyền hiện tại của User tại Chức năng X thuộc Trang Y
    const getCurrentPermission = (userId: string, funcId: string, pageId: string) => {
        return permissions.find(p => 
            p.manguoidung === userId && 
            p.machucnang === funcId && 
            p.matrang === pageId
        );
    };

    // Action: Thay đổi quyền (Thêm/Xóa/Sửa)
    const handlePermissionChange = async (
        userId: string, 
        funcId: string, 
        pageId: string, 
        newGroupId: string
    ) => {
        if (!userId) return;
        setProcessing(true);
        
        // Tìm xem user đã có quyền tại chức năng này chưa
        const existingPerm = getCurrentPermission(userId, funcId, pageId);

        try {
            // TRƯỜNG HỢP 1: Nếu chọn "Không có quyền" (value rỗng) -> Xóa quyền cũ nếu có
            if (!newGroupId) {
                if (existingPerm) {
                    await deleteChiTietNhomQuyen(funcId, userId, existingPerm.manhomquyen, pageId);
                    toast.success("Đã gỡ bỏ quyền hạn");
                }
            } 
            // TRƯỜNG HỢP 2: Có chọn nhóm quyền mới
            else {
                // Nếu đã tồn tại quyền cũ -> Xóa cái cũ trước (Vì API delete yêu cầu 4 khóa chính bao gồm cả mã nhóm cũ)
                // Lưu ý: Nếu API Update hỗ trợ đổi mã nhóm thì dùng Update, nhưng an toàn nhất với khóa chính phức hợp là Xóa -> Thêm
                if (existingPerm) {
                    if (existingPerm.manhomquyen !== newGroupId) {
                        await deleteChiTietNhomQuyen(funcId, userId, existingPerm.manhomquyen, pageId);
                        await addChiTietNhomQuyen({
                            manguoidung: userId,
                            machucnang: funcId,
                            matrang: pageId,
                            manhomquyen: newGroupId
                        });
                        toast.success("Đã cập nhật nhóm quyền");
                    }
                } else {
                    // Chưa có -> Thêm mới
                    await addChiTietNhomQuyen({
                        manguoidung: userId,
                        machucnang: funcId,
                        matrang: pageId,
                        manhomquyen: newGroupId
                    });
                    toast.success("Đã cấp quyền mới");
                }
            }

            // Refresh lại danh sách permissions local (để UI cập nhật ngay mà không cần load lại tất cả)
            // Cách tốt nhất là fetch lại getAllChiTietNhomQuyen, hoặc cập nhật state thủ công
            const resPerms = await getAllChiTietNhomQuyen();
            setPermissions(resPerms.data || resPerms || []);

        } catch (error: any) {
            toast.error("Thao tác thất bại: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    // Action: Xóa tất cả quyền của User (Reset)
    const handleResetUserPermissions = async () => {
        if (!selectedUser) return;
        
        const result = await Swal.fire({
            title: 'Reset phân quyền?',
            text: `Bạn có chắc muốn xóa toàn bộ quyền hạn riêng của "${selectedUser.tennguoidung}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa sạch',
            confirmButtonColor: '#ef4444',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            setProcessing(true);
            const userPerms = permissions.filter(p => p.manguoidung === selectedUser.manguoidung);
            
            try {
                // Xóa lần lượt (hoặc backend nên có API xóa theo UserID)
                // Ở đây demo xóa loop client-side (không khuyến khích nếu dữ liệu lớn)
                for (const p of userPerms) {
                    await deleteChiTietNhomQuyen(p.machucnang, p.manguoidung, p.manhomquyen, p.matrang);
                }
                toast.success(`Đã reset quyền cho user ${selectedUser.tennguoidung}`);
                const resPerms = await getAllChiTietNhomQuyen();
                setPermissions(resPerms.data || resPerms || []);
            } catch (err) {
                toast.error("Có lỗi khi reset");
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <div className="p-4 bg-slate-50 min-h-screen font-sans h-screen flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-2 shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                        <FaUserCog className="text-indigo-600" /> 
                        Hệ Thống Phân Quyền
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Quản lý quyền truy cập chi tiết theo Người dùng - Trang Web - Chức Năng</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-600" title="Làm mới dữ liệu">
                        <FaHistory className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT - GRID LAYOUT */}
            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">
                
                {/* --- CỘT TRÁI: DANH SÁCH NGƯỜI DÙNG --- */}
                <div className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden h-full">
                    {/* Search Box */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Tìm nhân viên..." 
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* List Users */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400"><FaSpinner className="inline animate-spin"/> Đang tải...</div>
                        ) : filteredUsers.map(user => (
                            <div 
                                key={user.manguoidung}
                                onClick={() => setSelectedUser(user)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                                    selectedUser?.manguoidung === user.manguoidung 
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                    selectedUser?.manguoidung === user.manguoidung ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {user.tennguoidung?.charAt(0) || <FaUser/>}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold truncate ${selectedUser?.manguoidung === user.manguoidung ? 'text-indigo-700' : 'text-gray-700'}`}>
                                        {user.tennguoidung}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{user.chucvu?.tenchucvu || user.taikhoan}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- CỘT PHẢI: MA TRẬN PHÂN QUYỀN --- */}
                <div className="col-span-12 md:col-span-9 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden h-full relative">
                    
                    {!selectedUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                            <FaUserCog className="w-20 h-20 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Vui lòng chọn một người dùng để phân quyền</p>
                        </div>
                    ) : (
                        <>
                            {/* User Header Toolbar */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        {selectedUser.tennguoidung?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">{selectedUser.tennguoidung}</h2>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-mono">{selectedUser.manguoidung}</span>
                                            <span>•</span>
                                            <span>{selectedUser.chucvu?.tenchucvu || "Chưa có chức vụ"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Bộ lọc trang */}
                                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                                        <FaFilter className="text-gray-400 text-xs" />
                                        <select 
                                            className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                                            value={filterPage}
                                            onChange={(e) => setFilterPage(e.target.value)}
                                        >
                                            <option value="ALL">Tất cả Trang Web</option>
                                            {pages.map(p => (
                                                <option key={p.matrang} value={p.matrang}>{p.tentrang}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button 
                                        onClick={handleResetUserPermissions}
                                        disabled={processing}
                                        className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Reset Quyền
                                    </button>
                                </div>
                            </div>

                            {/* Matrix Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                                {loading || processing ? (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                        <div className="bg-white p-4 rounded-xl shadow-2xl flex items-center gap-3">
                                            <FaSpinner className="animate-spin text-indigo-600" />
                                            <span className="text-sm font-medium text-gray-700">Đang xử lý dữ liệu...</span>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="space-y-6">
                                    {pages
                                        .filter(page => filterPage === "ALL" || page.matrang === filterPage)
                                        .map(page => {
                                            // Lọc chức năng thuộc trang này
                                            const pageFunctions = functions.filter(f => f.matrang === page.matrang);
                                            
                                            // Nếu trang không có chức năng nào thì ẩn (hoặc hiển thị thông báo)
                                            if (pageFunctions.length === 0) return null;

                                            return (
                                                <div key={page.matrang} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                    {/* Page Header */}
                                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FaGlobe className="text-indigo-400" />
                                                            <h3 className="font-bold text-gray-700">{page.tentrang}</h3>
                                                            <span className="text-xs text-gray-400 font-mono bg-gray-100 px-1 rounded">{page.matrang}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">{pageFunctions.length} chức năng</span>
                                                    </div>

                                                    {/* Function List */}
                                                    <div className="divide-y divide-gray-100">
                                                        {pageFunctions.map(func => {
                                                            const currentPerm = getCurrentPermission(selectedUser.manguoidung, func.machucnang, page.matrang);
                                                            const currentGroupId = currentPerm?.manhomquyen || "";

                                                            return (
                                                                <div key={func.machucnang} className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-indigo-50/20 transition-colors">
                                                                    {/* Function Info */}
                                                                    <div className="col-span-7 md:col-span-8">
                                                                        <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                                                            {func.tenchucnang}
                                                                            {currentGroupId && <FaCheckCircle className="text-green-500 text-xs" />}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 rounded border">{func.machucnang}</span>
                                                                            <span className="text-[10px] font-mono text-blue-500 bg-blue-50 px-1.5 rounded border border-blue-100">{func.matruycap}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Permission Selector */}
                                                                    <div className="col-span-5 md:col-span-4">
                                                                        <div className="relative">
                                                                            <FaLayerGroup className="absolute left-2.5 top-2.5 text-gray-400 text-xs pointer-events-none" />
                                                                            <select
                                                                                className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs font-medium border outline-none appearance-none cursor-pointer transition-all ${
                                                                                    currentGroupId 
                                                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                                                                }`}
                                                                                value={currentGroupId}
                                                                                onChange={(e) => handlePermissionChange(
                                                                                    selectedUser.manguoidung,
                                                                                    func.machucnang,
                                                                                    page.matrang,
                                                                                    e.target.value
                                                                                )}
                                                                                disabled={processing}
                                                                            >
                                                                                <option value="" className="text-gray-400">-- Không có quyền --</option>
                                                                                {groups.map(grp => (
                                                                                    <option key={grp.manhomquyen} value={grp.manhomquyen} className="text-gray-800 font-medium">
                                                                                        {grp.tennhom}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {/* Mũi tên dropdown custom */}
                                                                            <div className="absolute right-2 top-2.5 pointer-events-none text-gray-400">
                                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    
                                    {/* Empty State for Filter */}
                                    {pages.filter(page => filterPage === "ALL" || page.matrang === filterPage).length === 0 && (
                                        <div className="text-center py-12 text-gray-400">
                                            <p>Không tìm thấy trang web nào phù hợp.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}