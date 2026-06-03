import { useState } from 'react';
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  Wrench, 
  Activity, 
  Search, 
  ChevronRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Globe
} from 'lucide-react';

const revenueData = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 35000 },
  { name: 'Mar', value: 28000 },
  { name: 'Apr', value: 50000 },
  { name: 'May', value: 65000 },
  { name: 'Jun', value: 52000 },
  { name: 'Jul', value: 70000 },
];

const complaintData = [
  { name: 'Speed Issue', value: 38, color: '#4f46e5' },
  { name: 'Router Faults', value: 22, color: '#0ea5e9' },
  { name: 'Area Outage', value: 18, color: '#ef4444' },
  { name: 'Billing Queries', value: 12, color: '#10b981' },
  { name: 'Installation', value: 10, color: '#8b5cf6' },
];

const recentComplaints = [
  { id: 'CMP-0248', customer: 'Sohan Chaudhry', issue: 'Speed Degradation', priority: 'Urgent', status: 'In Progress', date: 'Just now' },
  { id: 'CMP-1021', customer: 'Karan Kumar', issue: 'Fiber Link LOS (Red Light)', priority: 'Urgent', status: 'Dispatched', date: '10m ago' },
  { id: 'CMP-1022', customer: 'Haris Ali', issue: 'Billing Dispute', priority: 'Medium', status: 'Pending', date: '1h ago' },
  { id: 'CMP-1033', customer: 'Nida Fatima', issue: 'Router Instability', priority: 'Low', status: 'Resolved', date: '3h ago' },
];

const technicians = [
  { name: 'Sajid Khan', area: 'DHA Phase 4', status: 'Available', rating: 4.8, jobs: 142, color: '#10b981' },
  { name: 'M. Ali', area: 'Gulberg III', status: 'On Site', rating: 4.5, jobs: 98, color: '#3b82f6' },
  { name: 'Waseem Akram', area: 'Model Town', status: 'Busy', rating: 4.9, jobs: 167, color: '#f59e0b' },
  { name: 'Zain Ashraf', area: 'DHA Phase 6', status: 'Offline', rating: 4.2, jobs: 84, color: '#64748b' },
];

