import React from 'react';

interface ProductListProps {
  products: any[];
  isLoading: boolean;
  handleSelectProduct: (product: any) => void;
  fetchProducts: (page: number) => void;
  currentPage: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading, handleSelectProduct, fetchProducts, currentPage }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Products</h2>
      {isLoading ? <p>Loading products...</p> : products.length > 0 ? (
        <div>
          <ul className="list-disc pl-5">
            {products.map((product) => (
              <li key={product.product_id} className="text-gray-800 flex justify-between items-center">
                {product.name} - {product.price}
                <button onClick={() => handleSelectProduct(product)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Select</button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between" style={{ display: 'none' }}>
            <button onClick={() => fetchProducts(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">Previous</button>
            <button onClick={() => fetchProducts(currentPage + 1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">Next</button>
          </div>
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
