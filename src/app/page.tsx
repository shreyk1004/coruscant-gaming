'use client';

import { useState } from 'react';
import DecisionTree from '@/components/DecisionTree';

export default function Home() {
  const handleReset = () => {
    // This will reset the decision tree component
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
            Create your perfect gamification system through an interactive decision tree.
            Make choices at each step to customize your experience and get a personalized game.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <DecisionTree onReset={handleReset} />
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
