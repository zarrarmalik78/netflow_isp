import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Trash2, X, Save } from 'lucide-react';
import { getCustomers, deleteCustomer, updateCustomer } from '../services/db';
import type { Customer } from '../services/db';

export default function CustomerManagement() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
      if (data.length > 0) {
        setSelectedCustomer(data[0]);
      } else {
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert("Failed to delete customer.");
      }
    }
  };

  const openEditModal = (cust: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCust({ ...cust });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCust || !editingCust.id) return;
    try {
      await updateCustomer(editingCust.id, {
        fullName: editingCust.fullName,
        phone: editingCust.phone,
        email: editingCust.email,
        cnic: editingCust.cnic,
        area: editingCust.area,
        status: editingCust.status,
        bill: editingCust.bill,
      });
      setEditModalOpen(false);
      setEditingCust(null);
      fetchCustomers();
    } catch (err) {
      alert("Failed to update customer details.");
    }
  };

  // Filtered List
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.cnic.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'All' ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      
      {/* Main List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Internet Service Provider</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Customers</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Search name, phone, CNIC" 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 0.75rem' }}>
              <Filter size={16} color="var(--text-light)" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.875rem', padding: '0.5rem 0', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>

            <button className="btn" style={{ background: '#0d9488', color: 'white' }} onClick={() => navigate('/customers/add')}><Plus size={16} /> Add Customer</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', fontSize: '1.25rem' }}>Total: {customers.length}</div>
          <div className="glass-panel" style={{ padding: '1.5rem', fontSize: '1.25rem' }}>Active: {customers.filter(c => c.status === 'Active').length}</div>
          <div className="glass-panel" style={{ padding: '1.5rem', fontSize: '1.25rem' }}>Inactive: {customers.filter(c => c.status === 'Inactive').length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-dark)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>#</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Customer Name</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>CNIC</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Phone</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Area</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Package</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Monthly Bill</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading customers data...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No customers found matching search/filter.</td>
                </tr>
              ) : (
                filteredCustomers.map((c, i) => {
                  const initial = c.fullName ? c.fullName.split(' ').map(x => x[0]).join('').substring(0,2).toUpperCase() : 'CU';
                  const color = c.status === 'Active' ? '#14b8a6' : '#64748b';
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: selectedCustomer?.id === c.id ? '#f1f5f9' : 'transparent' }} onClick={() => setSelectedCustomer(c)}>
                      <td style={{ padding: '1rem' }}>{i + 1}</td>
                      <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>{initial}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{c.email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{c.cnic}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{c.phone}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{c.area}</td>
                      <td style={{ padding: '1rem' }}><span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' }}>{c.packageId}</span></td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ border: `1px solid ${c.status === 'Active' ? '#86efac' : '#fca5a5'}`, background: 'transparent' }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{c.bill}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-light)' }}>
                          <Eye size={18} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)} />
                          <Edit size={18} style={{ cursor: 'pointer' }} onClick={(e) => openEditModal(c, e)} />
                          <Trash2 size={18} style={{ cursor: 'pointer' }} onClick={(e) => handleDelete(c.id!, e)} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel Inspector */}
      {selectedCustomer && (
        <div className="glass-panel" style={{ width: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Customer Profile</h3>
            <X size={20} style={{ cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => setSelectedCustomer(null)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
             <div style={{ width: 80, height: 80, borderRadius: '50%', background: selectedCustomer.status === 'Active' ? '#14b8a6' : '#64748b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }}>
               {selectedCustomer.fullName.split(' ').map(x => x[0]).join('').substring(0,2).toUpperCase()}
             </div>
             <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{selectedCustomer.fullName}</h4>
             <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{selectedCustomer.email}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '2rem' }}>
            <div><strong>CNIC:</strong> {selectedCustomer.cnic}</div>
            <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
            <div><strong>Area:</strong> {selectedCustomer.area}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Package Details</div>
            <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' }}>{selectedCustomer.packageId}</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
             <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem' }}>Payment history (last 3 months)</div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
               <span>Status</span> <span className="badge badge-success" style={{ background: 'transparent', border: '1px solid #86efac' }}>Paid</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>Last 3 months</span> <span className="badge badge-success" style={{ background: 'transparent', border: '1px solid #86efac' }}>Paid</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Last 3 months</span> <span className="badge badge-success" style={{ background: 'transparent', border: '1px solid #86efac' }}>Paid</span>
             </div>
          </div>

          <button className="btn" style={{ background: '#0d9488', color: 'white', width: '100%', marginTop: 'auto' }} onClick={(e) => openEditModal(selectedCustomer, e)}>
            Edit Details
          </button>
        </div>
      )}

      {/* Edit Customer Dialog Modal */}
      {editModalOpen && editingCust && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Edit Customer Profile</h3>
               <X size={20} style={{ cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => setEditModalOpen(false)} />
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={editingCust.fullName} onChange={(e) => setEditingCust({ ...editingCust, fullName: e.target.value })} required />
               </div>
               <div>
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" value={editingCust.phone} onChange={(e) => setEditingCust({ ...editingCust, phone: e.target.value })} required />
               </div>
               <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={editingCust.email} onChange={(e) => setEditingCust({ ...editingCust, email: e.target.value })} required />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div>
                    <label className="form-label">CNIC Number</label>
                    <input type="text" className="form-control" value={editingCust.cnic} onChange={(e) => setEditingCust({ ...editingCust, cnic: e.target.value })} required />
                 </div>
                 <div>
                    <label className="form-label">Area Sector</label>
                    <input type="text" className="form-control" value={editingCust.area} onChange={(e) => setEditingCust({ ...editingCust, area: e.target.value })} required />
                 </div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div>
                    <label className="form-label">Monthly Bill (PKR)</label>
                    <input type="text" className="form-control" value={editingCust.bill} onChange={(e) => setEditingCust({ ...editingCust, bill: e.target.value })} required />
                 </div>
                 <div>
                    <label className="form-label">Operational Status</label>
                    <select className="form-control" value={editingCust.status} onChange={(e) => setEditingCust({ ...editingCust, status: e.target.value as any })}>
                       <option value="Active">Active</option>
                       <option value="Inactive">Inactive</option>
                    </select>
                 </div>
               </div>

               <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#0d9488', display: 'flex', gap: '0.25rem', justifyContent: 'center', alignItems: 'center' }}><Save size={16} /> Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
