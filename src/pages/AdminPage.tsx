import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, Settings, LogOut, Download, Trash2, Edit, Plus, X, Save, ChevronRight, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const GLASS_CLASSES = "bg-header/40 backdrop-blur-xl border border-white/10";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [activeSection, setActiveSection] = useState<'responses' | 'edit-form'>('responses');
  const [responses, setResponses] = useState<any[]>([]);
  const [formConfig, setFormConfig] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

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
    const flatData = responses.map(r => ({
      ID: r.id,
      Date: new Date(r.created_at).toLocaleString(),
      ...r.data
    }));
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, "form_responses.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF() as any;
    doc.text("Form Responses", 14, 15);
    
    const tableData = responses.map(r => [
      r.id,
      new Date(r.created_at).toLocaleDateString(),
      r.data.name,
      r.data.email,
      r.data.phone,
      r.data.projectType
    ]);

    doc.autoTable({
      head: [['ID', 'Date', 'Name', 'Email', 'Phone', 'Project Type']],
      body: tableData,
      startY: 20,
    });
    doc.save("form_responses.pdf");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-header flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md p-8 rounded-3xl ${GLASS_CLASSES}`}
        >
          <h1 className="text-3xl font-serif text-main-text mb-6 text-center">Admin Portal</h1>
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
    <div className="min-h-screen bg-header flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-main-text rounded-lg flex items-center justify-center text-header">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-serif text-xl text-main-text">Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveSection('responses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeSection === 'responses' ? 'bg-main-text text-header' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <FileText size={20} />
            <span>Responses</span>
          </button>
          <button 
            onClick={() => setActiveSection('edit-form')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeSection === 'edit-form' ? 'bg-main-text text-header' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Settings size={20} />
            <span>Edit Form</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === 'responses' ? (
            <motion.div 
              key="responses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-main-text">Form Responses</h2>
                <div className="flex gap-3">
                  <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all">
                    <Download size={18} />
                    Excel
                  </button>
                  <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all">
                    <Download size={18} />
                    PDF
                  </button>
                </div>
              </div>

              <div className={`rounded-2xl overflow-hidden ${GLASS_CLASSES}`}>
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Date</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Name</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Project</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Budget</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {responses.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-white/60">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">{r.data.name}</td>
                        <td className="px-6 py-4 text-sm text-white/60 capitalize">{r.data.projectType}</td>
                        <td className="px-6 py-4 text-sm text-white/60">{r.data.budgetTier || r.data.budgetExact}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteResponse(r.id)}
                            className="p-2 text-white/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="edit-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-main-text">Edit Form Structure</h2>
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
                  <span className="font-serif text-xl">Add New Step</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
