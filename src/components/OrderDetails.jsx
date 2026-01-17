import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import Nav from "./Nav";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await api.get(
        `/orders/${id}/`
      );
      setOrder(res.data);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div><Nav /> <p className="p-0">Loading...</p> </div>;

  return (
    <div className="p-0 space-y-4">
      <Nav />
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p>Status: <span className="font-semibold">{order.status}</span></p>
      <p>Total: <span className="font-semibold">${order.total_amount}</span></p>
      <p>Date: {new Date(order.created_at).toLocaleString()}</p>

      <h2 className="text-xl font-bold mt-4">Items</h2>
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center bg-gray-100 p-3 rounded shadow">
            <img src={item.product.image} className="h-14 w-14 mr-4" />
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p>${item.price} × {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
