# Vorca Studio Backend (Strapi)

This is the Strapi backend for Vorca Studio, providing a headless CMS with MySQL database integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your MySQL credentials
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_NAME=vorca_studio
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   ```

3. **Database Setup**
   ```sql
   -- Create MySQL database
   CREATE DATABASE vorca_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Generate Strapi keys**
   ```bash
   # Generate random keys for security
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Start development server**
   ```bash
   npm run develop
   ```

## 🌐 Access Points

- **Admin Panel**: http://localhost:1337/admin
- **API Base URL**: http://localhost:1337/api
- **Articles API**: http://localhost:1337/api/articles

## 📊 Content Types

### Article Collection
- **title** (string, required, unique)
- **content** (richtext, required)
- **publishedAt** (datetime, auto-managed)

## 🔧 Configuration

### Database
- **Client**: MySQL
- **Connection**: Configured via environment variables
- **SSL**: Optional, configurable via `DATABASE_SSL`

### CORS
- **Enabled**: Yes
- **Origins**: 
  - http://localhost:5173 (Vite dev)
  - http://localhost:3000 (React dev)
  - http://localhost:4173 (Vite preview)

### Security
- **JWT**: Configured with environment variables
- **API Tokens**: Secure token generation
- **Admin Access**: Protected admin panel

## 📝 API Usage

### Fetch All Articles
```bash
GET /api/articles?publicationState=live&sort=publishedAt:desc
```

### Fetch Single Article
```bash
GET /api/articles/{id}?publicationState=live
```

### Response Format
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Article Title",
        "content": "<p>Article content...</p>",
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Environment Variables**
   - Set all required environment variables
   - Use strong, unique keys
   - Enable SSL for database connection

## 🔒 Security Considerations

- **API Keys**: Rotate regularly
- **CORS**: Restrict to production domains
- **Database**: Use strong passwords
- **SSL**: Enable in production
- **Rate Limiting**: Consider implementing

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi API Reference](https://docs.strapi.io/dev-docs/api)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in .env
   - Ensure database exists

2. **CORS Errors**
   - Verify frontend URL is in CORS origins
   - Check CORS middleware is enabled

3. **Permission Denied**
   - Check MySQL user permissions
   - Verify database user has proper access

### Support
For issues specific to this project, check the main README.md or create an issue in the repository.


