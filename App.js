
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const STORAGE_KEYS = {
  customers: 'sparebill_customers',
  staff: 'sparebill_staff',
  inventory: 'sparebill_inventory',
  invoices: 'sparebill_invoices',
  orders: 'sparebill_orders',
  settings: 'sparebill_settings',
  loggedIn: 'sparebill_loggedIn',
  role: 'sparebill_role',
  customerId: 'sparebill_customerId'
};

const initialData = {
  customers: [
    { id: 1, name: 'Rahul Motors', phone: '9876543210', email: 'rahul@gmail.com', address: 'Mumbai', total: 0, username: 'rahul', password: 'rahul123' },
    { id: 2, name: 'Speed Garage', phone: '9123456780', email: 'speed@gmail.com', address: 'Pune', total: 0, username: 'speed', password: 'speed123' },
    { id: 3, name: 'Premium Auto', phone: '9988776655', email: 'premium@gmail.com', address: 'Delhi', total: 0, username: 'premium', password: 'premium123' },
    { id: 4, name: 'City Service', phone: '9876123450', email: 'city@gmail.com', address: 'Bangalore', total: 0, username: 'city', password: 'city123' },
    { id: 5, name: 'Metro Auto Works', phone: '9822334455', email: 'metro@gmail.com', address: 'Hyderabad', total: 0, username: 'metro', password: 'metro123' },
    { id: 6, name: 'Northside Motors', phone: '9811122233', email: 'northside@gmail.com', address: 'Chennai', total: 0, username: 'north', password: 'north123' }
  ],
  staff: [
    { id: 1, name: 'Amit Sharma', role: 'Manager', phone: '9000011111', email: 'amit@gmail.com' },
    { id: 2, name: 'Neha Verma', role: 'Sales', phone: '9000022222', email: 'neha@gmail.com' },
    { id: 3, name: 'Rohit Iyer', role: 'Cashier', phone: '9000033333', email: 'rohit@gmail.com' },
    { id: 4, name: 'Sara Khan', role: 'Inventory', phone: '9000044444', email: 'sara@gmail.com' }
  ],
  inventory: [
    { id: 1, category: 'Engine Parts', name: 'Piston', brand: 'Bosch', price: 1200, stock: 3, threshold: 5 },
    { id: 2, category: 'Engine Parts', name: 'Piston', brand: 'TVS', price: 1050, stock: 7, threshold: 5 },
    { id: 3, category: 'Brake System', name: 'Brake Pad', brand: 'TVS', price: 800, stock: 15, threshold: 5 },
    { id: 4, category: 'Brake System', name: 'Brake Pad', brand: 'Brembo', price: 950, stock: 4, threshold: 5 },
    { id: 5, category: 'Filters', name: 'Oil Filter', brand: 'Honda', price: 350, stock: 2, threshold: 5 },
    { id: 6, category: 'Electrical', name: 'Alternator', brand: 'Bosch', price: 3500, stock: 8, threshold: 3 },
    { id: 7, category: 'Tires', name: 'MRF Tire', brand: 'MRF', price: 2500, stock: 20, threshold: 5 },
    { id: 8, category: 'Engine Parts', name: 'Gasket', brand: 'TVS', price: 450, stock: 12, threshold: 5 },
    { id: 9, category: 'Suspension', name: 'Shock Absorber', brand: 'Monroe', price: 2200, stock: 6, threshold: 4 },
    { id: 10, category: 'Electrical', name: 'Battery', brand: 'Exide', price: 5200, stock: 5, threshold: 3 },
    { id: 11, category: 'Filters', name: 'Air Filter', brand: 'Bosch', price: 500, stock: 9, threshold: 5 },
    { id: 12, category: 'Engine Parts', name: 'Piston', brand: 'Mahle', price: 1150, stock: 6, threshold: 5 },
    { id: 13, category: 'Engine Parts', name: 'Piston', brand: 'ACL', price: 1100, stock: 8, threshold: 5 },
    { id: 14, category: 'Brake System', name: 'Brake Pad', brand: 'Bosch', price: 880, stock: 10, threshold: 5 },
    { id: 15, category: 'Brake System', name: 'Brake Pad', brand: 'EBC', price: 920, stock: 7, threshold: 5 },
    { id: 16, category: 'Filters', name: 'Oil Filter', brand: 'Bosch', price: 380, stock: 11, threshold: 5 },
    { id: 17, category: 'Filters', name: 'Oil Filter', brand: 'MANN', price: 400, stock: 9, threshold: 5 },
    { id: 18, category: 'Filters', name: 'Oil Filter', brand: 'Fram', price: 360, stock: 13, threshold: 5 },
    { id: 19, category: 'Electrical', name: 'Alternator', brand: 'Denso', price: 3400, stock: 6, threshold: 3 },
    { id: 20, category: 'Electrical', name: 'Alternator', brand: 'Valeo', price: 3600, stock: 5, threshold: 3 },
    { id: 21, category: 'Electrical', name: 'Alternator', brand: 'Lucas', price: 3300, stock: 7, threshold: 3 },
    { id: 22, category: 'Tires', name: 'MRF Tire', brand: 'Michelin', price: 2800, stock: 12, threshold: 5 },
    { id: 23, category: 'Tires', name: 'MRF Tire', brand: 'Bridgestone', price: 2700, stock: 10, threshold: 5 },
    { id: 24, category: 'Tires', name: 'MRF Tire', brand: 'Apollo', price: 2400, stock: 14, threshold: 5 },
    { id: 25, category: 'Engine Parts', name: 'Gasket', brand: 'Victor Reinz', price: 480, stock: 9, threshold: 5 },
    { id: 26, category: 'Engine Parts', name: 'Gasket', brand: 'Fel-Pro', price: 520, stock: 7, threshold: 5 },
    { id: 27, category: 'Engine Parts', name: 'Gasket', brand: 'Ajusa', price: 470, stock: 8, threshold: 5 },
    { id: 28, category: 'Suspension', name: 'Shock Absorber', brand: 'KYB', price: 2300, stock: 5, threshold: 4 },
    { id: 29, category: 'Suspension', name: 'Shock Absorber', brand: 'Gabriel', price: 2100, stock: 7, threshold: 4 },
    { id: 30, category: 'Suspension', name: 'Shock Absorber', brand: 'Bilstein', price: 2600, stock: 4, threshold: 4 },
    { id: 31, category: 'Electrical', name: 'Battery', brand: 'Amaron', price: 5100, stock: 6, threshold: 3 },
    { id: 32, category: 'Electrical', name: 'Battery', brand: 'Bosch', price: 5400, stock: 5, threshold: 3 },
    { id: 33, category: 'Electrical', name: 'Battery', brand: 'Luminous', price: 4800, stock: 8, threshold: 3 },
    { id: 34, category: 'Filters', name: 'Air Filter', brand: 'MANN', price: 520, stock: 10, threshold: 5 },
    { id: 35, category: 'Filters', name: 'Air Filter', brand: 'Fram', price: 480, stock: 12, threshold: 5 },
    { id: 36, category: 'Filters', name: 'Air Filter', brand: 'Mahle', price: 510, stock: 11, threshold: 5 }
  ],
  orders: [],
  invoices: [
    {
      id: 'INV-1001',
      date: '2026-03-10',
      customer: 'Rahul Motors',
      phone: '9876543210',
      customerId: 1,
      customerUsername: 'rahul',
      items: [
        { part: 'Piston', brand: 'Bosch', price: 1200, qty: 1, amount: 1200 },
        { part: 'Oil Filter', brand: 'Honda', price: 350, qty: 2, amount: 700 }
      ],
      subtotal: 1900,
      tax: 95,
      discount: 0,
      total: 1995,
      payment: { method: 'UPI', paid: 1995, balance: 0, status: 'Paid', txnId: 'UPI-123456789', date: '2026-03-10' }
    },
    {
      id: 'INV-1002',
      date: '2026-03-12',
      customer: 'Speed Garage',
      phone: '9123456780',
      customerId: 2,
      customerUsername: 'speed',
      items: [
        { part: 'Brake Pad', brand: 'TVS', price: 800, qty: 2, amount: 1600 }
      ],
      subtotal: 1600,
      tax: 80,
      discount: 0,
      total: 1680,
      payment: { method: 'Cash', paid: 800, balance: 880, status: 'Partial', txnId: '', date: '2026-03-12' }
    }
  ],
  settings: {
    businessName: 'SpareBill Auto Parts',
    gst: 'GSTIN123456',
    phone: '9876543210',
    email: 'sparebill@example.com',
    footer: 'Thank you for your business!'
  }
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [loginMode, setLoginMode] = useState('owner');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [isRegister, setIsRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});

  const currentCustomer = customers.find(c => c.id === currentCustomerId) || null;

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem(STORAGE_KEYS.loggedIn);
    const savedRole = localStorage.getItem(STORAGE_KEYS.role);
    const savedCustomerId = localStorage.getItem(STORAGE_KEYS.customerId);
    if (loggedIn === '1' && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
    if (savedCustomerId) {
      const parsedId = parseInt(savedCustomerId, 10);
      if (!Number.isNaN(parsedId)) setCurrentCustomerId(parsedId);
    }
    loadAllData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.add('authenticated');
    } else {
      document.body.classList.remove('authenticated');
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    setCustomers(loadFromStorage(STORAGE_KEYS.customers, initialData.customers));
    setStaff(loadFromStorage(STORAGE_KEYS.staff, initialData.staff));
    setInventory(loadFromStorage(STORAGE_KEYS.inventory, initialData.inventory));
    setInvoices(loadFromStorage(STORAGE_KEYS.invoices, initialData.invoices));
    setOrders(loadFromStorage(STORAGE_KEYS.orders, initialData.orders));
    setSettings(loadFromStorage(STORAGE_KEYS.settings, initialData.settings));
  };

  const saveAll = useCallback(() => {
    saveToStorage(STORAGE_KEYS.customers, customers);
    saveToStorage(STORAGE_KEYS.staff, staff);
    saveToStorage(STORAGE_KEYS.inventory, inventory);
    saveToStorage(STORAGE_KEYS.invoices, invoices);
    saveToStorage(STORAGE_KEYS.orders, orders);
    saveToStorage(STORAGE_KEYS.settings, settings);
  }, [customers, staff, inventory, invoices, orders, settings]);

  useEffect(() => {
    if (customers.length > 0 || staff.length > 0 || inventory.length > 0) {
      saveAll();
    }
  }, [customers, staff, inventory, invoices, orders, settings, saveAll]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const login = () => {
    const creds = {
      admin: { u: 'admin', p: 'admin' },
      cashier: { u: 'cashier', p: 'cashier' }
    };

    if (loginMode === 'owner' && creds[selectedRole] && loginUsername === creds[selectedRole].u && loginPassword === creds[selectedRole].p) {
      localStorage.setItem(STORAGE_KEYS.loggedIn, '1');
      localStorage.setItem(STORAGE_KEYS.role, selectedRole);
      localStorage.removeItem(STORAGE_KEYS.customerId);
      setCurrentCustomerId(null);
      setIsAuthenticated(true);
      setRole(selectedRole);
      showToast('Login successful', 'success');
    } else if (loginMode === 'customer') {
      const customer = customers.find(c => c.username === loginUsername && c.password === loginPassword);
      if (customer) {
        localStorage.setItem(STORAGE_KEYS.loggedIn, '1');
        localStorage.setItem(STORAGE_KEYS.role, 'customer');
        localStorage.setItem(STORAGE_KEYS.customerId, customer.id.toString());
        setCurrentCustomerId(customer.id);
        setIsAuthenticated(true);
        setRole('customer');
        showToast('Login successful', 'success');
      } else {
        showToast('Invalid credentials', 'error');
      }
    } else {
      showToast('Invalid credentials', 'error');
    }
  };

  const registerCustomer = () => {
    const { name, phone, email, address, username, password } = registerForm;
    if (!name || !phone || !username || !password) {
      showToast('Name, phone, username and password required', 'error');
      return;
    }
    if (customers.some(c => c.username && c.username.toLowerCase() === username.toLowerCase())) {
      showToast('Username already exists', 'error');
      return;
    }
    const newCustomer = {
      id: Date.now(),
      name,
      phone,
      email,
      address,
      total: 0,
      username,
      password
    };
    setCustomers([...customers, newCustomer]);
    setRegisterForm({ name: '', phone: '', email: '', address: '', username: '', password: '' });
    setLoginMode('customer');
    setIsRegister(false);
    setLoginUsername(username);
    setLoginPassword(password);
    showToast('Registration successful. Please login.', 'success');
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.loggedIn);
    localStorage.removeItem(STORAGE_KEYS.role);
    localStorage.removeItem(STORAGE_KEYS.customerId);
    setIsAuthenticated(false);
    setRole(null);
    setCurrentCustomerId(null);
    setLoginUsername('');
    setLoginPassword('');
    showToast('Logged out', 'info');
  };

  const resetSystem = () => {
    if (window.confirm('This will delete ALL data. Continue?')) {
      localStorage.clear();
      setCustomers(initialData.customers);
      setStaff(initialData.staff);
      setInventory(initialData.inventory);
      setInvoices([]);
      setOrders([]);
      setSettings(initialData.settings);
      setCurrentCustomerId(null);
      showToast('System reset', 'warn');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  const addOrder = (invoice, source) => {
    const order = {
      id: 'ORD-' + Date.now(),
      invoiceId: invoice.id,
      date: invoice.date,
      customer: invoice.customer,
      total: invoice.total,
      status: 'open',
      source
    };
    setOrders(prev => [order, ...prev]);
  };

  const markOrderFinished = (orderId) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'finished', finishedAt: new Date().toISOString().slice(0, 10) } : o))
    );
  };

  if (!isAuthenticated) {
    return (
      <>
        <BackgroundCanvas />
        <div className="login-page">
          <div className="login-box">
            <h1>SpareBill Pro</h1>
            <div className="role-buttons">
              <button className={loginMode === 'owner' ? 'active' : ''} onClick={() => setLoginMode('owner')}>Shop Owner</button>
              <button className={loginMode === 'customer' ? 'active' : ''} onClick={() => setLoginMode('customer')}>Customer</button>
            </div>
            {loginMode === 'owner' && (
              <div className="role-buttons secondary">
                <button className={selectedRole === 'admin' ? 'active' : ''} onClick={() => setSelectedRole('admin')}>Admin</button>
                <button className={selectedRole === 'cashier' ? 'active' : ''} onClick={() => setSelectedRole('cashier')}>Cashier</button>
              </div>
            )}
            {loginMode === 'customer' && (
              <div className="role-buttons tertiary">
                <button className={!isRegister ? 'active' : ''} onClick={() => setIsRegister(false)}>Login</button>
                <button className={isRegister ? 'active' : ''} onClick={() => setIsRegister(true)}>Register</button>
              </div>
            )}
            {!isRegister && (
              <>
                <input placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <button className="login-btn" onClick={login}>Login</button>
                <p style={{ opacity: 0.7, marginTop: 10, fontSize: '12px' }}>
                  Owner: admin/admin or cashier/cashier | Customer: rahul/rahul123
                </p>
              </>
            )}
            {loginMode === 'customer' && isRegister && (
              <>
                <div className="form-grid compact">
                  <div className="form-group"><label>Name</label><input value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} /></div>
                  <div className="form-group"><label>Phone</label><input value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} /></div>
                  <div className="form-group"><label>Email</label><input value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} /></div>
                  <div className="form-group"><label>Username</label><input value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} /></div>
                  <div className="form-group"><label>Password</label><input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} /></div>
                  <div className="form-group full"><label>Address</label><textarea value={registerForm.address} onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })} /></div>
                </div>
                <button className="login-btn" style={{ marginTop: 10 }} onClick={registerCustomer}>Create Account</button>
              </>
            )}
          </div>
        </div>
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <>
      <BackgroundCanvas />
      <div className="app-container">
        <Sidebar role={role} currentPage={currentPage} onNavigate={setCurrentPage} onLogout={logout} customer={currentCustomer} invoices={invoices} orders={orders} />
        <main className="main">
          {role === 'admin' && currentPage === 'dashboard' && (
            <Dashboard customers={customers} staff={staff} inventory={inventory} invoices={invoices} orders={orders} role={role} onNavigate={setCurrentPage} onFinishOrder={markOrderFinished} settings={settings} />
          )}
          {((role === 'admin' || role === 'cashier') && currentPage === 'billing') && (
            <Billing customers={customers} inventory={inventory} setInventory={setInventory} invoices={invoices} setInvoices={setInvoices} setCustomers={setCustomers} showToast={showToast} settings={settings} addOrder={addOrder} />
          )}
          {((role === 'admin' || role === 'cashier') && currentPage === 'invoices') && (
            <Invoices invoices={invoices} setInvoices={setInvoices} showToast={showToast} settings={settings} />
          )}
          {role === 'admin' && currentPage === 'customers' && (
            <Customers customers={customers} setCustomers={setCustomers} showToast={showToast} invoices={invoices} />
          )}
          {role === 'admin' && currentPage === 'staff' && (
            <Staff staff={staff} setStaff={setStaff} showToast={showToast} />
          )}
          {(role === 'admin' || role === 'cashier') && currentPage === 'inventory' && (
            <Inventory inventory={inventory} setInventory={setInventory} showToast={showToast} invoices={invoices} />
          )}
          {(role === 'admin' || role === 'cashier') && currentPage === 'payments' && (
            <Payments invoices={invoices} setInvoices={setInvoices} showToast={showToast} />
          )}
          {(role === 'admin' || role === 'cashier') && currentPage === 'orders' && (
            <Orders orders={orders} role={role} onFinishOrder={markOrderFinished} />
          )}
          {role === 'admin' && currentPage === 'reports' && (
            <Reports inventory={inventory} invoices={invoices} />
          )}
          {role === 'admin' && currentPage === 'settings' && (
            <Settings settings={settings} setSettings={setSettings} showToast={showToast} onReset={resetSystem} />
          )}
          {role === 'customer' && (
            <CustomerPanel inventory={inventory} setInventory={setInventory} invoices={invoices} setInvoices={setInvoices} showToast={showToast} currentCustomer={currentCustomer} addOrder={addOrder} />
          )}
        </main>
      </div>
      <Toast toast={toast} />
    </>
  );
}

