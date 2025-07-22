# Land Rover Club Tanzania Website

## Project Overview
A full-stack web application for the Land Rover Club Tanzania, featuring event management, membership registration, gallery showcase, and festival listings. The project has been successfully migrated from Bolt to Replit environment.

## Recent Changes
- **Migration from Bolt to Replit (December 2024)**: 
  - Migrated routing from react-router-dom to wouter for Replit compatibility
  - Fixed all React imports to remove explicit React imports (Vite handles JSX transformation)
  - Fixed component structure and syntax errors in Partners component
  - Updated navigation components to use wouter's useLocation hook properly
  - Fixed Hero component navigation to use wouter's setLocation instead of window.location.href
  - Successfully deployed and running on port 5000
- **PDF and ODF Download Implementation (January 2025)**:
  - Added jsPDF, html2canvas, and file-saver dependencies
  - Implemented proper PDF generation using jsPDF with formatted layout
  - Added ODF (Open Document Format) generation for membership applications
  - Users can now download membership forms in both PDF and ODF formats
  - Replaced old text file download with professional document formats
  - **Club Logo Integration**: Added club logo (club_logo.svg) to the left top corner of both PDF and ODF membership forms
  - Dual download buttons now available: "Pakua PDF" and "Pakua ODF" for membership applications

## Project Architecture

### Frontend (Client)
- **Framework**: React with Vite
- **Routing**: wouter (migrated from react-router-dom)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React icons

### Backend (Server)
- **Framework**: Express.js
- **Language**: TypeScript
- **Storage**: In-memory storage (MemStorage) via storage interface
- **Database Schema**: Drizzle ORM with Zod validation
- **Port**: 5000 (serves both API and client)

### Key Pages
- **Home**: Hero section with call-to-actions, featured events and contact
- **About**: Club history, team, values and statistics
- **Events**: Dynamic event listings with registration deadlines
- **Festivals**: Adventure and festival listings with registration status
- **Gallery**: Photo gallery with category filtering
- **Membership**: Membership plans and application form with PDF/ODF download
- **Contact**: Contact information and inquiry form

### Security & Best Practices
- Client/server separation maintained
- Input validation using Zod schemas
- Proper error handling and loading states
- Responsive design for all screen sizes
- Accessibility considerations in components

## User Preferences
- None specified yet

## Technical Stack
- **Node.js**: v20
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components
- **Lucide Icons**: Consistent iconography
- **Hot Module Reloading**: Development efficiency

## Development Status
✅ Successfully migrated from Bolt to Replit  
✅ All routing migrated to wouter  
✅ All React compatibility issues fixed  
✅ Application running on port 5000  
✅ Hot module reloading working  
⚠️ Minor vite.ts type issue (non-blocking)  

## Deployment
- Running on Replit environment
- Accessible via port 5000
- Ready for production deployment
- All dependencies properly installed and configured

## Next Steps
- User feedback and testing
- Feature enhancements as requested
- Database integration if needed
- API endpoint development for dynamic data