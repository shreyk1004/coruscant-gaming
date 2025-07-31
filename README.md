# 🎮 Gamify Anything

Transform any goal into an engaging game with AI-powered quests, themes, and rewards. This Next.js application generates complete gamification systems based on your goals and interests.

## Features

- **AI-Powered Game Generation**: Uses OpenAI to create personalized quests and themes
- **Complete Gamification System**: Generates all 10 core gamification elements
- **Structured JSON Output**: Ready-to-use game data for implementation
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Type Safety**: Full TypeScript support with Zod validation
- **Security**: JWT authentication, rate limiting, and input validation

## Gamification Elements

Based on your planning, the system generates:

1. **Goal / Win Condition** - Clear end-state that signals success
2. **Sub-Goals / Quests** - Ordered, bite-sized steps toward the main goal
3. **Rules & Constraints** - What players can/cannot do
4. **Feedback System** - Continuous progress signals (XP, levels, metrics)
5. **Rewards / Economy** - Points, badges, virtual currency, unlocks
6. **Challenge Curve** - Gradual increase in difficulty
7. **Player Agency** - Meaningful choices and customization
8. **Theme / Narrative** - Wrapper tied to user interests
9. **Feedback Loops** - Core and meta gameplay loops
10. **Social Layer** - Competition and collaboration features

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd coruscant-gaming
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional (for production)
   JWT_SECRET=your_jwt_secret_here
   REDIS_URL=your_redis_url_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Enter your goal**: Describe what you want to achieve in detail
2. **Choose your theme**: Pick an interest area (e.g., Space, Fantasy, Sports)
3. **Generate your game**: Click "Create My Game" to generate the gamification system
4. **Review and download**: View the game preview and download the JSON output

## API Endpoints

### POST `/api/generate-game`

Generates a complete gamification system.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "goal_description": "Learn to play guitar by practicing daily",
  "interest_theme": "Rock music"
}
```

**Response:**
```json
{
  "game": {
    "goal": { ... },
    "sub_goals": [ ... ],
    "theme": { ... },
    "rewards": { ... },
    // ... complete gamification system
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── api/generate-game/route.ts  # Game generation API
│   ├── page.tsx                    # Main application page
│   └── layout.tsx                  # Root layout
├── components/
│   ├── GameForm.tsx               # User input form
│   └── GameOutput.tsx             # Game display component
├── lib/
│   ├── game-generator.ts          # AI game generation logic
│   └── validation.ts              # Zod validation schemas
└── types/
    └── game.ts                    # TypeScript type definitions
```

## Security Features

- **JWT Authentication**: All API routes require valid JWT tokens
- **Input Validation**: Zod schemas validate all inputs
- **Rate Limiting**: 5 requests per minute per IP
- **Environment Variables**: All secrets use `process.env`
- **Parameterized Queries**: SQL injection protection (when database is added)

## Development

### Adding Database Support

To add Supabase database support:

1. **Install Supabase**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Add environment variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Enable Row Level Security** on all tables
4. **Create policies** using `auth.uid()` for user-specific access
5. **Use RPCs** for privileged operations

### Testing

```bash
# Run tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI**
