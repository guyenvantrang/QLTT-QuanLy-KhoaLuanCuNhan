// Component Select Tùy Chỉnh (Dán ở cuối file, ngoài function chính)
import { useRef, useEffect, useState } from "react"; // Đảm bảo đã import useRef ở đầu file
import { FaCheck, FaChevronDown, FaCircle, FaFilter } from "react-icons/fa";

export const CustomStatusSelect = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { id: "", label: "Tất cả trạng thái", color: "text-gray-400", icon: null },
        { id: "0", label: "Chuẩn bị", color: "text-yellow-500", icon: <FaCircle size={10} /> },
        { id: "1", label: "Đang diễn ra", color: "text-green-500", icon: <FaCircle size={10} /> },
        { id: "2", label: "Kết thúc", color: "text-gray-500", icon: <FaCircle size={10} /> },
    ];

    const selectedOption = options.find((opt) => opt.id === value) || options[0];

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative min-w-[200px]" ref={dropdownRef}>
            {/* Nút bấm chính */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full bg-white border px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm select-none
                ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <FaFilter className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium truncate">{selectedOption.label}</span>
                </div>
                <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Menu xổ xuống */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {options.map((opt) => (
                            <li
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt.id);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-indigo-50 transition-colors
                                ${opt.id === value ? 'bg-indigo-50/50 font-semibold text-gray-900' : 'text-gray-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center justify-center w-4 ${opt.color}`}>
                                        {opt.icon || <div className="w-2 h-2 rounded-full bg-gray-300 opacity-0"></div>}
                                    </span>
                                    <span>{opt.label}</span>
                                </div>
                                {opt.id === value && <FaCheck className="text-indigo-600 text-xs" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};