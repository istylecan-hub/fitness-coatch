import React, { useState } from 'react';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { Card, Button, Badge } from './UIComponents';
import { Search, Filter, Dumbbell, Play } from 'lucide-react';

const ExerciseLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Home' | 'Gym'>('All');
  const [filterMuscle, setFilterMuscle] = useState<string>('All');
  
  const exercises = Object.values(EXERCISE_DATABASE);
  const muscles = Array.from(new Set(exercises.flatMap(e => e.muscleGroup)));

  const filtered = exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesMode = filterMode === 'All' || ex.mode.includes(filterMode);
      const matchesMuscle = filterMuscle === 'All' || ex.muscleGroup.includes(filterMuscle);
      return matchesSearch && matchesMode && matchesMuscle;
  });

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-20">
       <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Dumbbell size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900">Exercise Library</h2>
                <p className="text-sm text-slate-500">{filtered.length} movements available</p>
            </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
          <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Search exercises..." 
                 className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               {(['All', 'Home', 'Gym'] as const).map(m => (
                   <button 
                        key={m}
                        onClick={() => setFilterMode(m)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                            filterMode === m ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                        }`}
                   >
                       {m}
                   </button>
               ))}
               <div className="w-px h-6 bg-slate-300 mx-1"></div>
               <select 
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 focus:outline-none"
                  value={filterMuscle}
                  onChange={(e) => setFilterMuscle(e.target.value)}
               >
                   <option value="All">All Muscles</option>
                   {muscles.map(m => <option key={m} value={m}>{m}</option>)}
               </select>
          </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
          {filtered.map(ex => (
              <Card key={ex.id} className="p-0 overflow-hidden">
                  <div className="p-4 flex items-start gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 overflow-hidden">
                          {ex.visualSvg ? (
                              <div className="w-full h-full p-2" dangerouslySetInnerHTML={{ __html: ex.visualSvg }} />
                          ) : (
                              <Dumbbell size={24} />
                          )}
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                              <h3 className="font-bold text-slate-900">{ex.name}</h3>
                              <Badge>{ex.level}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{ex.muscleGroup.join(', ')} • {ex.mode.join('/')}</p>
                          <div className="mt-3 flex gap-2">
                               {ex.videoLinks.length > 0 && (
                                   <Button variant="outline" className="h-7 text-xs px-3" onClick={() => window.open(ex.videoLinks[0].url, '_blank')}>
                                       <Play size={12} className="mr-1.5 text-red-500" /> Video
                                   </Button>
                               )}
                          </div>
                      </div>
                  </div>
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
                      <p className="text-xs text-slate-600 line-clamp-2">
                          <span className="font-bold">Form:</span> {ex.formSteps[0]} {ex.formSteps[1]}...
                      </p>
                  </div>
              </Card>
          ))}
          {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No exercises found.</div>
          )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
