import { AttendanceFilters } from "@/components/admin/attendance/attendance-filters";
import { AttendanceHeader } from "@/components/admin/attendance/attendance-header";
import { AttendanceStats } from "@/components/admin/attendance/attendance-stats";
import { AttendanceTable } from "@/components/admin/attendance/attendance-table";
import { getAttendance } from "@/lib/actions/admin/attendance";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Attendance Management",
};

type SearchParams = {
  searchParams: {
    search?: string;
    department?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  };
};

const AttendancePage = async ({ searchParams }: SearchParams) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const limit = 10;
  const skip = (Number(searchParams.page || "1") - 1) * limit || 0;

  const { attendance, attendanceCount, totalAttendance } = await getAttendance({
    search: searchParams.search,
    department: searchParams.department,
    status: searchParams.status,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    limit,
    skip,
  });

  return (
    <div className="space-y-6">
      <AttendanceHeader user={user} />
      <AttendanceStats />
      <AttendanceFilters />
      <AttendanceTable
        attendance={attendance}
        attendanceCount={attendanceCount}
        totalAttendance={totalAttendance}
        totalPages={Math.ceil(attendanceCount / limit)}
        offset={skip}
        user={user}
      />
    </div>
  );
};

export default AttendancePage;
