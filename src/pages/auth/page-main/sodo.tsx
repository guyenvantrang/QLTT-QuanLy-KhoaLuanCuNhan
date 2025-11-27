// import { useEffect, useState, useRef, useCallback } from "react";
// import ForceGraph3D from "react-force-graph-3d";
// import * as THREE from "three";
// import SpriteText from "three-spritetext";
// import { 
//     FaSpinner, FaUser, FaLayerGroup, FaGlobe, FaTools, 
//     FaSearch, FaArrowLeft, FaLink, FaChartPie, FaDatabase, 
//     FaNetworkWired, FaMicrochip, FaShieldAlt, FaServer, FaKey
// } from "react-icons/fa";

// // Import API
// import { 
//     getAllNguoiDung, getAllChucVu, 
//     getAllChucNang, getAllChiTietNhomQuyen 
// } from "../../../api/login";

// // --- TYPE DEFINITIONS ---
// type NodeType = 'USER' | 'ROLE' | 'PAGE' | 'FUNC';

// interface GraphNode {
//     id: string;
//     name: string;
//     type: NodeType;
//     val: number;
//     color: string;
//     dataRaw?: any;
//     x?: number; y?: number; z?: number;
// }

// interface GraphLink {
//     source: string | GraphNode;
//     target: string | GraphNode;
//     color?: string;
// }

// export default function SystemCommandCenter() {
//     const fgRef = useRef<any>();
    
//     // --- STATE ---
//     const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
//     const [loading, setLoading] = useState(true);
//     const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
//     const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
//     const [highlightLinks, setHighlightLinks] = useState(new Set<any>());
//     const [activeTab, setActiveTab] = useState<'USER' | 'PAGE' | 'ROLE'>('USER');
//     const [searchTerm, setSearchTerm] = useState("");
//     const [stats, setStats] = useState({ user: 0, role: 0, page: 0, func: 0, link: 0 });

//     // --- 1. FETCH DATA & PROCESS ---
//     useEffect(() => {
//         const initData = async () => {
//             setLoading(true);
//             try {
//                 // Lưu ý: Không cần gọi getAllTrangWeb nữa vì ta sẽ group theo URL trong ChucNang
//                 const [users, roles, funcs, perms] = await Promise.all([
//                     getAllNguoiDung(), 
//                     getAllChucVu(), 
//                     getAllChucNang(), 
//                     getAllChiTietNhomQuyen()
//                 ]);

//                 const nodes: GraphNode[] = [];
//                 const links: GraphLink[] = [];

//                 // 1. Role (Lõi - Trung tâm)
//                 (roles || []).forEach((r: any) => 
//                     nodes.push({ id: `ROLE_${r.machucvu}`, name: r.tenchucvu, type: 'ROLE', val: 50, color: '#a855f7', dataRaw: r })
//                 ); 
                
//                 // 2. User (Vệ tinh của Role)
//                 (users || []).forEach((u: any) => {
//                     nodes.push({ id: `USER_${u.manguoidung}`, name: u.tennguoidung, type: 'USER', val: 25, color: '#3b82f6', dataRaw: u });
//                     if (u.machucvu) {
//                         links.push({ source: `ROLE_${u.machucvu}`, target: `USER_${u.manguoidung}`, color: '#a855f740' });
//                     }
//                 });

//                 // 3. Page & Function (Xử lý dữ liệu mới: trangtruycap)
//                 const uniquePages = new Set<string>();

//                 (funcs || []).forEach((f: any) => {
//                     // Tạo Node Chức năng
//                     nodes.push({ id: `FUNC_${f.machucnang}`, name: f.tenchucnang, type: 'FUNC', val: 15, color: '#f59e0b', dataRaw: f });
                    
//                     // Logic mới: Tạo liên kết từ Chức năng -> URL (Trang ảo)
//                     if (f.trangtruycap && f.trangtruycap.trim() !== "") {
//                         uniquePages.add(f.trangtruycap);
//                         // Link Func -> Page
//                         links.push({ source: `PAGE_${f.trangtruycap}`, target: `FUNC_${f.machucnang}`, color: '#10b98140' });
//                     }
//                 });

//                 // Tạo Node Page từ các URL duy nhất đã thu thập
//                 uniquePages.forEach((url) => {
//                     nodes.push({ id: `PAGE_${url}`, name: url, type: 'PAGE', val: 40, color: '#10b981', dataRaw: { tentrang: url } });
//                 });

