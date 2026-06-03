import { useState, useEffect } from 'react';
import { Wifi, CreditCard, ChevronRight, Activity, Bell, Shield, ArrowUpRight, Zap, RefreshCw, Cpu, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCustomers, getInvoices } from '../../services/db';
import type { Customer, Invoice } from '../../services/db';

export default function CustomerDashboard() {
  const [speedTestActive, setSpeedTestActive] = useState(false);
  const [speed, setSpeed] = useState({ down: 24.8, up: 12.2, ping: 14 });
  const [testStep, setTestStep] = useState('');
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [latestInvoice, setLatestInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomerInfo = async () => {
    try {
      const email = sessionStorage.getItem('userEmail') || 'sohance@gmail.com';
      const customers = await getCustomers();
      const match = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
      
      if (match) {
        setCustomer(match);
        const invoices = await getInvoices();
        const userInvoices = invoices.filter(i => i.customerId === match.id);
        if (userInvoices.length > 0) {
          setLatestInvoice(userInvoices[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const runSpeedTest = () => {
    setSpeedTestActive(true);
    setSpeed({ down: 0, up: 0, ping: 0 });
    
    // Animate diagnostic steps
    setTestStep('1. Pinging local gateway...');
    setTimeout(() => {
      setSpeed(prev => ({ ...prev, ping: 11 }));
      setTestStep('2. Measuring optical fiber downlink speed...');
      
      let interval = setInterval(() => {
        setSpeed(prev => ({
          ...prev,
          down: parseFloat((10 + Math.random() * 25).toFixed(1))
        }));
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setSpeed(prev => ({ ...prev, down: 25.4 }));
        setTestStep('3. Testing router upload stream...');
        
        let upInterval = setInterval(() => {
          setSpeed(prev => ({
            ...prev,
            up: parseFloat((4 + Math.random() * 12).toFixed(1))
          }));
        }, 100);
        
        setTimeout(() => {
          clearInterval(upInterval);
          setSpeed({ down: 25.4, up: 12.8, ping: 11 });
          setTestStep('✓ Line status optimized. Uptime stable.');
          
          setTimeout(() => {
            setSpeedTestActive(false);
            setTestStep('');
          }, 1500);
        }, 1500);
      }, 1500);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      
      {/* Dynamic Background Glow Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(13, 148, 136, 0.05)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.04)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Welcome Banner */}
      <div className="glass-panel" style={{ 
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)', 
        color: 'white', 
        padding: '2.25rem', 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(13, 148, 136, 0.12)',
        zIndex: 1
      }}>
         {/* Abstract Graphic Rings */}
         <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '220px', height: '220px', borderRadius: '50%', border: '24px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
         <div style={{ position: 'absolute', right: '40px', bottom: '-60px', width: '180px', height: '180px', borderRadius: '50%', border: '12px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
           <div>
             <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Fiber-to-the-Home</span>
             <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 800, color: 'white' }}>
               Hello, {loading ? '...' : (customer ? customer.fullName.split(' ')[0] : 'Subscriber')}!
             </h1>
             <p style={{ margin: 0, opacity: 0.95, fontSize: '0.95rem', color: '#ccfbf1', lineHeight: '1.5' }}>
               Your GPON ONT Gateway link in <strong style={{ color: 'white' }}>{customer ? customer.area : 'DHA Sector'}</strong> is fully active. Uptime is at 99.98% with no split failures in your quadrant.
             </p>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }} className="animate-pulse"></span> Link Connected
           </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', zIndex: 1 }}>
         
         {/* Connection Status & Speed Test */}
         <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="var(--customer-primary)" /> Local Link Diagnostics
               </h3>
               {speedTestActive && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--customer-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <RefreshCw size={12} className="animate-spin" /> Live scan active
                  </span>
               )}
            </div>
            
            {/* Speed Gauge / Diagnostic View */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
               <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  border: `8px double ${speedTestActive ? '#2dd4bf' : 'var(--border-color)'}`,
                  background: 'linear-gradient(135deg, #fdfdfd 0%, #f4f6f9 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.02), 0 10px 30px rgba(0,0,0,0.03)',
                  position: 'relative'
               }}>
                  {/* Glowing Pulse Ring during test */}
                  {speedTestActive && (
                     <div style={{ 
                        position: 'absolute', 
                        top: -8, left: -8, right: -8, bottom: -8, 
                        border: '2px solid #0d9488', 
                        borderRadius: '50%',
                        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                     }} />
                  )}
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.5px' }}>Downlink</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--customer-primary)', margin: '-0.25rem 0' }}>
                     {speed.down}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>Mbps</div>
               </div>
               
               {testStep && (
                  <div style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 600, background: '#f0fdfa', padding: '0.3rem 0.8rem', borderRadius: '12px', border: '1px solid #ccfbf1' }}>
                     {testStep}
                  </div>
               )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.85rem 1rem', background: '#ffffff', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Upload Link</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>{speed.up} <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 500 }}>Mbps</span></div>
               </div>
               <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.85rem 1rem', background: '#ffffff', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Core Latency</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>{speed.ping} <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 500 }}>ms</span></div>
               </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem', background: 'var(--customer-primary)' }}
              onClick={runSpeedTest}
              disabled={speedTestActive}
            >
               {speedTestActive ? 'Running Diagnostics...' : 'Verify Local Connection Latency'}
            </button>
         </div>

         {/* Package Summary & Bill */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Service package */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                     <div style={{ background: '#ecfdf5', color: '#10b981', padding: '0.5rem', borderRadius: '8px' }}><Wifi size={20} /></div>
                     <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Active Package</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'capitalize', color: 'var(--text-dark)', marginTop: '0.15rem' }}>
                          {customer ? `${customer.packageId} Plan` : 'Standard Fiber'}
                        </div>
                     </div>
                  </div>
                  <Link to="/customer-portal/package" style={{ color: 'var(--customer-primary)', background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '0.25rem', borderRadius: '5px' }}>
                     <ChevronRight size={18} />
                  </Link>
               </div>
               
               <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.75rem', color: 'var(--text-light)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Price: <strong>{customer ? customer.bill : 'PKR 2,200'}/mo</strong></span>
                  <span>Uptime Guarantee: <strong>99.9%</strong></span>
               </div>
            </div>

            {/* Invoicing summary */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                     <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.5rem', borderRadius: '8px' }}><CreditCard size={20} /></div>
                     <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Invoice Status</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: latestInvoice?.status === 'Paid' ? '#10b981' : '#ef4444', marginTop: '0.15rem' }}>
                          {latestInvoice ? `${latestInvoice.status} (${latestInvoice.amount})` : 'Clear / Paid'}
                        </div>
                     </div>
                  </div>
                  <Link to="/customer-portal/bills" style={{ color: 'var(--customer-primary)', background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '0.25rem', borderRadius: '5px' }}>
                     <ChevronRight size={18} />
                  </Link>
               </div>

               <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.75rem', color: 'var(--text-light)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Stored Visa Ending in **4242</span>
                  <span className={`badge ${latestInvoice?.status === 'Paid' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem !important' }}>
                     {latestInvoice?.status || 'Paid'}
                  </span>
               </div>
            </div>

            {/* Instant AI support trigger card */}
            <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #115e59 0%, #0f766e 100%) !important', color: 'white', border: 'none !important', boxShadow: '0 10px 20px rgba(15, 118, 110, 0.15)' }}>
               <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}><Cpu size={20} /></div>
                  <div>
                     <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Chat with NetFlow AI</div>
                     <div style={{ fontSize: '0.7rem', color: '#ccfbf1' }}>Instant support & automated ticketing.</div>
                  </div>
               </div>
               <Link to="/customer-portal/chat" style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Open Chat <ArrowUpRight size={14} />
               </Link>
            </div>
         </div>
      </div>

      {/* Announcements */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
         <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--customer-primary)" /> Network Announcements
         </h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ borderLeft: '4px solid #3b82f6', padding: '0.75rem 1.25rem', background: '#eff6ff', borderRadius: '0 8px 8px 0', border: '1px solid #dbeafe', borderLeftWidth: '4px' }}>
               <div style={{ fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} /> Scheduled Core GPON Gateway Maintenance
               </div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Scheduled for: June 12th | 02:00 AM to 04:00 AM (DHA Splitter Cabinet upgrades)</div>
            </div>
            
            <div style={{ borderLeft: '4px solid #10b981', padding: '0.75rem 1.25rem', background: '#ecfdf5', borderRadius: '0 8px 8px 0', border: '1px solid #a7f3d0', borderLeftWidth: '4px' }}>
               <div style={{ fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} /> Splice Nodes Optimized in Sector B & C
               </div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Uptime parameters increased by 8.4% and ping response reduced by 4ms following fiber splice updates.</div>
            </div>
         </div>
      </div>

    </div>
  );
}
