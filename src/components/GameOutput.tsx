'use client';

import { useState } from 'react';
import { GamifiedGame } from '@/types/game';

interface GameOutputProps {
  game: GamifiedGame;
}

export default function GameOutput({ game }: GameOutputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(game, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gamified-game-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Gamified Game
        </h2>
        <button
          onClick={downloadJSON}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Download JSON
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Game Preview
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'json'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Raw JSON
          </button>
        </nav>
      </div>

      {activeTab === 'preview' ? (
        <div className="space-y-6">
          {/* Theme Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🎮 {game.theme.theme_title}
            </h3>
            <p className="text-gray-700 mb-4">{game.theme.lore_blurb}</p>
            <div className="flex space-x-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: game.theme.visual_palette.primary }}></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: game.theme.visual_palette.secondary }}></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: game.theme.visual_palette.accent }}></div>
            </div>
          </div>

          {/* Goal Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Main Goal</h3>
            <p className="text-gray-700 mb-2"><strong>{game.goal.title}</strong></p>
            <p className="text-gray-600">{game.goal.success_criteria}</p>
          </div>

          {/* Quests Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">⚔️ Quests ({game.sub_goals.length})</h3>
            <div className="space-y-3">
              {game.sub_goals.map((quest, index) => (
                <div key={quest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{index + 1}. {quest.description}</p>
                    <p className="text-sm text-gray-500">XP: {quest.xp}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    {quest.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Progress System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{game.feedback_system.levels.current}</p>
                <p className="text-sm text-gray-600">Current Level</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{game.feedback_system.xp_bar.current}</p>
                <p className="text-sm text-gray-600">XP Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{game.rewards.currency_name}</p>
                <p className="text-sm text-gray-600">Currency</p>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🏆 Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {game.rewards.badges.map((badge) => (
                <div key={badge.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">{badge.name}</p>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Details */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">View All Game Details</span>
              <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
            </button>
            
            {isExpanded && (
              <div className="p-4 border-t border-gray-200 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Rules & Constraints</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {game.rules.actions_allowed.map((rule, index) => (
                      <li key={index}>• {rule}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Feedback Loops</h4>
                  <p className="text-sm text-gray-600"><strong>Core Loop:</strong> {game.feedback_loops.core_loop}</p>
                  {game.feedback_loops.meta_loop && (
                    <p className="text-sm text-gray-600"><strong>Meta Loop:</strong> {game.feedback_loops.meta_loop}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm whitespace-pre-wrap">
            {formatJSON(game)}
          </pre>
        </div>
      )}
    </div>
  );
} 