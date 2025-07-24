import { DashboardStats } from "@/components/admin/home/dashboard-stats";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
};

const AdminDashboard = async ({
  searchParams,
}: {
  searchParams: { year?: string };
}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const currentYear = new Date().getFullYear();
  const year = searchParams.year
    ? Number.parseInt(searchParams.year)
    : currentYear;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Welcome back, {user.name.split(" ")[0] || user.name}
        </p>
      </div>

      <DashboardStats />
    </div>
  );
};

export default AdminDashboard;
