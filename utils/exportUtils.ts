import { DayPlan, UserProfile, ActivityTask } from '../types';

// Simple icons as SVG strings for the exported HTML
const ICONS = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    dumbbell: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`
};

const getPatternIcon = (pattern: string) => {
    // Returns a visual cue based on movement pattern
    const map: Record<string, string> = {
        'Push': '💪', 'Pull': '🧗', 'Squat': '🦵', 'Lunge': '🏃', 
        'Hinge': '🏗️', 'Core': '🧱', 'Mobility': '🧘', 'Cardio': '🫀'
    };
    return map[pattern] || '⚡';
};

export const generateInteractiveHTML = (plan: DayPlan, user: UserProfile): string => {
    const safeData = JSON.stringify(plan).replace(/</g, '\\u003c');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Today's Plan - ${plan.date}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; -webkit-font-smoothing: antialiased; }
        .task-checkbox:checked + div { background-color: #10b981; border-color: #10b981; }
        .task-checkbox:checked ~ div .task-title { text-decoration: line-through; color: #94a3b8; }
        @media print {
            .no-print { display: none !important; }
            body { background-color: white; }
            .card { border: 1px solid #e2e8f0; box-shadow: none; break-inside: avoid; }
        }
    </style>
</head>
<body class="pb-20">
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-lg sm:my-8 sm:rounded-xl overflow-hidden relative">
        <!-- Header -->
        <div class="bg-slate-900 text-white p-6">
            <div class="flex justify-between items-start">
                <div>
                    <div class="text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">Daily Protocol</div>
                    <h1 class="text-2xl font-bold">${plan.dayName}</h1>
                    <p class="text-slate-400 text-sm mt-1">${plan.date}</p>
                </div>
                <div class="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                    ${plan.mode.toUpperCase()} MODE
                </div>
            </div>
            
            <!-- Progress -->
            <div class="mt-6">
                <div class="flex justify-between text-xs font-medium mb-2 text-slate-300">
                    <span>Progress</span>
                    <span id="progress-text">0%</span>
                </div>
                <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div id="progress-bar" class="h-full bg-emerald-500 w-0 transition-all duration-500"></div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-6" id="plan-container">
            <!-- Rendered by JS -->
        </div>

        <!-- Diet Targets -->
        <div class="mx-4 mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 card">
            <h3 class="font-bold text-slate-800 mb-3 flex items-center">
                🍎 Nutrition Targets
            </h3>
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white p-2 rounded-lg border border-emerald-100">
                    <div class="text-lg font-bold text-slate-900">${plan.dietTargets.calories}</div>
                    <div class="text-[10px] text-slate-500 uppercase">Kcal</div>
                </div>
                <div class="bg-white p-2 rounded-lg border border-emerald-100">
                    <div class="text-lg font-bold text-slate-900">${plan.dietTargets.protein}g</div>
                    <div class="text-[10px] text-slate-500 uppercase">Protein</div>
                </div>
                <div class="bg-white p-2 rounded-lg border border-emerald-100">
                    <div class="text-lg font-bold text-slate-900">${plan.dietTargets.water}L</div>
                    <div class="text-[10px] text-slate-500 uppercase">Water</div>
                </div>
            </div>
        </div>

        <!-- Notes -->
        <div class="mx-4 mb-20">
            <label class="block text-sm font-bold text-slate-700 mb-2">Daily Notes</label>
            <textarea id="daily-notes" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm" rows="4" placeholder="Log weights, feelings, or meal details..."></textarea>
        </div>

        <!-- Sticky Bottom Actions -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-3 no-print max-w-md mx-auto">
             <button onclick="copySummary()" class="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition">
                📋 Copy Summary
             </button>
             <button onclick="window.print()" class="px-4 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition">
                🖨️
             </button>
        </div>
    </div>

    <script>
        const PLAN = ${safeData};
        const STORAGE_KEY = 'gaurav_fit_export_' + PLAN.date;
        
        // State management
        let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify({
            completedIds: [],
            notes: ''
        }));

        // Render Functions
        function renderTask(task) {
            const isCompleted = state.completedIds.includes(task.id);
            const ex = task.exerciseDetails;
            const icon = ex ? '${getPatternIcon("' + (ex?.movementPattern || '') + '")}' : (task.type === 'yoga' ? '🧘' : task.type === 'meditation' ? '🧠' : '⚡');
            
            let html = \`
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all card hover:shadow-sm">
                <label class="flex items-center p-3 cursor-pointer select-none">
                    <input type="checkbox" class="task-checkbox hidden" onchange="toggleTask('\${task.id}')" \${isCompleted ? 'checked' : ''}>
                    <div class="w-6 h-6 rounded border border-slate-300 mr-3 flex items-center justify-center transition-colors text-white">
                        ${ICONS.check}
                    </div>
                    <div class="flex-1">
                        <div class="font-semibold text-slate-900 task-title text-sm">\${task.title}</div>
                        <div class="text-xs text-slate-500 flex items-center mt-1">
                            <span class="bg-slate-100 px-1.5 py-0.5 rounded mr-2 flex items-center">${ICONS.clock} \${task.duration}</span>
                            \${ex ? \`<span class="text-indigo-600">\${ex.muscleGroup[0]}</span>\` : ''}
                        </div>
                    </div>
                    <div class="text-2xl">\${icon}</div>
                </label>
            \`;

            // Expandable details (always visible in print, toggleable on mobile? Let's make them visible if exercise)
            if (ex || task.steps.length > 0) {
                html += \`<div class="border-t border-slate-50 p-3 bg-slate-50/50 text-sm space-y-3">
                    <div class="flex items-start text-slate-600 text-xs bg-white p-2 rounded border border-slate-100">
                        <span class="mr-2 mt-0.5">${ICONS.info}</span>
                        \${task.whyItMatters}
                    </div>\`;

                if (ex) {
                    html += \`
                    <div class="grid grid-cols-1 gap-2 no-print">
                        \${ex.videoLinks.map(v => \`
                            <a href="\${v.url}" target="_blank" class="flex items-center justify-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition">
                                ${ICONS.play} <span class="ml-2">Watch Demo</span>
                            </a>
                        \`).join('')}
                    </div>
                    <div>
                        <div class="font-bold text-xs text-slate-400 uppercase mb-1">Form Cues</div>
                        <ul class="list-disc list-inside text-slate-700 text-xs space-y-1">
                            \${ex.formSteps.map(s => \`<li>\${s}</li>\`).join('')}
                        </ul>
                    </div>
                    \`;
                } else if (task.steps.length) {
                     html += \`
                    <div>
                        <div class="font-bold text-xs text-slate-400 uppercase mb-1">Steps</div>
                        <ul class="list-disc list-inside text-slate-700 text-xs space-y-1">
                            \${task.steps.map(s => \`<li>\${s}</li>\`).join('')}
                        </ul>
                    </div>
                    \`;
                }
                html += \`</div>\`;
            }

            html += \`</div>\`;
            return html;
        }

        function renderSection(title, tasks) {
            if (!tasks.length) return '';
            return \`
                <div class="mb-6 card border-none shadow-none">
                    <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">\${title}</h2>
                    <div class="space-y-3">
                        \${tasks.map(t => renderTask(t)).join('')}
                    </div>
                </div>
            \`;
        }

        function render() {
            const container = document.getElementById('plan-container');
            container.innerHTML = 
                renderSection('🌅 Morning Routine', PLAN.morning) +
                renderSection('🏋️ Workout Session', PLAN.afternoon) +
                renderSection('🌙 Evening & Recovery', PLAN.evening);
            
            // Update Progress
            const allIds = [...PLAN.morning, ...PLAN.afternoon, ...PLAN.evening].map(t => t.id);
            const done = state.completedIds.length;
            const total = allIds.length;
            const pct = Math.round((done / total) * 100);
            
            document.getElementById('progress-bar').style.width = pct + '%';
            document.getElementById('progress-text').innerText = pct + '%';

            // Update Notes
            document.getElementById('daily-notes').value = state.notes;
        }

        // Actions
        window.toggleTask = function(id) {
            if (state.completedIds.includes(id)) {
                state.completedIds = state.completedIds.filter(i => i !== id);
            } else {
                state.completedIds.push(id);
            }
            save();
            render();
        }

        function save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }

        window.copySummary = function() {
            const summary = {
                date: PLAN.date,
                completed: state.completedIds.length,
                total: [...PLAN.morning, ...PLAN.afternoon, ...PLAN.evening].length,
                notes: state.notes,
                mode: PLAN.mode
            };
            navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
            alert('Summary copied to clipboard!');
        }

        // Init
        document.getElementById('daily-notes').addEventListener('input', (e) => {
            state.notes = e.target.value;
            save();
        });

        render();
    </script>
</body>
</html>
    `;
};

