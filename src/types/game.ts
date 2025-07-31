export interface Goal {
  title: string;
  success_criteria: string;
  deadline?: string;
}

export interface SubGoal {
  id: string;
  description: string;
  xp: number;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface Rules {
  actions_allowed: string[];
  fail_conditions: string[];
  time_limits?: string[];
}

export interface FeedbackSystem {
  xp_bar: {
    current: number;
    total: number;
  };
  levels: {
    current: number;
    total: number;
    xp_per_level: number;
  };
  metrics: {
    streaks?: number;
    completion_rate?: number;
    [key: string]: any;
  };
}

export interface Rewards {
  currency_name: string;
  rewards_table: {
    level: number;
    xp_required: number;
    rewards: string[];
  }[];
  badges: {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
  }[];
}

export interface ChallengeCurve {
  difficulty_per_step: 'easy' | 'medium' | 'hard';
}

export interface PlayerAgency {
  decision_points: {
    id: string;
    description: string;
    options: string[];
  }[];
  customizable_assets: {
    id: string;
    name: string;
    type: 'color' | 'theme' | 'avatar' | 'sound';
  }[];
}

export interface Theme {
  theme_title: string;
  lore_blurb: string;
  visual_palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface FeedbackLoops {
  core_loop: string;
  meta_loop?: string;
}

export interface SocialLayer {
  leaderboard?: {
    enabled: boolean;
    type: 'global' | 'friends' | 'private';
  };
  share_url?: string;
}

export interface GamifiedGame {
  goal: Goal;
  sub_goals: SubGoal[];
  rules: Rules;
  feedback_system: FeedbackSystem;
  rewards: Rewards;
  challenge_curve: ChallengeCurve;
  player_agency: PlayerAgency;
  theme: Theme;
  feedback_loops: FeedbackLoops;
  social_layer?: SocialLayer;
  metadata: {
    created_at: string;
    user_id: string;
    interest_theme: string;
    goal_description: string;
  };
}

export interface UserInput {
  goal_description: string;
  interest_theme: string;
} 