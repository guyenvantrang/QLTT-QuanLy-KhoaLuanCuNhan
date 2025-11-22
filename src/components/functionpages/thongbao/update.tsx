import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetThongBaoById } from "../../../api/thongbao";

export default function ChiTietThongBao() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [thongbao, setThongBao] = useState<{
        tieude: string;
        noidung: string;
        duongdanfilecongvan?: string;
        duongdanfiletailieu?: string;
        tailieuContent?: string; // Base64
        congvanContent?: string; // Base64
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThongBao = async () => {
            if (!id) return;
            try {
                const data = await GetThongBaoById(id);
                setThongBao(data);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchThongBao();
    }, [id]);

    if (loading) return <div className="text-center py-4 text-lg">Đang tải...</div>;
    if (!thongbao) return <div className="text-center py-4 text-lg">Không tìm thấy thông báo</div>;

    // Xác định loại file dựa theo extension
    const getFileType = (filename: string) => {
        const ext = filename?.split('.').pop()?.toLowerCase();
        if (!ext) return 'other';
        if (ext === 'pdf') return 'pdf';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
        if (ext === 'doc' || ext === 'docx' || ext === 'txt') return 'text';
        return 'other';
    };

    // Chuyển Base64 sang Blob URL
    const base64ToUrl = (base64: string, type: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type });
        return URL.createObjectURL(blob);
    };

    // Render file trực tiếp từ Base64
    const renderFile = (filename: string, base64Content?: string) => {
        if (!base64Content) return <div>Không có nội dung file</div>;
        const type = getFileType(filename);
        const blobUrl = base64ToUrl(base64Content, type === 'pdf' ? 'application/pdf' : type === 'image' ? 'image/*' : 'text/plain');

        switch (type) {
            case 'pdf':
                return <iframe src={blobUrl} className="w-full h-[600px] border rounded-lg" title="PDF Preview" />;
            case 'image':
                return <img src={blobUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />;
            case 'text':
                return (
                    <iframe
                        src={blobUrl}
                        className="w-full h-[400px] border rounded-lg"
                        title="Text Preview"
                    />
                );
            default:
                return <div className="text-red-600">Không thể hiển thị file này</div>;
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-indigo-700 mb-4">{thongbao.tieude}</h2>
                <p className="text-gray-800 mb-6 whitespace-pre-line">{thongbao.noidung}</p>

                {thongbao.congvanContent && thongbao.duongdanfilecongvan && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-2">File Công Văn:</h4>
                        {renderFile(thongbao.duongdanfilecongvan, thongbao.congvanContent)}
                    </div>
                )}

                {thongbao.tailieuContent && thongbao.duongdanfiletailieu && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-2">File Tài Liệu:</h4>
                        {renderFile(thongbao.duongdanfiletailieu, thongbao.tailieuContent)}
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                        onClick={() => navigate("/thongbao")}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
