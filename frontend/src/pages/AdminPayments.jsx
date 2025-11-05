import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetPaymentMethodsQuery, useCreatePaymentMethodMutation } from '../store/api/paymentApi';
import { FaCreditCard, FaPlus, FaTrash } from 'react-icons/fa';

const AdminPayments = () => {
  const { data: paymentsData, isLoading, error } = useGetPaymentMethodsQuery();
  const [createPaymentMethod, { isLoading: isCreating }] = useCreatePaymentMethodMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    type: 'Credit Card',
    token: '',
  });

  const paymentMethods = paymentsData?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        createPaymentMethod(formData).unwrap(),
        {
          loading: 'Adding payment method...',
          success: 'Payment method added successfully!',
          error: (err) => err?.data?.message || 'Failed to create payment method',
        }
      );
      setFormData({ label: '', type: 'Credit Card', token: '' });
      setShowForm(false);
    } catch (err) {
      // Error is handled by toast.promise
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading payment methods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading payment methods</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FaCreditCard className="text-3xl text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Payment Methods</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
          >
            <FaPlus />
            <span>Add Payment Method</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Payment Method</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Visa Card, PayPal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token (Dummy)</label>
                <input
                  type="text"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter dummy token"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Payment Method'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ label: '', type: 'Credit Card', token: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No payment methods found</p>
            <p className="text-gray-500 mt-2">Add your first payment method above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((payment) => (
              <div key={payment._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FaCreditCard className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{payment.label}</h3>
                      <p className="text-sm text-gray-500">{payment.type}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">Token:</p>
                  <p className="text-sm font-mono text-gray-700 bg-gray-100 p-2 rounded">
                    {payment.token}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Created: {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;

