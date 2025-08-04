import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI } from '../utils/api';

function HistoryPage() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    if (user?.email) {
      loadMealHistory();
    }
  }, [user, selectedPeriod]);

  const loadMealHistory = async () => {
    try {
      setIsLoading(true);
      const mealsData = await foodAPI.getUserMeals(user.email);
      setMeals(mealsData);
    } catch (error) {
      console.log('Could not load meal history:', error);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + (meal.calories * meal.quantity), 0);
  };

  const groupMealsByDate = () => {
    // For now, we'll just show today's meals
    // In a real app, you'd group by actual dates
    return {
      'Today': meals
    };
  };

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
              <Link to="/history" className="text-emerald-400 font-medium">History</Link>
              <Link to="/nutrition" className="text-gray-300 hover:text-white">Nutrition</Link>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Meal History</h2>
          <p className="text-gray-600">View your past meals and eating patterns</p>
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

        {/* Meal History */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading meal history...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupMealsByDate()).map(([date, dateMeals]) => (
              <div key={date} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{date}</h3>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold text-emerald-600">
                      {dateMeals.reduce((total, meal) => total + (meal.calories * meal.quantity), 0)} calories
                    </span>
                  </div>
                </div>

                {dateMeals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No meals logged for this period</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dateMeals.map((meal, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{meal.name}</h4>
                          <p className="text-sm text-gray-600">
                            {meal.calories} calories per serving
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">Qty: {meal.quantity}</p>
                          <p className="text-sm text-emerald-600">
                            {meal.calories * meal.quantity} cal total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {meals.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">No meal history available yet</p>
                <Link 
                  to="/add-meal"
                  className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add Your First Meal
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
