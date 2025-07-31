import { z } from 'zod';

export const userInputSchema = z.object({
  goal_description: z.string().min(10, 'Goal description must be at least 10 characters').max(500, 'Goal description must be less than 500 characters'),
  interest_theme: z.string().min(3, 'Interest theme must be at least 3 characters').max(100, 'Interest theme must be less than 100 characters'),
});

export const apiRequestSchema = z.object({
  goal_description: z.string().min(10).max(500),
  interest_theme: z.string().min(3).max(100),
});

export type UserInput = z.infer<typeof userInputSchema>;
export type ApiRequest = z.infer<typeof apiRequestSchema>; 