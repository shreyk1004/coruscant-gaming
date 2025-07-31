'use client';

import { useState } from 'react';
import { GameGenerationState, DecisionLevel } from '@/types/game';
import GameOutput from './GameOutput';
import { generateDemoToken } from '@/lib/auth';

interface DecisionTreeProps {
  onReset: () => void;
}

export default function DecisionTree({ onReset }: DecisionTreeProps) {
  const [state, setState] = useState<GameGenerationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async (userInput: { goal_description: string; interest_theme: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = generateDemoToken();
      
      const response = await fetch('/api/decision-tree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'start',
          userInput
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start generation');
      }

      const data = await response.json();
      setState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const makeDecision = async (selectedOptionId: string) => {
    if (!state) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = generateDemoToken();
      
      const response = await fetch('/api/decision-tree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'make_decision',
          state,
          selectedOptionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to make decision');
      }

      const data = await response.json();
      setState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLevel = (): DecisionLevel | null => {
    if (!state) return null;
    return state.decisions.find(d => d.level === state.current_level) || null;
  };

  const getProgressPercentage = (): number => {
    if (!state) return 0;
    return (state.current_level / 4) * 100;
  };

  if (!state) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Start Your Decision Tree
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your goal and interest to begin creating your personalized gamification system through a series of choices.
        </p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startGeneration({
            goal_description: formData.get('goal_description') as string,
            interest_theme: formData.get('interest_theme') as string
          });
        }} className="space-y-6">
          <div>
            <label htmlFor="goal_description" className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to achieve? *
            </label>
            <textarea
              id="goal_description"
              name="goal_description"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Describe your goal in detail. For example: 'Learn to play guitar by practicing for 30 minutes daily and learning 5 songs by the end of the month'"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="interest_theme" className="block text-sm font-medium text-gray-700 mb-2">
              What interests you? *
            </label>
            <input
              type="text"
              id="interest_theme"
              name="interest_theme"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="e.g., Space exploration, Medieval fantasy, Sports, Music, etc."
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Starting your journey...
              </div>
            ) : (
              'Start Decision Tree'
            )}
          </button>
        </form>
      </div>
    );
  }

  if (state.is_complete && state.final_game) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Create Another Game
          </button>
        </div>
        <GameOutput game={state.final_game} />
      </div>
    );
  }

  const currentLevel = getCurrentLevel();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {state.current_level} of 4
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(getProgressPercentage())}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Decision Level */}
      {currentLevel && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentLevel.title}
            </h2>
            <p className="text-gray-600">
              {currentLevel.description}
            </p>
          </div>

          {/* Decision Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentLevel.options.map((option) => (
              <button
                key={option.id}
                onClick={() => makeDecision(option.id)}
                disabled={isLoading}
                className={`p-6 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                  isLoading
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {option.description}
                </p>
                {option.preview && (
                  <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                    <strong>Preview:</strong> {option.preview}
                  </div>
                )}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Generating your next choices...</p>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error making decision
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous Decisions Summary */}
      {state.decisions.length > 1 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Choices So Far</h3>
          <div className="space-y-3">
            {state.decisions.slice(0, -1).map((decision) => {
              const selectedOption = decision.options.find(opt => opt.id === decision.selected_option);
              return (
                <div key={decision.level} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium text-gray-900">{decision.title}</span>
                    <span className="text-gray-500 ml-2">→</span>
                    <span className="text-blue-600 ml-2">{selectedOption?.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 