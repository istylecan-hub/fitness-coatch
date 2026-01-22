import React, { useState } from 'react';
import { Card, Badge, Button } from './UIComponents';
import { Utensils, Zap, Pill, ShoppingCart, DollarSign } from 'lucide-react';
import { DIET_GUIDELINES, MEAL_TEMPLATES } from '../constants';

interface DietPlanProps {
    dietType: 'Veg' | 'Egg' | 'Non-veg';
    dietBudget: 'Normal' | 'Low Cost';
}

const DietPlan: React.FC<DietPlanProps> = ({ dietType, dietBudget }) => {
  const [activeDay, setActiveDay] = useState(0); // 0-6
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // @ts-ignore
  const template = MEAL_TEMPLATES[dietType] || MEAL_TEMPLATES['Veg'];

  // Logic to simulate variety for 7 days based on the template
  // In a real app, this would be a full database. Here we vary slightly or repeat.
  const getDailyMeal = (dayIdx: number) => {
      // Just returning the same template for now but logic exists to expand
      return template; 
  };

  const currentMeals = getDailyMeal(activeDay);

  const generateGroceryList = () => {
      const allIngredients = new Set<string>();
      Object.values(template).forEach((meal: any) => {
          meal.ingredients.forEach((ing: string) => allIngredients.add(ing));
      });
      // Add basics
      allIngredients.add("Salt/Pepper/Spices");
      allIngredients.add("Cooking Oil/Ghee");
      return Array.from(allIngredients);
  };

  const groceryList = generateGroceryList();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
       <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <Utensils size={24} />
                </div>
                <div>
                <h2 className="text-xl font-bold text-slate-900">Meal Planner</h2>
                <p className="text-sm text-slate-500">{dietType} • {dietBudget}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{DIET_GUIDELINES.calories}</div>
                <div className="text-xs text-slate-500">kcal target</div>
            </div>
      </div>

      {/* Day Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
          {days.map((d, idx) => (
              <button
                key={d}
                onClick={() => setActiveDay(idx)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                    activeDay === idx ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'
                }`}
              >
                  {d}
              </button>
          ))}
      </div>

      {/* Meals */}
      <Card title={`Plan for ${days[activeDay]}`}>
         <div className="space-y-5">
            {Object.entries(currentMeals).map(([key, meal]: [string, any]) => (
                <div key={key} className="flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{key}</span>
                        <div className="flex gap-1">
                             <Badge color="bg-orange-50 text-orange-600">{meal.protein}g Pro</Badge>
                             <Badge>{meal.calories} kcal</Badge>
                        </div>
                    </div>
                    <div className="font-medium text-slate-800">{meal.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                        {meal.ingredients.join(", ")}
                    </div>
                </div>
            ))}
         </div>
         {dietBudget === 'Low Cost' && (
             <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700 flex items-start">
                 <DollarSign size={14} className="mr-1 mt-0.5"/>
                 <span>Budget Mode Active: Use seasonal vegetables and bulk-buy grains to save costs.</span>
             </div>
         )}
      </Card>

      {/* Grocery List */}
      <Card title="Grocery List (Week)">
          <div className="grid grid-cols-2 gap-2">
              {groceryList.map((item, idx) => (
                  <div key={idx} className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></div>
                      {item}
                  </div>
              ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
              <Button variant="secondary" className="w-full text-sm">
                  <ShoppingCart size={16} className="mr-2"/> Copy List
              </Button>
          </div>
      </Card>

      {/* Supplement Stack */}
      <Card title="Supplement Stack">
        <div className="flex flex-col space-y-3">
            <div className="flex items-start">
                <Zap size={18} className="text-yellow-500 mr-2 mt-0.5" />
                <div className="text-sm">
                    <span className="font-bold text-slate-700">Vitamin D3 + K2:</span> Critical for Calcium absorption.
                </div>
            </div>
             <div className="flex items-start">
                <Pill size={18} className="text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm">
                    <span className="font-bold text-slate-700">Magnesium Glycinate:</span> Sleep & Muscle recovery.
                </div>
            </div>
        </div>
      </Card>

    </div>
  );
};

export default DietPlan;
