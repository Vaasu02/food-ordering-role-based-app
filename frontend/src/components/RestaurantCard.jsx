import { FaUtensils, FaMapMarkerAlt } from 'react-icons/fa';

const RestaurantCard = ({ restaurant, onSelectRestaurant }) => {
  return (
    <div
      onClick={() => onSelectRestaurant(restaurant)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUtensils className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <FaMapMarkerAlt />
                <span>{restaurant.country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {restaurant.menuItems?.length || 0} menu items available
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

