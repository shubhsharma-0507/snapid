# SnapID AI - Premium Passport Photo Generator

A modern, AI-powered web application for generating professional passport photos with instant downloads and compliance validation for all countries.

## Overview

SnapID AI is built on a premium tech stack with a focus on user experience, performance, and security. The application uses Next.js 16, TypeScript, TailwindCSS, and modern web technologies to deliver a seamless passport photo generation experience.

## Key Features

### User-Facing Features
- **Instant Passport Photo Generation**: Upload a photo and get professional passport photos in seconds
- **Face Detection & Enhancement**: Automatic face detection and AI-powered enhancement
- **Background Removal & Customization**: Remove backgrounds and choose from multiple color options
- **Country-Specific Dimensions**: Support for passport photo standards for 50+ countries
- **Photo Sheet Generation**: Generate custom 4x4, 6x6, and 8x8 photo sheets
- **Download Management**: Multiple format downloads (ZIP, PDF, individual JPG/PNG)
- **Photo History**: View and manage previously generated photos
- **User Dashboard**: Quick access to generation tools and account settings
- **Profile Management**: User account settings and password management

### Technical Features
- **Next-Auth Integration**: Secure email/password authentication with JWT tokens
- **MongoDB Database**: Persistent user and photo metadata storage
- **Responsive Design**: Mobile-first design with full responsive support
- **Real-time Processing**: Instant feedback during photo processing
- **Performance Optimized**: Code splitting, lazy loading, and GPU-accelerated animations
- **Security**: Password hashing with bcrypt, CSRF protection, input validation
- **Admin Dashboard**: User management and analytics

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS v4 with custom design tokens
- **Animations**: Framer Motion for smooth 60 FPS animations
- **UI Components**: shadcn/ui with custom enhancements
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js v5 with Credentials provider
- **Database**: MongoDB with Mongoose ORM
- **Image Processing**: Sharp, MediaPipe Tasks for face detection
- **CDN**: Cloudinary for image optimization

### DevOps & Infrastructure
- **Deployment**: Vercel
- **Environment**: TypeScript with strict type checking
- **Version Control**: Git with GitHub integration
- **Package Manager**: pnpm

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages (login, register)
│   ├── (protected)/              # Protected routes requiring authentication
│   │   ├── dashboard/            # User dashboard
│   │   ├── generator/            # Passport photo generator
│   │   ├── history/              # Photo history management
│   │   └── profile/              # User profile settings
│   ├── (admin)/                  # Admin-only routes
│   │   └── admin-dashboard/      # Admin panel
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── photos/               # Photo management endpoints
│   │   └── process/              # Image processing endpoints
│   ├── globals.css               # Global styles and design tokens
│   └── layout.tsx                # Root layout with SessionProvider
├── components/                   # Reusable React components
│   ├── landing/                  # Landing page sections
│   ├── generator/                # Generator workflow components
│   ├── layout/                   # Layout components (navbar, sidebar)
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions and config
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Database connection
│   ├── api.ts                    # API utilities
│   └── types.ts                  # TypeScript interfaces
├── models/                       # MongoDB schema models
│   ├── User.ts                   # User model
│   └── PassportPhoto.ts          # Passport photo metadata model
├── services/                     # Business logic services
│   └── imageProcessing.ts        # Image processing utilities
├── middleware.ts                 # Next.js middleware for route protection
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies

```

## Installation & Setup

### Prerequisites
- Node.js 20+ and pnpm
- MongoDB instance (local or Atlas)
- Environment variables configured

### Setup Steps

1. **Clone and install dependencies**
```bash
git clone <repository>
cd snapid-ai
pnpm install
```

2. **Configure environment variables**
Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
MONGODB_URI=mongodb://localhost:27017/snapid-ai
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REMOVE_BG_API_KEY=your_removebg_key
```

3. **Start the development server**
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Usage Guide

### For Users

1. **Sign Up / Login**: Create a new account or log in with existing credentials
2. **Generate Photos**:
   - Click "Create New Photo" on the dashboard
   - Upload a clear photo of yourself
   - System automatically detects face and removes background
   - Select background color and country-specific dimensions
   - Review the photo sheet preview
   - Download in your preferred format

