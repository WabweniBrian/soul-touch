"use server";

import { prisma } from "@/lib/prisma";

export async function getStaffStats() {
  // Calculate stats for staff
  const totalStaff = await prisma.staff.count();
  const activeStaff = await prisma.staff.count({
    where: { user: { isActive: true } },
  });
  const inactiveStaff = await prisma.staff.count({
    where: { user: { isActive: false } },
  });
  // New staff this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newStaff = await prisma.staff.count({
    where: { createdAt: { gte: startOfMonth } },
  });

  return [
    {
      title: "Total Staff",
      value: totalStaff,
      iconType: "users",
      color: "bg-brand text-white",
    },
    {
      title: "Active Staff",
      value: activeStaff,
      iconType: "user-check",
      color: "bg-green-600 text-white",
    },
    {
      title: "Inactive Staff",
      value: inactiveStaff,
      iconType: "user-x",
      color: "bg-red-600 text-white",
    },
    {
      title: "New Staff (This Month)",
      value: newStaff,
      iconType: "user-plus",
      color: "bg-brand-yellow text-white",
    },
  ];
}
