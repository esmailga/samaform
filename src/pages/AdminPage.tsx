import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, Settings, LogOut, Download, Trash2, Edit, Plus, X, Save, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { useLanguage } from '../context/LanguageContext';
import { convertWesternToArabic } from '../utils/numbers';

const GLASS_CLASSES = "bg-header/40 backdrop-blur-xl border border-white/10";

export default function AdminPage() {
  const { t, lang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [activeSection, setActiveSection] = useState<'responses' | 'edit-form'>('responses');
  const [responses, setResponses] = useState<any[]>([]);
  const [formConfig, setFormConfig] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';


  const saveFormConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/form/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formConfig),
      });
      if (res.ok) alert('Form configuration saved successfully!');
    } catch (err) {
      console.error('Failed to save form config');
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => {
    const newStep = {
      id: (formConfig?.steps?.length || 0) + 1,
      name: `step${(formConfig?.steps?.length || 0) + 1}`,
      title: "New Step Title",
      description: "New Step Description",
      fields: []
    };
    setFormConfig({ ...formConfig, steps: [...(formConfig?.steps || []), newStep] });
  };

  const removeStep = (index: number) => {
    const newSteps = [...formConfig.steps];
    newSteps.splice(index, 1);
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...formConfig.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const addField = (stepIndex: number) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "New Field Label",
      placeholder: "New Field Placeholder",
      required: false
    };
    const newSteps = [...formConfig.steps];
    newSteps[stepIndex].fields = [...newSteps[stepIndex].fields, newField];
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    const newSteps = [...formConfig.steps];
    newSteps[stepIndex].fields.splice(fieldIndex, 1);
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const updateField = (stepIndex: number, fieldIndex: number, prop: string, value: any) => {
    const newSteps = [...formConfig.steps];
    newSteps[stepIndex].fields[fieldIndex] = { ...newSteps[stepIndex].fields[fieldIndex], [prop]: value };
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const addOption = (stepIndex: number, fieldIndex: number) => {
    const newOption = { id: `opt_${Date.now()}`, label: "New Option" };
    const newSteps = [...formConfig.steps];
    newSteps[stepIndex].fields[fieldIndex].options = [...(newSteps[stepIndex].fields[fieldIndex].options || []), newOption];
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const removeOption = (stepIndex: number, fieldIndex: number, optionIndex: number) => {
    const newSteps = [...formConfig.steps];
    newSteps[stepIndex].fields[fieldIndex].options.splice(optionIndex, 1);
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  const updateOption = (stepIndex: number, fieldIndex: number, optionIndex: number, value: string) => {
    const newSteps = [...formConfig.steps];
    newSteps[stepIndex].fields[fieldIndex].options[optionIndex].label = value;
    setFormConfig({ ...formConfig, steps: newSteps });
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchResponses();
      fetchFormConfig();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  const fetchResponses = async () => {
    try {
      const res = await fetch('/api/admin/responses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setResponses(data);
    } catch (err) {
      console.error('Failed to fetch responses');
    }
  };

  const fetchFormConfig = async () => {
    try {
      const res = await fetch('/api/form/config');
      const data = await res.json();
      if (res.ok) setFormConfig(data.config);
    } catch (err) {
      console.error('Failed to fetch form config');
    }
  };

  const deleteResponse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this response?')) return;
    try {
      const res = await fetch(`/api/admin/responses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchResponses();
    } catch (err) {
      console.error('Failed to delete response');
    }
  };

  const exportToExcel = () => {
    const flatData = responses.map(r => {
      const data: any = {
        ID: r.id,
        Date: new Date(r.created_at).toLocaleString(),
      };
      
      const translateValue = (val: any) => {
        if (!val) return '';
        let result = '';
        if (Array.isArray(val)) {
          result = val.map(v => t(v as any) || v).join(' , ');
        } else {
          result = t(val as any) || val;
        }
        return lang === 'ar' ? convertWesternToArabic(String(result)) : result;
      };

      Object.entries(r.data).forEach(([key, value]) => {
        if (!['inspirationImages', 'currentSpaceImages'].includes(key) && value) {
          const label = key.replace(/([A-Z])/g, ' $1').trim();
          if (typeof value === 'object') {
            Object.entries(value as any).forEach(([subKey, subValue]) => {
              if (subValue) {
                const subLabel = subKey.replace(/([A-Z])/g, ' $1').trim();
                data[`${label}_${subLabel}`] = translateValue(subValue);
              }
            });
          } else {
            data[label] = translateValue(value);
          }
        }
      });
      return data;
    });
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, "form_responses.xlsx");
  };

  const exportToPDF = async (response?: any) => {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    const getBase64Image = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
      });
    };


    if (response) {
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Date: ${new Date(response.created_at).toLocaleString()}`, pageWidth - 15, 50, { align: 'right' });
      
      doc.setFontSize(22);
      doc.setTextColor(0);
      doc.text("Your Plan", 15, 50);
      
      let yPos = 65;
      const sections = getStructuredData(response.data);
      
      sections.forEach(section => {
        if (section.fields.length > 0) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFontSize(14);
          doc.setTextColor(180, 150, 100); // Main text color
          doc.text(section.title, 15, yPos);
          yPos += 8;
          
          doc.setFontSize(10);
          doc.setTextColor(50);
          section.fields.forEach(field => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(`${field.label}: ${field.value}`, 20, yPos);
            yPos += 6;
          });
          yPos += 5;
        }
      });

      // Add Images
      const addImageSection = async (title: string, images: any[]) => {
        if (!images || images.length === 0) return;
        
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(180, 150, 100);
        doc.text(title, 15, yPos);
        yPos += 10;
        
        const imgSize = 40;
        const margin = 10;
        let xPos = 15;
        
        for (const imgUrl of images) {
          try {
            const base64 = await getBase64Image(imgUrl);
            if (xPos + imgSize > pageWidth - 15) {
              xPos = 15;
              yPos += imgSize + margin;
            }
            if (yPos + imgSize > 280) {
              doc.addPage();
              yPos = 20;
              xPos = 15;
            }
            doc.addImage(base64, 'JPEG', xPos, yPos, imgSize, imgSize);
            xPos += imgSize + margin;
          } catch (e) {
            console.error(`Failed to add image ${imgUrl} to PDF`, e);
          }
        }
        yPos += imgSize + margin;
      };

      await addImageSection("Inspiration Images", response.data.inspirationImages);
      await addImageSection("Current Space Images", response.data.currentSpaceImages);
      
      doc.save(`plan_${response.data.name}_${response.id}.pdf`);
    }
  };

  function getStructuredData(data: any) {
    const translateValue = (val: any) => {
      if (!val) return '';
      let result = '';
      if (Array.isArray(val)) {
        result = val.map(v => t(v as any) || v).join(', ');
      } else {
        result = t(val as any) || val;
      }
      return lang === 'ar' ? convertWesternToArabic(String(result)) : result;
    };

    const sections = [
      {
        title: "Client Information",
        fields: [
          { label: "Name", value: data.name },
          { label: "Email", value: data.email },
          { label: "Phone", value: data.phone },
          { label: "City", value: data.city },
        ]
      },
      {
        title: "Project Overview",
        fields: [
          { label: "Type", value: translateValue(data.projectType) },
          { label: "Budget ($)", value: translateValue(data.budgetTier) || data.budgetExact },
          { label: "Area (SQM)", value: translateValue(data.areaTier) || data.areaExact },
          { label: "Timeline", value: translateValue(data.timeline) },
          { label: "Design Style", value: translateValue(data.designType) },
          { label: "Architectural Style", value: translateValue(data.architecturalStyle) },
        ]
      },
      {
        title: "Priorities & Outdoor",
        fields: [
          { label: "Priorities", value: translateValue(data.priorityType) },
          { label: "Outdoor Area", value: translateValue(data.outdoorType) },
          { label: "Balcony", value: translateValue(data.balconyAns) },
        ]
      },
      {
        title: "Project Specifics",
        fields: [
          { label: "Project Details", value: data.projectDetails, fullWidth: true },
          { label: "Apartment Details", value: data.apartmentDetails, fullWidth: true },
          { label: "Villa Details", value: data.villaDetails, fullWidth: true },
          { label: "Floors Count", value: translateValue(data.floorsCount) },
          { label: "Room Count", value: translateValue(data.roomCount) || data.roomCountExact },
          { label: "Shop Type", value: translateValue(data.shopType) },
          { label: "Atmosphere", value: translateValue(data.atmoshpere) },
          { label: "Features", value: translateValue(data.featuresType) },
          { label: "Shop Details", value: data.shopDetails, fullWidth: true },
          { label: "Cuisine Type", value: translateValue(data.cuisineType) },
          { label: "Seating Capacity", value: translateValue(data.seatingCapacity) },
          { label: "Space Wanted", value: translateValue(data.spaceWanted) },
          { label: "Space Details", value: data.spaceDetails, fullWidth: true },
          { label: "Employee Count", value: translateValue(data.employeeCount) },
          { label: "Work Environment", value: translateValue(data.workEnvironment) },
          { label: "Amenities Wanted", value: translateValue(data.amenitiesWanted) },
          { label: "Office Details", value: data.officeDetails, fullWidth: true },
          { label: "Salon Services", value: translateValue(data.salonServices) },
          { label: "Stations Count", value: translateValue(data.stationsCount) },
          { label: "Ambiance", value: translateValue(data.ambiance) },
          { label: "Salon Details", value: data.salonDetails, fullWidth: true },
        ]
      },
      {
        title: "Additional Specifics",
        fields: Object.entries(data.specifics || {}).map(([key, value]) => ({
          label: key.replace(/([A-Z])/g, ' $1').trim(),
          value: translateValue(value)
        }))
      }
    ];

    // Filter out empty values
    return sections.map(section => ({
      ...section,
      fields: section.fields.filter(f => f.value && f.value !== '')
    }));
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-header flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md p-8 rounded-3xl ${GLASS_CLASSES}`}
        >
          <h1 className="text-3xl text-main-text mb-6 text-center">Admin Portal</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-main-text"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-main-text"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-main-text text-header font-medium py-4 rounded-xl hover:bg-main-text/90 transition-colors"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className={`h-20 flex items-center px-4 md:px-8 border-b border-white/10 ${GLASS_CLASSES} sticky top-0 z-50`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
          </button>
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
              <Logo showText={true} noAnim={!isHome} />
            </Link>
        </div>
        
        <button 
          onClick={handleLogout}
          className="absolute right-4 md:right-8 flex items-center gap-2 px-3 md:px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-xs md:text-sm font-medium"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar / Navigation */}
        <div className={`
          fixed inset-0 z-40 md:relative md:z-0
          w-64 bg-header border-r border-white/10 p-6 flex flex-col gap-3
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0 mt-17' : '-translate-x-full md:translate-x-0'}
        `}>
          <button 
            onClick={() => { setActiveSection('responses'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeSection === 'responses' ? 'bg-main-text text-header' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">Responses</span>
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-header/30">
          <AnimatePresence mode="wait">
            {activeSection === 'responses' ? (
              <motion.div 
                key="responses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl text-main-text">Form Responses</h2>
                    <p className="text-white/40 text-sm mt-1">Manage and view all project inquiries</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={fetchResponses} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm">
                      <RefreshCw size={18} />
                      Refresh
                    </button>
                    <button onClick={exportToExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all text-sm">
                      <Download size={18} />
                      Excel
                    </button>
                  </div>
                </div>

                <div className={`rounded-2xl overflow-x-auto ${GLASS_CLASSES}`}>
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/80">Date</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/80">Name</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/80">Project</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/80">Budget</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/80">Area</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/80 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {responses.map((r) => (
                        <tr 
                          key={r.id} 
                          className="hover:bg-main-text/20 transition-colors cursor-pointer group"
                          onClick={() => setSelectedResponse(r)}
                        >
                          <td className="px-6 py-4 text-sm text-white/80">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm font-medium text-white/90">{r.data.name}</td>
                          <td className="px-6 py-4 text-sm text-white/80 capitalize">{r.data.projectType}</td>
                          <td className="px-6 py-4 text-sm text-white/80">{r.data.budgetTier || r.data.budgetExact}</td>
                          <td className="px-6 py-4 text-sm text-white/80">{r.data.areaTier || r.data.areaExact}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteResponse(r.id);
                                }}
                                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Response Detail Modal */}
                <AnimatePresence>
                  {selectedResponse && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm"
                      onClick={() => setSelectedResponse(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl ${GLASS_CLASSES} p-4 md:p-8`}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h3 className="text-2xl md:text-3xl text-main-text mb-2">Response Details</h3>
                            <p className="text-white/40 text-sm">Submitted on {new Date(selectedResponse.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => exportToPDF(selectedResponse)}
                              className="p-6 flex justify-between gap-3 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 transition-colors"
                              title="Save as PDF"
                            >
                              <Download size={20} />
                              PDF
                            </button>
                            <button 
                              onClick={() => setSelectedResponse(null)}
                              className="p-4 rounded-full"
                            >
                              <X size={24} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {getStructuredData(selectedResponse.data).map((section, sIdx) => (
                            section.fields.length > 0 && (
                              <section key={sIdx} className="space-y-4">
                                <h4 className="text-xs uppercase tracking-widest text-main-text mb-4 border-b border-main-text/20 pb-2">{section.title}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {section.fields.map((field: any, fIdx) => (
                                    <DetailItem key={fIdx} label={field.label} value={String(field.value)} fullWidth={field.fullWidth} />
                                  ))}
                                </div>
                              </section>
                            )
                          ))}
                        </div>

                        {/* Images Section */}
                        <div className="mt-12 space-y-8">
                          <ImageSection title="Inspiration Images" images={selectedResponse.data.inspirationImages} />
                          <ImageSection title="Current Space Images" images={selectedResponse.data.currentSpaceImages} />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                key="edit-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl text-main-text">Edit Plan Form</h2>
                <button 
                  onClick={saveFormConfig}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-main-text text-header rounded-xl hover:bg-main-text/90 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="space-y-8">
                {formConfig?.steps?.map((step: any, sIdx: number) => (
                  <div key={sIdx} className={`p-6 rounded-3xl ${GLASS_CLASSES} relative`}>
                    <button 
                      onClick={() => removeStep(sIdx)}
                      className="absolute top-6 right-6 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Step Title</label>
                        <input 
                          type="text" 
                          value={step.title}
                          onChange={e => updateStep(sIdx, 'title', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-main-text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Step Description</label>
                        <input 
                          type="text" 
                          value={step.description}
                          onChange={e => updateStep(sIdx, 'description', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-main-text"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-main-text uppercase tracking-widest">Fields</h4>
                      {step.fields.map((field: any, fIdx: number) => (
                        <div key={fIdx} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Label</label>
                                <input 
                                  type="text" 
                                  value={field.label}
                                  onChange={e => updateField(sIdx, fIdx, 'label', e.target.value)}
                                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Type</label>
                                <select 
                                  value={field.type}
                                  onChange={e => updateField(sIdx, fIdx, 'type', e.target.value)}
                                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white"
                                >
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Phone</option>
                                  <option value="radio">Radio/Buttons</option>
                                  <option value="textarea">Textarea</option>
                                  <option value="number">Number</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Placeholder</label>
                                <input 
                                  type="text" 
                                  value={field.placeholder || ''}
                                  onChange={e => updateField(sIdx, fIdx, 'placeholder', e.target.value)}
                                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={() => removeField(sIdx, fIdx)}
                              className="ml-4 p-2 text-white/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          {field.type === 'radio' && (
                            <div className="pl-4 border-l border-white/10 space-y-2">
                              <label className="block text-[10px] uppercase tracking-widest text-white/40">Options</label>
                              <div className="flex flex-wrap gap-2">
                                {field.options?.map((opt: any, oIdx: number) => (
                                  <div key={oIdx} className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                                    <input 
                                      type="text" 
                                      value={opt.label}
                                      onChange={e => updateOption(sIdx, fIdx, oIdx, e.target.value)}
                                      className="bg-transparent border-none text-xs text-white focus:outline-none w-24"
                                    />
                                    <button onClick={() => removeOption(sIdx, fIdx, oIdx)} className="text-white/20 hover:text-red-400">
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}
                                <button 
                                  onClick={() => addOption(sIdx, fIdx)}
                                  className="flex items-center gap-1 px-3 py-1 bg-main-text/10 text-main-text rounded-full border border-main-text/20 text-xs hover:bg-main-text/20"
                                >
                                  <Plus size={12} />
                                  Add Option
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <button 
                        onClick={() => addField(sIdx)}
                        className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-white/40 hover:text-main-text hover:border-main-text/40 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Field
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addStep}
                  className="w-full py-6 border-2 border-dashed border-main-text/20 rounded-3xl text-main-text/60 hover:text-main-text hover:bg-main-text/5 transition-all flex flex-col items-center justify-center gap-2"
                >
                  <Plus size={32} />
                  <span className="text-xl">Add New Step</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
  );
}

function DetailItem({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean, key?: any }) {
  if (!value) return null;
  return (
    <div className={`flex flex-col ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>
      <span className="text-sm text-white/80 font-medium whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function ImageSection({ title, images }: { title: string, images: any[] }) {
  if (!images || images.length === 0) return null;
  return (
    <section>
      <h4 className="text-xs uppercase tracking-widest text-main-text mb-4 border-b border-main-text/20 pb-2">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 group relative">
            <img 
              src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => window.open(typeof img === 'string' ? img : URL.createObjectURL(img), '_blank')}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
