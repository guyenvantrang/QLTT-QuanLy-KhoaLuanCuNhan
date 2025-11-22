import React from 'react';
import { FaTag, FaTools, FaInfoCircle, FaLock, FaUser, FaUserTie} from 'react-icons/fa';
import type { NguoiDung, NhomQuyen, ChucNang, TrangWeb  } from '../../../models/model-all'; 

interface NguoiDungDetailModalProps {
    data: NguoiDung;
}

const NguoiDungDetailModal: React.FC<NguoiDungDetailModalProps> = ({ data }) => {
    
    // Destructuring dữ liệu người dùng
    const { manguoidung, tennguoidung, taikhoan, chucvu, chitietnhomquyen } = data;

    // --- LOGIC XỬ LÝ DỮ LIỆU QUYỀN HẠN ---

    // Hàm tổng hợp các Nhóm Quyền và Chức năng của User này
    const aggregateUserPermissions = () => {
        const uniqueGroups = new Map<string, NhomQuyen>();
        const uniqueFeatures = new Map<string, { feature: ChucNang, page: TrangWeb }>();

        if (chitietnhomquyen && chitietnhomquyen.length > 0) {
            chitietnhomquyen.forEach((ct) => {
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
        }
        
        return {
            groups: Array.from(uniqueGroups.values()),
            features: Array.from(uniqueFeatures.values()),
        };
    };

    const permissions = aggregateUserPermissions();

    // --- RENDERING ---

    return (
        <div className="p-2 space-y-3">
            
            {/* 1. THÔNG TIN CÁ NHÂN (Profile Header) */}
            <section className="bg-white rounded-lg border border-indigo-200 p-4 shadow-md flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Avatar / Icon */}
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 border-2 border-indigo-50">
                    <FaUser className="w-8 h-8 text-indigo-500" />
                </div>

                {/* Text Info */}
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


                
                    {/* Role Badge */}
                    <div className="md:col-span-3 mt-2">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs">
                            <FaInfoCircle className="w-3 h-3" /> 
                            Chức vụ: <strong>{chucvu?.tenchucvu || "Chưa phân chức vụ"}</strong>
                        </span>
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="hidden md:flex flex-col gap-2 shrink-0 border-l pl-4">
                    <StatBoxMini label="Nhóm quyền" value={permissions.groups.length} color="purple" />
                    <StatBoxMini label="Chức năng" value={permissions.features.length} color="green" />
                </div>
            </section>
            
            {/* 2. CHI TIẾT PHÂN QUYỀN (Chia 2 cột) */}
            <section className='grid grid-cols-1 md:grid-cols-2 gap-3'> 
                
                {/* CỘT TRÁI: DANH SÁCH NHÓM QUYỀN */}
                <div className='border p-3 rounded-lg border-purple-200 bg-purple-50/30 flex flex-col h-full'>
                    <h3 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2 pb-2 border-b border-purple-100">
                        <FaLock className='w-3.5 h-3.5'/> Nhóm Quyền Sở Hữu ({permissions.groups.length})
                    </h3>
                    
                    {permissions.groups.length > 0 ? (
                        <ul className="space-y-2 overflow-y-auto max-h-[300px] pr-1"> 
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
                            <p className="text-xs italic">Người dùng này chưa thuộc nhóm quyền nào.</p>
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI: DANH SÁCH CHỨC NĂNG (FEATURES) */}
                <div className='border p-3 rounded-lg border-green-200 bg-green-50/30 flex flex-col h-full'>
                    <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2 pb-2 border-b border-green-100">
                        <FaTools className='w-3.5 h-3.5'/> Chức Năng Được Cấp ({permissions.features.length})
                    </h3>

                    {permissions.features.length > 0 ? (
                        <ul className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                            {permissions.features.map(f => (
                                <li key={f.feature.machucnang} className="flex items-center justify-between p-2 bg-white rounded-md border border-green-100 shadow-sm hover:border-green-300 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                                            <FaTag className="w-3 h-3" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-700 truncate">
                                                {f.feature.tenchucnang}
                                            </p>
                                            <p className="text-[10px] text-gray-500 truncate">
                                                Trang: <span className='font-mono text-indigo-600 font-medium'>{f.page.tentrang}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 ml-2">#{f.feature.machucnang}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                            <FaTools className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs italic">Chưa có chức năng cụ thể nào được cấp.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

// Component thống kê mini (dùng cho User Detail)
const StatBoxMini = ({ label, value, color }: { label: string, value: number, color: 'purple' | 'green' }) => {
    const colorClasses = {
        purple: 'bg-purple-100 text-purple-700',
        green: 'bg-green-100 text-green-700',
    }[color];
    
    return (
        <div className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-md text-xs font-medium w-32 ${colorClasses}`}>
            <span>{label}</span>
            <span className="font-bold bg-white/50 px-1.5 rounded">{value}</span>
        </div>
    );
};

export default NguoiDungDetailModal;