import React, { useState, useEffect } from 'react';

const API_BASE_URL = '/api';

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

function App() {
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

  useEffect(() => {
    const storedToken = localStorage.getItem('customer_token');
    const storedCustomer = localStorage.getItem('customer');
    const storedStore = localStorage.getItem('selected_store');

    if (storedToken && storedCustomer) {
      setToken(storedToken);
      setCustomer(JSON.parse(storedCustomer));
      setIsLoggedIn(true);
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

  const fetchProducts = async (page: number) => {
    if (!selectedStore) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products&page=${page}&limit=10&store_id=${selectedStore.store_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data) {
        setProducts(data.products);
        setCurrentPage(page);
      } else {
        setMessage(data.error || 'Failed to fetch products');
      }
    } catch (error: any) {
      setMessage(`Error fetching products: ${error.message || 'An unknown error occurred.'}`);
      console.error('Error fetching products:', error);
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

      if (response.status === 401) {
        setToken(null);
        setCustomer(null);
        setIsLoggedIn(false);
        setMessage("Your session has expired. Please log in again.");
        return;
      }

      const data = await response.json();
      if (data) {
        let storeToSelect = data.find((store: Store) => store.name === 'Weusifix Logistics');
        if (!storeToSelect) {
          storeToSelect = data.find((store: Store) => store.store_id === 2);
        }
        if (storeToSelect) {
          setSelectedStore(storeToSelect);
        }
        setStores(data);
      } else {
        setMessage(data || 'Failed to fetch stores');
      }
    } catch (error: any) {
      setMessage(`Error fetching stores: ${error.message || 'An unknown error occurred.'}`);
      console.error('Error fetching stores:', error);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Dexter</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {customer?.firstname}!</h2>
          <p className="mb-4">You are logged in.</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>

          {selectedStore && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Selected Store</h2>
              <p className="text-gray-800">{selectedStore.name}</p>
            </div>
          )}

          <h2 className="text-2xl font-semibold mt-8 mb-4">Products</h2>
          {isLoading ? (
            <p>Loading products...</p>
          ) : products.length > 0 ? (
            <div>
              <ul className="list-disc pl-5">
                {products.map((product) => (
                  <li key={product.product_id} className="text-gray-800">{product.name} - {product.price}</li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between" style={{ display: 'none' }}>
                <button
                  onClick={() => fetchProducts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchProducts(currentPage + 1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No products found.</p>
          )}

          <h2 className="text-2xl font-semibold mt-8 mb-4">All Stores</h2>
          {stores.length > 0 ? (
            <ul className="list-disc pl-5">
              {stores.map((store) => (
                <li key={store.store_id} className="text-gray-800">{store.name}</li>
              ))}
            </ul>
          ) : (
            <p>No stores found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
