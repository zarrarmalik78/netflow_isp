import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowRight, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { addCustomer } from '../services/db';
import type { Customer } from '../services/db';

const steps = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Address' },
  { id: 3, title: 'Package' },
  { id: 4, title: 'Confirm' },
];

export default function AddCustomer() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Consolidated Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    fatherName: '',
    cnic: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'Male',
    photo: null as string | null,
    password: '',
    // Step 2: Address
    houseNo: '',
    street: '',
    area: 'DHA Phase 4',
    city: 'Lahore',
    zipCode: '',
    coordinates: '',
    // Step 3: Package
    packageId: 'standard', // basic | standard | premium
    installationPaid: 'Yes', // Yes | No
    billingStart: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        const newCustomer: Customer = {
          fullName: formData.fullName,
          fatherName: formData.fatherName,
          cnic: formData.cnic,
          phone: formData.phone,
          email: formData.email || 'no-email@netflow.com',
          dob: formData.dob,
          gender: formData.gender,
          photo: formData.photo,
          houseNo: formData.houseNo,
          street: formData.street,
          area: formData.area,
          city: formData.city,
          zipCode: formData.zipCode,
          coordinates: formData.coordinates,
          packageId: formData.packageId,
          status: 'Active',
          bill: formData.packageId === 'basic' ? '1,200 PKR' : formData.packageId === 'standard' ? '2,200 PKR' : '3,800 PKR',
          password: formData.password
        };

        await addCustomer(newCustomer);
        alert('Customer Registered Successfully!');
        navigate('/customers');
      } catch (err) {
        console.error(err);
        alert('Failed to register customer: ' + err);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/customers');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0 3rem 0' }}>
      
      {/* Progress Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '12px', left: '10%', right: `calc(100% - 10% - ${(currentStep - 1) * 26.6}%)`, height: '2px', background: '#0d9488', zIndex: 0, transition: 'right 0.3s' }}></div>
        
        {steps.map((step) => (
          <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
             <div style={{ fontSize: '0.8rem', fontWeight: 600, color: currentStep >= step.id ? '#0d9488' : 'var(--text-light)', marginBottom: '0.25rem' }}>Step {step.id}:</div>
             <div style={{ fontSize: '0.85rem', fontWeight: currentStep === step.id ? 700 : 500, color: currentStep >= step.id ? 'var(--text-dark)' : 'var(--text-light)', marginBottom: '0.5rem' }}>{step.title}</div>
             <div style={{ width: 14, height: 14, borderRadius: '50%', border: currentStep >= step.id ? '2px solid #0d9488' : '2px solid var(--border-color)', background: currentStep >= step.id ? (currentStep === step.id ? 'white' : '#0d9488') : 'white', transition: 'background-color 0.3s' }}></div>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'white' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Add New Customer — Step {currentStep} of 4: {steps.find(s => s.id === currentStep)?.title}</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0d9488' }}>{Math.round(((currentStep - 1) / 3) * 100)}% Complete</span>
        </h2>

        {/* STEP 1: Personal Info */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="form-label">Father Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="e.g. Richard Doe" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <label className="form-label">CNIC</label>
                <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="XXXXX-XXXXXXX-X" className="form-control" style={{ background: '#f8fafc' }} />
                <div style={{ position: 'absolute', right: '0', top: '-25px', background: '#f1f5f9', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', color: 'var(--text-light)' }}>
                  Auto-formatting dashes
                </div>
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select className="form-control" style={{ width: '85px', background: '#f8fafc' }}>
                    <option>🇵🇰 +92</option>
                  </select>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" style={{ flex: 1, background: '#f8fafc' }} placeholder="3001234567" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Email Address <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(Optional)</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="john.doe@example.com" />
              </div>
              <div>
                <label className="form-label">Account Password</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="Set login password" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" style={{ background: '#f8fafc', color: 'var(--text-dark)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Gender</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Male', 'Female'].map(g => (
                    <label key={g} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: formData.gender === g ? '2px solid #0d9488' : '1px solid var(--border-color)', borderRadius: '6px', background: formData.gender === g ? '#f0fdf4' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input type="radio" name="gender" checked={formData.gender === g} onChange={() => setFormData(p => ({ ...p, gender: g }))} style={{ accentColor: '#0d9488' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: formData.gender === g ? 600 : 400 }}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Profile Photo Upload</label>
                <label style={{ display: 'block', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  {formData.photo ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <img src={formData.photo} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.875rem', color: '#0d9488', fontWeight: 600 }}>Photo Selected</span>
                    </div>
                  ) : (
                    <>
                      <Camera size={24} color="var(--text-light)" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)' }}>Click or drag to upload photo</div>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Address Info */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">House / Apartment No</label>
                <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="e.g. House 45-B" />
              </div>
              <div>
                <label className="form-label">Street / Lane</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="e.g. Street 7" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Area / Sector</label>
                <select name="area" value={formData.area} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }}>
                  <option value="DHA Phase 4">DHA Phase 4</option>
                  <option value="Gulberg III">Gulberg III</option>
                  <option value="Bahria Town">Bahria Town</option>
                  <option value="Johar Town">Johar Town</option>
                </select>
              </div>
              <div>
                <label className="form-label">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} disabled />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Postal / Zip Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="e.g. 54000" />
              </div>
              <div>
                <label className="form-label">GPS Coordinates <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(Optional)</span></label>
                <input type="text" name="coordinates" value={formData.coordinates} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} placeholder="31.4826, 74.3702" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Package selection */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600 }}>Select Internet Package</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {[
                { id: 'basic', name: 'Basic', speed: '10 Mbps', price: 'PKR 1,200/mo' },
                { id: 'standard', name: 'Standard', speed: '25 Mbps', price: 'PKR 2,200/mo' },
                { id: 'premium', name: 'Premium', speed: '50 Mbps', price: 'PKR 3,800/mo' },
              ].map(pkg => (
                <div 
                  key={pkg.id} 
                  onClick={() => setFormData(p => ({ ...p, packageId: pkg.id }))}
                  style={{
                    border: formData.packageId === pkg.id ? '2px solid #0d9488' : '1px solid var(--border-color)',
                    background: formData.packageId === pkg.id ? '#f0fdf4' : '#f8fafc',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{pkg.name}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)', margin: '0.5rem 0' }}>{pkg.speed}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>{pkg.price}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div>
                <label className="form-label">Billing Cycle Start Date</label>
                <input type="date" name="billingStart" value={formData.billingStart} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }} />
              </div>
              <div>
                <label className="form-label">Installation Fee Paid?</label>
                <select name="installationPaid" value={formData.installationPaid} onChange={handleChange} className="form-control" style={{ background: '#f8fafc' }}>
                  <option value="Yes">Yes (Paid)</option>
                  <option value="No">No (Pending)</option>
                  <option value="Free">Waived / Free Promotion</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.5rem' }}>
               <CheckCircle size={40} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
               <h3 style={{ color: '#166534', margin: 0, fontSize: '1.1rem' }}>Please verify the details below before creating customer.</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: '#fafafa' }}>
                <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Personal Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div><strong>Full Name:</strong> {formData.fullName || '—'}</div>
                  <div><strong>Father Name:</strong> {formData.fatherName || '—'}</div>
                  <div><strong>CNIC:</strong> {formData.cnic || '—'}</div>
                  <div><strong>Phone:</strong> +92 {formData.phone || '—'}</div>
                  <div><strong>Email:</strong> {formData.email || '—'}</div>
                  <div><strong>Password:</strong> {formData.password ? '••••••••' : '—'}</div>
                  <div><strong>DOB:</strong> {formData.dob || '—'}</div>
                  <div><strong>Gender:</strong> {formData.gender}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', background: '#fafafa' }}>
                  <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Address Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div>{formData.houseNo && formData.street ? `${formData.houseNo}, ${formData.street}` : '—'}</div>
                    <div>{formData.area}, {formData.city}</div>
                    {formData.zipCode && <div><strong>Zip:</strong> {formData.zipCode}</div>}
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', background: '#fafafa' }}>
                  <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Service Package</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div><strong>Selected Tier:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{formData.packageId}</span></div>
                    <div><strong>Bill Amount:</strong> {formData.packageId === 'basic' ? 'PKR 1,200/mo' : formData.packageId === 'standard' ? 'PKR 2,200/mo' : 'PKR 3,800/mo'}</div>
                    <div><strong>Start Date:</strong> {formData.billingStart || 'Immediately'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn btn-outline" 
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            onClick={handleBack}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentStep < 4 && (
              <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                 <Save size={16} /> Save Draft
              </button>
            )}
            <button 
              className="btn btn-primary" 
              style={{ background: '#0f766e', display: 'flex', gap: '0.5rem', alignItems: 'center' }} 
              onClick={handleNext}
            >
               {currentStep === 4 ? 'Complete Registration' : <>Continue <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