function BackgroundCanvas() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const bands = Array.from({ length: 4 }).map((_, i) => ({
      amp: 60 + i * 18,
      freq: 0.0025 + i * 0.0005,
      phase: Math.random() * Math.PI * 2,
      base: height * (0.18 + i * 0.18),
      speed: 0.6 + i * 0.2
    }));

    const shards = Array.from({ length: 26 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.2 + Math.random() * 0.8,
      size: 26 + Math.random() * 48,
      rot: Math.random() * Math.PI,
      rotSpeed: -0.006 + Math.random() * 0.012,
      vx: -0.2 + Math.random() * 0.4,
      vy: -0.15 + Math.random() * 0.3,
      alpha: 0.12 + Math.random() * 0.18
    }));

    function drawAurora(t) {
      bands.forEach((b, idx) => {
        const gradient = ctx.createLinearGradient(0, b.base - 120, width, b.base + 120);
        gradient.addColorStop(0, 'rgba(47, 90, 168, 0.35)');
        gradient.addColorStop(0.5, 'rgba(45, 125, 210, 0.45)');
        gradient.addColorStop(1, 'rgba(176, 141, 87, 0.25)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, b.base);
        for (let x = 0; x <= width; x += 20) {
          const y = b.base + Math.sin(t * b.freq + x * 0.012 + b.phase) * b.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, b.base + 160);
        ctx.lineTo(0, b.base + 160);
        ctx.closePath();
        ctx.globalAlpha = 0.25 + idx * 0.08;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function drawShards() {
      shards.forEach(s => {
        s.x += s.vx * (0.6 + s.z);
        s.y += s.vy * (0.6 + s.z);
        s.rot += s.rotSpeed;

        if (s.x < -120) s.x = width + 120;
        if (s.x > width + 120) s.x = -120;
        if (s.y < -120) s.y = height + 120;
        if (s.y > height + 120) s.y = -120;

        const scale = 0.6 + s.z * 0.9;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo(-s.size * 0.6, -s.size * 0.2);
        ctx.lineTo(s.size * 0.6, -s.size * 0.35);
        ctx.lineTo(s.size * 0.4, s.size * 0.5);
        ctx.lineTo(-s.size * 0.5, s.size * 0.35);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.strokeStyle = `rgba(47, 90, 168, ${s.alpha + 0.12})`;
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }

    let t = 0;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      drawAurora(t);
      drawShards();
      t += 1;
      requestAnimationFrame(animate);
    }

    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} id="bgCanvas" style={{ position: 'fixed', inset: 0, zIndex: -1 }} />;
}

function Sidebar({ role, currentPage, onNavigate, onLogout, customer, invoices, orders }) {
  const navItems = [
    { id: 'dashboard', label: '🏠 Dashboard', roles: ['admin'] },
    { id: 'billing', label: '🧾 Billing', roles: ['admin', 'cashier'] },
    { id: 'invoices', label: '📄 Invoices', roles: ['admin', 'cashier'] },
    { id: 'payments', label: '💳 Payments', roles: ['admin', 'cashier'] },
    { id: 'customers', label: '👥 Customers', roles: ['admin'] },
    { id: 'staff', label: '👨‍💼 Staff', roles: ['admin'] },
    { id: 'inventory', label: '📦 Inventory', roles: ['admin', 'cashier'] },
    { id: 'orders', label: '🧾 Orders', roles: ['admin', 'cashier'] },
    { id: 'reports', label: '📊 Reports', roles: ['admin'] },
    { id: 'settings', label: '⚙️ Settings', roles: ['admin', 'cashier'] }
  ];

  const openOrderCount = (orders || []).filter(o => o.status === 'open').length;

  const filteredItems = navItems.filter(item => item.roles.includes(role));
  const customerInvoices = customer
    ? invoices.filter(inv => inv.customerId === customer.id || inv.customerUsername === customer.username || inv.customer === customer.name)
    : [];
  const recentPurchases = customerInvoices.slice(-5).reverse();
  const paidCount = customerInvoices.filter(inv => (inv.payment?.status || '') === 'Paid').length;
  const partialCount = customerInvoices.filter(inv => (inv.payment?.status || '') === 'Partial').length;
  const unpaidCount = customerInvoices.filter(inv => (inv.payment?.status || '') === 'Unpaid' || !inv.payment).length;
  const totalBalance = customerInvoices.reduce((sum, inv) => sum + (inv.payment?.balance || 0), 0);
  const allPaid = invoices.filter(inv => (inv.payment?.status || '') === 'Paid').length;
  const allPartial = invoices.filter(inv => (inv.payment?.status || '') === 'Partial').length;
  const allUnpaid = invoices.filter(inv => (inv.payment?.status || '') === 'Unpaid' || !inv.payment).length;
  const allBalance = invoices.reduce((sum, inv) => sum + (inv.payment?.balance || 0), 0);

  const handleQuickAction = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="sidebar">
      <h2>SPAREBILL</h2>
      {role !== 'customer' && filteredItems.map(item => (
        <div key={item.id} className={`nav-link ${currentPage === item.id ? 'active' : ''}`} onClick={() => onNavigate(item.id)}>
          {item.label}
          {item.id === 'orders' && openOrderCount > 0 && (
            <span className="nav-badge">{openOrderCount}</span>
          )}
        </div>
      ))}
      {role === 'customer' && (
        <>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Quick Actions</div>
            <button className="sidebar-action" onClick={() => handleQuickAction('customer-catalog')}>Browse Products</button>
            <button className="sidebar-action" onClick={() => handleQuickAction('customer-wishlist')}>View Wishlist</button>
            <button className="sidebar-action" onClick={() => handleQuickAction('customer-cart')}>Go to Cart</button>
            <button className="sidebar-action" onClick={() => handleQuickAction('customer-history')}>Purchase History</button>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">User Info</div>
            {customer ? (
              <div className="sidebar-meta">
                <div><b>{customer.name}</b></div>
                <div className="muted">{customer.phone || 'No phone'}</div>
                <div className="muted">{customer.email || 'No email'}</div>
                <div className="muted">Username: {customer.username}</div>
              </div>
            ) : (
              <div className="sidebar-empty">No user loaded</div>
            )}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Purchase History</div>
            {recentPurchases.length > 0 ? (
              <div className="sidebar-history">
                {recentPurchases.map(inv => (
                  <div key={inv.id} className="sidebar-history-item">
                    <div className="muted">{inv.date}</div>
                    <div>{inv.id}</div>
                    <div className="strong">Rs. {inv.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sidebar-empty">No purchases yet</div>
            )}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Payment Status</div>
            <div className="sidebar-meta">
              <div>Paid: <b>{paidCount}</b></div>
              <div>Partial: <b>{partialCount}</b></div>
              <div>Unpaid: <b>{unpaidCount}</b></div>
              <div>Balance: <b>Rs. {totalBalance.toFixed(2)}</b></div>
            </div>
          </div>
        </>
      )}
      <div className="nav-link" onClick={onLogout}>🚪 Logout</div>
    </aside>
  );
}

function Toast({ toast }) {
  return <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>{toast.message}</div>;
}

function PaymentSummary({ invoices, title = 'Payment Summary' }) {
  const paid = invoices.filter(inv => (inv.payment?.status || '') === 'Paid').length;
  const partial = invoices.filter(inv => (inv.payment?.status || '') === 'Partial').length;
  const unpaid = invoices.filter(inv => (inv.payment?.status || '') === 'Unpaid' || !inv.payment).length;
  const totalBalance = invoices.reduce((sum, inv) => sum + (inv.payment?.balance || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.payment?.paid || 0), 0);

  return (
    <div className="section">
      <h3>{title}</h3>
      <div className="kpi-grid">
        <div className="card success"><div className="value">{paid}</div><div className="label">Paid</div></div>
        <div className="card warn"><div className="value">{partial}</div><div className="label">Partial</div></div>
        <div className="card danger"><div className="value">{unpaid}</div><div className="label">Unpaid</div></div>
        <div className="card info"><div className="value">Rs. {totalPaid.toFixed(2)}</div><div className="label">Total Paid</div></div>
        <div className="card"><div className="value">Rs. {totalBalance.toFixed(2)}</div><div className="label">Balance Due</div></div>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✖</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Dashboard({ customers, staff, inventory, invoices, orders, role, onNavigate, onFinishOrder, settings }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayInvoices = invoices.filter(i => i.date === today);
  const todaySales = todayInvoices.reduce((sum, i) => sum + i.total, 0);
  const lowStockItems = inventory.filter(p => p.stock <= p.threshold);
  const openOrders = (orders || []).filter(o => o.status === 'open');

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const salesData = last7Days.map(d => invoices.filter(i => i.date === d).reduce((sum, i) => sum + i.total, 0));
  const invoiceData = last7Days.map(d => invoices.filter(i => i.date === d).length);

  const partSales = {};
  invoices.forEach(inv => { inv.items.forEach(it => { partSales[it.part] = (partSales[it.part] || 0) + it.qty; }); });

  const lineChartData = { labels: last7Days, datasets: [{ label: 'Sales (Rs.)', data: salesData, borderColor: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.25)', tension: 0.45, fill: true }] };
  const barChartData = { labels: last7Days, datasets: [{ label: 'Invoices', data: invoiceData, backgroundColor: '#3498db' }] };
  const pieChartData = { labels: Object.keys(partSales).length ? Object.keys(partSales) : ['No Data'], datasets: [{ data: Object.values(partSales).length ? Object.values(partSales) : [1], backgroundColor: ['#d4af37', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12'] }] };

  const exportCustomersXML = () => {
    const escapeXml = (value) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<customers>'
    ];
    customers.forEach(c => {
      xml.push(`  <customer id="${escapeXml(c.id)}">`);
      xml.push(`    <name>${escapeXml(c.name)}</name>`);
      xml.push(`    <phone>${escapeXml(c.phone)}</phone>`);
      xml.push(`    <email>${escapeXml(c.email || '')}</email>`);
      xml.push(`    <address>${escapeXml(c.address || '')}</address>`);
      xml.push(`    <username>${escapeXml(c.username || '')}</username>`);
      xml.push(`    <totalPurchases>${escapeXml(c.total || 0)}</totalPurchases>`);
      xml.push('  </customer>');
    });
    xml.push('</customers>');

    const blob = new Blob([xml.join('\n')], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Customers_Report.xml';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="dashboard" className="page fade-in">
      <div className="topbar">
        <div className="title">Admin Dashboard</div>
        <div className="actions">
          <button onClick={() => onNavigate('billing')}>+ New Invoice</button>
          <button onClick={() => onNavigate('inventory')}>+ Add Part</button>
          <button onClick={() => onNavigate('customers')}>+ Add Customer</button>
          <button onClick={exportCustomersXML}>Export Customers XML</button>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="card success"><div className="value">Rs. {todaySales.toFixed(2)}</div><div className="label">Today's Sales</div></div>
        <div className="card info"><div className="value">{invoices.length}</div><div className="label">Total Invoices</div></div>
        <div className="card"><div className="value">{customers.length}</div><div className="label">Customers</div></div>
        <div className="card"><div className="value">{staff.length}</div><div className="label">Staff</div></div>
        <div className="card warn"><div className="value">{inventory.length}</div><div className="label">Spare Parts</div></div>
        <div className="card danger"><div className="value">{lowStockItems.length}</div><div className="label">Low Stock Items</div></div>
      </div>
      <div className="section">
        <h3>🧾 New Orders</h3>
        {openOrders.length === 0 && <div className="card success">✅ No new orders</div>}
        {openOrders.map(o => (
          <div key={o.id} className="card info" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b>{o.id}</b> — {o.customer} — Rs. {o.total.toFixed(2)}<br />
              <small>{o.date} • Source: {o.source}</small>
            </div>
            {role === 'admin'
              ? <button className="btn green small" onClick={() => onFinishOrder(o.id)}>Mark Finished</button>
              : <span className="tag low">Waiting for Admin</span>}
          </div>
        ))}
      </div>
      <div className="section live-alerts-section">
        <h3>🚨 Live Alerts</h3>
        {lowStockItems.length > 0
          ? lowStockItems.map(p => (
              <div
                key={p.id}
                className="card danger live-alert"
                style={{ marginBottom: 10 }}
              >
                🔴 Low stock: <b>{p.name}</b> ({p.stock} left)
              </div>
            ))
          : <div className="card success live-alert">✅ No low stock items</div>}
      </div>
      <div className="section">
        <h3>📊 Sales Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div className="chart-container"><Line data={lineChartData} options={{ responsive: true }} /></div>
          <div className="chart-container"><Bar data={barChartData} options={{ responsive: true }} /></div>
          <div className="chart-container"><Pie data={pieChartData} options={{ responsive: true }} /></div>
        </div>
      </div>
    </div>
  );
}

function Billing({ customers, inventory, setInventory, invoices, setInvoices, setCustomers, showToast, settings, addOrder }) {
  const getRecommendedItem = () => {
    if (!inventory || inventory.length === 0) return null;
    return inventory.reduce((best, item) => (item.stock > best.stock ? item : best), inventory[0]);
  };

  const getPartSuggestions = (category) => {
    if (!inventory || inventory.length === 0) return [];
    return Array.from(
      new Set(
        inventory
          .filter(p => !category || p.category === category)
          .map(p => p.name)
      )
    ).sort();
  };

  const getCategorySuggestions = () => {
    if (!inventory || inventory.length === 0) return [];
    return Array.from(new Set(inventory.map(p => p.category))).sort();
  };

  const getBrandSuggestions = (category, part) => {
    if (!inventory || inventory.length === 0) return [];
    return Array.from(
      new Set(
        inventory
          .filter(p => (!category || p.category === category) && (!part || p.name === part))
          .map(p => p.brand)
      )
    ).sort();
  };

  const makeBillItem = () => {
    const rec = getRecommendedItem();
    if (!rec) return { category: '', part: '', brand: '', price: 0, qty: 1 };
    return {
      category: rec.category,
      part: rec.name,
      brand: rec.brand,
      price: rec.price,
      qty: 1
    };
  };

  const [billCustomer, setBillCustomer] = useState('');
  const [billPhone, setBillPhone] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().slice(0, 10));
  const [billInvoiceNo] = useState('INV-' + Date.now());
  const [billItems, setBillItems] = useState([makeBillItem()]);
  const [billDiscount, setBillDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentPaid, setPaymentPaid] = useState(0);
  const [paymentTxnId, setPaymentTxnId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  useEffect(() => {
    if (!inventory || inventory.length === 0) return;
    setBillItems(prev =>
      prev.map(item =>
        item.category || item.part || item.brand ? item : makeBillItem()
      )
    );
  }, [inventory]);

  const handleCustomerChange = (value) => {
    setBillCustomer(value);
    if (value.length > 0) {
      const matches = customers.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
      setAutocompleteResults(matches);
      setShowAutocomplete(matches.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const selectCustomer = (customer) => {
    setBillCustomer(customer.name);
    setBillPhone(customer.phone || '');
    setShowAutocomplete(false);
  };

  const handlePartChange = (index, field, value) => {
    const newItems = [...billItems];
    newItems[index][field] = value;
    if (field === 'category') {
      newItems[index].part = '';
      newItems[index].brand = '';
      newItems[index].price = 0;
    }
    if (field === 'part') {
      newItems[index].brand = '';
      newItems[index].price = 0;
    }
    if (field === 'part' || field === 'category' || field === 'brand') {
      const item = inventory.find(p => p.category.toLowerCase() === newItems[index].category.toLowerCase() && p.name.toLowerCase() === newItems[index].part.toLowerCase() && p.brand.toLowerCase() === newItems[index].brand.toLowerCase());
      if (item) newItems[index].price = item.price;
    }
    setBillItems(newItems);
  };

  const handlePartNameInput = (index, value) => {
    const newItems = [...billItems];
    newItems[index].part = value;
    const match = inventory.find(p =>
      p.name.toLowerCase() === value.toLowerCase() &&
      (!newItems[index].category || p.category === newItems[index].category)
    );
    if (match) {
      newItems[index].category = match.category;
      newItems[index].brand = match.brand;
      newItems[index].price = match.price;
    } else {
      newItems[index].brand = '';
      newItems[index].price = 0;
    }
    setBillItems(newItems);
  };

  const handleCategoryInput = (index, value) => {
    const newItems = [...billItems];
    newItems[index].category = value;
    newItems[index].part = '';
    newItems[index].brand = '';
    newItems[index].price = 0;
    setBillItems(newItems);
  };

  const handleBrandInput = (index, value) => {
    const newItems = [...billItems];
    newItems[index].brand = value;
    const match = inventory.find(p =>
      p.brand.toLowerCase() === value.toLowerCase() &&
      (!newItems[index].category || p.category === newItems[index].category) &&
      (!newItems[index].part || p.name === newItems[index].part)
    );
    if (match) {
      newItems[index].category = match.category;
      newItems[index].part = match.name;
      newItems[index].price = match.price;
    }
    setBillItems(newItems);
  };

  const getCategories = () => Array.from(new Set(inventory.map(p => p.category))).sort();
  const getParts = (category) => Array.from(new Set(inventory.filter(p => p.category === category).map(p => p.name))).sort();
  const getBrands = (category, part) => Array.from(new Set(inventory.filter(p => p.category === category && p.name === part).map(p => p.brand))).sort();

  const addBillRow = () => { setBillItems([...billItems, makeBillItem()]); };
  const removeBillRow = (index) => { setBillItems(billItems.filter((_, i) => i !== index)); };

  const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax - billDiscount;
  const balance = Math.max(0, total - (parseFloat(paymentPaid) || 0));
  const paymentStatus = (parseFloat(paymentPaid) || 0) >= total && total > 0
    ? 'Paid'
    : (parseFloat(paymentPaid) || 0) > 0 ? 'Partial' : 'Unpaid';

  const mockUPIPayment = () => {
    const txn = 'UPI-' + Math.floor(Math.random() * 1e9).toString().padStart(9, '0');
    setPaymentMethod('UPI');
    setPaymentPaid(total);
    setPaymentTxnId(txn);
    setPaymentDate(new Date().toISOString().slice(0, 10));
    showToast('UPI payment simulated: Paid in full', 'success');
  };

  const generateInvoice = () => {
    if (!billCustomer) { showToast('Enter customer name', 'error'); return; }
    if (billItems.length === 0 || !billItems[0].part) { showToast('Add at least one item', 'error'); return; }
    if (total > 0 && (parseFloat(paymentPaid) || 0) < total) {
      showToast('Payment incomplete. Invoice will be generated only after full payment.', 'error');
      return;
    }

    let cust = customers.find(c => c.name.toLowerCase() === billCustomer.toLowerCase());
    if (!cust) {
      cust = { id: Date.now(), name: billCustomer, phone: billPhone, email: '', address: '', total: 0 };
      setCustomers([...customers, cust]);
      showToast('New customer added', 'info');
    }

    const items = billItems.map(item => ({ category: item.category, part: item.part, brand: item.brand, price: item.price, qty: item.qty, amount: item.price * item.qty }));

    const newInventory = inventory.map(item => {
      const billItem = items.find(i => i.part === item.name && i.brand === item.brand);
      if (billItem) return { ...item, stock: item.stock - billItem.qty };
      return item;
    });

    const invoice = {
      id: billInvoiceNo,
      date: billDate,
      customer: billCustomer,
      phone: billPhone,
      customerId: cust.id,
      customerUsername: cust.username || null,
      items,
      subtotal,
      tax,
      discount: billDiscount,
      total,
      payment: {
        method: paymentMethod,
        paid: parseFloat(paymentPaid) || 0,
        balance: Math.max(0, total - (parseFloat(paymentPaid) || 0)),
        status: paymentStatus,
        txnId: paymentTxnId || '',
        date: paymentDate
      }
    };

    setInvoices([...invoices, invoice]);
    if (addOrder) addOrder(invoice, 'billing');
    setInventory(newInventory);
    showToast('Invoice generated successfully', 'success');
    setBillCustomer(''); setBillPhone(''); setBillItems([makeBillItem()]); setBillDiscount(0);
    setPaymentMethod('Cash'); setPaymentPaid(0); setPaymentTxnId(''); setPaymentDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div id="billing" className="page fade-in">
      <div className="topbar"><div className="title">Billing / Create Invoice</div></div>
      <div className="section">
        <div className="form-grid">
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Customer Name</label>
            <input value={billCustomer} onChange={(e) => handleCustomerChange(e.target.value)} placeholder="Start typing customer name..." autoComplete="off" />
            {showAutocomplete && (<div className="autocomplete-list">{autocompleteResults.map(c => (<div key={c.id} className="autocomplete-item" onClick={() => selectCustomer(c)}>{c.name}</div>))}</div>)}
          </div>
          <div className="form-group"><label>Phone</label><input value={billPhone} onChange={(e) => setBillPhone(e.target.value)} placeholder="Phone" /></div>
          <div className="form-group"><label>Date</label><input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} /></div>
          <div className="form-group"><label>Invoice No</label><input value={billInvoiceNo} readOnly /></div>
        </div>
        <hr style={{ borderColor: '#333', margin: '15px 0' }} />
        <h3>Items</h3>
          <table className="bill-items-table">
          <thead><tr><th>Category</th><th>Part</th><th>Brand</th><th>Price</th><th>Qty</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                  <td>
                    <input
                      list={`category-suggestions-${index}`}
                      value={item.category}
                      onChange={(e) => handleCategoryInput(index, e.target.value)}
                      placeholder="Type category..."
                    />
                    <datalist id={`category-suggestions-${index}`}>
                      {getCategorySuggestions().map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </td>
                  <td>
                    <input
                      list={`part-suggestions-${index}`}
                      value={item.part}
                      onChange={(e) => handlePartNameInput(index, e.target.value)}
                      placeholder="Type part name..."
                    />
                    <datalist id={`part-suggestions-${index}`}>
                      {getPartSuggestions(item.category).map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </td>
                  <td>
                    <input
                      list={`brand-suggestions-${index}`}
                      value={item.brand}
                      onChange={(e) => handleBrandInput(index, e.target.value)}
                      placeholder="Type brand..."
                    />
                    <datalist id={`brand-suggestions-${index}`}>
                      {getBrandSuggestions(item.category, item.part).map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </td>
                  <td><input type="number" value={item.price} onChange={(e) => handlePartChange(index, 'price', parseFloat(e.target.value) || 0)} /></td>
                  <td><input type="number" min="1" value={item.qty} onChange={(e) => handlePartChange(index, 'qty', parseInt(e.target.value) || 1)} /></td>
                  <td>Rs. {(item.price * item.qty).toFixed(2)}</td>
                  <td><button className="btn red small" onClick={() => removeBillRow(index)}>✖</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn gold small" onClick={addBillRow}>+ Add Item</button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20, marginTop: 15 }}>
          <div>
            <div>Subtotal: Rs. {subtotal.toFixed(2)}</div>
            <div>Tax (5%): Rs. {tax.toFixed(2)}</div>
            <div>Discount: Rs. <input type="number" value={billDiscount} onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)} style={{ width: 80, display: 'inline' }} /></div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>Total: Rs. {total.toFixed(2)}</div>
          </div>
        </div>
        <hr style={{ borderColor: '#333', margin: '15px 0' }} />
        <h3>Payment Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div className="form-group"><label>Amount Paid</label><input type="number" value={paymentPaid} onChange={(e) => setPaymentPaid(parseFloat(e.target.value) || 0)} /></div>
          <div className="form-group"><label>Balance</label><input value={balance.toFixed(2)} readOnly /></div>
          <div className="form-group"><label>Status</label><input value={paymentStatus} readOnly /></div>
          <div className="form-group"><label>Txn ID</label><input value={paymentTxnId} onChange={(e) => setPaymentTxnId(e.target.value)} placeholder="Optional" /></div>
          <div className="form-group"><label>Payment Date</label><input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
          <button className="btn blue" onClick={mockUPIPayment}>Mock UPI Pay</button>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button className="btn gold" onClick={generateInvoice}>Generate Invoice</button>
          <button className="btn gray" onClick={() => { setBillCustomer(''); setBillPhone(''); setBillItems([makeBillItem()]); setBillDiscount(0); }}>Clear</button>
        </div>
      </div>
    </div>
  );
}

function Invoices({ invoices, setInvoices, showToast, settings }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);

  const deleteInvoice = (index) => {
    if (window.confirm('Delete invoice?')) {
      setInvoices(invoices.filter((_, i) => i !== index));
      showToast('Invoice deleted', 'warn');
    }
  };

  const computeTotals = (inv) => {
    const items = inv.items.map(it => ({
      ...it,
      qty: parseInt(it.qty, 10) || 0,
      price: parseFloat(it.price) || 0,
      amount: (parseFloat(it.price) || 0) * (parseInt(it.qty, 10) || 0)
    }));
    const subtotal = items.reduce((sum, it) => sum + it.amount, 0);
    const tax = subtotal * 0.05;
    const discount = parseFloat(inv.discount) || 0;
    const total = subtotal + tax - discount;
    const paid = parseFloat(inv.payment?.paid || inv.paymentPaid || 0) || 0;
    const balance = Math.max(0, total - paid);
    const status = paid >= total && total > 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';
    const payment = {
      method: inv.payment?.method || inv.paymentMethod || 'Cash',
      paid,
      balance,
      status,
      txnId: inv.payment?.txnId || inv.paymentTxnId || '',
      date: inv.payment?.date || inv.paymentDate || inv.date
    };
    return { ...inv, items, subtotal, tax, total, payment };
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setEditInvoice({ ...invoices[index], items: invoices[index].items.map(i => ({ ...i })) });
    setShowEditModal(true);
  };

  const updateEditField = (field, value) => {
    setEditInvoice(prev => ({ ...prev, [field]: value }));
  };

  const updateEditItem = (idx, field, value) => {
    setEditInvoice(prev => {
      const items = prev.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it));
      return { ...prev, items };
    });
  };

  const addEditItem = () => {
    setEditInvoice(prev => ({ ...prev, items: [...prev.items, { part: '', brand: '', price: 0, qty: 1, amount: 0 }] }));
  };

  const removeEditItem = (idx) => {
    setEditInvoice(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const saveEdit = () => {
    if (!editInvoice.customer || !editInvoice.date || !editInvoice.items.length) {
      showToast('Customer, date and at least one item required', 'error');
      return;
    }
    const next = computeTotals(editInvoice);
    setInvoices(invoices.map((inv, i) => (i === editIndex ? next : inv)));
    setShowEditModal(false);
    setEditIndex(null);
    setEditInvoice(null);
    showToast('Invoice updated', 'success');
  };

  const downloadPDF = (invoice) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = 20;
    doc.setFontSize(18);
    doc.text(settings.businessName || 'SpareBill Auto Parts', 105, y, { align: 'center' });
    y += 12;
    doc.setFontSize(11);
    doc.text(`GST: ${settings.gst || ''}`, 14, y);
    doc.text(`Invoice No: ${invoice.id}`, 150, y);
    y += 8;
    doc.text(`Date: ${invoice.date}`, 14, y);
    doc.text(`Customer: ${invoice.customer}`, 14, y + 8);
    doc.text(`Phone: ${invoice.phone}`, 150, y + 8);
    y += 20;
    doc.setFontSize(12);
    doc.text('Part', 14, y); doc.text('Brand', 60, y); doc.text('Price', 105, y); doc.text('Qty', 130, y); doc.text('Amount', 155, y);
    y += 2;
    doc.line(14, y, 195, y);
    y += 8;
    invoice.items.forEach(item => {
      doc.text(item.part, 14, y);
      doc.text(item.brand, 60, y);
      doc.text(`Rs. ${item.price}`, 105, y);
      doc.text(item.qty.toString(), 130, y);
      doc.text(`Rs. ${item.amount.toFixed(2)}`, 155, y);
      y += 7;
    });
    y += 4;
    doc.line(14, y, 195, y);
    y += 10;
    doc.setFontSize(11);
    doc.text(`Subtotal: Rs. ${invoice.subtotal.toFixed(2)}`, 130, y); y += 7;
    doc.text(`Tax: Rs. ${invoice.tax.toFixed(2)}`, 130, y); y += 7;
    doc.text(`Discount: Rs. ${invoice.discount.toFixed(2)}`, 130, y); y += 10;
    doc.setFontSize(14);
    doc.text(`Total: Rs. ${invoice.total.toFixed(2)}`, 130, y);
    y += 15;
    doc.setFontSize(10);
    doc.text(settings.footer || 'Thank you for your business!', 105, y, { align: 'center', maxWidth: 180 });
    doc.save(`${invoice.id}.pdf`);
    showToast('Invoice PDF downloaded', 'success');
  };

  const exportAllPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Invoices Report', 105, 20, { align: 'center' });
    let y = 35;
    invoices.forEach(inv => { doc.text(`${inv.id} | ${inv.date} | ${inv.customer} | Rs. ${inv.total.toFixed(2)}`, 14, y); y += 7; if (y > 280) { doc.addPage(); y = 20; } });
    doc.save('Invoices_Report.pdf');
    showToast('Invoices exported to PDF', 'success');
  };

  const exportAllXML = () => {
    const escapeXml = (value) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<invoices>'
    ];
    invoices.forEach(inv => {
      xml.push(`  <invoice id="${escapeXml(inv.id)}">`);
      xml.push(`    <date>${escapeXml(inv.date)}</date>`);
      xml.push(`    <customer>${escapeXml(inv.customer)}</customer>`);
      xml.push(`    <phone>${escapeXml(inv.phone)}</phone>`);
      xml.push('    <items>');
      inv.items.forEach(it => {
        xml.push('      <item>');
        xml.push(`        <part>${escapeXml(it.part)}</part>`);
        xml.push(`        <brand>${escapeXml(it.brand)}</brand>`);
        xml.push(`        <price>${escapeXml(it.price)}</price>`);
        xml.push(`        <qty>${escapeXml(it.qty)}</qty>`);
        xml.push(`        <amount>${escapeXml(it.amount)}</amount>`);
        xml.push('      </item>');
      });
      xml.push('    </items>');
      xml.push(`    <subtotal>${escapeXml(inv.subtotal)}</subtotal>`);
      xml.push(`    <tax>${escapeXml(inv.tax)}</tax>`);
      xml.push(`    <discount>${escapeXml(inv.discount)}</discount>`);
      xml.push(`    <total>${escapeXml(inv.total)}</total>`);
      xml.push('  </invoice>');
    });
    xml.push('</invoices>');

    const blob = new Blob([xml.join('\n')], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Invoices_Report.xml';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Invoices exported to XML', 'success');
  };

  return (
    <div id="invoices" className="page fade-in">
      <div className="topbar">
        <div className="title">Invoices</div>
        <div className="actions">
          <button onClick={exportAllPDF}>Export PDF</button>
          <button onClick={exportAllXML}>Export XML</button>
        </div>
      </div>
      <div className="section">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice No</th><th>Date</th><th>Customer</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i}>
                  <td>{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.customer}</td>
                  <td>Rs. {inv.total.toFixed(2)}</td>
                  <td>
                    <button className="btn blue small" onClick={() => { setSelectedInvoice(inv); setShowModal(true); }}>View</button>
                    <button className="btn gray small" onClick={() => openEdit(i)}>Edit</button>
                    <button className="btn red small" onClick={() => deleteInvoice(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Invoice">
        {editInvoice && (
          <div>
            <div className="form-grid">
              <div className="form-group"><label>Invoice No</label><input value={editInvoice.id} readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" value={editInvoice.date} onChange={(e) => updateEditField('date', e.target.value)} /></div>
              <div className="form-group"><label>Customer</label><input value={editInvoice.customer} onChange={(e) => updateEditField('customer', e.target.value)} /></div>
              <div className="form-group"><label>Phone</label><input value={editInvoice.phone || ''} onChange={(e) => updateEditField('phone', e.target.value)} /></div>
            </div>
            <h3 style={{ marginTop: 10 }}>Items</h3>
            <table className="bill-items-table">
              <thead><tr><th>Part</th><th>Brand</th><th>Price</th><th>Qty</th><th>Amount</th><th></th></tr></thead>
              <tbody>
                {editInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td><input value={it.part} onChange={(e) => updateEditItem(idx, 'part', e.target.value)} /></td>
                    <td><input value={it.brand} onChange={(e) => updateEditItem(idx, 'brand', e.target.value)} /></td>
                    <td><input type="number" value={it.price} onChange={(e) => updateEditItem(idx, 'price', parseFloat(e.target.value) || 0)} /></td>
                    <td><input type="number" min="1" value={it.qty} onChange={(e) => updateEditItem(idx, 'qty', parseInt(e.target.value, 10) || 1)} /></td>
                    <td>Rs. {((parseFloat(it.price) || 0) * (parseInt(it.qty, 10) || 0)).toFixed(2)}</td>
                    <td><button className="btn red small" onClick={() => removeEditItem(idx)}>✖</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn gold small" onClick={addEditItem}>+ Add Item</button>
            <div style={{ marginTop: 12 }}>
              <label>Discount (Rs.)</label>
              <input type="number" value={editInvoice.discount} onChange={(e) => updateEditField('discount', parseFloat(e.target.value) || 0)} />
            </div>
            <h3 style={{ marginTop: 12 }}>Payment</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Method</label>
                <select value={editInvoice.payment?.method || 'Cash'} onChange={(e) => updateEditField('payment', { ...editInvoice.payment, method: e.target.value })}>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="form-group"><label>Paid</label><input type="number" value={editInvoice.payment?.paid || 0} onChange={(e) => updateEditField('payment', { ...editInvoice.payment, paid: parseFloat(e.target.value) || 0 })} /></div>
              <div className="form-group"><label>Txn ID</label><input value={editInvoice.payment?.txnId || ''} onChange={(e) => updateEditField('payment', { ...editInvoice.payment, txnId: e.target.value })} /></div>
              <div className="form-group"><label>Date</label><input type="date" value={editInvoice.payment?.date || editInvoice.date} onChange={(e) => updateEditField('payment', { ...editInvoice.payment, date: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
              <button className="btn gold" onClick={saveEdit}>Save Changes</button>
              <button className="btn gray" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Invoice Preview">
        {selectedInvoice && (
          <div>
            <div className="invoice-header"><div><h2>{settings.businessName}</h2><div>GST: {settings.gst}</div></div><div><div>Invoice No: <b>{selectedInvoice.id}</b></div><div>Date: <b>{selectedInvoice.date}</b></div></div></div>
            <hr />
            <div><b>Customer:</b> {selectedInvoice.customer}<br /><b>Phone:</b> {selectedInvoice.phone}</div>
            <table className="invoice-table"><thead><tr><th>Part</th><th>Brand</th><th>Price</th><th>Qty</th><th>Amount</th></tr></thead><tbody>{selectedInvoice.items.map((item, i) => (<tr key={i}><td>{item.part}</td><td>{item.brand}</td><td>Rs. {item.price}</td><td>{item.qty}</td><td>Rs. {item.amount.toFixed(2)}</td></tr>))}</tbody></table>
            <div className="invoice-total">
              Subtotal: Rs. {selectedInvoice.subtotal.toFixed(2)}<br />
              Tax: Rs. {selectedInvoice.tax.toFixed(2)}<br />
              Discount: Rs. {selectedInvoice.discount.toFixed(2)}<br />
              <b>Total: Rs. {selectedInvoice.total.toFixed(2)}</b><br />
              {selectedInvoice.payment && (
                <>
                  <div>Paid: Rs. {(selectedInvoice.payment.paid || 0).toFixed(2)}</div>
                  <div>Balance: Rs. {(selectedInvoice.payment.balance || 0).toFixed(2)}</div>
                  <div>Status: {selectedInvoice.payment.status || 'Unpaid'}</div>
                </>
              )}
            </div>
            <div style={{ marginTop: 15, display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button className="btn blue" onClick={() => downloadPDF(selectedInvoice)}>Download PDF</button><button className="btn gray" onClick={() => setShowModal(false)}>Close</button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Customers({ customers, setCustomers, showToast, invoices }) {
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '', username: '', password: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editCustomer, setEditCustomer] = useState({ name: '', phone: '', email: '', address: '', username: '', password: '' });
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showEditNameSuggestions, setShowEditNameSuggestions] = useState(false);
  const [editNameSuggestions, setEditNameSuggestions] = useState([]);

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.username || !newCustomer.password) {
      showToast('Name, phone, username and password required', 'error');
      return;
    }
    if (customers.some(c => c.username && c.username.toLowerCase() === newCustomer.username.toLowerCase())) {
      showToast('Username already exists', 'error');
      return;
    }
    setCustomers([...customers, { ...newCustomer, id: Date.now(), total: 0 }]);
    showToast('Customer added', 'success');
    setNewCustomer({ name: '', phone: '', email: '', address: '', username: '', password: '' });
    setShowModal(false);
  };

  const handleNameChange = (value) => {
    setNewCustomer({ ...newCustomer, name: value });
    if (value.trim().length === 0) {
      setShowNameSuggestions(false);
      return;
    }
    const matches = customers.filter(c => c.name.toLowerCase().includes(value.toLowerCase())).slice(0, 6);
    setNameSuggestions(matches);
    setShowNameSuggestions(matches.length > 0);
  };

  const selectSuggested = (c) => {
    setNewCustomer({ ...newCustomer, name: c.name, phone: c.phone || '', email: c.email || '', address: c.address || '' });
    setShowNameSuggestions(false);
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setEditCustomer({ ...customers[index], password: customers[index].password || '' });
  };

  const handleEditNameChange = (value) => {
    setEditCustomer({ ...editCustomer, name: value });
    if (value.trim().length === 0) {
      setShowEditNameSuggestions(false);
      return;
    }
    const matches = customers
      .filter((c, i) => i !== editIndex && c.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 6);
    setEditNameSuggestions(matches);
    setShowEditNameSuggestions(matches.length > 0);
  };

  const selectEditSuggested = (c) => {
    setEditCustomer({ ...editCustomer, name: c.name, phone: c.phone || '', email: c.email || '', address: c.address || '' });
    setShowEditNameSuggestions(false);
  };

  const saveEdit = () => {
    if (!editCustomer.name || !editCustomer.phone || !editCustomer.username) {
      showToast('Name, phone and username required', 'error');
      return;
    }
    const usernameTaken = customers.some((c, i) =>
      i !== editIndex && c.username && c.username.toLowerCase() === editCustomer.username.toLowerCase()
    );
    if (usernameTaken) {
      showToast('Username already exists', 'error');
      return;
    }
    const updated = customers.map((c, i) => (i === editIndex ? { ...c, ...editCustomer } : c));
    setCustomers(updated);
    setEditIndex(null);
    showToast('Customer updated', 'success');
  };

  const deleteCustomer = (index) => { if (window.confirm('Delete customer?')) { setCustomers(customers.filter((_, i) => i !== index)); showToast('Customer deleted', 'warn'); } };

  const exportPDF = () => { const doc = new jsPDF(); doc.setFontSize(16); doc.text('Customers Report', 105, 20, { align: 'center' }); let y = 35; customers.forEach(c => { doc.text(`${c.id} | ${c.name} | ${c.phone} | ${c.email || ''}`, 14, y); y += 7; if (y > 280) { doc.addPage(); y = 20; } }); doc.save('Customers_Report.pdf'); showToast('Customers exported to PDF', 'success'); };

  return (
    <div id="customers" className="page fade-in">
      <div className="topbar"><div className="title">Customers</div><div className="actions"><button onClick={() => setShowModal(true)}>+ Add Customer</button><button onClick={exportPDF}>Export PDF</button></div></div>
      <PaymentSummary invoices={invoices} title="Payments (All Customers)" />
      <div className="section">
        <div className="table-wrap">
          <table><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Username</th><th>Total Purchases</th><th>Actions</th></tr></thead><tbody>{customers.map((c, i) => (<tr key={i}><td>{c.id}</td><td>{c.name}</td><td>{c.phone}</td><td>{c.email || ''}</td><td>{c.username || '-'}</td><td>Rs. {(c.total || 0).toFixed(2)}</td><td><button className="btn blue small" onClick={() => openEdit(i)}>Edit</button> <button className="btn red small" onClick={() => deleteCustomer(i)}>Delete</button></td></tr>))}</tbody></table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Customer">
        <div className="form-grid">
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Name</label>
            <input value={newCustomer.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Start typing name..." autoComplete="off" />
            {showNameSuggestions && (
              <div className="autocomplete-list">
                {nameSuggestions.map(c => (
                  <div key={c.id} className="autocomplete-item" onClick={() => selectSuggested(c)}>{c.name}</div>
                ))}
              </div>
            )}
          </div>
          <div className="form-group"><label>Phone</label><input value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} /></div>
          <div className="form-group"><label>Username</label><input value={newCustomer.username} onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })} /></div>
          <div className="form-group"><label>Password</label><input type="password" value={newCustomer.password} onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })} /></div>
          <div className="form-group full"><label>Address</label><textarea value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 15 }}><button className="btn gold" onClick={addCustomer}>Save Customer</button></div>
      </Modal>
      <Modal isOpen={editIndex !== null} onClose={() => setEditIndex(null)} title="Edit Customer">
        <div className="form-grid">
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Name</label>
            <input value={editCustomer.name} onChange={(e) => handleEditNameChange(e.target.value)} placeholder="Start typing name..." autoComplete="off" />
            {showEditNameSuggestions && (
              <div className="autocomplete-list">
                {editNameSuggestions.map(c => (
                  <div key={c.id} className="autocomplete-item" onClick={() => selectEditSuggested(c)}>{c.name}</div>
                ))}
              </div>
            )}
          </div>
          <div className="form-group"><label>Phone</label><input value={editCustomer.phone} onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input value={editCustomer.email || ''} onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })} /></div>
          <div className="form-group"><label>Username</label><input value={editCustomer.username || ''} onChange={(e) => setEditCustomer({ ...editCustomer, username: e.target.value })} /></div>
          <div className="form-group"><label>Password</label><input type="password" value={editCustomer.password || ''} onChange={(e) => setEditCustomer({ ...editCustomer, password: e.target.value })} /></div>
          <div className="form-group full"><label>Address</label><textarea value={editCustomer.address || ''} onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
          <button className="btn gold" onClick={saveEdit}>Save Changes</button>
          <button className="btn gray" onClick={() => setEditIndex(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

function Staff({ staff, setStaff, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', phone: '', email: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editStaff, setEditStaff] = useState({ name: '', role: '', phone: '', email: '' });

  const addStaff = () => { if (!newStaff.name || !newStaff.role || !newStaff.phone) { showToast('Name, role, phone required', 'error'); return; } setStaff([...staff, { ...newStaff, id: Date.now() }]); showToast('Staff added', 'success'); setNewStaff({ name: '', role: '', phone: '', email: '' }); setShowModal(false); };
  const openEdit = (index) => { setEditIndex(index); setEditStaff({ ...staff[index] }); };
  const saveEdit = () => {
    if (!editStaff.name || !editStaff.role || !editStaff.phone) { showToast('Name, role, phone required', 'error'); return; }
    setStaff(staff.map((s, i) => (i === editIndex ? { ...s, ...editStaff } : s)));
    setEditIndex(null);
    showToast('Staff updated', 'success');
  };
  const deleteStaff = (index) => { if (window.confirm('Delete staff?')) { setStaff(staff.filter((_, i) => i !== index)); showToast('Staff deleted', 'warn'); } };
  const exportPDF = () => { const doc = new jsPDF(); doc.setFontSize(16); doc.text('Staff Report', 105, 20, { align: 'center' }); let y = 35; staff.forEach(s => { doc.text(`${s.id} | ${s.name} | ${s.role} | ${s.phone} | ${s.email}`, 14, y); y += 7; if (y > 280) { doc.addPage(); y = 20; } }); doc.save('Staff_Report.pdf'); showToast('Staff exported to PDF', 'success'); };

  return (
    <div id="staff" className="page fade-in">
      <div className="topbar"><div className="title">Staff</div><div className="actions"><button onClick={() => setShowModal(true)}>+ Add Staff</button><button onClick={exportPDF}>Export PDF</button></div></div>
      <div className="section">
        <div className="table-wrap">
          <table><thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead><tbody>{staff.map((s, i) => (<tr key={i}><td>{s.id}</td><td>{s.name}</td><td>{s.role}</td><td>{s.phone}</td><td>{s.email}</td><td><button className="btn blue small" onClick={() => openEdit(i)}>Edit</button> <button className="btn red small" onClick={() => deleteStaff(i)}>Delete</button></td></tr>))}</tbody></table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Staff">
        <div className="form-grid">
          <div className="form-group"><label>Name</label><input value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} /></div>
          <div className="form-group"><label>Role</label><input value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 15 }}><button className="btn gold" onClick={addStaff}>Save Staff</button></div>
      </Modal>
      <Modal isOpen={editIndex !== null} onClose={() => setEditIndex(null)} title="Edit Staff">
        <div className="form-grid">
          <div className="form-group"><label>Name</label><input value={editStaff.name} onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })} /></div>
          <div className="form-group"><label>Role</label><input value={editStaff.role} onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input value={editStaff.phone} onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input value={editStaff.email || ''} onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
          <button className="btn gold" onClick={saveEdit}>Save Changes</button>
          <button className="btn gray" onClick={() => setEditIndex(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

function Inventory({ inventory, setInventory, showToast, invoices }) {
  const [showModal, setShowModal] = useState(false);
  const [newPart, setNewPart] = useState({ category: '', name: '', brand: '', price: 0, stock: 0, threshold: 5 });
  const [editIndex, setEditIndex] = useState(null);
  const [editPart, setEditPart] = useState({ category: '', name: '', brand: '', price: 0, stock: 0, threshold: 5 });

  const getBrandCountForPart = (items, category, name) => {
    return new Set(items.filter(p => p.category === category && p.name === name).map(p => p.brand)).size;
  };

  const addPart = () => {
    if (!newPart.category || !newPart.name || !newPart.brand || !newPart.price) {
      showToast('Fill all required fields', 'error');
      return;
    }
    setInventory([...inventory, { ...newPart, id: Date.now() }]);
    showToast('Part added', 'success');
    setNewPart({ category: '', name: '', brand: '', price: 0, stock: 0, threshold: 5 });
    setShowModal(false);
  };
  const openEdit = (index) => { setEditIndex(index); setEditPart({ ...inventory[index] }); };
  const saveEdit = () => {
    if (!editPart.category || !editPart.name || !editPart.brand || !editPart.price) {
      showToast('Fill all required fields', 'error');
      return;
    }
    const nextInventory = inventory.map((p, i) => (i === editIndex ? { ...p, ...editPart } : p));
    const brandCount = getBrandCountForPart(nextInventory, editPart.category, editPart.name);
    if (brandCount < 4) {
      showToast('Each part must have at least 4 brands. Add more brands first.', 'error');
      return;
    }
    setInventory(nextInventory);
    setEditIndex(null);
    showToast('Part updated', 'success');
  };
  const deletePart = (index) => {
    if (!window.confirm('Delete part?')) return;
    const target = inventory[index];
    const remaining = inventory.filter((_, i) => i !== index);
    const brandCount = getBrandCountForPart(remaining, target.category, target.name);
    if (brandCount < 4) {
      showToast('Cannot delete. Each part must have at least 4 brands.', 'error');
      return;
    }
    setInventory(remaining);
    showToast('Part deleted', 'warn');
  };
  const exportPDF = () => { const doc = new jsPDF(); doc.setFontSize(16); doc.text('Inventory Report', 105, 20, { align: 'center' }); let y = 35; inventory.forEach(p => { doc.text(`${p.id} | ${p.category} | ${p.name} | ${p.brand} | Rs.${p.price} | Stock:${p.stock}`, 14, y); y += 7; if (y > 280) { doc.addPage(); y = 20; } }); doc.save('Inventory_Report.pdf'); showToast('Inventory exported to PDF', 'success'); };

  return (
    <div id="inventory" className="page fade-in">
      <div className="topbar"><div className="title">Inventory / Spare Parts</div><div className="actions"><button onClick={() => setShowModal(true)}>+ Add Part</button><button onClick={exportPDF}>Export PDF</button></div></div>
      <PaymentSummary invoices={invoices} title="Payments (All Invoices)" />
      <div className="section">
        <div className="table-wrap">
          <table><thead><tr><th>ID</th><th>Category</th><th>Part</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{inventory.map((p, i) => (<tr key={i}><td>{p.id}</td><td>{p.category}</td><td>{p.name}</td><td>{p.brand}</td><td>Rs. {p.price}</td><td>{p.stock}</td><td>{p.stock <= p.threshold ? <span className="tag low">LOW</span> : <span className="tag ok">OK</span>}</td><td><button className="btn blue small" onClick={() => openEdit(i)}>Edit</button> <button className="btn red small" onClick={() => deletePart(i)}>Delete</button></td></tr>))}</tbody></table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Spare Part">
        <div className="form-grid">
          <div className="form-group"><label>Category</label><input value={newPart.category} onChange={(e) => setNewPart({ ...newPart, category: e.target.value })} /></div>
          <div className="form-group"><label>Part Name</label><input value={newPart.name} onChange={(e) => setNewPart({ ...newPart, name: e.target.value })} /></div>
          <div className="form-group"><label>Brand</label><input value={newPart.brand} onChange={(e) => setNewPart({ ...newPart, brand: e.target.value })} /></div>
          <div className="form-group"><label>Price</label><input type="number" value={newPart.price} onChange={(e) => setNewPart({ ...newPart, price: parseFloat(e.target.value) || 0 })} /></div>
          <div className="form-group"><label>Stock</label><input type="number" value={newPart.stock} onChange={(e) => setNewPart({ ...newPart, stock: parseInt(e.target.value) || 0 })} /></div>
          <div className="form-group"><label>Low Stock Threshold</label><input type="number" value={newPart.threshold} onChange={(e) => setNewPart({ ...newPart, threshold: parseInt(e.target.value) || 5 })} /></div>
        </div>
        <div style={{ marginTop: 15 }}><button className="btn gold" onClick={addPart}>Save Part</button></div>
      </Modal>
      <Modal isOpen={editIndex !== null} onClose={() => setEditIndex(null)} title="Edit Spare Part">
        <div className="form-grid">
          <div className="form-group"><label>Category</label><input value={editPart.category} onChange={(e) => setEditPart({ ...editPart, category: e.target.value })} /></div>
          <div className="form-group"><label>Part Name</label><input value={editPart.name} onChange={(e) => setEditPart({ ...editPart, name: e.target.value })} /></div>
          <div className="form-group"><label>Brand</label><input value={editPart.brand} onChange={(e) => setEditPart({ ...editPart, brand: e.target.value })} /></div>
          <div className="form-group"><label>Price</label><input type="number" value={editPart.price} onChange={(e) => setEditPart({ ...editPart, price: parseFloat(e.target.value) || 0 })} /></div>
          <div className="form-group"><label>Stock</label><input type="number" value={editPart.stock} onChange={(e) => setEditPart({ ...editPart, stock: parseInt(e.target.value) || 0 })} /></div>
          <div className="form-group"><label>Low Stock Threshold</label><input type="number" value={editPart.threshold} onChange={(e) => setEditPart({ ...editPart, threshold: parseInt(e.target.value) || 5 })} /></div>
        </div>
        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
          <button className="btn gold" onClick={saveEdit}>Save Changes</button>
          <button className="btn gray" onClick={() => setEditIndex(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

function Reports({ inventory, invoices }) {
  const salesMap = {}; invoices.forEach(i => { salesMap[i.date] = (salesMap[i.date] || 0) + i.total; });
  const lowStockItems = inventory.filter(p => p.stock <= p.threshold);
  const exportSalesReport = () => { const doc = new jsPDF(); doc.setFontSize(16); doc.text('Sales Report', 105, 20, { align: 'center' }); let y = 35; Object.keys(salesMap).sort().forEach(d => { doc.text(`${d} : Rs. ${salesMap[d].toFixed(2)}`, 14, y); y += 7; if (y > 280) { doc.addPage(); y = 20; } }); doc.save('Sales_Report.pdf'); };
  const salesDates = Object.keys(salesMap).sort();
  const salesValues = salesDates.map(d => salesMap[d]);
  const salesChartData = {
    labels: salesDates.length ? salesDates : ['No Data'],
    datasets: [{
      label: 'Daily Sales (Rs.)',
      data: salesValues.length ? salesValues : [0],
      borderColor: '#2f5aa8',
      backgroundColor: 'rgba(47, 90, 168, 0.25)',
      tension: 0.35,
      fill: true
    }]
  };

  return (
    <div id="reports" className="page fade-in">
      <div className="topbar"><div className="title">Reports</div><div className="actions"><button onClick={exportSalesReport}>Export Sales Report</button></div></div>
      <PaymentSummary invoices={invoices} title="Payment Summary" />
      <div className="section">
        <h3>Daily Sales Report</h3>
        <div className="chart-container">
          <Line data={salesChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        </div>
      </div>
      <div className="section"><h3>Low Stock Report</h3>{lowStockItems.length > 0 ? lowStockItems.map(p => (<div key={p.id} className="card danger" style={{ marginBottom: 10 }}>🔴 {p.name} ({p.brand}) — {p.stock} left</div>)) : <div className="card success">✅ No low stock items</div>}</div>
    </div>
  );
}

function Orders({ orders, role, onFinishOrder }) {
  const openOrders = (orders || []).filter(o => o.status === 'open');
  const finishedOrders = (orders || []).filter(o => o.status === 'finished');

  return (
    <div id="orders" className="page fade-in">
      <div className="topbar"><div className="title">Orders</div></div>
      <div className="section">
        <h3>Open Orders</h3>
        {openOrders.length === 0 && <div className="card success">✅ No open orders</div>}
        {openOrders.map(o => (
          <div key={o.id} className="card info" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b>{o.id}</b> — {o.customer} — Rs. {o.total.toFixed(2)}<br />
              <small>{o.date} • Source: {o.source}</small>
            </div>
            {role === 'admin'
              ? <button className="btn green small" onClick={() => onFinishOrder(o.id)}>Mark Finished</button>
              : <span className="tag low">Waiting for Admin</span>}
          </div>
        ))}
      </div>
      <div className="section">
        <h3>Finished Orders</h3>
        {finishedOrders.length === 0 && <div className="card">No finished orders yet</div>}
        {finishedOrders.map(o => (
          <div key={o.id} className="card" style={{ marginBottom: 10 }}>
            <b>{o.id}</b> — {o.customer} — Rs. {o.total.toFixed(2)}<br />
            <small>{o.date} • Finished: {o.finishedAt || '—'} • Source: {o.source}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Payments({ invoices, setInvoices, showToast }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editPayment, setEditPayment] = useState(null);

  const openEdit = (index) => {
    const inv = invoices[index];
    setEditIndex(index);
    setEditPayment({
      method: inv.payment?.method || 'Cash',
      paid: inv.payment?.paid || 0,
      txnId: inv.payment?.txnId || '',
      date: inv.payment?.date || inv.date
    });
  };

  const saveEdit = () => {
    const inv = invoices[editIndex];
    const paid = parseFloat(editPayment.paid) || 0;
    const balance = Math.max(0, inv.total - paid);
    const status = paid >= inv.total && inv.total > 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';
    const updated = invoices.map((i, idx) => idx === editIndex ? {
      ...i,
      payment: {
        method: editPayment.method,
        paid,
        balance,
        status,
        txnId: editPayment.txnId,
        date: editPayment.date
      }
    } : i);
    setInvoices(updated);
    setEditIndex(null);
    setEditPayment(null);
    showToast('Payment updated', 'success');
  };

  const deletePayment = (index) => {
    if (!window.confirm('Delete payment details?')) return;
    const updated = invoices.map((i, idx) => idx === index ? {
      ...i,
      payment: { method: '', paid: 0, balance: i.total, status: 'Unpaid', txnId: '', date: i.date }
    } : i);
    setInvoices(updated);
    showToast('Payment deleted', 'warn');
  };

  return (
    <div id="payments" className="page fade-in">
      <div className="topbar"><div className="title">Payments</div></div>
      <PaymentSummary invoices={invoices} title="All Payments Summary" />
      <div className="section">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Method</th>
                <th>Txn ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i}>
                  <td>{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.customer}</td>
                  <td>Rs. {inv.total.toFixed(2)}</td>
                  <td>Rs. {(inv.payment?.paid || 0).toFixed(2)}</td>
                  <td>Rs. {(inv.payment?.balance || 0).toFixed(2)}</td>
                  <td>{inv.payment?.status || 'Unpaid'}</td>
                  <td>{inv.payment?.method || '-'}</td>
                  <td>{inv.payment?.txnId || '-'}</td>
                  <td>
                    <button className="btn blue small" onClick={() => openEdit(i)}>Edit</button>
                    <button className="btn red small" onClick={() => deletePayment(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={editIndex !== null} onClose={() => setEditIndex(null)} title="Edit Payment">
        {editPayment && (
          <div className="form-grid">
            <div className="form-group">
              <label>Method</label>
              <select value={editPayment.method} onChange={(e) => setEditPayment({ ...editPayment, method: e.target.value })}>
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div className="form-group"><label>Paid</label><input type="number" value={editPayment.paid} onChange={(e) => setEditPayment({ ...editPayment, paid: parseFloat(e.target.value) || 0 })} /></div>
            <div className="form-group"><label>Txn ID</label><input value={editPayment.txnId} onChange={(e) => setEditPayment({ ...editPayment, txnId: e.target.value })} /></div>
            <div className="form-group"><label>Date</label><input type="date" value={editPayment.date} onChange={(e) => setEditPayment({ ...editPayment, date: e.target.value })} /></div>
          </div>
        )}
        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
          <button className="btn gold" onClick={saveEdit}>Save Payment</button>
          <button className="btn gray" onClick={() => setEditIndex(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

function Settings({ settings, setSettings, showToast, onReset }) {
  const [formData, setFormData] = useState(settings);
  const saveSettings = () => { setSettings(formData); showToast('Settings saved', 'success'); };

  return (
    <div id="settings" className="page fade-in">
      <div className="topbar"><div className="title">Settings</div></div>
      <div className="section">
        <h3>Profile Settings</h3>
        <div className="form-grid">
          <div className="form-group"><label>Business Name</label><input value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} /></div>
          <div className="form-group"><label>GST Number</label><input value={formData.gst} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
          <div className="form-group full"><label>Invoice Footer</label><textarea value={formData.footer} onChange={(e) => setFormData({ ...formData, footer: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 15 }}><button className="btn gold" onClick={saveSettings}>Save Settings</button></div>
      </div>
      <div className="section"><h3>System</h3><button className="btn red" onClick={onReset}>Reset System (Clear All Data)</button></div>
    </div>
  );
}

function CustomerPanel({ inventory, setInventory, invoices, setInvoices, showToast, currentCustomer, addOrder }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState('name_az');

  const wishlistKey = currentCustomer ? `sparebill_wishlist_${currentCustomer.id}` : null;

  useEffect(() => {
    if (wishlistKey) setWishlist(loadFromStorage(wishlistKey, []));
  }, [wishlistKey]);

  useEffect(() => {
    if (wishlistKey) saveToStorage(wishlistKey, wishlist);
  }, [wishlistKey, wishlist]);

  const categories = ['All', ...new Set(inventory.map(p => p.category))];
  const brands = ['All', ...new Set(inventory.map(p => p.brand))];
  const minVal = priceMin === '' ? null : parseFloat(priceMin);
  const maxVal = priceMax === '' ? null : parseFloat(priceMax);
  const filteredProducts = inventory
    .filter(p =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (selectedBrand === 'All' || p.brand === selectedBrand) &&
      (minVal === null || p.price >= minVal) &&
      (maxVal === null || p.price <= maxVal) &&
      (!inStockOnly || p.stock > 0)
    )
    .slice()
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'name_za':
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (product) => {
    const existing = cart.find(item => item.name === product.name && item.brand === product.brand);
    if (product.stock <= 0) {
      showToast('Out of stock', 'error');
      return;
    }
    if (existing) {
      if (existing.qty < product.stock) setCart(cart.map(item => item.name === product.name && item.brand === product.brand ? { ...item, qty: item.qty + 1 } : item));
      else showToast('Not enough stock', 'error');
    } else setCart([...cart, { ...product, qty: 1 }]);

    setInventory(inventory.map(item => (
      item.id === product.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item
    )));
    showToast('Added to cart', 'success');
  };

  const addToWishlist = (product) => {
    if (wishlist.some(item => item.name === product.name && item.brand === product.brand)) {
      showToast('Already in wishlist', 'info');
      return;
    }
    setWishlist([...wishlist, { ...product }]);
    showToast('Added to wishlist', 'success');
  };

  const removeFromWishlist = (index) => {
    setWishlist(wishlist.filter((_, i) => i !== index));
  };

  const updateCartQty = (index, delta) => {
    const newCart = [...cart];
    newCart[index].qty += delta;
    if (newCart[index].qty <= 0) newCart.splice(index, 1);
    setCart(newCart);

    const target = cart[index];
    if (!target) return;
    setInventory(inventory.map(item => {
      if (item.id !== target.id) return item;
      const updatedStock = delta > 0 ? Math.max(0, item.stock - 1) : item.stock + 1;
      return { ...item, stock: updatedStock };
    }));
  };

  const removeFromCart = (index) => {
    const removed = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    if (removed) {
      setInventory(inventory.map(item => (
        item.id === removed.id ? { ...item, stock: item.stock + removed.qty } : item
      )));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartTax = cartTotal * 0.05;
  const cartFinal = cartTotal + cartTax;

  const customerInvoices = currentCustomer
    ? invoices.filter(inv => inv.customerId === currentCustomer.id || inv.customerUsername === currentCustomer.username || inv.customer === currentCustomer.name)
    : [];
  const outstanding = customerInvoices.filter(inv => (inv.payment?.balance || 0) > 0);
  const outstandingTotal = outstanding.reduce((sum, inv) => sum + (inv.payment?.balance || 0), 0);

  const handleCheckout = () => {
    if (cart.length === 0) { showToast('Cart is empty', 'error'); return; }
    const invoice = {
      id: 'INV-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      customer: currentCustomer ? currentCustomer.name : 'Customer',
      phone: currentCustomer ? currentCustomer.phone : '',
      customerId: currentCustomer ? currentCustomer.id : null,
      customerUsername: currentCustomer ? currentCustomer.username : null,
      items: cart.map(item => ({ part: item.name, brand: item.brand, price: item.price, qty: item.qty, amount: item.price * item.qty })),
      subtotal: cartTotal,
      tax: cartTax,
      discount: 0,
      total: cartFinal,
      payment: {
        method: 'Customer',
        paid: cartFinal,
        balance: 0,
        status: 'Paid',
        txnId: '',
        date: new Date().toISOString().slice(0, 10)
      }
    };
    setInvoices([...invoices, invoice]);
    if (addOrder) addOrder(invoice, 'customer');
    setCart([]);
    showToast('Order placed successfully!', 'success');
  };

  return (
    <div id="customer" className="page fade-in">
      <div className="topbar"><div className="title">Product Catalog</div></div>
      <div id="customer-catalog" className="section">
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: 200 }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} style={{ width: 200 }}>
            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
          <input type="number" placeholder="Min price" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={{ width: 130 }} />
          <input type="number" placeholder="Max price" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={{ width: 130 }} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 170 }}>
            <option value="name_az">Name (A-Z)</option>
            <option value="name_za">Name (Z-A)</option>
            <option value="price_low">Price (Low-High)</option>
            <option value="price_high">Price (High-Low)</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            In stock only
          </label>
        </div>
        <div className="product-grid">
          {filteredProducts.map((p, i) => (
            <div key={i} className="product-card">
              <h4>{p.name}</h4>
              <p style={{ opacity: 0.7 }}>{p.brand} | {p.category}</p>
              <div className="price">Rs. {p.price}</div>
              <p className={p.stock <= p.threshold ? 'stock-low' : 'stock-ok'}>Stock: {p.stock}</p>
              <div className="product-actions">
                <button className="btn gold" onClick={() => addToCart(p)}>Add to Cart</button>
                <button className="btn gray" onClick={() => addToWishlist(p)}>Wishlist</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="customer-wishlist" className="section">
        <h3>Wishlist</h3>
        {wishlist.length === 0 && <div className="card info">Your wishlist is empty</div>}
        {wishlist.map((item, i) => (
          <div key={i} className="cart-item">
            <div><b>{item.name}</b><br /><small>{item.brand} | {item.category}</small></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn blue small" onClick={() => addToCart(item)}>Add to Cart</button>
              <button className="btn red small" onClick={() => removeFromWishlist(i)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div id="customer-cart" className="section">
        <h3>Shopping Cart</h3>
        {cart.length === 0 && <div className="card info">Your cart is empty</div>}
        {cart.map((item, i) => (
          <div key={i} className="cart-item">
            <div><b>{item.name}</b><br /><small>{item.brand}</small></div>
            <div className="quantity-controls">
              <button onClick={() => updateCartQty(i, -1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateCartQty(i, 1)}>+</button>
              <button className="btn red small" onClick={() => removeFromCart(i)}>Remove</button>
            </div>
          </div>
        ))}
        <div className="invoice-total">
          Subtotal: Rs. {cartTotal.toFixed(2)}<br />
          Tax: Rs. {cartTax.toFixed(2)}<br />
          <b>Total: Rs. {cartFinal.toFixed(2)}</b>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn gold" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>

      <div id="customer-history" className="section">
        <h3>Purchase History</h3>
        {outstandingTotal > 0 && (
          <div className="card warn">
            Outstanding Balance: Rs. {outstandingTotal.toFixed(2)} ({outstanding.length} invoice(s))
          </div>
        )}
        {customerInvoices.length === 0 && <div className="card info">No purchases yet</div>}
        {customerInvoices.slice().reverse().map(inv => (
          <div key={inv.id} className="card">
            <div><b>{inv.id}</b> — {inv.date}</div>
            <div>Total: Rs. {inv.total.toFixed(2)}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {inv.items.length} item(s) | Paid: Rs. {(inv.payment?.paid || 0).toFixed(2)} | Balance: Rs. {(inv.payment?.balance || 0).toFixed(2)} | Status: {inv.payment?.status || 'Unpaid'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
