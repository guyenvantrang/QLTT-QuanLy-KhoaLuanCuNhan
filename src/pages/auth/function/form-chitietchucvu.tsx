import React from 'react';
import { FaTag, FaTools, FaInfoCircle, FaUsers, FaLock, FaUser } from 'react-icons/fa';
import type { ChucVu , NhomQuyen, ChucNang, TrangWeb } from '../../../models/model-all'; 

interface ChucVuDetailModalProps {
    data: ChucVu;
}

const ChucVuDetailModal: React.FC<ChucVuDetailModalProps> = ({ data }) => {
    
    const { nguoidung, mota, ngaytao, ngaycapnhat, tenchucvu } = data;

    // --- LOGIC XỬ LÝ DỮ LIỆU LIÊN KẾT ---

    // Hàm đếm số lượng người dùng có quyền/chi tiết quyền duy nhất
    const countUniqueUsers = (users?: typeof nguoidung) => {
        if (!users) return 0;
        const uniqueIds = new Set(users.map(u => u.manguoidung));
        return uniqueIds.size;
    };
    
    // Hàm tổng hợp các Nhóm Quyền (NhomQuyen) và Chức năng (ChucNang) duy nhất
    const aggregatePermissions = (users?: typeof nguoidung) => {
        const uniqueGroups = new Map<string, NhomQuyen>();
        const uniqueFeatures = new Map<string, { feature: ChucNang, page: TrangWeb }>();

        if (users) {
            users.forEach(user => {
                user.chitietnhomquyen?.forEach(ct => {
                    // 1. Thu thập Nhóm Quyền
                    if (ct.manhomquyen && ct.nhomquyen && !uniqueGroups.has(ct.manhomquyen)) {
                        uniqueGroups.set(ct.manhomquyen, ct.nhomquyen);
                    }
                    
                    // 2. Thu thập Chức năng
                    if (ct.machucnang && ct.chucnang && ct.trangweb && !uniqueFeatures.has(ct.machucnang)) {
                        uniqueFeatures.set(ct.machucnang, { 
                            feature: ct.chucnang, 
                            page: ct.trangweb 
                        });
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
        <div className="p-2 space-y-3"> {/* Giảm khoảng cách */}
            
            {/* THÔNG TIN CHUNG & THỐNG KÊ (Gộp lại) */}
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
            
            {/* DANH SÁCH LIÊN KẾT (Chia 2 cột chính cho desktop) */}
            <section className='grid grid-cols-1 md:grid-cols-2 gap-3'> 
                
                {/* CỘT TRÁI: NGƯỜI DÙNG */}
                <div className='border p-3 rounded-lg border-gray-200 bg-gray-50/50'>
                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <FaUser className='w-3 h-3'/> Người dùng ({countUniqueUsers(nguoidung)})
                    </h3>
                    {nguoidung && nguoidung.length > 0 ? (
                        <ul className="space-y-1 max-h-48 overflow-y-auto pr-1"> 
                            {nguoidung.map(user => (
                                <li key={user.manguoidung} className="p-1.5 bg-white rounded-md shadow-sm flex items-center justify-between text-xs border border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-800 truncate">{user.tennguoidung}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">TK: {user.taikhoan}</p>
                                    </div>
                                    <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{user.manguoidung}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs italic text-gray-500 p-2 border border-gray-200 rounded-md">Không có người dùng nào.</p>
                    )}
                </div>

                {/* CỘT PHẢI: QUYỀN HẠN (NHÓM + CHỨC NĂNG) */}
                <div className='space-y-3'>
                    
                    {/* 1. Nhóm Quyền */}
                    <div className='border p-3 rounded-lg border-indigo-200 bg-indigo-50/50'>
                        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FaLock className='w-3 h-3 text-purple-600'/> Nhóm Quyền ({aggregatedData.groups.length})
                        </h3>
                        {aggregatedData.groups.length > 0 ? (
                            <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                {aggregatedData.groups.map(group => (
                                    <li key={group.manhomquyen} className="flex flex-col text-xs p-1.5 bg-white rounded-md border border-gray-100 shadow-sm">
                                        <p className="font-semibold text-indigo-800 truncate" title={group.tennhom}>
                                            {group.tennhom}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-mono">ID: {group.manhomquyen}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs italic text-gray-500">Không có nhóm quyền nào.</p>
                        )}
                    </div>

                    {/* 2. Chức năng (Permissions) */}
                    <div className='border p-3 rounded-lg border-green-200 bg-green-50/50'>
                        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FaTools className='w-3 h-3 text-green-600'/> Chức năng được cấp ({aggregatedData.features.length})
                        </h3>
                        {aggregatedData.features.length > 0 ? (
                            <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                {aggregatedData.features.map(f => (
                                    <li key={f.feature.machucnang} className="p-1.5 bg-white rounded-md border border-gray-100 shadow-sm">
                                        <p className="text-xs font-semibold text-green-700 truncate">
                                            {f.feature.tenchucnang} 
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            Trang: <span className='font-mono text-indigo-600'>{f.page.tentrang}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs italic text-gray-500">Không có chức năng nào được cấp.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Component thống kê nhỏ
const StatBox = ({ label, value, Icon, color }: { label: string, value: number, Icon: React.ElementType, color: 'blue' | 'green' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        green: 'bg-green-50 text-green-700 border-green-200',
    }[color];
    
    return (
        <div className={`p-3 rounded-lg border ${colorClasses}`}>
            <Icon className="w-4 h-4 mb-1 opacity-70" />
            <p className="text-xl font-bold">{value}</p> 
            <p className="text-[10px] font-medium mt-0.5 uppercase opacity-90 leading-tight">{label}</p>
        </div>
    );
};

export default ChucVuDetailModal;