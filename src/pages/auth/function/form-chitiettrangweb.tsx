import React from 'react';
import { FaGlobe, FaLink, FaClock, FaHashtag, FaExternalLinkAlt } from 'react-icons/fa';
import type { TrangWeb } from '../../../models/model-all';

interface TrangWebDetailModalProps {
    data: TrangWeb;
}

const TrangWebDetailModal: React.FC<TrangWebDetailModalProps> = ({ data }) => {
    const { matrang, tentrang, diachitruycap, mota, ngaytao } = data;

    return (
        <div className="p-4 space-y-5">
            
            {/* Header Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-5 text-white shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <FaGlobe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-wide">{tentrang}</h2>
                        <div className="flex items-center gap-1 text-indigo-100 text-xs font-mono bg-indigo-600/30 px-2 py-0.5 rounded w-fit mt-1">
                            <FaHashtag className="w-3 h-3" /> {matrang}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 gap-4">
                
                {/* URL */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                    <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2 mb-2">
                        <FaLink className="text-indigo-500"/> Đường dẫn hệ thống
                    </label>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-indigo-700 font-medium bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                            {diachitruycap}
                        </span>
                        {/* Nút giả lập mở link */}
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Mở liên kết">
                            <FaExternalLinkAlt className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mô tả */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Mô tả</label>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {mota || <span className="italic text-gray-400">Không có mô tả chi tiết cho trang này.</span>}
                    </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-3 mt-2">
                    <FaClock className="text-indigo-400" />
                    Ngày tạo: <span className="font-medium text-gray-700">{ngaytao ? new Date(ngaytao).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>

            </div>
        </div>
    );
};

export default TrangWebDetailModal;