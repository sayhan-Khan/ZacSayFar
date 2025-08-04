import { useState, useEffect } from 'react';
import { foodAPI } from '../utils/api';

function UserMeals({ userEmail, refreshTrigger }) {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userEmail) {
      loadUserMeals();
    }
  }, [userEmail, refreshTrigger]);

  const loadUserMeals = async () => {
    try {
      setIsLoading(true);
      setError('');
      const mealsData = await foodAPI.getUserMeals(userEmail);
      setMeals(mealsData);
    } catch (error) {
      console.log('Could not load user meals from backend:', error);
      setError('Could not load meals. This feature will be available once the backend is fully set up.');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + (meal.calories * meal.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Your Meals Today</h3>
        {meals.length > 0 && (
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-emerald-600">{getTotalCalories()} calories</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {meals.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <p className="text-gray-500">No meals logged yet today.</p>
          <p className="text-gray-400 text-sm mt-1">Add your first meal to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
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

      <button
        onClick={loadUserMeals}
        className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Refresh Meals
      </button>
    </div>
  );
}

export default UserMeals;
