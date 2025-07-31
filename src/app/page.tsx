'use client';

import { useState } from 'react';
import GameForm from '@/components/GameForm';
import GameOutput from '@/components/GameOutput';
import { UserInput, GamifiedGame } from '@/types/game';
import { generateDemoToken } from '@/lib/auth';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<GamifiedGame | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setGame(null);

    try {
      // Generate a demo token for testing
      // In production, this would come from your auth system
      const token = generateDemoToken();
      
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userInput),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate game');
      }

      const data = await response.json();
      setGame(data.game);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGame(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎮 Gamify Anything
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform any goal into an engaging game with AI-powered quests, themes, and rewards.
            Get a complete gamification system ready for implementation.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!game ? (
            <>
              <GameForm onSubmit={handleSubmit} isLoading={isLoading} />
              
              {error && (
                <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error generating game
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ← Create Another Game
                </button>
              </div>
              <GameOutput game={game} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            Built with Next.js, TypeScript, and OpenAI. 
            Your gamification journey starts here! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
