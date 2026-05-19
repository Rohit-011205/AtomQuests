import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGoalsStore = create(
  persist(
    (set) => ({
      goals: [],
      // Action to add a goal
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      // Action to remove a goal
      removeGoal: (index) => set((state) => ({
        goals: state.goals.filter((_, i) => i !== index)
      })),
      // Action to reset goals after submission
      clearGoals: () => set({ goals: [] }),
    }),
    { name: "employee-goals-storage" } // This saves data to localStorage automatically
  )
);