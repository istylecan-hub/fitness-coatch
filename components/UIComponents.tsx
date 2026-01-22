import React, { useState } from 'react';
import { Check, Info, Play, AlertCircle, Repeat, ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react';
import { Exercise } from '../types';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {title && (
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = "", disabled = false }) => {
  const base = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const ProgressBar: React.FC<{ value: number; max: number; color?: string }> = ({ value, max, color = "bg-indigo-600" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-slate-100 text-slate-600" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
    {children}
  </span>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const TaskItem: React.FC<{ 
  task: any; 
  onToggle: (id: string) => void;
  onSwap?: (id: string) => void;
}> = ({ task, onToggle, onSwap }) => {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const ex: Exercise | undefined = task.exerciseDetails;

  const handleVideoClick = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      window.open(url, '_blank');
  };

  return (
    <div className={`border rounded-xl transition-all ${task.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center p-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
          className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center mr-3 transition-colors ${
            task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {task.completed && <Check size={14} strokeWidth={3} />}
        </button>
        <div className="flex-1">
          <div className={`font-semibold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
            {task.title}
          </div>
          <div className="text-xs text-slate-500 flex items-center mt-1 space-x-2">
            <span className="font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{task.duration}</span>
            {ex && <span className="bg-slate-100 px-1.5 py-0.5 rounded">{ex.muscleGroup[0]}</span>}
          </div>
        </div>
        {ex && ex.videoLinks.length > 0 && (
             <button 
                onClick={(e) => handleVideoClick(e, ex.videoLinks[0].url)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full mr-1"
             >
                 <Play size={18} fill="currentColor" />
             </button>
        )}
        <div className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50">
          <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start">
             <Info size={16} className="text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
             <p>{task.whyItMatters}</p>
          </div>

          {ex && (
              <div className="mt-4 space-y-4">
                  {/* Visuals / Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => window.open(ex.videoLinks[0].url, '_blank')} className="text-xs h-8">
                          <Play size={14} className="mr-1.5" /> Watch Demo
                      </Button>
                      {onSwap && (
                        <Button variant="outline" onClick={() => onSwap(task.id)} className="text-xs h-8">
                           <Repeat size={14} className="mr-1.5" /> Swap Exercise
                        </Button>
                      )}
                  </div>

                  {/* Instructions */}
                  <div>
                      <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Form Guide</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                          {ex.formSteps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                  </div>

                  {/* Mistakes */}
                  {ex.commonMistakes.length > 0 && (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                           <h4 className="font-bold text-xs uppercase text-orange-600 mb-1 flex items-center">
                               <AlertCircle size={12} className="mr-1"/> Common Mistakes
                           </h4>
                           <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                                {ex.commonMistakes.map((s, i) => <li key={i}>{s}</li>)}
                           </ul>
                      </div>
                  )}
              </div>
          )}
          
          {!ex && task.steps.length > 0 && (
               <div className="mt-4">
                 <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Steps</h4>
                 <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                   {task.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                 </ol>
               </div>
          )}
        </div>
      )}
    </div>
  );
}
