import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import OrderForm from './components/OrderForm';
import ProductList from './components/ProductList';
import StoreInfo from './components/StoreInfo';
import OrderList from './components/OrderList';

const API_BASE_URL = '/api';

// Interfaces
interface Product {
  product_id: number;
  name: string;
  price: string;
}

interface Store {
  store_id: number;
  name: string;
}

interface Customer {
  customer_id: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
}

interface PaymentAddress {
  firstname: string;
  lastname: string;
  address_1: string;
  city: string;
  zone: string;
  country: string;
  postcode: string;
}

interface ErrandDetails {
  pickup_location: string;
  dropoff_location: string;
  comment: string;
}

interface Order {
  order_id: string;
  name: string;
  status: string;
  date_added: string;
  total: string;
  products: Array<{ product_id: string; name: string; quantity: string; price: string; total: string; }>;
}

function App() {
  // Existing State
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // New State for Order Placement
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState<PaymentAddress>({ firstname: '', lastname: '', address_1: '', city: '', zone: '', country: '', postcode: '' });
  const [errandDetails, setErrandDetails] = useState<ErrandDetails>({ pickup_location: '', dropoff_location: '', comment: '' });

  // New State for Orders Screen
  const [showOrdersScreen, setShowOrdersScreen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // Effects
  useEffect(() => {
    const storedToken = localStorage.getItem('customer_token');
    const storedCustomer = localStorage.getItem('customer');
    const storedStore = localStorage.getItem('selected_store');

    if (storedToken && storedCustomer) {
      const parsedCustomer = JSON.parse(storedCustomer);
      setToken(storedToken);
      setCustomer(parsedCustomer);
      setIsLoggedIn(true);
      setPaymentAddress(prev => ({ ...prev, firstname: parsedCustomer.firstname, lastname: parsedCustomer.lastname }));
    }

    if (storedStore) {
      setSelectedStore(JSON.parse(storedStore));
    }
  }, []);

  useEffect(() => {
    if (token && customer) {
      localStorage.setItem('customer_token', token);
      localStorage.setItem('customer', JSON.stringify(customer));
      fetchStores();
    } else {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer');
    }
  }, [token, customer]);

  useEffect(() => {
    if (selectedStore) {
      localStorage.setItem('selected_store', JSON.stringify(selectedStore));
      fetchProducts(1);
    } else {
      localStorage.removeItem('selected_store');
    }
  }, [selectedStore]);

  // API Functions
  const fetchProducts = async (page: number) => {
    if (!selectedStore) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products&page=${page}&limit=10&store_id=${selectedStore.store_id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) {
        handleLogout();
        setMessage("Your session has expired. Please log in again.");
        return;
      }
      const data = await response.json();
      setProducts(data ? data.products : []);
      setCurrentPage(page);
    } catch (error: any) {
      setMessage(`Error fetching products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stores`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      const data = await response.json();
      if (data) {
        let storeToSelect = data.find((store: Store) => store.name === 'Weusifix Logistics');
        if (!storeToSelect) {
          storeToSelect = data.find((store: Store) => store.store_id === 0);
        }
        if (storeToSelect) {
          setSelectedStore(storeToSelect);
        }
        setStores(data);
      } else {
        setMessage(data.error || 'Failed to fetch stores');
      }
    } catch (error: any) {
      setMessage(`Error fetching stores: ${error.message || 'An unknown error occurred.'}`);
      console.error('Error fetching stores:', error);
    }
  };

  const fetchOrders = async (page: number) => {
    setIsOrdersLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders&page=${page}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
        setOrdersCurrentPage(data.pagination.current_page);
        setOrdersTotalPages(data.pagination.total_pages);
      } else {
        setMessage(data.error || 'Failed to fetch orders');
      }
    } catch (error: any) {
      setMessage(`Error fetching orders: ${error.message || 'An unknown error occurred.'}`);
      console.error('Error fetching orders:', error);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.customer_token);
        setCustomer(data.customer);
        setMessage('Login successful!');
        setIsLoggedIn(true);
      } else {
        setMessage(data.error.message || 'Login failed: Invalid credentials');
        setPassword('');
        setIsLoggedIn(false);
      }
    } catch (error: any) {
      setMessage(`Error during login: ${error.message || 'An unknown error occurred.'}`);
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Error during logout API call:', error);
    } finally {
      setToken(null);
      setCustomer(null);
      setSelectedStore(null);
      setMessage('Logout successful!');
      setIsLoggedIn(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsPlacingOrder(true);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !customer) return;

    const orderPayload = {
      products: [{ product_id: selectedProduct.product_id, quantity: 1 }],
      customer,
      payment_address: paymentAddress,
      errand_details: errandDetails,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/custom_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Order placed successfully!');
        setIsPlacingOrder(false);
        setSelectedProduct(null);
      } else {
        setMessage(data.error?.message || 'Failed to place order');
      }
    } catch (error: any) {
      setMessage(`Error placing order: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Dexter</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {!isLoggedIn ? (
        <LoginForm 
          handleLogin={handleLogin} 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword} 
        />
      ) : isPlacingOrder && selectedProduct ? (
        <OrderForm 
          selectedProduct={selectedProduct}
          handlePlaceOrder={handlePlaceOrder}
          paymentAddress={paymentAddress}
          setPaymentAddress={setPaymentAddress}
          errandDetails={errandDetails}
          setErrandDetails={setErrandDetails}
          setIsPlacingOrder={setIsPlacingOrder}
        />
      ) : showOrdersScreen ? (
        <OrderList 
          orders={orders} 
          isLoading={isOrdersLoading} 
          currentPage={ordersCurrentPage} 
          totalPages={ordersTotalPages} 
          fetchOrders={fetchOrders} 
          onBack={() => setShowOrdersScreen(false)} 
        />
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {customer?.firstname}!</h2>
          <p className="mb-4">You are logged in.</p>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
          <button 
            onClick={() => { 
              setShowOrdersScreen(true);
              fetchOrders(1);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            View Orders
          </button>

          <StoreInfo selectedStore={selectedStore} stores={stores} />
          <ProductList 
            products={products} 
            isLoading={isLoading} 
            handleSelectProduct={handleSelectProduct} 
            fetchProducts={fetchProducts} 
            currentPage={currentPage} 
          />
        </div>
      )}
    </div>
  );
}

export default App;