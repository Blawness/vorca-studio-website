// API service for fetching articles from Strapi backend
const API_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

export const apiService = {
  /**
   * Fetch all published articles
   * @returns {Promise<Array>} Array of articles
   */
  async getArticles() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles?publicationState=live&sort=publishedAt:desc`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  /**
   * Fetch a single article by ID
   * @param {string|number} id - Article ID
   * @returns {Promise<Object>} Article object
   */
  async getArticle(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${id}?publicationState=live`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error);
      throw error;
    }
  }
};


