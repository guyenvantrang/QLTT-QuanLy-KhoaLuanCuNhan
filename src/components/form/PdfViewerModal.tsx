import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "flowbite-react";
import { getPdf } from "../../api/internship-allocation";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string; // tên file từ backend
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    setLoading(true);
    setError(null);

    getPdf(pdfUrl)
      .then(blob => {
        const url = URL.createObjectURL(blob); // tạo URL từ Blob
        setPdfBlobUrl(url);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    // Cleanup khi modal đóng
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    };
  }, [isOpen, pdfUrl]);

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="5xl"
      dismissible={true}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <ModalHeader>Xem File PDF</ModalHeader>
      <ModalBody className="bg-gray-50 p-2 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
        {loading && <div className="text-center">Đang tải PDF...</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!loading && !error && pdfBlobUrl && (
          <iframe
            src={pdfBlobUrl}
            title="PDF Viewer"
            className="w-full h-[80vh] rounded-lg border border-gray-200"
          />
        )}
        {!loading && !error && !pdfBlobUrl && (
          <div className="text-center text-gray-500">Không có file PDF để hiển thị</div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default PdfViewerModal;
