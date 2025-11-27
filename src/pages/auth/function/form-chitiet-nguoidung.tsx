import React from 'react';
import { FaTag, FaTools, FaInfoCircle, FaLock, FaUser, FaUserTie } from 'react-icons/fa';
import type { NguoiDung, NhomQuyen, ChucNang } from '../../../models/model-all'; // ⚠️ Kiểm tra lại đường dẫn model

// ✅ 1. Định nghĩa Interface riêng cho Modal Chi Tiết (Chỉ cần data)
interface NguoiDungDetailModalProps {
    data: NguoiDung;
}

// ✅ 2. Gán Interface này vào Component
const NguoiDungDetailModal: React.FC<NguoiDungDetailModalProps> = ({ data }) => {
    
    // Destructuring dữ liệu
    const { manguoidung, tennguoidung, taikhoan, chucvu, chitietnhomquyennguoidung } = data;

    // --- LOGIC XỬ LÝ DỮ LIỆU QUYỀN HẠN ---
    const aggregateUserPermissions = () => {
        const uniqueGroups = new Map<string, NhomQuyen>();
        const uniqueFeatures = new Map<string, ChucNang>();

        if (chitietnhomquyennguoidung && chitietnhomquyennguoidung.length > 0) {
            chitietnhomquyennguoidung.forEach((ctUser) => {
                const group = ctUser.nhomquyen;
                if (group && group.manhomquyen) {
                    if (!uniqueGroups.has(group.manhomquyen)) {
                        uniqueGroups.set(group.manhomquyen, group);
                    }
                    if (group.chitietnhomquyenchucnang && group.chitietnhomquyenchucnang.length > 0) {
                        group.chitietnhomquyenchucnang.forEach((ctFeature) => {
                            const feature = ctFeature.chucnang;
                            if (feature && feature.machucnang && !uniqueFeatures.has(feature.machucnang)) {
                                uniqueFeatures.set(feature.machucnang, feature);
                            }
                        });
                    }
                }
            });
        }
        return {
            groups: Array.from(uniqueGroups.values()),
            features: Array.from(uniqueFeatures.values()),
        };
    };

    const permissions = aggregateUserPermissions();

    // --- RENDER ---
    return (
        <div className="p-2 space-y-3">
            {/* Header Info */}
            <section className="bg-white rounded-lg border border-indigo-200 p-4 shadow-md flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 border-2 border-indigo-50">
                    <FaUser className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 w-full text-sm">
                    <div className="col-span-1 md:col-span-3 border-b border-gray-100 pb-2 mb-1">
                        <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                            {tennguoidung} 
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border">
                                {manguoidung}
                            </span>
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaUserTie className="text-indigo-400" /> 
                        <span className="font-semibold">Tài khoản:</span> {taikhoan}
                    </div>
                    <div className="md:col-span-3 mt-2">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs">
                            <FaInfoCircle className="w-3 h-3" /> 
                            Chức vụ: <strong>{chucvu?.tenchucvu || "Chưa phân chức vụ"}</strong>
                        </span>
                    </div>
                </div>
                <div className="hidden md:flex flex-col gap-2 shrink-0 border-l pl-4">
                    <StatBoxMini label="Nhóm quyền" value={permissions.groups.length} color="purple" />
                    <StatBoxMini label="Chức năng" value={permissions.features.length} color="green" />
                </div>
            </section>
            
            {/* Chi tiết 2 cột */}
            <section className='grid grid-cols-1 md:grid-cols-2 gap-3'> 
                {/* CỘT TRÁI */}
                <div className='border p-3 rounded-lg border-purple-200 bg-purple-50/30 flex flex-col h-full'>
                    <h3 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2 pb-2 border-b border-purple-100">
                        <FaLock className='w-3.5 h-3.5'/> Nhóm Quyền Sở Hữu ({permissions.groups.length})
                    </h3>
                    {permissions.groups.length > 0 ? (
                        <ul className="space-y-2 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin scrollbar-thumb-purple-200"> 
                            {permissions.groups.map(group => (
                                <li key={group.manhomquyen} className="p-2 bg-white rounded-md shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-xs text-gray-800">{group.tennhom}</span>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border">{group.manhomquyen}</span>
                                    </div>
                                    {group.mota && <p className="text-[10px] text-gray-500 mt-1 truncate">{group.mota}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                            <FaLock className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs italic">Chưa có nhóm quyền nào.</p>
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI */}
                <div className='border p-3 rounded-lg border-green-200 bg-green-50/30 flex flex-col h-full'>
                    <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2 pb-2 border-b border-green-100">
                        <FaTools className='w-3.5 h-3.5'/> Chức Năng Được Cấp ({permissions.features.length})
                    </h3>
                    {permissions.features.length > 0 ? (
                        <ul className="space-y-2 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin scrollbar-thumb-green-200">
                            {permissions.features.map(f => (
                                <li key={f.machucnang} className="flex items-center justify-between p-2 bg-white rounded-md border border-green-100 shadow-sm hover:border-green-300 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                                            <FaTag className="w-3 h-3" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-700 truncate">{f.tenchucnang}</p>
                                            <p className="text-[10px] text-gray-500 truncate">
                                                URL/Code: <span className='font-mono text-indigo-600 font-medium'>{f.trangtruycap || "N/A"}</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                            <FaTools className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs italic">Chưa có chức năng nào.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const StatBoxMini = ({ label, value, color }: { label: string, value: number, color: 'purple' | 'green' }) => {
    const colorClasses = color === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700';
    return (
        <div className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-md text-xs font-medium w-32 ${colorClasses}`}>
            <span>{label}</span>
            <span className="font-bold bg-white/50 px-1.5 rounded">{value}</span>
        </div>
    );
};

export default NguoiDungDetailModal;