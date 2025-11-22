import React, { useMemo } from 'react';
import { FaUserShield, FaUsers, FaTools, FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';
import type { NhomQuyen, NguoiDung, ChucNang } from '../../../models/model-all';

interface NhomQuyenDetailModalProps {
    data: NhomQuyen;
}

const NhomQuyenDetailModal: React.FC<NhomQuyenDetailModalProps> = ({ data }) => {
    const { manhomquyen, tennhom, mota, ngaytao, chitietnhomquyen } = data;

    // --- LOGIC TÍNH TOÁN ---
    // Tách danh sách người dùng và chức năng duy nhất từ bảng ChiTietNhomQuyen
    const stats = useMemo(() => {
        const users = new Map<string, NguoiDung>();
        const functions = new Map<string, ChucNang>();

        if (chitietnhomquyen) {
            chitietnhomquyen.forEach(ct => {
                if (ct.nguoidung) users.set(ct.manguoidung, ct.nguoidung);
                if (ct.chucnang) functions.set(ct.machucnang, ct.chucnang);
            });
        }

        return {
            users: Array.from(users.values()),
            functions: Array.from(functions.values())
        };
    }, [chitietnhomquyen]);

    return (
        <div className="space-y-6">
            
            {/* Header Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex items-center gap-5">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/10">
                    <FaUserShield className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{tennhom}</h2>
                    <p className="text-blue-100 font-mono text-sm mt-1 opacity-80">ID: {manhomquyen}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-200 mt-2">
                        <FaCalendarAlt /> Ngày tạo: {ngaytao ? new Date(ngaytao).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <FaQuoteLeft className="absolute top-2 left-2 text-slate-200 text-4xl -z-0"/>
                <p className="text-gray-600 text-sm italic relative z-10 pl-4">
                    {mota || "Chưa có mô tả cho nhóm quyền này."}
                </p>
            </div>

            {/* Statistics Grid - 2 Cột: Người dùng & Chức năng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Cột 1: Danh sách Người dùng trong nhóm */}
                <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[350px]">
                    <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2">
                            <FaUsers className="text-green-500"/> Thành viên ({stats.users.length})
                        </h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 bg-white custom-scrollbar">
                        {stats.users.length > 0 ? (
                            <ul className="space-y-2">
                                {stats.users.map(user => (
                                    <li key={user.manguoidung} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {user.tennguoidung?.charAt(0) || 'U'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.tennguoidung}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.manguoidung || user.taikhoan}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <FaUsers className="w-8 h-8 mb-2 opacity-20"/>
                                <p className="text-xs">Chưa có thành viên nào</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột 2: Danh sách Chức năng của nhóm */}
                <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[350px]">
                    <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2">
                            <FaTools className="text-amber-500"/> Quyền hạn ({stats.functions.length})
                        </h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 bg-white custom-scrollbar">
                        {stats.functions.length > 0 ? (
                            <ul className="space-y-2">
                                {stats.functions.map(func => (
                                    <li key={func.machucnang} className="flex items-start gap-2 p-2 hover:bg-amber-50/50 rounded-lg border border-transparent hover:border-amber-100 transition-all">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{func.tenchucnang}</p>
                                            <p className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-0.5">
                                                {func.matruycap}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <FaTools className="w-8 h-8 mb-2 opacity-20"/>
                                <p className="text-xs">Chưa được cấp quyền nào</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NhomQuyenDetailModal;