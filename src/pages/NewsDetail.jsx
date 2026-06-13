import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, User, Share2, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getNewsById(id);
        if (data) {
          setArticle(data);
        } else {
          setError('News article not found.');
        }
      } catch (err) {
        console.error('Error fetching news details:', err);
        setError('Failed to load news details. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-slate-950 text-gray-100 min-h-screen pt-28 pb-16 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-accent-emerald animate-spin mb-4" />
        <p className="text-sm text-gray-400">Loading article details...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-slate-950 text-gray-100 min-h-screen pt-28 pb-16 flex flex-col items-center justify-center px-4">
        <div className="glass-card rounded-2xl border border-slate-800 p-8 max-w-md text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Error Loading News</h2>
          <p className="text-xs text-gray-400">{error || 'Article not found.'}</p>
          <button 
            onClick={() => navigate('/news')} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-emerald to-accent-cyan hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-gray-100 min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation button */}
        <div>
          <button 
            onClick={() => navigate('/news')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-accent-emerald transition-colors bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News List
          </button>
        </div>

        {/* Detailed News Layout */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Cover image banner */}
          <div className="h-64 sm:h-96 w-full overflow-hidden relative">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            {/* Category tag */}
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <span className="inline-block text-[10px] bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                {article.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                {article.title}
              </h1>
            </div>
          </div>

          {/* Body and metadata wrapper */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Author info card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-6">
              <div className="flex items-center space-x-3">
                {article.authorPhoto ? (
                  <img 
                    src={article.authorPhoto} 
                    alt={article.authorName} 
                    className="h-10 w-10 rounded-full object-cover border border-slate-700/50 flex-shrink-0" 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent-emerald to-accent-cyan flex items-center justify-center font-bold text-slate-950 text-base uppercase flex-shrink-0">
                    {article.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-white">{article.authorName}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">{article.authorRole} Columnist</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent-emerald" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-accent-emerald bg-slate-900 border border-slate-800 hover:border-slate-700 px-4.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share Article</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Detailed text content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-wrap font-light">
                {article.content}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsDetail;
