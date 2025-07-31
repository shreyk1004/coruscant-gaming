import OpenAI from 'openai';
import { GamifiedGame, UserInput } from '@/types/game';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class GameGenerator {
  private async generateSubGoals(goalDescription: string): Promise<any[]> {
    const prompt = `Break the user goal into 3-7 quests.

Goal: ${goalDescription}

Return ONLY a valid JSON array with this exact structure (no additional text, no markdown formatting):
[
  {
    "id": "unique_id",
    "description": "Clear, actionable step",
    "xp": number,
    "due_date": "optional_date",
    "status": "pending"
  }
]

Make sure each sub-goal is:
- Specific and actionable
- Ordered logically
- Has appropriate XP values (10-100 per quest)
- Covers the entire goal comprehensively

Ensure the response is ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Failed to generate sub-goals');

    try {
      // Try to extract JSON from the response if it contains additional text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Sub-goals generation failed. Content received:', content);
      console.error('JSON parse error:', error);
      
      // Return fallback sub-goals if JSON parsing fails
      return [
        {
          id: "step_1",
          description: "Start working on your goal",
          xp: 25,
          status: "pending"
        },
        {
          id: "step_2", 
          description: "Make consistent progress",
          xp: 50,
          status: "pending"
        },
        {
          id: "step_3",
          description: "Complete your goal",
          xp: 100,
          status: "pending"
        }
      ];
    }
  }

  private async generateTheme(interestTheme: string): Promise<any> {
    const prompt = `Generate a game theme around "${interestTheme}". 

Interest Theme: ${interestTheme}

Return ONLY a valid JSON object with this exact structure (no additional text, no markdown formatting):
{
  "theme_title": "Creative theme name",
  "lore_blurb": "2-3 sentences of theme background",
  "visual_palette": {
    "primary": "#hex_color",
    "secondary": "#hex_color", 
    "accent": "#hex_color"
  },
  "currency_name": "themed currency name",
  "badge_ideas": [
    {
      "id": "badge_id",
      "name": "Badge name",
      "description": "What this badge represents"
    }
  ]
}

Make the theme engaging and relevant to the interest theme. Ensure the response is ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Failed to generate theme');

    try {
      // Try to extract JSON from the response if it contains additional text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Theme generation failed. Content received:', content);
      console.error('JSON parse error:', error);
      
      // Return a fallback theme if JSON parsing fails
      return {
        theme_title: `${interestTheme} Adventure`,
        lore_blurb: `Embark on an exciting journey through the world of ${interestTheme}. Every step forward brings you closer to mastering your goals.`,
        visual_palette: {
          primary: "#3B82F6",
          secondary: "#1E40AF", 
          accent: "#F59E0B"
        },
        currency_name: `${interestTheme} Points`,
        badge_ideas: [
          {
            id: "first_step",
            name: "First Steps",
            description: "Complete your first quest"
          },
          {
            id: "dedication",
            name: "Dedication",
            description: "Complete 5 quests in a row"
          },
          {
            id: "mastery",
            name: "Master",
            description: "Reach the highest level"
          }
        ]
      };
    }
  }

  private calculateLevels(subGoals: any[], totalLevels: number = 5): any {
    const totalXp = subGoals.reduce((sum, goal) => sum + goal.xp, 0);
    const xpPerLevel = Math.ceil(totalXp / totalLevels);

    const levels = [];
    for (let i = 1; i <= totalLevels; i++) {
      levels.push({
        level: i,
        xp_required: i * xpPerLevel,
        rewards: [`Level ${i} Achievement`]
      });
    }

    return {
      xp_per_level: xpPerLevel,
      total_levels: totalLevels,
      levels
    };
  }

  private generateRules(): any {
    return {
      actions_allowed: [
        "Complete quests to earn XP",
        "Track progress on goals",
        "Earn badges for milestones",
        "Level up by accumulating XP"
      ],
      fail_conditions: [
        "Missing deadlines without extension",
        "Abandoning quests without restarting"
      ],
      time_limits: [
        "Complete quests within their due dates",
        "Maintain consistent progress"
      ]
    };
  }

  private generatePlayerAgency(): any {
    return {
      decision_points: [
        {
          id: "quest_order",
          description: "Choose which quest to tackle first",
          options: ["Start with easiest", "Start with most important", "Start with shortest"]
        },
        {
          id: "reward_preference",
          description: "What motivates you most?",
          options: ["Badges and achievements", "Level progression", "Story completion"]
        }
      ],
      customizable_assets: [
        {
          id: "theme_color",
          name: "Theme Color",
          type: "color"
        },
        {
          id: "avatar",
          name: "Player Avatar",
          type: "avatar"
        }
      ]
    };
  }

  private generateFeedbackLoops(): any {
    return {
      core_loop: "Complete quest → Earn XP → Level up → Unlock rewards → Continue to next quest",
      meta_loop: "Weekly goal reviews and progress celebrations"
    };
  }

  public async generateGame(userInput: UserInput, userId: string): Promise<GamifiedGame> {
    // Step 1: Generate sub-goals
    const subGoals = await this.generateSubGoals(userInput.goal_description);
    
    // Step 2: Generate theme
    const themeData = await this.generateTheme(userInput.interest_theme);
    
    // Step 3: Combine and calculate
    const levelData = this.calculateLevels(subGoals);
    const totalXp = subGoals.reduce((sum, goal) => sum + goal.xp, 0);

    const game: GamifiedGame = {
      goal: {
        title: `Complete: ${userInput.goal_description}`,
        success_criteria: "Complete all sub-goals and reach maximum level",
        deadline: undefined
      },
      sub_goals: subGoals,
      rules: this.generateRules(),
      feedback_system: {
        xp_bar: {
          current: 0,
          total: totalXp
        },
        levels: {
          current: 1,
          total: levelData.total_levels,
          xp_per_level: levelData.xp_per_level
        },
        metrics: {
          streaks: 0,
          completion_rate: 0
        }
      },
      rewards: {
        currency_name: themeData.currency_name,
        rewards_table: levelData.levels,
        badges: themeData.badge_ideas.map((badge: any) => ({
          ...badge,
          unlocked: false
        }))
      },
      challenge_curve: {
        difficulty_per_step: 'medium'
      },
      player_agency: this.generatePlayerAgency(),
      theme: {
        theme_title: themeData.theme_title,
        lore_blurb: themeData.lore_blurb,
        visual_palette: themeData.visual_palette
      },
      feedback_loops: this.generateFeedbackLoops(),
      social_layer: {
        leaderboard: {
          enabled: false,
          type: 'private'
        }
      },
      metadata: {
        created_at: new Date().toISOString(),
        user_id: userId,
        interest_theme: userInput.interest_theme,
        goal_description: userInput.goal_description
      }
    };

    return game;
  }
} 