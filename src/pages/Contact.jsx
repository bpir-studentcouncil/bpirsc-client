import React, { useState } from 'react';
import { api } from '../services/api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill out all fields in the contact form.');
      setLoading(false);
      return;
    }

    try {
      await api.submitContactForm(formData);
      setSuccess('Your message was delivered successfully! The council will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please verify network status.');
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    { label: 'Our Address', desc: 'Bangladesh Polytechnic Institute Rajshahi Student Council Campus, Rajshahi-6203, Bangladesh', icon: MapPin },
    { label: 'Phone Number', desc: '+880 1712-345678 (Secretary), +880 1512-345678 (Help Desk)', icon: Phone },
    { label: 'Email Address', desc: 'contact@bpirsc.org, support@bpirsc.org', icon: Mail },
    { label: 'Working Hours', desc: 'Sunday - Thursday: 09:00 AM - 05:00 PM (GMT+6)', icon: Clock }
  ];

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white">Contact the Council</h1>
          <p className="text-sm text-gray-400 mt-2">Have a question about academic notice boards, workshops or alumni referrals? Drop us a line.</p>
        </div>

        {/* Contact Info Grid & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Info Details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-accent-emerald pl-3">Contact Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactDetails.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
                    <div className="bg-slate-900 p-2.5 rounded-lg w-fit text-accent-emerald border border-slate-850">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{item.label}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Panel */}
            <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Join our Social Communities</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                We broadcast live workshops on YouTube, share networking updates on LinkedIn, and organize event groups on Facebook.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-accent-emerald bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all">
                  <Facebook className="h-4.5 w-4.5" />
                  <span>Facebook</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-accent-emerald bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all">
                  <Linkedin className="h-4.5 w-4.5" />
                  <span>LinkedIn</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-accent-emerald bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all">
                  <Youtube className="h-4.5 w-4.5" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card rounded-2xl p-8 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-850 pb-3">Send Us a Message</h3>
            
            {error && <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs">{error}</div>}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-gray-300">
              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Subject *</label>
                <input
                  type="text"
                  placeholder="Enter the subject of your query"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1">Message Body *</label>
                <textarea
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-accent-emerald text-sm text-white rounded-xl py-3 px-4 outline-none transition-all h-32"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold rounded-xl shadow-lg hover:from-emerald-400 hover:to-cyan-400 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Google Map Integration (using a beautiful dark map embed or styled placeholder) */}
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 h-96 relative">
          <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-white">Bangladesh Polytechnic Institute Rajshahi Student Council</h4>
            <p className="text-[10px] text-gray-400 mt-0.5 font-light">Campus Road, Rajshahi, Bangladesh</p>
          </div>
          <iframe 
            title="BPIRSC Map coordinates"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3634.3905096538356!2d88.60838187611082!3d24.368630778248386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc8619bcbb9f91%3A0x8bb9df3ff56d4791!2sRajshahi%20Polytechnic%20Institute!5e0!3m2!1sen!2sbd!4v1718206450630!5m2!1sen!2sbd"
            className="w-full h-full border-none filter invert-[90%] hue-rotate-[180deg] saturate-[60%] opacity-80" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default Contact;
