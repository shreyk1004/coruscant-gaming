import OpenAI from 'openai';
import { 
  GamifiedGame, 
  UserInput, 
  DecisionLevel, 
  DecisionOption, 
  GameGenerationState 
} from '@/types/game';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class DecisionTreeGenerator {
  private async generateDecisionLevel(
    level: number,
    userInput: UserInput,
    previousDecisions: DecisionLevel[]
  ): Promise<DecisionLevel> {
    const levelPrompts = {
      1: {
        title: "Choose Your Game Style",
        description: "What type of gamification experience do you want?",
        prompt: `Based on the goal "${userInput.goal_description}" and interest "${userInput.interest_theme}", generate 2 different game styles.

Return ONLY a valid JSON object with this structure:
{
  "title": "Choose Your Game Style",
  "description": "What type of gamification experience do you want?",
  "options": [
    {
      "id": "style_1",
      "title": "Style Name",
      "description": "Brief description of this style",
      "preview": "What this style would look like"
    },
    {
      "id": "style_2", 
      "title": "Style Name",
      "description": "Brief description of this style",
      "preview": "What this style would look like"
    }
  ]
}`
      },
      2: {
        title: "Select Your Progress System",
        description: "How do you want to track your advancement?",
        prompt: `Based on the previous choice and the goal "${userInput.goal_description}", generate 2 different progress tracking systems.

Previous decisions: ${JSON.stringify(previousDecisions.map(d => ({ level: d.level, selected: d.selected_option })))}

Return ONLY a valid JSON object with this structure:
{
  "title": "Select Your Progress System", 
  "description": "How do you want to track your advancement?",
  "options": [
    {
      "id": "progress_1",
      "title": "System Name",
      "description": "How this progress system works",
      "preview": "What tracking would look like"
    },
    {
      "id": "progress_2",
      "title": "System Name", 
      "description": "How this progress system works",
      "preview": "What tracking would look like"
    }
  ]
}`
      },
      3: {
        title: "Pick Your Reward Structure",
        description: "What motivates you most?",
        prompt: `Based on the previous choices and goal "${userInput.goal_description}", generate 2 different reward structures.

Previous decisions: ${JSON.stringify(previousDecisions.map(d => ({ level: d.level, selected: d.selected_option })))}

Return ONLY a valid JSON object with this structure:
{
  "title": "Pick Your Reward Structure",
  "description": "What motivates you most?", 
  "options": [
    {
      "id": "rewards_1",
      "title": "Reward Type",
      "description": "What this reward system offers",
      "preview": "Examples of rewards you'd get"
    },
    {
      "id": "rewards_2",
      "title": "Reward Type",
      "description": "What this reward system offers", 
      "preview": "Examples of rewards you'd get"
    }
  ]
}`
      },
      4: {
        title: "Choose Your Challenge Level",
        description: "How difficult do you want this to be?",
        prompt: `Based on all previous choices and goal "${userInput.goal_description}", generate 2 different difficulty approaches.

Previous decisions: ${JSON.stringify(previousDecisions.map(d => ({ level: d.level, selected: d.selected_option })))}

Return ONLY a valid JSON object with this structure:
{
  "title": "Choose Your Challenge Level",
  "description": "How difficult do you want this to be?",
  "options": [
    {
      "id": "difficulty_1", 
      "title": "Difficulty Level",
      "description": "What this difficulty means",
      "preview": "What the experience would be like"
    },
    {
      "id": "difficulty_2",
      "title": "Difficulty Level", 
      "description": "What this difficulty means",
      "preview": "What the experience would be like"
    }
  ]
}`
      }
    };

    const levelConfig = levelPrompts[level as keyof typeof levelPrompts];
    if (!levelConfig) {
      throw new Error(`Invalid decision level: ${level}`);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: levelConfig.prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Failed to generate decision level');

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      const parsed = JSON.parse(jsonContent);
      
      return {
        level,
        title: parsed.title,
        description: parsed.description,
        options: parsed.options
      };
    } catch (error) {
      console.error('Decision level generation failed. Content received:', content);
      console.error('JSON parse error:', error);
      
      // Return fallback options
      return {
        level,
        title: levelConfig.title,
        description: levelConfig.description,
        options: [
          {
            id: `option_1_level_${level}`,
            title: "Option 1",
            description: "First choice for this level",
            preview: "This is what option 1 would look like"
          },
          {
            id: `option_2_level_${level}`,
            title: "Option 2", 
            description: "Second choice for this level",
            preview: "This is what option 2 would look like"
          }
        ]
      };
    }
  }

  private async generateFinalGame(
    userInput: UserInput,
    decisions: DecisionLevel[]
  ): Promise<GamifiedGame> {
    const prompt = `Generate a complete gamification system based on the user's choices.

Goal: ${userInput.goal_description}
Interest Theme: ${userInput.interest_theme}
User Decisions: ${JSON.stringify(decisions.map(d => ({ level: d.level, selected: d.selected_option })))}

Return ONLY a valid JSON object with this exact structure:
{
  "goal": {
    "title": "Goal title",
    "success_criteria": "What success looks like",
    "deadline": null
  },
  "sub_goals": [
    {
      "id": "quest_1",
      "description": "Clear, actionable step",
      "xp": 25,
      "status": "pending"
    }
  ],
  "theme": {
    "theme_title": "Creative theme name",
    "lore_blurb": "2-3 sentences of theme background",
    "visual_palette": {
      "primary": "#3B82F6",
      "secondary": "#1E40AF",
      "accent": "#F59E0B"
    }
  },
  "rewards": {
    "currency_name": "themed currency name",
    "badge_ideas": [
      {
        "id": "badge_1",
        "name": "Badge name",
        "description": "What this badge represents"
      }
    ]
  }
}

Make sure the final game incorporates all the user's choices from the decision tree.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Failed to generate final game');

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      const parsed = JSON.parse(jsonContent);
      
      // Calculate levels and XP
      const totalXp = parsed.sub_goals.reduce((sum: number, goal: any) => sum + goal.xp, 0);
      const xpPerLevel = Math.ceil(totalXp / 5);
      
      const levels = [];
      for (let i = 1; i <= 5; i++) {
        levels.push({
          level: i,
          xp_required: i * xpPerLevel,
          rewards: [`Level ${i} Achievement`]
        });
      }

      const game: GamifiedGame = {
        goal: parsed.goal,
        sub_goals: parsed.sub_goals,
        rules: {
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
        },
        feedback_system: {
          xp_bar: {
            current: 0,
            total: totalXp
          },
          levels: {
            current: 1,
            total: 5,
            xp_per_level: xpPerLevel
          },
          metrics: {
            streaks: 0,
            completion_rate: 0
          }
        },
        rewards: {
          currency_name: parsed.rewards.currency_name,
          rewards_table: levels,
          badges: parsed.rewards.badge_ideas.map((badge: any) => ({
            ...badge,
            unlocked: false
          }))
        },
        challenge_curve: {
          difficulty_per_step: 'medium'
        },
        player_agency: {
          decision_points: decisions.map(d => ({
            id: `decision_${d.level}`,
            description: d.title,
            options: d.options.map(o => o.title)
          })),
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
        },
        theme: parsed.theme,
        feedback_loops: {
          core_loop: "Complete quest → Earn XP → Level up → Unlock rewards → Continue to next quest",
          meta_loop: "Weekly goal reviews and progress celebrations"
        },
        social_layer: {
          leaderboard: {
            enabled: false,
            type: 'private'
          }
        },
        metadata: {
          created_at: new Date().toISOString(),
          user_id: 'demo_user',
          interest_theme: userInput.interest_theme,
          goal_description: userInput.goal_description
        }
      };

      return game;
    } catch (error) {
      console.error('Final game generation failed. Content received:', content);
      console.error('JSON parse error:', error);
      
      // Return fallback game
      return this.generateFallbackGame(userInput, decisions);
    }
  }

  private generateFallbackGame(userInput: UserInput, decisions: DecisionLevel[]): GamifiedGame {
    return {
      goal: {
        title: `Complete: ${userInput.goal_description}`,
        success_criteria: "Complete all sub-goals and reach maximum level",
        deadline: undefined
      },
      sub_goals: [
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
      ],
      rules: {
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
      },
      feedback_system: {
        xp_bar: {
          current: 0,
          total: 175
        },
        levels: {
          current: 1,
          total: 5,
          xp_per_level: 35
        },
        metrics: {
          streaks: 0,
          completion_rate: 0
        }
      },
      rewards: {
        currency_name: `${userInput.interest_theme} Points`,
        rewards_table: [
          { level: 1, xp_required: 35, rewards: ["Level 1 Achievement"] },
          { level: 2, xp_required: 70, rewards: ["Level 2 Achievement"] },
          { level: 3, xp_required: 105, rewards: ["Level 3 Achievement"] },
          { level: 4, xp_required: 140, rewards: ["Level 4 Achievement"] },
          { level: 5, xp_required: 175, rewards: ["Level 5 Achievement"] }
        ],
        badges: [
          {
            id: "first_step",
            name: "First Steps",
            description: "Complete your first quest",
            unlocked: false
          },
          {
            id: "dedication",
            name: "Dedication", 
            description: "Complete 5 quests in a row",
            unlocked: false
          },
          {
            id: "mastery",
            name: "Master",
            description: "Reach the highest level",
            unlocked: false
          }
        ]
      },
      challenge_curve: {
        difficulty_per_step: 'medium'
      },
      player_agency: {
        decision_points: decisions.map(d => ({
          id: `decision_${d.level}`,
          description: d.title,
          options: d.options.map(o => o.title)
        })),
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
      },
      theme: {
        theme_title: `${userInput.interest_theme} Adventure`,
        lore_blurb: `Embark on an exciting journey through the world of ${userInput.interest_theme}. Every step forward brings you closer to mastering your goals.`,
        visual_palette: {
          primary: "#3B82F6",
          secondary: "#1E40AF",
          accent: "#F59E0B"
        }
      },
      feedback_loops: {
        core_loop: "Complete quest → Earn XP → Level up → Unlock rewards → Continue to next quest",
        meta_loop: "Weekly goal reviews and progress celebrations"
      },
      social_layer: {
        leaderboard: {
          enabled: false,
          type: 'private'
        }
      },
      metadata: {
        created_at: new Date().toISOString(),
        user_id: 'demo_user',
        interest_theme: userInput.interest_theme,
        goal_description: userInput.goal_description
      }
    };
  }

  public async startGeneration(userInput: UserInput): Promise<GameGenerationState> {
    const firstLevel = await this.generateDecisionLevel(1, userInput, []);
    
    return {
      user_input: userInput,
      decisions: [firstLevel],
      current_level: 1,
      is_complete: false
    };
  }

  public async makeDecision(
    state: GameGenerationState,
    selectedOptionId: string
  ): Promise<GameGenerationState> {
    // Update the current level with the selected option
    const updatedDecisions = state.decisions.map(decision => 
      decision.level === state.current_level 
        ? { ...decision, selected_option: selectedOptionId }
        : decision
    );

    const nextLevel = state.current_level + 1;

    if (nextLevel <= 4) {
      // Generate the next decision level
      const newLevel = await this.generateDecisionLevel(nextLevel, state.user_input, updatedDecisions);
      
      return {
        ...state,
        decisions: [...updatedDecisions, newLevel],
        current_level: nextLevel,
        is_complete: false
      };
    } else {
      // Generate the final game
      const finalGame = await this.generateFinalGame(state.user_input, updatedDecisions);
      
      return {
        ...state,
        decisions: updatedDecisions,
        current_level: 4,
        is_complete: true,
        final_game: finalGame
      };
    }
  }
} 