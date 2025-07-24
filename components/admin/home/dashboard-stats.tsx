import { Card, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions/admin/dashboard-stats";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const IconMap = {
  "dollar-sign": DollarSign,
  package: Package,
  "shopping-cart": ShoppingCart,
  users: Users,
};

export const DashboardStats = async () => {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const IconComponent = IconMap[stat.icon as keyof typeof IconMap];
        return (
          <div key={index}>
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-4">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className="mt-3 text-2xl font-bold">{stat.value}</div>
                </div>
                <div
                  className={`flex w-16 items-center justify-center ${stat.color}`}
                >
                  <IconComponent size={24} />
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
