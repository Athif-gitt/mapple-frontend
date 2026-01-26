import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

function ProductCard({ image, name, description, price, productId }) {
  return (
    <Link
      to="/payment"
      state={{ type: "single", productId }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-50 flex items-center justify-center p-6">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 mb-1">
          {name}
        </h4>

        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-xs text-slate-400 uppercase">Price</span>
            <div className="text-lg font-bold text-slate-900">
              {formatCurrency(price)}
            </div>
          </div>

          <span className="bg-indigo-600 text-white rounded-full px-4 py-2 text-sm font-semibold">
            Buy Now
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
