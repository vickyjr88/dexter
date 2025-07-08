import React from 'react';

interface StoreInfoProps {
  selectedStore: any;
  stores: any[];
}

const StoreInfo: React.FC<StoreInfoProps> = ({ selectedStore, stores }) => {
  return (
    <div>
      {selectedStore && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Store</h2>
          <p className="text-gray-800"><a href={selectedStore.url}>{selectedStore.name}</a></p>
        </div>
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
  );
};

export default StoreInfo;
