"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth";

export type StaffSearchParams = {
  search?: string;
  department?: string;
  joinDateFrom?: string;
  joinDateTo?: string;
  isActive?: string;
  limit?: number;
  skip?: number;
};

// ----------------------------GET STAFF ----------------------------------------------------------------------------------
export const getStaff = async ({
  search,
  department,
  joinDateFrom,
  joinDateTo,
  isActive,
  limit = 10,
  skip = 0,
}: StaffSearchParams) => {
  const where: any = {};

  // Text search
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { middleName: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  // Department filter
  if (department && department !== "all") {
    where.department = department;
  }

  // Join date range filter
  if (joinDateFrom || joinDateTo) {
    where.createdAt = {};
    if (joinDateFrom) {
      where.createdAt.gte = new Date(joinDateFrom);
    }
    if (joinDateTo) {
      where.createdAt.lte = new Date(joinDateTo);
    }
  }

  // Active status filter (from related user)
  if (isActive === "true") {
    where.user = { isActive: true };
  } else if (isActive === "false") {
    where.user = { isActive: false };
  }

  const [staff, staffCount, totalStaff] = await Promise.all([
    prisma.staff.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        department: true,
        phone: true,
        createdAt: true,
        user: {
          select: {
            id: true,

            isActive: true,
            role: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.staff.count({ where }),
    prisma.staff.count(),
  ]);

  return {
    staff,
    staffCount,
    totalStaff,
  };
};

// ----------------------------GET SINGLE STAFF ----------------------------------------------------------------------------------
export const getStaffById = async (staffId: string) => {
  return await prisma.staff.findUnique({
    where: { id: staffId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          image: true,
        },
      },
      attendances: true,
    },
  });
};

// -------------------------------- GET FORM DATA FOR STAFF -----------------------------------
export const getStaffFormData = async (staffId: string) => {
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      department: true,
      phone: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return staff;
};

// ----------------------------ADD STAFF ----------------------------------------------------------------------------------
export const addStaff = async (data: {
  firstName: string;
  middleName?: string;
  lastName: string;
  department: string;
  phone?: string;
  user: {
    name: string;
    email: string;
    password: string;
  };
}) => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.user.email },
    });
    if (existingUser) {
      return {
        success: false,
        message: "User with that email already exists.",
      };
    }
    // Hash password
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.default.hash(data.user.password, 10);
    // Create user and staff
    await prisma.staff.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        department: data.department,
        phone: data.phone,
        user: {
          create: {
            name: data.user.name,
            email: data.user.email,
            password: hashedPassword,
          },
        },
      },
    });
    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// ----------------------------UPDATE STAFF ----------------------------------------------------------------------------------
export const updateStaff = async (
  staffId: string,
  data: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
    user?: {
      name?: string;
      email?: string;
    };
  },
) => {
  try {
    // Update staff fields
    const staffUpdate: any = { ...data };
    delete staffUpdate.user;
    await prisma.staff.update({
      where: { id: staffId },
      data: staffUpdate,
    });
    // Update user if provided
    if (data.user) {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: { userId: true },
      });
      if (staff?.userId) {
        const userUpdate: any = { ...data.user };
        await prisma.user.update({
          where: { id: staff.userId },
          data: userUpdate,
        });
      }
    }
    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// ----------------------------DELETE STAFF ----------------------------------------------------------------------------------
export const deleteStaff = async (staffId: string) => {
  try {
    await prisma.staff.delete({ where: { id: staffId } });
    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// ----------------------------DELETE MULTIPLE STAFF ----------------------------------------------------------------------------------
export const deleteStaffBulk = async (staffIds: string[]) => {
  try {
    await prisma.staff.deleteMany({ where: { id: { in: staffIds } } });
    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// ----------------------------TOGGLE STAFF STATUS ----------------------------------------------------------------------------------
export const toggleStaffStatus = async (staffId: string) => {
  try {
    const staff = await prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) {
      return { success: false, message: "Staff not found" };
    }
    const user = await prisma.user.findUnique({ where: { id: staff.userId! } });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });
    revalidatePath("/staff");
    return { success: true, isActive: updatedUser.isActive };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
