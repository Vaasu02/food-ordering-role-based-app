import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetRestaurantsQuery, useCreateRestaurantMutation } from '../store/api/restaurantApi';
import { selectUserRole, selectUserCountry } from '../store/slices/authSlice';
import RestaurantCard from '../components/RestaurantCard';
import MenuList from '../components/MenuList';
import { useCreateOrderMutation } from '../store/api/orderApi';
import { FaPlus, FaShoppingCart } from 'react-icons/fa';

const Restaurants = () => {
  const userRole = useSelector(selectUserRole);
  const userCountry = useSelector(selectUserCountry);
  const { data: restaurantsData, isLoading, error, refetch } = useGetRestaurantsQuery();
  const [createRestaurant, { isLoading: isCreating }] = useCreateRestaurantMutation();
  const [createOrder] = useCreateOrderMutation();

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    country: userCountry || '',
    menuItems: [],
  });
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '' });

  // Update country when user country changes
  useEffect(() => {
    if (userCountry) {
      setNewRestaurant((prev) => ({ ...prev, country: userCountry }));
    }
  }, [userCountry]);

  // Refetch restaurants when component mounts to ensure fresh data for current user
  useEffect(() => {
    if (userCountry) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const restaurants = restaurantsData?.data || [];

  const handleAddToCart = (item, quantity) => {
    setCart((prev) => [...prev, { ...item, quantity }]);
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await toast.promise(
        createOrder({ items: orderItems }).unwrap(),
        {
          loading: 'Creating order...',
          success: 'Order created successfully!',
          error: (err) => err?.data?.message || 'Failed to create order',
        }
      );
      setCart([]);
    } catch (err) {
      // Error is handled by toast.promise
    }
  };

  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price) {
      setNewRestaurant((prev) => ({
        ...prev,
        menuItems: [...prev.menuItems, { ...newMenuItem, price: parseFloat(newMenuItem.price) }],
      }));
      setNewMenuItem({ name: '', description: '', price: '' });
    }
  };

  const handleCreateRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.country) {
      toast.error('Please fill in restaurant name and country');
      return;
    }

    if (newRestaurant.menuItems.length === 0) {
      toast.error('Please add at least one menu item');
      return;
    }

    try {
      await toast.promise(
        createRestaurant(newRestaurant).unwrap(),
        {
          loading: 'Creating restaurant...',
          success: 'Restaurant created successfully!',
          error: (err) => err?.data?.message || 'Failed to create restaurant',
        }
      );
      setNewRestaurant({ name: '', country: userCountry || '', menuItems: [] });
      setShowCreateForm(false);
    } catch (err) {
      // Error is handled by toast.promise
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading restaurants</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Restaurants</h1>
          {(userRole === 'Admin' || userRole === 'Manager') && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              <FaPlus />
              <span>Create Restaurant</span>
            </button>
          )}
        </div>

        {showCreateForm && (userRole === 'Admin' || userRole === 'Manager') && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Restaurant</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Restaurant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={newRestaurant.country}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                  disabled
                  title="Country is set based on your account"
                >
                  <option value={userCountry || ''}>{userCountry || 'Select country'}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Country is automatically set to your account country</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Menu Items</h3>
                <div className="space-y-2 mb-4">
                  {newRestaurant.menuItems.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded flex justify-between">
                      <span>{item.name} - ₹{item.price}</span>
                      <button
                        onClick={() =>
                          setNewRestaurant({
                            ...newRestaurant,
                            menuItems: newRestaurant.menuItems.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newMenuItem.description}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, description: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Price"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleAddMenuItem}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCreateRestaurant}
                disabled={isCreating}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
              >
                {isCreating ? 'Creating...' : 'Create Restaurant'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onSelectRestaurant={setSelectedRestaurant}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <MenuList restaurant={selectedRestaurant} onAddToCart={handleAddToCart} />

            {cart.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Cart</h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-orange-500">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCreateOrder}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>Create Order</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;

