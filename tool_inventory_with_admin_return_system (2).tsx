import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================
// Fallback & Standard Tool Database
// ==========================================
const DEFAULT_TOOLS_DATABASE = [
  {
    "id": "pwr-001",
    "name": "DeWalt Cordless Drill 20V",
    "barcode": "8800112233",
    "category": "Power tools",
    "icon": "⚡",
    "description": "High performance 20V Max cordless drill/driver. Keyless chuck.",
    "specs": "20V Max, 2-Speed, 1/2-inch Chuck"
  },
  {
    "id": "pwr-002",
    "name": "Makita Circular Saw 7-1/4\"",
    "barcode": "8800112244",
    "category": "Power tools",
    "icon": "🪚",
    "description": "Powerful 15 Amp motor circular saw for heavy-duty cutting.",
    "specs": "15 Amp, 5800 RPM, 7-1/4\" Blade"
  },
  {
    "id": "pwr-003",
    "name": "Bosch Angle Grinder 4-1/2\"",
    "barcode": "8800112255",
    "category": "Power tools",
    "icon": "⚙️",
    "description": "Professional high-power motor grinder for grinding, cutting, and brushing.",
    "specs": "6.0 Amp, 11000 RPM, Lock-on switch"
  },
  {
    "id": "pwr-004",
    "name": "Ryobi Corded Jigsaw 4.8A",
    "barcode": "8800112266",
    "category": "Power tools",
    "icon": "🧩",
    "description": "Orbital jigsaw with SpeedMatch selector and integrated laser pointer.",
    "specs": "4.8 Amp, 0-3000 SPM, Toolless blade clamp"
  },
  {
    "id": "hnd-001",
    "name": "Stanley Claw Hammer 16oz",
    "barcode": "9900112233",
    "category": "Hand tools",
    "icon": "🔨",
    "description": "Fiberglass claw hammer for strength, durability, and shock absorption.",
    "specs": "16 oz head, Rip claw, Slip-resistant grip"
  },
  {
    "id": "hnd-002",
    "name": "Craftsman Screwdriver Set (8-Piece)",
    "barcode": "9900112244",
    "category": "Hand tools",
    "icon": "🪛",
    "description": "Assorted Phillips and slotted screwdrivers with magnetic tips.",
    "specs": "Chrome-plated blades, Satin-grip handles"
  },
  {
    "id": "hnd-003",
    "name": "Crescent Adjustable Wrench 10\"",
    "barcode": "9900112255",
    "category": "Hand tools",
    "icon": "🔧",
    "description": "Wider jaw opening adjustable wrench, chrome finish.",
    "specs": "10-inch length, 1-5/16\" jaw capacity"
  },
  {
    "id": "mat-001",
    "name": "Wood Screws Box (100pcs)",
    "barcode": "7700112233",
    "category": "Materials",
    "icon": "🔩",
    "description": "#8 x 2-inch flat head zinc-plated Phillips wood screws.",
    "specs": "100-pack, #8 Thread size, 2\" length"
  },
  {
    "id": "mat-002",
    "name": "Gorilla Wood Glue 18oz",
    "barcode": "7700112244",
    "category": "Materials",
    "icon": "🧴",
    "description": "Water-resistant, high-strength wood adhesive for carpentry and repairs.",
    "specs": "18 oz, Natural wood color finish"
  }
];

// Default Course Options
const COURSE_OPTIONS = [
  "Diploma in Civil Engineering Technology (DCvET)",
  "Diploma in Computer Engineering Technology (DCET)",
  "Diploma in Electrical Engineering Technology (DEET)",
  "Diploma in Electronics Engineering Technology (DECET)",
  "Diploma in Information Communication Technology (DICT)",
  "Diploma in Mechanical Engineering Technology (DMET)",
  "Diploma in Office Management Technology (DOMT)",
  "Diploma in Railway Engineering Technology (DRET)"
];

// Utility: SVG Icon Library to avoid external script dependency issues
const Icons = {
  Hammer: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 5 4 4" /><path d="M21.5 12H16c-.5 0-1-.5-1-1V4.5L9 9.5 21.5 12Z" /><path d="m7.3 13 4.4 4.4" /><path d="m3 21 8.02-8.02" />
    </svg>
  ),
  Package: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3" /><path d="M11 12H8" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Barcode: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5v14" /><path d="M21 5v14" /><path d="M7 5v14" /><path d="M11 5v14" /><path d="M14 5v14" /><path d="M17 5v14" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  ),
  Minus: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  RotateCcw: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

