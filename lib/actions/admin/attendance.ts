"use server";

import { revalidatePath } from "next/cache";
import { AttendanceStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type GetAttendanceParams = {
  search?: string;
  department?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit: number;
  skip: number;
};

type MarkAttendanceParams = {
  staffId: string;
  status: AttendanceStatus;
  checkIn: Date;
  checkOut?: Date | null;
  notes?: string | null;
};

type QuickCheckInParams = {
  staffId: string;
};

type UpdateAttendanceParams = {
  id: string;
  status?: AttendanceStatus;
  checkIn?: Date;
  checkOut?: Date | null;
  notes?: string | null;
};

// Get attendance records with filtering
export async function getAttendance(params: GetAttendanceParams) {
  try {
    const { search, department, status, dateFrom, dateTo, limit, skip } =
      params;

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.staff = {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { middleName: { contains: search, mode: "insensitive" } },
          { department: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Department filter
    if (department) {
      where.staff = {
        ...where.staff,
        department,
      };
    }

    // Status filter
    if (status) {
      where.status = status as AttendanceStatus;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.checkIn = {};
      if (dateFrom) {
        where.checkIn.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.checkIn.lte = new Date(`${dateTo}T23:59:59.999Z`);
      }
    }

    // Get attendance records
    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            department: true,
          },
        },
        markedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { checkIn: "desc" },
      take: limit,
      skip,
    });

    // Get total count
    const attendanceCount = await prisma.attendance.count({ where });
    const totalAttendance = await prisma.attendance.count();

    return {
      success: true,
      attendance,
      attendanceCount,
      totalAttendance,
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      success: false,
      message: "Failed to fetch attendance records",
      attendance: [],
      attendanceCount: 0,
      totalAttendance: 0,
    };
  }
}

// Mark attendance for a staff member
export async function markAttendance(params: MarkAttendanceParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const { staffId, status, checkIn, checkOut, notes } = params;

    // Check if staff exists
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { user: true },
    });

    if (!staff) {
      return { success: false, message: "Staff member not found" };
    }

    // Check if attendance already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        staffId,
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingAttendance) {
      return { success: false, message: "Attendance already marked for today" };
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        staffId,
        status,
        checkIn,
        checkOut,
        notes,
        markedById: user.id,
      },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    // Create notification for the staff member
    if (staff.user) {
      await createNotification({
        userId: staff.user.id,
        type: "attendance",
        title: "Attendance Marked",
        message: `Your attendance has been marked as ${status} for ${checkIn.toDateString()}`,
      });
    }

    // Create notification for admin
    await createNotification({
      type: "attendance",
      title: "Attendance Marked",
      message: `${attendance.staff.firstName} ${attendance.staff.lastName} marked as ${status}`,
      isAdmin: true,
    });

    revalidatePath("/attendance");
    return { success: true, message: "Attendance marked successfully" };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return { success: false, message: "Failed to mark attendance" };
  }
}

// Quick check-in for staff
export async function quickCheckIn(params: QuickCheckInParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const { staffId } = params;

    // Check if staff exists
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { user: true },
    });

    if (!staff) {
      return { success: false, message: "Staff member not found" };
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        staffId,
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingAttendance) {
      return { success: false, message: "Already checked in today" };
    }

    // Determine status based on time
    const now = new Date();
    const workStart = new Date();
    workStart.setHours(8, 0, 0, 0); // 8:00 AM

    let status: AttendanceStatus = "Present";
    if (now > workStart) {
      status = "Late";
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        staffId,
        status,
        checkIn: now,
        markedById: user.id,
        notes: status === "Late" ? "Late arrival" : null,
      },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    // Create notification for the staff member
    if (staff.user) {
      await createNotification({
        userId: staff.user.id,
        type: "attendance",
        title: "Check-in Successful",
        message: `You have successfully checked in as ${status} at ${now.toLocaleTimeString()}`,
      });
    }

    // Create notification for admin
    await createNotification({
      type: "attendance",
      title: "Staff Check-in",
      message: `${attendance.staff.firstName} ${attendance.staff.lastName} checked in as ${status}`,
      isAdmin: true,
    });

    revalidatePath("/attendance");
    return { success: true, message: `Successfully checked in as ${status}` };
  } catch (error) {
    console.error("Error during quick check-in:", error);
    return { success: false, message: "Failed to check in" };
  }
}

// Update attendance record
export async function updateAttendance(params: UpdateAttendanceParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const { id, status, checkIn, checkOut, notes } = params;

    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    if (!existingAttendance) {
      return { success: false, message: "Attendance record not found" };
    }

    // Build update data
    const updateData: Partial<{
      status: AttendanceStatus;
      checkIn: Date;
      checkOut: Date | null;
      notes: string | null;
    }> = {};

    if (status !== undefined) updateData.status = status;
    if (checkIn !== undefined) updateData.checkIn = checkIn;
    if (checkOut !== undefined) updateData.checkOut = checkOut;
    if (notes !== undefined) updateData.notes = notes;

    // Update attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: updateData,
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    // Create notification for the staff member
    if (existingAttendance.staff.user) {
      await createNotification({
        userId: existingAttendance.staff.user.id,
        type: "attendance",
        title: "Attendance Updated",
        message: `Your attendance record has been updated${status ? ` to ${status}` : ""}`,
      });
    }

    // Create notification for admin
    await createNotification({
      type: "attendance",
      title: "Attendance Updated",
      message: `${existingAttendance.staff.firstName} ${existingAttendance.staff.lastName}'s attendance has been updated`,
      isAdmin: true,
    });

    revalidatePath("/attendance");
    return { success: true, message: "Attendance updated successfully" };
  } catch (error) {
    console.error("Error updating attendance:", error);
    return { success: false, message: "Failed to update attendance" };
  }
}

