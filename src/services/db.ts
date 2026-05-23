import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase";

// --- Database Types ---
export interface Customer {
  id?: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  photo?: string | null;
  houseNo: string;
  street: string;
  area: string;
  city: string;
  zipCode: string;
  coordinates?: string;
  packageId: string;
  status: 'Active' | 'Inactive';
  bill: string;
  password?: string;
}

export interface Package {
  id?: string;
  name: string;
  speed: string;
  price: string;
  popular?: boolean;
}

export interface Invoice {
  id?: string;
  invoiceNo: string;
  customerName: string;
  customerId: string;
  period: string;
  issued: string;
  due: string;
  amount: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  method?: string;
}

export interface Ticket {
  id?: string;
  ticketNo: string;
  customerName: string;
  customerId: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  status: 'Submitted' | 'AI Analyzed' | 'Assigned' | 'In Progress' | 'Resolved';
  assignedTechnician?: string;
  createdAt: string;
  notes: Array<{ author: string; text: string; date: string }>;
}

export interface Technician {
  id?: string;
  name: string;
  phone: string;
  area: string;
  status: 'Available' | 'Busy';
  rating: number;
  jobsCompleted: number;
  activeJob: string;
  email: string;
  password?: string;
}

export interface SystemSettings {
  ispName: string;
  supportPhone: string;
  supportEmail: string;
  currency: string;
  taxRate: string;
  lateFee: string;
  billingDay: string;
  aiModel: string;
  apiKey: string;
  autoPrioritize: boolean;
}

// --- Firestore CRUD Collections Helpers ---

// 1. Customers Operations
export async function getCustomers(): Promise<Customer[]> {
  const colRef = collection(db, "customers");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
}

export async function addCustomer(cust: Customer): Promise<string> {
  const colRef = collection(db, "customers");
  const docRef = await addDoc(colRef, cust);
  return docRef.id;
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
  const docRef = doc(db, "customers", id);
  await updateDoc(docRef, updates);
}

export async function deleteCustomer(id: string): Promise<void> {
  const docRef = doc(db, "customers", id);
  await deleteDoc(docRef);
}

// 2. Packages Operations
export async function getPackages(): Promise<Package[]> {
  const colRef = collection(db, "packages");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
}

export async function addPackage(pkg: Package): Promise<string> {
  const colRef = collection(db, "packages");
  const docRef = await addDoc(colRef, pkg);
  return docRef.id;
}

export async function deletePackage(id: string): Promise<void> {
  const docRef = doc(db, "packages", id);
  await deleteDoc(docRef);
}

// 3. Invoices Operations
export async function getInvoices(): Promise<Invoice[]> {
  const colRef = collection(db, "invoices");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
}

export async function addInvoice(inv: Invoice): Promise<string> {
  const colRef = collection(db, "invoices");
  const docRef = await addDoc(colRef, inv);
  return docRef.id;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
  const docRef = doc(db, "invoices", id);
  await updateDoc(docRef, updates);
}

// 4. Tickets Operations
export async function getTickets(): Promise<Ticket[]> {
  const colRef = collection(db, "tickets");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
}

export async function addTicket(ticket: Ticket): Promise<string> {
  const colRef = collection(db, "tickets");
  const docRef = await addDoc(colRef, ticket);
  return docRef.id;
}

export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<void> {
  const docRef = doc(db, "tickets", id);
  await updateDoc(docRef, updates);
}

// 5. Technicians Operations
export async function getTechnicians(): Promise<Technician[]> {
  const colRef = collection(db, "technicians");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Technician));
}

export async function addTechnician(tech: Technician): Promise<string> {
  const colRef = collection(db, "technicians");
  const docRef = await addDoc(colRef, tech);
  return docRef.id;
}

export async function deleteTechnician(id: string): Promise<void> {
  const docRef = doc(db, "technicians", id);
  await deleteDoc(docRef);
}

export async function updateTechnician(id: string, updates: Partial<Technician>): Promise<void> {
  const docRef = doc(db, "technicians", id);
  await updateDoc(docRef, updates);
}

// 6. Settings Operations
const SETTINGS_DOC_ID = "main_config";
export async function getSystemSettings(): Promise<SystemSettings> {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as SystemSettings;
  }
  
  // Default Settings
  const defaults: SystemSettings = {
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
  };
  await setDoc(docRef, defaults);
  return defaults;
}

export async function updateSystemSettings(updates: SystemSettings): Promise<void> {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  await setDoc(docRef, updates);
}

