import React, { useRef } from 'react';
import { UserProfile } from '../types';
import { Card, Button } from './UIComponents';
import { Settings as SettingsIcon, Dumbbell, Clock, AlertCircle, Save, Upload, Download, Globe } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onImportData: (file: File) => void;
  onExportData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onImportData, onExportData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof UserProfile, value: any) => {
    let updatedUser = { ...user, [field]: value };
    if (field === 'equipment') {
        updatedUser.workoutMode = value === 'Gym' ? 'Gym' : 'Home';
    }
    onUpdateUser(updatedUser);
  };

  const toggleInjury = (injury: string) => {
      const current = user.injuryFlags || [];
      const updated = current.includes(injury) ? current.filter(i => i !== injury) : [...current, injury];
      onUpdateUser({ ...user, injuryFlags: updated });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          onImportData(e.target.files[0]);
      }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
       <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500">Customize your experience.</p>
        </div>
      </div>

      <Card title="Training & Equipment">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Dumbbell size={16} className="mr-2" /> Equipment
                </label>
                <select 
                    value={user.equipment}
                    onChange={(e) => handleChange('equipment', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                    <option value="Bodyweight">Bodyweight Only (Home)</option>
                    <option value="Dumbbells">Dumbbells (Home)</option>
                    <option value="Gym">Full Gym Access</option>
                </select>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Training Level</label>
                <div className="flex space-x-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                            key={level}
                            onClick={() => handleChange('trainingLevel', level)}
                            className={`flex-1 py-2 text-sm rounded-lg border ${
                                user.trainingLevel === level 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium' 
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </Card>

      <Card title="Diet Preferences">
        <div className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                 <div className="flex space-x-2">
                    {['Veg', 'Egg', 'Non-veg'].map(type => (
                        <button
                            key={type}
                            onClick={() => handleChange('dietType', type)}
                            className={`flex-1 py-2 text-sm rounded-lg border ${
                                user.dietType === type 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' 
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
             </div>
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Budget Mode</label>
                 <select 
                    value={user.dietBudget}
                    onChange={(e) => handleChange('dietBudget', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                    <option value="Normal">Normal Budget</option>
                    <option value="Low Cost">Low Cost (Student Friendly)</option>
                </select>
             </div>
        </div>
      </Card>
      
      <Card title="Progression">
           <label className="block text-sm font-medium text-slate-700 mb-2">Kegel Level</label>
           <div className="flex space-x-2">
                {[1, 2, 3].map(level => (
                    <button
                        key={level}
                        // @ts-ignore
                        onClick={() => handleChange('kegelLevel', level)}
                        className={`flex-1 py-2 text-sm rounded-lg border ${
                            user.kegelLevel === level 
                            ? 'bg-pink-50 border-pink-500 text-pink-700 font-medium' 
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                    >
                        Level {level}
                    </button>
                ))}
            </div>
      </Card>

      <Card title="Safety & Injuries">
        <div className="flex flex-wrap gap-2">
            {['Knee', 'Back', 'Shoulder'].map(injury => (
                <button
                    key={injury}
                    onClick={() => toggleInjury(injury)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        user.injuryFlags?.includes(injury)
                        ? 'bg-red-50 border-red-500 text-red-600 font-medium'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                >
                    {injury} Pain
                </button>
            ))}
        </div>
      </Card>

      <Card title="Sharing & Cloud">
          <div className="space-y-3">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Globe size={16} className="mr-2" /> Public Plan URL (Optional)
                </label>
                <input 
                    type="text" 
                    placeholder="https://my-hosted-plan.com/gaurav"
                    value={user.publicPlanUrl || ''}
                    onChange={(e) => handleChange('publicPlanUrl', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">If you host your HTML exports, paste the link here to include it in WhatsApp shares.</p>
             </div>
          </div>
      </Card>

      <Card title="Backup & Restore">
          <div className="grid grid-cols-2 gap-3">
              <Button onClick={onExportData} variant="secondary" className="w-full text-xs">
                  <Download size={16} className="mr-2"/> Backup (JSON)
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full text-xs">
                  <Upload size={16} className="mr-2"/> Restore
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={handleFileChange}
              />
          </div>
          <div className="text-xs text-slate-400 mt-2 text-center">
              Backups include history, logs, and settings.
          </div>
      </Card>
      
      <div className="text-center text-xs text-slate-400 mt-8">
        App Version 1.4.0 • Pro
      </div>

    </div>
  );
};

export default Settings;
