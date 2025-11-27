// components/DynamicListInput.tsx
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder?: string;
  label?: string;
}

export const DynamicListInput = ({ items, setItems, placeholder, label }: Props) => {
  const [currentInput, setCurrentInput] = useState("");

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentInput.trim()) {
      setItems([...items, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-blue-300 text-sm font-semibold">{label}</label>}
      <div className="flex gap-2">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Nhập nội dung và nhấn Enter..."}
          className="flex-1 bg-slate-900 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
        />
        <button
          onClick={handleAdd}
          type="button"
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* List Items Display */}
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-blue-900/40 border border-blue-500/50 text-blue-100 px-3 py-1 rounded-full text-sm animate-fadeIn">
            <span className="max-w-[300px] truncate">{item}</span>
            <button
              onClick={() => handleRemove(idx)}
              className="hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-xs text-slate-500 italic">Chưa có dữ liệu nào trong danh sách.</p>
      )}
    </div>
  );
};