import { useState, useEffect } from 'react';
import { foodAPI } from '../utils/api';

function AddMeal({ userEmail, onMealAdded }) {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingFoods, setLoadingFoods] = useState(true);

  // Sample foods data in case backend isn't ready
  const sampleFoods = [
    { id: 1, name: 'Apple', calories: 95 },
    { id: 2, name: 'Banana', calories: 105 },
    { id: 3, name: 'Orange', calories: 60 },
    { id: 4, name: 'Chicken Breast', calories: 165 },
    { id: 5, name: 'Rice', calories: 205 },
    { id: 6, name: 'Broccoli', calories: 25 },
    { id: 7, name: 'Pasta', calories: 220 },
    { id: 8, name: 'Salmon', calories: 208 },
    { id: 9, name: 'Greek Yogurt', calories: 100 },
    { id: 10, name: 'Almonds', calories: 164 },
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoadingFoods(true);
      const foodData = await foodAPI.getAllFoods();
      setFoods(foodData);
    } catch (error) {
      console.log('Using sample foods data since backend foods endpoint is not available');
      setFoods(sampleFoods);
    } finally {
      setLoadingFoods(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log("Add Meal button clicked");
    e.preventDefault();
    if (!selectedFood || !userEmail) return;
    console.log("Calling addMeal with:", userEmail, selectedFood, quantity);
    setIsLoading(true);
    setError('');

    try {
      await foodAPI.addMeal(userEmail, selectedFood, parseInt(quantity));
      setSelectedFood('');
      setQuantity(1);
      setSearchTerm('');
      if (onMealAdded) onMealAdded();
      window.location.reload();
    } catch (error) {
      setError(error.message || 'Failed to add meal');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingFoods) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Add a Meal</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search for food
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Type to search foods..."
          />
        </div>

        <div>
          <label htmlFor="food" className="block text-sm font-medium text-gray-700 mb-2">
            Select Food
          </label>
          <select
            id="food"
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Choose a food...</option>
            {filteredFoods.map((food) => (
              <option key={food.id || food.name} value={food.name}>
                {food.name} ({food.calories} cal)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !selectedFood}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Meal'}
        </button>
      </form>
    </div>
  );
}

export default AddMeal;
