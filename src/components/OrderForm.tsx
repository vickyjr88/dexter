import React from 'react';

interface OrderFormProps {
  selectedProduct: any;
  handlePlaceOrder: (e: React.FormEvent) => void;
  paymentAddress: any;
  setPaymentAddress: (address: any) => void;
  errandDetails: any;
  setErrandDetails: (details: any) => void;
  setIsPlacingOrder: (isPlacing: boolean) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ selectedProduct, handlePlaceOrder, paymentAddress, setPaymentAddress, errandDetails, setErrandDetails, setIsPlacingOrder }) => {
  return (
    <form onSubmit={handlePlaceOrder} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Place Order for {selectedProduct.name}</h2>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Payment Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <input value={paymentAddress.firstname} onChange={e => setPaymentAddress({...paymentAddress, firstname: e.target.value})} placeholder="First Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={paymentAddress.lastname} onChange={e => setPaymentAddress({...paymentAddress, lastname: e.target.value})} placeholder="Last Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={paymentAddress.address_1} onChange={e => setPaymentAddress({...paymentAddress, address_1: e.target.value})} placeholder="Address" className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={paymentAddress.city} onChange={e => setPaymentAddress({...paymentAddress, city: e.target.value})} placeholder="City" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={paymentAddress.zone} onChange={e => setPaymentAddress({...paymentAddress, zone: e.target.value})} placeholder="Zone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={paymentAddress.country} onChange={e => setPaymentAddress({...paymentAddress, country: e.target.value})} placeholder="Country" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={paymentAddress.postcode} onChange={e => setPaymentAddress({...paymentAddress, postcode: e.target.value})} placeholder="Postcode" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Errand Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <input value={errandDetails.pickup_location} onChange={e => setErrandDetails({...errandDetails, pickup_location: e.target.value})} placeholder="Pickup Location" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <input value={errandDetails.dropoff_location} onChange={e => setErrandDetails({...errandDetails, dropoff_location: e.target.value})} placeholder="Dropoff Location" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        <textarea value={errandDetails.comment} onChange={e => setErrandDetails({...errandDetails, comment: e.target.value})} placeholder="Comment" className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>

      <div className="mt-6 flex justify-end" style={{ display: 'none' }}>
        <button type="button" onClick={() => setIsPlacingOrder(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">Cancel</button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">Place Order</button>
      </div>
    </form>
  );
};

export default OrderForm;
