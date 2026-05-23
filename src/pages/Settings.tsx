import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, CreditCard, Cpu, Shield, Save, RefreshCw } from 'lucide-react';
import { getSystemSettings, updateSystemSettings } from '../services/db';
import type { SystemSettings } from '../services/db';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Settings State loaded from Firestore
  const [config, setConfig] = useState<SystemSettings>({
    ispName: 'NetFlow Broadband Ltd.',
    supportPhone: '+92 42 111-638-356',
    supportEmail: 'support@netflow.com.pk',
    currency: 'PKR',
    taxRate: '16',
    lateFee: '200',
    billingDay: '5',
    aiModel: 'gemini-1.5-flash',
    apiKey: '••••••••••••••••••••••••••••••••',
    autoPrioritize: true,
  });

  const fetchSettings = async () => {
    try {
      const dbConfig = await getSystemSettings();
      setConfig(dbConfig);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSystemSettings(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings to Firestore.');
    }
  };

  const tabs = [
    { id: 'general', name: 'General Settings', icon: <SettingsIcon size={18} /> },
    { id: 'billing', name: 'Billing & Invoices', icon: <CreditCard size={18} /> },
    { id: 'ai', name: 'AI NLP Settings', icon: <Cpu size={18} /> },
    { id: 'security', name: 'System Access & Roles', icon: <Shield size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      
      {/* Sidebar Tabs */}
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
         <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Settings</h1>
         {tabs.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             style={{
               display: 'flex',
               alignItems: 'center',
               gap: '0.75rem',
               padding: '0.85rem 1rem',
               borderRadius: '8px',
               border: '1px solid transparent',
               background: activeTab === tab.id ? '#0f766e' : 'white',
               color: activeTab === tab.id ? 'white' : 'var(--text-dark)',
               fontWeight: activeTab === tab.id ? 600 : 500,
               cursor: 'pointer',
               boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
               textAlign: 'left',
               transition: 'all 0.2s'
             }}
           >
             {tab.icon}
             {tab.name}
           </button>
         ))}
      </div>

      {/* Main Settings Card */}
      <div className="glass-panel" style={{ flex: 1, padding: '2.5rem', background: 'white' }}>
         {loading ? (
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem', color: 'var(--text-light)' }}>
              <RefreshCw size={18} className="animate-spin" /> Loading ISP Parameters...
           </div>
         ) : (
           <form onSubmit={handleSave} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              
              {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>General ISP Details</h2>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div>
                       <label className="form-label">ISP Registered Brand Name</label>
                       <input type="text" className="form-control" value={config.ispName} onChange={(e) => setConfig({...config, ispName: e.target.value})} style={{ background: '#f8fafc' }} required />
                     </div>
                     <div>
                       <label className="form-label">Operations HQ Area</label>
                       <input type="text" className="form-control" value="DHA Phase 4, Lahore" disabled />
                     </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div>
                       <label className="form-label">Customer Support Hotline</label>
                       <input type="text" className="form-control" value={config.supportPhone} onChange={(e) => setConfig({...config, supportPhone: e.target.value})} style={{ background: '#f8fafc' }} required />
                     </div>
                     <div>
                       <label className="form-label">System Notification Email</label>
                       <input type="email" className="form-control" value={config.supportEmail} onChange={(e) => setConfig({...config, supportEmail: e.target.value})} style={{ background: '#f8fafc' }} required />
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Billing Parameters</h2>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div>
                       <label className="form-label">Sales Tax / GST (%)</label>
                       <input type="text" className="form-control" value={config.taxRate} onChange={(e) => setConfig({...config, taxRate: e.target.value})} style={{ background: '#f8fafc' }} required />
                     </div>
                     <div>
                       <label className="form-label">Late Payment Penalty (PKR)</label>
                       <input type="text" className="form-control" value={config.lateFee} onChange={(e) => setConfig({...config, lateFee: e.target.value})} style={{ background: '#f8fafc' }} required />
                     </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div>
                       <label className="form-label">Monthly Invoice Generation Day</label>
                       <select className="form-control" value={config.billingDay} onChange={(e) => setConfig({...config, billingDay: e.target.value})} style={{ background: '#f8fafc' }}>
                          <option value="1">1st of Month</option>
                          <option value="5">5th of Month</option>
                          <option value="10">10th of Month</option>
                       </select>
                     </div>
                     <div>
                       <label className="form-label">Base Transaction Currency</label>
                       <input type="text" className="form-control" value={config.currency} disabled />
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>LLM AI Integration</h2>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div>
                       <label className="form-label">NLP Model Architecture</label>
                       <select className="form-control" value={config.aiModel} onChange={(e) => setConfig({...config, aiModel: e.target.value})} style={{ background: '#f8fafc' }}>
                          <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                          <option value="gpt-4o">GPT-4o Mini</option>
                       </select>
                     </div>
                     <div>
                       <label className="form-label">Developer API Endpoint Key</label>
                       <input type="password" className="form-control" value={config.apiKey} onChange={(e) => setConfig({...config, apiKey: e.target.value})} style={{ background: '#f8fafc' }} required />
                     </div>
                   </div>

                   <div>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#f8fafc' }}>
                        <input 
                          type="checkbox" 
                          checked={config.autoPrioritize} 
                          onChange={(e) => setConfig({...config, autoPrioritize: e.target.checked})}
                          style={{ width: '18px', height: '18px', accentColor: '#0f766e' }}
                        />
                        <div>
                           <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Enable AI Ticket Auto-Prioritization</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>Automatically sets priority (Low/Medium/Urgent) on customer complaint text classification.</div>
                        </div>
                     </label>
                   </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Team Access & Control</h2>
                   
                   <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
                         <span>User Profile</span>
                         <span>Assigned Role</span>
                         <span>System Privileges</span>
                      </div>
                      {[
                        { name: 'Admin Manager', role: 'Superadmin', priv: 'Full Settings & DB Writes' },
                        { name: 'Sohail Butt', role: 'Support Agent', priv: 'Tickets Read/Write, Invoices Read' },
                        { name: 'Imran Malik', role: 'Dispatcher', priv: 'Technician Assignment Only' },
                      ].map((user, i) => (
                        <div key={i} style={{ padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', fontSize: '0.85rem', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
                           <span style={{ fontWeight: 500 }}>{user.name}</span>
                           <span className="badge" style={{ background: '#f1f5f9', color: '#475569', alignSelf: 'center', justifySelf: 'start', fontSize: '0.75rem' }}>{user.role}</span>
                           <span style={{ color: 'var(--text-light)' }}>{user.priv}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                 {saveSuccess && (
                   <span style={{ color: '#10b981', fontWeight: 600, alignSelf: 'center', fontSize: '0.875rem' }}>✓ System parameters updated!</span>
                 )}
                 <button type="submit" className="btn btn-primary" style={{ background: '#0f766e', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Save size={16} /> Save Configuration
                 </button>
              </div>

           </form>
         )}
      </div>

    </div>
  );
}
