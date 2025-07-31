# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- OpenAI API key

## Step 1: Environment Setup

Create a `.env.local` file in the root directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**To get an OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env.local` file

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

1. **Enter a goal**: Try something like "Learn to play guitar by practicing for 30 minutes daily"
2. **Choose a theme**: Enter something like "Rock music" or "Space exploration"
3. **Click "Create My Game"**
4. **View the generated gamification system**

## Example Inputs

### Goal Examples:
- "Learn to cook 5 new recipes by the end of the month"
- "Complete a 5K run training program in 8 weeks"
- "Read 12 books this year"
- "Learn Spanish basics for an upcoming trip"

### Theme Examples:
- "Medieval fantasy"
- "Space exploration"
- "Sports competition"
- "Music and rhythm"
- "Nature and adventure"

## Troubleshooting

### Common Issues:

1. **"OpenAI API key not configured"**
   - Make sure your `.env.local` file exists and contains the correct API key
   - Restart the development server after adding the environment variable

2. **"Rate limit exceeded"**
   - The API is limited to 5 requests per minute per IP
   - Wait a minute and try again

3. **"Invalid token"**
   - This is a demo application using mock authentication
   - The token is automatically generated for testing

4. **TypeScript errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that you're using Node.js 18+

## Next Steps

Once you have the basic application running:

1. **Review the generated JSON**: Download and examine the structure
2. **Customize the prompts**: Modify the LLM prompts in `src/lib/game-generator.ts`
3. **Add database support**: Follow the README for Supabase integration
4. **Deploy to production**: Use Vercel or your preferred platform

## Support

If you encounter any issues:
- Check the browser console for errors
- Review the terminal output for server errors
- Ensure your OpenAI API key is valid and has credits
- Try different goal/theme combinations

---

**Happy gamifying! 🎮** 