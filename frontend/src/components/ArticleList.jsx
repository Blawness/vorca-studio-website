import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await apiService.getArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error('Error in ArticleList:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content) => {
    // Simple HTML rendering for richtext content
    // In production, you might want to use a proper HTML sanitizer
    return { __html: content };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-gray-600">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-gray-600">No articles found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Latest Articles
      </h1>
      
      <div className="space-y-8">
        {articles.map((article) => (
          <article 
            key={article.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {article.attributes.title}
              </h2>
              
              <div className="text-sm text-gray-500 mb-4">
                Published: {formatDate(article.attributes.publishedAt)}
              </div>
              
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={renderContent(article.attributes.content)}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;


