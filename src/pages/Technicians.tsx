import { useState, useEffect } from 'react';
import { Search, Plus, Star, MapPin, Phone, Award, ShieldAlert, Eye, Trash2, X, Save, RefreshCw } from 'lucide-react';
import { getTechnicians, addTechnician, deleteTechnician } from '../services/db';
import type { Technician } from '../services/db';

export default function Technicians() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newArea, setNewArea] = useState('DHA Phase 4');

  const fetchTechs = async () => {
    try {
      const data = await getTechnicians();
      setTechs(data);
      if (data.length > 0) {
        setSelectedTech(data[0]);
      } else {
        setSelectedTech(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const handleAddTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newEmail) return;
    try {
      await addTechnician({
        name: newName,
        phone: newPhone,
        email: newEmail,
        area: newArea,
        status: 'Available',
        rating: 5.0,
        jobsCompleted: 0,
        activeJob: 'None',
        password: newPassword
      });
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewPassword('');
      setAddModalOpen(false);
      fetchTechs();
      alert('Technician added successfully!');
    } catch (err) {
      alert('Failed to add technician.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this technician?")) {
      try {
        await deleteTechnician(id);
        fetchTechs();
      } catch (err) {
        alert('Failed to delete technician.');
      }
    }
  };

  const filteredTechs = techs.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      
      {/* Main List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Technical Operations</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Field Technicians</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Search by name or area" 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn" style={{ background: '#0d9488', color: 'white' }} onClick={() => setAddModalOpen(true)}><Plus size={16} /> Add Technician</button>
            <button className="btn btn-outline" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} onClick={fetchTechs}>
               <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Total Staff</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{techs.length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Available</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{techs.filter(t => t.status === 'Available').length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Active / Busy</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{techs.filter(t => t.status === 'Busy').length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Average Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
               <Star size={18} fill="#f59e0b" /> 4.7
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-dark)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Technician</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Contact Number</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Assigned Area</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Rating</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Jobs Done</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading dispatchers...</td>
                </tr>
              ) : filteredTechs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No technicians registered.</td>
                </tr>
              ) : (
                filteredTechs.map((tech) => (
                  <tr 
                    key={tech.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: selectedTech?.id === tech.id ? '#f1f5f9' : 'transparent' }} 
                    onClick={() => setSelectedTech(tech)}
                  >
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0f766e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tech.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{tech.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{tech.phone}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> {tech.area}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" /> {tech.rating}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{tech.jobsCompleted}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${tech.status === 'Available' ? 'badge-success' : 'badge-danger'}`} style={{ border: `1px solid ${tech.status === 'Available' ? '#86efac' : '#fca5a5'}`, background: 'transparent' }}>
                        {tech.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-light)' }}>
                        <Eye size={18} style={{ cursor: 'pointer' }} onClick={() => setSelectedTech(tech)} />
                        <Trash2 size={18} style={{ cursor: 'pointer' }} onClick={() => handleDelete(tech.id!)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel Inspector */}
      {selectedTech && (
        <div className="glass-panel" style={{ width: '320px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Operator Profile</h3>
            <X size={20} style={{ cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => setSelectedTech(null)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
             <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0f766e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }}>
               {selectedTech.name.split(' ').map((n: string) => n[0]).join('')}
             </div>
             <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{selectedTech.name}</h4>
             <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
               <Phone size={12} /> {selectedTech.phone}
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-light)' }}>Current Area:</span>
               <strong>{selectedTech.area}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-light)' }}>Email:</span>
               <strong>{selectedTech.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-light)' }}>Status:</span>
               <span className={`badge ${selectedTech.status === 'Available' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                 {selectedTech.status}
               </span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
             <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <Award size={16} color="#f59e0b" /> Operations Performance
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
               <span>Jobs Completed:</span> <strong>{selectedTech.jobsCompleted}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
               <span>Customer Rating:</span> <strong>{selectedTech.rating} / 5.0</strong>
             </div>
          </div>

          <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '2rem' }}>
             <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center', color: '#dc2626' }}>
                <ShieldAlert size={16} /> Current Active Assignment
             </div>
             <div style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 500 }}>
                {selectedTech.activeJob}
             </div>
          </div>
        </div>
      )}

      {/* Add Technician Modal */}
      {addModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Add Field Operator</h3>
               <X size={20} style={{ cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => setAddModalOpen(false)} />
            </div>

            <form onSubmit={handleAddTech} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Asif Raza" required />
               </div>
               <div>
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="e.g. 0300-1234567" required />
               </div>
               <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="e.g. asif@netflow.com" required />
               </div>
               <div>
                  <label className="form-label">Account Password</label>
                  <input type="text" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Set login password" required />
               </div>
               <div>
                  <label className="form-label">Assigned Sector Area</label>
                  <select className="form-control" value={newArea} onChange={(e) => setNewArea(e.target.value)}>
                     <option value="DHA Phase 4">DHA Phase 4</option>
                     <option value="Gulberg III">Gulberg III</option>
                     <option value="Johar Town">Johar Town</option>
                     <option value="Bahria Town">Bahria Town</option>
                  </select>
               </div>

               <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#0d9488', display: 'flex', gap: '0.25rem', justifyContent: 'center', alignItems: 'center' }}><Save size={16} /> Save operator</button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
