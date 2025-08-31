# Recipe Discovery App

A full-stack recipe discovery application built with Next.js and Express.js, featuring AI-powered ingredient recognition, recipe suggestions, and user favorites.

## Features

- 🔍 **Recipe Search & Discovery** - Search recipes by name or browse all available recipes
- 🥗 **Smart Ingredient Selection** - Choose ingredients by category to get recipe suggestions  
- 📸 **AI Photo Recognition** - Upload vegetable photos to automatically detect ingredients using Google Gemini AI
- ❤️ **Favorites System** - Save and manage your favorite recipes (requires authentication)
- 🎨 **Beautiful Dark Theme** - Modern midnight mist theme with glassmorphism effects
- 📱 **Mobile Responsive** - Fully responsive design that works on all devices
- 🔐 **User Authentication** - Secure login/signup with JWT tokens

## Environment Setup

Before running the application, you need to configure environment variables:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables in `.env.local`:**
   ```env
   # Backend API URL (change for production deployment)
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   
   # Google Gemini AI API Key (required for photo ingredient recognition)
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get your Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Replace `your_gemini_api_key_here` with your actual API key

## Getting Started

### Frontend (Next.js)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
