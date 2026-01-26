export default function ProfileStats({ stats }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-sm font-semibold tracking-wide text-slate-500">
        VAULT SUMMARY
      </h3>

      <Stat label="Orders" value={stats.orders} />
      <Stat label="Wishlist" value={stats.wishlist} />
      <Stat label="Cart Items" value={stats.cart_items} />
      <Stat
        label="Total Spent"
        value={`₹${(stats.total_spent / 100).toLocaleString()}`}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
