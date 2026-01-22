import { DayPlan, ActivityTask, UserProfile, DailyLog, Exercise } from '../types';
import { DIET_GUIDELINES, KEGEL_ROUTINES, LOOKMAXING_ROUTINES } from '../constants';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';

// Helper to look up exercises or create a placeholder if missing
const getExercise = (id: string): Exercise => {
    return EXERCISE_DATABASE[id] || {
        id: id,
        name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        mode: ['Home', 'Gym'],
        muscleGroup: ['General'],
        movementPattern: 'Other',
        level: 'Beginner',
        defaultPrescription: '3 sets x 10 reps',
        formSteps: ['Follow standard form.'],
        commonMistakes: [],
        safetyNotes: [],
        videoLinks: [{ title: 'Search YouTube', url: `https://www.youtube.com/results?search_query=${id}+exercise` }]
    };
};

const createWorkoutTask = (exerciseId: string, overrideTitle?: string, overrideDuration?: string): ActivityTask => {
    const ex = getExercise(exerciseId);
    return {
        id: exerciseId,
        title: overrideTitle || ex.name,
        duration: overrideDuration || 'Set',
        type: 'workout',
        completed: false,
        description: `${ex.defaultPrescription} • ${ex.muscleGroup.join(', ')}`,
        steps: ex.formSteps,
        whyItMatters: `${ex.movementPattern} pattern for ${ex.muscleGroup[0]}.`,
        exerciseDetails: ex
    };
};

