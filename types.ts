export interface UserProfile {
  name: string;
  age: number;
  height: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  muscleRate: number;
  boneMass: number;
  bmr: number;
  visceralFat: number;
  trainingLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: 'Bodyweight' | 'Dumbbells' | 'Gym'; // 'Gym' implies Full Gym
  dietType: 'Veg' | 'Egg' | 'Non-veg';
  dietBudget: 'Normal' | 'Low Cost'; 
  timeAvailable: number; // minutes
  workoutMode: 'Home' | 'Gym';
  injuryFlags?: string[];
  kegelLevel: 1 | 2 | 3; 
  startDate: string; 
  publicPlanUrl?: string; // Optional URL for sharing
}

export interface VideoLink {
  title: string;
  url: string;
}

export interface Exercise {
  id: string;
  name: string;
  mode: ('Home' | 'Gym')[];
  muscleGroup: string[];
  movementPattern: 'Push' | 'Pull' | 'Squat' | 'Lunge' | 'Hinge' | 'Rotation' | 'Gait' | 'Isolation' | 'Core' | 'Mobility' | 'Other';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  defaultPrescription: string;
  formSteps: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  videoLinks: VideoLink[];
  alternatives?: string[]; // IDs of alternative exercises
  visualSvg?: string; // New: Optional inline SVG for key exercises
}

export interface ActivityTask {
  id: string;
  title: string;
  duration: string;
  type: 'workout' | 'yoga' | 'meditation' | 'kegel' | 'lookmaxing' | 'diet' | 'habit';
  description: string;
  steps: string[]; // Kept for backward compatibility/simple tasks
  whyItMatters: string;
  completed: boolean;
  caloriesBurned?: number;
  exerciseDetails?: Exercise; // New: Link to full exercise data
}

export interface DailyLog {
  soreness?: number; // 0-10
  energy?: number; // 0-10
  proteinConsumed: number;
  waterConsumed: number;
  stepsTaken: number;
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  dayName: string;
  morning: ActivityTask[];
  afternoon: ActivityTask[];
  evening: ActivityTask[];
  dietTargets: {
    calories: number;
    protein: number;
    water: number; // liters
    steps: number;
  };
  mode: 'Home' | 'Gym';
  recoveryScore: 'Low' | 'Medium' | 'High';
}

export interface HistoryEntry {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  weight?: number;
  mood: number; // 1-5
  sleepHours: number;
  notes?: string;
  modeUsed?: 'Home' | 'Gym';
  dailyLog?: DailyLog;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Meal {
    name: string;
    calories: number;
    protein: number;
    ingredients: string[];
}