export const generateWhatsAppText = (plan: DayPlan, user: UserProfile): string => {
    let text = `*GAURAV FIT COACH — TODAY PLAN* ✅\n`;
    text += `Date: ${plan.date}\n`;
    text += `Mode: ${plan.mode.toUpperCase()}\n\n`;

    // Morning
    text += `🌅 *Morning*\n`;
    plan.morning.forEach(t => {
        text += `• ${t.title} (${t.duration})\n`;
    });
    text += `\n`;

    // Afternoon
    text += `🏋️ *Afternoon (Workout)*\n`;
    let exerciseCount = 0;
    plan.afternoon.forEach(t => {
        if (t.type === 'workout' && t.exerciseDetails) {
            exerciseCount++;
            // Compact mode logic: if very long list, maybe simplify, but standard 4-6 exercises is fine for WA.
            text += `• ${t.title}: ${t.exerciseDetails.defaultPrescription.split('x')[0] || '3'} sets\n`;
            if (t.exerciseDetails.videoLinks.length > 0) {
                 text += `  Demo: ${t.exerciseDetails.videoLinks[0].url}\n`;
            }
        } else {
             text += `• ${t.title} (${t.duration})\n`;
        }
    });
    text += `\n`;

    // Evening
    text += `🌙 *Evening*\n`;
    plan.evening.forEach(t => {
        text += `• ${t.title} (${t.duration})\n`;
    });
    text += `\n`;

    // Diet
    text += `🍽 *Diet Targets*\n`;
    text += `Cal: ${plan.dietTargets.calories} | Pro: ${plan.dietTargets.protein}g | H2O: ${plan.dietTargets.water}L | Steps: ${plan.dietTargets.steps}\n\n`;

    text += `*Notes*: Stay consistent!\n`;
    
    if (user.publicPlanUrl) {
        text += `\n🔗 Interactive Plan: ${user.publicPlanUrl}`;
    }

    return text;
};