export default function App() {
  // ==========================================
  // Global & Persisted State
  // ==========================================
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('invent_tools_v2');
    return saved ? JSON.parse(saved) : DEFAULT_TOOLS_DATABASE;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('invent_txns_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Current session/authentication
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('invent_session_v2');
    return saved ? JSON.parse(saved) : null; // { studentNumber, studentInfo, role: 'student' | 'admin' }
  });

  // Flow State
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth' | 'profile-setup' | 'main' | 'receipt'
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [activeStudentTab, setActiveStudentTab] = useState('borrow'); // 'borrow' | 'returns' | 'history'
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // 'dashboard' | 'transactions' | 'inventory' | 'settings'

  // Input & Cart States
  const [authForm, setAuthForm] = useState({ studentNumber: '', password: '', confirmStudentNumber: '', confirmPassword: '' });
  const [profileForm, setProfileForm] = useState({ name: '', course: '', section: '', instructor: '', subject: '' });
  const [cart, setCart] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastTxn, setLastTxn] = useState(null);

  // Dynamic Scanning States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState('borrow'); // 'borrow' | 'return'
  const [manualBarcode, setManualBarcode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Scanner Object Reference
  const scannerRef = useRef(null);

  // Admin states
  const [editingTool, setEditingTool] = useState(null);
  const [newToolForm, setNewToolForm] = useState({ id: '', name: '', barcode: '', category: 'Power tools', icon: '🔧', description: '', specs: '' });
  const [sheetSettings, setSheetSettings] = useState({
    spreadsheetId: localStorage.getItem('invent_sheet_id') || '',
    tabName: localStorage.getItem('invent_sheet_tab') || 'Inventory',
    apiUrl: localStorage.getItem('invent_api_url') || 'https://script.google.com/macros/s/AKfycbzZVyBf-7ZKBgsERA-szrUTt_DsRc4uXa0GNc0OTVu9CHw_gG3MaPpfuA8CLSnrxIKB/exec'
  });

  // Alerts & Toasts
  const [toast, setToast] = useState(null);

  // Synchronize dynamic databases with LocalStorage
  useEffect(() => {
    localStorage.setItem('invent_tools_v2', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('invent_txns_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('invent_session_v2', JSON.stringify(session));
    } else {
      localStorage.removeItem('invent_session_v2');
    }
  }, [session]);

  // Handle routing / step checking on load
  useEffect(() => {
    if (session) {
      if (session.role === 'admin') {
        setCurrentStep('main');
      } else if (session.studentInfo && session.studentInfo.name) {
        setCurrentStep('main');
      } else {
        setCurrentStep('profile-setup');
      }
    } else {
      setCurrentStep('auth');
    }
  }, [session]);

  // Load dynamically the html5-qrcode scanner CDN
  useEffect(() => {
    const scriptId = 'html5-qrcode-cdn-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/html5-qrcode";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Monitor scan requests and lock target cameras
  useEffect(() => {
    if (!isScannerOpen) {
      setIsCameraActive(false);
      setCameraError('');
      if (scannerRef.current) {
        const scannerObj = scannerRef.current;
        if (scannerObj.isScanning) {
          scannerObj.stop().then(() => {
            scannerObj.clear();
          }).catch(err => console.error("Error stopping camera scan:", err));
        }
        scannerRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const startScanning = async () => {
      let checks = 0;
      while (!window.Html5Qrcode && checks < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        checks++;
      }

      if (!window.Html5Qrcode) {
        if (isMounted) setCameraError("Scanning engine failed to load from unpkg CDN.");
        return;
      }

      // Ensure the element is mounted in DOM fully before target reference binding
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        const html5Qrcode = new window.Html5Qrcode("react-scan-camera-feed");
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (width, height) => {
              const minDimension = Math.min(width, height);
              const qrboxSize = Math.floor(minDimension * 0.7);
              return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (isMounted) {
              handleSuccessfulScan(decodedText);
            }
          },
          (errorMessage) => {
            // silent diagnostic feedback
          }
        );

        if (isMounted) setIsCameraActive(true);
      } catch (err) {
        console.error("Camera startup failed:", err);
        if (isMounted) {
          setCameraError("Camera access denied or browser requires secure (HTTPS) environment.");
        }
      }
    };

    startScanning();

    return () => {
      isMounted = false;
    };
  }, [isScannerOpen, scannerMode]);

  // Utility to show toasts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sound generator
  const playBeepSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // 1200Hz high pitch scan sound
      
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (err) {
      console.log('Web Audio API not supported/blocked', err);
    }
  };

  // ==========================================
  // Auth Functions
  // ==========================================
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const studentNum = authForm.studentNumber.trim().toUpperCase();
    const pass = authForm.password;

    // Admin backdoor shortcut
    if (studentNum === 'ADMIN' && pass === 'admin123') {
      const adminSession = { studentNumber: 'ADMIN', role: 'admin', studentInfo: { name: 'System Administrator' } };
      setSession(adminSession);
      setCurrentStep('main');
      showToast('Logged in as Administrator', 'success');
      return;
    }

    // PUP style Student Number Regex
    const PUPPattern = /^\d{4}-\d{5}-[A-Z]{2}-\d$/;
    if (studentNum !== 'ADMIN' && !PUPPattern.test(studentNum)) {
      showToast('Please enter a valid format (e.g., 2023-12345-MN-0)', 'error');
      return;
    }

    if (isSignUpMode) {
      if (studentNum !== authForm.confirmStudentNumber.trim().toUpperCase()) {
        showToast('Student Numbers do not match', 'error');
        return;
      }
      if (pass !== authForm.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      if (pass.length < 5) {
        showToast('Password must be at least 5 characters', 'error');
        return;
      }

      // Successful Registration Simulation
      const newSession = { studentNumber: studentNum, role: 'student', studentInfo: null };
      setSession(newSession);
      setCurrentStep('profile-setup');
      showToast('Account created successfully!', 'success');
    } else {
      // Login flow
      if (pass.length < 5) {
        showToast('Password should be at least 5 characters', 'error');
        return;
      }

      // Check if user has logged in before and check cached details
      const existingUserTxn = transactions.find(t => t.studentNumber === studentNum);
      const studentInfo = existingUserTxn ? {
        name: existingUserTxn.studentName,
        course: existingUserTxn.course,
        section: existingUserTxn.section,
        instructor: existingUserTxn.professor,
        subject: existingUserTxn.subject
      } : null;

      const loggedSession = { studentNumber: studentNum, role: 'student', studentInfo };
      setSession(loggedSession);
      if (studentInfo) {
        setCurrentStep('main');
        showToast(`Welcome back, ${studentInfo.name}!`, 'success');
      } else {
        setCurrentStep('profile-setup');
        showToast('Please complete your profile information.', 'success');
      }
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.course || !profileForm.section || !profileForm.instructor || !profileForm.subject) {
      showToast('Please fill out all the fields.', 'error');
      return;
    }

    const updatedSession = {
      ...session,
      studentInfo: { ...profileForm }
    };
    setSession(updatedSession);
    setCurrentStep('main');
    showToast('Profile information successfully saved!', 'success');
  };

  const handleLogout = () => {
    setSession(null);
    setCart([]);
    setIsVerified(false);
    setAuthForm({ studentNumber: '', password: '', confirmStudentNumber: '', confirmPassword: '' });
    setProfileForm({ name: '', course: '', section: '', instructor: '', subject: '' });
    setCurrentStep('auth');
    showToast('Logged out successfully.', 'info');
  };

  // ==========================================
  // Scanner & Logging Simulation
  // ==========================================
  const triggerManualScan = (barcodeToScan = manualBarcode) => {
    const code = barcodeToScan.trim();
    if (!code) {
      showToast('Please enter a barcode number', 'error');
      return;
    }
    handleSuccessfulScan(code);
    setManualBarcode('');
    setIsScannerOpen(false);
  };

  const handleSuccessfulScan = (decodedText) => {
    playBeepSynth();
    
    // Find tool by barcode or ID
    const foundTool = tools.find(t => t.barcode === decodedText || t.id.toLowerCase() === decodedText.toLowerCase());
    
    if (foundTool) {
      if (scannerMode === 'borrow') {
        setCart(prevCart => {
          const existing = prevCart.find(item => item.tool.id === foundTool.id);
          if (existing) {
            return prevCart.map(item => item.tool.id === foundTool.id ? { ...item, quantity: item.quantity + 1 } : item);
          } else {
            return [...prevCart, { tool: foundTool, quantity: 1 }];
          }
        });
        showToast(`Added: ${foundTool.name} to cart.`, 'success');
      } else {
        // Return mode
        handleScanToReturn(foundTool);
      }
    } else {
      showToast(`Unknown Tool barcode: "${decodedText}"`, 'warning');
    }
    setIsScannerOpen(false);
  };

  const handleScanToReturn = (tool) => {
    // Find active transactions for this user containing this tool
    const activeTxns = transactions.filter(t => t.studentNumber === session.studentNumber && t.status === 'Active');
    
    let updatedAny = false;
    let matchingTxnId = null;
    
    const nextTxns = transactions.map(t => {
      if (t.studentNumber === session.studentNumber && t.status === 'Active') {
        const hasTool = t.items.some(item => item.toolId === tool.id);
        if (hasTool) {
          updatedAny = true;
          matchingTxnId = t.transactionId;
          // Mark this transaction as fully/partially returned or simply mark status
          return {
            ...t,
            status: 'Returned',
            returnTimestamp: new Date().toISOString()
          };
        }
      }
      return t;
    });

    if (updatedAny) {
      setTransactions(nextTxns);
      showToast(`Successfully returned: ${tool.name}!`, 'success');
      
      // Update spreadsheet synchronously for the return event
      if (sheetSettings.apiUrl && matchingTxnId) {
        sendReturnToGoogleSheets(matchingTxnId);
      }
    } else {
      showToast(`You do not have any active borrows for: ${tool.name}`, 'error');
    }
  };

  // ==========================================
  // Borrower System Functions
  // ==========================================
  const addToCart = (tool) => {
    const existing = cart.find(item => item.tool.id === tool.id);
    if (existing) {
      setCart(cart.map(item => item.tool.id === tool.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { tool, quantity: 1 }]);
    }
    showToast(`Added ${tool.name} to list`, 'success');
  };

  const updateCartQty = (toolId, change) => {
    const updated = cart.map(item => {
      if (item.tool.id === toolId) {
        const nextQty = item.quantity + change;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean);
    setCart(updated);
  };

  const removeFromCart = (toolId) => {
    setCart(cart.filter(item => item.tool.id !== toolId));
    showToast('Removed item from cart', 'info');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your borrowing list is empty', 'error');
      return;
    }
    if (!isVerified) {
      showToast('You must verify that your physical tool counts match', 'error');
      return;
    }

    const transactionId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();

    const newTxn = {
      transactionId,
      timestamp,
      studentNumber: session.studentNumber,
      studentName: session.studentInfo.name,
      course: session.studentInfo.course,
      section: session.studentInfo.section,
      professor: session.studentInfo.instructor,
      subject: session.studentInfo.subject,
      status: 'Active',
      items: cart.map(item => ({
        toolId: item.tool.id,
        name: item.tool.name,
        category: item.tool.category,
        barcode: item.tool.barcode,
        quantity: item.quantity
      }))
    };

    // Synchronize transactions locally
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    setLastTxn(newTxn);
    setCart([]);
    setIsVerified(false);
    setCurrentStep('receipt');

    // Trigger Mock/Real Spreadsheet Integration if App API is specified
    if (sheetSettings.apiUrl) {
      sendCheckoutToGoogleSheets(newTxn);
    }
  };

  const handleReturnItemDirect = (txnId, toolId) => {
    const updated = transactions.map(t => {
      if (t.transactionId === txnId) {
        return {
          ...t,
          status: 'Returned',
          returnTimestamp: new Date().toISOString()
        };
      }
      return t;
    });
    setTransactions(updated);
    showToast('Equipment logged as returned!', 'success');
    
    // Synchronize the single tool direct return to the spreadsheet
    if (sheetSettings.apiUrl) {
      sendReturnToGoogleSheets(txnId);
    }
  };

  // ==========================================
  // Admin System Functions
  // ==========================================
  const handleAddOrEditTool = (e) => {
    e.preventDefault();
    if (!newToolForm.id || !newToolForm.name || !newToolForm.barcode) {
      showToast('Please fill out all required tool details.', 'error');
      return;
    }

    if (editingTool) {
      // Edit existing tool record
      setTools(tools.map(t => t.id === editingTool.id ? { ...newToolForm } : t));
      showToast('Tool updated successfully!', 'success');
      setEditingTool(null);
    } else {
      // Create new tool
      if (tools.some(t => t.id === newToolForm.id)) {
        showToast('Tool with this unique ID already exists.', 'error');
        return;
      }
      setTools([...tools, { ...newToolForm }]);
      showToast('New equipment added to catalog!', 'success');
    }

    // Reset Form
    setNewToolForm({ id: '', name: '', barcode: '', category: 'Power tools', icon: '🔧', description: '', specs: '' });
  };

  const startEditTool = (tool) => {
    setEditingTool(tool);
    setNewToolForm({ ...tool });
  };

  const deleteTool = (toolId) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      setTools(tools.filter(t => t.id !== toolId));
      showToast('Tool deleted from database.', 'info');
    }
  };

  const forceReturnTransaction = (txnId) => {
    setTransactions(transactions.map(t => {
      if (t.transactionId === txnId) {
        return { ...t, status: 'Returned', returnTimestamp: new Date().toISOString() };
      }
      return t;
    }));
    showToast('Transaction marked as returned by Administrator.', 'success');
    
    if (sheetSettings.apiUrl) {
      sendReturnToGoogleSheets(txnId);
    }
  };

  // ==========================================
  // Google Sheets API Handler Syncs
  // ==========================================
  const sendCheckoutToGoogleSheets = async (txn) => {
    try {
      showToast('Syncing checkout with Google Sheets...', 'info');
      
      // Format payload so both data.cart and data.items are populated with proper attributes
      const payload = {
        ...txn,
        cart: txn.items.map(item => ({
          quantity: item.quantity,
          tool: {
            id: item.toolId,
            name: item.name,
            category: item.category,
            barcode: item.barcode
          }
        }))
      };

      const response = await fetch(sheetSettings.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast('Google Sheet borrow log updated!', 'success');
      } else {
        showToast('Failed to sync checkout: ' + data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Sheet sync failed (Saved to local cache).', 'warning');
    }
  };

  const sendReturnToGoogleSheets = async (transactionId) => {
    try {
      showToast('Syncing return status with Google Sheets...', 'info');
      const returnPayload = {
        transactionId: transactionId,
        status: 'Returned',
        returnTimestamp: new Date().toISOString()
      };
      
      const response = await fetch(sheetSettings.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(returnPayload)
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast('Google Sheet status updated to Returned!', 'success');
      } else {
        showToast('Failed to sync return: ' + data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Sheet sync failed (Logged locally).', 'warning');
    }
  };

  // ==========================================
  // Derived Analytics Data (Admin view)
  // ==========================================
  const analytics = useMemo(() => {
    const totalBorrows = transactions.length;
    const activeBorrows = transactions.filter(t => t.status === 'Active').length;
    const returnedBorrows = totalBorrows - activeBorrows;
    const totalUsers = new Set(transactions.map(t => t.studentNumber)).size;

    // Categories Breakdown
    const categoryCounts = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.quantity;
      });
    });

    return {
      totalBorrows,
      activeBorrows,
      returnedBorrows,
      totalUsers,
      categoryCounts
    };
  }, [transactions]);

  // Filters logic
  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.barcode.includes(searchQuery);
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, categoryFilter]);

  // Student Active Borrows list
  const studentActiveBorrows = useMemo(() => {
    if (!session || session.role !== 'student') return [];
    return transactions.filter(t => t.studentNumber === session.studentNumber && t.status === 'Active');
  }, [transactions, session]);

  const studentTxnHistory = useMemo(() => {
    if (!session || session.role !== 'student') return [];
    return transactions.filter(t => t.studentNumber === session.studentNumber);
  }, [transactions, session]);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Dynamic Styling override for the HTML5 Programmatic QR Viewport */}
      <style>{`
        #react-scan-camera-feed video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 1rem;
        }
      `}</style>

      {/* Toast Notification Container */}
      {toast && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 transition-all duration-300 ${
          toast.type === 'error' ? 'bg-rose-500 text-white' :
          toast.type === 'warning' ? 'bg-amber-500 text-white' :
          'bg-emerald-500 text-white'
        }`}>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Primary Apple-style Navigation Bar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-4 py-3.5 flex justify-between items-center max-w-7xl w-full mx-auto rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Icons.Hammer />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ITech Tool Inventory</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Borrow & Return System</p>
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-600">{session.studentInfo?.name || session.studentNumber}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{session.role} Account</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
              title="Logout"
            >
              <Icons.LogOut />
            </button>
          </div>
        )}
      </header>

      {/* Main Workspaces based on steps */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
        
        {/* ==========================================
            STEP 1: Authenticate / Login Mode
            ========================================== */}
        {currentStep === 'auth' && (
          <div className="max-w-md w-full mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100">
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Secure Portal</span>
              <h2 className="text-2xl font-bold mt-3 text-slate-800">
                {isSignUpMode ? 'Create Inventory Account' : 'Sign In to Proceed'}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">
                {isSignUpMode 
                  ? 'Sign up with your college student format to borrow tools.' 
                  : 'Enter your valid pupil credentials or administrator code.'
                }
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Student / Account ID</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Icons.User />
                  </span>
                  <input
                    type="text"
                    value={authForm.studentNumber}
                    onChange={e => setAuthForm({ ...authForm, studentNumber: e.target.value })}
                    placeholder={isSignUpMode ? "e.g., 2023-12345-MN-0" : "Format: 2023-12345-MN-0 or ADMIN"}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                    required
                  />
                </div>
              </div>

              {isSignUpMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Confirm Student Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Icons.User />
                    </span>
                    <input
                      type="text"
                      value={authForm.confirmStudentNumber}
                      onChange={e => setAuthForm({ ...authForm, confirmStudentNumber: e.target.value })}
                      placeholder="Repeat your student number..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Access Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Icons.Key />
                  </span>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                    required
                  />
                </div>
              </div>

              {isSignUpMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Icons.Key />
                    </span>
                    <input
                      type="password"
                      value={authForm.confirmPassword}
                      onChange={e => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-100 mt-6"
              >
                {isSignUpMode ? 'Create Account' : 'Authenticate Access'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3 text-center">
              <button
                onClick={() => setIsSignUpMode(!isSignUpMode)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
              
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Developer Credentials</p>
                <p className="text-xs text-slate-500 font-mono">Student: <span className="font-semibold text-slate-700">2023-12345-MN-0</span> / PW: <span className="font-semibold text-slate-700">12345</span></p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Admin: <span className="font-semibold text-slate-700">ADMIN</span> / PW: <span className="font-semibold text-slate-700">admin123</span></p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            STEP 2: Complete Student Profile info
            ========================================== */}
        {currentStep === 'profile-setup' && (
          <div className="max-w-xl w-full mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100">
            <div className="mb-6 text-center">
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Additional Details Required</span>
              <h2 className="text-2xl font-bold mt-3 text-slate-800 font-sans">Setup Your Profile</h2>
              <p className="text-xs text-slate-400 mt-1">Please configure your default class profile details before borrowing.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Full Borrower's Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">ITech Diploma Course</label>
                <select
                  required
                  value={profileForm.course}
                  onChange={e => setProfileForm({ ...profileForm, course: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                >
                  <option value="" disabled>Choose your diploma...</option>
                  {COURSE_OPTIONS.map((course, idx) => (
                    <option key={idx} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Section & Year</label>
                  <input
                    type="text"
                    required
                    value={profileForm.section}
                    onChange={e => setProfileForm({ ...profileForm, section: e.target.value })}
                    placeholder="e.g., DICT 3-1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Professor / Instructor</label>
                  <input
                    type="text"
                    required
                    value={profileForm.instructor}
                    onChange={e => setProfileForm({ ...profileForm, instructor: e.target.value })}
                    placeholder="e.g., Engr. Robert Smith"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Subject / Course Code</label>
                <input
                  type="text"
                  required
                  value={profileForm.subject}
                  onChange={e => setProfileForm({ ...profileForm, subject: e.target.value })}
                  placeholder="e.g., ME-302 Workshop Practice"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setSession(null)}
                  className="flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 font-semibold py-3.5 rounded-2xl transition-all text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-100 text-sm"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            STEP 3: MAIN WORKSPACES (STUDENT VS ADMIN)
            ========================================== */}
        {currentStep === 'main' && session && (
          <div className="w-full flex flex-col gap-6">
            
            {/* ---------------- STUDENT WORKSPACE ---------------- */}
            {session.role === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Navigation Tabs & Tab Workspaces */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Glass-style Navigation Toggles */}
                  <div className="flex bg-slate-200/60 p-1.5 rounded-2xl max-w-lg w-full gap-1">
                    <button
                      onClick={() => setActiveStudentTab('borrow')}
                      className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        activeStudentTab === 'borrow' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icons.Package />
                      Borrow Equipment
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('returns')}
                      className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative ${
                        activeStudentTab === 'returns' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icons.RotateCcw />
                      Return System
                      {studentActiveBorrows.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                          {studentActiveBorrows.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('history')}
                      className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        activeStudentTab === 'history' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icons.Calendar />
                      Ledger Log
                    </button>
                  </div>

                  {/* TAB 1: BORROW EQUIPMENT WORKSPACE */}
                  {activeStudentTab === 'borrow' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                          <h3 className="text-lg font-extrabold tracking-tight">Active Tool Catalog</h3>
                          
                          <div className="flex gap-2 w-full md:w-auto">
                            <button
                              onClick={() => {
                                setScannerMode('borrow');
                                setIsScannerOpen(true);
                              }}
                              className="px-4 py-2.5 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                            >
                              <Icons.Barcode />
                              Scan Barcode
                            </button>
                          </div>
                        </div>

                        {/* Search & Category Filter Section */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                          <div className="md:col-span-7 relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                              <Icons.Search />
                            </span>
                            <input
                              type="text"
                              placeholder="Search tool by name, identifier, category..."
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-400"
                            />
                          </div>

                          <div className="md:col-span-5 flex overflow-x-auto gap-2 pb-1">
                            {['all', 'Power tools', 'Hand tools', 'Materials'].map((cat, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                                  categoryFilter === cat 
                                    ? 'bg-slate-800 text-white' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {cat === 'all' ? 'All' : cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Grid list of tools */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredTools.map((tool) => (
                            <div 
                              key={tool.id} 
                              onClick={() => addToCart(tool)}
                              className="bg-white border border-slate-100 hover:border-blue-300 rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl select-none">
                                {tool.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{tool.category}</p>
                                <h4 className="text-sm font-bold text-slate-800 truncate mt-0.5">{tool.name}</h4>
                                <p className="text-xs text-slate-400 truncate font-mono mt-1">Barcode: {tool.barcode}</p>
                              </div>
                              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                <Icons.Plus />
                              </div>
                            </div>
                          ))}

                          {filteredTools.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-400">
                              <p className="text-sm">No inventory assets matched your search filter.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: RETURN SYSTEM WORKSPACE */}
                  {activeStudentTab === 'returns' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-lg font-extrabold tracking-tight">Active Borrowed Equipment</h3>
                            <p className="text-xs text-slate-400 mt-1">View currently unreturned tools associated with your profile ID.</p>
                          </div>

                          <button
                            onClick={() => {
                              setScannerMode('return');
                              setIsScannerOpen(true);
                            }}
                            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <Icons.Barcode />
                            Scan Tool to Return
                          </button>
                        </div>

                        {studentActiveBorrows.length === 0 ? (
                          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-200">
                            <span className="text-3xl">🥳</span>
                            <h4 className="font-bold text-slate-700 mt-3">All clear!</h4>
                            <p className="text-xs text-slate-400 mt-1">You currently have no unreturned inventory items on your account.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {studentActiveBorrows.map((txn) => (
                              <div key={txn.transactionId} className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-md">UNRETURNED</span>
                                    <span className="text-xs font-mono font-bold text-slate-600">{txn.transactionId}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-semibold">{new Date(txn.timestamp).toLocaleString()}</span>
                                </div>

                                <div className="p-4 space-y-3">
                                  {txn.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                      <div>
                                        <h5 className="text-sm font-bold text-slate-700">{item.name}</h5>
                                        <p className="text-[10px] text-slate-400 font-mono">Barcode: {item.barcode}</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg">x{item.quantity}</span>
                                        <button
                                          onClick={() => handleReturnItemDirect(txn.transactionId, item.toolId)}
                                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-all"
                                        >
                                          Return
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: TRANSACTION LOG WORKSPACE */}
                  {activeStudentTab === 'history' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-lg font-extrabold tracking-tight mb-4">Historic Transaction Ledger</h3>

                        {studentTxnHistory.length === 0 ? (
                          <p className="text-xs text-slate-400">No previous ledger files found.</p>
                        ) : (
                          <div className="space-y-3">
                            {studentTxnHistory.map((txn, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                                <div>
                                  <p className="text-xs font-mono font-bold text-slate-700">{txn.transactionId}</p>
                                  <p className="text-[10px] text-slate-400">{new Date(txn.timestamp).toLocaleString()}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {txn.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                    txn.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {txn.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Equipment Borrowing Summary Panel (Cart) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col min-h-[480px]">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <h3 className="text-sm font-bold tracking-tight">Borrower's Session Summary</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {session.studentNumber}</p>
                      </div>
                      {cart.length > 0 && (
                        <button
                          onClick={() => setCart([])}
                          className="text-xs text-rose-500 hover:underline font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-300 py-12">
                          <Icons.Package />
                          <p className="text-xs font-medium mt-3 text-slate-400">Empty list. Select assets from the catalog or scan barcode keys.</p>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={item.tool.id} className="flex gap-3 justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-700 truncate">{item.tool.name}</h4>
                              <p className="text-[9px] text-slate-400 uppercase tracking-widest">{item.tool.category}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => updateCartQty(item.tool.id, -1)}
                                className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQty(item.tool.id, 1)}
                                className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs"
                              >
                                +
                              </button>
                              <button 
                                onClick={() => removeFromCart(item.tool.id)}
                                className="w-5 h-5 text-slate-400 hover:text-rose-500 transition-all text-xs flex items-center justify-center"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Verification and Submission */}
                    {cart.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                        <div className={`p-4 rounded-2xl border transition-all ${
                          isVerified 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : 'bg-amber-50/50 border-amber-100 text-amber-700'
                        }`}>
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isVerified}
                              onChange={e => setIsVerified(e.target.checked)}
                              className="mt-0.5 rounded accent-blue-600"
                            />
                            <span className="text-[11px] font-medium leading-relaxed">
                              I verify that the selected inventory list matches my actual hand-carried physical count.
                            </span>
                          </label>
                        </div>

                        <button
                          onClick={handleCheckout}
                          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-blue-50"
                        >
                          Generate Equipment Pass
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ---------------- ADMINISTRATOR WORKSPACE ---------------- */}
            {session.role === 'admin' && (
              <div className="space-y-6">
                {/* Admin Subheader & Tab Switcher */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Admin Control Panel</h2>
                    <p className="text-xs text-slate-400 mt-1">Supervise equipment circulation, catalog, and synchronization settings.</p>
                  </div>

                  <div className="flex bg-slate-200/50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto gap-1">
                    {[
                      { tab: 'dashboard', name: 'Dashboard' },
                      { tab: 'transactions', name: 'Transactions' },
                      { tab: 'inventory', name: 'Inventory DB' },
                      { tab: 'settings', name: 'Sheet Sync' }
                    ].map((t) => (
                      <button
                        key={t.tab}
                        onClick={() => setActiveAdminTab(t.tab)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                          activeAdminTab === t.tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB 1: ANALYTICS DASHBOARD */}
                {activeAdminTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Operations</span>
                        <p className="text-3xl font-extrabold text-slate-800 mt-2">{analytics.totalBorrows}</p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Currently Lent</span>
                        <p className="text-3xl font-extrabold text-amber-500 mt-2">{analytics.activeBorrows}</p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Successfully Handed In</span>
                        <p className="text-3xl font-extrabold text-emerald-500 mt-2">{analytics.returnedBorrows}</p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Active Borrowers</span>
                        <p className="text-3xl font-extrabold text-blue-600 mt-2">{analytics.totalUsers}</p>
                      </div>
                    </div>

                    {/* Simple Graphical Analytics Breakdown using SVG */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Borrowing Share by Category</h4>
                        <div className="flex flex-col gap-4">
                          {Object.entries(analytics.categoryCounts).map(([cat, val], idx) => {
                            const total = Object.values(analytics.categoryCounts).reduce((a, b) => a + b, 0);
                            const percent = ((val / total) * 100).toFixed(1);
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-slate-600">{cat}</span>
                                  <span className="text-slate-800">{val} tools ({percent}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}

                          {Object.keys(analytics.categoryCounts).length === 0 && (
                            <p className="text-xs text-slate-400">Log some transactions to map statistical distributions.</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                        <span className="text-3xl">🤖</span>
                        <h4 className="font-bold text-slate-700 mt-3">Live Sheets Integration Active</h4>
                        <p className="text-xs text-slate-400 max-w-xs mt-1">
                          The system syncs transactions automatically with your specified Google Sheet at:
                        </p>
                        <p className="text-[10px] text-blue-600 font-mono mt-2 select-all max-w-sm truncate bg-blue-50 p-2 rounded-lg border border-blue-100">
                          {sheetSettings.apiUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TRANSACTION LEDGER CONTROL */}
                {activeAdminTab === 'transactions' && (
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-lg font-extrabold tracking-tight">Circulation Ledger Log</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            <th className="py-3.5 px-6">ID / Stamp</th>
                            <th className="py-3.5 px-6">Student ID</th>
                            <th className="py-3.5 px-6">Borrower Name</th>
                            <th className="py-3.5 px-6">Equipments</th>
                            <th className="py-3.5 px-6">Status</th>
                            <th className="py-3.5 px-6 text-center">Action Overrides</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {transactions.map((txn) => (
                            <tr key={txn.transactionId} className="hover:bg-slate-50/50">
                              <td className="py-4 px-6 font-mono font-semibold">
                                <p className="text-slate-700">{txn.transactionId}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{new Date(txn.timestamp).toLocaleString()}</p>
                              </td>
                              <td className="py-4 px-6 font-medium text-slate-600">{txn.studentNumber}</td>
                              <td className="py-4 px-6 font-semibold text-slate-700">{txn.studentName}</td>
                              <td className="py-4 px-6 font-medium text-slate-600">
                                {txn.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${
                                  txn.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {txn.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                {txn.status === 'Active' && (
                                  <button
                                    onClick={() => forceReturnTransaction(txn.transactionId)}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold rounded-xl transition-all"
                                  >
                                    Force Return
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}

                          {transactions.length === 0 && (
                            <tr>
                              <td colSpan="6" className="py-8 text-center text-slate-400">
                                No logged borrowings recorded.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: DYNAMIC INVENTORY DATABASE MANAGER */}
                {activeAdminTab === 'inventory' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Add/Edit Form */}
                    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                        {editingTool ? 'Edit Catalog Tool' : 'Add New Equipment'}
                      </h4>

                      <form onSubmit={handleAddOrEditTool} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tool Unique ID</label>
                          <input
                            type="text"
                            required
                            disabled={!!editingTool}
                            placeholder="e.g., pwr-006"
                            value={newToolForm.id}
                            onChange={e => setNewToolForm({ ...newToolForm, id: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 disabled:bg-slate-100 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Equipment Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Bosch Jigsaw"
                            value={newToolForm.name}
                            onChange={e => setNewToolForm({ ...newToolForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category Group</label>
                          <select
                            required
                            value={newToolForm.category}
                            onChange={e => setNewToolForm({ ...newToolForm, category: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-semibold"
                          >
                            <option value="Power tools">Power tools</option>
                            <option value="Hand tools">Hand tools</option>
                            <option value="Materials">Materials</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unique Barcode Key</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., 8800112299"
                            value={newToolForm.barcode}
                            onChange={e => setNewToolForm({ ...newToolForm, barcode: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Emoji / Icon Symbol</label>
                          <input
                            type="text"
                            required
                            placeholder="🔧"
                            value={newToolForm.icon}
                            onChange={e => setNewToolForm({ ...newToolForm, icon: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Short Description</label>
                          <textarea
                            placeholder="Specification details..."
                            value={newToolForm.description}
                            onChange={e => setNewToolForm({ ...newToolForm, description: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder-slate-300 h-16 resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          {editingTool && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTool(null);
                                setNewToolForm({ id: '', name: '', barcode: '', category: 'Power tools', icon: '🔧', description: '', specs: '' });
                              }}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md shadow-blue-50"
                          >
                            {editingTool ? 'Save Edit' : 'Add Tool'}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Inventory Table List */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Stock list database</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                              <th className="py-2 px-4">Tool</th>
                              <th className="py-2 px-4">Category</th>
                              <th className="py-2 px-4">Barcode Key</th>
                              <th className="py-2 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {tools.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-50/50">
                                <td className="py-3 px-4 font-bold text-slate-700">{t.name}</td>
                                <td className="py-3 px-4 text-slate-500">{t.category}</td>
                                <td className="py-3 px-4 font-mono font-medium text-slate-400">{t.barcode}</td>
                                <td className="py-3 px-4 text-right space-x-2">
                                  <button
                                    onClick={() => startEditTool(t)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-[10px] font-bold transition-all"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteTool(t.id)}
                                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 text-[10px] font-bold transition-all"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: SHEET SYNC PREFERENCES */}
                {activeAdminTab === 'settings' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-lg font-extrabold tracking-tight mb-4">Google Sheet API Integration</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                      Sync logged borrowings and hand-ins in real-time. Input your Web App deployment links obtained from Google Apps Script.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Spreadsheet ID</label>
                        <input
                          type="text"
                          value={sheetSettings.spreadsheetId}
                          onChange={e => {
                            setSheetSettings({ ...sheetSettings, spreadsheetId: e.target.value });
                            localStorage.setItem('invent_sheet_id', e.target.value);
                          }}
                          placeholder="e.g., 1A2B3C4D5E..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tab Worksheet Name</label>
                        <input
                          type="text"
                          value={sheetSettings.tabName}
                          onChange={e => {
                            setSheetSettings({ ...sheetSettings, tabName: e.target.value });
                            localStorage.setItem('invent_sheet_tab', e.target.value);
                          }}
                          placeholder="Inventory"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deployment Script Execution Web-App URL</label>
                        <input
                          type="url"
                          value={sheetSettings.apiUrl}
                          onChange={e => {
                            setSheetSettings({ ...sheetSettings, apiUrl: e.target.value });
                            localStorage.setItem('invent_api_url', e.target.value);
                          }}
                          placeholder="https://script.google.com/macros/s/.../exec"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => showToast('Configuration changes updated!', 'success')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md"
                      >
                        Save Configuration Setup
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ==========================================
            STEP 4: Equipment borrowing receipt pass
            ========================================== */}
        {currentStep === 'receipt' && lastTxn && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative">
              
              {/* Apple-wallet style digital card header */}
              <div className="bg-slate-900 text-white px-6 py-6 text-center">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  AUTHORIZATION PASS
                </span>
                <h3 className="text-xl font-bold mt-4 tracking-tight">Equipment Borrowing Pass</h3>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-1">ID: {lastTxn.transactionId}</p>
              </div>

              {/* Punch-out receipt separator strip */}
              <div className="h-0 border-t-2 border-dashed border-slate-200 relative mx-4">
                <div className="absolute -left-7 -top-2.5 w-5 h-5 bg-slate-50 border-r border-slate-200 rounded-full"></div>
                <div className="absolute -right-7 -top-2.5 w-5 h-5 bg-slate-50 border-l border-slate-200 rounded-full"></div>
              </div>

              <div className="p-6 space-y-6">
                {/* Borrower Information Block */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                    BORROWER DETAILS
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">NAME</p>
                      <p className="font-bold text-slate-700 truncate mt-0.5">{lastTxn.studentName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">STUDENT ID</p>
                      <p className="font-mono font-bold text-slate-700 truncate mt-0.5">{lastTxn.studentNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">COURSE / SECTION</p>
                      <p className="font-bold text-slate-700 truncate mt-0.5">{lastTxn.course} - {lastTxn.section}</p>
                    </div>
                  </div>
                </div>

                {/* Date & Course Details */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                    CIRCULATION METRICS
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">TIMESTAMP</p>
                      <p className="font-bold text-slate-700 mt-0.5">{new Date(lastTxn.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">SUBJECT CODE</p>
                      <p className="font-bold text-slate-700 mt-0.5">{lastTxn.subject}</p>
                    </div>
                  </div>
                </div>

                {/* Items Block */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                    AUTHORIZED INVENTORY LIST
                  </h4>
                  <div className="space-y-2 text-xs">
                    {lastTxn.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                        <span className="font-bold text-slate-700 truncate mr-2">{item.name}</span>
                        <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 shrink-0">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Barcode graphic */}
                <div className="pt-4 flex flex-col items-center justify-center border-t border-slate-100">
                  <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,#1e293b,#1e293b_3px,#ffffff_3px,#ffffff_9px,#1e293b_9px,#1e293b_10px,#ffffff_10px,#ffffff_14px)] opacity-90 rounded"></div>
                  <p className="text-[10px] font-mono tracking-[4px] uppercase text-slate-400 mt-2 font-bold">{lastTxn.transactionId}</p>
                </div>

              </div>
            </div>

            <button
              onClick={() => {
                setLastTxn(null);
                setCurrentStep('main');
                setActiveStudentTab('returns'); // Show current returns instantly
                showToast('Equipment checkout validated successfully!', 'success');
              }}
              className="w-full bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md"
            >
              Done & Return to Workspace
            </button>
          </div>
        )}

      </main>

      {/* ==========================================
          BARCODE / QR SCANNING MODAL WINDOW
          ========================================== */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-slate-100">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold tracking-tight">
                  {scannerMode === 'borrow' ? 'Scan to Borrow list' : 'Scan to Hand-In Equipment'}
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Live Scan Interface</p>
              </div>
              <button
                onClick={() => {
                  setManualBarcode('');
                  setIsScannerOpen(false);
                }}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dynamic Camera Feed Container */}
              <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex flex-col items-center justify-center text-white">
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900 z-20">
                    <span className="text-2xl mb-2">⚠️</span>
                    <p className="text-xs text-rose-400 font-semibold">{cameraError}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Dynamic simulated triggers are fully operational below.</p>
                  </div>
                ) : (
                  <>
                    {/* Live HTML5-QRCode Viewport */}
                    <div id="react-scan-camera-feed" className="absolute inset-0 w-full h-full object-cover z-10" />

                    {/* Moving red laser line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-[bounce_2s_infinite_ease-in-out] z-20 pointer-events-none"></div>

                    {/* Reticle guide brackets */}
                    <div className="absolute inset-8 border border-white/25 rounded-xl z-20 pointer-events-none">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br"></div>
                    </div>

                    {!isCameraActive && (
                      <span className="text-slate-400 text-center text-[10px] uppercase font-bold tracking-widest z-20 px-8">
                        Initializing Camera Feed...
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Direct Barcode Entry Simulator fallback */}
              <div className="space-y-3 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider pl-1">Choose Simulated Tool (Quick Scan)</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pb-1">
                    {tools.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => triggerManualScan(t.barcode)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-600 transition-all text-left"
                      >
                        {t.icon} {t.name} <span className="font-mono text-slate-400">({t.barcode})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-2"></div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 pl-1">Or enter barcode manually</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type tool barcode number..."
                      value={manualBarcode}
                      onChange={e => setManualBarcode(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                    <button
                      onClick={() => triggerManualScan()}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shrink-0"
                    >
                      Trigger
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Primary Apple-style subtle Footer */}
      <footer className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200/50 mt-12 bg-white rounded-t-3xl max-w-7xl w-full mx-auto shadow-sm">
        <p>&copy; 2026 ITech Department Polytechnic University. All Rights Reserved.</p>
      </footer>
    </div>
  );
}