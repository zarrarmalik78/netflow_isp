import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const revenueData = [
  { name: '1 month', value: 10000 },
  { name: '2 month', value: 35000 },
  { name: '3 month', value: 28000 },
  { name: '4 month', value: 50000 },
  { name: '5 month', value: 65000 },
  { name: '6 month', value: 52000 },
  { name: 'Current', value: 70000 },
];

const complaintData = [
  { name: 'Speed Issue', value: 38, color: '#3b82f6' },
  { name: 'Router', value: 22, color: '#0ea5e9' },
  { name: 'Outage', value: 18, color: '#ef4444' },
  { name: 'Billing', value: 12, color: '#10b981' },
  { name: 'Installation', value: 10, color: '#8b5cf6' },
];

const recentComplaints = [
  { id: '10021', customer: 'Sample Karan', issue: 'Speed Complaint', priority: 'Urgent', status: 'Complete' },
  { id: '10022', customer: 'Sample Karith', issue: 'Internet Complaint', priority: 'Medium', status: 'Complete' },
  { id: '10033', customer: 'Sample Karith', issue: 'Router outage', priority: 'Medium', status: 'Complete' },
  { id: '10034', customer: 'Sample Karith', issue: 'Outage Infranaalaton', priority: 'Low', status: 'Complete' },
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* AI Admin Copilot Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.05, transform: 'rotate(25deg)' }}>🤖</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles color="#d8b4fe" size={20} />
          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            NetFlow AI Admin Copilot
            <span style={{ fontSize: '0.7rem', background: 'rgba(216, 180, 254, 0.2)', color: '#d8b4fe', padding: '0.15rem 0.5rem', borderRadius: '10px', border: '1px solid rgba(216, 180, 254, 0.4)' }}>Real-Time Data Context</span>
          </h3>
        </div>

        <form onSubmit={handleQuerySubmit} style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask Copilot: 'Who is our top technician?', 'Summarize open issues', or 'Provide revenue report'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '24px',
              padding: '0.75rem 1.25rem',
              fontSize: '0.85rem'
            }}
          />
          <button
            type="submit"
            className="btn"
            disabled={isLoading || !query.trim()}
            style={{
              borderRadius: '50%',
              width: 40,
              height: 40,
              padding: 0,
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              flexShrink: 0
            }}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>

        {/* AI Answer Box */}
        {(isLoading || response) && (
          <div style={{ marginTop: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
              AI
            </div>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#f1f5f9', whiteSpace: 'pre-line', width: '100%' }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Admin Copilot is scanning billing logs, ticket indexes, and technician loads...</span>
                </div>
              ) : (
                response
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>Total Customers</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.5rem' }}>1,284</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>+12 this month</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>Active Packages</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span className="badge badge-success" style={{ background: '#e0e7ff', color: '#4f46e5' }}>Packages</span>
            <span className="badge badge-success" style={{ background: '#e0e7ff', color: '#4f46e5' }}>Parka...</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>Unpaid Bills</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.5rem' }}>PKR 2.4M</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>Open Complaints</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.5rem' }}>47</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Monthly Revenue (PKR)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--primary-color)" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Complaint Categories</h3>
          <div style={{ height: '250px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complaintData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {complaintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Recent Complaints</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Issue</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>AI Priority</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{c.id}</td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem', fontWeight: 500 }}>{c.customer}</td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{c.issue}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span className={`badge ${c.priority === 'Urgent' ? 'badge-danger' : c.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{c.status}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <button style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Technician Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Admin Name {i}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{i} active jobs</div>
                  </div>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 4 ? 'var(--danger)' : 'var(--success)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
