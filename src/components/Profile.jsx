import { useEffect, useState } from "react";
import { fetchProfileDashboard } from "@/api/profile";
import ProfileCard from "./ProfileCard";
import ProfileStats from "./ProfileStats";
import RecentOrders from "./RecentOrders";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileDashboard()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-semibold">
          Welcome back,{" "}
          <span className="text-slate-500">
            {data.profile.full_name}
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileCard profile={data.profile} />
            <RecentOrders orders={data.recent_orders} />
          </div>

          {/* RIGHT */}
          <ProfileStats stats={data.stats} />
        </div>

      </div>
    </div>
  );
}
