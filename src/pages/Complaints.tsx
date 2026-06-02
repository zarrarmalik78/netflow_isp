import { useState, useEffect } from 'react';
import { Lightbulb, Send, User, Check, RefreshCw, Sparkles } from 'lucide-react';
import { getTickets, updateTicket, getTechnicians, getCustomers } from '../services/db';
import type { Ticket, Technician, Customer } from '../services/db';

const analyzeSentiment = (text: string) => {
  if (!text) return { score: 'Neutral', icon: '😐', color: '#4b5563', bg: '#f3f4f6', details: 'No text content available.' };
  const textLower = text.toLowerCase();
  
  const angryWords = ['angry', 'worst', 'terrible', 'useless', 'garbage', 'trash', 'horrible', 'hate', 'unacceptable', 'disaster', 'scam', 'fraud', 'ridiculous', 'nonsense', 'disconnecting', 'slow', 'pathetic', 'stuck', 'failed', 'failing', 'broken', 'outage', 'unpaid', 'refund', 'cancel', 'legal', 'court', 'helpline', 'awful', 'frustrated'];
  const patientWords = ['please', 'thank you', 'thanks', 'kindly', 'help', 'appreciate', 'wondering', 'inquiry', 'request', 'could you', 'would love', 'grateful'];

  let angryCount = 0;
  let patientCount = 0;

  angryWords.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'g');
    const matches = textLower.match(regex);
    if (matches) angryCount += matches.length;
  });

  patientWords.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'g');
    const matches = textLower.match(regex);
    if (matches) patientCount += matches.length;
  });

  if (angryCount >= 3 || (textLower.includes('!') && angryCount >= 1)) {
    return { score: 'Highly Frustrated', icon: '😡', color: '#dc2626', bg: '#fef2f2', details: 'Severe negative words detected. Critical priority escalation recommended.' };
  } else if (angryCount >= 1) {
    return { score: 'Angry', icon: '😠', color: '#ea580c', bg: '#fff7ed', details: 'Moderate distress signals found.' };
  } else if (patientCount >= 2) {
    return { score: 'Patient', icon: '😇', color: '#16a34a', bg: '#f0fdf4', details: 'Polite / patient language indicators.' };
  } else {
    return { score: 'Neutral', icon: '😐', color: '#4b5563', bg: '#f3f4f6', details: 'Standard objective tone.' };
  }
};

