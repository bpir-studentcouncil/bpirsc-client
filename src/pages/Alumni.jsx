import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Users, Search, UserCheck, CreditCard, Award, GraduationCap, 
  MapPin, Phone, Mail, Building, Upload, ShieldAlert, CheckCircle2 
} from 'lucide-react';

const Alumni = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('directory');
  
  // Directory state
  const [directory, setDirectory] = useState([]);
  const [loadingDirectory, setLoadingDirectory] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  // Registration form state
  const [formData, setFormData] = useState({
    fullName: '',
    department: 'Computer',
    session: '',
    studentId: '',
    phone: '',
    email: '',
    currentOccupation: '',
    company: '',
    higherEducation: '',
    address: '',
    profilePhoto: '',
    paymentTrxId: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submittingForm, setSubmittingForm] = useState(false);
  const [myRegistration, setMyRegistration] = useState(null);

  const departments = [
    'Computer', 'Civil', 'Electrical', 'Mechanical', 'Electronics', 'Power', 'Electro-Medical'
  ];

  useEffect(() => {
    if (activeTab === 'directory') {
      fetchDirectory();
    } else if (activeTab === 'register' && currentUser) {
      fetchMyStatus();
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name || '',
        email: currentUser.email || ''
      }));
    }
  }, [activeTab, filterDept, filterSession]);

  const fetchDirectory = async () => {
    setLoadingDirectory(true);
    try {
      const data = await api.getAlumniDirectory({
        department: filterDept,
        session: filterSession,
        search: search
      });
      setDirectory(data);
    } catch (err) {
      console.error('Error fetching alumni directory:', err);
    } finally {
      setLoadingDirectory(false);
    }
  };

  const fetchMyStatus = async () => {
    try {
      const data = await api.getMyAlumniStatus(currentUser.token);
      setMyRegistration(data);
    } catch (err) {
      // Profile not found is expected if they haven't registered
      setMyRegistration(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDirectory();
  };

  // Profile image upload handler
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));

    // Upload immediately to upload API
    setUploadingPhoto(true);
    setFormError('');
    try {
      const result = await api.uploadImage(file, currentUser.token);
      setFormData(prev => ({ ...prev, profilePhoto: result.url }));
    } catch (err) {
      console.error('Photo upload error:', err);
      setFormError('Failed to process profile photo. Try another image or smaller resolution.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmittingForm(true);

    // Manual field validation
    if (!formData.fullName.trim() || !formData.session.trim() || !formData.studentId.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError('Please fill out all required profile information fields.');
      setSubmittingForm(false);
      return;
    }

    try {
      const data = await api.registerAlumni(formData, currentUser.token);
      setFormSuccess('Alumni registration request submitted successfully! Pending Admin verification and approval.');
      setMyRegistration(data);
    } catch (err) {
      console.error('Registration error:', err);
      setFormError(err.message || 'Error submitting registration request. Please try again.');
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">Alumni Hub</h1>
          <p className="text-sm text-gray-400 mt-2">Connecting graduates, sharing career referrals, and fostering leadership mentorships.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-b border-slate-800 mb-8 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'directory' 
                ? 'text-accent-emerald border-accent-emerald' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Alumni Directory
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'text-accent-emerald border-accent-emerald' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Apply for Registry
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'benefits' 
                ? 'text-accent-emerald border-accent-emerald' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Benefits & Fees
          </button>
        </div>

        {/* DIRECTORY TAB */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="bg-slate-900 text-xs text-gray-300 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <input
                  type="text"
                  placeholder="Filter by Session (2015-16)"
                  value={filterSession}
                  onChange={(e) => setFilterSession(e.target.value)}
                  className="bg-slate-900 text-xs text-gray-300 border border-slate-800 rounded-lg px-3 py-2 outline-none w-44"
                />
              </div>

              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search by name, occupation, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald text-xs text-white rounded-full py-2.5 pl-10 pr-4 outline-none transition-all"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
              </form>
            </div>

            {/* List Results */}
            {loadingDirectory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl border border-slate-800 flex flex-col items-center p-6 animate-pulse">
                    <div className="h-20 w-20 rounded-full bg-slate-900/50 mb-4" />
                    <div className="h-4 bg-slate-900/50 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-900/50 rounded w-1/2 mb-4" />
                    <div className="mt-4 pt-4 border-t border-slate-850 w-full flex flex-col items-center space-y-2">
                      <div className="h-3 bg-slate-900/50 rounded w-3/4" />
                      <div className="h-3 bg-slate-900/50 rounded w-1/2" />
                      <div className="h-3 bg-slate-900/50 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {directory.length === 0 ? (
                  <div className="col-span-full text-center py-16 glass-card rounded-xl border border-slate-800">
                    <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-300">No approved alumni found</h3>
                    <p className="text-xs text-gray-500 mt-1">Try resetting the department filter or typing alternate search queries.</p>
                  </div>
                ) : (
                  directory.map((alumni) => (
                    <div
                      key={alumni._id}
                      onClick={() => setSelectedAlumni(alumni)}
                      className="glass-card rounded-xl overflow-hidden border border-slate-800 hover:border-accent-emerald/20 transition-all duration-300 flex flex-col items-center p-6 cursor-pointer group"
                    >
                      <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-slate-800 group-hover:border-accent-emerald/40 transition-colors mb-4 flex-shrink-0">
                        <img 
                          src={alumni.profilePhoto} 
                          alt={alumni.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h3 className="text-sm font-bold text-white text-center truncate w-full group-hover:text-accent-emerald transition-colors">
                        {alumni.fullName}
                      </h3>
                      <span className="text-[10px] text-accent-cyan font-mono mt-1 font-semibold uppercase">{alumni.department} Department</span>
                      
                      <div className="mt-4 pt-4 border-t border-slate-850 w-full text-center space-y-1">
                        <p className="text-xs text-gray-300 font-medium truncate">{alumni.currentOccupation}</p>
                        <p className="text-[10px] text-gray-500 truncate">{alumni.company || 'Self Employed'}</p>
                        <p className="text-[10px] text-gray-500 font-mono">Session: {alumni.session}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ALUMNI REGISTRATION TAB */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            {!currentUser ? (
              <div className="text-center py-12 glass-card rounded-2xl border border-slate-800 p-8">
                <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">Authentication Required</h3>
                <p className="text-xs text-gray-400 mt-2 mb-6">
                  You must be registered and logged in to apply for the official alumni directory list.
                </p>
                <Link 
                  to="/login"
                  className="bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold px-6 py-2.5 rounded-full text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all"
                >
                  Log In or Register
                </Link>
              </div>
            ) : myRegistration ? (
              // Status of existing request
              <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-accent-emerald font-bold">
                  {myRegistration.status === 'approved' ? <UserCheck className="h-8 w-8 text-accent-emerald" /> : <Users className="h-8 w-8 text-amber-500" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Alumni Registration Status</h3>
                  <div className="flex justify-center items-center gap-2 pt-1">
                    <span className="text-xs text-gray-400">Request Approval:</span>
                    <span className={`text-xs font-mono font-bold uppercase border px-2 py-0.5 rounded ${
                      myRegistration.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 
                      myRegistration.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 
                      'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {myRegistration.status}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-2 pt-1">
                    <span className="text-xs text-gray-400">Fee Payment status:</span>
                    <span className={`text-xs font-mono font-bold uppercase border px-2 py-0.5 rounded ${
                      myRegistration.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 
                      'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {myRegistration.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-900 text-left space-y-3 text-xs leading-relaxed max-w-md mx-auto">
                  <p><span className="text-gray-500">Name:</span> <span className="text-gray-200 font-bold">{myRegistration.fullName}</span></p>
                  <p><span className="text-gray-500">Department:</span> <span className="text-gray-200 font-mono">{myRegistration.department}</span></p>
                  <p><span className="text-gray-500">Session:</span> <span className="text-gray-200 font-mono">{myRegistration.session}</span></p>
                  <p><span className="text-gray-500">Occupation:</span> <span className="text-gray-200 font-medium">{myRegistration.currentOccupation}</span></p>
                  <p><span className="text-gray-500">Payment Transaction ID:</span> <span className="text-gray-200 font-mono">{myRegistration.paymentTrxId || 'None Provided'}</span></p>
                </div>
                
                {myRegistration.status === 'approved' ? (
                  <p className="text-xs text-emerald-400 font-semibold">
                    ✓ Your profile is approved and live in the public Directory. You can now use Alumni permissions.
                  </p>
                ) : myRegistration.status === 'pending' ? (
                  <p className="text-xs text-amber-300 leading-relaxed font-light">
                    Your request is in our verification queue. Please make sure you have submitted the annual fee (500 BDT) and logged the correct transaction ID above so the administrator can verify your credentials.
                  </p>
                ) : (
                  <p className="text-xs text-red-400 font-semibold">
                    ✕ Your registration request was declined. Please contact the Student Council office to resolve this.
                  </p>
                )}
              </div>
            ) : (
              // Registration Form
              <div className="glass-card rounded-2xl p-8 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-850 pb-3">Alumni Directory Registration Form</h3>

                {formError && <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs">{formError}</div>}
                {formSuccess && <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs">{formSuccess}</div>}

                <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs text-gray-300">
                  {/* Photo upload row */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-850">
                    <div className="h-24 w-24 rounded-full bg-slate-900 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Users className="h-10 w-10 text-slate-700" />
                      )}
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold mb-2">Profile Photo (Required)</span>
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-800 hover:border-accent-emerald text-[10px] font-bold text-white px-4 py-2 rounded-xl transition-all">
                        <Upload className="h-4.5 w-4.5 text-accent-emerald" />
                        <span>{uploadingPhoto ? 'Processing photo...' : 'Select Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                          required={!formData.profilePhoto}
                        />
                      </label>
                      <span className="text-[9px] text-gray-500 block mt-1">Accepts PNG, JPG or JPEG. Max file size 5MB.</span>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all cursor-pointer"
                      >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Session (2016-17) *</label>
                      <input
                        type="text"
                        placeholder="Session"
                        value={formData.session}
                        onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Student ID (Roll Number) *</label>
                      <input
                        type="text"
                        placeholder="Student ID"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Occupation / Role *</label>
                      <input
                        type="text"
                        placeholder="Current occupation/role"
                        value={formData.currentOccupation}
                        onChange={(e) => setFormData({ ...formData, currentOccupation: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Company / Organization Name</label>
                      <input
                        type="text"
                        placeholder="Company or organization name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Higher Education Details (if any)</label>
                      <input
                        type="text"
                        placeholder="Higher education details (if any)"
                        value={formData.higherEducation}
                        onChange={(e) => setFormData({ ...formData, higherEducation: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Office / Residence Address *</label>
                      <textarea
                        placeholder="Current Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all h-24"
                        required
                      ></textarea>
                    </div>

                    <div className="col-span-full border-t border-slate-850 pt-4 mt-2">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 mb-4 flex items-start space-x-3">
                        <CreditCard className="h-5 w-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">Membership Fee details</h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                            Please pay the annual fee of 500 BDT to bKash Personal (<span className="text-accent-emerald font-semibold font-mono">+880 1712-345678</span>) or Nagad Personal (<span className="text-accent-cyan font-semibold font-mono">+880 1712-345678</span>) and input the transaction ID below.
                          </p>
                        </div>
                      </div>
                      <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Transaction ID (bKash/Nagad)</label>
                      <input
                        type="text"
                        placeholder="MFS Transaction ID (bKash/Nagad)"
                        value={formData.paymentTrxId}
                        onChange={(e) => setFormData({ ...formData, paymentTrxId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingForm || uploadingPhoto}
                    className="w-full py-3 bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold rounded-xl shadow-lg hover:from-emerald-400 hover:to-cyan-400 transition-all cursor-pointer flex items-center justify-center"
                  >
                    {submittingForm ? (
                      <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <span>Submit Alumni Registry Request</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ALUMNI BENEFITS & FEES TAB */}
        {activeTab === 'benefits' && (
          <div className="space-y-12">
            {/* Benefits list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card rounded-xl p-6 border border-slate-800">
                <div className="bg-slate-900 p-3 rounded-lg w-fit text-accent-emerald border border-slate-800 mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Networking Opportunities</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Stay connected with hundreds of BPIRSC graduates occupying key engineering roles in top regional tech agencies.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 border border-slate-800">
                <div className="bg-slate-900 p-3 rounded-lg w-fit text-accent-cyan border border-slate-800 mb-4">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Mentorship Programs</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Provide or receive direct career guidance, resume reviews, technical code alignment, and soft-skills prep bootcamps.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 border border-slate-800">
                <div className="bg-slate-900 p-3 rounded-lg w-fit text-amber-400 border border-slate-800 mb-4">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Job Referrals</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Unlock access to direct job listings, candidate screening referrals, and mock panels managed internally by senior alumni.
                </p>
              </div>
            </div>

            {/* Terms and payment info */}
            <div className="glass-card rounded-2xl p-8 border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Membership Details</h3>
                <div className="h-1 w-16 bg-accent-emerald rounded-full"></div>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Becoming a verified member of the BPIRSC Alumni association requires a registration fee to coordinate student initiatives, maintain our campus labs, and sponsor scholarship prizes.
                </p>
                <div className="space-y-2 text-xs text-gray-300 font-light">
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent-emerald" /> Annual membership fee is 500 BDT.</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent-emerald" /> Access to directory networking contact database.</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent-emerald" /> Direct invites to annual reunion workshops.</p>
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">How to Pay</h4>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <div>
                      <p className="font-semibold text-gray-300">bKash (Personal)</p>
                      <p className="text-[10px] text-gray-500">Send Money option</p>
                    </div>
                    <span className="font-mono text-accent-emerald font-bold">+880 1712-345678</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <div>
                      <p className="font-semibold text-gray-300">Nagad (Personal)</p>
                      <p className="text-[10px] text-gray-500">Send Money option</p>
                    </div>
                    <span className="font-mono text-accent-cyan font-bold">+880 1712-345678</span>
                  </div>
                </div>
                <p className="text-[9px] text-gray-500 leading-relaxed font-light mt-2">
                  * Verify your payment status inside the registry form tab after submission. If the status is pending after 24 hours, contact support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE NETWORK DETAIL MODAL */}
        {selectedAlumni && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-md overflow-hidden animate-scaleIn">
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 p-8 flex flex-col items-center border-b border-slate-850">
                <button
                  onClick={() => setSelectedAlumni(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-accent-emerald/40 mb-3 shadow-lg">
                  <img src={selectedAlumni.profilePhoto} alt={selectedAlumni.fullName} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-white">{selectedAlumni.fullName}</h3>
                <span className="text-[10px] text-accent-cyan font-mono font-semibold uppercase">{selectedAlumni.department} Department</span>
                <span className="text-[10px] text-gray-500 font-mono mt-1">Session: {selectedAlumni.session}</span>
              </div>

              <div className="p-6 space-y-4 text-xs text-gray-300 font-light">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 font-mono text-[9px] uppercase font-bold">Current Profession</span>
                    <span className="text-white font-semibold">{selectedAlumni.currentOccupation}</span>
                    <span className="block text-gray-400">{selectedAlumni.company || 'Self Employed'}</span>
                  </div>
                </div>

                {selectedAlumni.higherEducation && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-gray-500 font-mono text-[9px] uppercase font-bold">Higher Education</span>
                      <span>{selectedAlumni.higherEducation}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 font-mono text-[9px] uppercase font-bold">Email Address</span>
                    <a href={`mailto:${selectedAlumni.email}`} className="text-accent-emerald font-semibold hover:underline">{selectedAlumni.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 font-mono text-[9px] uppercase font-bold">Phone Number</span>
                    <span>{selectedAlumni.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 font-mono text-[9px] uppercase font-bold">Address</span>
                    <span>{selectedAlumni.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border-t border-slate-850 flex justify-end">
                <button
                  onClick={() => setSelectedAlumni(null)}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold px-4 py-2 border border-slate-800 rounded-xl cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumni;
