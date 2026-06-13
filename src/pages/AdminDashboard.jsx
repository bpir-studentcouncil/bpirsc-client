import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Users, Briefcase, FileText, Mail, Trash2, Edit, Plus, Check, 
  X, Eye, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Upload 
} from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('overview');
  
  // Data lists
  const [users, setUsers] = useState([]);
  const [alumniRequests, setAlumniRequests] = useState([]);
  const [news, setNews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState({ users: 0, alumni: 0, news: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  // Modals / forms triggers
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ id: '', title: '', content: '', category: 'Technical Education News', coverImage: '', isFeatured: false });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: '', title: '', description: '', coverImage: '', gallery: '', startDate: '', endDate: '',
    status: 'Ongoing', projectType: 'Technical Workshops', teamMembers: '', challenges: '', outcomes: '', isFeatured: false
  });
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState({
    id: '', name: '', position: '', dept: 'Computer Technology', photo: '', bio: '', facebook: '', linkedin: '', twitter: '', instagram: '', sortOrder: 0
  });

  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Custom confirmation dialog and image uploading states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  // Per-form image uploading states (separate to avoid cross-modal spinner contamination)
  const [uploadingNewsImage, setUploadingNewsImage] = useState(false);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const [uploadingTeamImage, setUploadingTeamImage] = useState(false);

  const askConfirmation = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const handleImageUpload = async (file, targetForm, fieldName) => {
    if (!file) return;
    // Set the correct per-form loading state
    const setLoading = targetForm === 'news' ? setUploadingNewsImage
      : targetForm === 'project' ? setUploadingProjectImage
      : setUploadingTeamImage;
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await api.uploadImage(file, currentUser.token);
      if (targetForm === 'team') {
        setTeamForm(prev => ({ ...prev, [fieldName]: result.url }));
      } else if (targetForm === 'news') {
        setNewsForm(prev => ({ ...prev, [fieldName]: result.url }));
      } else if (targetForm === 'project') {
        setProjectForm(prev => ({ ...prev, [fieldName]: result.url }));
      }
      triggerNotify('Image uploaded successfully!');
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMsg('Image upload failed. Please verify file format/size (max 5MB).');
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleImagesUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingProjectImage(true);
    setErrorMsg('');
    try {
      const result = await api.uploadMultipleImages(files, currentUser.token);
      const newUrls = result.urls || [];
      const currentGallery = projectForm.gallery 
        ? projectForm.gallery.split(',').map(url => url.trim()).filter(url => url !== '') 
        : [];
      
      const updatedGallery = [...currentGallery, ...newUrls].join(', ');
      setProjectForm(prev => ({ ...prev, gallery: updatedGallery }));
      triggerNotify(`${newUrls.length} image(s) uploaded to gallery successfully!`);
    } catch (err) {
      console.error('Gallery upload failed:', err);
      setErrorMsg('Failed to upload gallery images. Please try again.');
    } finally {
      setUploadingProjectImage(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeSubTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Fetch users
      const allUsers = await api.getUsers(currentUser.token);
      setUsers(allUsers);

      // Fetch pending alumni requests
      const pendingAlumni = await api.getPendingAlumni(currentUser.token);
      setAlumniRequests(pendingAlumni);

      // Fetch news
      const allNews = await api.getNews();
      setNews(allNews);

      // Fetch projects
      const allProjects = await api.getProjects();
      setProjects(allProjects);

      // Fetch contact messages
      const allMessages = await api.getContactMessages(currentUser.token);
      setMessages(allMessages);

      // Fetch team members
      const allTeam = await api.getTeam();
      setTeam(allTeam);

      // Fetch alumni directory for stats count
      const approvedAlumni = await api.getAlumniDirectory();

      setStats({
        users: allUsers.length,
        alumni: approvedAlumni.length,
        news: allNews.length,
        projects: allProjects.length
      });

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch administrative data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const triggerNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // NEWS ACTIONS
  const handleNewsSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (newsForm.id) {
        // Edit
        await api.updateNews(newsForm.id, newsForm, currentUser.token);
        triggerNotify('News article updated successfully!');
      } else {
        // Create
        await api.createNews(newsForm, currentUser.token);
        triggerNotify('News article created successfully!');
      }
      setShowNewsModal(false);
      setNewsForm({ id: '', title: '', content: '', category: 'Technical Education News', coverImage: '', isFeatured: false });
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving news article');
    }
  };

  const handleNewsEdit = (item) => {
    setNewsForm({
      id: item._id,
      title: item.title,
      content: item.content,
      category: item.category,
      coverImage: item.coverImage,
      isFeatured: item.isFeatured
    });
    setShowNewsModal(true);
  };

  const handleNewsDelete = (id) => {
    askConfirmation(
      'Delete News Article',
      'Are you sure you want to permanently delete this news article? This action cannot be undone.',
      async () => {
        try {
          await api.deleteNews(id, currentUser.token);
          triggerNotify('News article deleted.');
          loadDashboardData();
        } catch (err) {
          setErrorMsg('Error deleting news');
        }
      }
    );
  };

  // PROJECTS ACTIONS
  const handleProjectSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Parse team members (expecting line-separated Name:Role or Comma-separated)
    let parsedTeam = [];
    if (projectForm.teamMembers) {
      parsedTeam = projectForm.teamMembers.split('\n').map(line => {
        const parts = line.split(':');
        return {
          name: parts[0]?.trim() || 'Contributor',
          role: parts[1]?.trim() || 'Team Member'
        };
      }).filter(m => m.name !== '');
    }

    // Parse image gallery (expecting comma-separated URLs)
    let parsedGallery = [];
    if (projectForm.gallery) {
      parsedGallery = projectForm.gallery.split(',').map(url => url.trim()).filter(url => url !== '');
    }

    const payload = {
      ...projectForm,
      teamMembers: parsedTeam,
      gallery: parsedGallery
    };

    try {
      if (projectForm.id) {
        await api.updateProject(projectForm.id, payload, currentUser.token);
        triggerNotify('Project updated successfully!');
      } else {
        await api.createProject(payload, currentUser.token);
        triggerNotify('Project created successfully!');
      }
      setShowProjectModal(false);
      setProjectForm({
        id: '', title: '', description: '', coverImage: '', gallery: '', startDate: '', endDate: '',
        status: 'Ongoing', projectType: 'Technical Workshops', teamMembers: '', challenges: '', outcomes: '', isFeatured: false
      });
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving project');
    }
  };

  const handleProjectEdit = (item) => {
    const teamString = (item.teamMembers || []).map(m => `${m.name}:${m.role}`).join('\n');
    const galleryString = (item.gallery || []).join(', ');
    setProjectForm({
      id: item._id,
      title: item.title,
      description: item.description,
      coverImage: item.coverImage,
      gallery: galleryString,
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      status: item.status,
      projectType: item.projectType,
      teamMembers: teamString,
      challenges: item.challenges || '',
      outcomes: item.outcomes || '',
      isFeatured: item.isFeatured
    });
    setShowProjectModal(true);
  };

  const handleProjectDelete = (id) => {
    askConfirmation(
      'Delete Project Log',
      'Are you sure you want to permanently delete this project? This action cannot be undone.',
      async () => {
        try {
          await api.deleteProject(id, currentUser.token);
          triggerNotify('Project deleted.');
          loadDashboardData();
        } catch (err) {
          setErrorMsg('Error deleting project');
        }
      }
    );
  };

  // ALUMNI APPROVALS
  const handleAlumniStatus = async (id, status) => {
    try {
      await api.updateAlumniStatus(id, status, currentUser.token);
      triggerNotify(`Alumni request updated to ${status}.`);
      loadDashboardData();
    } catch (err) {
      setErrorMsg('Error updating alumni request status');
    }
  };

  const handleAlumniPayment = async (id, currentPayStatus) => {
    const nextStatus = currentPayStatus === 'verified' ? 'pending' : 'verified';
    try {
      await api.updateAlumniPayment(id, nextStatus, currentUser.token);
      triggerNotify(`Payment status updated to ${nextStatus}.`);
      loadDashboardData();
    } catch (err) {
      setErrorMsg('Error updating alumni payment status');
    }
  };

  // USER MANAGEMENT
  const handleUserRole = (uid, currentRole) => {
    const roles = ['student', 'alumni', 'admin'];
    const nextIndex = (roles.indexOf(currentRole) + 1) % roles.length;
    const nextRole = roles[nextIndex];
    
    askConfirmation(
      'Change User Role',
      `Are you sure you want to change this user's role to ${nextRole.toUpperCase()}?`,
      async () => {
        try {
          await api.updateUserRole(uid, nextRole, currentUser.token);
          triggerNotify(`Role changed to ${nextRole}.`);
          loadDashboardData();
        } catch (err) {
          setErrorMsg('Error updating user role');
        }
      }
    );
  };

  // TEAM MANAGEMENT ACTIONS
  const handleTeamSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const payload = {
        name: teamForm.name,
        position: teamForm.position,
        dept: teamForm.dept,
        photo: teamForm.photo,
        bio: teamForm.bio,
        facebook: teamForm.facebook,
        linkedin: teamForm.linkedin,
        twitter: teamForm.twitter,
        instagram: teamForm.instagram,
        sortOrder: Number(teamForm.sortOrder) || 0
      };

      if (teamForm.id) {
        await api.updateTeamMember(teamForm.id, payload, currentUser.token);
        triggerNotify('Team member updated.');
      } else {
        await api.createTeamMember(payload, currentUser.token);
        triggerNotify('New team member added.');
      }
      setShowTeamModal(false);
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving team member');
    }
  };

  const handleTeamDelete = (id) => {
    askConfirmation(
      'Remove Team Member',
      'Are you sure you want to remove this team member from the active Student Council roster?',
      async () => {
        try {
          await api.deleteTeamMember(id, currentUser.token);
          triggerNotify('Team member removed.');
          loadDashboardData();
        } catch (err) {
          setErrorMsg('Error removing team member');
        }
      }
    );
  };

  // MESSAGE MANAGEMENT
  const handleMessageRead = async (id, isRead) => {
    try {
      await api.markContactMessageRead(id, isRead, currentUser.token);
      triggerNotify(`Message marked as ${isRead ? 'read' : 'unread'}.`);
      loadDashboardData();
    } catch (err) {
      setErrorMsg('Error updating message status');
    }
  };

  const handleMessageDelete = (id) => {
    askConfirmation(
      'Delete Contact Message',
      'Are you sure you want to permanently delete this contact form submission?',
      async () => {
        try {
          await api.deleteContactMessage(id, currentUser.token);
          triggerNotify('Message deleted successfully.');
          loadDashboardData();
        } catch (err) {
          setErrorMsg('Error deleting contact message');
        }
      }
    );
  };

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-accent-emerald animate-pulse" />
              <span>Council Admin Panel</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Authorized access only. Logged in as: {currentUser.name}</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Inline Alerts Removed - Swapped for Floating Toasts */}

        {/* Sidebar Nav Tabs & Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Menu Panel */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'overview', label: 'Overview Metrics', icon: ShieldCheck },
              { id: 'news', label: 'Manage News', icon: FileText },
              { id: 'projects', label: 'Manage Projects', icon: Briefcase },
              { id: 'team', label: 'Manage Team', icon: Users },
              { id: 'alumni', label: `Alumni Requests (${alumniRequests.length})`, icon: Users },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'messages', label: `Contact Messages (${messages.filter(m => !m.isRead).length})`, icon: Mail }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeSubTab === tab.id 
                      ? 'bg-accent-emerald text-slate-950 border-accent-emerald' 
                      : 'bg-slate-900 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="mr-3 h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main Display Grid */}
          <div className="lg:col-span-3 space-y-6">
            
            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center glass-card rounded-2xl border border-slate-800">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-emerald"></div>
              </div>
            ) : (
              <>
                {/* OVERVIEW PANEL */}
                {activeSubTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="glass-card rounded-xl p-5 border border-slate-800">
                        <Users className="h-5 w-5 text-accent-cyan mb-2" />
                        <span className="block text-2xl font-bold text-white">{stats.users}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Accounts</span>
                      </div>
                      <div className="glass-card rounded-xl p-5 border border-slate-800">
                        <Users className="h-5 w-5 text-accent-emerald mb-2" />
                        <span className="block text-2xl font-bold text-white">{stats.alumni}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Approved Alumni</span>
                      </div>
                      <div className="glass-card rounded-xl p-5 border border-slate-800">
                        <FileText className="h-5 w-5 text-indigo-400 mb-2" />
                        <span className="block text-2xl font-bold text-white">{stats.news}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">News Published</span>
                      </div>
                      <div className="glass-card rounded-xl p-5 border border-slate-800">
                        <Briefcase className="h-5 w-5 text-amber-400 mb-2" />
                        <span className="block text-2xl font-bold text-white">{stats.projects}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Projects</span>
                      </div>
                    </div>

                    {/* Summary lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pending Alumni summary list */}
                      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-white flex justify-between items-center border-b border-slate-850 pb-2">
                          <span>Pending Alumni Approval</span>
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                            {alumniRequests.length}
                          </span>
                        </h3>
                        {alumniRequests.length === 0 ? (
                          <p className="text-xs text-gray-500 font-light italic">No pending registry requests.</p>
                        ) : (
                          <div className="space-y-3 divide-y divide-slate-900">
                            {alumniRequests.slice(0, 3).map((item) => (
                              <div key={item._id} className="pt-3 flex justify-between items-center text-xs">
                                <div>
                                  <p className="font-bold text-white">{item.fullName}</p>
                                  <p className="text-[10px] text-gray-500 font-mono">{item.department} Dept | Session: {item.session}</p>
                                </div>
                                <button
                                  onClick={() => setActiveSubTab('alumni')}
                                  className="text-[10px] text-accent-emerald font-bold hover:underline"
                                >
                                  Approve
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Unread message list */}
                      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-white flex justify-between items-center border-b border-slate-850 pb-2">
                          <span>Unread Queries</span>
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">
                            {messages.filter(m => !m.isRead).length}
                          </span>
                        </h3>
                        {messages.filter(m => !m.isRead).length === 0 ? (
                          <p className="text-xs text-gray-500 font-light italic">No unread contact form logs.</p>
                        ) : (
                          <div className="space-y-3 divide-y divide-slate-900">
                            {messages.filter(m => !m.isRead).slice(0, 3).map((item) => (
                              <div key={item._id} className="pt-3 flex justify-between items-center text-xs">
                                <div className="truncate max-w-[180px]">
                                  <p className="font-bold text-white truncate">{item.subject}</p>
                                  <p className="text-[10px] text-gray-500 truncate">From {item.name}</p>
                                </div>
                                <button
                                  onClick={() => setActiveSubTab('messages')}
                                  className="text-[10px] text-accent-cyan font-bold hover:underline"
                                >
                                  Read
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* MANAGE NEWS PANEL */}
                {activeSubTab === 'news' && (
                  <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">News & Gossip Archive</h3>
                        <p className="text-[10px] text-gray-500">Edit notices, engineering updates, scholarship feeds, and student articles.</p>
                      </div>
                      <button
                        onClick={() => {
                          setNewsForm({ id: '', title: '', content: '', category: 'Technical Education News', coverImage: '', isFeatured: false });
                          setShowNewsModal(true);
                        }}
                        className="bg-accent-emerald hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Add News
                      </button>
                    </div>

                    {/* Table List */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider font-mono">
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Author</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-gray-300">
                          {news.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-950/30">
                              <td className="py-4 px-4 font-bold text-white truncate max-w-[200px]">
                                {item.title}
                                {item.isFeatured && <span className="ml-2 bg-accent-emerald/20 text-accent-emerald px-1.5 py-0.2 rounded text-[8px] uppercase">Featured</span>}
                              </td>
                              <td className="py-4 px-4">{item.category}</td>
                              <td className="py-4 px-4">{item.authorName}</td>
                              <td className="py-4 px-4 font-mono">{new Date(item.publishedAt).toLocaleDateString()}</td>
                              <td className="py-4 px-4 text-center flex justify-center gap-2">
                                <button onClick={() => handleNewsEdit(item)} className="text-accent-cyan hover:underline p-1 cursor-pointer">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleNewsDelete(item._id)} className="text-red-400 hover:underline p-1 cursor-pointer">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* MANAGE PROJECTS PANEL */}
                {activeSubTab === 'projects' && (
                  <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">Project Archives</h3>
                        <p className="text-[10px] text-gray-500">Edit workshops, volunteer programs, smart IoT nodes, or seminars details.</p>
                      </div>
                      <button
                        onClick={() => {
                          setProjectForm({
                            id: '', title: '', description: '', coverImage: '', gallery: '', startDate: '', endDate: '',
                            status: 'Ongoing', projectType: 'Technical Workshops', teamMembers: '', challenges: '', outcomes: '', isFeatured: false
                          });
                          setShowProjectModal(true);
                        }}
                        className="bg-accent-emerald hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Add Project
                      </button>
                    </div>

                    {/* Table list */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider font-mono">
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-gray-300">
                          {projects.map((project) => (
                            <tr key={project._id} className="hover:bg-slate-950/30">
                              <td className="py-4 px-4 font-bold text-white truncate max-w-[200px]">{project.title}</td>
                              <td className="py-4 px-4">{project.projectType}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                                  project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                                  project.status === 'Ongoing' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' :
                                  'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {project.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center flex justify-center gap-2">
                                <button onClick={() => handleProjectEdit(project)} className="text-accent-cyan hover:underline p-1 cursor-pointer">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleProjectDelete(project._id)} className="text-red-400 hover:underline p-1 cursor-pointer">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ALUMNI REQUESTS PANEL */}
                {activeSubTab === 'alumni' && (
                  <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-white">Pending Alumni Approvals</h3>
                      <p className="text-[10px] text-gray-500">Review pending graduates profiles, payment logs, and update credentials roles.</p>
                    </div>

                    {alumniRequests.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 italic">No pending alumni registration requests.</div>
                    ) : (
                      <div className="space-y-4">
                        {alumniRequests.map((req) => (
                          <div key={req._id} className="bg-slate-900 border border-slate-850 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            {/* Profile card summary */}
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-750 flex-shrink-0">
                                <img src={req.profilePhoto} alt={req.fullName} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white leading-snug">{req.fullName}</h4>
                                <span className="text-[10px] text-accent-cyan font-mono">{req.department} Dept | Session: {req.session}</span>
                                <span className="block text-[10px] text-gray-500">Roll ID: {req.studentId}</span>
                              </div>
                            </div>

                            {/* Job and Payment status */}
                            <div className="text-xs space-y-1.5">
                              <p><span className="text-gray-500">Profession:</span> <span className="text-gray-300 font-medium">{req.currentOccupation} at {req.company || 'N/A'}</span></p>
                              <p className="flex items-center gap-1.5">
                                <span className="text-gray-500">Transaction ID:</span> 
                                <span className="text-gray-300 font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded">{req.paymentTrxId || 'NONE'}</span>
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Payment:</span>
                                <button
                                  onClick={() => handleAlumniPayment(req._id, req.paymentStatus)}
                                  className={`text-[9px] px-2 py-0.2 rounded font-bold uppercase cursor-pointer border ${
                                    req.paymentStatus === 'verified' 
                                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40' 
                                      : 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                                  }`}
                                >
                                  {req.paymentStatus === 'verified' ? '✓ Verified' : 'pending (Click to verify)'}
                                </button>
                              </div>
                            </div>

                            {/* Actions Buttons */}
                            <div className="flex justify-end gap-3 md:border-l border-slate-850 md:pl-6 h-full items-center">
                              <button
                                onClick={() => handleAlumniStatus(req._id, 'approved')}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Check className="h-4.5 w-4.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleAlumniStatus(req._id, 'rejected')}
                                className="bg-red-500/25 hover:bg-red-500/40 text-red-300 text-xs font-bold px-4 py-2 border border-red-500/30 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <X className="h-4.5 w-4.5" />
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* MANAGE TEAM PANEL */}
                {activeSubTab === 'team' && (
                  <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">Student Council Team Members</h3>
                        <p className="text-[10px] text-gray-500">Add, edit, or remove executive committee members shown on the About page.</p>
                      </div>
                      <button
                        onClick={() => {
                          setTeamForm({ id: '', name: '', position: '', dept: 'Computer Technology', photo: '', bio: '', facebook: '', linkedin: '', twitter: '', instagram: '', sortOrder: 0 });
                          setShowTeamModal(true);
                        }}
                        className="bg-accent-emerald hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Add Member
                      </button>
                    </div>

                    {/* Table List */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider font-mono">
                            <th className="py-3 px-4">Order</th>
                            <th className="py-3 px-4">Photo</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Position</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Social Links</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-gray-300">
                          {team.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-6 text-center text-gray-500 italic">No team members added.</td>
                            </tr>
                          ) : (
                            team.map((member) => (
                              <tr key={member._id} className="hover:bg-slate-950/30">
                                <td className="py-3 px-4 font-mono font-bold text-accent-cyan">{member.sortOrder || 0}</td>
                                <td className="py-3 px-4">
                                  <img 
                                    src={member.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80'} 
                                    alt={member.name} 
                                    className="h-10 w-10 object-cover rounded-full border border-slate-800" 
                                  />
                                </td>
                                <td className="py-3 px-4 font-bold text-white">{member.name}</td>
                                <td className="py-3 px-4 text-accent-cyan font-mono">{member.position}</td>
                                <td className="py-3 px-4">{member.dept}</td>
                                <td className="py-3 px-4 space-x-1.5 font-mono text-[10px]">
                                  {member.social?.facebook && <span className="text-gray-400">FB</span>}
                                  {member.social?.linkedin && <span className="text-gray-400">LN</span>}
                                  {member.social?.twitter && <span className="text-gray-400">TW</span>}
                                  {member.social?.instagram && <span className="text-gray-400">IG</span>}
                                  {!member.social?.facebook && !member.social?.linkedin && !member.social?.twitter && !member.social?.instagram && <span className="text-gray-600">None</span>}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => {
                                        setTeamForm({
                                          id: member._id,
                                          name: member.name,
                                          position: member.position,
                                          dept: member.dept,
                                          photo: member.photo,
                                          bio: member.bio,
                                          facebook: member.social?.facebook || '',
                                          linkedin: member.social?.linkedin || '',
                                          twitter: member.social?.twitter || '',
                                          instagram: member.social?.instagram || '',
                                          sortOrder: member.sortOrder || 0
                                        });
                                        setShowTeamModal(true);
                                      }}
                                      className="text-accent-emerald hover:underline font-semibold cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <span className="text-slate-800">|</span>
                                    <button
                                      onClick={() => handleTeamDelete(member._id)}
                                      className="text-rose-400 hover:underline font-semibold cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* MANAGE USERS PANEL */}
                {activeSubTab === 'users' && (
                  <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-white">User Administration Grid</h3>
                      <p className="text-[10px] text-gray-500">Manage user accounts and escalate permission roles between Student, Alumni, and Admin.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider font-mono">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role Permission</th>
                            <th className="py-3 px-4 text-center">Toggle Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-gray-300">
                          {users.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-950/30">
                              <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                              <td className="py-4 px-4 font-mono">{u.email}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold border ${
                                  u.role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                                  u.role === 'alumni' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                                  'bg-slate-800 text-gray-400 border-slate-700'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => handleUserRole(u.uid, u.role)}
                                  className="text-[10px] font-bold text-accent-emerald hover:underline cursor-pointer"
                                >
                                  Cycle Permission
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* VIEW CONTACT MESSAGES */}
                {activeSubTab === 'messages' && (
                  <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-white">Contact Form Messages</h3>
                      <p className="text-[10px] text-gray-500">Read and manage messages received from the public contact forms.</p>
                    </div>

                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 italic">No contact form messages logged.</div>
                      ) : (
                        messages.map((msg) => (
                          <div 
                            key={msg._id} 
                            className={`border border-slate-850 rounded-xl p-5 space-y-3 transition-all ${
                              msg.isRead ? 'bg-slate-900/40 opacity-70' : 'bg-slate-900/90 border-l-4 border-l-accent-cyan'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[9px] text-gray-500 font-mono">{new Date(msg.createdAt).toLocaleString()}</span>
                                <h4 className="text-sm font-bold text-white mt-1">{msg.subject}</h4>
                                <p className="text-xs text-gray-400">From: <span className="font-semibold text-gray-200">{msg.name}</span> ({msg.email})</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleMessageRead(msg._id, !msg.isRead)}
                                  className={`text-[9px] px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                                    msg.isRead 
                                      ? 'bg-slate-800 text-gray-400 border-slate-700 hover:text-white' 
                                      : 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30 hover:bg-accent-cyan/30'
                                  }`}
                                >
                                  {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                                </button>
                                <button
                                  onClick={() => handleMessageDelete(msg._id)}
                                  className="text-[9px] px-2.5 py-1 rounded-lg font-bold bg-rose-500/20 hover:bg-rose-500/45 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                                  title="Delete message"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-light bg-slate-950 p-4 rounded-xl border border-slate-900">
                              {msg.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ADD/EDIT NEWS MODAL OVERLAY */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-lg p-6 animate-scaleIn">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-850 pb-2">
              {newsForm.id ? 'Edit News Article' : 'Publish News Article'}
            </h3>
            
            <form onSubmit={handleNewsSave} className="space-y-4 text-xs text-gray-300">
              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs cursor-pointer"
                  >
                    <option value="Technical Education News">Technical Education News</option>
                    <option value="Engineering Updates">Engineering Updates</option>
                    <option value="Scholarship Information">Scholarship Information</option>
                    <option value="Higher Study Opportunities">Higher Study Opportunities</option>
                    <option value="Notice Board">Notice Board</option>
                    <option value="Alumni Opinions">Alumni Opinions</option>
                    <option value="Student Articles">Student Articles</option>
                    <option value="Success Stories">Success Stories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Featured Article</label>
                  <select
                    value={newsForm.isFeatured}
                    onChange={(e) => setNewsForm({ ...newsForm, isFeatured: e.target.value === 'true' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs cursor-pointer"
                  >
                    <option value="false">Standard News</option>
                    <option value="true">Featured (Hero display)</option>
                  </select>
                </div>
              </div>

              {uploadingNewsImage && (
                <div className="flex justify-center mb-2 animate-pulse">
                  <div className="h-28 w-full rounded-xl border border-accent-emerald/40 flex items-center justify-center bg-slate-950/80">
                    <div className="h-8 w-8 border-2 border-accent-emerald border-t-transparent animate-spin rounded-full"></div>
                  </div>
                </div>
              )}
              {!uploadingNewsImage && newsForm.coverImage && (
                <div className="flex justify-center mb-2">
                  <div className="relative h-28 w-full rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                    <img src={newsForm.coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewsForm(prev => ({ ...prev, coverImage: '' }))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-400 opacity-0 hover:opacity-100 transition-opacity text-xs font-bold cursor-pointer"
                    >
                      Remove Cover Image
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Cover Image URL (Cloudinary or Unsplash)</label>
                  <input
                    type="text"
                    placeholder="Paste article cover image URL here"
                    value={newsForm.coverImage}
                    onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-emerald hover:text-emerald-400 cursor-pointer bg-slate-900 border border-accent-emerald/20 hover:border-accent-emerald/40 px-4 py-2.5 rounded-xl transition-all h-[38px] w-full text-center">
                    <Upload className="h-4 w-4" />
                    <span>{uploadingNewsImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingNewsImage}
                      onChange={(e) => handleImageUpload(e.target.files[0], 'news', 'coverImage')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Article Body Content *</label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs h-36"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold px-5 py-2 rounded-xl cursor-pointer"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT PROJECT MODAL OVERLAY */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-2xl p-6 my-8 animate-scaleIn">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-850 pb-2">
              {projectForm.id ? 'Edit Project Log' : 'Create Project Log'}
            </h3>

            <form onSubmit={handleProjectSave} className="space-y-4 text-xs text-gray-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Project Type *</label>
                  <select
                    value={projectForm.projectType}
                    onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs cursor-pointer"
                  >
                    <option value="AutoCAD Course">AutoCAD Course</option>
                    <option value="Technical Workshops">Technical Workshops</option>
                    <option value="Volunteer Programs">Volunteer Programs</option>
                    <option value="Career Seminars">Career Seminars</option>
                    <option value="Social Awareness Programs">Social Awareness Programs</option>
                    <option value="Blood Donation Campaigns">Blood Donation Campaigns</option>
                    <option value="Student Development Activities">Student Development Activities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs cursor-pointer"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                  />
                </div>
              </div>

              {uploadingProjectImage && (
                <div className="flex justify-center mb-2 animate-pulse">
                  <div className="h-28 w-full rounded-xl border border-accent-emerald/40 flex items-center justify-center bg-slate-950/80">
                    <div className="h-8 w-8 border-2 border-accent-emerald border-t-transparent animate-spin rounded-full"></div>
                  </div>
                </div>
              )}
              {!uploadingProjectImage && projectForm.coverImage && (
                <div className="flex justify-center mb-2">
                  <div className="relative h-28 w-full rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                    <img src={projectForm.coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProjectForm(prev => ({ ...prev, coverImage: '' }))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-400 opacity-0 hover:opacity-100 transition-opacity text-xs font-bold cursor-pointer"
                    >
                      Remove Cover Image
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={projectForm.coverImage}
                      onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-emerald hover:text-emerald-400 cursor-pointer bg-slate-900 border border-accent-emerald/20 hover:border-accent-emerald/40 px-2 py-2.5 rounded-xl transition-all h-[38px] w-full text-center">
                      <Upload className="h-4 w-4" />
                      <span>{uploadingProjectImage ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingProjectImage}
                        onChange={(e) => handleImageUpload(e.target.files[0], 'project', 'coverImage')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1 font-mono">Featured (Highlights page)</label>
                  <select
                    value={projectForm.isFeatured}
                    onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.value === 'true' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs cursor-pointer h-[38px]"
                  >
                    <option value="false">Standard Project</option>
                    <option value="true">Featured on Home</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Short Description *</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs h-16"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-400 uppercase tracking-wider mb-1">Challenges Faced</label>
                  <textarea
                    value={projectForm.challenges}
                    onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs h-20"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-emerald-400 uppercase tracking-wider mb-1">Outcomes & Results</label>
                  <textarea
                    value={projectForm.outcomes}
                    onChange={(e) => setProjectForm({ ...projectForm, outcomes: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs h-20"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Team Members (One Name:Role per line, e.g. Sabbir:Project Lead)</label>
                <textarea
                  placeholder="Monirul:Lead Architect&#10;Tasnim:Software Tester"
                  value={projectForm.teamMembers}
                  onChange={(e) => setProjectForm({ ...projectForm, teamMembers: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs h-16 font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Image Gallery URLs (Comma separated)</label>
                
                {/* Gallery Preview Grid */}
                {((projectForm.gallery && projectForm.gallery.split(',').map(url => url.trim()).filter(url => url !== '').length > 0) || uploadingProjectImage) && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2 p-2 bg-slate-950/60 rounded-xl border border-slate-900">
                    {projectForm.gallery && projectForm.gallery.split(',').map(url => url.trim()).filter(url => url !== '').map((url, idx, arr) => (
                      <div key={idx} className="relative h-14 w-full rounded-lg border border-slate-800 overflow-hidden bg-slate-950 group">
                        <img src={url} alt={`Gallery Preview ${idx}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = arr.filter((_, i) => i !== idx).join(', ');
                            setProjectForm(prev => ({ ...prev, gallery: updated }));
                          }}
                          className="absolute inset-0 bg-black/75 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {uploadingProjectImage && (
                      <div className="relative h-14 w-full rounded-lg border border-accent-emerald/40 overflow-hidden bg-slate-950 flex items-center justify-center animate-pulse">
                        <div className="h-4 w-4 border-2 border-accent-emerald border-t-transparent animate-spin rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="https://image1.jpg, https://image2.jpg"
                      value={projectForm.gallery}
                      onChange={(e) => setProjectForm({ ...projectForm, gallery: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-emerald hover:text-emerald-400 cursor-pointer bg-slate-900 border border-accent-emerald/20 hover:border-accent-emerald/40 px-2 py-2.5 rounded-xl transition-all h-[38px] w-full text-center">
                      <Upload className="h-4 w-4" />
                      <span>{uploadingProjectImage ? '...' : 'Upload Files'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingProjectImage}
                        onChange={(e) => handleMultipleImagesUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold px-5 py-2 rounded-xl cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* TEAM MEMBER MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-lg p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-base font-bold text-white">
                {teamForm.id ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <button 
                onClick={() => setShowTeamModal(false)} 
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {uploadingTeamImage && (
              <div className="flex justify-center mb-2 animate-pulse">
                <div className="h-20 w-20 rounded-full border border-accent-emerald/40 flex items-center justify-center bg-slate-950/80">
                  <div className="h-6 w-6 border-2 border-accent-emerald border-t-transparent animate-spin rounded-full"></div>
                </div>
              </div>
            )}
            {!uploadingTeamImage && teamForm.photo && (
              <div className="flex justify-center mb-2">
                <div className="relative h-20 w-20 rounded-full border border-slate-800 overflow-hidden bg-slate-950">
                  <img src={teamForm.photo} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setTeamForm(prev => ({ ...prev, photo: '' }))}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-400 opacity-0 hover:opacity-100 transition-opacity text-xs font-bold cursor-pointer rounded-full"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleTeamSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Designation"
                    value={teamForm.position}
                    onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Department *</label>
                  <select
                    value={teamForm.dept}
                    onChange={(e) => setTeamForm({ ...teamForm, dept: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs cursor-pointer"
                  >
                    <option value="Computer Technology">Computer Technology</option>
                    <option value="Mechanical Technology">Mechanical Technology</option>
                    <option value="Civil Technology">Civil Technology</option>
                    <option value="Electrical Technology">Electrical Technology</option>
                    <option value="Electronics Technology">Electronics Technology</option>
                    <option value="Power Technology">Power Technology</option>
                    <option value="Electro-Medical Technology">Electro-Medical Technology</option>
                  </select>
                </div>
              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Photo URL</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="https://example.com/avatar.jpg"
                      value={teamForm.photo}
                      onChange={(e) => setTeamForm({ ...teamForm, photo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-emerald hover:text-emerald-400 cursor-pointer bg-slate-900 border border-accent-emerald/20 hover:border-accent-emerald/40 px-2 py-2.5 rounded-xl transition-all h-[38px] w-full text-center">
                      <Upload className="h-4 w-4" />
                      <span>{uploadingTeamImage ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingTeamImage}
                        onChange={(e) => handleImageUpload(e.target.files[0], 'team', 'photo')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1"
                  value={teamForm.sortOrder}
                  onChange={(e) => setTeamForm({ ...teamForm, sortOrder: e.target.value })}
                  className="w-24 bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 outline-none text-white focus:border-accent-emerald text-xs mb-4"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Short Biography *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe this team member's role, achievements, and contributions..."
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-white focus:border-accent-emerald text-xs"
                ></textarea>
              </div>

              <div className="border-t border-slate-850 pt-3">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social Media URLs (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Facebook</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={teamForm.facebook}
                      onChange={(e) => setTeamForm({ ...teamForm, facebook: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 outline-none text-white focus:border-accent-emerald text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">LinkedIn</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={teamForm.linkedin}
                      onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 outline-none text-white focus:border-accent-emerald text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">X (Twitter)</label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/..."
                      value={teamForm.twitter}
                      onChange={(e) => setTeamForm({ ...teamForm, twitter: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 outline-none text-white focus:border-accent-emerald text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Instagram</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={teamForm.instagram}
                      onChange={(e) => setTeamForm({ ...teamForm, instagram: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 outline-none text-white focus:border-accent-emerald text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold px-5 py-2 rounded-xl cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CUSTOM CONFIRMATION DIALOG OVERLAY */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-sm p-6 animate-scaleIn space-y-4 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertCircle className="h-6 w-6 flex-shrink-0 animate-pulse" />
              <h4 className="text-base font-bold text-white">{confirmDialog.title}</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer text-xs transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2 rounded-xl cursor-pointer text-xs transition-all shadow-md shadow-rose-950/50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-[200] space-y-3 pointer-events-none max-w-sm w-full">
        {notification && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-emerald-500/25 text-white p-4 rounded-xl shadow-2xl shadow-emerald-950/25 flex items-center gap-3 animate-slideIn">
            <div className="bg-emerald-500/20 text-accent-emerald p-2 rounded-lg border border-accent-emerald/20 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-200">Success</p>
              <p className="text-[11px] text-gray-400 leading-normal">{notification}</p>
            </div>
            <button 
              onClick={() => setNotification('')}
              className="text-gray-500 hover:text-white ml-auto cursor-pointer p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {errorMsg && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-red-500/25 text-white p-4 rounded-xl shadow-2xl shadow-red-950/25 flex items-center gap-3 animate-slideIn">
            <div className="bg-red-500/20 text-red-400 p-2 rounded-lg border border-red-400/20 flex-shrink-0">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-200">Error</p>
              <p className="text-[11px] text-gray-400 leading-normal">{errorMsg}</p>
            </div>
            <button 
              onClick={() => setErrorMsg('')}
              className="text-gray-500 hover:text-white ml-auto cursor-pointer p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
