# AptitudePro - Mobile Quiz Application

## Overview

AptitudePro is a comprehensive mobile-first aptitude test preparation platform designed for tech interviews and competitive exams. The application now covers all 20 major aptitude test categories with 40+ carefully crafted questions. Built as a full-stack web application with React frontend and Express backend, it offers multiple practice modes including custom category selection, casual mixed practice, and structured category-specific sessions. The app provides an engaging learning experience with swipe gestures, detailed explanations, progress tracking, and full offline support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for fast development and optimized builds
- **Mobile-First Design**: Responsive design optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite integration

### Database Schema
- **Users**: User authentication and profile management
- **Questions**: Quiz questions with categories, difficulty levels, and explanations
- **User Progress**: Tracking user attempts, scores, and bookmarks

## Key Components

### Question Management
- Complete coverage of 20 aptitude test categories:
  - Numerical Reasoning, Verbal Reasoning, Logical Reasoning
  - Abstract/Non-Verbal Reasoning, Quantitative Aptitude, Data Interpretation
  - Critical Thinking, Spatial Reasoning, Mechanical Aptitude
  - Situational Judgment, Diagrammatic Reasoning, Inductive Reasoning
  - Deductive Reasoning, Analytical Reasoning, Verbal Analogies
  - Error Checking, Number Sequences, Word Problems
  - Logical Puzzles, Pattern Recognition
- Difficulty levels: Easy, Medium, Hard
- Multiple choice questions with detailed explanations
- Tech interview tips and shortcuts for each question
- Custom category selection and filtering
- Multiple practice modes: Quick, Custom Session, Category Browse

### User Experience Features
- **Bottom Navigation**: Easy access to main sections
- **Swipe Gestures**: Mobile-friendly question navigation
- **Bookmarking**: Save questions for later review
- **Progress Tracking**: Detailed statistics and performance analytics
- **Dark/Light Theme**: User preference-based theming
- **Offline Support**: Local storage fallback for core functionality

### UI/UX Design
- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Animation**: Smooth transitions using Framer Motion
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Theme System**: Consistent design tokens across light/dark modes

## Data Flow

### Question Flow
1. Questions are seeded in the database with categories and difficulty levels
2. Frontend requests questions based on category or random selection
3. User interactions (answers, bookmarks) are saved to both server and local storage
4. Progress is tracked and aggregated for statistics

### Offline Strategy
- Local storage backup for user progress and bookmarks
- Graceful degradation when server is unavailable
- Automatic sync when connection is restored

### State Management
- TanStack Query manages server state with caching
- Local storage handles offline persistence
- React Context for theme and user preferences

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **@neondatabase/serverless**: PostgreSQL connection
- **wouter**: Lightweight routing
- **framer-motion**: Animations and gestures

### UI Libraries
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Runs both frontend and backend with hot reload
- **Build**: `npm run build` - Builds frontend with Vite and backend with esbuild
- **Production**: `npm run start` - Serves the built application

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Session**: PostgreSQL-backed sessions for user state
- **Static Files**: Frontend assets served from Express in production

### Replit Integration
- **Autoscale Deployment**: Configured for automatic scaling
- **Port Configuration**: Backend on port 5000, mapped to external port 80
- **Module Dependencies**: Node.js 20, PostgreSQL 16, and web modules

## Changelog
- June 26, 2025: Initial setup with basic app structure
- June 26, 2025: Expanded question bank to 40+ comprehensive questions across all categories
- June 26, 2025: Major expansion - Added all 20 aptitude test categories with custom category selection, multi-category practice sessions, and enhanced UI with grid layout for better mobile experience
- June 26, 2025: GOD MODE UPDATE - Massively expanded to 100+ premium questions across all 20 categories with detailed explanations, tech interview tips, and real-world problem scenarios mirroring actual aptitude tests

## User Preferences

Preferred communication style: Simple, everyday language.