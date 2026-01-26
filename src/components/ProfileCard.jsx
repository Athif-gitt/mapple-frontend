export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
          {profile.full_name[0]}
        </div>

        <div>
          <h2 className="text-white text-xl font-semibold">
            {profile.full_name}
          </h2>
          <p className="text-slate-300 text-sm">
            {profile.email}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-500">Member since</p>
        <p className="font-medium">
          {new Date(profile.joined_at).toDateString()}
        </p>
      </div>
    </div>
  );
}
