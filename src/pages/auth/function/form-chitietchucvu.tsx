import React from 'react';
import { FaTag, FaTools, FaInfoCircle, FaUsers, FaLock, FaUser, FaLink } from 'react-icons/fa';
import type { ChucVu, NhomQuyen, ChucNang } from '../../../models/model-all';

interface ChucVuDetailModalProps {
    data: ChucVu;
}

const ChucVuDetailModal: React.FC<ChucVuDetailModalProps> = ({ data }) => {
    
    const { nguoidung, mota, ngaytao, ngaycapnhat, tenchucvu } = data;

    // --- LOGIC XỬ LÝ DỮ LIỆU LIÊN KẾT ---

    // 1. Hàm đếm số lượng người dùng
    const countUniqueUsers = (users?: typeof nguoidung) => {
        if (!users) return 0;
        const uniqueIds = new Set(users.map(u => u.manguoidung));
        return uniqueIds.size;
    };
    
    // 2. Hàm tổng hợp Quyền hạn (Nhóm quyền & Chức năng) từ danh sách Người dùng thuộc Chức vụ này
    // (Logic: Duyệt qua tất cả người dùng thuộc chức vụ -> Lấy tất cả nhóm quyền họ có -> Lấy chức năng từ nhóm quyền)
    const aggregatePermissions = (users?: typeof nguoidung) => {
        const uniqueGroups = new Map<string, NhomQuyen>();
        const uniqueFeatures = new Map<string, ChucNang>();

        if (users) {
            users.forEach(user => {
                // Kiểm tra xem người dùng có chi tiết nhóm quyền không (tùy vào cách backend trả về, có thể cần check null)
                user.chitietnhomquyennguoidung?.forEach(ct => {
                    
                    // A. Thu thập Nhóm Quyền
                    if (ct.nhomquyen && ct.manhomquyen) {
                        if (!uniqueGroups.has(ct.manhomquyen)) {
                            uniqueGroups.set(ct.manhomquyen, ct.nhomquyen);
                        }

                        // B. Thu thập Chức năng từ Nhóm quyền này (nếu backend trả về nested)
                        if (ct.nhomquyen.chitietnhomquyenchucnang) {
                            ct.nhomquyen.chitietnhomquyenchucnang.forEach(cnf => {
                                if (cnf.chucnang && cnf.machucnang && !uniqueFeatures.has(cnf.machucnang)) {
                                    uniqueFeatures.set(cnf.machucnang, cnf.chucnang);
                                }
                            });
                        }
                    }
                });
            });
        }
        
        return {
            groups: Array.from(uniqueGroups.values()),
            features: Array.from(uniqueFeatures.values()),
        };
    };

    const aggregatedData = aggregatePermissions(nguoidung);


    // --- RENDERING ---

    return (
        <div className="p-2 space-y-3">
            
            {/* THÔNG TIN CHUNG & THỐNG KÊ */}
            <section className="bg-white rounded-lg border border-indigo-200 p-4 shadow-md">
                <h3 className="text-base font-bold text-indigo-700 mb-3 flex items-center gap-2 border-b pb-1">
                    <FaInfoCircle className='w-4 h-4' /> Thông tin Chức vụ: {tenchucvu}
                </h3>
                
                {/* 1. Chi tiết Cơ bản */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs mb-4">
                    <p className='col-span-2'><strong>Mã CV:</strong> <span className='font-mono font-semibold text-gray-700'>{data.machucvu}</span></p>
                    <p className='col-span-2'><strong>Ngày tạo:</strong> <span className='text-gray-600'>{ngaytao ? new Date(ngaytao).toLocaleDateString('vi-VN') : '-'}</span></p>
                    <p className='col-span-2'><strong>Ngày Cập nhật:</strong> <span className='text-gray-600'>{ngaycapnhat ? new Date(ngaycapnhat).toLocaleDateString('vi-VN') : '-'}</span></p>
                    <p className='col-span-4'><strong>Mô tả:</strong> <span className='text-gray-600 text-sm'>{mota || 'Không có mô tả'}</span></p>
                </div>
                
                {/* 2. Thống kê */}
                <div className="grid grid-cols-3 gap-3 text-center border-t pt-3">
                    <StatBox Icon={FaUsers} label="Người dùng" value={countUniqueUsers(nguoidung)} color="blue" />
                    <StatBox Icon={FaTag} label="Nhóm quyền" value={aggregatedData.groups.length} color="green" />
                    <StatBox Icon={FaTools} label="Chức năng" value={aggregatedData.features.length} color="blue" />
                </div>
            </section>
            
            {/* DANH SÁCH LIÊN KẾT */}
            <section className='grid grid-cols-1 md:grid-cols-2 gap-3'> 
                
                {/* CỘT TRÁI: DANH SÁCH NGƯỜI DÙNG */}
                <div className='border p-3 rounded-lg border-gray-200 bg-gray-50/50 flex flex-col h-full'>
                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                        <FaUser className='w-3 h-3'/> Người dùng ({countUniqueUsers(nguoidung)})
                    </h3>
                    {nguoidung && nguoidung.length > 0 ? (
                        <ul className="space-y-1 max-h-[300px] overflow-y-auto pr-1"> 
                            {nguoidung.map(user => (
                                <li key={user.manguoidung} className="p-1.5 bg-white rounded-md shadow-sm flex items-center justify-between text-xs border border-gray-100 hover:border-indigo-200 transition-colors">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{user.tennguoidung}</p>
                                        <p className="text-[10px] text-gray-500 font-mono truncate">TK: {user.taikhoan}</p>
                                    </div>
                                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 shrink-0 ml-2">{user.manguoidung}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-4 text-gray-400">
                            <FaUsers className="w-6 h-6 mb-1 opacity-20"/>
                            <p className="text-xs italic">Chưa có người dùng nào.</p>
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI: QUYỀN HẠN LIÊN QUAN */}
                <div className='space-y-3'>
                    
                    {/* 1. Nhóm Quyền */}
                    <div className='border p-3 rounded-lg border-purple-200 bg-purple-50/30'>
                        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 border-b border-purple-200 pb-2">
                            <FaLock className='w-3 h-3 text-purple-600'/> Nhóm Quyền Liên Quan ({aggregatedData.groups.length})
                        </h3>
                        {aggregatedData.groups.length > 0 ? (
                            <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
                                {aggregatedData.groups.map(group => (
                                    <li key={group.manhomquyen} className="flex justify-between items-center text-xs p-1.5 bg-white rounded-md border border-purple-100 shadow-sm">
                                        <span className="font-semibold text-purple-800 truncate pr-2" title={group.tennhom}>
                                            {group.tennhom}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-mono bg-gray-50 px-1 rounded border">{group.manhomquyen}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs italic text-gray-500 py-2 text-center">Không có nhóm quyền nào.</p>
                        )}
                    </div>

                    {/* 2. Chức năng */}
                    <div className='border p-3 rounded-lg border-green-200 bg-green-50/30'>
                        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 border-b border-green-200 pb-2">
                            <FaTools className='w-3 h-3 text-green-600'/> Chức năng ({aggregatedData.features.length})
                        </h3>
                        {aggregatedData.features.length > 0 ? (
                            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                {aggregatedData.features.map(f => (
                                    <li key={f.machucnang} className="p-1.5 bg-white rounded-md border border-green-100 shadow-sm hover:border-green-300 transition-colors">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="text-xs font-semibold text-gray-700 truncate pr-2">
                                                {f.tenchucnang} 
                                            </p>
                                            <span className="text-[9px] font-mono text-gray-400">{f.machucnang}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <FaLink className="w-2 h-2 opacity-50"/>
                                            <span className='truncate text-indigo-600 font-medium max-w-[200px]'>
                                                {f.trangtruycap || "Chưa gán URL"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs italic text-gray-500 py-2 text-center">Không có chức năng nào.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Component thống kê nhỏ
const StatBox = ({ label, value, Icon, color }: { label: string, value: number, Icon: React.ElementType, color: 'blue' | 'green' }) => {
    const colorClasses = color === 'blue' 
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-green-50 text-green-700 border-green-200';
    
    return (
        <div className={`p-2 rounded-lg border ${colorClasses} flex flex-col items-center justify-center`}>
            <Icon className="w-4 h-4 mb-1 opacity-70" />
            <p className="text-lg font-bold leading-none">{value}</p> 
            <p className="text-[10px] font-medium mt-1 uppercase opacity-90">{label}</p>
        </div>
    );
};

export default ChucVuDetailModal;