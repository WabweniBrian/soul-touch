"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Attendance, Staff, UserRole } from "@prisma/client";
import { useState } from "react";

type TStaff = Staff & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    isActive: boolean;
    role: UserRole;
  } | null;
  attendances: Attendance[];
};

interface StaffDetailsModalProps {
  staff: TStaff;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const StaffDetailsModal = ({
  staff,
  onOpenChange,
  open,
}: StaffDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {staff.firstName} {staff.middleName ? staff.middleName + " " : ""}
              {staff.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Staff ID: {staff.id}
            </p>
          </div>
        </div>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-brand text-brand"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "attendance"
                ? "border-b-2 border-brand text-brand"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>
        </div>
        <div className="p-4">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <span className="font-semibold">Full Name:</span>{" "}
                  {staff.firstName}{" "}
                  {staff.middleName ? staff.middleName + " " : ""}
                  {staff.lastName}
                </div>
                <div>
                  <span className="font-semibold">Department:</span>{" "}
                  {staff.department}
                </div>
                <div>
                  <span className="font-semibold">Phone:</span>{" "}
                  {staff.phone || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Join Date:</span>{" "}
                  {new Date(staff.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  {staff?.user?.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Role:</span>{" "}
                  {staff?.user?.role || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold">User Email:</span>{" "}
                  {staff?.user?.email || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <span className="font-semibold">Attendance Summary:</span>
                <div className="mt-2 flex gap-4">
                  <div className="rounded bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Present:{" "}
                    {
                      staff.attendances.filter((a) => a.status === "Present")
                        .length
                    }
                  </div>
                  <div className="rounded bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    Late:{" "}
                    {
                      staff.attendances.filter((a) => a.status === "Late")
                        .length
                    }
                  </div>
                  <div className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                    Absent:{" "}
                    {
                      staff.attendances.filter((a) => a.status === "Absent")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "attendance" && (
            <div>
              <h3 className="mb-2 font-semibold">Recent Attendance Records</h3>
              {staff.attendances && staff.attendances.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Check-In</th>
                        <th className="p-2 text-left">Check-Out</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.attendances
                        .sort(
                          (a, b) =>
                            new Date(b.checkIn).getTime() -
                            new Date(a.checkIn).getTime(),
                        )
                        .slice(0, 10)
                        .map((a) => (
                          <tr
                            key={a.id}
                            className="border-b border-gray-100 dark:border-gray-800"
                          >
                            <td className="p-2">
                              {new Date(a.checkIn).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              {new Date(a.checkIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="p-2">
                              {a.checkOut ? (
                                new Date(a.checkOut).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              ) : (
                                <span className="italic text-gray-400">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              {a.status === "Present" && (
                                <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">
                                  Present
                                </span>
                              )}
                              {a.status === "Late" && (
                                <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-800">
                                  Late
                                </span>
                              )}
                              {a.status === "Absent" && (
                                <span className="rounded bg-red-100 px-2 py-0.5 text-red-800">
                                  Absent
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              {a.notes || (
                                <span className="italic text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="italic text-gray-500">
                  No attendance records found.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsModal;
