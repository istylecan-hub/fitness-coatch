import React, { useState, useEffect } from 'react';
import { Calendar, User, MessageSquare, BarChart2, List, Settings as SettingsIcon, BookOpen, Dumbbell } from 'lucide-react';
import { UserProfile, DayPlan, HistoryEntry, DailyLog } from './types';
import { INITIAL_USER_PROFILE, generateDemoHistory } from './constants';
import { generateDailyPlan } from './utils/planGenerator';
import { getDailyTip } from './services/geminiService';
import { EXERCISE_DATABASE } from './data/exerciseDatabase';

import Dashboard from './components/Dashboard';
import WeeklyPlan from './components/WeeklyPlan';
import DietPlan from './components/DietPlan';
import CoachChat from './components/CoachChat';
import ProgressTracker from './components/ProgressTracker';
import Settings from './components/Settings';
import ExerciseLibrary from './components/ExerciseLibrary';

const STORAGE_KEY_DATA = 'gaurav_fit_data';
const STORAGE_KEY_USER = 'gaurav_fit_user';
const STORAGE_KEY_LOG_PREFIX = 'gaurav_fit_log_'; // + YYYY-MM-DD

enum Tab {
  TODAY = 'Today',
  WEEKLY = 'Weekly',
  LIBRARY = 'Library',
  DIET = 'Diet',
  CHAT = 'Coach',
  PROGRESS = 'Progress',
  SETTINGS = 'Settings'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TODAY);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentPlan, setCurrentPlan] = useState<DayPlan | null>(null);
  const [dailyTip, setDailyTip] = useState<string>("Loading daily tip...");
  const [dailyLog, setDailyLog] = useState<DailyLog>({ proteinConsumed: 0, waterConsumed: 0, stepsTaken: 0 });

  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    // Load History
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);
    if (savedData) {
      setHistory(JSON.parse(savedData));
    } else {
      const demoData = generateDemoHistory();
      setHistory(demoData);
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(demoData));
    }

    getDailyTip().then(setDailyTip);
  }, []);

  // Sync Daily Log & Plan Regeneration
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const logKey = STORAGE_KEY_LOG_PREFIX + todayStr;
    
    // Try load today's log
    const savedLog = localStorage.getItem(logKey);
    let currentLog = savedLog ? JSON.parse(savedLog) : { proteinConsumed: 0, waterConsumed: 0, stepsTaken: 0 };
    setDailyLog(currentLog);

    // Generate Plan (Pass log for Recovery logic)
    regeneratePlan(user, currentLog);

  }, [user]); // Regenerate when user settings change

  const regeneratePlan = (u: UserProfile, log: DailyLog) => {
    const today = new Date();
    const plan = generateDailyPlan(today, u, log);
    
    // Restore checklist state
    const todayKey = `plan_progress_${today.toISOString().split('T')[0]}`;
    const savedProgress = localStorage.getItem(todayKey);
    if (savedProgress) {
        const progressIds = JSON.parse(savedProgress);
        const updateTasks = (tasks: any[]) => tasks.map(t => progressIds.includes(t.id) ? {...t, completed: true} : t);
        plan.morning = updateTasks(plan.morning);
        plan.afternoon = updateTasks(plan.afternoon);
        plan.evening = updateTasks(plan.evening);
    }
    setCurrentPlan(plan);
  };

  const handleUpdateLog = (newLog: DailyLog) => {
      setDailyLog(newLog);
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(STORAGE_KEY_LOG_PREFIX + todayStr, JSON.stringify(newLog));
      
      // If soreness/energy changed, plan might need update (Recovery Mode)
      regeneratePlan(user, newLog);
  };

  const handleToggleTask = (taskId: string) => {
    if (!currentPlan) return;
    const newPlan = { ...currentPlan };
    const toggleInList = (list: any[]) => list.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    newPlan.morning = toggleInList(newPlan.morning);
    newPlan.afternoon = toggleInList(newPlan.afternoon);
    newPlan.evening = toggleInList(newPlan.evening);
    setCurrentPlan(newPlan);

    // Save state
    const todayKey = `plan_progress_${new Date().toISOString().split('T')[0]}`;
    const completedIds = [...newPlan.morning, ...newPlan.afternoon, ...newPlan.evening].filter(t => t.completed).map(t => t.id);
    localStorage.setItem(todayKey, JSON.stringify(completedIds));

    // Update History
    const todayDate = new Date().toISOString().split('T')[0];
    const totalTasks = [...newPlan.morning, ...newPlan.afternoon, ...newPlan.evening].length;
    
    setHistory(prev => {
        const existingIndex = prev.findIndex(h => h.date === todayDate);
        const newEntry: HistoryEntry = {
            date: todayDate,
            tasksCompleted: completedIds.length,
            totalTasks: totalTasks,
            weight: user.weight,
            mood: 3,
            sleepHours: 7,
            modeUsed: user.workoutMode,
            dailyLog: dailyLog
        };
        let newHistory = existingIndex >= 0 ? [...prev] : [newEntry, ...prev];
        if (existingIndex >= 0) newHistory[existingIndex] = newEntry;
        
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(newHistory));
        return newHistory;
    });
  };

  const handleSwapTask = (taskId: string) => {
      if (!currentPlan) return;
      
      // Find the task
      let section: 'morning' | 'afternoon' | 'evening' | null = null;
      let task = currentPlan.afternoon.find(t => t.id === taskId);
      if (task) section = 'afternoon';
      
      if (!task || !task.exerciseDetails || !section) {
          alert("Cannot swap this item.");
          return;
      }
      
      const currentEx = task.exerciseDetails;
      const candidates = Object.values(EXERCISE_DATABASE).filter(ex => 
          ex.id !== currentEx.id &&
          ex.movementPattern === currentEx.movementPattern &&
          ex.mode.includes(user.workoutMode)
      );

      if (candidates.length === 0) {
          alert("No suitable alternatives found for this mode.");
          return;
      }

      const newEx = candidates[Math.floor(Math.random() * candidates.length)];
      
      const newPlan = { ...currentPlan };
      const newTask = {
          ...task,
          id: newEx.id, // Update ID to track properly
          title: newEx.name,
          description: `${newEx.defaultPrescription} • ${newEx.muscleGroup.join(', ')}`,
          steps: newEx.formSteps,
          whyItMatters: `Alternative: ${newEx.movementPattern} pattern.`,
          exerciseDetails: newEx,
          completed: false
      };
      
      // @ts-ignore
      newPlan[section] = newPlan[section].map(t => t.id === taskId ? newTask : t);
      setCurrentPlan(newPlan);
  };

  const handleClearHistory = () => {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_DATA);
      window.location.reload();
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
  };

  const handleExportData = () => {
      const dataStr = JSON.stringify({ user, history }, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gaurav_fit_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
  };

  const handleImportData = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const data = JSON.parse(e.target?.result as string);
              if (data.user && data.history) {
                  setUser(data.user);
                  setHistory(data.history);
                  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
                  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data.history));
                  alert("Restored successfully!");
                  window.location.reload();
              } else {
                  alert("Invalid file format.");
              }
          } catch (err) {
              alert("Error parsing file.");
          }
      };
      reader.readAsText(file);
  };

  const NavBtn = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">GAURAV FIT COACH <span className="text-indigo-600 text-xs align-top ml-0.5">PRO</span></h1>
                <p className="text-xs text-slate-500">Day {history.length} • {user.trainingLevel}</p>
            </div>
             <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button 
                    onClick={() => handleUpdateUser({...user, workoutMode: 'Home', equipment: 'Dumbbells'})}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${user.workoutMode === 'Home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >HOME</button>
                <button 
                    onClick={() => handleUpdateUser({...user, workoutMode: 'Gym', equipment: 'Gym'})}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${user.workoutMode === 'Gym' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >GYM</button>
            </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {activeTab === Tab.TODAY && currentPlan && (
            <Dashboard 
                plan={currentPlan} user={user} dailyLog={dailyLog}
                onToggleTask={handleToggleTask} onUpdateLog={handleUpdateLog} dailyTip={dailyTip}
                onSwapTask={handleSwapTask} 
            />
        )}
        {activeTab === Tab.WEEKLY && <WeeklyPlan />}
        {activeTab === Tab.LIBRARY && <ExerciseLibrary />}
        {activeTab === Tab.DIET && <DietPlan dietType={user.dietType} dietBudget={user.dietBudget} />}
        {activeTab === Tab.CHAT && <CoachChat />}
        {activeTab === Tab.PROGRESS && <ProgressTracker history={history} onClearHistory={handleClearHistory} />}
        {activeTab === Tab.SETTINGS && <Settings user={user} onUpdateUser={handleUpdateUser} onExportData={handleExportData} onImportData={handleImportData} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
            <NavBtn tab={Tab.TODAY} icon={List} label="Today" />
            <NavBtn tab={Tab.LIBRARY} icon={Dumbbell} label="Library" />
            <NavBtn tab={Tab.CHAT} icon={MessageSquare} label="Coach" />
            <NavBtn tab={Tab.DIET} icon={BookOpen} label="Meal Plan" />
            <NavBtn tab={Tab.PROGRESS} icon={BarChart2} label="Stats" />
            <NavBtn tab={Tab.SETTINGS} icon={SettingsIcon} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

export default App;
