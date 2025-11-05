import { useState } from 'react';
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

const MenuList = ({ restaurant, onAddToCart }) => {
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    if (quantity > 0) {
      onAddToCart(item, quantity);
      setQuantities((prev) => ({ ...prev, [item._id]: 0 }));
    }
  };

  if (!restaurant) {
    return (
      <div className="text-center text-gray-500 py-8">
        Select a restaurant to view menu items
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {restaurant.name} - Menu
      </h2>

      {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
        <div className="space-y-4">
          {restaurant.menuItems.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <p className="text-lg font-bold text-orange-500 mt-2">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 transition"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {quantities[item._id] || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 transition"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={(quantities[item._id] || 0) === 0}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No menu items available</p>
      )}
    </div>
  );
};

export default MenuList;