//                 // 4. Permissions (User -> Func)
//                 // Giả định API trả về mảng object { manguoidung, machucnang }
//                 const permsData = perms.data || perms || [];
//                 permsData.forEach((p: any) => {
//                     const s = `USER_${p.manguoidung}`, t = `FUNC_${p.machucnang}`;
//                     // Chỉ tạo link nếu cả 2 node đều tồn tại
//                     if (nodes.some(n => n.id === s) && nodes.some(n => n.id === t)) {
//                         links.push({ source: s, target: t, color: '#ef4444' }); // Link màu đỏ thể hiện quyền
//                     }
//                 });

//                 setGraphData({ nodes, links });
//                 setStats({ 
//                     user: users.length, 
//                     role: roles.length, 
//                     page: uniquePages.size, 
//                     func: funcs.length, 
//                     link: links.length 
//                 });

//             } catch (err) { console.error(err); } 
//             finally { setLoading(false); }
//         };
//         initData();
//     }, []);

//     // --- 2. AUTO ZOOM & INTERACTION ---
//     const handleEngineStop = useCallback(() => {
//         if (fgRef.current) {
//             fgRef.current.zoomToFit(1000, 100);
//         }
//     }, []);

//     const handleNodeClick = useCallback((node: GraphNode) => {
//         if (!node) return;
//         const connectedNodeIds = new Set<string>([node.id]);
//         const connectedLinks = new Set<any>();
        
//         graphData.links.forEach((link: any) => {
//             if (link.source.id === node.id || link.target.id === node.id) {
//                 connectedLinks.add(link);
//                 connectedNodeIds.add(link.source.id);
//                 connectedNodeIds.add(link.target.id);
//             }
//         });

//         setHighlightNodes(connectedNodeIds);
//         setHighlightLinks(connectedLinks);
//         setSelectedNode(node);

//         const distance = 80;
//         const distRatio = 1 + distance/Math.hypot(node.x!, node.y!, node.z!);
//         fgRef.current?.cameraPosition(
//             { x: node.x! * distRatio, y: node.y! * distRatio, z: node.z! * distRatio },
//             node, 2000
//         );
//     }, [graphData]);

//     const handleReset = () => {
//         setSelectedNode(null);
//         setHighlightNodes(new Set());
//         setHighlightLinks(new Set());
//         fgRef.current?.zoomToFit(1000, 100);
//     };

//     // --- 3. 3D GEOMETRY ---
//     const nodeThreeObject = useCallback((node: GraphNode) => {
//         const isHighlighted = highlightNodes.has(node.id);
//         const opacity = isHighlighted || highlightNodes.size === 0 ? 1 : 0.15;
//         const color = isHighlighted ? '#ffffff' : node.color;

//         let geometry;
//         switch (node.type) {
//             case 'USER': geometry = new THREE.SphereGeometry(6); break;
//             case 'ROLE': geometry = new THREE.BoxGeometry(15, 15, 15); break;
//             case 'PAGE': geometry = new THREE.CylinderGeometry(18, 18, 3, 6); break; // Hình lục giác dẹt cho trang web
//             case 'FUNC': geometry = new THREE.TetrahedronGeometry(5); break;
//             default: geometry = new THREE.SphereGeometry(4);
//         }

//         const material = new THREE.MeshPhongMaterial({ 
//             color, transparent: true, opacity, 
//             shininess: 90, emissive: color, emissiveIntensity: 0.2 
//         });
//         const mesh = new THREE.Mesh(geometry, material);
        
//         const sprite = new SpriteText(node.name);
//         sprite.color = isHighlighted ? '#ffff00' : '#ffffff';
//         sprite.textHeight = isHighlighted ? 5 : (node.type === 'PAGE' || node.type === 'ROLE' ? 6 : 0);
//         sprite.position.y = node.type === 'PAGE' ? 15 : 10;
//         sprite.material.opacity = isHighlighted ? 1 : 0.6;
        
//         const group = new THREE.Group();
//         group.add(mesh);
//         group.add(sprite);
//         return group;
//     }, [highlightNodes]);

//     // --- 4. UI RENDERERS ---

//     const renderLeftPanel = () => {
//         const dataList = graphData.nodes.filter(n => n.type === activeTab);
//         const filteredList = dataList.filter(n => n.name?.toLowerCase().includes(searchTerm.toLowerCase()));

