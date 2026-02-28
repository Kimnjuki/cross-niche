import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Leaderboard() {
  const leaderboard = useQuery(api.gamification.getByUser, { limit: 10 });
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4">🏆 Top Contributors</h3>
      <div className="space-y-4">
        {leaderboard?.map((user, index) => (
          <div
            key={user._id}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded"
          >
            <div className="text-2xl font-bold text-gray-400">
              #{index + 1}
            </div>
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="flex-1">
              <div className="font-bold">{user.displayName}</div>
              <div className="text-sm text-gray-500">
                Level {user.level} • {user.xp.toLocaleString()} XP
              </div>
            </div>
            {user.badges.length > 0 && (
              <div className="flex gap-1">
                {user.badges.slice(0, 3).map((badge) => (
                  <span key={badge} className="text-2xl">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
