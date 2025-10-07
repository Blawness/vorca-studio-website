# Articles Feature Setup Guide

This guide explains how to set up and use the Articles feature in the Vorca Studio frontend.

## 🚀 Overview

The Articles feature allows you to:
- Display articles fetched from the Strapi backend
- Show article titles, content, and publication dates
- Navigate to articles via the main navigation
- Access articles at `/articles` route

## 📁 Files Added

### New Components
- `src/components/ArticleList.jsx` - Main component for displaying articles
- `src/pages/ArticlesPage.tsx` - Page wrapper for the articles feature

### New Services
- `src/services/api.js` - API service for fetching articles from Strapi

### Updated Files
- `src/App.tsx` - Added articles route
- `src/components/Header.tsx` - Added articles navigation
- `src/contexts/LanguageContext.tsx` - Added articles translations

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```bash
# Strapi API Configuration
VITE_STRAPI_API_URL=http://localhost:1337

# Frontend Configuration
VITE_APP_TITLE=Vorca Studio
VITE_APP_DESCRIPTION=Modern web agency inspired by the Orca
```

### API Base URL
The API service automatically uses the environment variable `VITE_STRAPI_API_URL` or defaults to `http://localhost:1337`.

## 📱 Usage

### Navigation
- Articles are accessible via the main navigation menu
- Available in both Indonesian ("Artikel") and English ("Articles")
- Route: `/articles`

### Component Features
- **Loading State**: Shows loading message while fetching data
- **Error Handling**: Displays error messages if API calls fail
- **Empty State**: Shows message when no articles are found
- **Responsive Design**: Works on all screen sizes
- **Hover Effects**: Interactive card elements

## 🎨 Styling

The component uses Tailwind CSS classes for styling:
- **Cards**: White background with shadows and hover effects
- **Typography**: Responsive text sizing and proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Colors**: Gray scale for text, cyan/blue for accents

## 🔄 Data Flow

1. **Component Mount**: `useEffect` triggers on component mount
2. **API Call**: `apiService.getArticles()` fetches data from Strapi
3. **State Update**: Articles are stored in component state
4. **Rendering**: Component renders based on loading, error, or success states

## 📊 API Integration

### Endpoint
```
GET /api/articles?publicationState=live&sort=publishedAt:desc
```

### Response Handling
- Filters for published articles only
- Sorts by publication date (newest first)
- Handles Strapi's nested data structure
- Graceful error handling

### Data Structure
```typescript
interface Article {
  id: number;
  attributes: {
    title: string;
    content: string; // HTML content
    publishedAt: string; // ISO date string
  };
}
```

## 🌐 Internationalization

The Articles feature supports both languages:
- **Indonesian**: "Artikel" in navigation
- **English**: "Articles" in navigation
- Content display is language-agnostic (shows data as stored)

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend
2. Navigate to `/articles`
3. Verify loading state appears
4. Check if articles display correctly
5. Test error handling by stopping the backend

### Component Testing
```bash
# Run frontend tests
cd frontend
npm run test

# Test specific component
npm run test ArticleList
```

## 🚀 Production Deployment

### Environment Variables
- Set `VITE_STRAPI_API_URL` to your production Strapi URL
- Ensure CORS is configured on Strapi for your production domain

### Build
```bash
cd frontend
npm run build
```

### Deployment
Deploy the `dist` folder to your hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🔒 Security Considerations

- **CORS**: Backend must allow your frontend domain
- **API Access**: Articles endpoint is public (no authentication required)
- **Content**: Rich text content is rendered as HTML (consider sanitization)

## 🆘 Troubleshooting

### Common Issues

1. **Articles Not Loading**
   - Check if Strapi backend is running
   - Verify API URL in environment variables
   - Check browser console for CORS errors

2. **CORS Errors**
   - Ensure Strapi CORS configuration includes your frontend URL
   - Check if backend is accessible from frontend

3. **Empty Articles List**
   - Verify articles exist in Strapi admin panel
   - Check if articles are published
   - Verify API endpoint returns data

### Debug Steps
1. Check browser network tab for API calls
2. Verify environment variables are loaded
3. Test API endpoint directly in browser
4. Check Strapi admin panel for content

## 📚 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Strapi API Documentation](https://docs.strapi.io/dev-docs/api)

## 🤝 Contributing

When adding new features to the Articles system:
1. Follow the existing component patterns
2. Add proper TypeScript types
3. Include error handling
4. Test with different data scenarios
5. Update this documentation


