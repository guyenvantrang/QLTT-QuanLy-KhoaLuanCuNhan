import React from 'react';
import { FaGlobe, FaKey, FaCalendarAlt, FaHashtag, FaExternalLinkAlt, FaShieldAlt } from 'react-icons/fa';
import type { ChucNang } from '../../../models/model-all';

interface ChucNangDetailModalProps {
    data: ChucNang;
}

const ChucNangDetailModal: React.FC<ChucNangDetailModalProps> = ({ data }) => {
    const { machucnang, tenchucnang, matruycap, mota, ngaytao, ngaycapnhat, trangweb } = data;

    return (
        <div className="space-y-6">
            
            {/* Header Card */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/20">
                        <FaShieldAlt className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{tenchucnang}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-black/20 px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1 border border-white/10">
                                <FaHashtag className="opacity-70"/> {machucnang}
                            </span>
                            <span className="bg-green-400/20 text-green-100 px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1 border border-green-400/30">
                                <FaKey className="opacity-70"/> {matruycap}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Thông tin Trang Web Liên kết */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <FaGlobe /> Thuộc Trang Web
                    </h4>
                    {trangweb ? (
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div>
                                <p className="font-bold text-indigo-700">{trangweb.tentrang}</p>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">{trangweb.diachitruycap || trangweb.diachitruycap || 'URL chưa cập nhật'}</p>
                            </div>
                            <FaExternalLinkAlt className="text-slate-300 w-4 h-4" />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Không có thông tin trang web.</p>
                    )}
                </div>

                {/* Thời gian */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <FaCalendarAlt /> Thời gian
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-gray-500">Ngày tạo:</span>
                            <span className="font-medium text-gray-700">{ngaytao ? new Date(ngaytao).toLocaleDateString('vi-VN') : '-'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Cập nhật cuối:</span>
                            <span className="font-medium text-gray-700">{ngaycapnhat ? new Date(ngaycapnhat).toLocaleDateString('vi-VN') : '-'}</span>
                        </div>
                    </div>
                </div>
                
                {/* Mô tả */}
                <div className="md:col-span-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Mô tả chi tiết</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {mota || <span className="text-gray-400 italic">Chưa có mô tả cho chức năng này.</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChucNangDetailModal;