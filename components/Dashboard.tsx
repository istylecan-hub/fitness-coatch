import React, { useState } from 'react';
import { DayPlan, ActivityTask, UserProfile, DailyLog } from '../types';
import { Card, TaskItem, ProgressBar, Button, Badge } from './UIComponents';
import { Flame, Droplets, Footprints, Info, AlertTriangle, Award, Share, FileText, Download, Smartphone, Copy } from 'lucide-react';
import { generateInteractiveHTML, generateWhatsAppText } from '../utils/exportUtils';

interface DashboardProps {
  plan: DayPlan;
  user: UserProfile;
  dailyLog: DailyLog;
  onToggleTask: (taskId: string) => void;
  onSwapTask: (taskId: string) => void;
  onUpdateLog: (log: DailyLog) => void;
  dailyTip: string;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, user, dailyLog, onToggleTask, onSwapTask, onUpdateLog, dailyTip }) => {
  const allTasks = [...plan.morning, ...plan.afternoon, ...plan.evening];
  const completedCount = allTasks.filter(t => t.completed).length;
  const progress = (completedCount / allTasks.length) * 100;
  const [showCheckin, setShowCheckin] = useState(!dailyLog.soreness); // Show if not set

  const renderSection = (title: string, tasks: ActivityTask[]) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">{title}</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={onToggleTask} onSwap={onSwapTask} />
        ))}
      </div>
    </div>
  );

  const updateMacro = (field: keyof DailyLog, delta: number) => {
      // @ts-ignore
      onUpdateLog({ ...dailyLog, [field]: Math.max(0, (dailyLog[field] || 0) + delta) });
  };

  const handleCheckin = (soreness: number, energy: number) => {
      onUpdateLog({ ...dailyLog, soreness, energy });
      setShowCheckin(false);
  };

  const downloadHTML = () => {
      const htmlContent = generateInteractiveHTML(plan, user);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan-${plan.date}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const printPDF = () => {
      const htmlContent = generateInteractiveHTML(plan, user);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          // Wait for load then print
          setTimeout(() => {
              printWindow.focus();
              printWindow.print();
          }, 500);
      }
  };

  const shareWhatsApp = () => {
      const text = generateWhatsAppText(plan, user);
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
  };

  const copyText = () => {
      const text = generateWhatsAppText(plan, user);
      navigator.clipboard.writeText(text).then(() => {
          alert("Plan copied to clipboard!");
      }).catch(err => {
          console.error("Failed to copy", err);
      });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none relative overflow-hidden">
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
             <Badge color="bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                {plan.mode.toUpperCase()} MODE
             </Badge>
          </div>
          <div className="text-xs font-medium opacity-80 mb-1">Recovery Score</div>
          <div className="text-lg font-bold leading-tight flex items-center">
             {plan.recoveryScore} 
             {plan.recoveryScore === 'Low' && <AlertTriangle size={16} className="ml-2 text-yellow-300"/>}
          </div>
          <div className="text-sm opacity-90 mt-1">{completedCount}/{allTasks.length} tasks</div>
        </Card>
        <Card className="bg-slate-800 text-white border-none">
           <div className="text-xs font-medium text-emerald-400 mb-1">Daily AI Tip</div>
           <p className="text-sm italic opacity-90 leading-snug">"{dailyTip}"</p>
        </Card>
      </div>

      {/* Recovery Check-in Modal/Card */}
      {showCheckin && (
          <Card className="bg-orange-50 border-orange-200">
              <h3 className="font-bold text-slate-800 mb-2">Daily Recovery Check-in</h3>
              <p className="text-xs text-slate-600 mb-4">Be honest. We adjust your plan based on this.</p>
              
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Muscle Soreness (0-10)</label>
                      <input type="range" min="0" max="10" className="w-full" onChange={(e) => {}} onMouseUp={(e) => handleCheckin(parseInt(e.currentTarget.value), dailyLog.energy || 7)} />
                      <div className="flex justify-between text-xs text-slate-400"><span>No Pain</span><span>Extreme</span></div>
                  </div>
                  <div className="text-center">
                     <Button onClick={() => handleCheckin(0, 8)} variant="secondary" className="text-xs">I feel great (Quick Skip)</Button>
                  </div>
              </div>
          </Card>
      )}

      {/* Info Banner for Mode */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100 p-2 rounded-lg border border-slate-200">
        <div className="flex items-center">
            <Info size={14} className="mr-2 text-indigo-500 flex-shrink-0" />
            <span>Plan adapted for <strong>{plan.mode}</strong>.</span>
        </div>
        <div className="flex items-center text-emerald-600 font-semibold">
            <Award size={14} className="mr-1" /> Streak: 3
        </div>
      </div>

      {/* Routine Blocks */}
      <div>
        {renderSection('Morning Routine', plan.morning)}
        {renderSection('Afternoon / Workout', plan.afternoon)}
        {renderSection('Evening & Recovery', plan.evening)}
      </div>

      {/* Export Actions */}
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Share & Export</h3>
        <div className="grid grid-cols-2 gap-3">
            <Button onClick={shareWhatsApp} className="text-xs h-10 bg-green-500 hover:bg-green-600 text-white shadow-sm border-0">
                <Smartphone size={16} className="mr-2" /> Share WhatsApp
            </Button>
            <Button onClick={copyText} variant="secondary" className="text-xs h-10 border-slate-200">
                <Copy size={16} className="mr-2" /> Copy Text
            </Button>
            <Button onClick={downloadHTML} variant="outline" className="text-xs h-10 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100">
                <Share size={16} className="mr-2" /> Export HTML
            </Button>
            <Button onClick={printPDF} variant="outline" className="text-xs h-10 border-slate-200 text-slate-700 hover:bg-slate-50">
                <FileText size={16} className="mr-2" /> Print PDF
            </Button>
        </div>
      </div>

      {/* Macro Tracker Addon */}
      <Card title="Macro Tracker">
          <div className="space-y-4">
              {/* Protein */}
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 flex items-center"><Flame size={14} className="mr-1 text-orange-500"/> Protein</span>
                      <span className="text-slate-500">{dailyLog.proteinConsumed}/{plan.dietTargets.protein}g</span>
                  </div>
                  <ProgressBar value={dailyLog.proteinConsumed} max={plan.dietTargets.protein} color="bg-orange-500" />
                  <div className="flex justify-end mt-1 space-x-2">
                      <button onClick={() => updateMacro('proteinConsumed', 10)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">+10g</button>
                      <button onClick={() => updateMacro('proteinConsumed', 25)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">+25g</button>
                  </div>
              </div>

              {/* Water */}
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 flex items-center"><Droplets size={14} className="mr-1 text-blue-500"/> Water</span>
                      <span className="text-slate-500">{dailyLog.waterConsumed.toFixed(1)}/{plan.dietTargets.water}L</span>
                  </div>
                  <ProgressBar value={dailyLog.waterConsumed} max={plan.dietTargets.water} color="bg-blue-500" />
                  <div className="flex justify-end mt-1 space-x-2">
                      <button onClick={() => updateMacro('waterConsumed', 0.25)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">+250ml</button>
                      <button onClick={() => updateMacro('waterConsumed', 0.5)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">+500ml</button>
                  </div>
              </div>
               
              {/* Steps */}
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 flex items-center"><Footprints size={14} className="mr-1 text-pink-500"/> Steps</span>
                      <span className="text-slate-500">{dailyLog.stepsTaken}/{plan.dietTargets.steps}</span>
                  </div>
                  <ProgressBar value={dailyLog.stepsTaken} max={plan.dietTargets.steps} color="bg-pink-500" />
                  <div className="flex justify-end mt-1 space-x-2">
                      <button onClick={() => updateMacro('stepsTaken', 500)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">+500</button>
                      <button onClick={() => updateMacro('stepsTaken', 1000)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">+1k</button>
                  </div>
              </div>
          </div>
      </Card>
    </div>
  );
};

export default Dashboard;