// --- Seeding Script ---
export async function seedDatabase(): Promise<void> {
  // Check if customers already exist
  const custSnap = await getDocs(collection(db, "customers"));
  if (!custSnap.empty) {
    console.log("Database already seeded. Checking/migrating missing password fields...");
    // Auto-migrate any customers missing password fields
    for (const docSnap of custSnap.docs) {
      const data = docSnap.data();
      if (!data.password) {
        console.log(`Migrating customer ${docSnap.id} with default password.`);
        await updateDoc(docSnap.ref, { password: 'password123' });
      }
    }
    
    // Also check technicians
    const techRef = collection(db, "technicians");
    const techSnap = await getDocs(techRef);
    for (const docSnap of techSnap.docs) {
      const data = docSnap.data();
      if (!data.password) {
        console.log(`Migrating technician ${docSnap.id} with default password.`);
        await updateDoc(docSnap.ref, { password: 'password123' });
      }
    }
    return;
  }

  console.log("Seeding default data to Firestore...");

  // 1. Seed Packages
  const defaultPkgs: Package[] = [
    { name: 'Basic', speed: '10 Mbps', price: '1,200 PKR', popular: false },
    { name: 'Standard', speed: '25 Mbps', price: '2,200 PKR', popular: true },
    { name: 'Premium', speed: '50 Mbps', price: '3,800 PKR', popular: false },
  ];
  for (const pkg of defaultPkgs) {
    await addPackage(pkg);
  }

  // 2. Seed Customers
  const defaultCusts: Customer[] = [
    { fullName: 'John Name', fatherName: 'Richard Name', cnic: '35202-XXXXXXX-X', phone: '3001234567', email: 'sohance@gmail.com', dob: '1995-05-15', gender: 'Male', houseNo: 'H-21', street: 'Street 4', area: 'DHA Phase 4', city: 'Lahore', zipCode: '54000', packageId: 'standard', status: 'Active', bill: '2,200 PKR', password: 'password123' },
    { fullName: 'Nanil Name', fatherName: 'Ahmad Name', cnic: '35202-XXXXXXX-X', phone: '3019876543', email: 'miltrath@gmail.com', dob: '1998-10-20', gender: 'Male', houseNo: 'H-45', street: 'Street 12', area: 'Gulberg III', city: 'Lahore', zipCode: '54000', packageId: 'standard', status: 'Active', bill: '2,200 PKR', password: 'password123' },
    { fullName: 'Soran Name', fatherName: 'Babar Name', cnic: '35202-XXXXXXX-X', phone: '3213353733', email: 'package@gmail.com', dob: '1992-03-08', gender: 'Female', houseNo: 'Flat 3', street: 'Main Boulevard', area: 'Johar Town', city: 'Lahore', zipCode: '54000', packageId: 'basic', status: 'Inactive', bill: '1,200 PKR', password: 'password123' },
  ];
  const seededCustIds: string[] = [];
  for (const c of defaultCusts) {
    const id = await addCustomer(c);
    seededCustIds.push(id);
  }

  // 3. Seed Technicians
  const defaultTechs: Technician[] = [
    { name: 'Sajid Khan', phone: '0321-4567890', area: 'DHA Phase 4', status: 'Available', rating: 4.8, jobsCompleted: 142, activeJob: 'None', email: 'sajid@netflow.com', password: 'password123' },
    { name: 'M. Ali', phone: '0300-9876543', area: 'Gulberg III', status: 'Busy', rating: 4.5, jobsCompleted: 98, activeJob: 'Ticket #CMP-0248 (Speed issue)', email: 'ali.m@netflow.com', password: 'password123' },
  ];
  for (const t of defaultTechs) {
    await addTechnician(t);
  }

  // 4. Seed Invoices
  const defaultInvs: Invoice[] = [
    { invoiceNo: 'INV-4920', customerName: 'John Name', customerId: seededCustIds[0] || 'mock_id', period: 'May 01, 2026 - May 31, 2026', issued: 'May 01, 2026', due: 'May 10, 2026', amount: '2,200 PKR', status: 'Paid', method: 'Visa ending in 4242' },
    { invoiceNo: 'INV-4811', customerName: 'Nanil Name', customerId: seededCustIds[1] || 'mock_id', period: 'Apr 01, 2026 - Apr 30, 2026', issued: 'Apr 01, 2026', due: 'Apr 10, 2026', amount: '2,200 PKR', status: 'Unpaid' },
  ];
  for (const inv of defaultInvs) {
    await addInvoice(inv);
  }

  // 5. Seed Tickets
  const defaultTickets: Ticket[] = [
    { ticketNo: 'CMP-0248', customerName: 'Nanil Name', customerId: seededCustIds[1] || 'mock_id', description: 'My internet is very slow since morning', category: 'Speed Issue', priority: 'Medium', status: 'Assigned', assignedTechnician: 'M. Ali', createdAt: '2026-05-20T10:00:00Z', notes: [{ author: 'System', text: 'Ticket automatically generated by Chatbot.', date: 'May 20, 2026' }] }
  ];
  for (const tick of defaultTickets) {
    await addTicket(tick);
  }

  console.log("Seeding complete!");
}
