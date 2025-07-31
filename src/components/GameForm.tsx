'use client';

import { useState } from 'react';
import { userInputSchema, UserInput } from '@/lib/validation';

interface GameFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export default function GameForm({ onSubmit, isLoading }: GameFormProps) {
  const [formData, setFormData] = useState({
    goal_description: '',
    interest_theme: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationResult = userInputSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((error: any) => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    onSubmit(validationResult.data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Gamify Your Goal
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="goal_description" className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to achieve? *
          </label>
          <textarea
            id="goal_description"
            name="goal_description"
            value={formData.goal_description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.goal_description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your goal in detail. For example: 'Learn to play guitar by practicing for 30 minutes daily and learning 5 songs by the end of the month'"
            disabled={isLoading}
          />
          {errors.goal_description && (
            <p className="mt-1 text-sm text-red-600">{errors.goal_description}</p>
          )}
        </div>

        <div>
          <label htmlFor="interest_theme" className="block text-sm font-medium text-gray-700 mb-2">
            What interests you? *
          </label>
          <input
            type="text"
            id="interest_theme"
            name="interest_theme"
            value={formData.interest_theme}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.interest_theme ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Space exploration, Medieval fantasy, Sports, Music, etc."
            disabled={isLoading}
          />
          {errors.interest_theme && (
            <p className="mt-1 text-sm text-red-600">{errors.interest_theme}</p>
          )}
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
              Generating your game...
            </div>
          ) : (
            'Create My Game'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• We'll break your goal into manageable quests</li>
          <li>• Create a themed game around your interests</li>
          <li>• Generate a complete gamification system</li>
          <li>• Get a structured JSON output ready for implementation</li>
        </ul>
      </div>
    </div>
  );
} 