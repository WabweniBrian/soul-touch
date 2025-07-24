"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import MainPagination from "@/components/common/main-pagination";
import StaffBulkActions from "./bulk-actions";
import StaffActions from "./staff-actions";

export type Staff = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  department: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
};

interface StaffTableProps {
  staff: Staff[];
  staffCount: number;
  totalStaff: number;
  totalPages: number;
  offset: number;
}

export const StaffTable = ({
  staff,
  staffCount,
  totalStaff,
  totalPages,
  offset,
}: StaffTableProps) => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const allSelected = staff.length > 0 && selectedStaff.length === staff.length;

  const toggleSelectStaff = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(staff.map((s) => s.id));
    }
  };

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  return (
    <>
      <div className="mb-4 flex justify-end text-xl font-bold md:text-2xl">
        {staffCount} staff member(s)
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
        {selectedStaff.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedStaff.length} staff
                {selectedStaff.length !== 1 ? " members" : " member"} selected
              </span>
            </div>
            <StaffBulkActions
              ids={selectedStaff}
              setSelectedIds={setSelectedStaff}
            />
          </div>
        )}
        <div className="scrollbar-hover overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-staff"
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all staff"
                    />
                    Staff
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Department
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Phone
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Join Date
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    No staff found.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`select-staff-${s.id}`}
                          checked={selectedStaff.includes(s.id)}
                          onCheckedChange={() => toggleSelectStaff(s.id)}
                          aria-label={`Select staff ${s.firstName} ${s.lastName}`}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {s.firstName} {s.middleName ? s.middleName + " " : ""}
                          {s.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {s.department}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {s.phone || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(s.isActive)}`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StaffActions id={s.id} isActive={s.isActive} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {offset + 1} - {offset + staff.length} of{" "}
            <span className="font-medium">{totalStaff}</span> staff
          </div>
          <div>{totalPages > 1 && <MainPagination pages={totalPages} />}</div>
        </div>
      </div>
    </>
  );
};
