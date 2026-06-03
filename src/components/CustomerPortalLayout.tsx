import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Package, Receipt, Edit3, MessageSquare, LogOut, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCustomers } from '../services/db';

const navItems = [
  { name: 'Home', path: '/customer-portal', icon: Home, exact: true },
  { name: 'My Package', path: '/customer-portal/package', icon: Package },
  { name: 'Bills', path: '/customer-portal/bills', icon: Receipt },
  { name: 'Submit Complaint', path: '/customer-portal/complaint', icon: Edit3 },
  { name: 'Chat Support', path: '/customer-portal/chat', icon: MessageSquare },
  { name: 'Logout', path: '/login', icon: LogOut },
];

export default function CustomerPortalLayout() {
  const location = useLocation();
  const [customerName, setCustomerName] = useState(() => sessionStorage.getItem('userName') || '');

  useEffect(() => {
    if (!customerName) {
      const email = sessionStorage.getItem('userEmail');
      if (email) {
        getCustomers().then(customers => {
          const match = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
          if (match) {
            setCustomerName(match.fullName);
            sessionStorage.setItem('userName', match.fullName);
          } else {
            setCustomerName('Customer');
          }
        }).catch(err => {
          console.error(err);
          setCustomerName('Customer');
        });
      } else {
        setCustomerName('Customer');
      }
    }
  }, [customerName]);

  const getInitials = (name: string) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = customerName || 'Customer';
  const initials = getInitials(displayName);

  return (
    <div className="app-container app-container-customer">
      {/* Top Navbar */}
      <header className="header-customer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             MyISP
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>Customer Portal</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 500 }}>{displayName}</span>
            <div className="avatar-initials">
               {initials}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside className="sidebar sidebar-customer">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              
              if (item.name === 'Logout') {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      sessionStorage.clear();
                      window.location.href = '/login';
                    }}
                    className="nav-link-customer logout-btn"
                  >
                    <Icon size={18} />
                    {item.name}
                  </button>
                );
              }
              
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`nav-link-customer ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
