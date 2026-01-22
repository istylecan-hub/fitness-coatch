import React from 'react';
import { WEEKLY_SPLIT } from '../constants';
import { Card, Badge } from './UIComponents';
import { Calendar, Dumbbell, Activity, Heart, Battery } from 'lucide-react';

const WeeklyPlan: React.FC = () => {
  const days = Object.entries(WEEKLY_SPLIT);

  const getIcon = (desc: string) => {
    if (desc.includes('Strength')) return <Dumbbell size={16} className="text-indigo-600" />;
    if (desc.includes('Recovery')) return <Battery size={16} className="text-emerald-600" />;
    if (desc.includes('Cardio')) return <Heart size={16} className="text-rose-600" />;
    return <Activity size={16} className="text-slate-600" />;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Weekly Structure</h2>
          <p className="text-sm text-slate-500">Bone Strength & Lean Mass Cycle</p>
        </div>
      </div>

      <div className="space-y-3">
        {days.map(([day, focus]) => (
          <Card key={day} className="flex items-center p-4 hover:shadow-md transition-shadow">
            <div className="w-24 flex-shrink-0">
                <span className="font-bold text-slate-800">{day}</span>
            </div>
            <div className="flex-1 flex items-center">
                <div className="mr-3 bg-slate-50 p-2 rounded-full">
                    {getIcon(focus)}
                </div>
                <span className="text-sm text-slate-600 font-medium">{focus}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Bone Strength Protocol" className="bg-indigo-50 border-indigo-100">
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 p-2">
            <li><span className="font-bold">Axial Loading:</span> Exercises like Overhead Press and Squats compress the spine safely to stimulate density.</li>
            <li><span className="font-bold">Impact:</span> Jump rope and plyometrics (Fridays) create necessary impact forces.</li>
            <li><span className="font-bold">Progressive Overload:</span> Add weight or reps every week. Never stay comfortable.</li>
        </ul>
      </Card>
    </div>
  );
};

export default WeeklyPlan;
