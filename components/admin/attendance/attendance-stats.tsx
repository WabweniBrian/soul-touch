import { getAttendanceStats } from "@/lib/actions/admin/attendance-stats";
import { UserCheck, UserX, Clock, Users } from "lucide-react";

const IconMap = {
  "user-check": UserCheck,
  "user-x": UserX,
  clock: Clock,
  users: Users,
};

export const AttendanceStats = async () => {
  const stats = await getAttendanceStats();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const IconComponent = IconMap[stat.iconType as keyof typeof IconMap];
        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-950"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>
              <div className={`rounded-lg p-2 ${stat.color} text-white`}>
                <IconComponent size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