export default function Complaints() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [techs, setTechs] = useState<Technician[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'All' | 'Urgent' | 'Open' | 'In Progress' | 'Resolved'>('All');
  
  // Assign state
  const [selectedTechName, setSelectedTechName] = useState('');
  
  // Note state
  const [noteText, setNoteText] = useState('');

  const fetchData = async () => {
    try {
      const ticketData = await getTickets();
      const techData = await getTechnicians();
      const customerData = await getCustomers();
      setTickets(ticketData);
      setTechs(techData);
      setCustomers(customerData);

      // Re-assign selected ticket if it changed
      if (ticketData.length > 0) {
        if (selectedTicket) {
          const fresh = ticketData.find(t => t.id === selectedTicket.id);
          setSelectedTicket(fresh || ticketData[0]);
        } else {
          setSelectedTicket(ticketData[0]);
        }
      } else {
        setSelectedTicket(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedTicket || !selectedTicket.id || !selectedTechName) return;
    try {
      await updateTicket(selectedTicket.id, {
        assignedTechnician: selectedTechName,
        status: 'Assigned'
      });
      setSelectedTechName('');
      fetchData();
      alert(`Ticket assigned to ${selectedTechName}!`);
    } catch (err) {
      alert("Failed to assign technician.");
    }
  };

  const handleStatusUpdate = async (status: Ticket['status']) => {
    if (!selectedTicket || !selectedTicket.id) return;
    try {
      await updateTicket(selectedTicket.id, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update ticket status.");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !selectedTicket.id || !noteText) return;
    try {
      const currentNotes = selectedTicket.notes || [];
      const updatedNotes = [
        ...currentNotes,
        {
          author: 'Admin Dispatcher',
          text: noteText,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      ];

      await updateTicket(selectedTicket.id, { notes: updatedNotes });
      setNoteText('');
      fetchData();
    } catch (err) {
      alert("Failed to add note.");
    }
  };

  const getRecommendedTechs = (ticket: Ticket) => {
    if (!ticket) return [];
    const cust = customers.find(c => c.id === ticket.customerId || c.fullName === ticket.customerName);
    const customerArea = cust ? cust.area : '';

    return techs.map(t => {
      let score = 50;
      const areaMatch = customerArea && t.area.toLowerCase() === customerArea.toLowerCase();
      if (areaMatch) score += 25;
      
      if (t.status === 'Available') score += 15;
      
      score += Math.round((t.rating - 3.5) * 20); // (4.8 - 3.5) * 20 = 26 points
      
      // Category skill match
      const cat = (ticket.category || '').toLowerCase();
      let skillReason = 'General fiber technician';
      if (cat.includes('speed') || cat.includes('performance') || cat.includes('slow')) {
        if (t.name === 'M. Ali' || t.rating > 4.6) {
          score += 10;
          skillReason = 'Speed optimization expert';
        }
      } else if (cat.includes('router') || cat.includes('hardware') || cat.includes('ont') || cat.includes('wifi')) {
        if (t.name === 'Sajid Khan' || t.jobsCompleted > 100) {
          score += 10;
          skillReason = 'ONT Router hardware specialist';
        }
      }
      
      score = Math.min(99, Math.max(40, score));

      // Build reasoning string
      let reason = '';
      if (areaMatch && t.status === 'Available') {
        reason = `Local in ${t.area} & Available. ${skillReason}.`;
      } else if (areaMatch) {
        reason = `Located in customer's area (${t.area}).`;
      } else if (t.status === 'Available') {
        reason = `Available for dispatch. Highly rated (${t.rating}★).`;
      } else {
        reason = `High resolution history in ${t.area}. Rating: ${t.rating}★.`;
      }

      return {
        ...t,
        score,
        reason
      };
    }).sort((a, b) => b.score - a.score);
  };

  // Filtering
  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Urgent') return t.priority === 'Urgent';
    if (activeTab === 'Open') return t.status === 'Submitted' || t.status === 'AI Analyzed' || t.status === 'Assigned';
    if (activeTab === 'In Progress') return t.status === 'In Progress';
    if (activeTab === 'Resolved') return t.status === 'Resolved';
    return true;
  });

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      
      {/* List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            Complaints Queue <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({tickets.filter(t => t.status !== 'Resolved').length} open)</span>
          </h1>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} onClick={fetchData}>
             <RefreshCw size={16} /> Refresh
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.5rem', fontSize: '0.875rem' }}>
          {(['All', 'Urgent', 'Open', 'In Progress', 'Resolved'] as const).map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                fontWeight: activeTab === tab ? 600 : 400, 
                borderBottom: activeTab === tab ? '2px solid var(--text-dark)' : 'none', 
                paddingBottom: '0.5rem', 
                marginBottom: '-0.6rem',
                cursor: 'pointer',
                color: tab === 'Urgent' ? 'var(--danger)' : activeTab === tab ? 'var(--text-dark)' : 'var(--text-light)'
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Complaints Listing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No tickets in this tab collection.</div>
          ) : (
            filteredTickets.map(c => {
              const sentiment = analyzeSentiment(c.description);
              const isEscalated = (sentiment.score === 'Highly Frustrated' || sentiment.score === 'Angry') && c.priority !== 'Urgent';
              const displayPriority = isEscalated ? 'Urgent' : c.priority;
              const priorityColor = displayPriority === 'Urgent' ? 'var(--danger)' : displayPriority === 'Medium' ? '#f59e0b' : '#10b981';

              return (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedTicket(c)}
                  className="glass-panel" 
                  style={{ 
                    padding: '0', 
                    display: 'flex', 
                    cursor: 'pointer',
                    border: selectedTicket?.id === c.id ? '2px solid #0f766e' : '1px solid var(--border-color)',
                    overflow: 'hidden',
                    background: selectedTicket?.id === c.id ? '#f0fdf4' : 'white'
                  }}
                >
                  <div style={{ width: '8px', background: priorityColor }}></div>
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 2 }}>
                       <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                         <User size={20} />
                       </div>
                       <div>
                         <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Ticket #{c.ticketNo}</div>
                         <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.customerName}</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{c.description}</div>
                       </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Priority</div>
                      <span className={`badge ${displayPriority === 'Urgent' ? 'badge-danger' : displayPriority === 'Medium' ? 'badge-warning' : 'badge-success'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        {displayPriority}
                        {isEscalated && (
                          <span style={{ fontSize: '0.55rem', fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '0px 3px', borderRadius: '3px', border: '1px solid #fecaca' }}>
                            AI
                          </span>
                        )}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Category</div>
                      <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-dark)' }}>{c.category}</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', flex: 1, textAlign: 'right' }}>
                      Status: <strong>{c.status}</strong>
                      {c.assignedTechnician && <div style={{ fontSize: '0.65rem', color: '#0d9488', marginTop: '0.25rem' }}>Assigned: {c.assignedTechnician}</div>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Ticket Details Panel */}
      {selectedTicket && (
        <div className="glass-panel" style={{ width: '450px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, marginBottom: '0.25rem' }}>Ticket #{selectedTicket.ticketNo}</h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)' }}>
              Customer: <strong>{selectedTicket.customerName}</strong>
            </div>
          </div>

          {(() => {
            const sentiment = analyzeSentiment(selectedTicket.description);
            const isEscalated = (sentiment.score === 'Highly Frustrated' || sentiment.score === 'Angry') && selectedTicket.priority !== 'Urgent';
            
            return (
              <div style={{ background: sentiment.bg, border: `1px solid ${sentiment.color}`, borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: sentiment.color }}>
                    <Sparkles size={16} color={sentiment.color} /> AI Customer Sentiment Classifier
                  </div>
                  <span style={{ fontSize: '1.25rem' }}>{sentiment.icon}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#1e293b' }}>
                  <span>Classified Emotion:</span>
                  <strong style={{ color: sentiment.color }}>{sentiment.score}</strong>
                </div>

                <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.35 }}>
                  {sentiment.details}
                </div>

                {isEscalated && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', padding: '0.4rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, display: 'flex', gap: '4px', alignItems: 'center', marginTop: '0.25rem' }}>
                    ⚠️ Priority escalated to Urgent display based on customer distress patterns.
                  </div>
                )}
              </div>
            );
          })()}

          <div style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)', borderRadius: '12px', padding: '1.25rem', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
               <Lightbulb size={18} /> AI Diagnostic Recommendation
            </div>
            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div><span style={{ opacity: 0.85 }}>Category:</span> {selectedTicket.category}</div>
              <div><span style={{ opacity: 0.85 }}>Priority:</span> {selectedTicket.priority}</div>
              <div><span style={{ opacity: 0.85 }}>Diagnostic Checklist:</span> Ping gateway IP, verify optical link power dbm values. Suggest ONT restart.</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>Complaint Description:</div>
            "{selectedTicket.description}"
          </div>

          {/* AI Smart Dispatch Matcher */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#166534' }}>
              <Sparkles size={16} /> AI Dispatch Match Recommendations
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {getRecommendedTechs(selectedTicket).slice(0, 2).map(tech => (
                <div key={tech.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid #dcfce7', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{tech.name}</span>
                      <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#15803d', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                        {tech.score}% Match
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                      {tech.reason}
                    </div>
                  </div>
                  <button 
                    className="btn" 
                    style={{ background: '#166534', color: 'white', fontSize: '0.7rem', padding: '0.3rem 0.5rem', borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await updateTicket(selectedTicket.id!, {
                          assignedTechnician: tech.name,
                          status: 'Assigned'
                        });
                        fetchData();
                        alert(`Successfully dispatched ${tech.name} to resolve ticket #${selectedTicket.ticketNo}!`);
                      } catch (err) {
                        alert("Dispatch failed: " + err);
                      }
                    }}
                  >
                    Dispatch
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Technician Assignment */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Manual Technician Override</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select 
                className="form-control" 
                value={selectedTechName} 
                onChange={(e) => setSelectedTechName(e.target.value)}
                style={{ flex: 1, background: 'white' }}
              >
                <option value="">Select a technician...</option>
                {techs.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.area} - {t.status})</option>
                ))}
              </select>
              <button className="btn" style={{ background: '#0f766e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '0.5rem 1rem' }} onClick={handleAssign}>Assign</button>
            </div>
          </div>

          {/* Timeline workflow & Add Note */}
          <div style={{ display: 'flex', gap: '1rem', flex: 1, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
             
             {/* Dynamic Status Switcher */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', width: '150px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Ticket Status</div>
                {(['Submitted', 'AI Analyzed', 'Assigned', 'In Progress', 'Resolved'] as const).map((st) => {
                  const isActive = selectedTicket.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleStatusUpdate(st)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        color: isActive ? '#0f766e' : 'var(--text-light)',
                        fontWeight: isActive ? 700 : 400,
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {isActive ? <Check size={12} color="#0f766e" /> : '○'} {st}
                    </button>
                  );
                })}
             </div>
             
             {/* Notes timeline logs */}
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notes Log</label>
               <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.5rem', background: '#fafafa', maxHeight: '100px', fontSize: '0.75rem' }}>
                  {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
                    selectedTicket.notes.map((n, i) => (
                      <div key={i} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>
                         <span style={{ fontWeight: 600, color: '#0f766e' }}>{n.author}</span> <span style={{ color: 'var(--text-light)', fontSize: '0.65rem' }}>({n.date})</span>: {n.text}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-light)' }}>No notes logs on this ticket.</div>
                  )}
               </div>
               
               <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                 <input 
                   type="text" 
                   className="form-control" 
                   value={noteText}
                   onChange={(e) => setNoteText(e.target.value)}
                   placeholder="Add a new update note..." 
                   style={{ fontSize: '0.8rem', padding: '0.35rem' }} 
                   required
                 />
                 <button type="submit" className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', background: '#0f766e' }}>
                   <Send size={12} />
                 </button>
               </form>
             </div>

          </div>

        </div>
      )}
    </div>
  );
}
