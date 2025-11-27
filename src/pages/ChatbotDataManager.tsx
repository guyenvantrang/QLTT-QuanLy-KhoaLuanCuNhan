import React, { useState, useEffect } from "react";
import { 
  Database, Plus, Trash2, Upload, 
  RefreshCw, Save, Layers, X
} from "lucide-react";
import { DynamicListInput } from "../components/functionpages/chatbot/DynamicListInput"; 
import * as API from "../api/api_chatbot"; 

// --- 1. Topic Tab (Đã tối ưu full chiều cao) ---
const TopicTab = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [topicDetails, setTopicDetails] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Form State
  const [keywordVi, setKeywordVi] = useState("");
  const [keyword, setKeyword] = useState("");
  const [subTexts, setSubTexts] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => { fetchTopics(); }, []);

  const fetchTopics = async () => {
    try {
      const res = await API.showAllKeywordsFromCollection();
      setTopics(res.results || []);
    } catch (err) { alert("Lỗi tải danh sách chủ đề"); }
  };

  const fetchTopicDetails = async (kw: string) => {
    try {
      const res = await API.getAllKeywordsFromCollection(kw);
      setTopicDetails(res.results || []);
      setSelectedTopic(kw);
    } catch (err) { alert("Lỗi tải chi tiết chủ đề"); }
  };

  const handleAddTopic = async () => {
    if (!keyword || !keywordVi) return alert("Thiếu thông tin");
    if (topics.includes(keyword)) return alert("Keyword trùng!");
    try {
      await API.addToCollectionName(keywordVi, keyword, subTexts);
      alert("Thêm thành công!");
      setKeyword(""); setKeywordVi(""); setSubTexts([]); setShowAddForm(false);
      fetchTopics();
    } catch (err) { alert("Lỗi thêm chủ đề"); }
  };

  const handleDeleteTopic = async (kw: string) => {
    if (!window.confirm(`Xóa chủ đề "${kw}"?`)) return;
    try {
      await API.deleteFromCollectionByKeyword(kw);
      fetchTopics();
      if (selectedTopic === kw) setSelectedTopic(null);
    } catch (err) { alert("Lỗi xóa chủ đề"); }
  };

  const handleDeleteSubItem = async (id: string) => {
    if(!window.confirm("Xóa mục này?")) return;
    try {
        await API.deleteFromCollectionName([id]);
        if(selectedTopic) fetchTopicDetails(selectedTopic);
    } catch (err) { alert("Lỗi xóa mục con"); }
  }

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* LEFT COLUMN: DANH SÁCH CHỦ ĐỀ */}
      <div className="w-1/3 min-w-[300px] flex flex-col bg-slate-900/50 border border-blue-500/20 rounded-xl overflow-hidden shadow-lg">
         {/* Header của cột */}
         <div className="p-3 bg-slate-800/80 border-b border-blue-500/20 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-blue-300 flex items-center gap-2"><Layers size={18}/> Chủ đề</h3>
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded shadow">
               {showAddForm ? <X size={16}/> : <Plus size={16}/>}
            </button>
         </div>
         
         {/* Form thêm nhanh (Collapse) */}
         {showAddForm && (
            <div className="p-3 bg-slate-800 border-b border-blue-500/30 overflow-y-auto max-h-[50%] shrink-0 space-y-3 shadow-inner">
                <input value={keywordVi} onChange={e => setKeywordVi(e.target.value)} placeholder="Tên hiển thị (Tiếng Việt)" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"/>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="keyword_khong_dau" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"/>
                <DynamicListInput items={subTexts} setItems={setSubTexts} placeholder="Nội dung con..." />
                <button onClick={handleAddTopic} className="w-full py-2 bg-green-600 text-white rounded text-sm font-bold flex justify-center gap-2"><Save size={14}/> Lưu</button>
            </div>
         )}

         {/* List Items (Scrollable) */}
         <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-slate-800">
            {topics.map((kw, idx) => (
               <div key={idx} onClick={() => fetchTopicDetails(kw)}
                 className={`p-3 rounded border cursor-pointer flex justify-between items-center group transition-all
                   ${selectedTopic === kw ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800/40 border-slate-700 hover:border-blue-400/50'}`}
               >
                 <span className="text-sm font-medium text-slate-200">{kw}</span>
                 <button onClick={(e) => { e.stopPropagation(); handleDeleteTopic(kw); }} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
               </div>
            ))}
         </div>
      </div>

      {/* RIGHT COLUMN: CHI TIẾT */}
      <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-lg">
         <div className="p-3 bg-slate-800/80 border-b border-slate-700 font-bold text-blue-200">
             {selectedTopic ? `Chi tiết nội dung: ${selectedTopic}` : "Chi tiết nội dung"}
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-slate-800">
             {!selectedTopic ? (
                <div className="h-full flex items-center justify-center text-slate-600 italic">Chọn một chủ đề bên trái để xem</div>
             ) : topicDetails.length === 0 ? (
                <div className="text-slate-500 italic text-center mt-10">Chưa có dữ liệu text nào.</div>
             ) : (
                topicDetails.map((item: any) => (
                    <div key={item.id} className="p-3 bg-slate-800 border border-slate-700 rounded hover:border-blue-500/30 group flex gap-3">
                        <div className="flex-1">
                             <p className="text-slate-300 text-sm">{item.text}</p>
                             <div className="mt-1 flex gap-2">
                                <span className="text-[10px] bg-slate-700 px-1.5 rounded text-blue-300">VN: {item.keyword_vi}</span>
                             </div>
                        </div>
                        <button onClick={() => handleDeleteSubItem(item.id)} className="text-slate-600 hover:text-red-400 self-start"><X size={14}/></button>
                    </div>
                ))
             )}
         </div>
      </div>
    </div>
  );
};

