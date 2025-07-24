"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getStaff, markAttendance } from "@/lib/actions/admin/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceStatus } from "@prisma/client";
import { UserCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { z } from "zod";

const markAttendanceSchema = z.object({
  staffId: z.string().min(1, "Please select a staff member"),
  status: z.enum(["Present", "Late", "Absent"]),
  checkIn: z.string().min(1, "Check-in time is required"),
  checkOut: z.string().optional(),
  notes: z.string().optional(),
});

type MarkAttendanceType = z.infer<typeof markAttendanceSchema>;

const MarkAttendance = () => {
  const [modal, setModal] = useState(false);
  const [staffList, setStaffList] = useState<
    Array<{ id: string; name: string; department: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<MarkAttendanceType>({
    resolver: zodResolver(markAttendanceSchema),
    defaultValues: {
      checkIn: new Date().toTimeString().slice(0, 5),
    },
  });

  // Load staff list when modal opens
  const loadStaffList = async () => {
    try {
      setLoading(true);
      const data = await getStaff();
      setStaffList(
        data.map((staff) => ({
          id: staff.id,
          name: staff?.user?.name || "Unknown",
          department: staff.department,
        })),
      );
    } catch (error) {
      toast.error("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setModal(false);
    form.reset({
      staffId: "",
      status: "Present",
      checkIn: new Date().toTimeString().slice(0, 5),
      checkOut: "",
      notes: "",
    });
  };

  const onSubmit = async (values: MarkAttendanceType) => {
    try {
      const today = new Date();
      const checkInDateTime = new Date(
        `${today.toDateString()} ${values.checkIn}`,
      );
      let checkOutDateTime = null;

      if (values.checkOut) {
        checkOutDateTime = new Date(
          `${today.toDateString()} ${values.checkOut}`,
        );
      }

      const result = await markAttendance({
        staffId: values.staffId,
        status: values.status as AttendanceStatus,
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
        notes: values.notes || null,
      });

      if (result.success) {
        toast.success("Attendance marked successfully!");
        onReset();
      } else {
        toast.error(result.message || "Failed to mark attendance");
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModal(open);
    if (open) {
      loadStaffList();
    }
  };

  return (
    <Dialog open={modal} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Mark Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Mark Attendance
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Record attendance for staff members
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Member</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting || loading}
                    >
                      <SelectTrigger className="w-full bg-transparent">
                        <SelectValue placeholder="Select Staff Member" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            Loading staff...
                          </SelectItem>
                        ) : (
                          staffList.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name} - {staff.department}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full bg-transparent">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Time</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      className="block bg-transparent"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Time (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      className="block bg-transparent"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes..."
                      className="resize-none bg-transparent"
                      rows={3}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <ImSpinner2 className="animate-spin" />
                    Marking...
                  </div>
                ) : (
                  "Mark Attendance"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAttendance;
