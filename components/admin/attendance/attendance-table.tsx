"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import MainPagination from "@/components/common/main-pagination";
import { AttendanceStatus } from "@prisma/client";
import AttendanceBulkActions from "./attendance-bulk-actions";
import AttendanceActions from "./attendance-actions";
import { SessionUser } from "@/types";

export type AttendanceRecord = {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  status: AttendanceStatus;
  notes: string | null;
  staff: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    department: string;
  };
  markedBy: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
  attendanceCount: number;
  totalAttendance: number;
  totalPages: number;
  offset: number;
  user: SessionUser;
}

export const AttendanceTable = ({
  attendance,
  attendanceCount,
  totalAttendance,
  totalPages,
  offset,
  user,
}: AttendanceTableProps) => {
  const [selectedAttendance, setSelectedAttendance] = useState<string[]>([]);
  const allSelected =
    attendance.length > 0 && selectedAttendance.length === attendance.length;

  const toggleSelectAttendance = (attendanceId: string) => {
    if (selectedAttendance.includes(attendanceId)) {
      setSelectedAttendance(
        selectedAttendance.filter((id) => id !== attendanceId),
      );
    } else {
      setSelectedAttendance([...selectedAttendance, attendanceId]);
    }
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedAttendance([]);
    } else {
      setSelectedAttendance(attendance.map((a) => a.id));
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateHoursWorked = (checkIn: Date, checkOut: Date | null) => {
    if (!checkOut) return "In Progress";

    const hours =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  return (
    <>
      <div className="mb-4 flex justify-end text-xl font-bold md:text-2xl">
        {attendanceCount} attendance record(s)
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
        {selectedAttendance.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedAttendance.length} record
                {selectedAttendance.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            {user?.role === "Admin" && (
              <AttendanceBulkActions
                ids={selectedAttendance}
                setSelectedIds={setSelectedAttendance}
              />
            )}
          </div>
        )}
        <div className="scrollbar-hover overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-attendance"
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all attendance records"
                    />
                    Date
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Department
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Check In
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Check Out
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Marked By
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`select-attendance-${record.id}`}
                          checked={selectedAttendance.includes(record.id)}
                          onCheckedChange={() =>
                            toggleSelectAttendance(record.id)
                          }
                          aria-label={`Select attendance record for ${record.staff.firstName} ${record.staff.lastName}`}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(record.checkIn)}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {record.staff.firstName}{" "}
                          {record.staff.middleName
                            ? record.staff.middleName + " "
                            : ""}
                          {record.staff.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {record.staff.department}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(record.checkIn)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {record.checkOut
                        ? formatTime(record.checkOut)
                        : "Not checked out"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {calculateHoursWorked(record.checkIn, record.checkOut)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(record.status)}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {record.markedBy ? record.markedBy.name : "Self"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <AttendanceActions attendance={record} user={user} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {offset + 1} - {offset + attendance.length} of{" "}
            <span className="font-medium">{totalAttendance}</span> records
          </div>
          <div>{totalPages > 1 && <MainPagination pages={totalPages} />}</div>
        </div>
      </div>
    </>
  );
};
