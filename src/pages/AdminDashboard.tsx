import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
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
