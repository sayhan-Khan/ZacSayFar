import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI } from '../utils/api';

function NutritionPage() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    if (user?.email) {
      loadNutritionData();
    }
  }, [user, selectedPeriod]);

  const loadNutritionData = async () => {
    try {
      setIsLoading(true);
      const mealsData = await foodAPI.getUserMeals(user.email);
      setMeals(mealsData);
    } catch (error) {
      console.log('Could not load nutrition data:', error);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getNutritionStats = () => {
    const totalCalories = meals.reduce((total, meal) => total + (meal.calories * meal.quantity), 0);
    const avgCaloriesPerMeal = meals.length > 0 ? Math.round(totalCalories / meals.length) : 0;
    const totalMeals = meals.length;

    // Daily goals (these could be customizable in a real app)
    const dailyCalorieGoal = 2000;
    const calorieProgress = Math.min((totalCalories / dailyCalorieGoal) * 100, 100);

    return {
      totalCalories,
      avgCaloriesPerMeal,
      totalMeals,
      dailyCalorieGoal,
      calorieProgress,
      remainingCalories: Math.max(dailyCalorieGoal - totalCalories, 0)
    };
  };

  const stats = getNutritionStats();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-zinc-900 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-2xl font-bold text-white hover:text-emerald-400">
              College Eats
            </Link>
            <div className="flex gap-4">
              <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
              <Link to="/add-meal" className="text-gray-300 hover:text-white">Add Meal</Link>
              <Link to="/history" className="text-gray-300 hover:text-white">History</Link>
              <Link to="/nutrition" className="text-emerald-400 font-medium">Nutrition</Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.email || 'User'}</span>
            <Link to="/login" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Overview</h2>
          <p className="text-gray-600">Track your daily nutrition goals and progress</p>
        </div>

        {/* Period Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">View:</span>
            <div className="flex gap-2">
              {['today', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    selectedPeriod === period
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading nutrition data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calorie Progress */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Calorie Goal</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Progress</span>
                  <span className="font-bold text-emerald-600">
                    {stats.totalCalories} / {stats.dailyCalorieGoal} cal
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-emerald-600 h-4 rounded-full transition-all duration-300"
                    style={{width: `${stats.calorieProgress}%`}}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{Math.round(stats.calorieProgress)}% complete</span>
                  <span>{stats.remainingCalories} cal remaining</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Meals</span>
                  <span className="font-semibold">{stats.totalMeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average per Meal</span>
                  <span className="font-semibold">{stats.avgCaloriesPerMeal} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Calories</span>
                  <span className="font-semibold text-emerald-600">{stats.totalCalories} cal</span>
                </div>
              </div>
            </div>

            {/* Weekly Goals (Placeholder) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Goals</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600">Consistent Logging</span>
                    <p className="text-sm text-gray-500">Log meals 5+ days this week</p>
                  </div>
                  <div className="text-yellow-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600">Balanced Eating</span>
                    <p className="text-sm text-gray-500">Stay within calorie range</p>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Most Logged Foods</h3>
              {meals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No meals logged yet</p>
              ) : (
                <div className="space-y-3">
                  {meals.slice(0, 5).map((meal, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{meal.name}</span>
                      <span className="text-sm text-gray-500">{meal.quantity}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && meals.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center mt-6">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">Start logging meals to see your nutrition stats</p>
            <Link 
              to="/add-meal"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Log Your First Meal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default NutritionPage;
