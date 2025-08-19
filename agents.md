# Vorca Studio - AI Agent Training Documentation

## Project Overview

Vorca Studio is a disruptive web agency inspired by the Orca (Killer Whale). The brand represents intelligence, power, and precision in digital solutions. This documentation serves as a comprehensive guide for AI agents working on the codebase.

## Brand Identity & Guidelines

### Core Brand Values
- **Intelligence**: Strategic thinking and smart solutions
- **Power**: Leveraging modern technology for maximum impact
- **Precision**: Exact solutions delivered with care
- **Collaboration**: Working together as a pod to achieve extraordinary results

### Visual Identity
- **Primary Colors**: Cyan (#06b6d4) and Blue (#2563eb)
- **Background**: Black (#000000) and Gray variations
- **Typography**: Bold, modern fonts with gradient text effects
- **Logo**: "V" in a cyan-to-blue gradient rounded square
- **Design Style**: Futuristic, cosmic, with subtle animations

### Brand Voice
- Professional yet approachable
- Confident and authoritative
- Tech-savvy and innovative
- Supportive for students and businesses alike

## Architecture Overview

### Backend (Encore.ts)
```
backend/
├── contact/
│   ├── encore.service.ts     # Service definition
│   ├── db.ts                 # Database connection
│   ├── submit.ts             # Contact form API
│   ├── email.ts              # Email sending functionality
│   └── migrations/           # Database migrations
```

**Key Technologies:**
- Encore.ts framework for TypeScript backend
- PostgreSQL database with SQL migrations
- Resend API for email notifications
- RESTful API design

### Frontend (React + TypeScript)
```
frontend/
├── App.tsx                   # Main app component with routing
├── config.ts                 # Configuration constants
├── contexts/
│   └── LanguageContext.tsx   # Internationalization context
├── components/
│   ├── Header.tsx            # Navigation header
│   └── Footer.tsx            # Site footer
└── pages/
    ├── HomePage.tsx          # Landing page
    ├── ServicesPage.tsx      # Services showcase
    ├── PortfolioPage.tsx     # Project portfolio
    ├── AboutPage.tsx         # Company information
    ├── StudentsPage.tsx      # Student services
    └── ContactPage.tsx       # Contact form
```

**Key Technologies:**
- React 18 with TypeScript
- React Router for navigation
- Framer Motion for animations
- Tailwind CSS v4 for styling
- shadcn/ui component library
- TanStack Query for data fetching

## Design System

### Color Palette
```css
/* Primary Colors */
--cyan-400: #22d3ee
--cyan-500: #06b6d4
--blue-500: #3b82f6
--blue-600: #2563eb

/* Neutral Colors */
--black: #000000
--gray-800: #1f2937
--gray-900: #111827
--white: #ffffff
```

### Component Patterns

#### Cards
- Gradient backgrounds: `from-gray-800/50 to-gray-900/50`
- Border: `border-gray-700/50`
- Hover effects: `hover:border-cyan-500/50`
- Shadow: `hover:shadow-2xl hover:shadow-cyan-500/20`
- Transform: `hover:-translate-y-2`

#### Buttons
- Primary: `bg-gradient-to-r from-cyan-500 to-blue-600`
- Hover: `hover:from-cyan-400 hover:to-blue-500`
- Text: `text-black font-semibold`
- Border radius: `rounded-xl`
- Shadow: `shadow-lg shadow-cyan-500/25`

#### Typography
- Headings: Gradient text with `bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent`
- Body text: `text-gray-400` for secondary, `text-white` for primary
- Large headings: `text-6xl md:text-7xl font-bold`

### Animation Guidelines
- Use Framer Motion for all animations
- Entrance animations: `initial={{ opacity: 0, y: 30 }}`
- Stagger delays: `delay: index * 0.1`
- Smooth transitions: `duration: 0.6`
- Hover effects: Scale, shadow, and color transitions

## API Documentation

### Contact Service

#### Submit Contact Form
```typescript
POST /contact
Content-Type: application/json

{
  "name": string,
  "email": string,
  "phone"?: string,
  "company"?: string,
  "serviceType": string,
  "message": string,
  "language": "id" | "en"
}

Response:
{
  "success": boolean,
  "message": string
}
```

## Internationalization

### Supported Languages
- Indonesian (id) - Default
- English (en)

### Translation Keys Structure
```
nav.*          - Navigation items
hero.*         - Homepage hero section
services.*     - Service-related content
about.*        - About page content
students.*     - Student services content
contact.*      - Contact page content
footer.*       - Footer content
common.*       - Shared/common text
portfolio.*    - Portfolio page content
```

### Adding New Translations
1. Add keys to both `id` and `en` objects in `LanguageContext.tsx`
2. Use the `t()` function in components: `t("key.subkey")`
3. Maintain consistency in tone and brand voice

## Development Guidelines

### Code Style
- Use TypeScript for all files
- 2-space indentation
- Functional components with hooks
- Descriptive variable and function names
- Extract reusable logic into custom hooks

### File Organization
- One component per file
- Co-locate related files
- Use index files for clean imports
- Separate concerns (UI, logic, data)

### Component Structure
```typescript
// Imports
import { ... } from "...";

// Types/Interfaces
interface ComponentProps {
  // ...
}

// Component
export default function Component({ props }: ComponentProps) {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX
  );
}
```

### State Management
- Use React Context for global state (language)
- TanStack Query for server state
- Local state with useState for component-specific data
- Avoid prop drilling

## Dependencies

### Core Dependencies
```json
{
  "@tanstack/react-query": "^5.x",
  "framer-motion": "^11.x",
  "lucide-react": "^0.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x"
}
```

### UI Dependencies
```json
{
  "@radix-ui/react-*": "Various versions",
  "class-variance-authority": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

### Backend Dependencies
```json
{
  "encore.dev": "^1.x",
  "@clerk/backend": "^1.x" // If auth is needed
}
```

## Environment Variables

### Frontend Configuration
Located in `frontend/config.ts`:
- `clerkPublishableKey`: Clerk authentication (if needed)
- `apiBaseUrl`: Backend API URL
- `contactEmail`: Company contact email
- `socialLinks`: Social media URLs
- `googleAnalyticsId`: Analytics tracking
- `calendlyLink`: Consultation booking

### Backend Secrets
Managed through Encore.ts secret system:
- `ResendApiKey`: Email service API key
- `ClerkSecretKey`: Authentication secret (if needed)

## Testing Guidelines

### Frontend Testing
- Use Vitest for unit tests
- Test user interactions and component behavior
- Mock external dependencies
- Test accessibility features

### Backend Testing
- Test API endpoints with various inputs
- Validate database operations
- Test error handling scenarios
- Ensure proper authentication (if implemented)

## Performance Optimization

### Frontend
- Lazy load components with React.lazy()
- Optimize images with proper sizing
- Use React.memo for expensive components
- Implement proper loading states

### Backend
- Use database indexes for queries
- Implement proper error handling
- Cache frequently accessed data
- Monitor API response times

## Security Considerations

### Frontend
- Validate all user inputs
- Sanitize data before display
- Use HTTPS in production
- Implement proper CORS policies

### Backend
- Validate API inputs
- Use parameterized queries
- Implement rate limiting
- Secure sensitive data with secrets

## Deployment

### Frontend
- Build optimized production bundle
- Configure proper routing for SPA
- Set up CDN for static assets
- Monitor performance metrics

### Backend
- Use Encore.ts deployment system
- Configure production secrets
- Set up monitoring and logging
- Implement health checks

## Common Patterns

### Page Structure
```typescript
export default function PageName() {
  const { t } = useLanguage();
  
  return (
    <div className="pt-16 bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Cosmic background effects */}
        {/* Content */}
      </section>
      
      {/* Additional sections */}
    </div>
  );
}
```

### API Integration
```typescript
import backend from "~backend/client";

// In component
const handleSubmit = async (data) => {
  try {
    const response = await backend.serviceName.endpointName(data);
    // Handle success
  } catch (error) {
    console.error("Error:", error);
    // Handle error
  }
};
```

### Animation Patterns
```typescript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
  viewport={{ once: true }}
>
  {/* Content */}
</motion.div>
```

## Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript types and imports
2. **Styling Issues**: Verify Tailwind classes and responsive design
3. **API Errors**: Check backend service status and request format
4. **Animation Problems**: Ensure Framer Motion is properly configured

### Debug Tools
- React Developer Tools
- Encore.ts development dashboard
- Browser network tab for API debugging
- Tailwind CSS IntelliSense for styling

## Contributing

### Before Making Changes
1. Understand the brand guidelines
2. Follow the established patterns
3. Test thoroughly across devices
4. Maintain accessibility standards
5. Update documentation if needed

### Code Review Checklist
- [ ] Follows brand design system
- [ ] Responsive design implemented
- [ ] Accessibility considerations
- [ ] Performance optimized
- [ ] Error handling included
- [ ] TypeScript types defined
- [ ] Tests written (if applicable)

This documentation should be referenced for all development work on the Vorca Studio project to maintain consistency and quality across the codebase.
