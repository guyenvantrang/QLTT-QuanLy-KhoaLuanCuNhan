"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiCheckCircle, FiCopy, FiLoader } from "react-icons/fi";
import { phanbosinhvientheodiachi, phanBoTuDong } from "../../../functions/internship-allocation";
import type { CompanyPayload, StudentPayload } from "../../../models/allocation/add"

interface AllocationCompanyWithStudents extends CompanyPayload {
  students: (StudentPayload & { distance: number })[];
}

interface XacthucPhanBoTuDongCardProps {
  onClose: () => void;
  companies: CompanyPayload[];
  students: StudentPayload[];
  madot: string;
  madotphanbo: string;
}

export default function XacthucPhanBoTuDongCard({
  onClose,
  students,
  companies,
  madot,
  madotphanbo,
}: XacthucPhanBoTuDongCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allocations, setAllocations] = useState<AllocationCompanyWithStudents[]>([]);

  useEffect(() => {
    setLoading(true);
    phanbosinhvientheodiachi(students, companies)
      .then((res) => setAllocations(res ?? []))
      .catch((err) => console.error("Lỗi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  }, [students, companies]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalStudents = students.length;
  const totalCompanies = companies.length;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      if (!allocations.length) {
        alert("Danh sách phân bổ rỗng!");
        return;
      }
      // Gọi API phân bổ tự động
      await phanBoTuDong(madot, madotphanbo, allocations);

      alert("Phân bổ tự động thành công!");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 text-white">
        <h2 className="text-3xl font-bold mb-1">Xem trước phân bổ theo địa chỉ</h2>
        <p className="text-blue-100 text-sm">
          Chỉ hiển thị mã, địa chỉ công ty và sinh viên
        </p>
      </div>

      {/* Statistics */}
      <div className="px-8 py-6 bg-slate-50 border-b border-border grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <FiUsers className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Tổng sinh viên</p>
            <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Số công ty</p>
          <p className="text-2xl font-bold text-foreground">{totalCompanies}</p>
        </div>
      </div>

      {/* Companies List */}
      <div className="px-8 py-6 space-y-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <FiLoader className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        )}

        {allocations.map((company) => (
          <div
            key={company.macongty}
            className="border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow relative"
          >
            {/* Company Info */}
            <div className="bg-blue-50 px-6 py-4 border-b border-border flex justify-between items-start">
              <div className="flex-1">
                <p className="font-mono font-bold text-blue-800 truncate">{company.macongty}</p>
                <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">{company.diachi}</p>
                <p className="mt-1 text-sm text-blue-700 font-medium">
                  Sinh viên: {company.students.length}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(company.macongty, company.macongty)}
                className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                title="Sao chép mã công ty"
                disabled={loading}
              >
                {copiedId === company.macongty ? (
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <FiCopy className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>

            {/* Students List */}
            <div className="px-6 py-4">
              {company.students.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                  {company.students.map((student, idx) => (
                    <div
                      key={`${company.macongty}-${student.masv}-${idx}`}
                      className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-mono font-semibold text-blue-700">{student.masv}</span>
                      <span className="text-sm text-slate-600 break-words whitespace-pre-wrap">{student.diachi}</span>
                      <span className="text-xs text-gray-500 mt-1">
                        Khoảng cách: {student.distance.toFixed(2)} km
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  Không có sinh viên được phân bổ cho công ty này
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-slate-50 border-t border-border flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg border border-border text-foreground hover:bg-slate-100 font-medium transition-colors"
          disabled={loading || submitting}
        >
          Hủy
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading || submitting || totalStudents === 0}
          className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Đang xử lý..." : loading ? "Đang tải dữ liệu..." : "Xác nhận phân bổ"}
        </button>
      </div>
    </div>
  );
}