// Delete attendance record
export async function deleteAttendance(attendanceId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    if (!existingAttendance) {
      return { success: false, message: "Attendance record not found" };
    }

    // Delete attendance record
    await prisma.attendance.delete({
      where: { id: attendanceId },
    });

    // Create notification for the staff member
    if (existingAttendance.staff.user) {
      await createNotification({
        userId: existingAttendance.staff.user.id,
        type: "attendance",
        title: "Attendance Record Deleted",
        message: `Your attendance record for ${existingAttendance.checkIn.toDateString()} has been deleted`,
      });
    }

    // Create notification for admin
    await createNotification({
      type: "attendance",
      title: "Attendance Deleted",
      message: `${existingAttendance.staff.firstName} ${existingAttendance.staff.lastName}'s attendance record has been deleted`,
      isAdmin: true,
    });

    revalidatePath("/attendance");
    return { success: true, message: "Attendance record deleted successfully" };
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return { success: false, message: "Failed to delete attendance record" };
  }
}

// Delete multiple attendance records
export async function deleteMultipleAttendance(attendanceIds: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const results = [];

    for (const id of attendanceIds) {
      const result = await deleteAttendance(id);
      results.push(result);
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return {
      success: true,
      message: `Bulk delete completed: ${successCount} successful, ${failureCount} failed`,
      results,
    };
  } catch (error) {
    console.error("Error in bulk delete attendance:", error);
    return {
      success: false,
      message: "Failed to perform bulk delete attendance",
      results: [],
    };
  }
}

// Bulk mark attendance
export async function bulkMarkAttendance(
  attendanceData: MarkAttendanceParams[],
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const results = [];

    for (const params of attendanceData) {
      const result = await markAttendance(params);
      results.push({
        staffId: params.staffId,
        ...result,
      });
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return {
      success: true,
      message: `Bulk operation completed: ${successCount} successful, ${failureCount} failed`,
      results,
    };
  } catch (error) {
    console.error("Error in bulk mark attendance:", error);
    return {
      success: false,
      message: "Failed to perform bulk attendance marking",
      results: [],
    };
  }
}

export const checkAttendanceCheckOut = async ({
  id,
  checkOut,
}: {
  id: string;
  checkOut: Date;
}) => {
  try {
    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id },
      select: {
        staff: { select: { userId: true, user: { select: { name: true } } } },
      },
    });

    if (!existingAttendance) {
      return { success: false, message: "Attendance record not found" };
    }

    // Update attendance record with check-out time
    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: { checkOut },
    });

    // create notification for the staff member
    createNotification({
      userId: existingAttendance?.staff?.userId || undefined,
      type: "attendance",
      title: "Check-out Successful",
      message: `${existingAttendance?.staff?.user?.name || "Staff"} has successfully checked out at ${checkOut.toLocaleTimeString()}`,
    });

    revalidatePath("/attendance");
    return {
      success: true,
      message: "Check-out time updated successfully",
      updatedAttendance,
    };
  } catch (error) {
    console.error("Error checking out attendance:", error);
    return { success: false, message: "Failed to update check-out time" };
  }
};

const createNotification = async ({
  userId,
  type,
  title,
  message,
  isAdmin,
}: {
  userId?: string;
  type: string;
  title: string;
  message: string;
  isAdmin?: boolean;
}) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        isAdmin,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const getStaff = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // If admin, return all staff, else only the current user's staff record
  if (user.role === "Admin") {
    return await prisma.staff.findMany({
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        department: true,
      },
      orderBy: { lastName: "asc" },
    });
  } else {
    return await prisma.staff.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        department: true,
      },
      orderBy: { lastName: "asc" },
    });
  }
};

export const getStaffMembers = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // If admin, get all staff, else only the current user's staff record
  const staffList =
    user.role === "Admin"
      ? await prisma.staff.findMany({
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            department: true,
          },
          orderBy: { lastName: "asc" },
        })
      : await prisma.staff.findMany({
          where: { userId: user.id },
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            department: true,
          },
          orderBy: { lastName: "asc" },
        });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // For each staff, get last attendance and check if checked in today
  const staffWithAttendance = await Promise.all(
    staffList.map(async (staff) => {
      const lastAttendance = await prisma.attendance.findFirst({
        where: { staffId: staff.id },
        orderBy: { checkIn: "desc" },
      });

      let isCheckedInToday = false;
      let lastCheckIn: Date | null = null;

      if (lastAttendance) {
        lastCheckIn = lastAttendance.checkIn;
        const checkInDate = new Date(lastAttendance.checkIn);
        checkInDate.setHours(0, 0, 0, 0);
        isCheckedInToday = checkInDate.getTime() === today.getTime();
      }

      return {
        ...staff,
        isCheckedInToday,
        lastCheckIn,
      };
    }),
  );

  return staffWithAttendance;
};
