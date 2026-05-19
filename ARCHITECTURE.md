# King Salon Architecture

## Project Overview
Luxury modern website for King Salon Celle.

Focus:
- Premium branding
- High conversion
- Mobile-first UX
- Smooth animations
- SEO optimization
- Admin management system

---

# Tech Stack

## Frontend
- Next.js 15
- React
- TypeScript
- TailwindCSS
- Framer Motion
- Shadcn UI

## Backend
- Supabase

## Database
- PostgreSQL (Supabase)

## Authentication
- Supabase Auth

## Storage
- Supabase Storage

## Hosting
- Vercel

---

# Main Features

## Public Website
- Hero section
- Services
- Pricing
- Gallery
- Reviews
- Contact
- Booking CTA
- SEO pages

## Admin Dashboard
- Login
- Manage services
- Manage prices
- Manage working hours
- Manage contact info
- Manage gallery
- Manage homepage content
- Manage SEO
- Manage reviews
- Analytics overview

---

# Database Structure

## tables

### services
- id
- title
- description
- price
- duration
- image
- active

### gallery
- id
- image
- category
- created_at

### settings
- id
- phone
- email
- address
- instagram
- facebook
- opening_hours
- seo_title
- seo_description

### reviews
- id
- name
- text
- rating
- active

### admins
- id
- email
- role

---

# Design System

## Style
- Dark luxury
- Cinematic UI
- Matte black
- White typography
- Gold accents
- Glassmorphism

## Animations
- Smooth transitions
- Scroll reveal
- Premium motion
- Soft hover effects

---

# SEO
- Dynamic metadata
- Open Graph
- Schema.org
- Local SEO
- Google indexing
- Optimized images

---

# Performance Goals
- Lighthouse 95+
- Mobile optimized
- Lazy loading
- Server components
- Image optimization

---

# Security
- Admin authentication
- Protected dashboard
- Environment variables
- Row level security
- Secure API routes