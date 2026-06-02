import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Server, Activity, Users, CheckCircle, AlertTriangle, Cpu, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { getCustomers } from '../services/db';

const initialNodes = [
  { id: 1, name: 'Lahore Central Gateway', status: 'Healthy', load: '64%', ping: '12ms', ip: '192.168.10.1', risk: 8, ttf: '142h' },
  { id: 2, name: 'Gulberg III Hub Node', status: 'Healthy', load: '78%', ping: '14ms', ip: '192.168.12.5', risk: 15, ttf: '98h' },
  { id: 3, name: 'DHA Phase 4 Ring', status: 'Healthy', load: '45%', ping: '18ms', ip: '192.168.15.12', risk: 4, ttf: '310h' },
  { id: 4, name: 'Johar Town Sector A Node', status: 'Healthy', load: '89%', ping: '22ms', ip: '192.168.22.4', risk: 28, ttf: '48h' },
  { id: 5, name: 'Bahria Town Sub-hub', status: 'Warning', load: '94%', ping: '84ms', ip: '192.168.45.2', risk: 89, ttf: '1.2h' },
];

export default function NetworkMonitor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [activeONTCount, setActiveONTCount] = useState(12); // fallback if empty
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationLogs, setOptimizationLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const list = await getCustomers();
        const activeCount = list.filter(c => c.status === 'Active').length;
        if (activeCount > 0) {
          setActiveONTCount(activeCount);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  // Simulate real-time bandwidth traffic fluctuations
  useEffect(() => {
    const data = [];
    for (let i = 24; i >= 0; i--) {
      data.push({
        time: `${i}h ago`,
        upload: 1.2 + Math.random() * 0.5,
        download: 3.5 + Math.random() * 1.5,
      });
    }
    setTrafficData(data);

    const interval = setInterval(() => {
      setTrafficData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: 'Now',
          upload: 1.2 + Math.random() * 0.5,
          download: 3.5 + Math.random() * 1.5,
        });
        return next;
      });

      // Randomly update ping/load for visualization
      setNodes(prev => prev.map(node => {
        if (node.id === 5 && node.status === 'Warning') return node;
        const baseLoad = parseInt(node.load);
        const basePing = parseInt(node.ping);
        const newLoad = Math.min(100, Math.max(10, baseLoad + Math.floor(Math.random() * 11) - 5));
        const newPing = Math.min(150, Math.max(5, basePing + Math.floor(Math.random() * 7) - 3));
        const newRisk = Math.max(2, Math.min(99, Math.floor(newLoad * 0.3 + newPing * 0.5)));
        const newTtf = newRisk > 70 ? '1-2h' : newRisk > 40 ? '12-24h' : '150h+';
        return {
          ...node,
          load: `${newLoad}%`,
          ping: `${newPing}ms`,
          risk: newRisk,
          ttf: newTtf
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const runAutoHealing = () => {
    setIsOptimizing(true);
    setOptimizationLogs([
      "Initiating AI Network Optimization Protocol...",
      "Analyzing Core Loop Gateway latencies...",
      "Congestion detected on 192.168.45.2 (Bahria Town Sub-hub).",
      "Calculating optimal optical channel bandwidth redistribution routes..."
    ]);

    setTimeout(() => {
      setOptimizationLogs(prev => [
        ...prev,
        "Executing routing table adjustments...",
        "Rerouting DHA Phase 4 backhaul link to bypass Bahria Town bottleneck...",
        "Applying channel optimization on Bahria Sub-hub..."
      ]);
    }, 1200);

    setTimeout(() => {
      setNodes(prev => prev.map(node => {
        if (node.id === 5) {
          return {
            ...node,
            status: 'Healthy',
            load: '51%',
            ping: '15ms',
            risk: 12,
            ttf: '240h+'
          };
        }
        return node;
      }));
      setOptimizationLogs(prev => [
        ...prev,
        "Success! Optical signal balanced. Core load dropped by 43%.",
        "Bahria Town Sub-hub health restored to 100%.",
        "Optimisation Protocol complete."
      ]);
      setIsOptimizing(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>ISP Telemetry & Health</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Network Monitor</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.5rem 1rem', borderRadius: '20px', color: '#065f46', fontSize: '0.875rem', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          {nodes.some(n => n.status === 'Warning') ? 'Critical Anomaly Detected' : 'All Main Core Gateways Operational'}
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
         <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#ecfdf5', color: '#10b981', padding: '0.75rem', borderRadius: '8px' }}><CheckCircle size={24} /></div>
           <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Global Uptime (24h)</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{nodes.some(n => n.status === 'Warning') ? '99.92%' : '99.98%'}</div>
           </div>
         </div>

         <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.75rem', borderRadius: '8px' }}><Activity size={24} /></div>
           <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Current Network Load</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{nodes.some(n => n.status === 'Warning') ? '5.14 Gbps' : '4.02 Gbps'}</div>
           </div>
         </div>

         <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#f5f3ff', color: '#8b5cf6', padding: '0.75rem', borderRadius: '8px' }}><Users size={24} /></div>
           <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Active Connected ONT</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeONTCount} Users</div>
           </div>
         </div>

         <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#fffbeb', color: '#d97706', padding: '0.75rem', borderRadius: '8px' }}><AlertTriangle size={24} /></div>
           <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Active Incidents</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{nodes.filter(n => n.status === 'Warning').length} Warnings</div>
           </div>
         </div>
      </div>

      {/* Network Bandwidth Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem', height: '320px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 700 }}>Live Bandwidth Load (Upload/Download)</h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 12, height: 12, background: '#3b82f6', borderRadius: '2px', display: 'inline-block' }}></span> Download</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 12, height: 12, background: '#10b981', borderRadius: '2px', display: 'inline-block' }}></span> Upload</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => val.toFixed(1) + 'G'} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="download" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
            <Area type="monotone" dataKey="upload" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Network Anomaly Prognostics & Healing Map Engine */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#0f172a', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu color="#a855f7" size={22} className={nodes.some(n => n.status === 'Warning') ? 'animate-pulse' : ''} />
            <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              AI Anomaly Predictor & Outage Forecasting Engine 
              <span style={{ fontSize: '0.75rem', background: '#a855f7', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>Active Diagnostics</span>
            </h3>
          </div>
          <button 
            className="btn" 
            style={{ background: '#a855f7', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
            onClick={runAutoHealing}
            disabled={isOptimizing || !nodes.some(n => n.status === 'Warning')}
          >
            {isOptimizing ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Balancing Signals...
              </>
            ) : nodes.some(n => n.status === 'Warning') ? (
              <>
                <Sparkles size={16} /> Execute AI Auto-Healing
              </>
            ) : (
              <>
                <ShieldCheck size={16} /> Nodes Fully Balanced
              </>
            )}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr', gap: '1rem' }}>
          
          {/* Column 1: Node Risk List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {nodes.map(node => {
              const getRiskColor = (risk: number) => {
                if (risk > 70) return '#ef4444';
                if (risk > 30) return '#f59e0b';
                return '#10b981';
              };
              return (
                <div key={node.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{node.name.replace(" Gateway", "").replace(" Sector A Node", "").replace(" Sub-hub", "")}</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Load: {node.load} | Ping: {node.ping}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: getRiskColor(node.risk), fontWeight: 700 }}>{node.risk}% Risk</div>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>TTF: {node.ttf}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: SVG Network Topology Map */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', height: '245px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>INTERACTIVE TOPOLOGY MAP</div>
            
            <svg width="100%" height="90%" viewBox="0 0 300 200" style={{ overflow: 'visible', marginTop: '10px' }}>
              {/* Coordinates: Core(150,95), Gulberg(150,35), DHA(240,95), JoharTown(60,95), Bahria(150,155) */}

              {/* Connecting lines */}
              <line x1="150" y1="95" x2="150" y2="35" stroke="#10b981" strokeWidth="2.5" />
              <line x1="150" y1="95" x2="240" y2="95" stroke="#10b981" strokeWidth="2.5" />
              <line x1="150" y1="95" x2="60" y2="95" stroke="#10b981" strokeWidth="2.5" />

              {/* Bahria dynamic line */}
              {nodes.find(n => n.id === 5)?.status === 'Warning' ? (
                <line 
                  x1="150" y1="95" 
                  x2="150" y2="155" 
                  stroke={isOptimizing ? '#a855f7' : '#ef4444'} 
                  strokeWidth="2.5" 
                  strokeDasharray="6,4" 
                  style={{ animation: 'dash 1s linear infinite' }} 
                />
              ) : (
                <line x1="150" y1="95" x2="150" y2="155" stroke="#10b981" strokeWidth="2.5" />
              )}

              {/* Rerouting Lasers Link (DHA to Bahria backup line) */}
              {(isOptimizing || (nodes.find(n => n.id === 5)?.status === 'Healthy' && optimizationLogs.length > 0)) && (
                <line 
                  x1="240" y1="95" 
                  x2="150" y2="155" 
                  stroke="#a855f7" 
                  strokeWidth="3.5" 
                  strokeDasharray={isOptimizing ? '6,4' : 'none'} 
                  style={{ animation: isOptimizing ? 'dash 0.5s linear infinite' : 'none' }}
                />
              )}

              {/* Central Gateway */}
              <circle cx="150" cy="95" r="14" fill="#2563eb" stroke="#3b82f6" strokeWidth="2" />
              <text x="150" y="98" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">CORE</text>

              {/* Sub-hubs */}
              {/* Gulberg */}
              <circle cx="150" cy="35" r="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
              <text x="150" y="24" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">GULBERG</text>

              {/* DHA */}
              <circle cx="240" cy="95" r="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
              <text x="240" y="84" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">DHA</text>

              {/* Johar Town */}
              <circle cx="60" cy="95" r="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
              <text x="60" y="84" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">JOHAR TOWN</text>

              {/* Bahria */}
              {nodes.find(n => n.id === 5)?.status === 'Warning' ? (
                <>
                  <circle cx="150" cy="155" r="7" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" className="animate-pulse" />
                  <circle cx="150" cy="155" r="13" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', transformOrigin: '150px 155px' }} />
                </>
              ) : (
                <circle cx="150" cy="155" r="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
              )}
              <text x="150" y="170" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">BAHRIA</text>
            </svg>

            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -20;
                }
              }
              @keyframes ping {
                75%, 100% {
                  transform: scale(2.2);
                  opacity: 0;
                }
              }
            `}</style>
          </div>

          {/* Column 3: Diagnostics Console */}
          <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.7rem', color: '#38bdf8', height: '245px', overflowY: 'auto' }}>
            <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#64748b', fontWeight: 700 }}>PROGNOSTICS SHELL LOG</div>
            {optimizationLogs.length === 0 ? (
              <div style={{ color: '#64748b' }}>System idle. AI diagnostics running on background ticks. No critical outage anomalies predicted.</div>
            ) : (
              optimizationLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: '4px', color: log.startsWith("Success") ? '#4ade80' : log.startsWith("Error") || log.includes("Warning") || log.includes("Congestion") ? '#f87171' : '#38bdf8', lineHeight: '1.25' }}>
                  &gt; {log}
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Nodes Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        
        {/* Hub / Gateway list */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 700 }}>Core Hub Nodes Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {nodes.map((node) => (
                 <div key={node.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                       <div style={{ background: node.status === 'Healthy' ? '#d1fae5' : '#fef3c7', color: node.status === 'Healthy' ? '#10b981' : '#d97706', padding: '0.5rem', borderRadius: '6px' }}>
                          <Server size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{node.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>IP: {node.ip}</div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.875rem' }}>
                       <div>
                          <span style={{ color: 'var(--text-light)', marginRight: '4px' }}>Load:</span>
                          <strong>{node.load}</strong>
                       </div>
                       <div>
                          <span style={{ color: 'var(--text-light)', marginRight: '4px' }}>Ping:</span>
                          <strong style={{ color: parseInt(node.ping) > 50 ? '#dc2626' : 'inherit' }}>{node.ping}</strong>
                       </div>
                       <span className={`badge ${node.status === 'Healthy' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                         {node.status}
                       </span>
                    </div>
                 </div>
               ))}
          </div>
        </div>

        {/* Live Incidents Log */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 700 }}>System Incidents Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
             {nodes.some(n => n.id === 5 && n.status === 'Warning') ? (
               <div style={{ borderLeft: '4px solid #f59e0b', padding: '0.5rem 1rem', background: '#fffbeb', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontWeight: 600, color: '#b45309' }}>High Latency Warning — Bahria Town Sub-hub</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Triggered 18 mins ago | Action: AI optimization recommended</div>
               </div>
             ) : (
               <div style={{ borderLeft: '4px solid #10b981', padding: '0.5rem 1rem', background: '#f0fdf4', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontWeight: 600, color: '#15803d' }}>Auto-Resolved Warning — Bahria Town Sub-hub</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Optimized just now by AI Auto-Healing Engine</div>
               </div>
             )}
             
             <div style={{ borderLeft: '4px solid #10b981', padding: '0.5rem 1rem', background: '#f0fdf4', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontWeight: 600, color: '#15803d' }}>Scheduled Maintenance Completed — DHA Central Ring</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Closed 2 hours ago | Duration: 45 mins</div>
             </div>

             <div style={{ borderLeft: '4px solid #10b981', padding: '0.5rem 1rem', background: '#f0fdf4', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontWeight: 600, color: '#15803d' }}>Node Reset Done — Gulberg III Hub Node</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Closed 6 hours ago | Restored ping to 14ms</div>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}