// --- 2. Data Tab (Đã tối ưu full màn hình) ---
const DataTab = () => {
    const [collections, setCollections] = useState<string[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string>("");
    const [dataList, setDataList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    // Modes
    const [mode, setMode] = useState<'view' | 'manual' | 'pdf'>('view');
    const [manualTexts, setManualTexts] = useState<string[]>([]);
    const [manualLabel, setManualLabel] = useState("");
    const [manualSource, setManualSource] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        API.showAllKeywordsFromCollection().then(res=> {
            setCollections(res.results || []);
            if(res.results?.length > 0) setSelectedCollection(res.results[0]);
        });
    }, []);

    useEffect(() => { if(selectedCollection && mode === 'view') loadData(); }, [selectedCollection, mode]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await API.getAllData({ list_collection_names: [selectedCollection] });
            setDataList(res.results || []);
        } catch(err) { console.error(err); } finally { setLoading(false); }
    }

    const handleAddManual = async () => {
        try { await API.addManually(selectedCollection, manualTexts, manualSource, manualLabel); alert("Đã thêm!"); setManualTexts([]); setMode('view'); } catch(e) { alert("Lỗi"); }
    }
    const handleAddPdf = async () => {
        if(!file) return; try { await API.addPdfToCollection(selectedCollection, file); alert("Upload xong!"); setFile(null); setMode('view'); } catch(e) { alert("Lỗi"); }
    }
    const handleDeleteSelected = async () => {
        if(!window.confirm(`Xóa ${selectedIds.length} mục?`)) return;
        try { await API.deleteById(selectedCollection, selectedIds); setSelectedIds([]); loadData(); } catch(e) { alert("Lỗi xóa"); }
    }

    return (
        <div className="h-full flex flex-col gap-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg border border-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300 uppercase font-bold px-2">Bộ dữ liệu:</span>
                    <select value={selectedCollection} onChange={e => setSelectedCollection(e.target.value)} className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500">
                        {collections.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={loadData} className="p-1.5 hover:bg-white/10 rounded-full text-blue-400" title="Làm mới"><RefreshCw size={16}/></button>
                </div>
                <div className="flex gap-2">
                     {mode === 'view' ? (
                        <>
                            <button onClick={() => setMode('manual')} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-all"><Plus size={14} /> Thêm Text</button>
                            <button onClick={() => setMode('pdf')} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-all"><Upload size={14} /> Upload File</button>
                            {selectedIds.length > 0 && (
                                <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold animate-pulse"><Trash2 size={14} /> Xóa ({selectedIds.length})</button>
                            )}
                        </>
                     ) : (
                         <button onClick={() => setMode('view')} className="text-xs text-slate-400 hover:text-white underline">Hủy & Quay lại</button>
                     )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-900/40 border border-slate-700/50 rounded-lg overflow-hidden relative">
                {mode === 'view' && (
                    <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-transparent">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800 text-blue-300 text-xs font-bold uppercase sticky top-0 z-10 shadow-md">
                                <tr>
                                    <th className="p-3 w-10 text-center"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? dataList.map(d => d.id) : [])}/></th>
                                    <th className="p-3 w-[50%]">Nội dung</th>
                                    <th className="p-3">Source</th>
                                    <th className="p-3">Label</th>
                                    <th className="p-3">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? <tr><td colSpan={5} className="p-10 text-center">Đang tải...</td></tr> : 
                                dataList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/70 transition-colors group">
                                        <td className="p-3 text-center"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => {
                                            setSelectedIds(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]);
                                        }} /></td>
                                        <td className="p-3 text-slate-200 line-clamp-2" title={item.content}>{item.content.substring(0, 150)}...</td>
                                        <td className="p-3 text-emerald-400 font-mono text-xs">{item.metadata?.source}</td>
                                        <td className="p-3 text-xs">{item.metadata?.label}</td>
                                        <td className="p-3 text-xs opacity-70">{item.metadata?.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {mode === 'manual' && (
                    <div className="h-full p-8 flex flex-col items-center justify-center overflow-auto">
                        <div className="w-full max-w-2xl space-y-4 bg-slate-800 p-6 rounded-xl border border-blue-500/30 shadow-2xl">
                             <h3 className="text-lg font-bold text-blue-300">Nhập dữ liệu thủ công</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <input value={manualSource} onChange={e => setManualSource(e.target.value)} placeholder="Source (Nguồn)" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm"/>
                                <input value={manualLabel} onChange={e => setManualLabel(e.target.value)} placeholder="Label (Nhãn)" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm"/>
                             </div>
                             <DynamicListInput items={manualTexts} setItems={setManualTexts} placeholder="Nhập text và nhấn Enter..." label="Nội dung" />
                             <button onClick={handleAddManual} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-transform active:scale-[0.98]">LƯU DỮ LIỆU</button>
                        </div>
                    </div>
                )}

                {mode === 'pdf' && (
                     <div className="h-full p-8 flex flex-col items-center justify-center">
                        <div className="w-full max-w-xl space-y-4 bg-slate-800 p-8 rounded-xl border border-indigo-500/30 shadow-2xl text-center">
                            <h3 className="text-lg font-bold text-indigo-300 mb-4">Upload File (PDF, Word, Txt)</h3>
                            <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"/>
                            <button onClick={handleAddPdf} disabled={!file} className="w-full py-2.5 mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded shadow-lg">UPLOAD NGAY</button>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN LAYOUT (FULL SCREEN) ---
export default function ChatbotAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'topics' | 'data'>('topics');

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 z-50"></div>
        <div className="fixed inset-0 pointer-events-none z-0">
             <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        {/* 1. TOP HEADER (Nút quản lý bên trái) */}
        <header className="relative z-20 h-16 bg-slate-900/90 backdrop-blur-md border-b border-blue-900/50 flex items-center justify-between px-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-6">
                {/* Logo / Title */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Database className="text-white w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        AI MANAGER
                    </span>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-slate-700"></div>

                {/* Main Navigation (Tabs) - Bên trái */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('topics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
                        ${activeTab === 'topics' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Layers size={16} /> Quản lý Chủ đề
                    </button>
                    <button 
                        onClick={() => setActiveTab('data')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
                        ${activeTab === 'data' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Database size={16} /> Quản lý Dữ liệu
                    </button>
                </div>
            </div>

            {/* Right Side Info (Optional) */}
            <div className="text-xs text-slate-500 font-mono">
                System Status: <span className="text-emerald-400">Online</span>
            </div>
        </header>

        {/* 2. MAIN WORKSPACE (Chiếm toàn bộ màn hình còn lại) */}
        <main className="flex-1 relative z-10 p-3 overflow-hidden">
             {/* Container bo viền phát sáng nhẹ bao quanh nội dung */}
             <div className="w-full h-full bg-slate-950/50 backdrop-blur-sm rounded-xl border border-blue-500/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] p-2 relative overflow-hidden">
                {activeTab === 'topics' ? <TopicTab /> : <DataTab />}
             </div>
        </main>
    </div>
  );
}