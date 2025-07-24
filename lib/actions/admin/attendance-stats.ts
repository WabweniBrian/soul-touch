"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { startOfMonth, endOfMonth, subDays } from "date-fns";

// Utility function to calculate trend
function calculateTrend(current: number, previous: number) {
  if (previous === 0) return { change: "100%", trend: "up" }; // Avoid division by zero
  const percentageChange = ((current - previous) / previous) * 100;
  return {
    change: `${percentageChange.toFixed(1)}%`,
    trend: current > previous ? "up" : current < previous ? "down" : "neutral",
  };
}

export async function getAttendanceStats(dateFrom?: string, dateTo?: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    // Dates for current and previous periods
    const now = new Date();
    const firstDayCurrentMonth = startOfMonth(now);
    const lastDayPreviousMonth = endOfMonth(subDays(now, 30));

    // Build date filter
    const dateFilter: any = {};
    if (dateFrom || dateTo) {
      dateFilter.checkIn = {};
      if (dateFrom) {
        dateFilter.checkIn.gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.checkIn.lte = new Date(`${dateTo}T23:59:59.999Z`);
      }
    }

    // Get attendance statistics for current period
    const [totalAttendance, presentCount, lateCount, absentCount] =
      await Promise.all([
        prisma.attendance.count({ where: dateFilter }),
        prisma.attendance.count({
          where: { ...dateFilter, status: "Present" },
        }),
        prisma.attendance.count({ where: { ...dateFilter, status: "Late" } }),
        prisma.attendance.count({ where: { ...dateFilter, status: "Absent" } }),
      ]);

    // Get attendance statistics for previous period
    const previousDateFilter = {
      checkIn: {
        gte: subDays(firstDayCurrentMonth, 30),
        lte: lastDayPreviousMonth,
      },
    };
    const [
      previousTotalAttendance,
      previousPresentCount,
      previousLateCount,
      previousAbsentCount,
    ] = await Promise.all([
      prisma.attendance.count({ where: previousDateFilter }),
      prisma.attendance.count({
        where: { ...previousDateFilter, status: "Present" },
      }),
      prisma.attendance.count({
        where: { ...previousDateFilter, status: "Late" },
      }),
      prisma.attendance.count({
        where: { ...previousDateFilter, status: "Absent" },
      }),
    ]);

    // Calculate trends
    const presentTrend = calculateTrend(presentCount, previousPresentCount);
    const lateTrend = calculateTrend(lateCount, previousLateCount);
    const absentTrend = calculateTrend(absentCount, previousAbsentCount);

    // Get department-wise statistics
    const departmentStats = await prisma.attendance.groupBy({
      by: ["status"],
      where: dateFilter,
      _count: {
        status: true,
      },
    });

    return [
      {
        title: "Total Attendance",
        value: totalAttendance.toString(),
        iconType: "users",
        color: "bg-blue-500",
      },
      {
        title: "Present",
        value: presentCount.toString(),
        change: presentTrend.change,
        trend: presentTrend.trend,
        iconType: "user-check",
        color: "bg-green-500",
      },
      {
        title: "Late",
        value: lateCount.toString(),
        change: lateTrend.change,
        trend: lateTrend.trend,
        iconType: "clock",
        color: "bg-yellow-500",
      },
      {
        title: "Absent",
        value: absentCount.toString(),
        change: absentTrend.change,
        trend: absentTrend.trend,
        iconType: "user-x",
        color: "bg-red-500",
      },
    ];
  } catch (error) {
    console.error("Error fetching attendance statistics:", error);
    return [];
  }
}
