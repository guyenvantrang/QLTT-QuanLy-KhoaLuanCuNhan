import React, { useEffect, useState, useRef, useCallback } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import { 
    FaSpinner, FaUser, FaLayerGroup, FaGlobe, FaTools, 
    FaSearch, FaArrowLeft, FaLink, FaChartPie, FaDatabase, 
    FaNetworkWired, FaMicrochip, FaShieldAlt, FaServer
} from "react-icons/fa";

// Import API
import { 
    getAllNguoiDung, getAllChucVu, getAllTrangWeb, 
    getAllChucNang, getAllChiTietNhomQuyen 
} from "../../../api/login";

// --- TYPE DEFINITIONS ---
type NodeType = 'USER' | 'ROLE' | 'PAGE' | 'FUNC';

interface GraphNode {
    id: string;
    name: string;
    type: NodeType;
    val: number;
    color: string;
    dataRaw?: any;
    x?: number; y?: number; z?: number;
}

interface GraphLink {
    source: string | GraphNode;
    target: string | GraphNode;
    color?: string;
}

export default function SystemCommandCenter() {
    const fgRef = useRef<any>();
    
    // --- STATE ---
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
    const [highlightLinks, setHighlightLinks] = useState(new Set<any>());
    const [activeTab, setActiveTab] = useState<'USER' | 'PAGE' | 'ROLE'>('USER');
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({ user: 0, role: 0, page: 0, func: 0, link: 0 });

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const [users, roles, pages, funcs, perms] = await Promise.all([
                    getAllNguoiDung(), getAllChucVu(), getAllTrangWeb(), getAllChucNang(), getAllChiTietNhomQuyen()
                ]);

                const nodes: GraphNode[] = [];
                const links: GraphLink[] = [];

                // --- TẠO DATA VỚI KÍCH THƯỚC LỚN HƠN ---
                // Role (Lõi)
                (roles || []).forEach((r: any) => nodes.push({ id: `ROLE_${r.machucvu}`, name: r.tenchucvu, type: 'ROLE', val: 50, color: '#a855f7', dataRaw: r })); // Tím
                
                // User
                (users || []).forEach((u: any) => {
                    nodes.push({ id: `USER_${u.manguoidung}`, name: u.tennguoidung, type: 'USER', val: 25, color: '#3b82f6', dataRaw: u }); // Xanh dương
                    if (u.machucvu) links.push({ source: `ROLE_${u.machucvu}`, target: `USER_${u.manguoidung}`, color: '#a855f740' });
                });

                // Page
                (pages || []).forEach((p: any) => nodes.push({ id: `PAGE_${p.matrang}`, name: p.tentrang, type: 'PAGE', val: 40, color: '#10b981', dataRaw: p })); // Xanh lá

                // Function
                (funcs || []).forEach((f: any) => {
                    nodes.push({ id: `FUNC_${f.machucnang}`, name: f.tenchucnang, type: 'FUNC', val: 15, color: '#f59e0b', dataRaw: f }); // Vàng
                    if (f.matrang) links.push({ source: `PAGE_${f.matrang}`, target: `FUNC_${f.machucnang}`, color: '#10b98140' });
                });

                // Permissions
                const permsData = perms.data || perms || [];
                permsData.forEach((p: any) => {
                    const s = `USER_${p.manguoidung}`, t = `FUNC_${p.machucnang}`;
                    if (nodes.some(n => n.id === s) && nodes.some(n => n.id === t)) {
                        links.push({ source: s, target: t, color: '#ef4444' }); // Đỏ
                    }
                });

                setGraphData({ nodes, links });
                setStats({ user: users.length, role: roles.length, page: pages.length, func: funcs.length, link: links.length });
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        initData();
    }, []);

    // --- 2. AUTO ZOOM & INTERACTION ---
    
    // Tự động zoom vừa màn hình khi engine dừng tính toán
    const handleEngineStop = useCallback(() => {
        if (fgRef.current) {
            fgRef.current.zoomToFit(1000, 100); // Zoom trong 1s, padding 100px
        }
    }, []);

    const handleNodeClick = useCallback((node: GraphNode) => {
        if (!node) return;
        const connectedNodeIds = new Set<string>([node.id]);
        const connectedLinks = new Set<any>();
        
        graphData.links.forEach((link: any) => {
            if (link.source.id === node.id || link.target.id === node.id) {
                connectedLinks.add(link);
                connectedNodeIds.add(link.source.id);
                connectedNodeIds.add(link.target.id);
            }
        });

        setHighlightNodes(connectedNodeIds);
        setHighlightLinks(connectedLinks);
        setSelectedNode(node);

        // Camera bay đến gần đối tượng hơn (Distance 80 thay vì 150)
        const distance = 80;
        const distRatio = 1 + distance/Math.hypot(node.x!, node.y!, node.z!);
        fgRef.current?.cameraPosition(
            { x: node.x! * distRatio, y: node.y! * distRatio, z: node.z! * distRatio },
            node, 2000
        );
    }, [graphData]);

    const handleReset = () => {
        setSelectedNode(null);
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
        fgRef.current?.zoomToFit(1000, 100);
    };

    // --- 3. 3D GEOMETRY (TO & RÕ HƠN) ---
    const nodeThreeObject = useCallback((node: GraphNode) => {
        const isHighlighted = highlightNodes.has(node.id);
        const opacity = isHighlighted || highlightNodes.size === 0 ? 1 : 0.15;
        const color = isHighlighted ? '#ffffff' : node.color;

        let geometry;
        // Tăng kích thước các khối để dễ nhìn
        switch (node.type) {
            case 'USER': geometry = new THREE.SphereGeometry(6); break;
            case 'ROLE': geometry = new THREE.BoxGeometry(15, 15, 15); break;
            case 'PAGE': geometry = new THREE.CylinderGeometry(18, 18, 3, 32); break;
            case 'FUNC': geometry = new THREE.TetrahedronGeometry(5); break;
            default: geometry = new THREE.SphereGeometry(4);
        }

        const material = new THREE.MeshPhongMaterial({ 
            color, transparent: true, opacity, 
            shininess: 90, emissive: color, emissiveIntensity: 0.2 
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Text luôn hiện nhưng mờ nếu không quan trọng
        const sprite = new SpriteText(node.name);
        sprite.color = isHighlighted ? '#ffff00' : '#ffffff';
        sprite.textHeight = isHighlighted ? 5 : (node.type === 'PAGE' ? 6 : 0); // Chỉ hiện tên Page mặc định để đỡ rối
        sprite.position.y = node.type === 'PAGE' ? 15 : 10;
        sprite.material.opacity = isHighlighted ? 1 : 0.6;
        
        const group = new THREE.Group();
        group.add(mesh);
        group.add(sprite);
        return group;
    }, [highlightNodes]);

    // --- 4. UI COMPONENTS ---

    // --- PANEL TRÁI: DANH SÁCH & ĐIỀU KHIỂN ---
    const renderLeftPanel = () => {
        const dataList = graphData.nodes.filter(n => n.type === activeTab);
        const filteredList = dataList.filter(n => n.name?.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
            <div className="flex flex-col h-full bg-slate-900/95 border-r border-white/10 backdrop-blur-xl">
                {/* Header Gradient đẹp mắt */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-900 p-5 pb-8 rounded-b-3xl shadow-2xl z-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><FaNetworkWired className="text-6xl text-white"/></div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 relative z-10">
                        TRUNG TÂM ĐIỀU KHIỂN
                    </h2>
                    <p className="text-indigo-200 text-[10px] uppercase tracking-widest relative z-10">System Visualization V2.0</p>
                    
                    {/* Search nổi */}
                    <div className="mt-4 relative shadow-lg">
                        <FaSearch className="absolute left-3 top-2.5 text-indigo-300"/>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm đối tượng..." 
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:bg-white focus:text-gray-900 outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-2 p-3 -mt-2 z-20">
                    {[
                        { id: 'USER', icon: <FaUser/>, label: 'User' },
                        { id: 'PAGE', icon: <FaGlobe/>, label: 'Page' },
                        { id: 'ROLE', icon: <FaLayerGroup/>, label: 'Role' }
                    ].map(t => (
                        <button 
                            key={t.id}
                            onClick={() => { setActiveTab(t.id as NodeType); setSearchTerm(""); }}
                            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold transition-all border ${
                                activeTab === t.id 
                                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/40' 
                                : 'bg-slate-800 text-gray-400 border-slate-700 hover:bg-slate-700'
                            }`}
                        >
                            <span className="text-sm mb-0.5">{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 space-y-2">
                    {filteredList.map(node => (
                        <div 
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${
                                selectedNode?.id === node.id 
                                ? 'bg-indigo-600/20 border-indigo-500/50' 
                                : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-400/50'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-sm shrink-0" style={{ backgroundColor: node.color }}>
                                {node.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-200 group-hover:text-white truncate">{node.name}</p>
                                <p className="text-[10px] text-gray-500 font-mono truncate">{node.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- PANEL GIỮA: DETAIL OVERLAY (Khi chọn) ---
    const renderDetailOverlay = () => {
        if (!selectedNode) return null;
        const { dataRaw, type } = selectedNode;

        return (
            <div className="absolute top-4 left-4 right-4 md:left-[380px] md:right-[320px] z-20 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto animate-in slide-in-from-top duration-500 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg" style={{ backgroundColor: selectedNode.color }}>
                            {type === 'USER' && <FaUser/>}
                            {type === 'PAGE' && <FaGlobe/>}
                            {type === 'ROLE' && <FaLayerGroup/>}
                            {type === 'FUNC' && <FaTools/>}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedNode.name}</h2>
                            <div className="flex gap-2 text-xs text-gray-300">
                                <span className="bg-white/10 px-2 rounded">{selectedNode.id}</span>
                                {type === 'USER' && <span>• {dataRaw.chucvu?.tenchucvu}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden lg:block">
                            <div className="text-[10px] text-gray-400 uppercase">KẾT NỐI</div>
                            <div className="text-xl font-mono font-bold text-indigo-400">{highlightLinks.size}</div>
                        </div>
                        <button onClick={handleReset} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                            <FaArrowLeft/>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- PANEL PHẢI: THỐNG KÊ (HUD) ---
    const renderRightPanel = () => {
        return (
            <div className="w-[300px] h-full flex flex-col bg-slate-900/95 border-l border-white/10 backdrop-blur-xl">
                <div className="p-5 border-b border-white/10">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                        <FaDatabase className="text-amber-400"/> Dữ liệu hệ thống
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Mini Charts */}
                    <div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Tài nguyên</span>
                            <span>Tỷ lệ</span>
                        </div>
                        {/* Custom Bar */}
                        {[
                            { label: 'Users', val: stats.user, color: 'bg-blue-500' },
                            { label: 'Roles', val: stats.role, color: 'bg-purple-500' },
                            { label: 'Pages', val: stats.page, color: 'bg-green-500' },
                            { label: 'Funcs', val: stats.func, color: 'bg-amber-500' },
                        ].map((item, idx) => (
                            <div key={idx} className="mb-3">
                                <div className="flex justify-between text-xs text-white mb-1">
                                    <span>{item.label}</span>
                                    <span className="font-mono">{item.val}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`} style={{ width: `${(item.val / (stats.user + stats.role + stats.page + stats.func)) * 100 * 2}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <FaShieldAlt className="text-2xl text-red-500"/>
                            <div>
                                <div className="text-xs text-gray-400">Permission Links</div>
                                <div className="text-lg font-bold text-white font-mono">{stats.link}</div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <FaServer className="text-2xl text-cyan-500"/>
                            <div>
                                <div className="text-xs text-gray-400">Total Nodes</div>
                                <div className="text-lg font-bold text-white font-mono">{graphData.nodes.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Log */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-green-400 space-y-1 opacity-80">
                        <div> System initialized... OK</div>
                        <div> Data fetched... OK</div>
                        <div> 3D Engine... READY</div>
                        <div className="text-white animate-pulse"> Waiting for command_</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full bg-black font-sans overflow-hidden select-none">
            
            {/* 1. LEFT PANEL (360px) */}
            <div className="w-[360px] h-full shrink-0 z-30">
                {renderLeftPanel()}
            </div>

            {/* 2. CENTER 3D VIEWPORT (Flexible) */}
            <div className="flex-1 relative h-full bg-gradient-to-b from-slate-900 via-black to-slate-900">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black text-white">
                        <FaSpinner className="animate-spin text-5xl text-indigo-500 mb-4"/>
                        <p className="text-indigo-300 font-mono animate-pulse">LOADING SYSTEM CORE...</p>
                    </div>
                )}

                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    backgroundColor="rgba(0,0,0,0)" // Transparent để thấy gradient nền
                    
                    nodeThreeObject={nodeThreeObject}
                    nodeLabel="name"
                    
                    linkWidth={link => highlightLinks.has(link) ? 2 : 0.5}
                    linkColor={link => highlightLinks.has(link) ? "#ffffff" : link.color}
                    linkOpacity={0.3}
                    linkDirectionalParticles={link => highlightLinks.has(link) ? 4 : 0}
                    linkDirectionalParticleWidth={3}

                    onNodeClick={handleNodeClick}
                    onBackgroundClick={handleReset}
                    onEngineStop={handleEngineStop} // Tự động zoom khi ổn định
                    
                    d3VelocityDecay={0.3} // Tăng ma sát để các node không bay quá xa
                    cooldownTime={3000} // Thời gian ổn định 3s
                />

                {/* Overlay Detail khi chọn */}
                {renderDetailOverlay()}

                {/* Legend Bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 text-[10px] text-gray-400 bg-black/50 backdrop-blur px-6 py-2 rounded-full border border-white/10 pointer-events-none">
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> User</span>
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-sm"></span> Role</span>
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-[2px]"></span> Page</span>
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 triangle"></span> Func</span>
                </div>
            </div>

            {/* 3. RIGHT PANEL (300px) */}
            <div className="w-[300px] h-full shrink-0 z-30">
                {renderRightPanel()}
            </div>

        </div>
    );
}