import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, Briefcase, Users, Award, BookOpen, Heart, ShieldAlert, ArrowRight, Star } from 'lucide-react';
import logoImg from '../assets/BPIR Student Council Logo.jpg';


const Home = () => {
  const [news, setNews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
      title: "Building the Future of Polytechnic Leaders",
      subtitle: "Bangladesh Polytechnic Institute Rajshahi Student Council",
      tagline: "Empowering diploma engineers with professional engineering, automation, and leadership opportunities."
    },
    {
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80",
      title: "Hands-on AutoCAD & IoT Workshops",
      subtitle: "Technical Programs Section",
      tagline: "Bridging the gap between academic theory and industry demand with specialized certification courses."
    },
    {
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
      title: "Active Community Volunteer Programs",
      subtitle: "Social Impact & Leadership",
      tagline: "From blood drives to disaster relief, our students actively volunteer to build a better community."
    }
  ];

  useEffect(() => {
    // Rotate slides every 6 seconds
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    // Fetch news and projects
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedNews = await api.getNews({ featured: 'true' });
        // Take first 3 news
        setNews(fetchedNews.slice(0, 3));

        const fetchedProjects = await api.getProjects({ featured: 'true' });
        setProjects(fetchedProjects.slice(0, 3));
      } catch (error) {
        console.error('Error fetching homepage feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => clearInterval(slideTimer);
  }, []);


  const stats = [
    { label: 'Total Members', count: '1,500+', icon: Users, color: 'text-emerald-400' },
    { label: 'Projects Completed', count: '45+', icon: Briefcase, color: 'text-cyan-400' },
    { label: 'Registered Alumni', count: '480+', icon: Award, color: 'text-indigo-400' },
    { label: 'Events Organized', count: '120+', icon: Calendar, color: 'text-rose-400' }
  ];

  return (
    <div className="bg-primary-dark min-h-screen">
      
      {/* Hero Slider Banner */}
      <div className="relative h-[85svh] w-full overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms]"
            />
            
            {/* Hero Text */}
            <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
              <div className="max-w-2xl space-y-4">
                <span className="inline-block text-xs font-bold text-accent-emerald uppercase tracking-widest border border-accent-emerald/30 px-3 py-1 rounded-full bg-accent-emerald/10">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
                  {slide.tagline}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link 
                    to="/projects"
                    className="bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold px-6 py-3 rounded-full text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    View Our Projects
                  </Link>
                  <Link 
                    to="/alumni"
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-700/60 hover:border-accent-emerald text-white px-6 py-3 rounded-full text-sm font-semibold transition-all"
                  >
                    Join Alumni Directory
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-8 bg-accent-emerald' : 'w-2.5 bg-gray-500/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Welcome & Vision Mission Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome to the <span className="bg-gradient-to-r from-accent-emerald to-accent-cyan bg-clip-text text-transparent">BPIRSC Portal</span>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-full"></div>
            <p className="text-gray-300 leading-relaxed">
              বাংলাদেশ পলিটেকনিক ইনস্টিটিউট রাজশাহী স্টুডেন্ট কাউন্সিল (BPIRSC) বর্তমান পলিটেকনিক শিক্ষার্থীদের কারিগরি দক্ষতা বৃদ্ধি, ক্যারিয়ার গাইডলাইন প্রদান এবং প্রাক্তন শিক্ষার্থীদের (Alumni) সাথে একটি চমৎকার নেটওয়ার্কিং গড়ে তোলার উদ্দেশ্যে নিরলসভাবে কাজ করে চলেছে।
            </p>
            <p className="text-gray-300 leading-relaxed font-light">
              We focus on practical workshops, AutoCAD blueprints certification, volunteer work during national challenges, and mentoring seminars to ensure that our diploma holders are ready for global industry standards.
            </p>
            <div>
              <Link to="/about" className="inline-flex items-center text-sm font-bold text-accent-emerald hover:text-emerald-400 group">
                Read our full history <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Presidential/Council Glass Quote Box */}
          <div className="glass-card rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-emerald/5 rounded-full blur-3xl"></div>
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-semibold text-accent-cyan uppercase tracking-widest block font-mono">Student Council Vision</span>
              <h3 className="text-lg font-bold text-white">"Empowering technological education with community leadership, turning academic potential into industrial excellence."</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Our platform provides student resources, project coordination archives, and verified alumni lookup directories, enabling polytechnic graduates to easily collaborate on academic notices and job referrals.
              </p>
              <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
                <img src={logoImg} alt="BPIRSC Logo" className="h-10 w-10 rounded-full object-contain border border-slate-700 bg-slate-900" />
                <div>
                  <h4 className="text-sm font-bold text-white">Bangladesh Polytechnic Institute Rajshahi Student Council Panel</h4>
                  <p className="text-xs text-gray-500">Student & Alumni Liaison Board</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">What We Do</h2>
            <p className="text-sm text-gray-400 mt-2">Connecting technical skills, seminars, and human services in Rajshahi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-8 border border-slate-800 hover:border-accent-emerald/30 transition-all duration-300">
              <div className="bg-slate-900/80 p-3 rounded-lg w-fit mb-6 text-accent-emerald border border-slate-800">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Technical Programs</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Hands-on AutoCAD design modules, building simulation layouts, programming controllers, and electrical circuit designs.
              </p>
            </div>

            <div className="glass-card rounded-xl p-8 border border-slate-800 hover:border-accent-cyan/30 transition-all duration-300">
              <div className="bg-slate-900/80 p-3 rounded-lg w-fit mb-6 text-accent-cyan border border-slate-800">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Workshops & Seminars</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Career advisory seminars, higher study orientations in overseas universities, and live interactive coding bootcamps.
              </p>
            </div>

            <div className="glass-card rounded-xl p-8 border border-slate-800 hover:border-rose-500/20 transition-all duration-300">
              <div className="bg-slate-900/80 p-3 rounded-lg w-fit mb-6 text-rose-400 border border-slate-800">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Volunteer Activities</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Organizing quarterly blood donations, flood relief drives in Northern districts, winter clothing distribution campaigns, and awareness seminars.
              </p>
            </div>
          </div>
        </div>

        {/* Glowing Statistics Section */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card rounded-xl p-6 border border-slate-800 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-emerald/20 to-transparent"></div>
                  <div className="flex justify-center mb-4">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <span className="block text-3xl font-extrabold text-white tracking-tight">{stat.count}</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Projects Section */}
        {(loading || projects.length > 0) && (
          <div className="py-16 border-t border-slate-900">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Featured Projects</h2>
                <p className="text-sm text-gray-400 mt-2">Active initiatives driven by council members and technical students.</p>
              </div>
              <Link to="/projects" className="text-accent-emerald hover:text-emerald-400 text-sm font-bold flex items-center group">
                All Projects <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl overflow-hidden border border-slate-800 flex flex-col h-full animate-pulse">
                    <div className="h-48 bg-slate-900/50" />
                    <div className="p-6 flex-grow flex flex-col space-y-3">
                      <div className="h-3 bg-slate-900/50 rounded w-1/4" />
                      <div className="h-5 bg-slate-900/50 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-900/50 rounded w-full" />
                        <div className="h-3 bg-slate-900/50 rounded w-5/6" />
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                        <div className="h-3 bg-slate-900/50 rounded w-1/4" />
                        <div className="h-3 bg-slate-900/50 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                projects.map((project) => (
                  <div key={project._id} className="glass-card rounded-xl overflow-hidden border border-slate-800 flex flex-col h-full group hover:border-accent-emerald/20 transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/90 text-accent-emerald text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-accent-emerald/30">
                        {project.status}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-2 font-mono">{project.projectType}</span>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">{project.description}</p>
                      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-gray-500">
                        <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : ''}</span>
                        <Link to={`/projects`} className="text-accent-emerald font-semibold hover:underline">View details</Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Latest Gossip Section */}
        {(loading || news.length > 0) && (
          <div className="py-16 border-t border-slate-900">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Latest Gossip & News</h2>
                <p className="text-sm text-gray-400 mt-2">Latest scholarship news, event alerts, and campus engineering logs.</p>
              </div>
              <Link to="/news" className="text-accent-emerald hover:text-emerald-400 text-sm font-bold flex items-center group">
                Read Notice Board <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl overflow-hidden border border-slate-800 flex flex-col h-full animate-pulse">
                    <div className="h-44 bg-slate-900/50" />
                    <div className="p-6 flex-grow flex flex-col space-y-3">
                      <div className="h-5 bg-slate-900/50 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-900/50 rounded w-full" />
                        <div className="h-3 bg-slate-900/50 rounded w-5/6" />
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                        <div className="h-3 bg-slate-900/50 rounded w-1/3" />
                        <div className="h-3 bg-slate-900/50 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                news.map((item) => (
                  <div key={item._id} className="glass-card rounded-xl overflow-hidden border border-slate-800 flex flex-col h-full group hover:border-accent-emerald/20 transition-all duration-300">
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={item.coverImage} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 text-[10px] text-accent-cyan border border-accent-cyan/30 px-2 py-0.5 rounded uppercase font-bold font-mono">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-emerald transition-colors">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">{item.content}</p>
                      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                        <span>By {item.authorName} ({item.authorRole})</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
