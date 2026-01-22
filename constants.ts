import { UserProfile, HistoryEntry } from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Gaurav",
  age: 24,
  height: "5'7\"",
  weight: 60,
  bmi: 21,
  bodyFat: 19.2,
  muscleRate: 44.3,
  boneMass: 2.5,
  bmr: 1346,
  visceralFat: 6,
  trainingLevel: 'Intermediate',
  equipment: 'Dumbbells',
  dietType: 'Non-veg',
  dietBudget: 'Normal',
  timeAvailable: 60,
  workoutMode: 'Home',
  injuryFlags: [],
  kegelLevel: 1,
  startDate: new Date().toISOString(),
  publicPlanUrl: ""
};

export const generateDemoHistory = (): HistoryEntry[] => {
  const history: HistoryEntry[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const weight = 60 + (Math.random() * 0.4 - 0.2); 
    
    history.push({
      date: dateStr,
      tasksCompleted: Math.floor(Math.random() * 3) + 10,
      totalTasks: 15,
      weight: parseFloat(weight.toFixed(1)),
      mood: Math.floor(Math.random() * 2) + 3,
      sleepHours: Math.floor(Math.random() * 2) + 6,
      modeUsed: Math.random() > 0.7 ? 'Gym' : 'Home',
      dailyLog: {
          proteinConsumed: 110 + Math.floor(Math.random() * 20),
          waterConsumed: 3 + Math.random(),
          stepsTaken: 8000 + Math.floor(Math.random() * 3000),
          soreness: Math.floor(Math.random() * 5),
          energy: Math.floor(Math.random() * 4) + 6
      }
    });
  }
  return history;
};

export const WEEKLY_SPLIT = {
  Monday: "Upper Body Strength (Push Focus) + Bone Loading",
  Tuesday: "Lower Body (Squat/Lunge) + Tibialis Work",
  Wednesday: "Active Recovery (Yoga + Core + Mobility)",
  Thursday: "Upper Body Strength (Pull Focus) + Posture",
  Friday: "Full Body Functional + High Impact (Bone density)",
  Saturday: "Cardio Zone 2 + Deep Stretch",
  Sunday: "Rest + Meal Prep + Mental Reset",
};

export const DIET_GUIDELINES = {
  calories: 2300, 
  protein: 120, 
  water: 3.5,
  steps: 9000
};

export const KEGEL_ROUTINES = {
    1: { title: "Beginner Activation", duration: "3 min", steps: ["Contract 3s", "Relax 3s", "10 Reps", "Focus on isolation"] },
    2: { title: "Intermediate Endurance", duration: "5 min", steps: ["Contract 5s", "Relax 3s", "15 Reps", "Quick flicks: 10 reps"] },
    3: { title: "Advanced Mastery", duration: "7 min", steps: ["Contract 10s", "Relax 5s", "10 Reps", "Elevator pulsing", "Movement integration"] }
};

export const LOOKMAXING_ROUTINES = [
    { title: "Neck & Jawline", steps: ["Chin Tucks: 20 reps", "Mewing hold (N-spot)", "Platysma stretch"] },
    { title: "Eye & Face Tension", steps: ["Eye circles", "Brow massage", "Cheek puff & relax"] },
    { title: "Posture & Confidence", steps: ["Wall angels", "Chest opener", "Shoulder external rotation"] }
];

export const MEAL_TEMPLATES = {
    'Non-veg': {
        breakfast: { name: "Eggs & Toast", calories: 500, protein: 25, ingredients: ["3 Eggs", "2 Brown Bread", "Butter"] },
        lunch: { name: "Chicken Curry & Rice", calories: 700, protein: 40, ingredients: ["Chicken Breast 150g", "Rice 1 cup", "Veg Salad"] },
        snack: { name: "Protein Shake & Fruit", calories: 250, protein: 25, ingredients: ["Whey Scoop", "Apple"] },
        dinner: { name: "Fish/Chicken & Veggies", calories: 500, protein: 35, ingredients: ["Fish/Chicken 150g", "Mixed Veggies", "1 Roti"] }
    },
    'Egg': {
        breakfast: { name: "Omelette & Oats", calories: 500, protein: 20, ingredients: ["3 Eggs", "Oats 50g", "Milk"] },
        lunch: { name: "Egg Curry & Roti", calories: 650, protein: 25, ingredients: ["3 Boiled Eggs", "2 Roti", "Salad"] },
        snack: { name: "Boiled Eggs & Nuts", calories: 300, protein: 18, ingredients: ["3 Egg Whites", "Almonds"] },
        dinner: { name: "Paneer/Egg Bhurji", calories: 500, protein: 25, ingredients: ["Paneer/Eggs", "Veggies", "1 Roti"] }
    },
    'Veg': {
        breakfast: { name: "Paneer Sandwich / Sprouts", calories: 450, protein: 20, ingredients: ["Paneer 100g", "Bread", "Sprouts"] },
        lunch: { name: "Dal, Paneer & Rice", calories: 700, protein: 25, ingredients: ["Dal 1 bowl", "Paneer 100g", "Rice"] },
        snack: { name: "Greek Yogurt / Whey", calories: 250, protein: 25, ingredients: ["Yogurt/Whey", "Berries"] },
        dinner: { name: "Soya Chunks Stir Fry", calories: 450, protein: 30, ingredients: ["Soya Chunks 50g", "Veggies", "Olive Oil"] }
    }
};

export const LOW_COST_ADJUSTMENTS = {
    'Non-veg': { swap: "Chicken -> Eggs/Soya", save: "Buy seasonal veg" },
    'Veg': { swap: "Paneer -> Soya Chunks/Lentils", save: "Bulk buy rice/dal" }
};
