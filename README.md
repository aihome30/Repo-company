# PT. Rizki AI Website

Professional web development and digital solutions for startups, UMKMs, and enterprises.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (via nvm recommended)
- npm or pnpm

### Installation

\`\`\`bash
# Clone the repository
git clone git@github.com:pt-rizki-ai/pt-rizki-ai-website.git
cd pt-rizki-ai-website

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm test` - Run tests
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

\`\`\`
src/
├── app/                    # Next.js app directory (pages & API routes)
├── components/             # React components (Navbar, Footer, etc.)
├── lib/                    # Utilities, validation schemas
├── styles/                 # Global CSS
└── content/                # Static content (services, portfolio data)
\`\`\`

## 📦 Technology Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel
- **Database:** (Optional) Supabase
- **Email:** SendGrid or Resend
- **Testing:** Vitest + Playwright

## 🔒 Environment Variables

See `.env.example` for required variables:

- `NEXT_PUBLIC_SITE_URL` - Website URL
- `SENDGRID_API_KEY` - SendGrid API key
- `HCAPTCHA_SECRET` - hCaptcha secret key

## 🚀 Deployment

### Vercel

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy on push to main/develop

### Custom Server

\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Performance

Target Lighthouse scores:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 📞 Support

- Email: hello@pt-rizki-ai.com
- Phone: +62 812 3456 7890

## 📄 License

Proprietary - PT. Rizki AI