//         return (
//             <div className="flex flex-col h-full bg-slate-900/95 border-r border-white/10 backdrop-blur-xl">
//                 <div className="bg-gradient-to-br from-indigo-600 to-blue-900 p-5 pb-8 rounded-b-3xl shadow-2xl z-10 relative overflow-hidden">
//                     <div className="absolute top-0 right-0 p-4 opacity-10"><FaNetworkWired className="text-6xl text-white"/></div>
//                     <h2 className="text-lg font-bold text-white flex items-center gap-2 relative z-10">
//                         TRUNG TÂM ĐIỀU KHIỂN
//                     </h2>
//                     <p className="text-indigo-200 text-[10px] uppercase tracking-widest relative z-10">System Visualization V2.1 (Live Data)</p>
                    
//                     <div className="mt-4 relative shadow-lg">
//                         <FaSearch className="absolute left-3 top-2.5 text-indigo-300"/>
//                         <input 
//                             type="text" 
//                             placeholder="Tìm kiếm đối tượng..." 
//                             className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:bg-white focus:text-gray-900 outline-none transition-all text-sm"
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div className="flex justify-center gap-2 p-3 -mt-2 z-20">
//                     {[
//                         { id: 'USER', icon: <FaUser/>, label: 'User' },
//                         { id: 'PAGE', icon: <FaGlobe/>, label: 'Page' },
//                         { id: 'ROLE', icon: <FaLayerGroup/>, label: 'Role' }
//                     ].map(t => (
//                         <button 
//                             key={t.id}
//                             onClick={() => { setActiveTab(t.id as NodeType); setSearchTerm(""); }}
//                             className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold transition-all border ${
//                                 activeTab === t.id 
//                                 ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/40' 
//                                 : 'bg-slate-800 text-gray-400 border-slate-700 hover:bg-slate-700'
//                             }`}
//                         >
//                             <span className="text-sm mb-0.5">{t.icon}</span> {t.label}
//                         </button>
//                     ))}
//                 </div>

//                 <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 space-y-2">
//                     {filteredList.map(node => (
//                         <div 
//                             key={node.id}
//                             onClick={() => handleNodeClick(node)}
//                             className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${
//                                 selectedNode?.id === node.id 
//                                 ? 'bg-indigo-600/20 border-indigo-500/50' 
//                                 : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-400/50'
//                             }`}
//                         >
//                             <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-sm shrink-0" style={{ backgroundColor: node.color }}>
//                                 {node.type === 'PAGE' ? <FaLink/> : node.name.charAt(0)}
//                             </div>
//                             <div className="min-w-0">
//                                 <p className="text-sm font-bold text-gray-200 group-hover:text-white truncate" title={node.name}>{node.name}</p>
//                                 <p className="text-[10px] text-gray-500 font-mono truncate">{node.id}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     const renderDetailOverlay = () => {
//         if (!selectedNode) return null;
//         const { dataRaw, type } = selectedNode;

