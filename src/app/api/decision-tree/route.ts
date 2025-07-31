import { NextRequest, NextResponse } from 'next/server';
import { DecisionTreeGenerator } from '@/lib/decision-tree-generator';
import { validateDemoToken, getUserIdFromToken } from '@/lib/auth';
import { userInputSchema } from '@/lib/validation';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Check for JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Validate the demo token
    if (!validateDemoToken(token)) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, userInput, state, selectedOptionId } = body;

    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const generator = new DecisionTreeGenerator();

    if (action === 'start') {
      // Validate user input
      const validationResult = userInputSchema.safeParse(userInput);
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: 'Invalid request data',
            details: validationResult.error.issues 
          },
          { status: 400 }
        );
      }

      // Start the decision tree
      const initialState = await generator.startGeneration(validationResult.data);
      return NextResponse.json({ state: initialState }, { status: 200 });

    } else if (action === 'make_decision') {
      if (!state || !selectedOptionId) {
        return NextResponse.json(
          { error: 'Missing state or selectedOptionId' },
          { status: 400 }
        );
      }

      // Make a decision and progress the tree
      const newState = await generator.makeDecision(state, selectedOptionId);
      return NextResponse.json({ state: newState }, { status: 200 });

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start" or "make_decision"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error in decision tree:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 