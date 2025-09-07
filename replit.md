# MD Co-Pilot - AI-Powered Executive Assistant

## Overview

MD Co-Pilot is a dual-edition AI-powered assistant designed for Jit Banerjee, Managing Director, focusing on HealthTech (Practo-style B2B SaaS) and IT Development sectors. The application generates instant action plans, proposals, pricing models in INR/USD, compliance reports, and communication drafts using Google's Gemini AI. It serves as an executive dashboard for managing business challenges, tracking revenue metrics, and generating professional communications across both verticals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: TailwindCSS with Shadcn/UI component library for consistent design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider with light/dark mode support using CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with centralized route registration
- **Development Setup**: Hot module replacement via Vite integration for full-stack development
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage Solutions
- **Database**: PostgreSQL with Neon Database as the serverless provider
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

### Authentication and Authorization
- **User Management**: Simple user-based system with hardcoded profile for Jit Banerjee
- **Session Management**: Express sessions with PostgreSQL storage
- **Security**: CORS enabled, JSON parsing middleware, and credential-based authentication

### External Dependencies

#### AI and Machine Learning
- **Google Gemini AI**: Primary AI service for generating business plans, action items, and communications
- **API Integration**: Direct integration with @google/genai SDK
- **Fallback Handling**: Error handling and retry mechanisms for AI service calls

#### Financial Services
- **Exchange Rate API**: Real-time INR/USD conversion using exchangerate-api.com
- **Currency Formatting**: Built-in Intl.NumberFormat for proper currency display
- **Pricing Models**: Dual currency support for Indian and global markets

#### UI and Design System
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Font Integration**: Google Fonts integration for typography (Inter, Playfair Display, JetBrains Mono)
- **Icon System**: Font Awesome for consistent iconography

#### Development and Deployment
- **Replit Integration**: Custom Replit-specific plugins and development banner
- **Build Process**: ESBuild for server bundling, Vite for client bundling
- **Type Safety**: Comprehensive TypeScript configuration with strict mode
- **Development Tools**: Runtime error overlay and hot reload capabilities

#### Data Validation and Type Safety
- **Zod**: Schema validation library integrated with Drizzle for type-safe database operations
- **Form Handling**: React Hook Form with Zod resolvers for form validation
- **API Type Safety**: Shared type definitions between client and server

The architecture emphasizes type safety, real-time data synchronization, and seamless development experience while providing a robust foundation for scaling both HealthTech and IT Development business operations.