//         return (
//             <div className="absolute top-4 left-4 right-4 md:left-[380px] md:right-[320px] z-20 pointer-events-none">
//                 <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto animate-in slide-in-from-top duration-500 flex flex-col md:flex-row items-center justify-between gap-4">
//                     <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
//                         <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg shrink-0" style={{ backgroundColor: selectedNode.color }}>
//                             {type === 'USER' && <FaUser/>}
//                             {type === 'PAGE' && <FaGlobe/>}
//                             {type === 'ROLE' && <FaLayerGroup/>}
//                             {type === 'FUNC' && <FaTools/>}
//                         </div>
//                         <div className="min-w-0">
//                             <h2 className="text-xl font-bold text-white truncate">{selectedNode.name}</h2>
//                             <div className="flex flex-wrap gap-2 text-xs text-gray-300">
//                                 <span className="bg-white/10 px-2 rounded">{selectedNode.id}</span>
//                                 {type === 'USER' && <span>• {dataRaw.chucvu?.tenchucvu || "No Role"}</span>}
//                                 {type === 'FUNC' && <span className="flex items-center gap-1">• <FaKey className="text-amber-400"/> {dataRaw.matruycap}</span>}
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div className="flex items-center gap-4 shrink-0">
//                         <div className="text-right hidden lg:block">
//                             <div className="text-[10px] text-gray-400 uppercase">Liên kết</div>
//                             <div className="text-xl font-mono font-bold text-indigo-400">{highlightLinks.size}</div>
//                         </div>
//                         <button onClick={handleReset} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
//                             <FaArrowLeft/>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const renderRightPanel = () => {
//         return (
//             <div className="w-[300px] h-full flex flex-col bg-slate-900/95 border-l border-white/10 backdrop-blur-xl">
//                 <div className="p-5 border-b border-white/10">
//                     <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
//                         <FaDatabase className="text-amber-400"/> Thống kê dữ liệu
//                     </h2>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-5 space-y-6">
//                     <div>
//                         <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
//                             <span>Thực thể</span>
//                             <span>Số lượng</span>
//                         </div>
//                         {[
//                             { label: 'Users', val: stats.user, color: 'bg-blue-500' },
//                             { label: 'Roles', val: stats.role, color: 'bg-purple-500' },
//                             { label: 'Pages (URLs)', val: stats.page, color: 'bg-green-500' },
//                             { label: 'Functions', val: stats.func, color: 'bg-amber-500' },
//                         ].map((item, idx) => (
//                             <div key={idx} className="mb-3">
//                                 <div className="flex justify-between text-xs text-white mb-1">
//                                     <span>{item.label}</span>
//                                     <span className="font-mono">{item.val}</span>
//                                 </div>
//                                 <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
//                                     <div className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`} style={{ width: `${(item.val / (stats.user + stats.role + stats.page + stats.func)) * 100 * 2}%` }}></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="grid grid-cols-1 gap-3">
//                         <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
//                             <FaShieldAlt className="text-2xl text-red-500"/>
//                             <div>
//                                 <div className="text-xs text-gray-400">Quyền hạn (Links)</div>
//                                 <div className="text-lg font-bold text-white font-mono">{stats.link}</div>
//                             </div>
//                         </div>
//                         <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
//                             <FaServer className="text-2xl text-cyan-500"/>
//                             <div>
//                                 <div className="text-xs text-gray-400">Tổng Node</div>
//                                 <div className="text-lg font-bold text-white font-mono">{graphData.nodes.length}</div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-green-400 space-y-1 opacity-80">
//                         <div> System initialized... OK</div>
//                         <div> Parsing URLs from Functions... OK</div>
//                         <div> 3D Topology generated... OK</div>
//                         <div className="text-white animate-pulse"> Waiting for command_</div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="flex h-screen w-full bg-black font-sans overflow-hidden select-none">
            
//             {/* LEFT PANEL */}
//             <div className="w-[360px] h-full shrink-0 z-30">
//                 {renderLeftPanel()}
//             </div>

//             {/* CENTER 3D VIEWPORT */}
//             <div className="flex-1 relative h-full bg-gradient-to-b from-slate-900 via-black to-slate-900">
//                 {loading && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black text-white">
//                         <FaSpinner className="animate-spin text-5xl text-indigo-500 mb-4"/>
//                         <p className="text-indigo-300 font-mono animate-pulse">BUILDING GRAPH TOPOLOGY...</p>
//                     </div>
//                 )}

//                 <ForceGraph3D
//                     ref={fgRef}
//                     graphData={graphData}
//                     backgroundColor="rgba(0,0,0,0)"
                    
//                     nodeThreeObject={nodeThreeObject}
//                     nodeLabel="name"
                    
//                     linkWidth={link => highlightLinks.has(link) ? 2 : 0.5}
//                     linkColor={link => highlightLinks.has(link) ? "#ffffff" : link.color}
//                     linkOpacity={0.3}
//                     linkDirectionalParticles={link => highlightLinks.has(link) ? 4 : 0}
//                     linkDirectionalParticleWidth={3}

//                     onNodeClick={handleNodeClick}
//                     onBackgroundClick={handleReset}
//                     onEngineStop={handleEngineStop}
                    
//                     d3VelocityDecay={0.3}
//                     cooldownTime={3000}
//                 />

//                 {renderDetailOverlay()}

//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 text-[10px] text-gray-400 bg-black/50 backdrop-blur px-6 py-2 rounded-full border border-white/10 pointer-events-none">
//                      <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> User</span>
//                      <span className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-sm"></span> Role</span>
//                      <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-[2px]"></span> Page (URL)</span>
//                      <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 triangle"></span> Func</span>
//                 </div>
//             </div>

//             {/* RIGHT PANEL */}
//             <div className="w-[300px] h-full shrink-0 z-30">
//                 {renderRightPanel()}
//             </div>

//         </div>
//     );
// }