export const generateDailyPlan = (date: Date, user: UserProfile, dailyLog?: DailyLog): DayPlan => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  const dateStr = date.toISOString().split('T')[0];
  const mode = user.workoutMode;
  const hasPain = (area: string) => user.injuryFlags?.includes(area);

  // Recovery Logic
  const highSoreness = (dailyLog?.soreness ?? 0) > 7;
  const lowEnergy = (dailyLog?.energy ?? 10) < 4;
  let recoveryScore: 'Low' | 'Medium' | 'High' = 'High';
  if (highSoreness || lowEnergy) recoveryScore = 'Low';
  else if ((dailyLog?.soreness ?? 0) > 4) recoveryScore = 'Medium';

  const kegelRoutine = KEGEL_ROUTINES[user.kegelLevel];
  // Select specific exercise based on level
  let kegelExerciseId = 'kegel-basic';
  if (user.kegelLevel === 2) kegelExerciseId = 'kegel-pulsing';
  if (user.kegelLevel === 3) kegelExerciseId = 'reverse-kegel'; 

  const lookmaxIndex = date.getDate() % LOOKMAXING_ROUTINES.length;
  const lookmaxRoutine = LOOKMAXING_ROUTINES[lookmaxIndex];

  // --- Common Modules ---
  const morningRoutine: ActivityTask[] = [
    {
      id: 'm1', title: 'Hydration + Sunlight', duration: '2 min', type: 'habit', completed: false,
      description: 'Drink 500ml water with pinch of salt + lime.',
      steps: ['Fill glass', 'Step outside/balcony'], whyItMatters: 'Kickstarts metabolism.'
    },
    {
      id: 'm2', title: 'Morning Mobility', duration: '10 min', type: 'yoga', completed: false,
      description: 'Spine hygiene.', steps: ['Cat-Cow', 'Deep Squat'], whyItMatters: 'Injury prevention.',
      exerciseDetails: getExercise('cat-cow')
    },
    {
      id: 'm3', title: 'Box Breathing', duration: '4 min', type: 'meditation', completed: false,
      description: '4-4-4-4 technique.', steps: ['Inhale 4s', 'Hold 4s', 'Exhale 4s'], whyItMatters: 'Cortisol control.'
    },
    {
        id: 'm4', title: `Kegel: ${kegelRoutine.title}`, duration: kegelRoutine.duration, type: 'kegel', completed: false,
        description: 'Pelvic floor.', steps: kegelRoutine.steps, whyItMatters: 'Core stability.',
        exerciseDetails: getExercise(kegelExerciseId)
    },
    {
        id: 'm5', title: `Lookmaxing`, duration: '5 min', type: 'lookmaxing', completed: false,
        description: lookmaxRoutine.title, steps: lookmaxRoutine.steps, whyItMatters: 'Appearance.',
        exerciseDetails: getExercise('chin-tuck')
    }
  ];

  const eveningRoutine: ActivityTask[] = [
    {
      id: 'e1', title: 'Decompression', duration: '8 min', type: 'yoga', completed: false,
      description: 'Relax muscles.', steps: ['Child’s Pose', 'Pigeon'], whyItMatters: 'Recovery.'
    }
  ];

  // --- Workout Logic ---
  let workoutTasks: ActivityTask[] = [];

  if (highSoreness) {
      workoutTasks = [createWorkoutTask('cat-cow', 'Recovery Flow', '30 min')];
  } else if (dayName === 'Monday' || dayName === 'Thursday') {
      const isPush = dayName === 'Monday';
      if (mode === 'Gym') {
          if (isPush) {
              workoutTasks = [
                  createWorkoutTask('bench-press'),
                  createWorkoutTask('overhead-press'),
                  createWorkoutTask('chair-dips', 'Tricep Dips'), // fallback if no dip station in db
                  createWorkoutTask('plank')
              ];
          } else {
              workoutTasks = [
                  createWorkoutTask('lat-pulldown'),
                  createWorkoutTask('cable-row'),
                  createWorkoutTask('face-pulls'),
                  createWorkoutTask('trap-bar-deadlift', 'Trap Bar DL (Axial Loading)')
              ];
          }
      } else { // Home
          if (isPush) {
              workoutTasks = [
                  createWorkoutTask('pushups'),
                  createWorkoutTask('pike-pushups'),
                  createWorkoutTask('chair-dips'),
                  createWorkoutTask('plank')
              ];
          } else {
              workoutTasks = [
                  createWorkoutTask('pullups'),
                  createWorkoutTask('dumbbell-row'), // or doorframe
                  createWorkoutTask('chin-tuck', 'Posture Reset'), // placeholder for Rev Angels
                  createWorkoutTask('rucking', 'Rucking (Axial Load)')
              ];
          }
      }
      if (dayName === 'Monday') workoutTasks.push(createWorkoutTask('farmer-carry'));
  } else if (dayName === 'Tuesday' || dayName === 'Friday') {
      if (dayName === 'Tuesday') {
          if (mode === 'Gym') {
               workoutTasks = [
                   createWorkoutTask('front-squat'), 
                   createWorkoutTask('rdl'), 
                   createWorkoutTask('weighted-step-ups')
               ];
          } else {
               workoutTasks = [
                   createWorkoutTask('goblet-squat'), 
                   createWorkoutTask('rdl'), 
                   createWorkoutTask('weighted-step-ups')
               ];
          }
          workoutTasks.push(createWorkoutTask('tibialis-raise'));
      } else { // Friday Impact
           if (mode === 'Gym') {
               workoutTasks = [
                   createWorkoutTask('box-jumps', 'Box Jumps (Impact)'), 
                   createWorkoutTask('trap-bar-deadlift'), 
                   createWorkoutTask('jump-rope')
               ];
           } else {
               workoutTasks = [
                   createWorkoutTask('broad-jumps', 'Broad Jumps (Impact)'), 
                   createWorkoutTask('pushups'), 
                   createWorkoutTask('jump-rope')
               ];
           }
      }
  } else if (dayName === 'Saturday') {
      workoutTasks = [
          { id: 'cardio', title: 'Zone 2 Cardio', duration: '30 min', type: 'workout', completed: false, description: 'Brisk Walk/Jog', steps: ['Maintain 130bpm'], whyItMatters: 'Heart health.' },
          createWorkoutTask('dead-bug'),
          createWorkoutTask('plank', 'Side Planks')
      ];
  } else {
      workoutTasks = [{ id: 'rest', title: 'Active Recovery', duration: '30 min', type: 'yoga', completed: false, description: 'Walk + Foam Roll', steps: [], whyItMatters: 'Growth.'}];
  }

  // Wrap workout tasks in a "Main Workout" block container concept for the UI, 
  // but here we just return them as the afternoon array for simplicity in this structure
  
  return {
    date: dateStr,
    dayName,
    morning: morningRoutine,
    afternoon: workoutTasks,
    evening: eveningRoutine,
    dietTargets: DIET_GUIDELINES,
    mode: mode,
    recoveryScore: recoveryScore
  };
};
