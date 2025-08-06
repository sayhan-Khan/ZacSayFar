import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { foodAPI } from '../utils/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      loadTodaysMeals();
    }
  }, [user]);

  const loadTodaysMeals = async () => {
    try {
      setIsLoading(true);
      const mealsData = await foodAPI.getUserMeals(user.email);
      setMeals(mealsData);
    } catch (error) {
      console.log('Could not load meals:', error);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
  };

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + (meal.calories * meal.quantity), 0);
  };

  const dailyCalorieGoal = 2000;
  const calorieProgress = Math.min((getTotalCalories() / dailyCalorieGoal) * 100, 100);
  
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
              <Link to="/dashboard" className="text-emerald-400 font-medium">Dashboard</Link>
              <Link to="/add-meal" className="text-gray-300 hover:text-white">Add Meal</Link>
              <Link to="/history" className="text-gray-300 hover:text-white">History</Link>
              <Link to="/nutrition" className="text-gray-300 hover:text-white">Nutrition</Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.email || 'User'}</span>
            <button className="text-gray-300 hover:text-white">Profile</button>
            <button className="text-gray-300 hover:text-white">Settings</button>
            <Link 
              to="/login" 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h2>
          <p className="text-gray-600">Here's your nutrition overview for today.</p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Calories</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-2xl font-bold">
                <span>{getTotalCalories()}</span>
                <span className="text-gray-400">/ {dailyCalorieGoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                  style={{width: `${calorieProgress}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{Math.round(calorieProgress)}% of daily goal</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Meals Logged</h3>
            <div className="text-3xl font-bold text-emerald-600 mb-2">{meals.length}</div>
            <p className="text-sm text-gray-600">
              {meals.length === 0 ? 'No meals yet today' : 
               meals.length === 1 ? 'Keep it up!' : 
               'Great progress!'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Per Meal</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {meals.length > 0 ? Math.round(getTotalCalories() / meals.length) : 0}
            </div>
            <p className="text-sm text-gray-600">calories per meal</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/add-meal" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group-hover:bg-emerald-50">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Add Meal</h3>
              </div>
              <p className="text-gray-600 mb-4">Log what you've eaten from our database of 214+ foods</p>
              <div className="flex items-center text-emerald-600 font-medium">
                <span>Start logging</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/history" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group-hover:bg-blue-50">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">View History</h3>
              </div>
              <p className="text-gray-600 mb-4">See your meal history and eating patterns over time</p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>View meals</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/nutrition" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group-hover:bg-purple-50">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Nutrition Stats</h3>
              </div>
              <p className="text-gray-600 mb-4">Track your weekly nutrition goals and progress</p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>View stats</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Meals Preview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Today's Meals</h3>
            <Link to="/add-meal" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Add meal →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading meals...</p>
            </div>
          ) : meals.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">No meals logged yet today</p>
              <Link 
                to="/add-meal"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Add Your First Meal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.slice(0, 3).map((meal, index) => (
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
                      {meal.calories * meal.quantity} cal
                    </p>
                  </div>
                </div>
              ))}
              {meals.length > 3 && (
                <div className="text-center pt-4">
                  <Link 
                    to="/history" 
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    View all {meals.length} meals →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
