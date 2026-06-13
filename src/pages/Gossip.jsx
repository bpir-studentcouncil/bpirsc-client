import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Calendar, User, Share2, Copy, Check, MessageSquareCode } from 'lucide-react';

const Gossip = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'Technical Education News',
    'Engineering Updates',
    'Scholarship Information',
    'Higher Study Opportunities',
    'Notice Board',
    'Alumni Opinions',
    'Student Articles',
    'Success Stories'
  ];

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews({
        category: activeCategory,
        search: search
      });
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNews();
  };

  const handleShare = (id, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/news/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find the featured news item if it exists
  const featuredArticle = news.find(item => item.isFeatured);
  const regularArticles = news.filter(item => item._id !== (featuredArticle?._id || ''));

  return (
    <div className="bg-primary-dark min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">Gossip & News</h1>
          <p className="text-sm text-gray-400 mt-2">Discover academic notifications, updates, articles and tech accomplishments.</p>
        </div>

        {/* Search and Category Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories list */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1 max-w-3xl">
            <button
              onClick={() => setActiveCategory('')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
                activeCategory === '' 
                  ? 'bg-accent-emerald text-slate-950 border-accent-emerald' 
                  : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              All News
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-accent-emerald text-slate-950 border-accent-emerald' 
                    : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64 order-1 md:order-2">
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald text-xs text-white rounded-full py-2.5 pl-10 pr-4 outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
          </form>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden border border-slate-800 flex flex-col h-full animate-pulse">
                <div className="h-48 bg-slate-900/50" />
                <div className="p-6 flex-grow flex flex-col space-y-3">
                  <div className="h-4 bg-slate-900/50 rounded w-3/4" />
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
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {news.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-xl border border-slate-800">
                <MessageSquareCode className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-300">No news articles found</h3>
                <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching with different key terms.</p>
              </div>
            ) : (
              <>
                {/* Hero Featured News Section */}
                {featuredArticle && !activeCategory && !search && (
                  <div 
                    onClick={() => navigate(`/news/${featuredArticle._id}`)}
                    className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-accent-emerald/20 transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 cursor-pointer group"
                  >
                    <div className="h-64 sm:h-80 lg:h-full overflow-hidden">
                      <img 
                        src={featuredArticle.coverImage} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 px-2.5 py-0.5 rounded-full font-bold font-mono tracking-wide uppercase">
                          Featured News
                        </span>
                        <span className="text-[10px] bg-slate-900 text-accent-cyan border border-slate-800 px-2 py-0.5 rounded uppercase font-bold font-mono">
                          {featuredArticle.category}
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight group-hover:text-accent-emerald transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-4 font-light">
                        {featuredArticle.content}
                      </p>
                      
                      <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <User className="h-3.5 w-3.5 text-accent-emerald" />
                          <span className="font-mono">{featuredArticle.authorName} ({featuredArticle.authorRole})</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500 font-mono">
                            {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={(e) => handleShare(featuredArticle._id, e)}
                            className="text-gray-400 hover:text-white bg-slate-900 p-2 rounded-full border border-slate-800"
                            title="Copy link to clipboard"
                          >
                            {copiedId === featuredArticle._id ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {((activeCategory || search) ? news : regularArticles).map((article) => (
                    <div
                      key={article._id}
                      onClick={() => navigate(`/news/${article._id}`)}
                      className="glass-card rounded-xl overflow-hidden border border-slate-800 hover:border-accent-emerald/20 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={article.coverImage} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/80 text-[10px] text-accent-cyan border border-accent-cyan/30 px-2.5 py-0.5 rounded uppercase font-bold font-mono">
                          {article.category}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-emerald transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-4 mb-4 font-light">
                          {article.content}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                          <span className="truncate max-w-[150px]">By {article.authorName}</span>
                          <div className="flex items-center space-x-2">
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            <button
                              onClick={(e) => handleShare(article._id, e)}
                              className="text-gray-500 hover:text-white p-1 rounded bg-slate-900/50"
                              title="Copy link"
                            >
                              {copiedId === article._id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Gossip;
