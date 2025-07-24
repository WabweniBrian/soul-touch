"use client";

import { motion } from "framer-motion";
import { QuickCheckIn } from "./quick-checkin";
import MarkAttendance from "./mark-attendance-modal";
import ExportAttendance from "./export-attendance";
import { SessionUser } from "@/types";

interface AttendanceHeaderProps {
  user: SessionUser;
}

export const AttendanceHeader = ({ user }: AttendanceHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Attendance Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track and manage staff attendance records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickCheckIn />
          <MarkAttendance />
          {user?.role === "Admin" && <ExportAttendance />}
        </div>
      </div>
    </motion.div>
  );
};