export default function AdminDashboard() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setResponse('');

    try {
      const prompt = `You are NetFlow Admin Copilot, an AI assistant for the ISP administrator dashboard.
Here is the current system state summaries:
- Total active subscribers: 1,284
- Open Complaints: 47 (Speed: 38%, Router: 22%, Outage: 18%, Billing: 12%, Installation: 10%)
- Total outstanding billing: PKR 2.4 Million
- Active technicians:
  1. Sajid Khan (Area: DHA Phase 4, Status: Available, Rating: 4.8, Completed: 142)
  2. M. Ali (Area: Gulberg III, Status: Busy, Rating: 4.5, Completed: 98, active on CMP-0248)
- Recent solved tickets:
  - Ticket #10021: Speed Complaint (Urgent) for Sample Karan
  - Ticket #10022: Internet Complaint (Medium) for Sample Karith
  - Ticket #10033: Router outage (Medium) for Sample Karith
  - Ticket #10034: Outage Installation (Low) for Sample Karith

Answer the admin's query concisely and professionally. If they ask for actions, suggest concrete ISP admin actions. Keep response formatting clean, clear, and brief.

Admin query: "${query}"`;

      const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!res.ok) {
        throw new Error("Failed to fetch from Groq API");
      }

      const data = await res.json();
      const textResponse = data.choices[0].message.content;
      setResponse(textResponse);
    } catch (error) {
      console.error("Copilot error:", error);
      setResponse("I apologize, but I encountered an error connecting to the intelligence engine. Please check your network or VITE_GROQ_API_KEY settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      
      {/* Premium Ambient Light Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.04)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(13, 148, 136, 0.03)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top Welcome Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1, borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#e0e7ff', color: '#4f46e5', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Server size={12} style={{ marginRight: '4px' }} /> CORE SITE-OPS
            </span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} className="animate-pulse"></span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Gateway Cluster Active</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'var(--text-dark)' }}>Network Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'white' }}>
            <Activity size={16} /> Latency Map
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Zap size={16} /> Provision Node
          </button>
        </div>
      </div>
      
      {/* AI Admin Copilot Panel - Sleek Command Center styling */}
      <div className="premium-card" style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #090d16 0%, #111827 100%)', 
        border: '1px solid rgba(99, 102, 241, 0.2)', 
        color: '#f8fafc', 
        position: 'relative', 
        overflow: 'hidden', 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', 
        zIndex: 1 
      }}>
        {/* Glow effect overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', fontSize: '8rem', opacity: 0.05, transform: 'rotate(15deg)', userSelect: 'none', color: '#818cf8' }}>🤖</div>
        
        <div style={{ display: 'flex', justifyStyle: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyStyle: 'center', background: 'rgba(99, 102, 241, 0.15)', padding: '0.55rem', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <Sparkles color="#818cf8" size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                NetFlow AI Admin Copilot
              </h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Real-time cognitive search assistant for fiber splitters, customer billing, and technicians.</p>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.25)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span> Active Instance
          </span>
        </div>

        <form onSubmit={handleQuerySubmit} style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Ask Copilot: 'Who is our top technician?', 'Summarize open tickets', or 'Suggest bandwidth optimization'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'white',
                borderRadius: '12px',
                padding: '1rem 1.25rem 1rem 3rem',
                fontSize: '0.925rem',
                boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={isLoading || !query.trim()}
            style={{
              borderRadius: '12px',
              padding: '0 1.75rem',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>

        {/* AI Answer Box */}
        {(isLoading || response) && (
          <div style={{ marginTop: '1.5rem', background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#ffffff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyStyle: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              AI
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre-line', width: '100%' }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#818cf8' }}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Admin Copilot is scanning billing ledger index registers and technician queues...</span>
                </div>
              ) : (
                response
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', zIndex: 1 }}>
        
        {/* Total Customers */}
        <div className="premium-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf9fe 100%)',
          border: '1px solid #e0e7ff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.2px' }}>Active Subscribers</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.25rem', letterSpacing: '-1px' }}>1,284</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#e0e7ff', color: '#4f46e5', borderRadius: '12px', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.1)' }}>
              <Users size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={14} /> +12.4%
              </span>
              <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
            </div>
            {/* SVG Sparkline */}
            <svg width="55" height="22" viewBox="0 0 55 22" style={{ overflow: 'visible' }}>
              <path 
                d="M0,18 Q10,18 20,10 T35,14 T55,3" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Active Packages */}
        <div className="premium-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.2px' }}>Node Packages</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.25rem', letterSpacing: '-1px' }}>5 Tiers</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '12px', boxShadow: '0 4px 10px rgba(3, 105, 161, 0.1)' }}>
              <Package size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'white', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.65rem', padding: '0.15rem 0.5rem !important' }}>100 Mbps</span>
            <span className="badge" style={{ background: 'white', color: '#6d28d9', border: '1px solid #ddd6fe', fontSize: '0.65rem', padding: '0.15rem 0.5rem !important' }}>50 Mbps</span>
            <span className="badge" style={{ background: 'white', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.65rem', padding: '0.15rem 0.5rem !important' }}>+3 Tier</span>
          </div>
        </div>

        {/* Unpaid Bills */}
        <div className="premium-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
          border: '1px solid #fca5a5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.2px' }}>Outstanding Invoices</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', marginTop: '0.25rem', letterSpacing: '-1px' }}>PKR 2.4M</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', boxShadow: '0 4px 10px rgba(185, 28, 28, 0.1)' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={14} /> +4.2%
              </span>
              <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>past due ratio</span>
            </div>
            {/* SVG Sparkline */}
            <svg width="55" height="22" viewBox="0 0 55 22" style={{ overflow: 'visible' }}>
              <path 
                d="M0,5 Q15,22 30,12 T55,18" 
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Open Complaints */}
        <div className="premium-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
          border: '1px solid #a7f3d0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.2px' }}>Active Complaints</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem', letterSpacing: '-1px' }}>47 Open</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#d1e7dd', color: '#0f766e', borderRadius: '12px', boxShadow: '0 4px 10px rgba(15, 118, 110, 0.1)' }}>
              <AlertCircle size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                <TrendingDown size={14} /> -15.8%
              </span>
              <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>MTTR: 18 mins</span>
            </div>
            {/* SVG Sparkline */}
            <svg width="55" height="22" viewBox="0 0 55 22" style={{ overflow: 'visible' }}>
              <path 
                d="M0,2 Q12,8 25,18 T55,20" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1.1fr', gap: '1.5rem', zIndex: 1 }}>
        
        {/* Line Chart */}
        <div className="premium-card" style={{ padding: '2rem', position: 'relative', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800 }}>Invoicing & Net Revenue</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>Overview of collection and gross invoicing records.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.75rem', borderRadius: '8px', fontWeight: 700 }}>
                PKR 70,000 Peak
              </span>
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {['7D', '30D', '1Y'].map((t, i) => (
                  <button key={i} style={{ border: 'none', background: t === '30D' ? 'white' : 'transparent', color: t === '30D' ? 'var(--text-dark)' : 'var(--text-light)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', boxShadow: t === '30D' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.005}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-light)', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-light)', fontWeight: 600 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#ffffff', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '10px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="premium-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'white' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800 }}>Complaint Load</h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>Distribution of client tickets by category.</p>
          </div>
          <div style={{ height: '220px', width: '100%', position: 'relative', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complaintData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {complaintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label inside Pie */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.5px' }}>47</div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 800, letterSpacing: '0.5px' }}>Open Tickets</div>
            </div>
          </div>
          {/* Custom Legends */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto', fontSize: '0.75rem' }}>
            {complaintData.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }}></span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 700 }}>{c.name}</span>
                </div>
                <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1.1fr', gap: '1.5rem', zIndex: 1 }}>
        
        {/* Recent Complaints Table */}
        <div className="premium-card" style={{ padding: '2rem', overflow: 'hidden', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800 }}>Recent Technical Tickets</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>Realtime database status of consumer support dispatch queue.</p>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'white' }}>View All Tickets</button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ color: 'var(--text-light)', borderBottom: 'none' }}>
                  <th style={{ padding: '0.75rem 0' }}>Ticket</th>
                  <th style={{ padding: '0.75rem 0' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0' }}>Issue / Alert</th>
                  <th style={{ padding: '0.75rem 0' }}>Priority</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Activity</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{c.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                          {getInitials(c.customer)}
                        </div>
                        <span style={{ fontWeight: 700 }}>{c.customer}</span>
                      </div>
                    </td>
                    <td>{c.issue}</td>
                    <td>
                      <span className={`badge ${c.priority === 'Urgent' ? 'badge-danger' : c.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                        {c.priority === 'Urgent' ? '🔴 ' : c.priority === 'Medium' ? '🟡 ' : '🟢 '}
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 700, 
                        color: c.status === 'Resolved' ? '#10b981' : c.status === 'In Progress' ? '#2563eb' : c.status === 'Dispatched' ? '#8b5cf6' : '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.status === 'Resolved' ? '#10b981' : c.status === 'In Progress' ? '#2563eb' : c.status === 'Dispatched' ? '#8b5cf6' : '#d97706', display: 'inline-block' }}></span>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600 }}>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technician Status Panel */}
        <div className="premium-card" style={{ padding: '2rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800 }}>Field Ops Load</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>Status and workload of active split-technicians.</p>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '8px', background: 'white' }}><Wrench size={16} /></button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {technicians.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx !== technicians.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: idx !== technicians.length - 1 ? '0.85rem' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, #94a3b8)`, color: 'white', display: 'flex', alignItems: 'center', justifyStyle: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.1rem', fontWeight: 500 }}>
                      <Globe size={10} /> {t.area}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span className="badge" style={{ 
                    background: t.status === 'Available' ? '#ecfdf5' : t.status === 'On Site' ? '#eff6ff' : t.status === 'Busy' ? '#fffbeb' : '#f1f5f9',
                    color: t.status === 'Available' ? '#047857' : t.status === 'On Site' ? '#1d4ed8' : t.status === 'Busy' ? '#b45309' : '#475569',
                    border: `1px solid ${t.status === 'Available' ? '#a7f3d0' : t.status === 'On Site' ? '#bfdbfe' : t.status === 'Busy' ? '#fde68a' : '#cbd5e1'}`,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem !important'
                  }}>
                    {t.status}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem', fontWeight: 600 }}>★ {t.rating} ({t.jobs} jobs)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
