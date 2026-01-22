import React from 'react';
import { HistoryEntry } from '../types';
import { Card, Button } from './UIComponents';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Award, Download } from 'lucide-react';

interface ProgressTrackerProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ history, onClearHistory }) => {
  // Use nullish coalescing to safely handle potential undefined weights
  const currentWeight = (history.length > 0 ? history[0].weight : undefined) ?? 60;
  const startWeight = (history.length > 0 ? history[history.length - 1].weight : undefined) ?? 60;
  
  const diffValue = currentWeight - startWeight;
  const weightDiff = diffValue.toFixed(1);

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "gaurav_fit_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const reversedHistory = [...history].reverse(); // Chart needs chronological

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
       <div className="flex items-center justify-between mb-2">
         <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <TrendingUp size={24} />
            </div>
            <div>
            <h2 className="text-xl font-bold text-slate-900">Progress</h2>
            <p className="text-sm text-slate-500">Consistent action creates results.</p>
            </div>
         </div>
         <Button onClick={exportData} variant="secondary" className="p-2"><Download size={18}/></Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center py-4">
            <div className="text-3xl font-bold text-slate-800">{history.length}</div>
            <div className="text-xs text-slate-500 font-medium uppercase mt-1">Day Streak</div>
        </Card>
        <Card className="text-center py-4 relative overflow-hidden">
            <div className="text-3xl font-bold text-indigo-600">
                {diffValue > 0 ? '+' : ''}{weightDiff} <span className="text-sm text-slate-500 font-normal">kg</span>
            </div>
            <div className="text-xs text-slate-500 font-medium uppercase mt-1">Weight Change</div>
        </Card>
      </div>

      <Card title="Weight Trend">
        <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reversedHistory}>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Habit Compliance (Tasks)">
         <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reversedHistory}>
                    <XAxis dataKey="date" hide />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                    <Bar dataKey="tasksCompleted" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <div className="pt-4 border-t border-slate-200">
        <Button onClick={() => { if(confirm('Are you sure?')) onClearHistory() }} variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
            Reset Data
        </Button>
      </div>

    </div>
  );
};

export default ProgressTracker;