import { FaCheck, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../store/slices/authSlice';

const OrderCard = ({ order, onCheckout, onCancel }) => {
  const userRole = useSelector(selectUserRole);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCheckout = (userRole === 'Admin' || userRole === 'Manager') && order.status === 'Pending';
  const canCancel = (userRole === 'Admin' || userRole === 'Manager') && order.status !== 'Completed' && order.status !== 'Cancelled';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-6)}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Total Amount:</p>
          <p className="text-xl font-bold text-orange-500">₹{order.totalAmount.toFixed(2)}</p>
        </div>

        <div className="flex space-x-2">
          {canCheckout && (
            <button
              onClick={() => onCheckout(order._id)}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              <FaCheck />
              <span>Checkout</span>
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(order._id)}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

