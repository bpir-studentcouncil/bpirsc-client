import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Briefcase, CheckCircle, Flame, Calendar, Search, Users, 
  ChevronDown, ChevronUp, Image, FileSpreadsheet, AlertTriangle, Trophy
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, ongoing: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const projectTypes = [
    'AutoCAD Course',
    'Technical Workshops',
    'Volunteer Programs',
    'Career Seminars',
    'Social Awareness Programs',
    'Blood Donation Campaigns',
    'Student Development Activities'
  ];

  const experienceNotes = [
    {
      author: "Sabbir Ahmed (AutoCAD Lead)",
      title: "Adapting to Hybrid CAD Labs",
      story: "While teaching our AutoCAD Course, we noticed students faced lag with high-end tools on entry-level laptops. We resolved this by scheduling extended offline CAD lab hours in the campus library and compiling a custom setup guide. It was a great problem-solving experience.",
      type: "Problem Solving Story"
    },
    {
      author: "Nusrat Jahan (Volunteer Coordinator)",
      title: "Emergency Blood Drive Logistics",
      story: "Coordinating the Blood Donation Camp required precision. We had to match donors to urgency requests in local hospitals under 3 hours. We structured a real-time tracking sheet which allowed us to successfully collect 75+ units of blood in a day. Real leadership in action.",
      type: "Leadership Experience Note"
    },
    {
      author: "Fahim Faisal (IoT Project Lead)",
      title: "Smart Home Node Prototyping",
      story: "Our Ongoing smart home workshop was struggling to source key sensors due to local shipping delays. The team decided to redesign the nodes to use local analog substitutes. We succeeded in finishing the demo board on schedule.",
      type: "Activity Report"
    }
  ];

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, [activeType, activeStatus]);

  const fetchStats = async () => {
    try {
      const data = await api.getProjectStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects({
        status: activeStatus,
        type: activeType,
        search: search
      });
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const toggleExpand = (id) => {
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'Ongoing': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      case 'Upcoming': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      default: return 'bg-gray-550 text-gray-250';
    }
  };

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">Project Archive</h1>
          <p className="text-sm text-gray-400 mt-2">Explore workshops, courses, seminars, and charity programs run by the council.</p>
        </div>

        {/* Dashboard Count Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-lg text-accent-emerald border border-slate-800">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{stats.total}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Projects</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-lg text-emerald-400 border border-slate-800">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{stats.completed}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-lg text-cyan-400 border border-slate-800">
              <Flame className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{stats.ongoing}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ongoing</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-lg text-amber-400 border border-slate-800">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{stats.upcoming}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 max-w-4xl">
            <button
              onClick={() => { setActiveType(''); setActiveStatus(''); }}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
                activeType === '' && activeStatus === ''
                  ? 'bg-accent-emerald text-slate-950 border-accent-emerald' 
                  : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              All Types
            </button>
            
            <button
              onClick={() => setActiveStatus('Ongoing')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
                activeStatus === 'Ongoing'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-500' 
                  : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              Ongoing
            </button>

            <button
              onClick={() => setActiveStatus('Completed')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
                activeStatus === 'Completed'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                  : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              Completed
            </button>
            
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
                  activeType === type 
                    ? 'bg-accent-emerald text-slate-950 border-accent-emerald' 
                    : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald text-xs text-white rounded-full py-2.5 pl-10 pr-4 outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
          </form>
        </div>

        {/* Project List */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-emerald"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-xl border border-slate-800">
                <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-300">No projects found</h3>
                <p className="text-xs text-gray-500 mt-1">Try resetting the status/category filter or searching with different key terms.</p>
              </div>
            ) : (
              projects.map((project) => (
                <div 
                  key={project._id} 
                  className="glass-card rounded-2xl overflow-hidden border border-slate-800 transition-all duration-300"
                >
                  <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                    {/* Project Image */}
                    <div className="w-full lg:w-72 h-48 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Basic details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 px-2.5 py-0.5 rounded-full font-bold font-mono tracking-wide uppercase">
                            {project.projectType}
                          </span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{project.title}</h2>
                        <p className="text-sm text-gray-400 font-light leading-relaxed">{project.description}</p>
                      </div>

                      <div className="pt-6 border-t border-slate-900 mt-6 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <div>
                            <span className="block font-mono text-[10px] text-gray-600">Start Date</span>
                            <span className="font-semibold text-gray-400 font-mono">
                              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="block font-mono text-[10px] text-gray-600">End Date</span>
                            <span className="font-semibold text-gray-400 font-mono">
                              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Active'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleExpand(project._id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-accent-emerald hover:text-emerald-400 cursor-pointer"
                        >
                          {expandedProjectId === project._id ? (
                            <>
                              <span>Collapse Details</span>
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <span>View Project Outcomes</span>
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Project Details (Challenges, Outcomes, Team, Gallery) */}
                  {expandedProjectId === project._id && (
                    <div className="px-6 pb-8 sm:px-8 border-t border-slate-900 bg-slate-950/40 divide-y divide-slate-900">
                      
                      {/* Challenges and Outcomes */}
                      <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            Challenges Faced
                          </h4>
                          <p className="text-sm text-gray-400 font-light leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-900/80">
                            {project.challenges || 'No challenge description logged for this project.'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Trophy className="h-4 w-4" />
                            Outcomes & Results
                          </h4>
                          <p className="text-sm text-gray-400 font-light leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-900/80">
                            {project.outcomes || 'Project results and achievements will be updated shortly.'}
                          </p>
                        </div>
                      </div>

                      {/* Team Members List */}
                      {project.teamMembers && project.teamMembers.length > 0 && (
                        <div className="py-6">
                          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                            <Users className="h-4 w-4 text-accent-cyan" />
                            Core Team Members
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {project.teamMembers.map((member, idx) => (
                              <div key={idx} className="bg-slate-900/60 border border-slate-900 p-3.5 rounded-xl text-center">
                                <div className="h-7 w-7 rounded-full bg-slate-800 text-[10px] font-bold text-accent-cyan flex items-center justify-center mx-auto mb-2 uppercase">
                                  {member.name.charAt(0)}
                                </div>
                                <h5 className="text-xs font-bold text-white truncate">{member.name}</h5>
                                <span className="text-[10px] text-gray-500 truncate block mt-0.5">{member.role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Gallery */}
                      {project.gallery && project.gallery.length > 0 && (
                        <div className="py-6">
                          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                            <Image className="h-4 w-4 text-accent-emerald" />
                            Project Image Gallery
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {project.gallery.map((img, idx) => (
                              <div key={idx} className="h-32 rounded-xl overflow-hidden border border-slate-900 group/gallery cursor-zoom-in">
                                <img 
                                  src={img} 
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover/gallery:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* EXPERIENCE SECTION (PROJECTS PAGE) */}
        <div className="mt-20 border-t border-slate-900 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Team Experience & Logs</h2>
            <p className="text-sm text-gray-400 mt-2">Personal stories, problem-solving files, and leadership logs directly from coordinators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experienceNotes.map((note, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 border border-slate-800 flex flex-col justify-between h-full relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent-emerald/5 rounded-full blur-2xl"></div>
                
                <div className="space-y-4 relative z-10">
                  <span className="text-[10px] bg-slate-900 text-accent-emerald border border-slate-800 px-2 py-0.5 rounded uppercase font-bold font-mono tracking-wider">
                    {note.type}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">{note.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light italic">
                    "{note.story}"
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-900 mt-6 text-xs text-gray-500 font-mono text-right relative z-10">
                  — {note.author}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;
