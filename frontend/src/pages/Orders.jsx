import { useGetOrdersQuery, useCheckoutOrderMutation, useCancelOrderMutation } from '../store/api/orderApi';
import OrderCard from '../components/OrderCard';
import { confirmAction } from '../components/ConfirmationToast';
import { FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Orders = () => {
  const { data: ordersData, isLoading, error } = useGetOrdersQuery();
  const [checkoutOrder] = useCheckoutOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const orders = ordersData?.data || [];

  const handleCheckout = async (orderId) => {
    confirmAction(
      'Are you sure you want to checkout this order?',
      async () => {
        try {
          await toast.promise(
            checkoutOrder(orderId).unwrap(),
            {
              loading: 'Processing checkout...',
              success: 'Order checked out successfully!',
              error: (err) => err?.data?.message || 'Failed to checkout order',
            }
          );
        } catch (err) {
          // Error is handled by toast.promise
        }
      }
    );
  };

  const handleCancel = async (orderId) => {
    confirmAction(
      'Are you sure you want to cancel this order?',
      async () => {
        try {
          await toast.promise(
            cancelOrder(orderId).unwrap(),
            {
              loading: 'Cancelling order...',
              success: 'Order cancelled successfully!',
              error: (err) => err?.data?.message || 'Failed to cancel order',
            }
          );
        } catch (err) {
          // Error is handled by toast.promise
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading orders</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-6">
          <FaShoppingCart className="text-3xl text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No orders found</p>
            <p className="text-gray-500 mt-2">Start ordering from the restaurants page!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onCheckout={handleCheckout}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

