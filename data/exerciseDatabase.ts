import { Exercise } from '../types';

// Helper to generate a reliable search link
const getSearchLink = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const EXERCISE_DATABASE: Record<string, Exercise> = {
  // --- BONE DENSITY: IMPACT (Osteogenic Loading) ---
  'jump-rope': {
    id: 'jump-rope',
    name: 'Jump Rope / Pogo Hops',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Calves', 'Cardio', 'Bone Density'],
    movementPattern: 'Gait',
    level: 'Beginner',
    defaultPrescription: '3 sets x 1 min',
    formSteps: [
      'Keep elbows close to ribs.',
      'Bounce on balls of feet (impact creates bone density).',
      'Keep knees soft but springy.',
      'Use wrists to spin the rope, not arms.'
    ],
    commonMistakes: ['Jumping too high.', 'Landing flat-footed (bad for joints).'],
    safetyNotes: ['Wear supportive shoes.', 'Start with 30s intervals if shin splints occur.'],
    videoLinks: [{ title: 'Jump Rope Form', url: getSearchLink('how to jump rope properly') }],
    visualSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="20" r="8" /><path d="M50 28 L50 60 M50 60 L35 90 M50 60 L65 90 M20 50 L80 50 M20 50 Q 50 110 80 50" /></svg>`
  },
  'box-jumps': {
    id: 'box-jumps',
    name: 'Box Jumps',
    mode: ['Gym', 'Home'], // Home if sturdy object
    muscleGroup: ['Quads', 'Glutes', 'Calves'],
    movementPattern: 'Squat',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 8 reps',
    formSteps: [
      'Stand facing box.',
      'Squat slightly and swing arms back.',
      'Explode up, landing softly on the box.',
      'Stand up fully to extend hips.',
      'Step down (do not jump down to save achilles).'
    ],
    commonMistakes: ['Landing with knees caving in.', 'Jumping down backwards.'],
    safetyNotes: ['Step down one foot at a time to reduce injury risk.'],
    videoLinks: [{ title: 'Box Jump Technique', url: getSearchLink('box jump technique') }]
  },
  'broad-jumps': {
    id: 'broad-jumps',
    name: 'Broad Jumps',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Glutes', 'Hamstrings', 'Quads'],
    movementPattern: 'Hinge',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 6 reps',
    formSteps: [
      'Feet shoulder-width.',
      'Swing arms back and hinge hips.',
      'Jump forward as far as possible.',
      'Land softly in a squat position.'
    ],
    commonMistakes: ['Landing stiff-legged (high injury risk).'],
    safetyNotes: ['Land quietly. Noise = Impact on joints, Quiet = Impact on muscles.'],
    videoLinks: [{ title: 'Broad Jump Form', url: getSearchLink('standing broad jump form') }]
  },

  // --- BONE DENSITY: AXIAL LOADING (Spine Compression) ---
  'trap-bar-deadlift': {
    id: 'trap-bar-deadlift',
    name: 'Trap Bar Deadlift',
    mode: ['Gym'],
    muscleGroup: ['Quads', 'Glutes', 'Back', 'Traps'],
    movementPattern: 'Hinge', // Hybrid Squat/Hinge
    level: 'Intermediate',
    defaultPrescription: '3 sets x 6-8 reps',
    formSteps: [
      'Step inside bar, feet hip-width.',
      'Hinge hips back and bend knees to grab handles.',
      'Chest up, spine neutral.',
      'Drive feet into floor to stand up tall.'
    ],
    commonMistakes: ['Rounding back.', 'Squatting too much (hips too low).'],
    safetyNotes: ['Great for axial loading with less shear force on spine than barbell.'],
    videoLinks: [{ title: 'Trap Bar Deadlift', url: getSearchLink('trap bar deadlift form') }],
    visualSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="20" r="8" /><rect x="25" y="60" width="50" height="10" rx="2" /><path d="M50 28 L50 60 M30 60 L30 40 M70 60 L70 40 M25 70 L25 80 M75 70 L75 80" /></svg>`
  },
  'front-squat': {
    id: 'front-squat',
    name: 'Front Squat',
    mode: ['Gym'], // Can do Goblet for Home
    muscleGroup: ['Quads', 'Core', 'Upper Back'],
    movementPattern: 'Squat',
    level: 'Advanced',
    defaultPrescription: '3 sets x 8 reps',
    formSteps: [
      'Rack bar on front delts, elbows high.',
      'Feet shoulder-width.',
      'Squat down keeping torso as vertical as possible.',
      'Drive up.'
    ],
    commonMistakes: ['Elbows dropping.', 'Rounding upper back.'],
    safetyNotes: ['Requires good thoracic mobility. Switch to Goblet if wrists hurt.'],
    videoLinks: [{ title: 'Front Squat Guide', url: getSearchLink('front squat form') }]
  },
  'weighted-step-ups': {
    id: 'weighted-step-ups',
    name: 'Weighted Step-Ups',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Quads', 'Glutes'],
    movementPattern: 'Lunge',
    level: 'Beginner',
    defaultPrescription: '3 sets x 10/leg',
    formSteps: [
      'Hold dumbbells in hands.',
      'Place one foot on box/chair.',
      'Drive through the top heel to stand up (do not push off bottom foot).',
      'Lower slowly.'
    ],
    commonMistakes: ['Pushing off the floor leg.', 'Box too high (rounding lower back).'],
    safetyNotes: ['Control the descent to protect knees.'],
    videoLinks: [{ title: 'Weighted Step Ups', url: getSearchLink('weighted step up form') }]
  },
  'rucking': {
    id: 'rucking',
    name: 'Rucking (Weighted Walk)',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Back', 'Legs', 'Core'],
    movementPattern: 'Gait',
    level: 'Beginner',
    defaultPrescription: '20-30 min walk',
    formSteps: [
      'Wear a weighted backpack (start with 5-10kg).',
      'Keep posture tall, shoulders back.',
      'Walk at a brisk pace.'
    ],
    commonMistakes: ['Leaning forward excessively.', 'Using straps that are too loose.'],
    safetyNotes: ['Excellent low-impact axial loading for bone density.'],
    videoLinks: [{ title: 'Rucking Guide', url: getSearchLink('how to ruck properly') }]
  },

  // --- PUSH (Home) ---
  'pushups': {
    id: 'pushups',
    name: 'Standard Push-Up',
    mode: ['Home'],
    muscleGroup: ['Chest', 'Triceps', 'Front Delts'],
    movementPattern: 'Push',
    level: 'Beginner',
    defaultPrescription: '3 sets x 10-15 reps',
    formSteps: [
      'Start in high plank, hands slightly wider than shoulders.',
      'Engage core and glutes to keep body in a straight line.',
      'Lower chest to floor, keeping elbows at 45-degree angle.',
      'Push back up explosively.'
    ],
    commonMistakes: ['Flaring elbows out too wide (90 degrees).', 'Sagging hips.', 'Neck craning forward.'],
    safetyNotes: ['If wrist pain occurs, use push-up handles or dumbbells.'],
    videoLinks: [{ title: 'Perfect Pushup Form', url: getSearchLink('perfect pushup form') }]
  },
  'pike-pushups': {
    id: 'pike-pushups',
    name: 'Pike Push-Up',
    mode: ['Home'],
    muscleGroup: ['Shoulders', 'Triceps'],
    movementPattern: 'Push',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 8-12 reps',
    formSteps: [
      'Start in downward dog position, hips high.',
      'Lower head towards the floor between hands.',
      'Push back up to starting position.'
    ],
    commonMistakes: ['Flaring elbows.', 'Not keeping legs straight (bend if needed for hamstring flexibility).'],
    safetyNotes: ['Be careful not to hit your head on the floor.'],
    videoLinks: [{ title: 'Pike Pushup Tutorial', url: getSearchLink('pike pushup progression') }]
  },
  'chair-dips': {
    id: 'chair-dips',
    name: 'Tricep Chair Dips',
    mode: ['Home'],
    muscleGroup: ['Triceps'],
    movementPattern: 'Push',
    level: 'Beginner',
    defaultPrescription: '3 sets x 12-15 reps',
    formSteps: [
      'Sit on edge of chair, hands gripping edge next to hips.',
      'Slide butt off chair, supporting weight with arms.',
      'Lower body by bending elbows until 90 degrees.',
      'Push back up.'
    ],
    commonMistakes: ['Shrugging shoulders.', 'Going too deep (bad for shoulders).'],
    safetyNotes: ['Stop if you feel sharp pain in front of shoulder.'],
    videoLinks: [{ title: 'Chair Dips Guide', url: getSearchLink('how to do chair dips') }]
  },

  // --- PUSH (Gym) ---
  'bench-press': {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    mode: ['Gym'],
    muscleGroup: ['Chest', 'Triceps'],
    movementPattern: 'Push',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 8-10 reps',
    formSteps: [
      'Lie on bench, feet flat on floor.',
      'Grip bar slightly wider than shoulders.',
      'Lower bar to mid-chest with control.',
      'Press bar back up.'
    ],
    commonMistakes: ['Bouncing bar off chest.', 'Lifting butt off bench.'],
    safetyNotes: ['Always use a spotter or safety pins for heavy sets.'],
    videoLinks: [{ title: 'Bench Press Technique', url: getSearchLink('bench press form') }]
  },
  'overhead-press': {
    id: 'overhead-press',
    name: 'Overhead Press (OHP)',
    mode: ['Gym', 'Home'], // If dumbbells
    muscleGroup: ['Shoulders', 'Triceps', 'Core'],
    movementPattern: 'Push',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 8-10 reps',
    formSteps: [
      'Stand feet shoulder-width, brace core.',
      'Press weight directly overhead until arms lock out.',
      'Lower with control to collarbone level.'
    ],
    commonMistakes: ['Arching back excessively.', 'Pushing weight forward instead of up.'],
    safetyNotes: ['Engage glutes to protect lower back.'],
    videoLinks: [{ title: 'OHP Guide', url: getSearchLink('overhead press form') }]
  },

  // --- PULL (Home) ---
  'pullups': {
    id: 'pullups',
    name: 'Pull-Ups',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Lats', 'Biceps'],
    movementPattern: 'Pull',
    level: 'Advanced',
    defaultPrescription: '3 sets x Max reps',
    formSteps: [
      'Grip bar slightly wider than shoulders.',
      'Pull chest towards bar by driving elbows down.',
      'Lower fully to dead hang.'
    ],
    commonMistakes: ['Kipping/Swinging.', 'Not going all the way down.'],
    safetyNotes: ['Use bands if cannot do 1 rep.'],
    videoLinks: [{ title: 'Pullup Progression', url: getSearchLink('how to do pullups') }]
  },
  'doorframe-row': {
    id: 'doorframe-row',
    name: 'Doorframe Row',
    mode: ['Home'],
    muscleGroup: ['Back', 'Rear Delts'],
    movementPattern: 'Pull',
    level: 'Beginner',
    defaultPrescription: '3 sets x 15 reps',
    formSteps: [
      'Stand in doorway, grip frame with one/both hands.',
      'Lean back.',
      'Pull chest to frame using back muscles.'
    ],
    commonMistakes: ['Using mostly arms.', 'Rounding back.'],
    safetyNotes: ['Ensure good grip.'],
    videoLinks: [{ title: 'Door Row', url: getSearchLink('doorframe row exercise') }]
  },
  'dumbbell-row': {
    id: 'dumbbell-row',
    name: 'Dumbbell/Backpack Row',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Lats', 'Biceps'],
    movementPattern: 'Pull',
    level: 'Beginner',
    defaultPrescription: '3 sets x 12 reps',
    formSteps: [
      'Hinge at hips, hand on bench/knee for support.',
      'Pull weight to hip pocket.',
      'Lower with control.'
    ],
    commonMistakes: ['Rounding back.', 'Rotating torso.'],
    safetyNotes: ['Keep spine neutral.'],
    videoLinks: [{ title: 'DB Row Form', url: getSearchLink('dumbbell row form') }]
  },

  // --- PULL (Gym) ---
  'lat-pulldown': {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    mode: ['Gym'],
    muscleGroup: ['Lats', 'Biceps'],
    movementPattern: 'Pull',
    level: 'Beginner',
    defaultPrescription: '3 sets x 10-12 reps',
    formSteps: [
      'Sit with knees secured.',
      'Grip wide.',
      'Pull bar to upper chest, driving elbows down.',
      'Return slowly.'
    ],
    commonMistakes: ['Leaning back too far.', 'Using momentum.'],
    safetyNotes: ['Control the negative.'],
    videoLinks: [{ title: 'Lat Pulldown Guide', url: getSearchLink('lat pulldown form') }]
  },
  'cable-row': {
    id: 'cable-row',
    name: 'Seated Cable Row',
    mode: ['Gym'],
    muscleGroup: ['Back', 'Rhomboids'],
    movementPattern: 'Pull',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 12 reps',
    formSteps: [
      'Sit with feet braced, slight knee bend.',
      'Keep back straight, pull handle to stomach.',
      'Squeeze shoulder blades.'
    ],
    commonMistakes: ['Rounding lower back.', 'Leaning back and forth.'],
    safetyNotes: ['Do not round spine at full extension.'],
    videoLinks: [{ title: 'Cable Row', url: getSearchLink('seated cable row form') }]
  },

  // --- LEGS (Squat) ---
  'goblet-squat': {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Quads', 'Glutes', 'Core'],
    movementPattern: 'Squat',
    level: 'Beginner',
    defaultPrescription: '4 sets x 10-12 reps',
    formSteps: [
      'Hold weight at chest height.',
      'Squat down by sitting back and opening knees.',
      'Keep chest up.',
      'Drive up through heels.'
    ],
    commonMistakes: ['Knees caving in.', 'Heels lifting off floor.'],
    safetyNotes: ['Keep back straight.'],
    videoLinks: [{ title: 'Goblet Squat', url: getSearchLink('goblet squat form') }]
  },
  'barbell-squat': {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    mode: ['Gym'],
    muscleGroup: ['Quads', 'Glutes', 'Lower Back'],
    movementPattern: 'Squat',
    level: 'Advanced',
    defaultPrescription: '3 sets x 6-8 reps',
    formSteps: [
      'Bar rests on upper back traps.',
      'Feet shoulder width, toes slightly out.',
      'Brace core, squat deep.',
      'Drive up.'
    ],
    commonMistakes: ['Knees caving.', 'Butt wink (rounding).'],
    safetyNotes: ['Use safety bars.'],
    videoLinks: [{ title: 'Squat Guide', url: getSearchLink('barbell squat form') }],
    visualSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="20" r="8" /><line x1="20" y1="35" x2="80" y2="35" stroke-width="4" /><path d="M50 28 L50 60 M50 60 L30 90 M50 60 L70 90" /></svg>`
  },
  'split-squat': {
    id: 'split-squat',
    name: 'Split Squat',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Quads', 'Glutes'],
    movementPattern: 'Lunge',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 10/leg',
    formSteps: [
      'Stagger stance.',
      'Lower back knee toward floor.',
      'Keep front heel flat.',
      'Push back up.'
    ],
    commonMistakes: ['Walking on tightrope (feet too narrow).', 'Front heel lifting.'],
    safetyNotes: ['Balance is key.'],
    videoLinks: [{ title: 'Split Squat', url: getSearchLink('split squat form') }]
  },

  // --- HINGE / BONE ---
  'rdl': {
    id: 'rdl',
    name: 'Romanian Deadlift (RDL)',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Hamstrings', 'Glutes'],
    movementPattern: 'Hinge',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 10 reps',
    formSteps: [
      'Hold weight, slight knee bend.',
      'Push hips back while keeping back flat.',
      'Lower weight until hamstring stretch.',
      'Squeeze glutes to stand.'
    ],
    commonMistakes: ['Rounding back.', 'Squatting instead of hinging.'],
    safetyNotes: ['Spine neutrality is non-negotiable.'],
    videoLinks: [{ title: 'RDL Tutorial', url: getSearchLink('rdl form') }]
  },
  'farmer-carry': {
    id: 'farmer-carry',
    name: 'Farmer Carry',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Forearms', 'Traps', 'Core'],
    movementPattern: 'Gait',
    level: 'Beginner',
    defaultPrescription: '3 sets x 45 sec',
    formSteps: [
      'Hold heavy weights in each hand.',
      'Stand tall, shoulders back.',
      'Walk controlled steps.'
    ],
    commonMistakes: ['Slouching.', 'Rushing.'],
    safetyNotes: ['Watch your toes when dropping weights.'],
    videoLinks: [{ title: 'Farmer Carry', url: getSearchLink('farmer carry form') }]
  },

  // --- CORE & MOBILITY ---
  'plank': {
    id: 'plank',
    name: 'Plank',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Core'],
    movementPattern: 'Core',
    level: 'Beginner',
    defaultPrescription: '3 sets x 45-60s',
    formSteps: ['Forearms on ground.', 'Body straight.', 'Squeeze glutes and abs.'],
    commonMistakes: ['Hips sagging.', 'Butt too high.'],
    safetyNotes: ['Stop if lower back hurts.'],
    videoLinks: [{ title: 'Plank Form', url: getSearchLink('perfect plank form') }]
  },
  'dead-bug': {
    id: 'dead-bug',
    name: 'Dead Bug',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Core'],
    movementPattern: 'Core',
    level: 'Beginner',
    defaultPrescription: '3 sets x 12 reps',
    formSteps: ['Lie on back, arms and legs up.', 'Lower opposite arm and leg.', 'Keep lower back pressed to floor.'],
    commonMistakes: ['Arching back off floor.'],
    safetyNotes: ['Crucial for spine health.'],
    videoLinks: [{ title: 'Dead Bug', url: getSearchLink('dead bug exercise') }]
  },
  'cat-cow': {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    mode: ['Home', 'Gym'],
    muscleGroup: ['Spine'],
    movementPattern: 'Mobility',
    level: 'Beginner',
    defaultPrescription: '1 min',
    formSteps: ['Hands and knees.', 'Arch back up (Cat).', 'Sink belly down (Cow).'],
    commonMistakes: ['Moving too fast.'],
    safetyNotes: ['Gentle motion.'],
    videoLinks: [{ title: 'Cat Cow', url: getSearchLink('cat cow stretch') }]
  },
  'face-pulls': {
    id: 'face-pulls',
    name: 'Face Pulls',
    mode: ['Gym', 'Home'], // Bands for home
    muscleGroup: ['Rear Delts', 'Rotator Cuff'],
    movementPattern: 'Pull',
    level: 'Intermediate',
    defaultPrescription: '3 sets x 15 reps',
    formSteps: ['Pull rope to forehead.', 'External rotation at end.', 'Squeeze rear shoulders.'],
    commonMistakes: ['Going too heavy.', 'Pulling to chest.'],
    safetyNotes: ['Posture fixer.'],
    videoLinks: [{ title: 'Face Pull', url: getSearchLink('face pull exercise') }]
  },
  'tibialis-raise': {
      id: 'tibialis-raise',
      name: 'Tibialis Raise',
      mode: ['Home', 'Gym'],
      muscleGroup: ['Shins'],
      movementPattern: 'Isolation',
      level: 'Beginner',
      defaultPrescription: '3 sets x 20 reps',
      formSteps: ['Lean butt against wall.', 'Walk feet out.', 'Raise toes towards shins.'],
      commonMistakes: ['Bending knees too much.'],
      safetyNotes: ['Prevents shin splints and knee pain.'],
      videoLinks: [{ title: 'Tibialis Raise', url: getSearchLink('tibialis raise at home') }]
  },
  
  // --- KEGEL & LOOKMAXING ---
  'kegel-basic': {
      id: 'kegel-basic',
      name: 'Kegel Hold (Level 1)',
      mode: ['Home'],
      muscleGroup: ['Pelvic Floor'],
      movementPattern: 'Isolation',
      level: 'Beginner',
      defaultPrescription: '3 sets x 10 reps (3s hold)',
      formSteps: ['Identify pelvic floor muscles (stop urine flow).', 'Contract muscles upward.', 'Hold for 3 seconds.', 'Fully relax for 3 seconds.'],
      commonMistakes: ['Holding breath.', 'Squeezing glutes or thighs instead of pelvic floor.'],
      safetyNotes: ['Do not do this while actually urinating.'],
      videoLinks: [{ title: 'Kegel Guide', url: getSearchLink('kegel exercises for men') }],
      visualSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-pink-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 70 Q 50 30 70 70" /><path d="M30 70 Q 50 80 70 70" opacity="0.5"/><path d="M45 50 L55 50" /><path d="M50 45 L50 55" /></svg>`
  },
  'kegel-pulsing': {
      id: 'kegel-pulsing',
      name: 'Kegel Rapid Fire (Level 2)',
      mode: ['Home'],
      muscleGroup: ['Pelvic Floor'],
      movementPattern: 'Isolation',
      level: 'Intermediate',
      defaultPrescription: '3 sets x 20 reps (1s speed)',
      formSteps: ['Contract pelvic floor hard and fast.', 'Release immediately.', 'Repeat rhythmically: Squeeze, Relax, Squeeze, Relax.', 'Focus on speed.'],
      commonMistakes: ['Not relaxing fully between reps.', 'Using abs.'],
      safetyNotes: ['Trains fast-twitch fibers for endurance.'],
      videoLinks: [{ title: 'Kegel Pulsing', url: getSearchLink('rapid kegels for men') }],
      visualSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-pink-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 70 L30 50 L40 70 L50 50 L60 70 L70 50 L80 70" /></svg>`
  },
  'reverse-kegel': {
      id: 'reverse-kegel',
      name: 'Reverse Kegel (Level 3)',
      mode: ['Home'],
      muscleGroup: ['Pelvic Floor'],
      movementPattern: 'Mobility',
      level: 'Advanced',
      defaultPrescription: '3 sets x 30s hold',
      formSteps: ['Inhale deeply into your belly.', 'Gently push/bulge the pelvic floor OUT (like passing gas).', 'Do not strain, just expand.', 'Exhale and relax.'],
      commonMistakes: ['Pushing too hard (bearing down).', 'Holding breath.'],
      safetyNotes: ['Crucial for hypertonic (tight) pelvic floor. If you have pain, do this.'],
      videoLinks: [{ title: 'Reverse Kegel', url: getSearchLink('how to do reverse kegel') }],
      visualSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="30" /><path d="M50 50 L50 70" stroke-dasharray="4 4" /><path d="M40 60 L50 70 L60 60" /></svg>`
  },
  'kegel-bridge': {
      id: 'kegel-bridge',
      name: 'Glute Bridge Kegel',
      mode: ['Home'],
      muscleGroup: ['Pelvic Floor', 'Glutes'],
      movementPattern: 'Core',
      level: 'Intermediate',
      defaultPrescription: '3 sets x 12 reps',
      formSteps: ['Lie on back, knees bent.', 'Squeeze glutes and pelvic floor.', 'Lift hips.', 'Relax pelvic floor as you lower hips.'],
      commonMistakes: ['Arching lower back.'],
      safetyNotes: ['Integrates core and floor.'],
      videoLinks: [{ title: 'Bridge Kegel', url: getSearchLink('glute bridge kegel') }]
  },
  'chin-tuck': {
      id: 'chin-tuck',
      name: 'Chin Tucks',
      mode: ['Home'],
      muscleGroup: ['Neck'],
      movementPattern: 'Mobility',
      level: 'Beginner',
      defaultPrescription: '20 reps',
      formSteps: ['Stand straight.', 'Pull head straight back (double chin).', 'Hold 2s.'],
      commonMistakes: ['Looking down.', 'Tiring muscles.'],
      safetyNotes: ['Fixes nerd neck.'],
      videoLinks: [{ title: 'Chin Tucks', url: getSearchLink('chin tucks for posture') }]
  }
};
