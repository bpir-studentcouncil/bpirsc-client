import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Edit2, Save, X, CheckCircle2, ArrowRight, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Profile = () => {
  const { currentUser, updateProfileDetails, switchUserRoleSelf } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || '');
  const [photoPreview, setPhotoPreview] = useState(currentUser?.profilePhoto || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-primary-dark min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center max-w-md w-full">
          <Shield className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Access Denied</h3>
          <p className="text-xs text-gray-400 mt-2 mb-6">
            You must be logged in to view your profile dashboard.
          </p>
          <Link 
            to="/login"
            className="bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold px-6 py-2.5 rounded-full text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all inline-block"
          >
            Log In or Register
          </Link>
        </div>
      </div>
    );
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    setError('');
    try {
      const result = await api.uploadImage(file, currentUser.token);
      setProfilePhoto(result.url);
    } catch (err) {
      console.error('Photo upload error:', err);
      setError('Failed to upload profile photo. Please try a smaller image file.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim()) {
      setError('Name cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      await updateProfileDetails(name, profilePhoto);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setProfilePhoto(currentUser.profilePhoto || '');
    setPhotoPreview(currentUser.profilePhoto || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">Your Profile</h1>
          <p className="text-sm text-gray-400 mt-2">Manage your student credentials, roles, and administrative information.</p>
        </div>

        {/* Profile Card Container */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-emerald/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Header Banner Accent */}
          <div className="h-3 bg-gradient-to-r from-accent-emerald via-accent-cyan to-indigo-500"></div>
          
          <div className="p-8">
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs animate-fadeIn">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-accent-emerald flex-shrink-0" />
                {success}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Photo Area */}
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-slate-900 border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-lg relative group">
                  {photoPreview ? (
                    <img src={photoPreview} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-slate-700" />
                  )}
                  
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                      <Upload className="h-5 w-5 text-accent-emerald mb-1 animate-pulse" />
                      <span className="text-[10px] font-bold">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-accent-emerald border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-accent-emerald hover:text-emerald-400 cursor-pointer bg-slate-900 border border-accent-emerald/20 hover:border-accent-emerald/40 px-3.5 py-2 rounded-xl transition-all shadow-md">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}

                {currentUser.role !== 'admin' ? (
                  <div className="mt-4 flex flex-col items-center gap-1.5 w-full max-w-[140px]">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider font-mono">Select Your Role</span>
                    <select
                      value={currentUser.role}
                      onChange={async (e) => {
                        try {
                          await switchUserRoleSelf(e.target.value);
                          setSuccess(`Role switched to ${e.target.value} successfully!`);
                        } catch (err) {
                          setError(err.message || 'Failed to change role');
                        }
                      }}
                      className="text-xs w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-gray-300 font-semibold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer text-center"
                    >
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>
                ) : (
                  <span className={`text-[10px] font-mono font-bold uppercase border px-2.5 py-1 rounded-full mt-4 bg-slate-900 border-slate-800 text-rose-400 border-rose-950/40 bg-rose-950/10`}>
                    Admin Role
                  </span>
                )}
              </div>

              {/* Profile Details Area */}
              <div className="flex-grow space-y-6 w-full">
                <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white tracking-tight">Account Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-xs text-accent-emerald hover:text-emerald-400 transition-colors border border-accent-emerald/20 hover:border-accent-emerald/40 px-3 py-1.5 rounded-xl bg-accent-emerald/5 hover:bg-accent-emerald/10 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Name</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        value={name}
                        disabled={!isEditing}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full bg-slate-900 border text-sm text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all ${
                          isEditing 
                            ? 'border-accent-emerald focus:ring-1 focus:ring-accent-emerald' 
                            : 'border-slate-800 text-gray-400 cursor-not-allowed bg-slate-900/40'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email field (locked) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        value={currentUser.email}
                        disabled
                        className="w-full bg-slate-900/40 border border-slate-800 text-sm text-gray-400 rounded-xl py-3 pl-10 pr-4 cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 block pl-1">Email address is managed by authentication provider and cannot be changed.</span>
                  </div>

                  {/* Joined Date field (simulated or database) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Authentication Provider</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        value={currentUser.uid.startsWith('mock-uid') ? 'Local Quick Demo Session' : 'Firebase Authentication'}
                        disabled
                        className="w-full bg-slate-900/40 border border-slate-800 text-sm text-gray-400 rounded-xl py-3 pl-10 pr-4 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Save/Cancel Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t border-slate-850">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold rounded-xl shadow-lg hover:from-emerald-400 hover:to-cyan-400 transition-all cursor-pointer text-xs"
                      >
                        {loading ? (
                          <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer text-xs"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Context Card based on User Role */}
        <div className="mt-8 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              {currentUser.role === 'student' ? 'Apply for Alumni Membership' : 
               currentUser.role === 'alumni' ? 'You are a verified Alumni member' : 
               'Access Administrator Dashboard'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {currentUser.role === 'student' ? 'Graduating soon? Apply to be added to the public directory list and connect with recruiters.' :
               currentUser.role === 'alumni' ? 'Your profile is live in the public directory grid. You can view contacts or request job referrals.' :
               'Configure news events, monitor registered directories, cycle roles, and verify alumni transaction logs.'}
            </p>
          </div>
          
          {currentUser.role === 'student' && (
            <Link
              to="/alumni"
              className="bg-slate-900 border border-slate-800 hover:border-accent-emerald hover:text-accent-emerald text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Alumni Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {currentUser.role === 'alumni' && (
            <Link
              to="/alumni"
              className="bg-slate-900 border border-slate-800 hover:border-accent-emerald hover:text-accent-emerald text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>View Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {currentUser.role === 'admin' && (
            <Link
              to="/admin"
              className="bg-slate-900 border border-slate-800 hover:border-accent-emerald hover:text-accent-emerald text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
