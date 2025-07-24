import { StaffFilters } from "@/components/admin/staff/staff-filters";
import { StaffHeader } from "@/components/admin/staff/staff-header";
import { StaffStats } from "@/components/admin/staff/staff-stats";
import { StaffTable } from "@/components/admin/staff/staff-table";
import { getStaff } from "@/lib/actions/admin/staff";

export const metadata = {
  title: "Staff",
};

type SearchParams = {
  searchParams: {
    search?: string;
    department?: string;
    joinDateFrom?: string;
    joinDateTo?: string;
    page?: string;
  };
};

const UsersPage = async ({ searchParams }: SearchParams) => {
  const limit = 10;
  const skip = (Number(searchParams.page || "1") - 1) * limit || 0;

  const { staff, staffCount, totalStaff } = await getStaff({
    search: searchParams.search,
    department: searchParams.department,
    joinDateFrom: searchParams.joinDateFrom,
    joinDateTo: searchParams.joinDateTo,
    limit,
    skip,
  });

  return (
    <div className="space-y-6">
      <StaffHeader />
      <StaffStats />
      <StaffFilters />
      <StaffTable
        staff={staff.map((s) => ({
          id: s.id,
          firstName: s.firstName,
          middleName: s.middleName,
          lastName: s.lastName,
          department: s.department,
          phone: s.phone,
          isActive: s?.user?.isActive || false,
          createdAt: s.createdAt,
        }))}
        staffCount={staffCount}
        totalStaff={totalStaff}
        totalPages={Math.ceil(staffCount / limit)}
        offset={skip}
      />
    </div>
  );
};

export default UsersPage;
