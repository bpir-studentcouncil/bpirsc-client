import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Hand, HeartHandshake, Award, Target, Eye, Compass, Facebook, Linkedin } from 'lucide-react';

// X (formerly Twitter) brand icon — SVG since lucide-react doesn't include it yet
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { api } from '../services/api';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const team = await api.getTeam();
        if (team && team.length > 0) {
          setTeamMembers(team);
        } else {
          setTeamMembers(defaultTeam);
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setTeamMembers(defaultTeam);
      }
    };
    fetchTeam();
  }, []);

  const defaultTeam = [
    {
      name: "Engr. Monirul Islam",
      position: "Advisor & Mentor",
      dept: "Computer Technology",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Academic council chair with over 12 years of instructing polytechnic graduates on CAD drafting, networking, and industry practices.",
      social: { facebook: "https://facebook.com", linkedin: "https://linkedin.com", twitter: "" }
    },
    {
      name: "Sabbir Ahmed",
      position: "President",
      dept: "Mechanical Technology",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Automations programmer and lead AutoCAD coordinator. Passionate about empowering students through code and hardware collaborations.",
      social: { facebook: "https://facebook.com", linkedin: "https://linkedin.com", twitter: "https://twitter.com" }
    },
    {
      name: "Nusrat Jahan",
      position: "General Secretary",
      dept: "Computer Technology",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Full Stack JavaScript developer. Manages administrative communications and organises quarterly tech seminars and blood campaigns.",
      social: { facebook: "https://facebook.com", linkedin: "https://linkedin.com", twitter: "" }
    },
    {
      name: "Kamrul Hasan",
      position: "Alumni Coordinator",
      dept: "Civil Technology",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Site manager at a top local construction firm. Facilitates alumni referrals, job openings, and industrial placement programs.",
      social: { facebook: "", linkedin: "https://linkedin.com", twitter: "" }
    }
  ];

  const values = [
    { name: 'Leadership', desc: 'Guiding students to take charge of engineering innovation and public welfare campaigns.', icon: Compass, color: 'text-emerald-400' },
    { name: 'Teamwork', desc: 'Collaborating across technological streams to achieve large-scale project success.', icon: HeartHandshake, color: 'text-cyan-400' },
    { name: 'Innovation', desc: 'Encouraging technical designs, CAD prototypes, and embedded micro-circuit experiments.', icon: Sparkles, color: 'text-indigo-400' },
    { name: 'Integrity', desc: 'Ensuring honest representation of students, fair approvals, and transparency in fee collection.', icon: Shield, color: 'text-rose-400' },
    { name: 'Community Service', desc: 'Volunteering for medical emergency drives, flood relief, and rural computer literacy lessons.', icon: Hand, color: 'text-amber-400' }
  ];

  const achievements = [
    { title: "Completed Projects", detail: "Over 45+ technical design solutions, AutoCAD courses, and voluntary services successfully delivered." },
    { title: "Events Organized", detail: "Conducted 120+ seminars, higher study workshops, and health awareness camps since establishment." },
    { title: "Student Impact", detail: "Directly guided and certified 1,200+ polytechnic students in professional design tools and IoT prototypes." },
    { title: "Alumni Success", detail: "Placed 350+ alumni in top local and international engineering companies with standard referrals." }
  ];

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white">About the Council</h1>
          <p className="text-sm text-gray-400 mt-2">Connecting, training, and supporting Bangladesh Polytechnic Institute Rajshahi Student Council members & graduates since 2018.</p>
        </div>

        {/* History, Background and Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-accent-emerald pl-3">Our History & Background</h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              বাংলাদেশ পলিটেকনিক ইনস্টিটিউট রাজশাহী স্টুডেন্ট কাউন্সিল (BPIRSC) পলিটেকনিক শিক্ষার গুণগত মান উন্নয়ন, শিক্ষার্থীদের কারিগরি কাজের হাতে-কলমে প্রশিক্ষণ এবং প্রাক্তন শিক্ষার্থীদের দক্ষতা কাজে লাগিয়ে নতুনদের কর্মসংস্থানের সুযোগ সৃষ্টি করতে যাত্রা শুরু করে।
            </p>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              We started as a small club of electrical and computer diploma students running basic drafting classes. Today, we stand as the primary representative council for thousands of students, coordinating with the academic board to bring modern software certifications and social welfare opportunities inside the campus.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="h-5 w-5 text-accent-cyan" />
              Core Objectives
            </h3>
            <ul className="space-y-3 text-xs text-gray-400 leading-relaxed font-light">
              <li className="flex items-start gap-2">
                <span className="text-accent-emerald font-bold font-mono">1.</span>
                <span>Bridging the gap between academic diploma outlines and practical industrial automation needs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-emerald font-bold font-mono">2.</span>
                <span>Fostering professional connections between junior students and working alumni for placements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-emerald font-bold font-mono">3.</span>
                <span>Running immediate relief and blood mobilization drives during regional health emergencies.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card rounded-xl p-8 border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-emerald/5 rounded-full blur-2xl"></div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-slate-900 p-2.5 rounded-lg text-accent-emerald border border-slate-800">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              To design a progressive learning ecosystem where diploma engineering students can learn industry-centric technical skills (AutoCAD, Micro-controllers, Full-stack web technologies), collaborate on research, and build real-world leadership values to represent Bangladesh on a global stage.
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cyan/5 rounded-full blur-2xl"></div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-slate-900 p-2.5 rounded-lg text-accent-cyan border border-slate-800">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              To be the benchmark student leadership board across all polytechnic institutes in South Asia, recognized for generating exceptional tech innovators, fostering robust alumni networks, and driving transformative civic volunteer work.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Our Core Values</h2>
            <p className="text-sm text-gray-400 mt-2">The principles that guide our interactions, workshops, and volunteer services.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="glass-card rounded-xl p-6 border border-slate-800 text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="bg-slate-900 p-3 rounded-lg w-fit border border-slate-850">
                      <Icon className={`h-6 w-6 ${v.color}`} />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white">{v.name}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-light">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Achievements & Impact</h2>
            <p className="text-sm text-gray-400 mt-2">Quantifying the difference we make for our students and community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {achievements.map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 border border-slate-800 relative">
                <div className="absolute top-4 right-4 text-accent-emerald/20 font-bold text-4xl font-mono">#{idx+1}</div>
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team Section */}
        <div className="mb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Meet Our Team</h2>
            <p className="text-sm text-gray-400 mt-2">The executive committee managing student affairs and alumni networks.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full group hover:border-accent-emerald/20 transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 text-[10px] text-accent-cyan border border-accent-cyan/30 px-2 py-0.5 rounded font-mono font-bold">
                    {member.dept}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">{member.name}</h3>
                    <span className="text-[10px] text-accent-emerald font-semibold uppercase tracking-wider block">{member.position}</span>
                    <p className="text-xs text-gray-400 leading-relaxed font-light mt-2">{member.bio}</p>
                  </div>
                  
                  {/* Social Handles */}
                  <div className="pt-4 border-t border-slate-850 mt-4 flex space-x-3">
                    {member.social?.facebook && (
                      <a 
                        href={member.social.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                    {member.social?.linkedin && (
                      <a 
                        href={member.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.social?.twitter && (
                      <a 
                        href={member.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-white transition-colors"
                        title="X (Twitter)"
                      >
                        <XIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