3. **Manage History**: View all previously generated photos in the History section
4. **Profile Management**: Update account settings and password in Profile section

### For Administrators

1. **Access Admin Panel**: Navigate to `/admin-dashboard`
2. **User Management**: View all users and manage accounts
3. **Photo Analytics**: See statistics on photo generation
4. **System Logs**: Monitor application logs and errors

## Design System

### Color Palette
- **Primary**: #00d4ff (Cyan)
- **Secondary**: #ff00ff (Magenta)
- **Accent**: #00ffff (Cyan/Accent)
- **Background**: #0f0f23 (Dark blue-black)
- **Card**: rgba(20, 20, 40, 0.6) (Semi-transparent)

### Typography
- **Font Family**: Geist (sans-serif), Geist Mono
- **Heading Style**: Bold, text-balance for optimal line breaks
- **Body Style**: Regular weight, 1.5 line height for readability

### Components
- **Glassmorphism**: .glass class for backdrop blur effects
- **Animations**: Framer Motion with 60 FPS target
- **Spacing**: TailwindCSS scale (4px base unit)
- **Border Radius**: 1rem default with variations

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/auth/session` - Get current session

### Photos
- `POST /api/photos/save` - Save generated photo
- `POST /api/photos/download` - Download photo
- `GET /api/photos/history` - Get user's photo history

### Processing
- `POST /api/process/detect-face` - Face detection
- `POST /api/process/remove-background` - Background removal
- `POST /api/process/enhance` - AI enhancement
- `POST /api/process/generate-sheet` - Sheet generation

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Sharp for fast image processing
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: Browser caching with SWR for API calls
- **CSS-in-JS**: Optimized with TailwindCSS Tailwind v4
- **Font Loading**: Optimized with next/font

## Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **Session Management**: Secure JWT tokens with 30-day expiration
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Input Validation**: Zod validation on all user inputs
- **Rate Limiting**: (To be implemented)
- **SQL Injection Prevention**: Parameterized MongoDB queries
- **XSS Prevention**: React's built-in XSS protection

## Database Schema

### User Model
```typescript
{
  _id: ObjectId
  email: string (unique)
  name: string
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### PassportPhoto Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  originalImageUrl: string
  processedImageUrl: string
  country: string
  backgroundColor: string
  dimensions: string
  numberOfCopies: number
  fileFormats: string[]
  createdAt: Date
  updatedAt: Date
}
```

## Deployment

### Deploy to Vercel

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables** in Vercel project settings
3. **Deploy** - Automatic deployment on push to main branch

```bash
vercel --prod
```

### Environment Variables for Production
Set these in Vercel project settings:
- `NEXTAUTH_SECRET` - Secure random string
- `NEXTAUTH_URL` - Production URL
- `MONGODB_URI` - Production MongoDB URI
- `CLOUDINARY_*` - Production Cloudinary credentials

## Development Workflow

### Creating New Components
1. Create component in `/components` directory
2. Use TypeScript for type safety
3. Apply design system colors and spacing
4. Test responsive design

### Adding API Routes
1. Create route in `/app/api/`
2. Use TypeScript for request/response types
3. Add authentication check if needed
4. Document endpoint in API section

### Database Changes
1. Update MongoDB schema in `/models`
2. Create migration if needed
3. Test with development data

## Troubleshooting

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Check MongoDB connection string
- Verify JWT token expiration

### Image Processing Errors
- Validate image format (PNG, JPG, JPEG)
- Check image dimensions (minimum 200x200px)
- Verify file size (max 10MB)

### Database Connection
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify network access for MongoDB Atlas

## Contributing

1. Create a new branch for your feature
2. Make changes following the code style
3. Test thoroughly
4. Create a pull request with clear description

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open a GitHub issue
- Contact support@snapid-ai.com
- Check documentation at snapid-ai.dev

---

**Built with Next.js 16, TypeScript, and TailwindCSS**
#   s n a p i d  
 