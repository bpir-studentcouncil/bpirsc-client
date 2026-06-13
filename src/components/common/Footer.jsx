import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';
import logoImg from '../../assets/BPIR Student Council Logo.jpg';


const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and brief intro */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <img src={logoImg} alt="BPIRSC Logo" className="h-8 w-8 object-contain rounded-full border border-slate-800 bg-slate-900" />
              <span className="bg-gradient-to-r from-accent-emerald to-accent-cyan bg-clip-text text-transparent">BPIRSC</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bangladesh Polytechnic Institute Rajshahi Student Council. Connecting students, alumni, and council members under a unified platform for academics, technical projects, and career guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-accent-emerald pl-2">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-accent-emerald transition-colors">Home</Link></li>
              <li><Link to="/news" className="hover:text-accent-emerald transition-colors">Gossip / News</Link></li>
              <li><Link to="/projects" className="hover:text-accent-emerald transition-colors">Projects</Link></li>
              <li><Link to="/alumni" className="hover:text-accent-emerald transition-colors">Alumni Network</Link></li>
              <li><Link to="/about" className="hover:text-accent-emerald transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent-emerald transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-accent-emerald pl-2">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-accent-emerald flex-shrink-0 mt-0.5" />
                <span>Bangladesh Polytechnic Institute Rajshahi Student Council Campus, Rajshahi, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-accent-emerald flex-shrink-0" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-accent-emerald flex-shrink-0" />
                <span>contact@bpirsc.org</span>
              </li>
            </ul>
          </div>

          {/* Social Media and Map/Community link */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-accent-emerald pl-2">Follow Us</h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Stay updated with our technical workshops, social activities, and seminar highlights on our official handles.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/bpirstudentcouncil" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent-emerald transition-colors bg-slate-900 p-2 rounded-full">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent-emerald transition-colors bg-slate-900 p-2 rounded-full">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent-emerald transition-colors bg-slate-900 p-2 rounded-full">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent-emerald transition-colors bg-slate-900 p-2 rounded-full">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} BPIRSC. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-gray-300">Privacy Policy</span>
            <span className="hover:text-gray-300">Terms of Service</span>
            <span className="hover:text-gray-300">BPIRSC Academic Board</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
