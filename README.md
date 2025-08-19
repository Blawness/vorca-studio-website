# Vorca Studio

A disruptive web agency inspired by the Orca (Killer Whale), representing intelligence, power, and precision in digital solutions.

## 🌊 About

Vorca Studio is a modern web agency that helps businesses dominate the digital landscape through intelligent solutions and collaborative partnerships. Like the Orca that dominates the ocean through sophisticated strategies, we help brands master the digital world.

### Core Services
- **Web Development**: Modern, responsive, high-performance websites
- **UI/UX Design**: Intuitive and engaging interface design
- **Branding**: Strong and memorable brand identity
- **Student Services**: Affordable college assignment help

## 🚀 Tech Stack

### Backend
- **Encore.ts**: TypeScript backend framework
- **PostgreSQL**: Database with SQL migrations
- **Resend**: Email service integration

### Frontend
- **React 18**: Modern React with TypeScript
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **shadcn/ui**: Component library
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Encore CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vorca-studio
   ```

2. **Install Encore CLI** (if not already installed)
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

3. **Install dependencies**
   ```bash
   # Backend dependencies are managed by Encore
   # Frontend dependencies
   cd frontend
   npm install
   ```

### Environment Setup

1. **Backend Secrets**
   Configure secrets in the Encore dashboard or locally:
   ```bash
   encore secret set --type local ResendApiKey your-resend-api-key
   ```

2. **Frontend Configuration**
   Update `frontend/config.ts` with your configuration:
   ```typescript
   export const contactEmail = "your-email@domain.com";
   export const socialLinks = {
     instagram: "your-instagram-url",
     linkedin: "your-linkedin-url",
     github: "your-github-url",
   };
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend**
   ```bash
   encore run
   ```
   The backend will be available at `http://localhost:4000`

2. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Development URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Encore Dashboard**: http://localhost:9400

## 🧪 Testing

### Backend Testing
```bash
# Run backend tests
encore test

# Run specific service tests
encore test ./backend/contact
```

### Frontend Testing
```bash
cd frontend

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Testing
```bash
cd frontend

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

## 🏗️ Building for Production

### Backend Build
```bash
# Build backend for production
encore build

# Deploy to Encore Cloud
encore deploy
```

### Frontend Build
```bash
cd frontend

# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Deployment

1. **Backend Deployment**
   ```bash
   # Deploy to production environment
   encore deploy --env production
   ```

2. **Frontend Deployment**
   The frontend can be deployed to any static hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

   Build the frontend and upload the `dist` folder to your hosting service.

## 📁 Project Structure

```
vorca-studio/
├── backend/                 # Encore.ts backend
│   └── contact/            # Contact service
│       ├── encore.service.ts
│       ├── submit.ts       # Contact form API
│       ├── email.ts        # Email functionality
│       ├── db.ts          # Database connection
│       └── migrations/     # SQL migrations
├── frontend/               # React frontend
│   ├── App.tsx            # Main app component
│   ├── config.ts          # Configuration
│   ├── contexts/          # React contexts
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   └── index.css         # Global styles
├── agents.md             # AI agent documentation
└── README.md            # This file
```

## 🎨 Design System

### Colors
- **Primary**: Cyan (#06b6d4) and Blue (#2563eb)
- **Background**: Black (#000000) and Gray variations
- **Text**: White and Gray variations

### Typography
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable fonts
- **Accent**: Cyan highlights

### Components
- **Cards**: Gradient backgrounds with hover effects
- **Buttons**: Gradient primary buttons with shadows
- **Animations**: Smooth transitions with Framer Motion

## 🌐 Internationalization

The application supports multiple languages:
- **Indonesian (id)**: Default language
- **English (en)**: Secondary language

Language switching is available in the header navigation.

## 📧 Contact Form Integration

The contact form integrates with:
- **Database**: Stores all submissions in PostgreSQL
- **Email**: Sends notifications via Resend API
- **Validation**: Client and server-side validation
- **Multi-language**: Supports Indonesian and English

## 🔧 Configuration

### Backend Configuration
- Secrets managed through Encore.ts
- Database migrations in `backend/contact/migrations/`
- API endpoints documented in code

### Frontend Configuration
- Configuration in `frontend/config.ts`
- Environment-specific settings
- Social media links and contact information

## 📚 Documentation

- **API Documentation**: Available in Encore dashboard
- **Component Documentation**: Inline code comments
- **Brand Guidelines**: See `agents.md`
- **Development Guide**: This README

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the brand guidelines** in `agents.md`
4. **Write tests** for new functionality
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style
- Use TypeScript for all new code
- Follow the existing component patterns
- Maintain responsive design
- Include proper error handling
- Write meaningful commit messages

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- **Email**: hello@vorca.studio
- **Documentation**: See `agents.md` for detailed guidelines
- **Issues**: Create an issue in the repository

## 🚀 Deployment Environments

### Development
- **Backend**: http://localhost:4000
- **Frontend**: http://localhost:5173
- **Database**: Local PostgreSQL via Encore

### Staging
- **Backend**: Encore staging environment
- **Frontend**: Staging deployment URL
- **Database**: Staging PostgreSQL

### Production
- **Backend**: Encore production environment
- **Frontend**: Production deployment URL
- **Database**: Production PostgreSQL

---

**Vorca Studio** - Smart. Sleek. Deep Impact. 🌊
