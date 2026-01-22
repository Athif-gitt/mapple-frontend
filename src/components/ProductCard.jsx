import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

function ProductCard({ image, name, description, price, link }) {
    return (
        <Link
            to={link || "#"}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
        >
            <div className="relative overflow-hidden aspect-[4/3] bg-slate-50 flex items-center justify-center p-6">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Overlay gradient only on hover if desired, or keep clean */}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">
                    {name}
                </h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Starting at</span>
                        <span className="text-lg font-bold text-slate-900">{formatCurrency(price)}</span>
                    </div>
                    <span className="bg-indigo-50 text-indigo-600 rounded-full px-4 py-2 text-sm font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer">
                        Buy Now
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
