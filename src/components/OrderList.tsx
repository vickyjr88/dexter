import React from 'react';

interface Order {
  order_id: string;
  name: string;
  status: string;
  date_added: string;
  total: string;
  products: Array<{ product_id: string; name: string; quantity: string; price: string; total: string; }>;
}

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  fetchOrders: (page: number) => void;
  onBack: () => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, isLoading, currentPage, totalPages, fetchOrders, onBack }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <button onClick={onBack} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-4">Back to Main</button>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <div>
          <ul className="list-disc pl-5">
            {orders.map((order) => (
              <li key={order.order_id} className="text-gray-800 mb-2">
                <strong>Order ID:</strong> {order.order_id}<br />
                <strong>Customer:</strong> {order.name}<br />
                <strong>Status:</strong> {order.status}<br />
                <strong>Date:</strong> {order.date_added}<br />
                <strong>Total:</strong> {order.total}<br />
                {order.products.length > 0 && (
                  <div className="ml-4 mt-1">
                    <strong>Products:</strong>
                    <ul className="list-disc pl-5">
                      {order.products.map((product) => (
                        <li key={product.product_id}>{product.name} (x{product.quantity}) - {product.total}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => fetchOrders(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
