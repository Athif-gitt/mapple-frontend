import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

export default function Confirmation() {
  const location = useLocation();
  const { order } = location.state || { order: [] };
  const navigate = useNavigate()
  const handleNavClick = () => {
    navigate('/orders')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-4">
          ✅ Purchase Confirmed!
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Thank you for your order. Here are your purchase details:
        </p>

        {order.length > 0 ? (
          <ul className="space-y-3">
            {order.map((item) => (
              <li
                key={item.id}
                className="border-b pb-2 flex justify-between text-gray-800"
              >
                <span>{item.name} (x{item.quantity})</span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500 text-center">No items found.</p>
        )}
      </div>
      <button className="w-auto bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mt-5 p-5 cursor-pointer"
        onClick={handleNavClick}>
        Track Order
      </button>
    </div>
  );
}
