"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Attendance stats for today
  const [
    totalStaff,
    totalUsers,
    totalAttendance,
    presentToday,
    absentToday,
    lateToday,
    unreadNotifications,
    activeUsers,
  ] = await Promise.all([
    prisma.staff.count(),
    prisma.user.count(),
    prisma.attendance.count(),
    prisma.attendance.count({
      where: {
        checkIn: { gte: today, lt: tomorrow },
        status: "Present",
      },
    }),
    prisma.attendance.count({
      where: {
        checkIn: { gte: today, lt: tomorrow },
        status: "Absent",
      },
    }),
    prisma.attendance.count({
      where: {
        checkIn: { gte: today, lt: tomorrow },
        status: "Late",
      },
    }),
    prisma.notification.count({
      where: { isRead: false },
    }),
    prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return [
    {
      title: "Total Staff",
      value: totalStaff.toString(),
      icon: "users",
      color: "bg-brand text-white",
    },
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: "users",
      color: "bg-brand-yellow text-white",
    },
    {
      title: "Attendance Records",
      value: totalAttendance.toString(),
      icon: "package",
      color: "bg-brand-pink text-white",
    },
    {
      title: "Present Today",
      value: presentToday.toString(),
      icon: "dollar-sign",
      color: "bg-green-600 text-white",
    },
    {
      title: "Absent Today",
      value: absentToday.toString(),
      icon: "shopping-cart",
      color: "bg-red-600 text-white",
    },
    {
      title: "Late Today",
      value: lateToday.toString(),
      icon: "package",
      color: "bg-yellow-500 text-white",
    },
    {
      title: "Unread Notifications",
      value: unreadNotifications.toString(),
      icon: "package",
      color: "bg-blue-600 text-white",
    },
    {
      title: "Active Users (30d)",
      value: activeUsers.toString(),
      icon: "users",
      color: "bg-gray-800 text-white dark:bg-gray-700",
    },
  ];
}
