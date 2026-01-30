import { useState } from "react";
import api from "@/api/axios";

function AddAddressModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/addresses/", form);
      onSuccess();
      onClose();
    } catch {
      alert("Failed to save address");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Address</h2>

        {Object.keys(form).map(field => (
          <input
            key={field}
            name={field}
            placeholder={field.replace("_", " ")}
            value={form[field]}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mb-3"
          />
        ))}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="text-slate-500 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAddressModal;
