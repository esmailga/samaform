import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, LogOut, Download, Trash2, X, RefreshCw, Eye, UserCog, Images, ListChecks } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ProjectsManager from '../components/admin/ProjectsManager';
import FormEditor from '../components/admin/FormEditor';
import { DEFAULT_FORM, fetchFormLibrary } from '../form/useFormSchema';
import { describeResponse, exportResponsesToExcel, exportResponseToPDF, parseSubmitted, responseValue, referenceNumber, type FormLibrary, type ResponseRecord } from '../components/admin/responseExport';

const GLASS_CLASSES = "bg-header/40 backdrop-blur-xl border border-white/10";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);
  const [error, setError] = useState('');
  const [responsesError, setResponsesError] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<ResponseRecord | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'form' | 'responses'>('responses');
  // The current form and every saved version, used to label answers (see responseExport.ts)
  const [formLib, setFormLib] = useState<FormLibrary | null>(null);
  const [isChangeCredsModalOpen, setIsChangeCredsModalOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchResponses();
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
      // An expired login (tokens last 24 hours) returns 401: send the admin back to the login screen
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResponses(await res.json());
      setResponsesError('');
      // Labels for answers come from the editable form; fall back to the built-in form if versions can't load
      setFormLib(await fetchFormLibrary(token).catch(() => ({ current: DEFAULT_FORM, versions: { 0: DEFAULT_FORM } })));
    } catch (err) {
      setResponsesError('Could not load responses. Check that the API server is running (npm run api), then press Refresh.');
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

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingCreds(true);
    try {
      const res = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername: newAdminUsername, newPassword: newAdminPassword }),
      });
      if (res.ok) {
        alert('Credentials updated successfully. Logging out...');
        handleLogout();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update credentials');
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  const lib: FormLibrary = formLib ?? { current: DEFAULT_FORM, versions: { 0: DEFAULT_FORM } };

  const handleExcelExport = async () => {
    if (responses.length === 0) return alert('There are no responses to export yet.');
    setExporting('excel');
    try {
      await exportResponsesToExcel(responses, lib);
    } catch (err) {
      console.error(err);
      alert('Could not create the Excel file. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handlePdfExport = async (response: ResponseRecord) => {
    setExporting('pdf');
    try {
      await exportResponseToPDF(response, lib);
    } catch (err) {
      console.error(err);
      alert('Could not create the PDF. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div dir="ltr" lang="en" className="min-h-screen bg-header flex items-center justify-center p-4">
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
    // The admin is an English, left-to-right tool whatever language the public site is in
    <div dir="ltr" lang="en" className="min-h-screen flex flex-col">
      <nav className={`h-20 flex items-center justify-between gap-4 px-4 md:px-8 border-b border-white/10 ${GLASS_CLASSES} sticky top-0 z-50`}>
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
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-xs md:text-sm font-medium"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      <div className="flex flex-1 relative">
        {/* Sidebar / Navigation */}
        <div className={`
          fixed top-20 bottom-0 left-0 z-40 md:sticky md:z-0 md:self-start md:h-[calc(100dvh-5rem)] md:shrink-0
          w-64 bg-header border-r border-white/10 p-6 flex flex-col gap-3
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {([
            { id: 'projects', label: 'Projects', icon: Images },
            { id: 'form', label: 'Form', icon: ListChecks },
            { id: 'responses', label: 'Responses', icon: FileText },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === id ? 'bg-main-text text-header' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 md:p-8 bg-header/30">
          {activeTab === 'projects' ? (
            <ProjectsManager token={token} onUnauthorized={handleLogout} />
          ) : activeTab === 'form' ? (
            <FormEditor token={token} onUnauthorized={handleLogout} onPublished={fetchResponses} />
          ) : (
          <motion.div 
            key="responses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl text-main-text">Form Responses</h2>
                <p className="text-white/40 text-sm mt-1">Manage and view all project inquiries</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setIsChangeCredsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm">
                  <UserCog size={18} />
                  Credentials
                </button>
                <button onClick={fetchResponses} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm">
                  <RefreshCw size={18} />
                  Refresh
                </button>
                <button onClick={handleExcelExport} disabled={exporting === 'excel'} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all text-sm disabled:opacity-60">
                  <Download size={18} />
                  {exporting === 'excel' ? 'Exporting...' : 'Excel'}
                </button>
              </div>
            </div>

            {responsesError && <p className="mb-4 text-sm text-red-400">{responsesError}</p>}
            <div className={`rounded-2xl overflow-x-auto ${GLASS_CLASSES}`}>
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs uppercase tracking-widest text-white/80">Date</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs uppercase tracking-widest text-white/80">Name</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs uppercase tracking-widest text-white/80">Project</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs uppercase tracking-widest text-white/80">Budget</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs uppercase tracking-widest text-white/80">Area</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs uppercase tracking-widest text-white/80 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {responses.map((r) => (
                    <tr 
                      key={r.id} 
                      className="hover:bg-main-text/20 transition-colors cursor-pointer group"
                      onClick={() => setSelectedResponse(r)}
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-white/80">{parseSubmitted(r.created_at).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-white/90">{r.data.name}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-white/80">{responseValue(r, lib, 'projectType')}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-white/80">{responseValue(r, lib, 'budgetTier')}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-white/80">{responseValue(r, lib, 'areaTier')}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">
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
              {isChangeCredsModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsChangeCredsModalOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`w-full max-w-md rounded-3xl ${GLASS_CLASSES} p-8`}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl text-main-text">Update Credentials</h3>
                      <button onClick={() => setIsChangeCredsModalOpen(false)} className="text-white/40 hover:text-white">
                        <X size={24} />
                      </button>
                    </div>
                    <form onSubmit={handleUpdateCredentials} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">New Username</label>
                        <input 
                          type="text" 
                          value={newAdminUsername}
                          onChange={e => setNewAdminUsername(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-main-text"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">New Password</label>
                        <input 
                          type="password" 
                          value={newAdminPassword}
                          onChange={e => setNewAdminPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-main-text"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isUpdatingCreds}
                        className="w-full bg-main-text text-header font-medium py-4 rounded-xl hover:bg-main-text/90 transition-colors disabled:opacity-50"
                      >
                        {isUpdatingCreds ? 'Updating...' : 'Update & Logout'}
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}

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
                        <p className="text-white/40 text-sm">{referenceNumber(selectedResponse.id)} · Submitted on {parseSubmitted(selectedResponse.created_at).toLocaleString('en-GB')}</p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handlePdfExport(selectedResponse)}
                          disabled={exporting === 'pdf'}
                          className="px-5 py-3 flex items-center gap-2 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 transition-colors text-sm disabled:opacity-60"
                          title="Save as PDF"
                        >
                          <Download size={18} />
                          {exporting === 'pdf' ? 'Preparing...' : 'PDF'}
                        </button>
                        <button 
                          onClick={() => setSelectedResponse(null)}
                          className="p-4 rounded-full"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const { sections, images } = describeResponse(selectedResponse, lib);
                      return (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sections.map((section) => (
                              <section key={section.title} className="space-y-4">
                                <h4 className="text-xs uppercase tracking-widest text-main-text mb-4 border-b border-main-text/20 pb-2">{section.title}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {section.fields.map((field) => (
                                    <DetailItem key={field.id} label={field.label} value={field.value} fullWidth={field.long} />
                                  ))}
                                </div>
                              </section>
                            ))}
                          </div>
                          <div className="mt-12 space-y-8">
                            {images.map((group) => <ImageSection key={group.id} title={group.title} images={group.urls} />)}
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          )}
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
      <span dir="auto" className="text-sm text-white/80 font-medium whitespace-pre-wrap text-start">{value}</span>
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
                <Eye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
