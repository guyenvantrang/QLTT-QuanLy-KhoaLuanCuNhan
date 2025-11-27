import  { useEffect, useState, useMemo } from "react";
import { 
    FaLayerGroup, FaUserPlus, FaPlus, FaTrash, FaSearch, FaSpinner, 
    FaUserShield, FaKey, FaGlobe, FaTimes 
} from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

// --- IMPORT API ---
import { 
    getAllNhomQuyen, 
    getAllChucNang, 
    getAllNguoiDung,
    getAllChiTietNhomQuyenChucNang,
    getAllChiTietNhomQuyenNguoiDung,
    addChiTietNhomQuyenChucNang,
    deleteChiTietNhomQuyenChucNang,
    addChiTietNhomQuyenNguoiDung,
    deleteChiTietNhomQuyenNguoiDung
} from "../../../api/login";

// --- IMPORT MODELS ---
import type { 
    NhomQuyen, ChucNang, NguoiDung, 
    ChiTietNhomQuyenChucNang, ChiTietNhomQuyenNguoiDung 
} from "../../../models/model-all";

// --- COMPONENT MODAL (Tái sử dụng) ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-blue-800">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function QuanLyPhanQuyen() {
    // --- STATE DỮ LIỆU ---
    const [groups, setGroups] = useState<NhomQuyen[]>([]);
    const [functions, setFunctions] = useState<ChucNang[]>([]);
    const [users, setUsers] = useState<NguoiDung[]>([]);
    
    // Dữ liệu liên kết (Relations)
    const [groupFuncs, setGroupFuncs] = useState<ChiTietNhomQuyenChucNang[]>([]);
    const [groupUsers, setGroupUsers] = useState<ChiTietNhomQuyenNguoiDung[]>([]);

    // --- STATE UI ---
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState<NhomQuyen | null>(null);
    const [processing, setProcessing] = useState(false);
    
    // Modal State
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showFuncModal, setShowFuncModal] = useState(false);
    const [searchTermFunc, setSearchTermFunc] = useState("");
    const [searchTermUser, setSearchTermUser] = useState("");

    // --- 1. FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resGroups, resFuncs, resUsers, resGF, resGU] = await Promise.all([
                getAllNhomQuyen(),
                getAllChucNang(),
                getAllNguoiDung(),
                getAllChiTietNhomQuyenChucNang(),
                getAllChiTietNhomQuyenNguoiDung()
            ]);

            setGroups(resGroups || []);
            setFunctions(resFuncs || []);
            setUsers(resUsers || []);
            setGroupFuncs(resGF || []);
            setGroupUsers(resGU || []);

            // Mặc định chọn nhóm đầu tiên nếu chưa chọn
            if (!selectedGroup && resGroups && resGroups.length > 0) {
                setSelectedGroup(resGroups[0]);
            }
        } catch (error: any) {
            toast.error("Lỗi tải dữ liệu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- 2. DATA COMPUTED ---
    
    // Lấy danh sách chức năng CỦA nhóm đang chọn
    const currentFunctions = useMemo(() => {
        if (!selectedGroup) return [];
        return groupFuncs
            .filter(gf => gf.manhomquyen === selectedGroup.manhomquyen)
            .map(gf => {
                // Map về object chức năng đầy đủ
                const func = functions.find(f => f.machucnang === gf.machucnang);
                return func ? func : null;
            })
            .filter(f => f !== null) as ChucNang[];
    }, [selectedGroup, groupFuncs, functions]);

    // Lấy danh sách thành viên CỦA nhóm đang chọn
    const currentMembers = useMemo(() => {
        if (!selectedGroup) return [];
        return groupUsers
            .filter(gu => gu.manhomquyen === selectedGroup.manhomquyen)
            .map(gu => {
                const user = users.find(u => u.manguoidung === gu.manguoidung);
                return user ? user : null;
            })
            .filter(u => u !== null) as NguoiDung[];
    }, [selectedGroup, groupUsers, users]);

    // --- 3. ACTIONS ---

    // A. Xử lý Chức năng
    const handleAddFunction = async (funcId: string) => {
        if (!selectedGroup) return;
        setProcessing(true);
        try {
            await addChiTietNhomQuyenChucNang({
                manhomquyen: selectedGroup.manhomquyen,
                machucnang: funcId
            });
            toast.success("Đã thêm chức năng vào nhóm");
            // Refresh local state
            const resGF = await getAllChiTietNhomQuyenChucNang();
            setGroupFuncs(resGF || []);
        } catch (err: any) {
            toast.error("Lỗi: " + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleRemoveFunction = async (funcId: string) => {
        if (!selectedGroup) return;
        if (!window.confirm("Bạn muốn gỡ chức năng này khỏi nhóm?")) return;
        
        try {
            await deleteChiTietNhomQuyenChucNang(funcId, selectedGroup.manhomquyen);
            toast.success("Đã gỡ chức năng");
            const resGF = await getAllChiTietNhomQuyenChucNang();
            setGroupFuncs(resGF || []);
        } catch (err: any) {
            toast.error("Lỗi: " + err.message);
        }
    };

    // B. Xử lý Thành viên
    const handleAddMember = async (userId: string) => {
        if (!selectedGroup) return;
        setProcessing(true);
        try {
            await addChiTietNhomQuyenNguoiDung({
                manhomquyen: selectedGroup.manhomquyen,
                manguoidung: userId
            });
            toast.success("Đã thêm thành viên vào nhóm");
            const resGU = await getAllChiTietNhomQuyenNguoiDung();
            setGroupUsers(resGU || []);
        } catch (err: any) {
            toast.error("Lỗi: " + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!selectedGroup) return;
        if (!window.confirm("Bạn muốn xóa thành viên này khỏi nhóm?")) return;

        try {
            await deleteChiTietNhomQuyenNguoiDung(userId, selectedGroup.manhomquyen);
            toast.success("Đã xóa thành viên");
            const resGU = await getAllChiTietNhomQuyenNguoiDung();
            setGroupUsers(resGU || []);
        } catch (err: any) {
            toast.error("Lỗi: " + err.message);
        }
    };

    // --- RENDER ---
    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans h-screen flex flex-col">
            <Toaster position="top-right" />
            
            <div className="mb-4">
                <h1 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2">
                    <FaUserShield className="text-blue-600" /> QUẢN LÝ PHÂN QUYỀN
                </h1>
                <p className="text-sm text-gray-500">Cấu hình quyền hạn cho nhóm và gán người dùng.</p>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">
                
                {/* --- CỘT TRÁI: DANH SÁCH NHÓM QUYỀN (30%) --- */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white rounded-2xl shadow-lg border border-blue-100 flex flex-col overflow-hidden">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                        <h2 className="font-bold text-blue-800 flex items-center gap-2">
                            <FaLayerGroup /> NHÓM QUYỀN
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                        {loading ? <div className="text-center py-4"><FaSpinner className="animate-spin inline text-blue-500"/></div> : 
                         groups.map(group => {
                             const isActive = selectedGroup?.manhomquyen === group.manhomquyen;
                             // Đếm số thành viên trong nhóm (để hiển thị badge)
                             const memberCount = groupUsers.filter(gu => gu.manhomquyen === group.manhomquyen).length;

                             return (
                                <div 
                                    key={group.manhomquyen}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                                        isActive 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]' 
                                        : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm text-gray-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sm">{group.tennhom}</h3>
                                            <p className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                                                {group.mota || 'Không có mô tả'}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                            isActive ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {memberCount} TV
                                        </span>
                                    </div>

                                    {/* Nút thêm thành viên - Chỉ hiện khi Active */}
                                    {isActive && (
                                        <div className="mt-3 pt-3 border-t border-blue-400/50 flex justify-between items-center animate-in slide-in-from-left duration-300">
                                            <span className="text-xs text-blue-100">Quản lý thành viên</span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setShowMemberModal(true); }}
                                                className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold px-3"
                                            >
                                                <FaUserPlus /> Thêm / Xem
                                            </button>
                                        </div>
                                    )}
                                </div>
                             );
                         })
                        }
                    </div>
                </div>

                {/* --- CỘT PHẢI: CHI TIẾT CHỨC NĂNG (70%) --- */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-2xl shadow-lg border border-blue-100 flex flex-col overflow-hidden">
                    
                    {/* Header Cột Phải */}
                    <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {selectedGroup ? (
                                    <>
                                        <span className="text-blue-600">{selectedGroup.tennhom}</span>
                                        <span className="text-gray-400 font-normal text-sm">/ Danh sách chức năng</span>
                                    </>
                                ) : "Vui lòng chọn nhóm quyền"}
                            </h2>
                        </div>
                        {selectedGroup && (
                            <button 
                                onClick={() => setShowFuncModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                <FaPlus /> Thêm Chức Năng
                            </button>
                        )}
                    </div>

                    {/* Nội dung danh sách chức năng */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 custom-scrollbar">
                        {!selectedGroup ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                <FaLayerGroup className="text-6xl mb-4" />
                                <p>Chọn một nhóm quyền bên trái để xem chi tiết</p>
                            </div>
                        ) : currentFunctions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" className="w-48 opacity-50 grayscale" />
                                <p className="mt-4">Nhóm này chưa có chức năng nào.</p>
                                <button onClick={() => setShowFuncModal(true)} className="text-blue-600 font-bold mt-2 hover:underline">Thêm ngay</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {currentFunctions.map(func => (
                                    <div key={func.machucnang} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex justify-between items-center">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-800 truncate" title={func.tenchucnang}>{func.tenchucnang}</h4>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono border border-gray-200 flex items-center gap-1">
                                                    <FaKey className="text-[10px]" /> {func.matruycap}
                                                </span>
                                                {func.trangtruycap && (
                                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono border border-blue-100 flex items-center gap-1 truncate max-w-[150px]">
                                                        <FaGlobe className="text-[10px]" /> {func.trangtruycap}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveFunction(func.machucnang)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Gỡ bỏ chức năng này"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL 1: QUẢN LÝ THÀNH VIÊN --- */}
            <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title={`Thành viên: ${selectedGroup?.tennhom}`}>
                <div className="space-y-4">
                    {/* List thành viên hiện tại */}
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Đang trong nhóm ({currentMembers.length})</h4>
                        <div className="flex flex-wrap gap-2">
                            {currentMembers.map(u => (
                                <div key={u.manguoidung} className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    {u.tennguoidung}
                                    <button onClick={() => handleRemoveMember(u.manguoidung)} className="hover:text-red-600"><FaTimes/></button>
                                </div>
                            ))}
                            {currentMembers.length === 0 && <span className="text-xs text-gray-400 italic">Chưa có thành viên nào.</span>}
                        </div>
                    </div>

                    <hr className="border-gray-100"/>

                    {/* Thêm thành viên mới */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Thêm thành viên mới</h4>
                        <div className="relative mb-3">
                            <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                            <input 
                                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                                placeholder="Tìm theo tên hoặc tài khoản..."
                                value={searchTermUser}
                                onChange={e => setSearchTermUser(e.target.value)}
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y">
                            {users
                                .filter(u => !currentMembers.some(cm => cm.manguoidung === u.manguoidung)) // Loại bỏ user đã có trong nhóm
                                .filter(u => u.tennguoidung?.toLowerCase().includes(searchTermUser.toLowerCase()) || u.taikhoan?.includes(searchTermUser))
                                .map(u => (
                                    <div key={u.manguoidung} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{u.tennguoidung}</p>
                                            <p className="text-xs text-gray-500">{u.taikhoan} - {u.chucvu?.tenchucvu}</p>
                                        </div>
                                        <button 
                                            disabled={processing}
                                            onClick={() => handleAddMember(u.manguoidung)}
                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Modal>

            {/* --- MODAL 2: THÊM CHỨC NĂNG --- */}
            <Modal isOpen={showFuncModal} onClose={() => setShowFuncModal(false)} title="Thêm Chức Năng Vào Nhóm">
                <div className="space-y-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                        <input 
                            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                            placeholder="Tìm tên chức năng hoặc mã code..."
                            value={searchTermFunc}
                            onChange={e => setSearchTermFunc(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto border rounded-lg divide-y custom-scrollbar">
                        {functions
                            .filter(f => !currentFunctions.some(cf => cf.machucnang === f.machucnang)) // Loại bỏ chức năng đã có
                            .filter(f => f.tenchucnang?.toLowerCase().includes(searchTermFunc.toLowerCase()) || f.matruycap?.toLowerCase().includes(searchTermFunc.toLowerCase()))
                            .map(f => (
                                <div key={f.machucnang} className="p-3 flex justify-between items-center hover:bg-gray-50 group">
                                    <div className="min-w-0 pr-2">
                                        <p className="text-sm font-bold text-gray-800 truncate">{f.tenchucnang}</p>
                                        <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                                            <span className="bg-gray-100 px-1.5 rounded font-mono border">{f.matruycap}</span>
                                            {f.trangtruycap && <span className="truncate text-blue-500">{f.trangtruycap}</span>}
                                        </div>
                                    </div>
                                    <button 
                                        disabled={processing}
                                        onClick={() => handleAddFunction(f.machucnang)}
                                        className="flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                                    >
                                        Thêm <FaPlus className="text-[10px]"/>
                                    </button>
                                </div>
                            ))
                        }
                        {functions.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">Không tìm thấy dữ liệu.</p>}
                    </div>
                </div>
            </Modal>

        </div>
    );
}